import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mockExams = [
  { id: "1", title: "Data Structures & Algorithms", subject: "Computer Science", duration: 60, questions: 30, status: "available" },
  { id: "2", title: "Database Management Systems", subject: "Computer Science", duration: 45, questions: 25, status: "available" },
  { id: "3", title: "Operating Systems", subject: "Computer Science", duration: 60, questions: 30, status: "completed", score: 85 },
  { id: "4", title: "Computer Networks", subject: "Computer Science", duration: 50, questions: 20, status: "completed", score: 72 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted">
      {/* Navbar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="text-lg font-bold text-primary">📝 ExamPortal</Link>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>Logout</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, Student!</h1>
        <p className="text-muted-foreground mb-8">Here are your upcoming and completed exams.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Available", value: "2" },
            { label: "Completed", value: "2" },
            { label: "Avg Score", value: "78%" },
            { label: "Total Time", value: "3.5h" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Available Exams */}
        <h2 className="text-lg font-bold text-foreground mb-3">Available Exams</h2>
        <div className="space-y-3 mb-8">
          {mockExams.filter(e => e.status === "available").map((exam) => (
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

        {/* Completed Exams */}
        <h2 className="text-lg font-bold text-foreground mb-3">Completed Exams</h2>
        <div className="space-y-3">
          {mockExams.filter(e => e.status === "completed").map((exam) => (
            <div key={exam.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{exam.title}</h3>
                <p className="text-sm text-muted-foreground">{exam.duration} min • {exam.questions} questions</p>
              </div>
              <span className={`text-sm font-bold ${(exam.score ?? 0) >= 80 ? 'text-success' : 'text-primary'}`}>
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
