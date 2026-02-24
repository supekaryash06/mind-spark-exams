import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Shield, Clock, BarChart3, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-exam.jpg";

const features = [
  { icon: BookOpen, title: "Auto-Generated Papers", desc: "Algorithmic test paper generation with randomized questions for every student." },
  { icon: Shield, title: "Secure Browser", desc: "Browser lockdown prevents cheating with tab-switching detection." },
  { icon: Clock, title: "Timed Exams", desc: "Configurable timers with auto-submission when time expires." },
  { icon: BarChart3, title: "Instant Results", desc: "Automated grading with detailed analytics and score breakdowns." },
  { icon: Users, title: "Multi-Role Access", desc: "Separate dashboards for students, teachers, and administrators." },
  { icon: CheckCircle, title: "Question Bank", desc: "Extensive question bank with categories, difficulty levels, and tags." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-secondary" />
            <span className="font-heading text-xl font-bold text-foreground">ExamPortal</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
          <div className="md:hidden flex gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link to="/register"><Button variant="hero" size="sm">Sign Up</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-secondary/10 text-secondary">
              Online Examination System
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Secure & Smart <br />
              <span className="text-secondary">Online Exams</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Conduct effective, quick, and secure examinations with auto-generated test papers, real-time monitoring, and instant results.
            </p>
            <div className="flex gap-4">
              <Link to="/register"><Button variant="hero" size="lg">Start Exam →</Button></Link>
              <a href="#features"><Button variant="outline" size="lg">Learn More</Button></a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-hero">
              <img src={heroImage} alt="Online Examination Portal" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to conduct fair, efficient, and secure online examinations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">About the System</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            This Browser/Server architecture examination system enables online classes to conduct tests securely. It features auto-generated question papers using algorithmic analyses, ensuring unique exams for every student. The system prioritizes security, efficiency, and a seamless user experience.
          </p>
          <Link to="/register">
            <Button variant="hero" size="lg">Get Started Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary-foreground/70" />
            <span className="font-heading text-sm font-semibold text-primary-foreground">ExamPortal</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">© 2026 Online Examination System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
