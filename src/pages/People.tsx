import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  CreditCard,
  User,
  Mail,
  Phone,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { deletePerson, getAllPersons } from "@/services/people.service";

import { PersonFormData, PersonType } from "@/models/people.model";

type Tab =
  | "Authors"
  | "Translators"
  | "Editors"
  | "Proprietors"
  | "Agencies"
  | "Publishers";

const tabs: Tab[] = [
  "Authors",
  "Translators",
  "Editors",
  "Proprietors",
  "Agencies",
  "Publishers",
];

// Map tabs to API personType strings
const tabToEnum: Record<Tab, PersonType> = {
  Authors: "AUTHOR",
  Translators: "TRANSLATOR",
  Editors: "EDITOR",
  Proprietors: "PROPRIETOR",
  Agencies: "AGENCY",
  Publishers: "PUBLISHER",
};

// Helper class name function
const cn = (...classes: string[]) => classes.filter(Boolean).join("");

const People = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Authors");
  const [peopleData, setPeopleData] = useState<Record<Tab, PersonFormData[]>>({
    Authors: [],
    Translators: [],
    Editors: [],
    Proprietors: [],
    Agencies: [],
    Publishers: [],
  });

  const [loadingMap, setLoadingMap] = useState<Record<Tab, boolean>>(
    () =>
      Object.fromEntries(tabs.map((tab) => [tab, true])) as Record<Tab, boolean>
  );

  const [errorMap, setErrorMap] = useState<Record<Tab, string | null>>(
    () =>
      Object.fromEntries(tabs.map((tab) => [tab, null])) as Record<
        Tab,
        string | null
      >
  );

  // Fetch all person types on mount
  useEffect(() => {
    tabs.forEach(async (tab) => {
      setLoadingMap((prev) => ({ ...prev, [tab]: true }));
      setErrorMap((prev) => ({ ...prev, [tab]: null }));

      try {
        const data = await getAllPersons({ personType: tabToEnum[tab] });
        setPeopleData((prev) => ({ ...prev, [tab]: data }));
      } catch (err: any) {
        setErrorMap((prev) => ({ ...prev, [tab]: "Failed to load data" }));
      } finally {
        setLoadingMap((prev) => ({ ...prev, [tab]: false }));
      }
    });
  }, []);

  // Search logic: find the first tab with a matching person and switch to it
  useEffect(() => {
    if (!searchTerm) return;

    // Collect all matches by name across tabs
    const nameMatches: { tab: Tab; person: PersonFormData }[] = [];
    tabs.forEach((tab) => {
      peopleData[tab].forEach((person) => {
        if (person.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
          nameMatches.push({ tab, person });
        }
      });
    });

    // If same name found in multiple tabs, show notification
    const uniqueNames = Array.from(
      new Set(nameMatches.map((m) => m.person.name?.toLowerCase()))
    );
    if (uniqueNames.length === 1 && nameMatches.length > 1) {
      toast({
        title: "⚠️ Duplicate Name Found",
        description:
          "Same name is present in multiple person types. Please search by email to find the exact person.",
        variant: "default",
      });
    }

    // Switch to the first tab with a match (by name or email)
    for (const tab of tabs) {
      const found = peopleData[tab].some(
        (person) =>
          person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (found) {
        setActiveTab(tab);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, peopleData, toast]);

  const currentPeople = peopleData[activeTab] || [];
  const filteredPeople = currentPeople.filter(
    (person) =>
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // delete handler
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deletePerson(id);
        toast({
          title: "Success",
          description: `${name} has been deleted successfully`,
        });
        // Remove from current tab data
        setPeopleData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((p) => p.id !== id),
        }));
      } catch {
        toast({
          title: "Error",
          description: "Failed to delete person",
          variant: "destructive",
        });
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  // Render table, receives filtered data
  const renderTable = (data: PersonFormData[], type: Tab) => (
    <>
      {/* Desktop Table */}
      <Card className="hidden sm:block card-gradient">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="capitalize">{type}</CardTitle>
          <Button
            onClick={() => navigate(`/people/add?type=${tabToEnum[type].toLowerCase()}`)}
            className="btn-blue"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {type}
          </Button>
        </CardHeader>
        <CardContent>
          {loadingMap[type] ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No {type} found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell>{person.name}</TableCell>
                        <TableCell>{person.email}</TableCell>
                        <TableCell>{person.phone}</TableCell>
                        <TableCell>{person.panNumber}</TableCell>
                        <TableCell>
                          <Badge
                            variant={person.isActive ? "default" : "secondary"}
                          >
                            {person.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/people/edit/${person.id}?type=${tabToEnum[type].toLowerCase()}`
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDelete(person.id!, person.name)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Cards */}

      {/* Mobile Add Button (only visible on small screens) */}
<div className="sm:hidden mb-4">
  <Button
    onClick={() => navigate(`/people/add?type=${tabToEnum[type].toLowerCase()}`)}
    className="w-full btn-blue"
  >
    <Plus className="h-4 w-4 mr-2" />
    Add {type}
  </Button>
</div>

      <div className="sm:hidden space-y-4">
        {loadingMap[type] ? (
          // Premium skeleton loading
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white/70 dark:bg-slate-900/60 ring-1 ring-black/5 dark:ring-white/10 p-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-muted rounded" />
                    <div className="h-3 w-1/3 bg-muted rounded" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded col-span-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPeople.length === 0 ? (
          // Premium empty state
          <Card className="rounded-2xl border bg-white/80 dark:bg-slate-900/70 ring-1 ring-black/5 dark:ring-white/10">
            <CardContent className="p-8 text-center space-y-2">
              <User className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="text-base font-semibold">No {type} found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or add a new record.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPeople.map((person) => (
            <Card
              key={person.id}
              className="relative overflow-hidden rounded-2xl border bg-white/80 dark:bg-slate-900/70 shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all duration-200 hover:shadow-md"
            >
              {/* Accent bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500" />

              <CardContent className="p-4 space-y-4">
                {/* Header: avatar + name + status + actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-semibold shadow-sm ring-2 ring-white/80 dark:ring-slate-800">
                      {getInitials(person.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold leading-snug truncate">
                        {person.name}
                      </div>
                      <div className="mt-1">
                        <Badge
                          variant={person.isActive ? "default" : "secondary"}
                          className="rounded-full px-2 py-0.5 text-[11px]"
                        >
                          {person.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        navigate(`/people/edit/${person.id}?type=${tabToEnum[type].toLowerCase()}`)
                      }
                      aria-label="Edit person"
                      className="h-9 w-9 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(person.id!, person.name)}
                      aria-label="Delete person"
                      className="h-9 w-9 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Details: label–value with icons */}
                <div className="rounded-xl bg-muted/30 dark:bg-white/5 divide-y divide-border overflow-hidden">
                  <div className="flex items-center justify-between gap-3 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email</span>
                    </div>
                    <div className="text-sm font-medium text-right break-words max-w-[70%]">
                      {person.email ? (
                        <a
                          href={`mailto:${person.email}`}
                          className="hover:underline"
                        >
                          {person.email}
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>Phone</span>
                    </div>
                    <div className="text-sm font-medium text-right break-words max-w-[70%]">
                      {person.phone ? (
                        <a
                          href={`tel:${person.phone}`}
                          className="hover:underline"
                        >
                          {person.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>PAN</span>
                    </div>
                    <div className="text-sm font-medium text-right break-words max-w-[70%]">
                      {person.panNumber || "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );

  // Main return
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold">People Management</h1>
          <p className="text-muted-foreground">Manage all types of people</p>
        </div>
        {/* Search input */}
        <div className="w-full sm:w-80 flex items-center relative">
          <span className="absolute left-3">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <Input
            placeholder="Search people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full"
            style={{ minHeight: "40px" }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {tabs.map((key) => (
          <Card
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "cursor-pointer transition-all hover:scale-105",
              activeTab === key ? "ring-2 ring-offset-2 ring-blue-500" : ""
            )}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-500 p-2 rounded-md text-white">
                <Users className="h-5 w-5" />
              </div>
              <div>
                {loadingMap[key] ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : errorMap[key] ? (
                  <div className="text-sm text-red-500">Error</div>
                ) : (
                  <>
                    <div className="text-lg font-bold">
                      {peopleData[key]?.length || 0}
                    </div>
                    <div className="text-sm capitalize text-muted-foreground">
                      {key}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table of filtered people based on search */}
      {renderTable(filteredPeople, activeTab)}
    </div>
  );
};

export default People;
