import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

const EXAM_DURATION = 30 * 60;

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
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center">
          <div className={`text-4xl font-bold mb-2 ${percentage >= 60 ? 'text-success' : 'text-destructive'}`}>
            {percentage}%
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">Exam Completed!</h1>
          <p className="text-sm text-muted-foreground mb-6">You scored {score} out of {mockQuestions.length} correctly.</p>

          <div className="space-y-2 text-left mb-6">
            {mockQuestions.map((q, i) => (
              <div key={q.id} className={`p-3 rounded border text-sm ${answers[i] === q.correct ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'}`}>
                <p className="font-medium text-foreground text-xs mb-1">Q{i + 1}: {q.question}</p>
                <p className="text-xs text-muted-foreground">
                  Your answer: <span className="font-medium">{q.options[answers[i]] ?? "Not answered"}</span>
                  {answers[i] !== q.correct && <span className="text-success ml-2">✓ {q.options[q.correct]}</span>}
                </p>
              </div>
            ))}
          </div>
          <Button onClick={() => navigate("/dashboard")} className="w-full">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const q = mockQuestions[currentQ];

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <span className="font-semibold text-foreground">Exam #{id}</span>
          <div className={`font-mono font-bold text-sm ${timeLeft < 300 ? 'text-destructive' : 'text-foreground'}`}>
            ⏱ {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <Button variant="destructive" size="sm" onClick={() => setShowSubmitDialog(true)}>Submit</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl grid lg:grid-cols-[1fr_200px] gap-6">
        {/* Question */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {mockQuestions.length}</span>
            <button onClick={() => toggleFlag(currentQ)} className={`text-sm ${flagged.has(currentQ) ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {flagged.has(currentQ) ? "🚩 Flagged" : "🏳 Flag"}
            </button>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-5">{q.question}</h2>
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => selectAnswer(currentQ, oi)}
                className={`w-full text-left p-3 rounded border text-sm transition-colors ${
                  answers[currentQ] === oi
                    ? "border-primary bg-primary/10 text-foreground font-medium"
                    : "border-border bg-background hover:border-primary/50 text-foreground"
                }`}
              >
                <span className="inline-block w-6 font-semibold">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" size="sm" disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)}>
              ← Previous
            </Button>
            <Button variant="outline" size="sm" disabled={currentQ === mockQuestions.length - 1} onClick={() => setCurrentQ(p => p + 1)}>
              Next →
            </Button>
          </div>
        </div>

        {/* Question palette */}
        <div className="bg-card border border-border rounded-lg p-4 h-fit">
          <h3 className="text-sm font-semibold text-foreground mb-3">Questions</h3>
          <div className="grid grid-cols-5 gap-1.5">
            {mockQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded text-xs font-semibold ${
                  currentQ === i
                    ? "bg-primary text-primary-foreground"
                    : answers[i] !== undefined
                    ? "bg-success/20 text-success"
                    : flagged.has(i)
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-success/20" /> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary/20" /> Flagged</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-muted" /> Not visited</div>
          </div>
        </div>
      </div>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
            <DialogDescription>
              You have answered {Object.keys(answers).length} of {mockQuestions.length} questions.
              {Object.keys(answers).length < mockQuestions.length && " Some questions are unanswered."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Confirm Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamPage;
