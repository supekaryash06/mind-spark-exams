package com.examportal.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ExamService {
  private final JdbcTemplate jdbcTemplate;

  public ExamService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public List<Map<String, Object>> listExams(Long userId) {
    return jdbcTemplate.queryForList(
        """
        SELECT e.id, e.title, e.subject, e.duration_minutes, e.question_count,
               es.score_percent
        FROM exams e
        LEFT JOIN exam_submissions es ON es.exam_id=e.id AND es.user_id=?
        ORDER BY e.id
        """, userId)
      .stream()
      .map(r -> {
        var m = new java.util.HashMap<String, Object>();
        m.put("id", String.valueOf(r.get("id")));
        m.put("title", r.get("title"));
        m.put("subject", r.get("subject"));
        m.put("duration", r.get("duration_minutes"));
        m.put("questions", r.get("question_count"));
        m.put("status", r.get("score_percent") == null ? "available" : "completed");
        m.put("score", r.get("score_percent"));
        return m;
      })
      .toList();
  }

  public Map<String, Object> examQuestions(Long examId) {
    var exam = jdbcTemplate.queryForMap("SELECT id,title,duration_minutes,question_count FROM exams WHERE id=?", examId);
    Integer count = ((Number) exam.get("question_count")).intValue();
    var questions = jdbcTemplate.queryForList(
      "SELECT id, question_text, option_a, option_b, option_c, option_d FROM exam_questions WHERE exam_id=? ORDER BY RAND() LIMIT ?",
      examId, count);
    List<Map<String, Object>> payload = new ArrayList<>();
    for (var q : questions) {
      payload.add(Map.of(
        "id", q.get("id"),
        "question", q.get("question_text"),
        "options", List.of(q.get("option_a"), q.get("option_b"), q.get("option_c"), q.get("option_d"))
      ));
    }
    return Map.of("exam", Map.of("id", exam.get("id"), "title", exam.get("title"), "durationMinutes", exam.get("duration_minutes")), "questions", payload);
  }

  public Map<String, Object> submit(Long userId, Long examId, List<Map<String, Object>> answers, Integer durationSeconds) {
    int score = 0;
    for (var ans : answers) {
      Long qid = ((Number) ans.get("questionId")).longValue();
      Object selectedObj = ans.get("selectedOption");
      Integer selected = selectedObj == null ? null : ((Number) selectedObj).intValue();
      Integer correct = jdbcTemplate.queryForObject("SELECT correct_option FROM exam_questions WHERE exam_id=? AND id=?", Integer.class, examId, qid);
      if (selected != null && selected.equals(correct)) score++;
    }
    int total = answers.size();
    int percentage = total == 0 ? 0 : (int) Math.round((score * 100.0) / total);
    jdbcTemplate.update(
      """
      INSERT INTO exam_submissions(user_id, exam_id, score_percent, score_value, total_questions, duration_seconds)
      VALUES(?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE score_percent=VALUES(score_percent), score_value=VALUES(score_value), total_questions=VALUES(total_questions), duration_seconds=VALUES(duration_seconds), submitted_at=CURRENT_TIMESTAMP
      """, userId, examId, percentage, score, total, durationSeconds == null ? 0 : durationSeconds);
    return Map.of("score", score, "percentage", percentage, "total", total);
  }
}
