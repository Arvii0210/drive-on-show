import React, { useState, useEffect, useMemo } from "react";
import { Filter, Plus, Pencil, Trash } from "lucide-react";
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
import { Link, useNavigate } from "react-router-dom";

import { OwnPublishingService } from "../services/own-publishing.service"; // adjust path as needed
import type { OwnPublishing } from "../models/own-publishing.model";

const RoyaltyCalculations = () => {
  const [data, setData] = useState<OwnPublishing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedOrderType, setSelectedOrderType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await OwnPublishingService.getAll({ limit: 1000 });
        setData(res.ownPublishings);
      } catch (err) {
        setError((err as Error).message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dynamically get years and order types from fetched data
  const availableYears = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.editionYear.toString()))).sort(
      (a, b) => b.localeCompare(a)
    );
  }, [data]);

  const availableOrderTypes = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.orderType)));
  }, [data]);

  // Filter data client-side based on selected filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const yearMatch = selectedYear === "all" || item.editionYear.toString() === selectedYear;
      const orderTypeMatch = selectedOrderType === "all" || item.orderType === selectedOrderType;
      return yearMatch && orderTypeMatch;
    });
  }, [data, selectedYear, selectedOrderType]);

  // Aggregate totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        copies: acc.copies + item.numberOfCopies,
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await OwnPublishingService.softDelete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const formatOrderType = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PAID: "bg-green-100 text-green-800 border-green-200",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const hasActiveFilters = selectedYear !== "all" || selectedOrderType !== "all";

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">Loading data...</div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Own Publishing Rights Overview
        </h1>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
          <Link to="/rights/own-publishing/add" className="w-full sm:w-auto">
            <Button
              variant="default"
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Own Publishing
            </Button>
          </Link>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2 relative"
              >
                <Filter className="h-4 w-4" />
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
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Order Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Type</label>
                  <Select
                    value={selectedOrderType}
                    onValueChange={setSelectedOrderType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Order Types</SelectItem>
                      {availableOrderTypes.map((orderType) => (
                        <SelectItem key={orderType} value={orderType}>
                          {formatOrderType(orderType)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {hasActiveFilters && (
                  <>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                      Showing {filteredData.length} of {data.length} records
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
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

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Copies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.copies.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totals.totalAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Royalty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ₹{totals.royalty.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle>Own Publishing Rights Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Role</TableHead>
                  {/* Updated header */}
                  <TableHead className="text-right">
                    Copies / Amt Rec'd
                  </TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Royalty</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.bookName}</TableCell>
                    <TableCell>{item.personName}</TableCell>
                    <TableCell>{item.editionYear}</TableCell>
                    <TableCell>{formatOrderType(item.orderType)}</TableCell>
                    <TableCell>{item.personRole}</TableCell>
                    <TableCell className="text-right">
                      {item.orderType === "EBOOK"
                        ? (item.totalAmount ? `₹${item.totalAmount.toLocaleString()}` : "-")
                        : item.numberOfCopies?.toLocaleString()
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{item.royalty.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={getStatusBadge(item.status)}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => navigate(`/rights/own-publishing/edit/${item.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {filteredData.map((item) => (
          <Card
            key={item.id}
            className="p-4 shadow-md rounded-2xl border border-gray-200 bg-white"
          >
            <div className="flex flex-col gap-3 text-sm text-gray-800">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-500">Author:</span>
                <span className="text-right">{item.personName}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-500">Year:</span>
                <span className="text-right">{item.editionYear}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-500">Order Type:</span>
                <span className="text-right">{formatOrderType(item.orderType)}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-500">Role:</span>
                <span className="text-right">{item.personRole}</span>
              </div>

              {/* Updated Copies/Amount Received */}
              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-500">
                  {item.orderType === "EBOOK" ? "Amount Received:" : "Copies:"}
                </span>
                <span className="text-right">
                  {item.orderType === "EBOOK"
                    ? (item.totalAmount ? `₹${item.totalAmount.toLocaleString()}` : "-")
                    : item.numberOfCopies.toLocaleString()
                  }
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-500">Total:</span>
                <span className="text-right text-green-600 font-semibold">
                  ₹{item.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-500">Royalty:</span>
                <span className="text-right text-blue-600 font-semibold">
                  ₹{item.royalty.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-3 mt-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  title="Edit"
                  onClick={() => navigate(`/rights/own-publishing/edit/${item.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  title="Delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoyaltyCalculations;
