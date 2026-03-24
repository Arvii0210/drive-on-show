import { useState, useEffect } from 'react';
import { UserCircle, Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function AuthorProfile() {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AU';

  const [form, setForm] = useState({
    salutation: '',
    name: '',
    email: '',
    mobileNumber: '',
    institution: '',
    designation: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      const storageKey = `${user.role}_profile`;
      const roleSpecificUser = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setForm({
        salutation: roleSpecificUser.salutation || '',
        name: roleSpecificUser.name || user.name || '',
        email: roleSpecificUser.email || user.email || '',
        mobileNumber: roleSpecificUser.mobileNumber || '',
        institution: roleSpecificUser.institution || user.institution || '',
        designation: roleSpecificUser.designation || '',
      });
    }
  }, [user]);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSaveProfile = () => {
    // Validation
    if (!form.salutation || !form.name || !form.email || !form.mobileNumber || !form.institution || !form.designation) {
      toast.error('Please fill all required fields');
      return;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(form.mobileNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    setIsSaving(true);

    // Simulate saving
    setTimeout(() => {
      // Update in role-specific localStorage
      const storageKey = `${user?.role}_profile`;
      const updatedUser = { ...form, role: user?.role };
      localStorage.setItem(storageKey, JSON.stringify(updatedUser));

      // Also update currentUser for backward compatibility
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const mergedUser = { ...currentUser, ...form };
      localStorage.setItem('currentUser', JSON.stringify(mergedUser));

      // Update in app_users list
      const users = JSON.parse(localStorage.getItem('app_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex] = mergedUser;
        localStorage.setItem('app_users', JSON.stringify(users));
      }

      setIsSaving(false);
      setIsEditing(false);
      toast.success('Profile updated successfully!', {
        description: `${form.salutation} ${form.name}'s profile has been updated.`,
      });
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <PageHeader title="Author Profile" subtitle="Manage your personal and professional information" icon={UserCircle} />

      {/* Avatar & Basic Info */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary text-white text-2xl font-bold shadow-glow">
              {initials}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-card border-2 border-border shadow-sm hover:bg-secondary/80 transition-colors">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">
              {form.salutation} {form.name}
            </h2>
            <p className="text-sm text-muted-foreground ">{form.designation} · {form.institution}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{form.email}</p>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              className="h-9"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold">Personal & Professional Information</h3>
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Salutation & Name Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 space-y-1.5">
              <Label className="text-xs font-semibold">
                Salutation *
              </Label>
              {isEditing ? (
                <Select value={form.salutation} onValueChange={(value) => setForm(f => ({ ...f, salutation: value }))}>
                  <SelectTrigger className="h-9 text-sm">
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
              ) : (
                <div className="h-9 flex items-center px-3 rounded-lg border border-input bg-background text-sm">
                  {form.salutation || '—'}
                </div>
              )}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              {isEditing ? (
                <Input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={update('name')}
                  className="h-9 text-sm"
                />
              ) : (
                <div className="h-9 flex items-center px-3 rounded-lg border border-input bg-background text-sm">
                  {form.name || '—'}
                </div>
              )}
            </div>
          </div>

          {/* Email & Mobile Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address *</Label>
              {isEditing ? (
                <Input
                  type="email"
                  placeholder="you@institution.edu"
                  value={form.email}
                  onChange={update('email')}
                  className="h-9 text-sm"
                />
              ) : (
                <div className="h-9 flex items-center px-3 rounded-lg border border-input bg-background text-sm">
                  {form.email || '—'}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mobile Number *</Label>
              {isEditing ? (
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.mobileNumber}
                  onChange={update('mobileNumber')}
                  className="h-9 text-sm"
                />
              ) : (
                <div className="h-9 flex items-center px-3 rounded-lg border border-input bg-background text-sm">
                  {form.mobileNumber || '—'}
                </div>
              )}
            </div>
          </div>

          {/* Institution & Designation Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Institution / Organization *</Label>
              {isEditing ? (
                <Input
                  placeholder="University Name"
                  value={form.institution}
                  onChange={update('institution')}
                  className="h-9 text-sm"
                />
              ) : (
                <div className="h-9 flex items-center px-3 rounded-lg border border-input bg-background text-sm">
                  {form.institution || '—'}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Designation / Title *</Label>
              {isEditing ? (
                <Input
                  placeholder="Professor, Research Fellow, etc."
                  value={form.designation}
                  onChange={update('designation')}
                  className="h-9 text-sm"
                />
              ) : (
                <div className="h-9 flex items-center px-3 rounded-lg border border-input bg-background text-sm">
                  {form.designation || '—'}
                </div>
              )}
            </div>
          </div>

          {/* Validation Error for Mobile */}
          {isEditing && form.mobileNumber && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(form.mobileNumber.replace(/\s/g, '')) && (
            <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-lg">
              <p className="text-[11px] text-destructive font-medium">Invalid phone number format</p>
            </div>
          )}

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-3 pt-3 border-t border-border">
              <Button
                className="flex-1 gradient-primary text-white border-0 hover:opacity-90 h-9"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-9"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-[11px] font-semibold text-primary mb-1">Account Status</p>
          <p className="text-sm font-bold text-foreground">Active</p>
          <p className="text-[10px] text-muted-foreground mt-1">Member since registration</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-xl p-4">
          <p className="text-[11px] font-semibold text-success mb-1">Submission Access</p>
          <p className="text-sm font-bold text-foreground">Enabled</p>
          <p className="text-[10px] text-muted-foreground mt-1">Ready to submit abstracts</p>
        </div>
      </div>
    </div>
  );
}
