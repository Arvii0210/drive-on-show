import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import hallmarkLogo from '@/assets/hallmark-logo.png';

export default function AuthorRegisterPage() {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ 
    salutation: '',
    name: '', 
    email: '', 
    mobileNumber: '',
    institution: '',
    designation: '',
    password: '', 
    confirmPassword: '' 
  });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-destructive', 'bg-warning', 'bg-success'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.salutation) {
      toast.error('Please select a salutation');
      return;
    }
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!form.mobileNumber) {
      toast.error('Mobile number is required');
      return;
    }
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(form.mobileNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    if (!form.institution) {
      toast.error('Institution is required');
      return;
    }
    if (!form.designation) {
      toast.error('Designation is required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    const exists = users.find((u: any) => u.email === form.email);
    if (exists) {
      toast.error('An account with this email already exists');
      return;
    }

    const newUser = {
      salutation: form.salutation,
      name: form.name,
      email: form.email,
      mobileNumber: form.mobileNumber,
      institution: form.institution,
      designation: form.designation,
      password: form.password,
      role: 'author',
      eventSlug: eventSlug || '',
    };

    users.push(newUser);
    localStorage.setItem('app_users', JSON.stringify(users));
    toast.success('Account created successfully!', { description: `Welcome, ${form.salutation} ${form.name}!` });
    
    // Authenticate the user in the context
    login(form.email, form.password, 'author');
    
    // Redirect to author dashboard
    navigate('/author');
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden p-4">
      <div className="w-full max-w-7xl h-full max-h-[900px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full h-full lg:h-auto">
          
          {/* LEFT SIDE: Guidelines (2 columns on desktop) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col justify-center space-y-6 pr-4">
            <div>
              <img src={hallmarkLogo} alt="Hallmark Events" className="h-12 w-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground leading-tight mb-2">
                {eventSlug || "Conference"} 2024
              </h1>
              <p className="text-sm text-muted-foreground">
                Submit Your Abstract & Research Contributions
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-2xl border border-primary/20 p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">Author Guidelines</h3>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Original Research', desc: 'Previously unpublished work' },
                  { title: 'Clear Structure', desc: 'Introduction, Methods, Results' },
                  { title: 'Quality Content', desc: 'Well-researched & peer-reviewed' },
                  { title: 'Professional Standards', desc: 'Academic ethics compliance' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-4 border-t border-primary/20 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">Deadline</p>
                  <p className="text-xs text-muted-foreground">Dec 31, 2024</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Review</p>
                  <p className="text-xs text-muted-foreground">4-6 weeks</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Registration Form (3 columns on desktop) */}
          <div className="lg:col-span-3 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-6">
                <img src={hallmarkLogo} alt="Hallmark Events" className="h-10 w-auto mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-foreground">Author Registration</h1>
                <p className="text-xs text-primary font-semibold mt-1">{eventSlug || "Conference"} 2024</p>
              </div>

              <div className="bg-card rounded-2xl border border-border shadow-2xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
                  <p className="text-sm text-muted-foreground mt-1">Register to submit your abstract</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Salutation & Name Row */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Title *</Label>
                      <Select value={form.salutation} onValueChange={(value) => setForm(f => ({ ...f, salutation: value }))}>
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr.</SelectItem>
                          <SelectItem value="Ms.">Ms.</SelectItem>
                          <SelectItem value="Mrs.">Mrs.</SelectItem>
                          <SelectItem value="Dr.">Dr.</SelectItem>
                          <SelectItem value="Prof.">Prof.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Full Name *</Label>
                      <Input 
                        placeholder="John Doe" 
                        value={form.name} 
                        onChange={update('name')} 
                        required 
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Email & Mobile Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Email Address *</Label>
                      <Input 
                        type="email" 
                        placeholder="you@institution.edu" 
                        value={form.email} 
                        onChange={update('email')} 
                        required 
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Mobile Number *</Label>
                      <Input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000" 
                        value={form.mobileNumber} 
                        onChange={update('mobileNumber')} 
                        required 
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Institution & Designation Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Institution *</Label>
                      <Input 
                        placeholder="University / Organization" 
                        value={form.institution} 
                        onChange={update('institution')} 
                        required 
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Designation *</Label>
                      <Input 
                        placeholder="Professor / Researcher" 
                        value={form.designation} 
                        onChange={update('designation')} 
                        required 
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Password *</Label>
                      <div className="relative">
                        <Input 
                          type={showPass ? 'text' : 'password'} 
                          placeholder="••••••••" 
                          value={form.password} 
                          onChange={update('password')} 
                          required 
                          className="h-10 text-sm pr-10"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPass(!showPass)} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {form.password && (
                        <div className="space-y-1 mt-2">
                          <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                              <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-secondary')} />
                            ))}
                          </div>
                          <p className={cn('text-[10px] font-medium', passwordStrength === 3 ? 'text-success' : passwordStrength === 2 ? 'text-warning' : 'text-destructive')}>
                            {strengthLabels[passwordStrength]} password
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Confirm Password *</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={form.confirmPassword} 
                        onChange={update('confirmPassword')} 
                        required 
                        className="h-10 text-sm"
                      />
                      {form.confirmPassword && form.password !== form.confirmPassword && (
                        <p className="text-[10px] text-destructive font-medium mt-1">Passwords don't match</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-lg mt-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Account
                  </Button>
                </form>

                {/* Sign In Link */}
                <div className="text-center pt-5 mt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
