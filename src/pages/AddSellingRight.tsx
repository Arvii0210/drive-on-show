import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { getAllPersons } from "@/services/people.service";
import { createRight, getRightById, updateRight } from "@/services/rights.service";
import { Person, RightsPayload, RightsType } from "@/models/rights.model";
import { PersonType } from "@/models/people.model";
import { getBooks } from "@/services/book.service";

const languageOptions = ["English", "Tamil", "Hindi", "Malayalam", "Telugu", "Kannada", "Bengali", "Gujarati", "Marathi", "Punjabi"];

interface Country {
  name: string;
  code: string;
  currencies: string[];
}

const AddSellingRights = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<string[]>([]);
  const [availablePeople, setAvailablePeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [books, setBooks] = useState<{ id: number; name: string }[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    personId: "",
    bookId: 0,
    advance: "",
    royalties: "",
    language: "",
    country: "",
    currency: "",
    state: "",
    active: true,
    domesticRights: [] as string[],
    publisherName: "",
    advancePaidDate: "", // Add this field
    additionalNotes: "", // <-- Add this line
  });

  /** Fetch countries */
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
        toast({ title: "Error", description: "Failed to load countries", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [toast]);

  /** Fetch books on mount */
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks({ limit: 100 });
        if (Array.isArray(data)) {
          setBooks(data.map(b => ({ id: b.id, name: b.name })));
        } else if (Array.isArray(data.books)) {
          setBooks(data.books.map(b => ({ id: b.id, name: b.name })));
        } else if (Array.isArray(data.data?.books)) {
          setBooks(data.data.books.map(b => ({ id: b.id, name: b.name })));
        } else {
          setBooks([]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive",
        });
      }
    };
    fetchBooks();
  }, [toast]);

  /** If edit mode, fetch existing data FIRST */
  useEffect(() => {
    if (!isEdit) return;
    
    const fetchRight = async () => {
      setLoadingData(true);
      try {
        const response = await getRightById(Number(id));
        const right: RightsPayload = response.data || response;
        
        console.log("Fetched right data:", right); // Debug log
        
        // Pre-fill form data
        setFormData(prev => ({
          ...prev,
          role: right.role?.toLowerCase() || "",
          personId: right.personId?.toString() || "",
          bookId: right.bookId || 0,
          advance: right.advancePaid?.toString() || "",
          royalties: right.royalties?.toString() || "",
          language: right.languages || "",
          country: right.country || "",
          currency: right.currency || "",
          state: right.state || "",
          active: right.isActive ?? true,
          publisherName: right.publisherName || "",
          advancePaidDate: right.advancePaidDate ? right.advancePaidDate.slice(0, 10) : "",
          domesticRights: Array.isArray(right.domesticRights) ? right.domesticRights : [],
          additionalNotes: right.additionalNotes || "",
        }));
      } catch (error) {
        console.error("Error fetching right:", error);
        toast({
          title: "Error",
          description: "Failed to load agreement data",
          variant: "destructive",
        });
        navigate("/agreements");
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchRight();
  }, [isEdit, id, toast, navigate]);

  /** Fetch available people when role changes, but don't clear personId in edit mode */
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
    
    // Only clear personId if not in edit mode or if role actually changed
    if (!isEdit && formData.role) {
      setFormData(prev => ({ ...prev, personId: "" }));
    }
  }, [formData.role, toast, isEdit]);

  /** Fetch states if country is India */
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
          setStates(["Andhra Pradesh", "Bihar", "Tamil Nadu", "Karnataka", "Kerala", "Maharashtra"]);
        });
    } else {
      setStates([]);
      // Don't clear state in edit mode unless country actually changed
      if (!isEdit) {
        setFormData(prev => ({ ...prev, state: "" }));
      }
    }
  }, [formData.country, isEdit]);

  /** Auto-fill currency based on country */
  /** Auto-fill currency based on country */
