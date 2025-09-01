import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAllPersons } from "@/services/people.service";
import { createRight, getRightById, updateRight } from "@/services/rights.service";
import { RightsPayload } from "@/models/rights.model";
import { PersonType } from "@/models/people.model";
import { getBooks } from "@/services/book.service";

const languageOptions = [
  "English", "Tamil", "Hindi", "Malayalam", "Telugu", "Kannada", "Bengali", "Gujarati", "Marathi", "Punjabi",
];

interface Country {
  name: string;
  code: string;
  currencies: string[];
}

const AddOrEditAgreement = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { toast } = useToast();
  const isEdit = !!id;

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [availablePeople, setAvailablePeople] = useState<any[]>([]);
  const [books, setBooks] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    bookId: "",
    personId: "",
    role: "",
    advancePaid: "",
    advancePaidDate: "",
    royalties: "",
    language: "",
    country: "",
    currency: "",
    state: "",
    active: true,
    publisherName: "",
    additionalNotes: "", // <-- Add this line
  });
  const [rightData, setRightData] = useState<RightsPayload | null>(null);

  // Fetch agreement data if editing
  useEffect(() => {
    if (!isEdit) return;
    const fetchRight = async () => {
      try {
        const data = await getRightById(Number(id));
        const right: RightsPayload = (data as { data: RightsPayload }).data;
        setRightData(right);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load agreement data",
          variant: "destructive",
        });
        navigate("/agreements");
      }
    };
    fetchRight();
  }, [isEdit, id, toast, navigate]);

  // When all options are loaded, set formData
  useEffect(() => {
    if (!rightData) return;
    if (
      books.length > 0 &&
      countries.length > 0 &&
      (!formData.role || availablePeople.length > 0)
    ) {
      setFormData(prev => ({
        ...prev,
        role: rightData.role?.toLowerCase() || "",
        bookId: rightData.bookId?.toString() || "",
        personId: rightData.personId?.toString() || "",
        advancePaid: rightData.advancePaid?.toString() || "",
        advancePaidDate: rightData.advancePaidDate ? rightData.advancePaidDate.slice(0, 10) : "",
        royalties: rightData.royalties?.toString() || "",
        language: rightData.languages || "",
        country: rightData.country || "",
        currency: rightData.currency || "",
        state: rightData.state || "",
        active: rightData.isActive ?? true,
        publisherName: rightData.publisherName || "",
        additionalNotes: rightData.additionalNotes || "",
      }));
    }
  }, [rightData, books, countries, availablePeople, formData.role]);

  // Load countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,currencies");
        const data = await res.json();
        const formatted = data
          .map((c: any) => ({
            name: c.name.common,
            code: c.cca2,
            currencies: c.currencies ? Object.keys(c.currencies) : [],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(formatted);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load countries",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [toast]);

  // Handle state list for India
  useEffect(() => {
    if (formData.country === "India") {
      fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
        .then(res => res.json())
        .then(data => {
          if (data.states) {
            setStates(data.states.map((s: any) => s.state_name).sort());
          }
        })
        .catch(() => {
          setStates([
            "Andhra Pradesh", "Bihar", "Tamil Nadu", "Karnataka", "Kerala",
            "Maharashtra", "Punjab", "Rajasthan", "Telangana", "Uttar Pradesh", "West Bengal",
          ]);
        });
    } else {
      setStates([]);
      setFormData(prev => ({ ...prev, state: "" }));
    }
  }, [formData.country]);

  // Auto-fill currency
  useEffect(() => {
    const selected = countries.find(c => c.name === formData.country);
    if (selected && selected.currencies.length > 0) {
      setFormData(prev => ({ ...prev, currency: selected.currencies[0] }));
    } else {
      setFormData(prev => ({ ...prev, currency: "" }));
    }
  }, [formData.country, countries]);

  // Load people by role
  useEffect(() => {
    const fetchPeople = async () => {
      if (!formData.role) {
        setAvailablePeople([]);
        return;
      }
      setLoadingPeople(true);
      try {
        const fetchedPersons = await getAllPersons();
        const filteredPeople = fetchedPersons.filter(person => 
          person.personType.toLowerCase() === formData.role.toLowerCase()
        );
        setAvailablePeople(filteredPeople);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch people for selected role",
          variant: "destructive",
        });
      } finally {
        setLoadingPeople(false);
      }
    };
    fetchPeople();
    // Don't clear personId when editing
    if (!isEdit) {
      setFormData(prev => ({ ...prev, personId: "" }));
    }
  }, [formData.role, toast, isEdit]);

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getBooks();
        const bookArray = Array.isArray(res.data?.books) ? res.data.books : [];
        setBooks(bookArray);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive",
        });
      }
    };
    fetchBooks();
  }, [toast]);

  const handleChange = (field: string, value: string | boolean) => {
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const {
    bookId, personId, role, advancePaid, advancePaidDate, royalties,
    language, country, currency, active, publisherName
  } = formData;

  if (!bookId || !personId || !role || !advancePaid || !advancePaidDate || !royalties || !language || !country) {
    toast({
      title: "Missing Fields",
      description: "Please fill all required fields.",
      variant: "destructive",
    });
    return;
  }

  const formattedDate = new Date(advancePaidDate).toISOString();

  // Only include `state` if country is India
  const payload: Partial<RightsPayload> = {
    rights: "BUYING",
    role: role.toUpperCase() as PersonType,
    personId: Number(personId),
    bookId: Number(bookId),
    advancePaid: Number(advancePaid),
    advancePaidDate: formattedDate,
    royalties: Number(royalties),
    languages: language,
    country,
    currency,
    rightsType: "BUYING",
    isActive: active,
    publisherName: publisherName,
    additionalNotes: formData.additionalNotes, // <-- Add this line
    ...(country === "India" ? { state: formData.state } : {}),
  };

  try {
    if (isEdit) {
      await updateRight(Number(id), payload);
      toast({ title: "Success", description: "Agreement updated successfully." });
    } else {
      await createRight(payload as RightsPayload);
      toast({ title: "Success", description: "Agreement added successfully." });
    }
    navigate("/agreements");
  } catch (error: any) {
    toast({
      title: "Error",
      description: error?.response?.data?.message || "Failed to save agreement",
      variant: "destructive",
    });
  }
};


  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-white z-10 pb-2 border-b flex items-center gap-4">
        <Button onClick={() => navigate("/agreements")} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold">
          {isEdit ? "Edit Agreement" : "Add Agreement"}
        </h1>
      </div>

      <Card className="max-w-5xl mx-auto p-6 md:p-8 space-y-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div className="space-y-1.5">
                          <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                          <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {["proprietor", "agencies", "author", "publisher", "translator", "editor"].map(role => (
                                <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

            {/* Person */}
            <div className="space-y-1.5">
              <Label>Person <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.personId} 
                onValueChange={val => handleChange("personId", val)} 
                disabled={!formData.role || loadingPeople}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !formData.role ? "Select a role first" : 
                    loadingPeople ? "Loading..." : 
                    "Select person"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availablePeople.map(person => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      <div className="flex flex-col">
                        <span>{person.name}</span>
                        <span className="text-xs text-muted-foreground">{person.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Book */}
            <div className="space-y-1.5">
              <Label>Book <span className="text-red-500">*</span></Label>
              <Select
                value={formData.bookId}
                onValueChange={val => handleChange("bookId", val)} required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {books.map(book => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Publisher Name */}
            <div className="space-y-1.5">
              <Label>Publisher Name </Label>
              <Input
                value={formData.publisherName}
                onChange={e => handleChange("publisherName", e.target.value)}
                placeholder="Enter publisher name"
                
              />
            </div>

            {/* Advance */}
            <div className="space-y-1.5">
              <Label>Advance (₹) <span className="text-red-500">*</span></Label>
              <Input 
                type="number" 
                value={formData.advancePaid} 
                onChange={e => handleChange("advancePaid", e.target.value)} 
              />
            </div>

            {/* Advance Date */}
            <div className="space-y-1.5">
              <Label>Advance Date <span className="text-red-500">*</span></Label>
              <Input 
                type="date" 
                value={formData.advancePaidDate} 
                onChange={e => handleChange("advancePaidDate", e.target.value)} 
              />
            </div>

            {/* Royalties */}
            <div className="space-y-1.5">
              <Label>Royalties (%) <span className="text-red-500">*</span></Label>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                step="0.1" 
                value={formData.royalties} 
                onChange={e => handleChange("royalties", e.target.value)} 
              />
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <Label>Language <span className="text-red-500">*</span></Label>
              <Select value={formData.language} onValueChange={val => handleChange("language", val)}>
                <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                <SelectContent>
                  {languageOptions.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label>Country <span className="text-red-500">*</span></Label>
              <Select value={formData.country} onValueChange={val => handleChange("country", val)} disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input value={formData.currency} readOnly className="bg-slate-100" />
            </div>

            {/* State (if India) */}
            {formData.country === "India" && (
              <div className="space-y-1.5">
                <Label>State</Label>
                <Select value={formData.state} onValueChange={val => handleChange("state", val)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Active toggle */}
            <div className="flex items-center gap-3 mt-3">
              <Label className="text-sm text-slate-600">Active</Label>
              <Switch checked={formData.active} onCheckedChange={val => handleChange("active", val)} />
              <span className="text-sm text-muted-foreground">{formData.active ? "Active" : "Inactive"}</span>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <Label>Additional Notes</Label>
            <Input
              type="text"
              placeholder="Enter any additional notes"
              value={formData.additionalNotes}
              onChange={e => handleChange("additionalNotes", e.target.value)}
              
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => navigate("/agreements")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white">
              {isEdit ? "Update Agreement" : "Add Agreement"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddOrEditAgreement;
