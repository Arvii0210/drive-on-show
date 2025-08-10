import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Person, Category, CoverType, OwnType } from "@/models/book.model";
import { createBook, getBookById, updateBook } from "@/services/book.service";
import { getAllPersons } from "@/services/people.service";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const AddBook = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const isEditMode = Boolean(id);
  const { toast } = useToast();

  const [bookData, setBookData] = useState({
    name: "",
    orginalName: "",
    authorId: 0,
    translatorId: undefined,
    editorId: undefined,
    isbn: "",
    Language: "",
    ownType: OwnType.COMPILING,
    category: Category.FICTION,
    description: "",
    pageCount: 0,
    edition: "",
    year: new Date().getFullYear(),
    publicationDate: new Date(),
    printRun: 0,
    price: 0,
    coverType: CoverType.PAPER_BAG,
    dimensions: "",
    weight: 0,
    reviews: "",
    awards: "",
    additionalNotes: "",
  });

  const [persons, setPersons] = useState<Person[]>([]);
  const [authors, setAuthors] = useState<Person[]>([]);
  const [translators, setTranslators] = useState<Person[]>([]);
  const [loadingTranslators, setLoadingTranslators] = useState(true);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
 const fetchBookData = async () => {
  if (isEditMode && id) {
    setLoading(true);
    try {
      const book = await getBookById(parseInt(id)); // fetch
      console.log("Fetched book:", book); // still safe to inspect

      if (book) {
        setBookData(prev => ({
          ...prev,
          ...book,  
          authorId: book.authorId ?? 0,
          translatorId: book.translatorId ?? undefined,
          editorId: book.editorId ?? undefined,
          weight: book.weight ?? 0,
          price: book.price ?? 0,
          publicationDate: book.publicationDate ? new Date(book.publicationDate * 1000) : new Date(),
          ownType: book.ownType as OwnType,
          coverType: book.coverType as CoverType,
          category: book.category as Category,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch book", err);
      toast({ title: "Error", description: "Failed to fetch book", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }
};



  fetchBookData();
}, [id, isEditMode, toast]);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const fetchedPersons = await getAllPersons();
        setPersons(fetchedPersons);
        setAuthors(fetchedPersons.filter((person) => person.personType === 'AUTHOR'));
        setTranslators(fetchedPersons.filter((person) => person.personType === 'TRANSLATOR'));
      } catch (err) {
        console.error("Failed to fetch persons", err);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setLoadingTranslators(false);
      }
    };

    fetchPersons();
  }, [toast]);

const validateForm = () => {
    const requiredFields = ["name", "authorId", "isbn", "Language", "category", "edition", "year"];
    for (const field of requiredFields) {
      if (!bookData[field as keyof typeof bookData]) {
        toast({ title: "Validation Error", description: `Fill ${field}`, variant: "destructive" });
        return false;
      }
    }
    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = { 
      ...bookData, 
      
      publicationDate: Math.floor(bookData.publicationDate.getTime() / 1000) 
    };

    try {
const fieldsToRemove = [
  'status',
  'id',
  'message',
  'data',         
  'createdAt',
  'updatedAt',
  'deletedAt',
  'timestamp',
  'author',
  'editor',
  'agency',
  'publisher',
  'proprietor',
  'proprietorId',
  'agencyId',
  'revenueShare',
  'publisherId',
  'ownPublishings',
  'rights',
];

fieldsToRemove.forEach(key => delete payload[key]);


  if (isEditMode && id) {
    await updateBook(parseInt(id), payload);
    toast({ title: "Success!", description: "Book updated successfully" });
  } else {
    await createBook(payload);
    toast({ title: "Success!", description: "Book added successfully" });
  }
  navigate("/books");
} catch (err: any) {
  console.error("Create book error:", err);
  toast({
    title: "Error",
    description: err?.message || "Something went wrong",
    variant: "destructive"
  });
}
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];
    for (let y = currentYear; y >= currentYear - 150; y--) {
      years.push(y.toString());
    }
    return years;
  };

  const handleInputChange = (field: string, value: string | number) =>
    setBookData(prev => ({ ...prev, [field]: value }));

  const handleDateChange = (date?: Date) =>
    setBookData(prev => ({ ...prev, publicationDate: date || new Date() }));

  const handleReset = () => {
    setBookData({
      name: "",
      orginalName: "",
      authorId: 0,
      translatorId: undefined,
      editorId: undefined,
      isbn: "",
      Language: "",
      ownType: OwnType.COMPILING,
      category: Category.FICTION,
      description: "",
      pageCount: 0,
      edition: "",
      year: new Date().getFullYear(),
      publicationDate: new Date(),
      printRun: 0,
      price: 0,
      coverType: CoverType.PAPER_BAG,
      dimensions: "",
      weight: 0,
      reviews: "",
      awards: "",
      additionalNotes: "",
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/books")}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Books
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Book</h1>
          <p className="text-gray-600">Fill in details and save.</p>
        </div>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid gap-6 md:grid-cols-2">
            <div>
              <Label>Book Title *</Label>
              <Input placeholder="Enter book title" value={bookData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
            </div>
            <div>
              <Label>Original Title</Label>
              <Input placeholder="Enter original title" value={bookData.orginalName} onChange={(e) => handleInputChange("orginalName", e.target.value)} />
            </div>
            <div>
              <Label>Author Name *</Label>
              <Select value={bookData.authorId.toString()} onValueChange={(v) => handleInputChange("authorId", Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder={authors.length === 0 ? "Loading..." : "Select author"} />
                </SelectTrigger>
                <SelectContent>
                  {authors.length === 0 ? (
                    <SelectItem disabled value="none">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />Loading...
                    </SelectItem>
                  ) : (
                    authors.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>ISBN *</Label>
              <Input placeholder="xxx-xx-xxxx-xxx-x" value={bookData.isbn} onChange={(e) => handleInputChange("isbn", e.target.value)} required />
            </div>
            <div>
              <Label>Language *</Label>
              <Select value={bookData.Language} onValueChange={(v) => handleInputChange("Language", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {["Tamil", "English", "Hindi", "Telugu", "Malayalam", "Bengali", "Marathi", "Gujarati", "Kannada", "Odia", "Punjabi", "Assamese", "Urdu", "Sanskrit"].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={bookData.category} onValueChange={(v) => handleInputChange("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Category).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Edition Year *</Label>
              <Input type="number" min="1800" max={new Date().getFullYear()} placeholder="Enter edition year" value={bookData.year} onChange={(e) => handleInputChange("year", Number(e.target.value))} required />
            </div>
            <div>
              <Label>Published Year</Label>
              <Select value={bookData.year.toString()} onValueChange={(v) => handleInputChange("year", Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {generateYearOptions().map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow border-0 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="bg-orange-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">Contributors</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-orange-50 p-4 rounded border">
              <h4 className="font-semibold mb-3">Book Type</h4>
              <div className="space-y-2">
                <Label>Select Own Type *</Label>
                <Select
                  value={bookData.ownType}
                  onValueChange={(v) => handleInputChange("ownType", v as OwnType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OwnType.COMPILING}>Compiling</SelectItem>
                    <SelectItem value={OwnType.TRANSLATION}>Translation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {bookData.ownType === OwnType.TRANSLATION && (
              <div className="bg-blue-50 p-4 rounded border">
                <h4 className="font-semibold mb-3">Translator Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Translator Name</Label>
                    <Select
                      value={bookData.translatorId?.toString()}
                      onValueChange={(v) => handleInputChange("translatorId", Number(v))}
                      disabled={loadingTranslators}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingTranslators ? "Loading..." : "Select translator"} />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingTranslators ? (
                          <SelectItem value="loading" disabled>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Loading...
                          </SelectItem>
                        ) : translators.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No translators available
                          </SelectItem>
                        ) : (
                          translators.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">📖 Publication Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-green-700 font-semibold">Description</Label>
                <Textarea
                  placeholder="Enter a detailed description of the book..."
                  value={bookData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[120px] border-green-200 focus:border-green-400 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageCount" className="text-green-700 font-semibold">Page Count</Label>
                <Input
                  id="pageCount"
                  placeholder="Number of pages"
                  value={bookData.pageCount}
                  onChange={(e) => handleInputChange("pageCount", parseInt(e.target.value) || 0)}
                  className="border-green-200 focus:border-green-400 focus:ring-green-200"
                  type="number"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edition" className="text-green-700 font-semibold">Edition *</Label>
                <Input
                  id="edition"
                  placeholder="Enter edition"
                  value={bookData.edition}
                  onChange={(e) => handleInputChange("edition", e.target.value)}
                  className="border-green-200 focus:border-green-400 focus:ring-green-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-700 font-semibold">Publication Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-green-200 hover:border-green-400",
                        !bookData.publicationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookData.publicationDate ? format(bookData.publicationDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookData.publicationDate}
                      onSelect={(date) => handleDateChange(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="printRun" className="text-green-700 font-semibold">Print Run</Label>
                <Input
                  id="printRun"
                  placeholder="Number of copies printed"
                  value={bookData.printRun}
                  onChange={(e) => handleInputChange("printRun", parseInt(e.target.value) || 0)}
                  className="border-green-200 focus:border-green-400 focus:ring-green-200"
                  type="number"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-green-700 font-semibold">MRP (₹)</Label>
                <Input
                  id="price"
                  placeholder="Enter MRP"
                  value={bookData.price}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  className="border-green-200 focus:border-green-400 focus:ring-green-200"
                  type="number"
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverType" className="text-green-700 font-semibold">Cover Type</Label>
                <Select
                  value={bookData.coverType}
                  onValueChange={(value) => handleInputChange('coverType', value)}
                >
                  <SelectTrigger className="border-green-200 focus:border-green-400">
                    <SelectValue placeholder="Select cover type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CoverType).map((type) => (
                      <SelectItem key={type} value={type}>
                        📘 {type.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions" className="text-green-700 font-semibold">Dimensions</Label>
                <Input
                  id="dimensions"
                  placeholder="e.g., 5.5 x 8.5 inches"
                  value={bookData.dimensions}
                  onChange={(e) => handleInputChange("dimensions", e.target.value)}
                  className="border-green-200 focus:border-green-400 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-green-700 font-semibold">Weight (grams)</Label>
                <Input
                  id="weight"
                  placeholder="Weight in grams"
                  value={bookData.weight}
                  onChange={(e) => handleInputChange("weight", parseInt(e.target.value) || 0)}
                  className="border-green-200 focus:border-green-400 focus:ring-green-200"
                  type="number"
                  min="1"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-green-700 font-semibold">Reviews</Label>
                <Textarea
                  placeholder="Notable reviews and feedback..."
                  value={bookData.reviews}
                  onChange={(e) => handleInputChange("reviews", e.target.value)}
                  className="min-h-[100px] border-green-200 focus:border-green-400 focus:ring-green-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-teal-50">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">✨ Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-teal-700 font-semibold">Awards & Recognition</Label>
              <Textarea
                placeholder="List any awards, recognitions, or awards received for the book"
                value={bookData.awards}
                onChange={(e) => handleInputChange("awards", e.target.value)}
                className="min-h-[80px] border-teal-200 focus:border-teal-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-teal-700">Additional Notes</Label>
              <Textarea
                placeholder="Additional notes"
                value={bookData.additionalNotes}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                className="min-h-[100px] border-teal-200 focus:border-teal-400"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/books")}
            className="border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-primary hover:opacity-90 px-8"
          >
            Save Book
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
