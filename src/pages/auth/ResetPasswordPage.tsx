import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const colors = ['', 'bg-destructive', 'bg-warning', 'bg-success'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (strength < 2) { toast.error('Please use a stronger password'); return; }
    toast.success('Password updated successfully!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-7">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow mb-3">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-muted-foreground text-sm mt-1">Choose a strong password</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={show ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required className="pr-10"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1 mt-1.5">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors duration-300', i <= strength ? colors[strength] : 'bg-secondary')} />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{['', 'Weak — add more characters', 'Good — almost there', 'Strong password'][strength]}</p>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Confirm Password</Label>
              <Input
                type="password" placeholder="••••••••"
                value={confirm} onChange={e => setConfirm(e.target.value)} required
              />
              {confirm && password !== confirm && <p className="text-[10px] text-destructive">Passwords do not match</p>}
            </div>
            <Button type="submit" className="w-full gradient-primary text-white border-0 hover:opacity-90 font-semibold">
              Reset Password
            </Button>
          </form>
        </div>
        <div className="text-center mt-5">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
