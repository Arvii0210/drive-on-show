import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowLeft, Save, X, Upload, FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { PersonFormData, PersonType, Gender } from '../models/people.model';
import { createPerson, updatePerson, getPersonById } from '@/services/people.service';

const AddPerson = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const personTypeParam = searchParams.get('type') || 'author';
  const personType = personTypeParam.toUpperCase() as PersonType;
  const { toast } = useToast();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<PersonFormData>({
    personType,
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined,
    city: '',
    state: '',
    nationality: 'India',
    panNumber: '',
    bankName: '',
    bankAccountNo: '',
    ifscCode: '',
    nominee: [{ name: '' }], // Change from '' to ['']
    profilePicture: null,
    document: null,
    website: '',
    socialMedia: '',
    shortBio: '',
    additionalNotes: '',
    isActive: true,
    languages: [],
  });

  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // ✅ Fetch data for edit mode
  useEffect(() => {
    if (isEdit && id) {
      fetchPersonData(parseInt(id));
    }
  }, [isEdit, id]);

  const fetchPersonData = async (personId: number) => {
    try {
      setFetchingData(true);
      const response = await getPersonById(personId);
      const person = response.data;

      const languagesArray = person.languages?.map((l: any) => l.name).join(', ') || '';

      // Extract only the year from dateOfBirth
      let yearOfBirth = '';
      if (person.dateOfBirth) {
        // If it's a string like "YYYY-MM-DD", take first 4 chars
        yearOfBirth = person.dateOfBirth.slice(0, 4);
      }

      setFormData((prev) => ({
        ...prev,
        ...person,
        personType: person.personType || prev.personType,
        dateOfBirth: yearOfBirth,
        gender: person.gender || undefined,
        nominee: Array.isArray(person.nominee)
  ? person.nominee
  : person.nominee
  ? [{ name: person.nominee }]
  : [{ name: '' }],
        languages: languagesArray.split(',').map((l: string) => l.trim()).filter(Boolean),
        profilePicture: null,
        document: null,
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load person data',
        variant: 'destructive',
      });
      navigate('/people');
    } finally {
      setFetchingData(false);
    }
  };

 

  const handleStringChange = (field: keyof PersonFormData) => (value: string) => {
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooleanChange = (field: keyof PersonFormData) => (value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'document' | 'profilePicture') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Only PDF, JPEG, or PNG allowed.',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Maximum allowed size is 5MB.',
          variant: 'destructive',
        });
        return;
      }

      setFormData(prev => ({ ...prev, [field]: file }));

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setDocumentPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setDocumentPreview(null);
      }
    }
  };

  // Add this above in component state
const [languagesInputText, setLanguagesInputText] = useState(formData.languages?.join(', ') || '');

const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setLanguagesInputText(value);

  // Convert to array after typing
  const langs = value
    .split(",")
    .map((lang) => lang.trim())
    .filter(Boolean); // Remove empty
  setFormData((prev) => ({ ...prev, languages: langs }));
};


  // ✅ Phone number restriction
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // PersonType required check (from formData or personType variable)
    if (!formData.personType) {
      toast({
        title: 'Person Type Required',
        description: 'Please select a person type using the tabs above.',
        variant: 'destructive',
      });
      return;
    }

    const requiredFields = [
      { field: 'name', label: 'Name' },
      { field: 'email', label: 'Email' },
      { field: 'phone', label: 'Phone' },
      { field: 'city', label: 'City' },
      { field: 'state', label: 'State' },
      { field: 'nationality', label: 'Nationality' },
      { field: 'panNumber', label: 'PAN Number' },
      { field: 'bankName', label: 'Bank Name' },
      { field: 'bankAccountNo', label: 'Bank Account Number' },
      { field: 'ifscCode', label: 'IFSC Code' },
      
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof PersonFormData]?.toString().trim()) {
        toast({
          title: 'Fill the all required fields',
          description: `${label} is required.`,
          variant: 'destructive',
        });
        return;
      }
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
  toast({
    title: 'Invalid PAN Number',
    description: 'PAN must be in format ABCDE1234F and uppercase.',
    variant: 'destructive',
  });
  return;
}

