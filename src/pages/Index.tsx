import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="text-lg font-bold text-primary">
            📝 ExamPortal
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Online Examination System</h1>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Conduct secure online exams with auto-generated question papers, real-time monitoring, and instant results.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button variant="secondary" size="lg">Get Started</Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Auto-Generated Papers", desc: "Algorithmic test paper generation with randomized questions for every student." },
              { title: "Secure Browser", desc: "Browser lockdown prevents cheating with tab-switching detection." },
              { title: "Timed Exams", desc: "Configurable timers with auto-submission when time expires." },
              { title: "Instant Results", desc: "Automated grading with detailed analytics and score breakdowns." },
              { title: "Multi-Role Access", desc: "Separate dashboards for students, teachers, and administrators." },
              { title: "Question Bank", desc: "Extensive question bank with categories, difficulty levels, and tags." },
            ].map((f) => (
              <div key={f.title} className="border border-border rounded-lg p-5 bg-card">
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">About the System</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This Browser/Server architecture examination system enables online classes to conduct tests securely.
            It features auto-generated question papers using algorithmic analyses, ensuring unique exams for every student.
          </p>
          <Link to="/register">
            <Button size="lg">Get Started Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2026 Online Examination System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