useEffect(() => {
  const selected = countries.find(c => c.name === formData.country);
  if (selected?.currencies?.[0]) {
    setFormData(prev => ({ ...prev, currency: selected.currencies[0] }));
  }
}, [formData.country, countries]);


  /** Handlers */
  const handleStringChange = (field: string, value: string) => {
    if (field === "additionalNotes" && value.length > 150) {
      toast({
        title: "Character Limit Exceeded",
        description: "Additional Notes can be maximum 150 characters.",
        variant: "destructive",
      });
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooleanChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /** Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personId || isNaN(Number(formData.personId)) || Number(formData.personId) <= 0) {
      toast({
        title: "Missing Fields",
        description: "Please select a valid person.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.bookId || isNaN(Number(formData.bookId)) || Number(formData.bookId) <= 0) {
      toast({
        title: "Missing Fields",
        description: "Please select a valid book.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.advance || !formData.royalties || !formData.language || !formData.country) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For edit mode, include advancePaidDate if it exists
      const advancePaidDate = formData.advancePaidDate 
        ? new Date(formData.advancePaidDate).toISOString()
        : new Date().toISOString();

      const payload: Partial<RightsPayload> = {
        rights: "SELLING",
        role: formData.role.toUpperCase() as PersonType,
        personId: Number(formData.personId),
        bookId: Number(formData.bookId),
        advancePaid: Number(formData.advance),
        advancePaidDate: advancePaidDate,
        royalties: Number(formData.royalties),
        languages: formData.language,
        country: formData.country,
        currency: formData.currency,
        state: formData.state,
        rightsType: "SELLING",
        isActive: formData.active,
        additionalNotes: formData.additionalNotes, // <-- Add this line
        ...(formData.country === "India"
          ? { domesticRights: formData.domesticRights }
          : { publisherName: formData.publisherName }),
      };

      if (isEdit) {
        await updateRight(Number(id), payload);
        toast({ title: "Updated", description: "Selling rights updated successfully" });
      } else {
        await createRight(payload as RightsPayload);
        toast({ title: "Created", description: "Selling rights added successfully" });
      }
      navigate("/agreements");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({ 
        title: "Error", 
        description: error?.response?.data?.message || "Failed to save selling rights", 
        variant: "destructive" 
      });
    }
  };

  // Show loading state while fetching data in edit mode
  if (isEdit && loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading agreement data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 pb-2 border-b flex items-center gap-4">
        <Button onClick={() => navigate("/agreements")} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
          {isEdit ? "Edit Selling Rights" : "Add Selling Rights"}
        </h1>
      </div>

      {/* Form Card */}
      <Card className="max-w-5xl mx-auto p-6 md:p-8 shadow-md space-y-6 border-slate-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-500">Publishing Rights Details</h2>
          <p className="text-slate-500 mt-1 text-sm">
            {isEdit ? "Edit agreement info to update selling rights." : "Enter agreement info to add selling rights."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div className="space-y-1.5">
              <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
              <Select value={formData.role} onValueChange={(value) => handleStringChange("role", value)}>
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

            {/* Name - Dynamic based on role */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.personId} 
                onValueChange={(value) => handleStringChange("personId", value)}
                disabled={!formData.role || loadingPeople}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !formData.role 
                      ? "Select role first"
                      : loadingPeople 
                      ? "Loading..."
                      : "Select name"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {loadingPeople ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    </SelectItem>
                  ) : availablePeople.length === 0 ? (
                    <SelectItem value="no-people" disabled>
                      No people available for this role
                    </SelectItem>
                  ) : (
                    availablePeople.map((person) => (
                      <SelectItem key={person.id} value={person.id.toString()}>
                        <div className="flex flex-col">
                          <span>{person.name}</span>
                          <span className="text-xs text-muted-foreground">{person.email}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Book Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="book">Book Name <span className="text-red-500">*</span></Label>
              <Select
                value={formData.bookId.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, bookId: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a book" />
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

            {/* Advance */}
            <div className="space-y-1.5">
              <Label htmlFor="advance">Advance Paid (₹) <span className="text-red-500">*</span></Label>
              <Input 
                type="number" 
                placeholder="Enter advance paid" 
                id="advance" 
                value={formData.advance} 
                onChange={(e) => handleStringChange("advance", e.target.value)} 
                required 
              />
            </div>

            {/* Advance Paid Date - Add this field */}
            <div className="space-y-1.5">
              <Label htmlFor="advancePaidDate">Advance Paid Date <span className="text-red-500">*</span></Label>
              <Input 
                type="date" 
                id="advancePaidDate"
                value={formData.advancePaidDate} 
                onChange={(e) => handleStringChange("advancePaidDate", e.target.value)} 
                required 
              />
            </div>

            {/* Royalties */}
            <div className="space-y-1.5">
              <Label htmlFor="royalties">Royalties (%) <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                id="royalties"
                min={0}
                max={100}
                step={0.1}
                placeholder="Enter royalties"
                value={formData.royalties}
                onChange={(e) => handleStringChange("royalties", e.target.value)}
                required
              />
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <Label htmlFor="language">Language <span className="text-red-500">*</span></Label>
              <Select value={formData.language} onValueChange={(value) => handleStringChange("language", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
              <Select value={formData.country} onValueChange={(value) => handleStringChange("country", value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading countries..." : "Select country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Input 
                id="currency" 
                placeholder="Enter currency" 
                value={formData.currency} 
                readOnly 
                className="bg-slate-100" 
              />
            </div>

            {/* State */}
            {formData.country === "India" && (
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => handleStringChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Active */}
            <div className="flex items-center gap-3 mt-3">
              <Label htmlFor="active" className="text-sm text-slate-600">Active Status</Label>
              <Switch 
                id="active" 
                checked={formData.active} 
                onCheckedChange={(val) => handleBooleanChange("active", val)} 
              />
              <span className="text-sm text-muted-foreground">
                {formData.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Rights Type (India vs International) */}
          {formData.country && (
            <div className="space-y-2">
              <Label>Rights Type <span className="text-red-500">*</span></Label>

              {formData.country === "India" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Book Rights", "Audio Rights", "Movie Rights", "E-Book Rights"].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-blue-500"
                        checked={formData.domesticRights.includes(type)}
                        onChange={(e) => {
                          const updated = new Set(formData.domesticRights);
                          e.target.checked ? updated.add(type) : updated.delete(type);
                          setFormData(prev => ({ ...prev, domesticRights: Array.from(updated) }));
                        }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="publisherName">Publisher Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="publisherName"
                    placeholder="Enter publisher name"
                    value={formData.publisherName}
                    onChange={(e) => handleStringChange("publisherName", e.target.value)}
                    required={formData.country !== "India"}
                  />
                </div>
              )}
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <Label>Additional Notes</Label>
            <Input
              type="text"
              placeholder="Enter any additional notes"
              value={formData.additionalNotes}
              onChange={e => handleStringChange("additionalNotes", e.target.value)}
              maxLength={150}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/agreements")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white px-6 hover:opacity-90">
              {isEdit ? "Update Selling Rights" : "Add Selling Rights"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSellingRights;
