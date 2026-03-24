import { useState, useEffect } from 'react';
import { UserCircle, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  const [form, setForm] = useState({
    salutation: user?.salutation || 'Mr.',
    name: user?.name || '',
    email: user?.email || '',
    institution: user?.institution || '',
    designation: user?.designation || '',
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.name) {
      const storageKey = `${currentUser.role || user?.role}_profile`;
      const roleSpecificData = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setForm({
        salutation: roleSpecificData.salutation || currentUser.salutation || 'Mr.',
        name: roleSpecificData.name || currentUser.name || '',
        email: roleSpecificData.email || currentUser.email || '',
        institution: roleSpecificData.institution || currentUser.institution || '',
        designation: roleSpecificData.designation || currentUser.designation || '',
      });
    }
  }, []);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!form.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!form.institution.trim()) {
      toast.error('Institution is required');
      return;
    }
    if (!form.designation.trim()) {
      toast.error('Designation is required');
      return;
    }

    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const storageKey = `${currentUser.role || user?.role}_profile`;
    const updatedUser = { ...currentUser, ...form };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem(storageKey, JSON.stringify({ ...form, role: currentUser.role }));

    // Update app_users array
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    const updatedUsers = users.map((u: any) => u.email === currentUser.email ? updatedUser : u);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));

    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <PageHeader title="Profile" subtitle="Manage your personal information" icon={UserCircle} />

      {/* Avatar section */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white text-xl font-bold shadow-lg">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold">{form.name}</h2>
              <p className="text-sm text-muted-foreground">{form.designation} · {form.institution}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{form.email}</p>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gradient-primary text-white border-0 hover:opacity-90">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Personal Information</h3>
          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gradient-primary text-white border-0 hover:opacity-90 h-8 text-sm">
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="h-8 text-sm">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Salutation */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Salutation</Label>
            {isEditing ? (
              <Select value={form.salutation} onValueChange={(value) => setForm(f => ({ ...f, salutation: value }))}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
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

          {/* Name */}
          <div className="space-y-1.5">
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

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Email Address *</Label>
            {isEditing ? (
              <Input 
                type="email" 
                placeholder="john@example.com"
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

          {/* Institution */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Institution *</Label>
            {isEditing ? (
              <Input 
                placeholder="University of Example" 
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

          {/* Designation */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Designation *</Label>
            {isEditing ? (
              <Input 
                placeholder="Professor/Researcher/etc." 
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
      </div>
    </div>
  );
}
