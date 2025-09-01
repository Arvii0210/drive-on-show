import React, { useState, useMemo } from "react";
import { Filter, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample data for royalty calculations
const royaltyData = [
  {
    id: 1,
    bookTitle: "The Silent Forest",
    author: "John Doe",
    year: "2023",
    orderType: "Normal Orders",
    role: "Author",
    copies: 150,
    totalAmount: 67500,
    royalty: 10125,
    status: "Paid",
  },
  {
    id: 2,
    bookTitle: "Digital Revolution",
    author: "Jane Smith",
    year: "2023",
    orderType: "Library Orders",
    role: "Translator",
    copies: 200,
    totalAmount: 70000,
    royalty: 35000,
    status: "Pending",
  },
  {
    id: 3,
    bookTitle: "Modern Poetry",
    author: "Mike Johnson",
    year: "2022",
    orderType: "Special Scheme",
    role: "Author",
    copies: 100,
    totalAmount: 28000,
    royalty: 672,
    status: "Paid",
  },
  {
    id: 4,
    bookTitle: "Ancient Wisdom",
    author: "Sarah Wilson",
    year: "2022",
    orderType: "Normal Orders",
    role: "Editor",
    copies: 300,
    totalAmount: 156000,
    royalty: 11700,
    status: "Processing",
  },
  {
    id: 5,
    bookTitle: "Future Tech",
    author: "Alex Brown",
    year: "2024",
    orderType: "Library Orders",
    role: "Author",
    copies: 80,
    totalAmount: 32000,
    royalty: 16000,
    status: "Paid",
  },
];

const RoyaltyCalculations = () => {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique years and order types for filter options
  const availableYears = useMemo(() => {
    const years = [...new Set(royaltyData.map(item => item.year))].sort((a, b) => b.localeCompare(a));
    return years;
  }, []);

  const availableOrderTypes = useMemo(() => {
    const orderTypes = [...new Set(royaltyData.map(item => item.orderType))];
    return orderTypes;
  }, []);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return royaltyData.filter(item => {
      const yearMatch = selectedYear === "all" || item.year === selectedYear;
      const orderTypeMatch = selectedOrderType === "all" || item.orderType === selectedOrderType;
      return yearMatch && orderTypeMatch;
    });
  }, [selectedYear, selectedOrderType]);

  // Calculate totals for filtered data
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        copies: acc.copies + item.copies,
        totalAmount: acc.totalAmount + item.totalAmount,
        royalty: acc.royalty + item.royalty,
      }),
      { copies: 0, totalAmount: 0, royalty: 0 }
    );
  }, [filteredData]);

  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedOrderType("all");
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Paid: "bg-green-100 text-green-800 border-green-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Processing: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const hasActiveFilters = selectedYear !== "all" || selectedOrderType !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Royalty Calculations</h1>
        <div className="flex items-center gap-3">
          {/* Filter Popover */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`relative ${hasActiveFilters ? 'border-primary bg-primary/10' : ''}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Filter Options</h4>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-xs h-auto p-1"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                
                <Separator />
                
                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Order Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Type</label>
                  <Select value={selectedOrderType} onValueChange={setSelectedOrderType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Order Types</SelectItem>
                      {availableOrderTypes.map(orderType => (
                        <SelectItem key={orderType} value={orderType}>{orderType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Summary */}
                {hasActiveFilters && (
                  <>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                      Showing {filteredData.length} of {royaltyData.length} records
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedYear !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Year: {selectedYear}
              <button 
                onClick={() => setSelectedYear("all")} 
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedOrderType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Order Type: {selectedOrderType}
              <button 
                onClick={() => setSelectedOrderType("all")} 
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Copies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.copies.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totals.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Royalty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{totals.royalty.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Royalty Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Order Type</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Copies</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Royalty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.bookTitle}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{item.orderType}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell className="text-right">{item.copies.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{item.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">₹{item.royalty.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getStatusBadge(item.status)}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoyaltyCalculations;
