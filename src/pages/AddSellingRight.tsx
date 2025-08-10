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
import { Person, RightsPayload ,RightsType} from "@/models/rights.model";
import { PersonType } from "@/models/people.model";
import { Book } from "@/models/book.model";
import { getBooks } from "@/services/book.service";
import Books from "./Books";

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

  const [formData, setFormData] = useState({
  role: "",
  personId: "",
  bookId: 0, // Ensure bookId is initialized
  advance: "",
  royalties: "",
  language: "",
  country: "",
  currency: "",
  state: "",
  active: true,
  domesticRights: [] as string[], // ✅ New field for India
  publisherName: "", // ✅ For international
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

  /** Fetch available people when role changes */
  useEffect(() => {
      const fetchPeople = async () => {
        if (!formData.role) {
          setAvailablePeople([]);
          return;
        }
        setLoadingPeople(true);
        try {
          const fetchedPersons = await getAllPersons();
          const filteredPeople = fetchedPersons.filter(person => person.personType.toLowerCase() === formData.role.toLowerCase());
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
      setFormData(prev => ({ ...prev, personId: "" }));
    }, [formData.role, toast]); 

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
      setFormData(prev => ({ ...prev, state: "" }));
    }
  }, [formData.country]);

  /** Auto-fill currency based on country */
  useEffect(() => {
    const selected = countries.find(c => c.name === formData.country);
    setFormData(prev => ({ ...prev, currency: selected?.currencies?.[0] || "" }));
  }, [formData.country, countries]);

  /** If edit mode, fetch existing data */
   useEffect(() => {
      if (!isEdit) return;
      const fetchRight = async () => {
        try {
          const data = await getRightById(Number(id));
          const right: RightsPayload = (data as { data: RightsPayload }).data;
          // Set role first, personId after people are loaded
          setFormData(prev => ({
            ...prev,
            role: right.role?.toLowerCase() || "",
            // personId will be set after people are loaded
            advancePaid: right.advancePaid?.toString() || "",
            advancePaidDate: right.advancePaidDate ? right.advancePaidDate.slice(0, 10) : "",
            royalties: right.royalties?.toString() || "",
            language: right.languages || "",
            country: right.country || "",
            currency: right.currency || "",
            state: "",
            active: right.isActive ?? true,
            rights: [] as string[],
rightsType: "" as RightsType

}));
          // Save personId to set after people are loaded
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              personId: right.personId?.toString() || "",
            }));
          }, 300); // Wait for people to load
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

  /** Fetch books on mount */
  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const data = await getBooks({ limit: 100 });
      // If data is an array of books
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

  /** Handlers */
  const handleStringChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooleanChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
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
    try {
      const payload: RightsPayload = {
  rights: "SELLING",
  role: formData.role as PersonType,
  personId: Number(formData.personId), // <-- Ensure this is a number
  bookId: Number(formData.bookId), // <-- Ensure this is a number
  advancePaid: Number(formData.advance),
  royalties: Number(formData.royalties),
  languages: formData.language,
  country: formData.country,
  currency: formData.currency,
  state: formData.state,
  rightsType: "SELLING", // ✅ Always selling
  isActive: formData.active,
  ...(formData.country === "India"
    ? { domesticRights: formData.domesticRights }
    : { publisherName: formData.publisherName }),
};

      if (isEdit) {
        await updateRight(Number(id), payload);
        toast({ title: "Updated", description: "Selling rights updated successfully" });
      } else {
        await createRight(payload);
        toast({ title: "Created", description: "Selling rights added successfully" });
      }
      navigate("/agreements");
    } catch (error) {
      toast({ title: "Error", description: "Failed to save selling rights", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 pb-2 border-b flex items-center gap-4">
        <Button color="blue" onClick={() => navigate("/agreements")} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Add Selling Rights</h1>
      </div>

      {/* Form Card */}
      <Card className="max-w-5xl mx-auto p-6 md:p-8 shadow-md space-y-6 border-slate-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-500">Publishing Rights Details</h2>
          <p className="text-slate-500 mt-1 text-sm">Enter agreement info to add selling rights.</p>
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
                  {["Proprietor", "Agencies", "Author", "Publisher"].map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
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
                      No people available
                    </SelectItem>
                  ) : (
                    availablePeople.map((person) => (
                      <SelectItem key={person.id} value={person.id.toString()}>
                        {person.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Advance */}
            <div className="space-y-1.5">
              <Label htmlFor="advance">Advance Paid (₹) <span className="text-red-500">*</span></Label>
              <Input type="number" placeholder="Enter advance paid" id="advance" value={formData.advance} onChange={(e) => handleStringChange("advance", e.target.value)} required />
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
              <Input id="currency" placeholder="Enter currency" value={formData.currency} readOnly className="bg-slate-100" />
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

            {/* Rights Type (India vs International) */}
            {formData.country && (
  <div className="space-y-2 md:col-span-2">
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
      <Select
        value={formData.publisherName}
        onValueChange={(value) => setFormData(prev => ({ ...prev, publisherName: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select publisher" />
        </SelectTrigger>
        <SelectContent>
          {availablePeople
            .filter(p => p.personType === "PUBLISHER")
            .map(pub => (
              <SelectItem key={pub.id} value={pub.id.toString()}>
                {pub.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    )}
  </div>
)}


            {/* Active */}
            <div className="flex items-center gap-3 mt-3">
              <Label htmlFor="active" className="text-sm text-slate-600">Active Status</Label>
              <Switch id="active" checked={formData.active} onCheckedChange={(val) => handleBooleanChange("active", val)} />
              <span className="text-sm text-muted-foreground">{formData.active ? "Active" : "Inactive"}</span>
            </div>
          </div>

          {/* Book Name Field */}
          <div>
            <label className="block mb-1 font-medium">
              Book Name <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.bookId}
              onChange={e => setFormData(prev => ({ ...prev, bookId: Number(e.target.value) }))}
              required
            >
              <option value={0}>Select a book</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" className="bg-gray-500 text-white px-6 hover:bg-red-300 " onClick={() => navigate("/agreements")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white px-6 hover:opacity-90">
              Add Selling Rights
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSellingRights;

console.log("Books state:", Books);
