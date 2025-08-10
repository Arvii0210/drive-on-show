import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { OwnPublishingService } from "@/services/own-publishing.service";
import { getAllPersons } from "@/services/people.service";
import { getBooks } from "@/services/book.service";
import { Book } from "@/models/book.model";
import { OrderType, PersonType } from "@/models/own-publishing.model";

// Define Person interface
interface Person {
  id: number;
  name: string;
  personType: string;
}

const AddOwnPublishing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for books data
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const [formData, setFormData] = useState({
    bookId: "",
    role: "Author",
    personName: "",
    orderType: "",
    percentage: "",
    customPercentage: "",
    numberOfCopies: 10,
    bookPrice: 0,
    receivedAmount: 0,
    editorYear: "",
  });

  const [calculations, setCalculations] = useState({
    totalPrice: 0,
    royalty: 0,
    companyRoyalty: 0,
  });

  const [availablePeople, setAvailablePeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      try {
        const fetchedBooks = await getBooks();
        // Safely handle the response
        if (fetchedBooks && fetchedBooks.books) {
          setBooks(fetchedBooks.books);
        } else {
          console.warn("Unexpected books data structure:", fetchedBooks);
          setBooks([]);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        toast({
          title: "Error",
          description: "Failed to load books data",
          variant: "destructive",
        });
        setBooks([]);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, [toast]);

  // Safely find the selected book
  const selectedBook = books && formData.bookId
    ? books.find(book => book && book.id === parseInt(formData.bookId))
    : undefined;

  // Fetch people when role changes
  useEffect(() => {
    const fetchPeople = async () => {
      if (!formData.role) {
        setAvailablePeople([]);
        return;
      }
      setLoadingPeople(true);
      try {
        const fetchedPersons = await getAllPersons();
        if (Array.isArray(fetchedPersons)) {
          const filteredPeople = fetchedPersons.filter(person => 
            person && person.personType && 
            person.personType.toLowerCase() === formData.role.toLowerCase()
          );
          setAvailablePeople(filteredPeople);
        } else {
          console.warn("Unexpected people data structure:", fetchedPersons);
          setAvailablePeople([]);
        }
      } catch (error) {
        console.error("Error fetching people:", error);
        toast({
          title: "Error",
          description: "Failed to fetch people for selected role",
          variant: "destructive",
        });
        setAvailablePeople([]);
      } finally {
        setLoadingPeople(false);
      }
    };
    
    fetchPeople();
    setFormData(prev => ({ ...prev, personName: "" }));
  }, [formData.role, toast]);

  useEffect(() => {
    if (selectedBook) {
      setFormData((prev) => ({
        ...prev,
        bookPrice: selectedBook.price || 0,
        editorYear: selectedBook.edition || "",
      }));
    }
  }, [selectedBook]);

  useEffect(() => {
    calculateRoyalty();
  }, [
    formData.role,
    formData.orderType,
    formData.percentage,
    formData.customPercentage,
    formData.numberOfCopies,
    formData.bookPrice,
    formData.receivedAmount,
  ]);

  const calculateRoyalty = () => {
    const { role, orderType, percentage, customPercentage, numberOfCopies, bookPrice } = formData;

    if (!orderType || !numberOfCopies || (!bookPrice && orderType !== "Library Orders")) {
      setCalculations({ totalPrice: 0, royalty: 0, companyRoyalty: 0 });
      return;
    }

    let totalPrice = numberOfCopies * bookPrice;
    let baseAmount = 0;
    let royaltyRate = 0;

    switch (orderType) {
      case "Library Orders":
        baseAmount = totalPrice;
        royaltyRate = 0.08;
        break;

      case "Special Scheme":
        baseAmount = totalPrice * 0.6;
        royaltyRate = 0.04;
        break;

      case "Normal Orders":
        const perc = parseInt(percentage);
        if (perc === 35) {
          baseAmount = totalPrice * 0.65;
          if (role === "Author") {
            royaltyRate = 0.15;
          } else if (role === "Translator" || role === "Editor") {
            royaltyRate = 0.075;
          } else if (["Proprietor", "Agency", "Publisher"].includes(role)) {
            royaltyRate = parseFloat(customPercentage) / 100 || 0;
          }
        } else if (perc === 40 || perc === 45) {
          baseAmount = totalPrice * (perc === 40 ? 0.6 : 0.55);
          if (role === "Author") {
            royaltyRate = 0.10;
          } else if (role === "Translator" || role === "Editor") {
            royaltyRate = 0.05;
          } else if (["Proprietor", "Agency", "Publisher"].includes(role)) {
            royaltyRate = parseFloat(customPercentage) / 100 || 0;
          }
        }
        break;

      default:
        baseAmount = 0;
        royaltyRate = 0;
    }

    const royalty = Math.round(baseAmount * royaltyRate);
    const companyRoyalty = baseAmount - royalty;

    setCalculations({
      totalPrice,
      royalty,
      companyRoyalty,
    });
  };

  // Helper to map UI role to PersonType
  const roleToPersonType = (role: string): PersonType => {
    switch (role) {
      case "Author":
        return "AUTHOR";
      case "Translator":
        return "TRANSLATOR";
      case "Editor":
        return "EDITOR";
      case "Proprietor":
        return "PROPRIETOR";
      case "Agency":
        return "AGENCY";
      case "Publisher":
        return "PUBLISHER";
      default:
        throw new Error("Invalid role");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bookId || !formData.orderType || !formData.personName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (["Proprietor", "Agency", "Publisher"].includes(formData.role) && 
        formData.orderType === "Normal Orders" && 
        !formData.customPercentage) {
      toast({
        title: "Error",
        description: "Please enter the percentage for this role",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Safely find the selected person
      const personObj = availablePeople && Array.isArray(availablePeople)
        ? availablePeople.find(person => person && person.name === formData.personName)
        : undefined;
      
      if (!personObj) {
        throw new Error("Selected person not found");
      }
      
      const personId = personObj.id;
      const numericBookId = parseInt(formData.bookId);

      const payload = {
        bookId: numericBookId,
        personId: personId,
        personRole: roleToPersonType(formData.role),
        orderType: formData.orderType as OrderType,
        discount: formData.percentage ? parseInt(formData.percentage) : undefined,
        customPercentage: formData.customPercentage
          ? parseFloat(formData.customPercentage)
          : undefined,
        numberOfCopies: Number(formData.numberOfCopies),
        // Include any other required fields from your API model
      };

      await OwnPublishingService.create(payload);

      toast({
        title: "Success",
        description: "Own Publishing record added successfully!",
      });

      navigate("/rights/own-publishing");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to create record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const showPercentageDropdown =
    formData.orderType &&
    formData.orderType !== "Library Orders" &&
    formData.orderType !== "Special Scheme";

  const showCustomPercentageInput = 
    showPercentageDropdown && 
    ["Proprietor", "Agency", "Publisher"].includes(formData.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/rights/own-publishing")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          Add Own Publishing
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Publishing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Selection */}
              <div className="space-y-2">
                <Label htmlFor="book">Book *</Label>
                <Select
                  value={formData.bookId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, bookId: value }))
                  }
                  disabled={loading || loadingBooks}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingBooks ? "Loading books..." : "Select a book"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingBooks ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading books...
                        </div>
                      </SelectItem>
                    ) : !books || books.length === 0 ? (
                      <SelectItem value="no-books" disabled>
                        No books available
                      </SelectItem>
                    ) : (
                      books.map((book) => (
                        <SelectItem key={book.id} value={book.id.toString()}>
                          {book.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Editor Year (readonly) */}
              <div className="space-y-2">
                <Label htmlFor="editorYear">Editor Year</Label>
                <Input
                  id="editorYear"
                  value={formData.editorYear}
                  readOnly
                  className="bg-muted"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Author">Author</SelectItem>
                    <SelectItem value="Translator">Translator</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Proprietor">Proprietor</SelectItem>
                    <SelectItem value="Agency">Agency</SelectItem>
                    <SelectItem value="Publisher">Publisher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Person Name Selection */}
              <div className="space-y-2">
                <Label htmlFor="personName">Name *</Label>
                <Select
                  value={formData.personName}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, personName: value }))
                  }
                  disabled={loadingPeople || !formData.role || loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !formData.role 
                        ? "Select role first"
                        : loadingPeople 
                        ? "Loading..."
                        : `Select ${formData.role.toLowerCase()}`
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
                    ) : !availablePeople || availablePeople.length === 0 ? (
                      <SelectItem value="no-people" disabled>
                        No {formData.role.toLowerCase()}s available
                      </SelectItem>
                    ) : (
                      availablePeople.map((person) => (
                        <SelectItem key={person.id} value={person.name}>
                          {person.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Order Type */}
              <div className="space-y-2">
                <Label htmlFor="orderType">Order Type *</Label>
                <Select
                  value={formData.orderType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, orderType: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal Orders">Normal Orders</SelectItem>
                    <SelectItem value="Library Orders">Library Orders</SelectItem>
                    <SelectItem value="Special Scheme">Special Scheme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Percentage (conditional) */}
              {showPercentageDropdown && !showCustomPercentageInput && (
                <div className="space-y-2">
                  <Label htmlFor="percentage">Discount Percentage</Label>
                  <Select
                    value={formData.percentage}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, percentage: value }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select percentage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="35">35%</SelectItem>
                      <SelectItem value="40">40%</SelectItem>
                      <SelectItem value="45">45%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Custom Percentage Input for Proprietor, Agency, Publisher */}
              {showCustomPercentageInput && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="percentage">Discount Percentage</Label>
                    <Select
                      value={formData.percentage}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, percentage: value }))
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="35">35%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="45">45%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customPercentage">Royalty Percentage *</Label>
                    <Input
                      id="customPercentage"
                      type="number"
                      placeholder="Enter percentage (e.g., 12)"
                      value={formData.customPercentage}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, customPercentage: e.target.value }))
                      }
                      min="0"
                      max="100"
                      step="0.1"
                      disabled={loading}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the royalty percentage for {formData.role.toLowerCase()}
                    </p>
                  </div>
                </>
              )}

              {/* Number of Copies */}
              <div className="space-y-2">
                <Label htmlFor="copies">Number of Copies</Label>
                <Input
                  id="copies"
                  type="number"
                  value={formData.numberOfCopies}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      copies: parseInt(e.target.value) || 0,
                    }))
                  }
                  min="1"
                  disabled={loading}
                />
              </div>

              {/* Book Price (readonly) */}
              <div className="space-y-2">
                <Label htmlFor="bookPrice">Book Price</Label>
                <Input
                  id="bookPrice"
                  type="number"
                  value={formData.bookPrice}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || loadingBooks || loadingPeople}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Add Publishing Record"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Calculations Section - Remains the same */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Calculations</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {selectedBook && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Book Details</h3>
                <p>
                  <span className="font-medium">Title:</span> {selectedBook.name}
                </p>
                <p>
                  <span className="font-medium">Price:</span> ₹{selectedBook.price}
                </p>
                {selectedBook.edition && (
                  <p>
                    <span className="font-medium">Edition:</span> {selectedBook.edition}
                  </p>
                )}
              </div>
            )}

            {/* Rest of the calculations section remains the same */}
            {formData.personName && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Selected Person</h3>
                <p>
                  <span className="font-medium">Role:</span> {formData.role}
                </p>
                <p>
                  <span className="font-medium">Name:</span> {formData.personName}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {/* Total Price */}
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
                <span className="font-medium">Total Price:</span>
                <span className="font-bold text-lg">
                  ₹{calculations.totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Royalty */}
              <div className="flex flex-col gap-1 p-3 bg-primary/10 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Your Royalty:</span>
                  <span className="font-bold text-lg text-primary">
                    ₹{calculations.royalty.toFixed(2)} (
                    {calculations.companyRoyalty + calculations.royalty > 0
                      ? `${(
                          (calculations.royalty /
                            (calculations.companyRoyalty + calculations.royalty)) *
                          100
                        ).toFixed(2)}%`
                      : "0%"}
                    )
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                   ⓘ This value is rounded to the nearest whole number.
                </span>
              </div>
            </div>

            {/* Calculation Explanation */}
            {formData.orderType && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Calculation Method:</h4>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {(() => {
                    switch (formData.orderType) {
                      case "Library Orders":
                        return (
                          <>
                            <strong>Type: Library Orders ({formData.role})</strong>
                            <br />
                            Formula: <code>Copies × Book Price × 8%</code>
                            <br />
                            {formData.numberOfCopies} × ₹{formData.bookPrice} × 8% = ₹
                            {(formData.numberOfCopies * formData.bookPrice * 0.08).toFixed(2)}
                          </>
                        );
                      case "Special Scheme":
                        return (
                          <>
                            <strong>Type: Special Scheme ({formData.role})</strong>
                            <br />
                            Formula: <code>Copies × Book Price × 60% × 4%</code>
                            <br />
                            {formData.numberOfCopies} × ₹{formData.bookPrice} × 60% × 4% = ₹
                            {(
                              formData.numberOfCopies *
                              formData.bookPrice *
                              0.6 *
                              0.04
                            ).toFixed(2)}
                          </>
                        );
                      case "Normal Orders":
                        let royaltyPercent = "0%";
                        if (formData.role === "Author") {
                          royaltyPercent =
                            formData.percentage === "35"
                              ? "15%"
                              : formData.percentage === "40" ||
                                formData.percentage === "45"
                              ? "10%"
                              : "0%";
                        } else if (
                          formData.role === "Translator" ||
                          formData.role === "Editor"
                        ) {
                          royaltyPercent =
                            formData.percentage === "35"
                              ? "7.5%"
                              : formData.percentage === "40" ||
                                formData.percentage === "45"
                              ? "5%"
                              : "0%";
                        } else if (["Proprietor", "Agency", "Publisher"].includes(formData.role)) {
                          royaltyPercent = formData.customPercentage ? `${formData.customPercentage}%` : "0%";
                        }
                        return (
                          <>
                            <strong>
                              Type: Normal Orders ({formData.percentage}% Discount) - {formData.role}
                            </strong>
                            <br />
                            Formula: <code>Copies × Book Price × Base% × Royalty%</code>
                            <br />
                            {formData.numberOfCopies} × ₹{formData.bookPrice} × Base × {royaltyPercent} = ₹
                            {calculations.royalty.toFixed(2)}
                            {["Proprietor", "Agency", "Publisher"].includes(formData.role) && (
                              <>
                                <br />
                                <em>Custom royalty rate: {formData.customPercentage || 0}%</em>
                              </>
                            )}
                          </>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddOwnPublishing;
