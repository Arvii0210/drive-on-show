import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    toast.success('Reset link sent to your email');
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-7">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow mb-3">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="text-muted-foreground text-sm mt-1">We'll send you a reset link</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-7">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label>Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email" placeholder="you@institution.edu"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="pl-9" required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-white border-0 hover:opacity-90">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mx-auto">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="font-semibold">Email sent!</p>
                <p className="text-sm text-muted-foreground mt-1">Check <span className="text-primary font-medium">{email}</span> for the reset link</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-5">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
