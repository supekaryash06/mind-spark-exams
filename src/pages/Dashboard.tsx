import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, FileText, BarChart3, LogOut, Play } from "lucide-react";
import { motion } from "framer-motion";

const mockExams = [
  { id: "1", title: "Data Structures & Algorithms", subject: "Computer Science", duration: 60, questions: 30, status: "available" },
  { id: "2", title: "Database Management Systems", subject: "Computer Science", duration: 45, questions: 25, status: "available" },
  { id: "3", title: "Operating Systems", subject: "Computer Science", duration: 60, questions: 30, status: "completed", score: 85 },
  { id: "4", title: "Computer Networks", subject: "Computer Science", duration: 50, questions: 20, status: "completed", score: 72 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-secondary" />
            <span className="font-heading text-xl font-bold text-foreground">ExamPortal</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10">
              <span className="text-sm font-medium text-secondary">Student</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Here are your upcoming and completed exams.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Available Exams", value: "2", icon: FileText, color: "text-secondary" },
            { label: "Completed", value: "2", icon: BarChart3, color: "text-success" },
            { label: "Avg Score", value: "78%", icon: BarChart3, color: "text-accent" },
            { label: "Total Time", value: "3.5h", icon: Clock, color: "text-muted-foreground" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-5 border border-border shadow-card"
            >
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground font-heading">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Available Exams */}
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">Available Exams</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {mockExams.filter(e => e.status === "available").map((exam, i) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{exam.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{exam.subject}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {exam.duration} min</span>
                <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {exam.questions} Qs</span>
              </div>
              <Link to={`/exam/${exam.id}`}>
                <Button variant="hero" size="sm" className="w-full">
                  <Play className="h-4 w-4 mr-1" /> Start Exam
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Completed */}
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">Completed Exams</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mockExams.filter(e => e.status === "completed").map((exam, i) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border shadow-card"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-heading text-lg font-semibold text-foreground">{exam.title}</h3>
                <span className={`text-sm font-bold ${(exam.score ?? 0) >= 80 ? 'text-success' : 'text-accent'}`}>
                  {exam.score}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{exam.subject}</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${(exam.score ?? 0) >= 80 ? 'bg-success' : 'bg-accent'}`}
                  style={{ width: `${exam.score}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