if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
  toast({
    title: 'Invalid IFSC Code',
    description: 'Must follow RBI format — 4 letters, 0, then 6 letters/numbers (e.g., SBIN0001234).',
    variant: 'destructive',
  });
  return;
}



    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Phone number must be exactly 10 digits.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const dataToSend: PersonFormData = { ...formData, personType: personType };

      if (isEdit && id) {
        await updatePerson(parseInt(id), dataToSend);
        toast({ title: 'Success', description: `${personType} updated successfully` });
      } else {
        await createPerson(dataToSend);
        toast({ title: 'Success', description: `${personType} created successfully` });
      }

      navigate('/people');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || `Failed to ${isEdit ? 'update' : 'create'} person.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNomineeChange = (idx: number, value: string) => {
  setFormData(prev => {
    const nominees = [...prev.nominee];
    nominees[idx] = { name: value };
    return { ...prev, nominee: nominees };
  });
};

const handleAddNominee = () => {
  setFormData(prev => ({
    ...prev,
    nominee: [...prev.nominee, { name: '' }],
  }));
};

const handleRemoveNominee = (idx: number) => {
  setFormData(prev => {
    const nominees = [...prev.nominee];
    nominees.splice(idx, 1);
    return { ...prev, nominee: nominees };
  });
};


  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading person data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('/people')} className="p-2 bg-blue-500 text-white">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-black">
            {isEdit ? 'Edit' : 'Add New'} {personType.charAt(0) + personType.slice(1).toLowerCase()}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? 'Update the details'
              : 'Fill in the details to add a new'} {personType.toLowerCase()}
          </p>
        </div>
      </div>

      <Tabs
  value={formData.personType?.toLowerCase() || ''}
  onValueChange={value => {
    setFormData(prev => ({ ...prev, personType: value.toUpperCase() as PersonType }));
    navigate(`/people/${isEdit ? `edit/${id}` : 'add'}?type=${value}`); 
  }}
>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="author">Author</TabsTrigger>
          <TabsTrigger value="translator">Translator</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="proprietor">Proprietor</TabsTrigger>
          <TabsTrigger value="agency">Agency</TabsTrigger>
          <TabsTrigger value="publisher">Publisher</TabsTrigger>
        </TabsList>
        <TabsContent value={formData.personType?.toLowerCase() || ''} className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="card-gradient">
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => handleStringChange('name')(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => handleStringChange('email')(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      placeholder="10 digit number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Year of Birth</Label>
                    <select
                      id="dateOfBirth"
                      className="border rounded px-3 py-2 w-full"
                      value={formData.dateOfBirth || ''}
                      onChange={e => handleStringChange('dateOfBirth')(e.target.value)}
                    >
                      <option value="">Select year</option>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender || ''}
                      onValueChange={(val: Gender) => handleStringChange('gender')(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="card-gradient">
              <CardHeader><CardTitle>Address Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Chennai"
                      value={formData.city}
                      onChange={e => handleStringChange('city')(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="e.g., Tamil Nadu"
                      value={formData.state}
                      onChange={e => handleStringChange('state')(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      placeholder="e.g., Indian"
                      value={formData.nationality}
                      onChange={e => handleStringChange('nationality')(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="card-gradient">
              <CardHeader><CardTitle>Financial Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
  <Label htmlFor="panNumber">PAN Number *</Label>
  <Input
    id="panNumber"
    placeholder="e.g., ABCDE1234F"
    value={formData.panNumber}
    onChange={(e) => {
      // Force uppercase and allow only alphanumeric
      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      // Limit to 10 characters
      if (value.length <= 10) {
        setFormData((prev) => ({ ...prev, panNumber: value }));
      }
    }}
    maxLength={10}
    required
  />
</div>

                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      placeholder="e.g., State Bank of India"
                      value={formData.bankName}
                      onChange={e => handleStringChange('bankName')(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAccountNo">Bank Account Number *</Label>
                    <Input
                      id="bankAccountNo"
                      placeholder="e.g., 123456789012"
                      value={formData.bankAccountNo}
                      onChange={e => handleStringChange('bankAccountNo')(e.target.value)}
                      required
                    />
                  </div>
                  <div>
  <Label htmlFor="ifscCode">IFSC Code *</Label>
  <Input
    id="ifscCode"
    placeholder="e.g., SBIN0001234"
    value={formData.ifscCode}
    onChange={(e) => {
      
      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      
      if (value.length <= 11) {
        setFormData((prev) => ({ ...prev, ifscCode: value }));
      }
    }}
    maxLength={11}
    required
  />
</div>

                  <div className="md:col-span-2">
                    <Label htmlFor="nominee">Nominee Name(s)</Label>
                    {formData.nominee.map((nom, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <Input
  id={`nominee-${idx}`}
  placeholder={`Nominee Name ${idx + 1}`}
  value={nom.name}   
  onChange={e => handleNomineeChange(idx, e.target.value)}
/>

                        {formData.nominee.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            className="px-2"
                            onClick={() => handleRemoveNominee(idx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-1"
                      onClick={handleAddNominee}
                    >
                      Add Nominee (+)
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="document">Upload Approved Document</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <label htmlFor="documentUpload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                        <Upload className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Choose File</span>
                      </div>
                    </label>
                    {formData.document && <span className="text-sm font-medium">{formData.document.name}</span>}
                    <input
                      type="file"
                      id="documentUpload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleFileChange('document')}
                    />
                  </div>

                  {formData.document && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-2 flex items-center gap-4">
                      {documentPreview ? (
                        <img
                          src={documentPreview}
                          alt="Document preview"
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-red-50 border border-red-200 rounded flex items-center justify-center">
                          <FileText className="h-8 w-8 text-red-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{formData.document.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(formData.document.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="card-gradient">
              <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
  <Label htmlFor="languages">Preferred Languages (comma separated)</Label>
  <Input
    id="languages"
    placeholder="e.g., Tamil, Hindi, English"
    value={languagesInputText} // ✅ Use separate state
    onChange={handleLanguagesChange}
  />
</div>

                <div>
                  <Label htmlFor="shortBio">Bio / Description</Label>
                  <Textarea
                    id="shortBio"
                    rows={4}
                    placeholder="Short biography or background"
                    value={formData.shortBio}
                    onChange={e => handleStringChange('shortBio')(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="e.g., https://myportfolio.com"
                      value={formData.website}
                      onChange={e => handleStringChange('website')(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="socialMedia">Social Media</Label>
                    <Input
                      id="socialMedia"
                      placeholder="e.g., https://twitter.com/username"
                      value={formData.socialMedia}
                      onChange={e => handleStringChange('socialMedia')(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Input
  value={formData.additionalNotes}
  onChange={e => handleStringChange("additionalNotes")(e.target.value)}
 
  placeholder="Additional Notes (max 150 characters)"
/>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={!!formData.isActive}
                    onCheckedChange={handleBooleanChange('isActive')}
                  />
                  <Label htmlFor="isActive">Active Status</Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                className="bg-gray-500 text-white px-6 hover:bg-red-300"
                onClick={() => navigate('/people')}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 text-white px-6 hover:opacity-90"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : `${isEdit ? 'Update' : 'Save'} ${personType.charAt(0) + personType.slice(1).toLowerCase()}`}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddPerson;
