import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const mockQuestions = [
  { id: 1, question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
  { id: 2, question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correct: 1 },
  { id: 3, question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"], correct: 0 },
  { id: 4, question: "Which sorting algorithm has the best average case?", options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"], correct: 2 },
  { id: 5, question: "What is a primary key?", options: ["A foreign reference", "A unique identifier", "An index", "A constraint"], correct: 1 },
  { id: 6, question: "Which protocol is used for web browsing?", options: ["FTP", "SMTP", "HTTP", "TCP"], correct: 2 },
  { id: 7, question: "What is polymorphism in OOP?", options: ["Data hiding", "Multiple forms", "Single inheritance", "Data binding"], correct: 1 },
  { id: 8, question: "What is the purpose of an operating system?", options: ["Compile code", "Manage resources", "Browse internet", "Store files"], correct: 1 },
  { id: 9, question: "Which layer handles routing in OSI model?", options: ["Transport", "Network", "Data Link", "Session"], correct: 1 },
  { id: 10, question: "What is normalization in databases?", options: ["Adding redundancy", "Removing redundancy", "Creating indexes", "Deleting tables"], correct: 1 },
];

const EXAM_DURATION = 30 * 60; // 30 minutes

const ExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setShowSubmitDialog(false);
  }, []);

  const selectAnswer = (qIdx: number, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const toggleFlag = (qIdx: number) => {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(qIdx) ? next.delete(qIdx) : next.add(qIdx);
      return next;
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const score = mockQuestions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const percentage = Math.round((score / mockQuestions.length) * 100);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border max-w-md w-full text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold font-heading ${percentage >= 60 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {percentage}%
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Exam Completed!</h1>
          <p className="text-muted-foreground mb-6">You scored {score} out of {mockQuestions.length} questions correctly.</p>
          <div className="space-y-3 text-sm text-left mb-8">
            {mockQuestions.map((q, i) => (
              <div key={q.id} className={`p-3 rounded-lg border ${answers[i] === q.correct ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                <p className="font-medium text-foreground text-xs mb-1">Q{i + 1}: {q.question}</p>
                <p className="text-xs">
                  Your answer: <span className="font-medium">{q.options[answers[i]] ?? "Not answered"}</span>
                  {answers[i] !== q.correct && <span className="text-success ml-2">✓ {q.options[q.correct]}</span>}
                </p>
              </div>
            ))}
          </div>
          <Button variant="hero" onClick={() => navigate("/dashboard")} className="w-full">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const q = mockQuestions[currentQ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <span className="font-heading text-sm font-semibold text-foreground">Exam #{id}</span>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono font-bold ${timeLeft < 300 ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'}`}>
            <Clock className="h-4 w-4" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <Button variant="destructive" size="sm" onClick={() => setShowSubmitDialog(true)}>Submit</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid lg:grid-cols-[1fr_250px] gap-6">
        {/* Question */}
        <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {mockQuestions.length}</span>
            <Button variant="ghost" size="sm" onClick={() => toggleFlag(currentQ)} className={flagged.has(currentQ) ? "text-accent" : ""}>
              <Flag className="h-4 w-4 mr-1" /> {flagged.has(currentQ) ? "Flagged" : "Flag"}
            </Button>
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => selectAnswer(currentQ, oi)}
                className={`w-full text-left p-4 rounded-lg border transition-all text-sm ${
                  answers[currentQ] === oi
                    ? "border-secondary bg-secondary/10 text-foreground font-medium"
                    : "border-border bg-background hover:border-secondary/50 text-foreground"
                }`}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border mr-3 text-xs font-semibold">
                  {String.fromCharCode(65 + oi)}
                </span>
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" disabled={currentQ === mockQuestions.length - 1} onClick={() => setCurrentQ(p => p + 1)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Question palette */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-card h-fit">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2">
            {mockQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                  currentQ === i
                    ? "gradient-hero text-primary-foreground"
                    : answers[i] !== undefined
                    ? "bg-success/20 text-success border border-success/30"
                    : flagged.has(i)
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-success/20 border border-success/30" /> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-accent/20 border border-accent/30" /> Flagged</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-muted border border-border" /> Not visited</div>
          </div>
        </div>
      </div>

      {/* Submit dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" /> Submit Exam?
            </DialogTitle>
            <DialogDescription>
              You have answered {Object.keys(answers).length} of {mockQuestions.length} questions.
              {Object.keys(answers).length < mockQuestions.length && " Some questions are unanswered."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleSubmit}>Confirm Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamPage;
