import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "./db.js";
import { requireAuth, signToken } from "./auth.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const submitSchema = z.object({
  answers: z.array(z.object({ questionId: z.number(), selectedOption: z.number().int().min(0).max(3).nullable() })),
  durationSeconds: z.number().int().nonnegative().default(0),
});

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", issues: parsed.error.flatten() });
  }

  const { name, email, password } = parsed.data;
  const connection = await pool.getConnection();
  try {
    const [existing] = await connection.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      "INSERT INTO users(full_name, email, password_hash) VALUES(?, ?, ?)",
      [name, email, passwordHash],
    );

    const user = { id: result.insertId, email, full_name: name };
    return res.status(201).json({ token: signToken(user), user: { id: user.id, name: user.full_name, email } });
  } finally {
    connection.release();
  }
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", issues: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const [rows] = await pool.query(
    "SELECT id, full_name, email, password_hash FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  const user = rows[0];
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({ token: signToken(user), user: { id: user.id, name: user.full_name, email: user.email } });
});

app.get("/api/exams", requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT e.id, e.title, e.subject, e.duration_minutes, e.question_count,
            es.score_percent, es.submitted_at
       FROM exams e
       LEFT JOIN exam_submissions es ON es.exam_id = e.id AND es.user_id = ?
      ORDER BY e.id`,
    [req.user.userId],
  );

  const exams = rows.map((row) => ({
    id: String(row.id),
    title: row.title,
    subject: row.subject,
    duration: row.duration_minutes,
    questions: row.question_count,
    status: row.score_percent == null ? "available" : "completed",
    score: row.score_percent ?? undefined,
    submittedAt: row.submitted_at ?? undefined,
  }));

  return res.json({ exams });
});

app.get("/api/exams/:id/questions", requireAuth, async (req, res) => {
  const examId = Number(req.params.id);
  if (Number.isNaN(examId)) {
    return res.status(400).json({ message: "Invalid exam id" });
  }

  const [examRows] = await pool.query(
    "SELECT id, title, duration_minutes, question_count FROM exams WHERE id = ? LIMIT 1",
    [examId],
  );
  const exam = examRows[0];

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  const [questions] = await pool.query(
    `SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
       FROM exam_questions q
      WHERE q.exam_id = ?
      ORDER BY RAND()
      LIMIT ?`,
    [examId, exam.question_count],
  );

  const payload = questions.map((q) => ({
    id: q.id,
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
  }));

  return res.json({ exam: { id: exam.id, title: exam.title, durationMinutes: exam.duration_minutes }, questions: payload });
});

app.post("/api/exams/:id/submissions", requireAuth, async (req, res) => {
  const examId = Number(req.params.id);
  if (Number.isNaN(examId)) {
    return res.status(400).json({ message: "Invalid exam id" });
  }

  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", issues: parsed.error.flatten() });
  }

  const { answers, durationSeconds } = parsed.data;
  const questionIds = answers.map((item) => item.questionId);

  if (!questionIds.length) {
    return res.status(400).json({ message: "No answers provided" });
  }

  const [correctRows] = await pool.query(
    `SELECT id, correct_option
       FROM exam_questions
      WHERE exam_id = ? AND id IN (${questionIds.map(() => "?").join(",")})`,
    [examId, ...questionIds],
  );

  const correctMap = new Map(correctRows.map((row) => [row.id, row.correct_option]));
  let score = 0;
  for (const ans of answers) {
    if (correctMap.get(ans.questionId) === ans.selectedOption) {
      score += 1;
    }
  }

  const percentage = Math.round((score / answers.length) * 100);

  await pool.query(
    `INSERT INTO exam_submissions(user_id, exam_id, score_percent, score_value, total_questions, duration_seconds)
     VALUES(?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE score_percent = VALUES(score_percent), score_value = VALUES(score_value), total_questions = VALUES(total_questions), duration_seconds = VALUES(duration_seconds), submitted_at = CURRENT_TIMESTAMP`,
    [req.user.userId, examId, percentage, score, answers.length, durationSeconds],
  );

  return res.status(201).json({ score, percentage, total: answers.length });
});
