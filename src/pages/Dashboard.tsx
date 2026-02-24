import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { clearSession, fetchExams, getCurrentUser } from "@/lib/api";

type Exam = { id: string; title: string; subject: string; duration: number; questions: number; status: string; score?: number };

const Dashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchExams();
        setExams(data.exams);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load exams");
        clearSession();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [navigate, user]);

  const availableExams = exams.filter((exam) => exam.status === "available");
  const completedExams = exams.filter((exam) => exam.status === "completed");
  const avgScore = useMemo(() => {
    if (!completedExams.length) return 0;
    return Math.round(completedExams.reduce((sum, exam) => sum + (exam.score ?? 0), 0) / completedExams.length);
  }, [completedExams]);

  const totalTimeHours = useMemo(
    () => (completedExams.reduce((sum, exam) => sum + exam.duration, 0) / 60).toFixed(1),
    [completedExams],
  );

  const onLogout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="text-lg font-bold text-primary">📝 ExamPortal</Link>
          <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, {user?.name ?? "Student"}!</h1>
        <p className="text-muted-foreground mb-8">Here are your upcoming and completed exams.</p>
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Available", value: `${availableExams.length}` },
            { label: "Completed", value: `${completedExams.length}` },
            { label: "Avg Score", value: `${avgScore}%` },
            { label: "Total Time", value: `${totalTimeHours}h` },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-foreground">{loading ? "..." : s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Available Exams</h2>
        <div className="space-y-3 mb-8">
          {availableExams.map((exam) => (
            <div key={exam.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{exam.title}</h3>
                <p className="text-sm text-muted-foreground">{exam.duration} min • {exam.questions} questions</p>
              </div>
              <Link to={`/exam/${exam.id}`}>
                <Button size="sm">Start</Button>
              </Link>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Completed Exams</h2>
        <div className="space-y-3">
          {completedExams.map((exam) => (
            <div key={exam.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{exam.title}</h3>
                <p className="text-sm text-muted-foreground">{exam.duration} min • {exam.questions} questions</p>
              </div>
              <span className={`text-sm font-bold ${(exam.score ?? 0) >= 80 ? "text-success" : "text-primary"}`}>
                {exam.score}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
