import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, GraduationCap, UserCheck, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { findUser } from '@/utils/demoAccounts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/data/mockData';
import hallmarkLogo from '@/assets/hallmark-logo.png';

const roles: { value: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
  { value: 'admin', label: 'Admin', desc: 'Manage the platform', icon: Shield },
  { value: 'author', label: 'Author', desc: 'Submit abstracts', icon: GraduationCap },
  { value: 'reviewer', label: 'Reviewer', desc: 'Evaluate abstracts', icon: UserCheck },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('author');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password'); return; }

    // Check localStorage credentials
    const user = findUser(email, password);
    if (user) {
      login(email, password, user.role);
      toast.success(`Welcome back, ${user.name}!`);
      const routes: Record<UserRole, string> = { admin: '/admin', author: '/author', reviewer: '/reviewer' };
      navigate(routes[user.role]);
      return;
    }

    // Fallback: if no match found, show error
    toast.error('Invalid email or password. Please try again.');
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT: Conference themed image */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] gradient-hero p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative z-10">
          <img src={hallmarkLogo} alt="Hallmark Events" className="h-12 w-auto brightness-0 invert" />
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Conference Abstract<br />Management Platform
            </h1>
            <p className="text-white/70 mt-4 text-sm leading-relaxed max-w-sm">
              The complete platform for abstract submission, peer review, and conference management. Trusted by leading academic institutions worldwide.
            </p>
          </div>
          <div className="space-y-2.5">
            {['Multi-role conference management', 'Blind peer review system', 'Real-time submission tracking', 'Automated reviewer assignments'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-white/60 shrink-0" />
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">© 2024 Hallmark Events · The Conference People</p>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md space-y-7 animate-slide-up">
          {/* Logo on mobile */}
          <div className="lg:hidden mb-4">
            <img src={hallmarkLogo} alt="Hallmark Events" className="h-10 w-auto" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2.5">
            {roles.map(r => {
              const isSelected = role === r.value;
              const Ico = r.icon;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all duration-200',
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-border bg-card hover:border-primary/30 hover:bg-secondary/60 text-muted-foreground'
                  )}
                >
                  <Ico className={cn('h-5 w-5', isSelected ? 'text-primary' : '')} />
                  <span className={cn('text-xs font-semibold', isSelected ? 'text-primary' : '')}>{r.label}</span>
                  <span className="text-[9px] text-center leading-tight opacity-70">{r.desc}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email" type="email" placeholder="you@institution.edu"
                value={email} onChange={e => setEmail(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={v => setRememberMe(!!v)} />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">Remember me</Label>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 group"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">Create account</Link>
          </p>

          <div className="bg-secondary/50 rounded-lg p-3 border border-border">
            <p className="text-[10px] text-muted-foreground font-medium mb-1">Demo Accounts:</p>
            <p className="text-[10px] text-muted-foreground">Admin: admin@hallmark.com / admin123</p>
            <p className="text-[10px] text-muted-foreground">Reviewer: reviewer@hallmark.com / reviewer123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
