import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, User } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <BookOpen className="h-16 w-16 text-primary-foreground/80 mx-auto mb-6" />
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">Join ExamPortal</h2>
          <p className="text-primary-foreground/70 text-lg">Create your account and start taking secure online exams today.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <BookOpen className="h-7 w-7 text-secondary" />
            <span className="font-heading text-xl font-bold text-foreground">ExamPortal</span>
          </Link>

          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-8">Fill in your details to get started</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="John Doe" className="pl-10" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
