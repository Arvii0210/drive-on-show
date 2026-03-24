import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, CheckCircle, GraduationCap, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Role = 'author' | 'reviewer';

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('author');
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', institution: '', department: '', phone: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-destructive', 'bg-warning', 'bg-success'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error('Please agree to terms and conditions'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    toast.success('Account created! You can now sign in.', { description: `Welcome, ${form.name}!` });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
      <div className="w-full max-w-lg relative animate-slide-up">
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow mb-3">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join AbstractHub today</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-8 space-y-5">
          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'author', label: 'Author', icon: GraduationCap, desc: 'Submit research abstracts' },
              { value: 'reviewer', label: 'Reviewer', icon: UserCheck, desc: 'Review submitted abstracts' },
            ] as const).map(r => {
              const Ico = r.icon;
              const active = role === r.value;
              return (
                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                  className={cn('flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200',
                    active ? 'border-primary bg-primary/6 shadow-sm' : 'border-border hover:border-primary/40 hover:bg-secondary/60'
                  )}>
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', active ? 'gradient-primary' : 'bg-secondary')}>
                    <Ico className={cn('h-4 w-4', active ? 'text-white' : 'text-muted-foreground')} />
                  </div>
                  <div>
                    <p className={cn('text-xs font-bold', active ? 'text-primary' : 'text-foreground')}>{r.label}</p>
                    <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name *</Label>
                <Input placeholder="Dr. John Doe" value={form.name} onChange={update('name')} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email *</Label>
                <Input type="email" placeholder="you@institution.edu" value={form.email} onChange={update('email')} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Institution *</Label>
                <Input placeholder="MIT" value={form.institution} onChange={update('institution')} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Input placeholder="Computer Science" value={form.department} onChange={update('department')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Phone Number</Label>
              <Input placeholder="+1 (555) 000-0000" value={form.phone} onChange={update('phone')} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Password *</Label>
                <div className="relative">
                  <Input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={update('password')} required className="pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={cn('h-1 flex-1 rounded-full', i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-secondary')} />
                      ))}
                    </div>
                    <p className={cn('text-[10px] font-medium', passwordStrength === 3 ? 'text-success' : passwordStrength === 2 ? 'text-warning' : 'text-destructive')}>
                      {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Confirm Password *</Label>
                <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-[10px] text-destructive">Passwords do not match</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <Checkbox id="terms" checked={agreed} onCheckedChange={v => setAgreed(!!v)} className="mt-0.5" />
              <Label htmlFor="terms" className="text-xs font-normal text-muted-foreground cursor-pointer leading-snug">
                I agree to the <span className="text-primary font-medium hover:underline">Terms of Service</span> and{' '}
                <span className="text-primary font-medium hover:underline">Privacy Policy</span>
              </Label>
            </div>

            <Button type="submit" className="w-full gradient-primary text-white border-0 hover:opacity-90 font-semibold">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
