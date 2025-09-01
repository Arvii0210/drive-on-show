import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Loader2, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  OrderType,
  OwnPublishingCreatePayload,
  PersonRole,
  PublishingStatus,
  PublishingStatusLabels,
} from "@/models/own-publishing.model";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const YOUR_BASE64_LOGO_STRING =
  "data:image/jpeg;base64,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";
interface Person {
  id: number;
  name: string;
  personType: string;
}
const AddOwnPublishing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const isEditMode = !!id;
  const [books, setBooks] = useState<Book[]>([]);
const [allBookPublishings, setAllBookPublishings] = useState([]);
const [loadingAllBookPublishings, setLoadingAllBookPublishings] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [formData, setFormData] = useState({
    bookId: "",
    bookName: "",
    editionYear: "",
    role: "Author",
    personName: "",
    orderType: "",
    percentage: "",
    customDiscountPercentage: "",
    customRoyaltyPercentage: "",
    numberOfCopies: 0,
    bookPrice: 0,
    receivedAmount: 0,
    status: "PENDING" as PublishingStatus,
  });
  const [calculations, setCalculations] = useState({
    totalPrice: 0,
    royalty: 0,
    companyRoyalty: 0,
  });
  const [availablePeople, setAvailablePeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const personRoleEnumToUI = (role: PersonRole): string => {
    const roleMap: Record<PersonRole, string> = {
      AUTHOR: "Author",
      TRANSLATOR: "Translator",
      EDITOR: "Editor",
      PROPRIETOR: "Proprietor",
      AGENCY: "Agency",
      PUBLISHER: "Publisher",
    };
    return roleMap[role];
  };
  const orderTypeEnumToUI = (orderType: OrderType): string => {
    const orderTypeMap: Record<OrderType, string> = {
      NORMAL: "Normal Orders",
      LIBRARY: "Library Orders",
      SPECIAL_SCHEME: "Special Scheme",
      EBOOK: "Ebook",
      AUDIOBOOK: "Audiobook",
      MOVIEBOOK: "Moviebook",
    };
    return orderTypeMap[orderType];
  };
  const extraOrderTypes = ["Ebook", "Audiobook", "Moviebook"];
  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      try {
        const fetchedBooks = await getBooks();
        console.log("Fetched books:", fetchedBooks); // <-- Add this line
        const bookArray = Array.isArray(fetchedBooks.data?.books)
          ? fetchedBooks.data.books
          : [];
        setBooks(bookArray);
      } catch (error) {
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
  const selectedBook = books.find(
    (book) => book.id.toString() === formData.bookId
  );

  useEffect(() => {
  if (!formData.bookId) {
    setAllBookPublishings([]);
    return;
  }
  setLoadingAllBookPublishings(true);
  OwnPublishingService.getAll({ bookId: Number(formData.bookId) })
    .then((res) => {
      // Your API returns { ownPublishings: [...] }
      const arr = Array.isArray(res?.ownPublishings) ? res.ownPublishings : [];
      setAllBookPublishings(arr);
    })
    .catch(() => setAllBookPublishings([]))
    .finally(() => setLoadingAllBookPublishings(false));
}, [formData.bookId]);



 useEffect(() => {
  if (!isEditMode || loadingBooks) return;
  setLoadingEdit(true);
  OwnPublishingService.getById(Number(id))
    .then((data) => {
      const matchedBook =
        books.find((b) => b.name === data.bookName) ||
        books.find((b) => b.id === data.bookId);
      let initialPercentage = data.discount?.toString() || "";
      let initialCustomDiscountPercentage = "";

      if (
        data.orderType === "NORMAL" &&
        data.discount &&
        ![35, 40, 45].includes(data.discount)
      ) {
        initialPercentage = "Other";
        initialCustomDiscountPercentage = data.discount.toString();
      } else if (
        ["EBOOK", "AUDIOBOOK", "MOVIEBOOK"].includes(data.orderType)
      ) {
        // For extra order types, always use custom discount
        initialCustomDiscountPercentage = data.discount?.toString() || "";
      }

      setFormData({
        bookId: matchedBook?.id.toString() || "",
        bookName: data.bookName || "",
        editionYear:
          (matchedBook?.editionYear ?? data.editionYear)?.toString() || "",
        role: personRoleEnumToUI(data.personRole),
        personName: data.personName,
        orderType: orderTypeEnumToUI(data.orderType),
        percentage: initialPercentage,
        customDiscountPercentage: initialCustomDiscountPercentage,
        customRoyaltyPercentage: data.percentage?.toString() || "",
        numberOfCopies: data.numberOfCopies,
        bookPrice: matchedBook?.price ?? data.bookPrice,
        // Set receivedAmount from API data
        receivedAmount: data.receivedAmount || 0,
        status: data.status || "PENDING",
      });
    })
    .catch(() => {
      toast({
        title: "Error",
        description: "Failed to load publishing record",
        variant: "destructive",
      });
      navigate("/rights/own-publishing");
    })
    .finally(() => setLoadingEdit(false));
}, [isEditMode, id, toast, navigate, books, loadingBooks]);



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
          const filteredPeople = fetchedPersons.filter(
            (p) => p.personType?.toLowerCase() === formData.role.toLowerCase()
          );
          setAvailablePeople(filteredPeople);
        } else {
          setAvailablePeople([]);
        }
      } catch {
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
    setFormData((prev) => ({ ...prev, personName: "" }));
  }, [formData.role, toast]);
  useEffect(() => {
    if (selectedBook) {
      setFormData((prev) => ({
        ...prev,
        bookName: selectedBook.name,
        editionYear: selectedBook.editionYear?.toString() || "",
        bookPrice: selectedBook.price || 0,
      }));
    } else {
      if (!isEditMode) {
        setFormData((prev) => ({
          ...prev,
          bookName: "",
          editionYear: "",
          bookPrice: 0,
        }));
      }
    }
  }, [selectedBook, isEditMode]);
  useEffect(() => {
    calculateRoyalty();
  }, [
    formData.role,
    formData.orderType,
    formData.percentage,
    formData.customDiscountPercentage,
    formData.customRoyaltyPercentage,
    formData.numberOfCopies,
    formData.bookPrice,
    formData.receivedAmount,
  ]);
  const calculateRoyalty = () => {
    const {
      role,
      orderType,
      percentage,
      customDiscountPercentage,
      customRoyaltyPercentage,
      numberOfCopies,
      bookPrice,
      receivedAmount,
    } = formData;

    if (!orderType) {
      setCalculations({ totalPrice: 0, royalty: 0, companyRoyalty: 0 });
      return;
    }

    // Special case for Ebook
    if (orderType === "Ebook") {
      const amount = receivedAmount || 0;
      const royaltyRate = (parseFloat(customRoyaltyPercentage) || 0) / 100;
      const royalty = Math.round(amount * royaltyRate);

      setCalculations({
        totalPrice: amount,
        royalty,
        companyRoyalty: amount - royalty,
      });
      return;
    }

    // For other order types, continue with your existing logic
    if (
      !numberOfCopies ||
      numberOfCopies <= 0 ||
      (bookPrice <= 0 && orderType !== "Library Orders")
    ) {
      setCalculations({ totalPrice: 0, royalty: 0, companyRoyalty: 0 });
      return;
    }

    // Rest of your existing calculation logic
    let totalPrice = numberOfCopies * bookPrice;
    let baseAmount = 0;
    let royaltyRate = 0;

    if (["Audiobook", "Moviebook"].includes(orderType)) {
      const discount = parseFloat(customDiscountPercentage) || 0;
      baseAmount = totalPrice * ((100 - discount) / 100);
      royaltyRate = parseFloat(customRoyaltyPercentage) / 100 || 0;
      const royalty = Math.round(baseAmount * royaltyRate);
      setCalculations({
        totalPrice,
        royalty,
        companyRoyalty: baseAmount - royalty,
      });
      return;
    }

    // The rest of your switch statement for other order types
    switch (orderType) {
      case "Library Orders":
        baseAmount = totalPrice;
        royaltyRate = 0.08;
        break;
      case "Special Scheme":
        baseAmount = totalPrice * 0.6;
        royaltyRate = 0.04;
        break;
      case "Normal Orders": {
        let actualDiscountPercentage =
          percentage === "Other"
            ? parseFloat(customDiscountPercentage) || 0
            : parseInt(percentage) || 0;
        baseAmount = totalPrice * ((100 - actualDiscountPercentage) / 100);
        if (role === "Author") {
          royaltyRate = actualDiscountPercentage === 35 ? 0.15 : 0.1;
        } else if (["Translator", "Editor"].includes(role)) {
          royaltyRate = actualDiscountPercentage === 35 ? 0.075 : 0.05;
        } else {
          royaltyRate = parseFloat(customRoyaltyPercentage) / 100 || 0;
        }
        break;
      }
      default:
        baseAmount = 0;
        royaltyRate = 0;
    }

    const royalty = Math.round(baseAmount * royaltyRate);
    const companyRoyalty = baseAmount - royalty;
    setCalculations({ totalPrice, royalty, companyRoyalty });
  };

  const orderTypeToEnum = (orderType: string): OrderType => {
    switch (orderType) {
      case "Normal Orders":
        return "NORMAL";
      case "Library Orders":
        return "LIBRARY";
      case "Special Scheme":
        return "SPECIAL_SCHEME";
      case "Ebook":
        return "EBOOK";
      case "Audiobook":
        return "AUDIOBOOK";
      case "Moviebook":
        return "MOVIEBOOK";
      default:
        throw new Error("Invalid order type");
    }
  };
  const roleToPersonType = (role: string): PersonRole => {
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
    if (
      !formData.bookName ||
      !formData.orderType ||
      !formData.personName ||
      !formData.role
    ) {
      toast({
        title: "Error",
        description:
          "Please fill in all required fields (Book, Role, Name, Order Type)",
        variant: "destructive",
      });
      return;
    }
    if (
      formData.bookPrice <= 0 &&
      !extraOrderTypes.includes(formData.orderType) &&
      formData.orderType !== "Library Orders"
    ) {
      toast({
        title: "Validation Error",
        description: "Book Price must be greater than 0 for this order type.",
        variant: "destructive",
      });
      return;
    }

    if (formData.numberOfCopies <= 0 && formData.orderType !== "Ebook") {
    toast({
      title: "Validation Error",
      description: "Number of Copies must be greater than 0.",
      variant: "destructive",
    });
    return;
  }
  
  // Ebook received amount validation
  if (formData.orderType === "Ebook" && (!formData.receivedAmount || formData.receivedAmount <= 0)) {
    toast({
      title: "Validation Error",
      description: "Amount Received must be greater than 0 for Ebook orders.",
      variant: "destructive",
    });
    return;
  }
    
    if (
      formData.orderType === "Normal Orders" &&
      formData.percentage === "Other" &&
      (parseFloat(formData.customDiscountPercentage) <= 0 ||
        !formData.customDiscountPercentage)
    ) {
      toast({
        title: "Validation Error",
        description:
          "Custom Discount Percentage is required and must be greater than 0 when 'Other' is selected.",
        variant: "destructive",
      });
      return;
    }
    if (
      showCustomRoyaltyInput &&
      (parseFloat(formData.customRoyaltyPercentage) <= 0 ||
        !formData.customRoyaltyPercentage)
    ) {
      toast({
        title: "Validation Error",
        description:
          "Custom Royalty Percentage is required and must be greater than 0.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const bookDetails = books.find(
        (b) => b.id.toString() === formData.bookId
      );
      const selectedPerson = availablePeople.find(
        (p) => p.name === formData.personName
      );
      if (!bookDetails || !selectedPerson) {
        toast({
          title: "Error",
          description: "Selected book or person not found.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const payload: OwnPublishingCreatePayload = {
        bookName: bookDetails.name,
        editionYear: Number(bookDetails.editionYear) || undefined,
        personName: selectedPerson.name,
        personRole: roleToPersonType(formData.role),
        orderType: orderTypeToEnum(formData.orderType),
        discount: undefined,
        percentage: undefined,
        receivedAmount: Number(formData.receivedAmount),
        numberOfCopies: Number(formData.numberOfCopies),
        bookPrice: Number(formData.bookPrice),
        totalAmount: calculations.totalPrice,
        royalty: calculations.royalty,
        status: formData.status,
      };
      if (formData.orderType === "Normal Orders") {
        if (formData.percentage === "Other") {
          payload.discount = parseFloat(formData.customDiscountPercentage) || 0;
        } else {
          payload.discount = parseFloat(formData.percentage) || 0;
        }
      } else if (extraOrderTypes.includes(formData.orderType)) {
        payload.discount = parseFloat(formData.customDiscountPercentage) || 0;
      }
      if (showCustomRoyaltyInput) {
        payload.percentage = parseFloat(formData.customRoyaltyPercentage) || 0;
      }
      if (isEditMode) {
        await OwnPublishingService.update(Number(id), payload);
        toast({ title: "Success", description: "Publishing record updated!" });
      } else {
        await OwnPublishingService.create(payload);
        toast({ title: "Success", description: "Publishing record added!" });
      }
      navigate("/rights/own-publishing");
    } catch (err: any) {
      console.error("Submission Error:", err);
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const showPercentageDropdown = formData.orderType === "Normal Orders";
  const showCustomRoyaltyInput =
    extraOrderTypes.includes(formData.orderType) ||
    ["Proprietor", "Agency", "Publisher"].includes(formData.role) ||
    (formData.orderType === "Normal Orders" && formData.percentage === "Other");
  const handleDownloadPdf = async () => {
    if (!pdfContentRef.current) {
      toast({
        title: "Error",
        description: "PDF content not found for rendering.",
        variant: "destructive",
      });
      return;
    }
    setLoadingPdf(true);
    const pdfContentElement = pdfContentRef.current;
    pdfContentElement.style.display = "block";
    pdfContentElement.style.position = "absolute";
    pdfContentElement.style.left = "-9999px";
    pdfContentElement.style.width = "210mm";
    pdfContentElement.style.boxSizing = "border-box";
    pdfContentElement.style.padding = "20mm";
    try {
      const canvas = await html2canvas(pdfContentElement, {
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.width / canvas.height;
      let imgWidth = pdfWidth - 30;
      let imgHeight = imgWidth / imgRatio;
      let position = 15;
      let heightLeft = canvas.height;
      let offset = 0;
      while (heightLeft > 0) {
        const pageHeight = pdfHeight;
        const sX = 0;
        const sY = offset;
        const sWidth = canvas.width;
        const sHeight = Math.min(
          heightLeft,
          (pageHeight * canvas.height) / pdfHeight
        );
        const imgRatioChunk = sWidth / sHeight;
        const pdfImgWidth = pdfWidth - 30;
        const pdfImgHeight = pdfImgWidth / imgRatioChunk;
        if (offset > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          imgData,
          "PNG",
          15,
          15,
          pdfImgWidth,
          pdfImgHeight,
          undefined,
          "FAST",
          0
        );
        heightLeft -= sHeight;
        offset += sHeight;
      }
      pdf.save(
        `Royalty_Statement_${
          formData.bookName.replace(/\s/g, "_") || "Untitled"
        }_${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      pdfContentElement.style.display = "none";
      pdfContentElement.style.position = "";
      pdfContentElement.style.left = "";
      pdfContentElement.style.width = "";
      pdfContentElement.style.boxSizing = "";
      pdfContentElement.style.padding = "";
      setLoadingPdf(false);
    }
  };

  // Add this helper function before your return statement
const isPdfDownloadDisabled = !formData.bookName || !formData.orderType || !formData.personName || !formData.role;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/rights/own-publishing")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          {isEditMode ? "Edit Own Publishing" : "Add Own Publishing"}
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Publishing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book */}
              <div className="space-y-2">
                <Label>Book *</Label>
                <Select
                  value={formData.bookId}
                  onValueChange={(value) => {
                    const selectedBook = books.find(
                      (b) => b.id.toString() === value
                    );
                    setFormData((prev) => ({
                      ...prev,
                      bookId: value,
                      bookName: selectedBook?.name || "",
                      editionYear: selectedBook?.editionYear?.toString() || "",
                      bookPrice: selectedBook?.price || 0,
                    }));
                  }}
                  disabled={loadingBooks || loadingEdit} // Disable while loading or in edit mode loading
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingBooks
                          ? "Loading books..."
                          : books && books.length === 0
                          ? "No books available"
                          : "Select a book"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingBooks ? (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        Loading Books...
                      </div>
                    ) : books.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        No books available
                      </div>
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
              {/* Edition */}
              <div className="space-y-2">
                <Label>Edition Year</Label>
                <Input
                  value={formData.editionYear}
                  readOnly
                  className="bg-muted"
                />
              </div>
              {/* Role */}
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
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
              {/* Person Name */}
              <div className="space-y-2">
                <Label>Name *</Label>
                <Select
                  value={formData.personName}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, personName: value }))
                  }
                  disabled={
                    loadingPeople ||
                    !formData.role ||
                    availablePeople.length === 0
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.role
                          ? "Select role first"
                          : loadingPeople
                          ? "Loading..."
                          : availablePeople.length === 0
                          ? `No ${formData.role.toLowerCase()}s found`
                          : `Select ${formData.role.toLowerCase()}`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePeople.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Order Type */}
              <div className="space-y-2">
                <Label>Order Type *</Label>
                <Select
                  value={formData.orderType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      orderType: value,
                      percentage: "", // Clear percentage
                      customDiscountPercentage: "", // Clear custom discount
                      customRoyaltyPercentage: "", // Clear custom royalty
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal Orders">Normal Orders</SelectItem>
                    <SelectItem value="Library Orders">
                      Library Orders
                    </SelectItem>
                    <SelectItem value="Special Scheme">
                      Special Scheme
                    </SelectItem>
                    <SelectItem value="Ebook">Ebook</SelectItem>
                    <SelectItem value="Audiobook">Audiobook</SelectItem>
                    <SelectItem value="Moviebook">Moviebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Discount & Royalty Fields */}
              {formData.orderType === "Normal Orders" && (
                <>
                  {/* Discount % Dropdown */}
                  <div className="space-y-2">
                    <Label>Discount Percentage</Label>
                    <Select
                      value={formData.percentage}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          percentage: value,
                          customDiscountPercentage:
                            value === "Other"
                              ? prev.customDiscountPercentage
                              : "",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="35">35%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="45">45%</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Custom Discount % (only if Other) */}
                  {formData.percentage === "Other" && (
                    <div className="space-y-2">
                      <Label>Custom Discount Percentage *</Label>
                      <Input
                        type="number"
                        placeholder="Enter discount %"
                        value={formData.customDiscountPercentage}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customDiscountPercentage: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </>
              )}
              {/* Ebook Form Fields */}
              {formData.orderType === "Ebook" && (
                <>
                  <div className="space-y-2">
                    <Label>Amount Received *</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount received"
                      value={
                        formData.receivedAmount === 0
                          ? ""
                          : formData.receivedAmount.toString()
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0;
                        setFormData((prev) => ({
                          ...prev,
                          receivedAmount: value,
                        }));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Royalty Percentage *</Label>
                    <Input
                      type="number"
                      placeholder="Enter royalty %"
                      value={formData.customRoyaltyPercentage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customRoyaltyPercentage: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              {/* Audiobook/Moviebook (not Ebook): keep Custom Discount & Royalty */}
              {["Audiobook", "Moviebook"].includes(formData.orderType) && (
                <>
                  <div className="space-y-2">
                    <Label>Custom Discount Percentage *</Label>
                    <Input
                      type="number"
                      placeholder="Enter discount %"
                      value={formData.customDiscountPercentage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customDiscountPercentage: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom Royalty Percentage *</Label>
                    <Input
                      type="number"
                      placeholder="Enter royalty %"
                      value={formData.customRoyaltyPercentage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customRoyaltyPercentage: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              {/* Copies */}
              {formData.orderType !== "Ebook" && (
                <div className="space-y-2">
                  <Label>Number of Copies</Label>
                  <Input
                    type="number"
                    value={formData.numberOfCopies}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        numberOfCopies: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Publishing Status *</Label>
                <div className="flex gap-6">
                  {Object.entries(PublishingStatusLabels).map(
                    ([status, label]) => (
                      <label key={status} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="publishingStatus"
                          value={status}
                          checked={formData.status === status}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              status: status as PublishingStatus,
                            }))
                          }
                        />
                        {label}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Price */}
              {formData.orderType !== "Ebook" && (
                <div className="space-y-2">
                  <Label>Book Price</Label>
                  <Input
                    type="number"
                    value={formData.bookPrice}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  loading || loadingBooks || loadingPeople || loadingEdit
                }
              >
                {loading || loadingEdit ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save Publishing Record"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* CALCULATIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Book and Person Details */}
            <div className="mb-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Book Title</p>
                  <p className="font-medium">
                    {formData.bookName || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Edition Year</p>
                  <p className="font-medium">{formData.editionYear || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{formData.role}</p>
                <p className="font-medium">
                  {formData.personName || "Not selected"}
                </p>
              </div>
            </div>
            {/* Summary */}
            <div className="my-4 p-4 bg-muted/40 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold">
                    ₹{calculations.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Royalty</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ₹{calculations.royalty.toFixed(2)}
                  </p>
                </div>
                <div className="col-span-2 mt-2">
                  <p className="text-sm text-muted-foreground">Company Share</p>
                  <p className="text-md font-semibold">
                    ₹{calculations.companyRoyalty.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            {/* Calculation Explanation */}
            {formData.orderType && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">
                  Calculation Method:
                </h4>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {(() => {
                    const numCopies = formData.numberOfCopies;
                    const bookPrice = formData.bookPrice;
                    const baseTotal = numCopies * bookPrice;
                    switch (formData.orderType) {
                      case "Library Orders":
                        return (
                          <>
                            <strong>
                              Type: Library Orders ({formData.role})
                            </strong>
                            <br />
                            Formula: <code>Copies × Book Price × 8%</code>
                            <br />
                            <span className="font-medium">
                              {numCopies} × ₹{bookPrice} × 8% = ₹
                              {(baseTotal * 0.08).toFixed(2)}
                            </span>
                          </>
                        );
                      case "Special Scheme":
                        return (
                          <>
                            <strong>
                              Type: Special Scheme ({formData.role})
                            </strong>
                            <br />
                            Formula: <code>Copies × Book Price × 60% × 4%</code>
                            <br />
                            <span className="font-medium">
                              {numCopies} × ₹{bookPrice} × 60% × 4% = ₹
                              {(baseTotal * 0.6 * 0.04).toFixed(2)}
                            </span>
                          </>
                        );
                      case "Normal Orders": {
                        let actualDiscountPercent =
                          formData.percentage === "Other"
                            ? parseFloat(formData.customDiscountPercentage) || 0
                            : parseInt(formData.percentage) || 0;
                        let royaltyPercentDisplay = "";
                        if (formData.role === "Author") {
                          royaltyPercentDisplay =
                            formData.percentage === "35" ? "15%" : "10%";
                        } else if (
                          ["Translator", "Editor"].includes(formData.role)
                        ) {
                          royaltyPercentDisplay =
                            formData.percentage === "35" ? "7.5%" : "5%";
                        } else {
                          royaltyPercentDisplay = `${
                            formData.customRoyaltyPercentage || 0
                          }%`;
                        }
                        return (
                          <>
                            <strong>
                              Type: Normal Orders ({formData.role})
                            </strong>
                            <br />
                            Formula:{" "}
                            <code>
                              Copies × Book Price × (100% - Discount%) ×
                              Royalty%
                            </code>
                            <br />
                            <span className="font-medium">
                              {numCopies} × ₹{bookPrice} × (
                              {100 - actualDiscountPercent}%) ×{" "}
                              {royaltyPercentDisplay} = ₹
                              {calculations.royalty.toFixed(2)}
                            </span>
                            {formData.percentage === "Other" && (
                              <>
                                <br />
                                <em>
                                  Custom discount:{" "}
                                  {formData.customDiscountPercentage || 0}%
                                </em>
                              </>
                            )}
                            {["Proprietor", "Agency", "Publisher"].includes(
                              formData.role
                            ) &&
                              formData.customRoyaltyPercentage && (
                                <>
                                  <br />
                                  <em>
                                    Custom royalty rate:{" "}
                                    {formData.customRoyaltyPercentage || 0}%
                                  </em>
                                </>
                              )}
                          </>
                        );
                      }
                      case "Ebook": {
                        const amount = formData.receivedAmount || 0;
                        const percentage =
                          parseFloat(formData.customRoyaltyPercentage) || 0;
                        return (
                          <>
                            <strong>Type: Ebook ({formData.role})</strong>
                            <br />
                            Formula: <code>Amount Received × Royalty%</code>
                            <br />
                            <span className="font-medium">
                              ₹{amount.toFixed(2)} × {percentage}% = ₹
                              {((amount * percentage) / 100).toFixed(2)}
                            </span>
                          </>
                        );
                      }

                      case "Audiobook":
                      case "Moviebook":
                        const discount =
                          parseFloat(formData.customDiscountPercentage) || 0;
                        const royaltyPerc = parseFloat(formData.customRoyaltyPercentage) || 0;
                        return (
                          <>
                            <strong>
                              Type: {formData.orderType} ({formData.role})
                            </strong>
                            <br />
                            Formula:{" "}
                            <code>
                              Copies × Book Price × (100% - Discount%) ×
                              Royalty%
                            </code>
                            <br />
                            <span className="font-medium">
                              {numCopies} × ₹{bookPrice} × ({100 - discount}%) ×{" "}
                              {royaltyPerc}% = ₹
                              {(
                                baseTotal *
                                ((100 - discount) / 100) *
                                (royaltyPerc / 100)
                              ).toFixed(2)}
                            </span>
                            <br />
                            <em>
                              Custom discount: {discount}%<br />
                              Custom royalty rate: {royaltyPerc}%
                            </em>
                          </>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
              </div>
            )}
            {/* Download PDF Button */}
            <Button
              onClick={handleDownloadPdf}
              className="mt-6 w-full"
              disabled={loadingPdf || isPdfDownloadDisabled}
            >
              {loadingPdf ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {loadingPdf ? "Generating PDF..." : "Download Royalty Statement"}
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Hidden div for PDF content generation */}
      {/* This div's content and styles are crucial for the PDF output */}
      {/* Hidden div for PDF content generation */}
      <div
        ref={pdfContentRef}
        style={{
          display: "none",
          position: "absolute",
          left: "-9999px",
          width: "210mm",
          boxSizing: "border-box",
          padding: "20mm",
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "16pt", // Good readable size
          lineHeight: "1.5",
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "35px",
            minHeight: "80px", // Moderate height for header
          }}
        >
          {/* Left Column for Logo */}
          <div
            style={{
              flex: 1,
              textAlign: "left",
              minWidth: "100px", // Reduced from 150px
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={YOUR_BASE64_LOGO_STRING}
              alt="Kalachuvadu Publications Logo"
              style={{
                width: "auto",
                height: "70px", // Moderate size - not too big, not too small
                maxWidth: "120px", // Reasonable max width
                objectFit: "contain",
              }}
              onError={(e) => {
                // Simple fallback without extra styling
                const target = e.currentTarget;
                target.style.display = "none";
                const fallbackDiv = target.nextElementSibling as HTMLElement;
                if (fallbackDiv) {
                  fallbackDiv.style.display = "block";
                }
              }}
            />

            {/* Simple fallback logo text */}
            <div
              style={{
                fontSize: "18pt",
                fontWeight: "bold",
                color: "#000",
                textAlign: "center",
                display: "none", // Hidden by default
                lineHeight: "1.2",
              }}
            >
              KALACHUVADU
              <br />
              <span style={{ fontSize: "12pt" }}>PUBLICATIONS</span>
            </div>
          </div>

          {/* Center Column for Company Info */}
          <div
            style={{
              flex: 2,
              textAlign: "center",
              lineHeight: "1.4",
              marginLeft: "15px",
              marginRight: "15px",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                margin: "0",
                fontSize: "20pt", // Increased but not excessive
                marginBottom: "10px",
                color: "#000",
              }}
            >
              Kalachuvadu Publications Pvt Ltd
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "14pt", // Good readable size
                marginBottom: "5px",
              }}
            >
              669. K.P. Road, Nagercoil 629001
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "14pt",
              }}
            >
              E mail: royaltykalachuvadu@gmail.com
            </p>
          </div>

          {/* Right Column for Date */}
          <div
            style={{
              flex: 1,
              textAlign: "right",
              marginTop: "5px",
              fontSize: "14pt",
              fontWeight: "600",
              minWidth: "120px",
            }}
          >
            <strong>Date:</strong>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Statement Details */}
        <div style={{ marginBottom: "30px" }}>
          <p
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "22pt", // Prominent but not excessive
              marginBottom: "25px",
              textDecoration: "underline",
              color: "#000",
            }}
          >
            Statement of Royalty
          </p>

          <p
            style={{
              fontWeight: "bold",
              fontSize: "16pt",
              marginBottom: "10px",
            }}
          >
            {formData.role} Name: {formData.personName || "N/A"}
          </p>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "16pt",
              margin: "0",
            }}
          >
            Book Name: {formData.bookName || "N/A"}
          </p>
        </div>

        {/* Table Headings */}
        {/* Table Headings */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  fontWeight: 'bold', 
  marginBottom: '10px', 
  fontSize: '15pt', 
  padding: '8px 0'
}}>
  <span style={{ width: '45%' }}>Edition/Details</span>
  <span style={{ width: '35%' }}>Description</span>
  <span style={{ width: '20%', textAlign: 'right' }}>Royalty</span>
</div>

        <hr
          style={{
            border: "none",
            borderTop: "2px solid #000",
            marginBottom: "15px",
          }}
        />

       
        {/* Dynamic Calculation Line(s) */}
        <div style={{ marginLeft: '0px', marginBottom: '20px' }}>
  {(() => {
    const { editionYear, numberOfCopies, bookPrice, orderType, role, percentage, customDiscountPercentage, customRoyaltyPercentage, receivedAmount } = formData;
    const { royalty } = calculations;
    const baseTotal = numberOfCopies * bookPrice;
    let description = '';
    let royaltyRateDisplay = '';

    if (!formData.bookName || !formData.orderType || !formData.personName || !formData.role) {
      return (
        <p style={{ 
          fontSize: '14pt',
          color: '#666',
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          Please fill in all required fields to see PDF calculation details.
        </p>
      );
    }

    // Special handling for Ebook
    if (orderType === "Ebook") {
      const amount = receivedAmount || 0;
      const royaltyPerc = parseFloat(customRoyaltyPercentage) || 0;
      description = `Amount received: ₹${amount.toFixed(0)}`;
      royaltyRateDisplay = `${royaltyPerc}%`;
    } else if (orderType === "Library Orders") {
      description = `net amount received ${baseTotal.toFixed(0)}`;
      royaltyRateDisplay = "8%";
    } else if (orderType === "Special Scheme") {
      description = `@60% sales ${(baseTotal * 0.6).toFixed(0)}`;
      royaltyRateDisplay = "4%";
    } else if (orderType === "Normal Orders") {
      let actualDiscountPercent = percentage === "Other" ? parseFloat(customDiscountPercentage) || 0 : parseInt(percentage) || 0;
      description = `@${actualDiscountPercent}% sales ${(baseTotal * ((100 - actualDiscountPercent) / 100)).toFixed(0)}`;

      if (role === "Author") {
        royaltyRateDisplay = actualDiscountPercent === 35 ? "15%" : "10%";
      } else if (["Translator", "Editor"].includes(role)) {
        royaltyRateDisplay = actualDiscountPercent === 35 ? "7.5%" : "5%";
      } else {
        royaltyRateDisplay = `${customRoyaltyPercentage || 0}%`;
      }
    } else if (["Audiobook", "Moviebook"].includes(orderType)) {
      const discount = parseFloat(customDiscountPercentage) || 0;
      const royaltyPerc = parseFloat(customRoyaltyPercentage) || 0;
      description = `@${discount}% sales ${(baseTotal * ((100 - discount) / 100)).toFixed(0)}`;
      royaltyRateDisplay = `${royaltyPerc}%`;
    }

    const formattedBookPrice = Number(bookPrice).toFixed(0);
    const formattedRoyalty = Number(royalty).toFixed(0);

    return (
      <>
        {/* Order Type Heading */}
        <p style={{ 
          fontWeight: 'bold', 
          margin: '20px 0 10px 0', 
          fontSize: '17pt',
          color: '#000'
        }}>
          {orderType}
        </p>
        
        {/* Single Calculation Line */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '14pt',
          padding: '8px 0',
          fontWeight: '400'
        }}>
          <span style={{ width: '45%' }}>
            {editionYear || 'N/A'} Edition / 
            {orderType === "Ebook" 
              ? `Amount: ₹${receivedAmount.toFixed(0)}`
              : `${numberOfCopies} copies x Rs.${formattedBookPrice}`
            }
          </span>
          <span style={{ width: '35%' }}>
            {description} x {royaltyRateDisplay}
          </span>
          <span style={{
            width: '20%',
            textAlign: 'right',
            fontWeight: 'bold'
          }}>
            ₹{formattedRoyalty}
          </span>
        </div>
      </>
    );
  })()}
</div>

        {/* Dynamic Calculation Lines for ALL publishings of this book */}
<div style={{ marginLeft: '0px', marginBottom: '20px' }}>
  {(() => {
    // Filter records for the selected bookName only
    const filteredRecords = Array.isArray(allBookPublishings)
      ? allBookPublishings.filter(rec => rec.bookName === formData.bookName)
      : [];

    if (filteredRecords.length === 0) {
      return (
        <p style={{
          fontSize: '14pt',
          color: '#666',
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          No publishing records found for this book: <strong>{formData.bookName || "N/A"}</strong>
        </p>
      );
    }

    return (
      <>
        <p style={{
          fontWeight: 'bold',
          margin: '20px 0 10px 0',
          fontSize: '17pt',
          color: '#000'
        }}>
          All Publishing Records for this Book: <strong>{formData.bookName}</strong>
        </p>
        {filteredRecords.map((rec, idx) => {
          // Calculate royalty for each record
          let royalty = 0;
          let baseTotal = rec.numberOfCopies * rec.bookPrice;
          let description = '';
          let royaltyRateDisplay = '';
          if (rec.orderType === "EBOOK") {
            royalty = Math.round((rec.receivedAmount || 0) * ((rec.percentage || 0) / 100));
            description = `Amount received: ₹${rec.receivedAmount}`;
            royaltyRateDisplay = `${rec.percentage || 0}%`;
          } else if (rec.orderType === "LIBRARY") {
            royalty = Math.round(baseTotal * 0.08);
            description = `net amount received ₹${baseTotal}`;
            royaltyRateDisplay = "8%";
          } else if (rec.orderType === "SPECIAL_SCHEME") {
            royalty = Math.round(baseTotal * 0.6 * 0.04);
            description = `@60% sales ₹${Math.round(baseTotal * 0.6)}`;
            royaltyRateDisplay = "4%";
          } else if (rec.orderType === "NORMAL") {
            let actualDiscountPercent = rec.discount || 0;
            let afterDiscount = baseTotal * ((100 - actualDiscountPercent) / 100);
            if (rec.personRole === "AUTHOR") {
              royalty = Math.round(afterDiscount * (actualDiscountPercent === 35 ? 0.15 : 0.1));
              royaltyRateDisplay = actualDiscountPercent === 35 ? "15%" : "10%";
            } else if (["TRANSLATOR", "EDITOR"].includes(rec.personRole)) {
              royalty = Math.round(afterDiscount * (actualDiscountPercent === 35 ? 0.075 : 0.05));
              royaltyRateDisplay = actualDiscountPercent === 35 ? "7.5%" : "5%";
            } else {
              royalty = Math.round(afterDiscount * ((rec.percentage || 0) / 100));
              royaltyRateDisplay = `${rec.percentage || 0}%`;
            }
            description = `@${actualDiscountPercent}% sales ₹${Math.round(afterDiscount)}`;
          } else if (["AUDIOBOOK", "MOVIEBOOK"].includes(rec.orderType)) {
            let discount = rec.discount || 0;
            let royaltyPerc = rec.percentage || 0;
            let afterDiscount = baseTotal * ((100 - discount) / 100);
            royalty = Math.round(afterDiscount * (royaltyPerc / 100));
            description = `@${discount}% sales ₹${Math.round(afterDiscount)}`;
            royaltyRateDisplay = `${royaltyPerc}%`;
          }
          return (
            <div key={rec.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14pt',
              padding: '8px 0',
              fontWeight: '400',
              borderBottom: '1px solid #eee'
            }}>
              <span style={{ width: '45%' }}>
                {rec.editionYear || 'N/A'} Edition / {rec.numberOfCopies} copies x Rs.{rec.bookPrice}
                <br />
                <span style={{ fontSize: '12pt', color: '#444' }}>
                  {rec.personName} ({rec.personRole})
                </span>
              </span>
              <span style={{ width: '35%' }}>
                {orderTypeEnumToUI(rec.orderType)}<br />
                {description} x {royaltyRateDisplay}
              </span>
              <span style={{
                width: '20%',
                textAlign: 'right',
                fontWeight: 'bold'
              }}>
                ₹{royalty}
              </span>
            </div>
          );
        })}
      </>
    );
  })()}
</div>

        {/* Total Amount */}
        {/* <div
          style={{
            textAlign: "right",
            marginTop: "40px",
            borderTop: "2px solid #000",
            paddingTop: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                margin: "0",
                fontSize: "18pt",
                marginRight: "25px",
              }}
            >
              Total Amount:
            </p>
            <p
              style={{
                fontWeight: "bold",
                margin: "0",
                fontSize: "20pt",
                minWidth: "100px",
                textAlign: "right",
              }}
            >
              ₹{calculations.totalPrice.toFixed(0)}
            </p>
          </div>
        </div> */}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "80px",
            borderTop: "1px solid #666",
            paddingTop: "30px",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              margin: "0",
              fontSize: "16pt",
              marginBottom: "5px",
            }}
          >
            For Kalachuvadu Publications Pvt. Ltd.
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "15pt",
              marginTop: "10px",
              fontWeight: "500",
            }}
          >
            (S.E. JEBA BETSI)
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "13pt",
              marginTop: "5px",
              fontStyle: "italic",
            }}
          >
            Managing Director
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddOwnPublishing;