import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const mainTabs = [
  { id: "author", title: "Author Details" },
  { id: "translator", title: "Translator" },
  { id: "editor", title: "Editor" },
  { id: "books", title: "Books" },
  { id: "rights", title: "Rights" },
];

const rightsSubTabs = [
  { id: "own", title: "Own Publishing Report" },
  { id: "buy", title: "Buying Rights Report" },
  { id: "sell", title: "Selling Rights Report" },
];

export default function Reports() {
  const [selectedMainTab, setSelectedMainTab] = useState("author");
  const [selectedRightsTab, setSelectedRightsTab] = useState("own");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const currentTitle =
    selectedMainTab === "rights"
      ? rightsSubTabs.find((r) => r.id === selectedRightsTab)?.title
      : mainTabs.find((m) => m.id === selectedMainTab)?.title + " Report";

  const exportToExcel = () => {
    setLoading(true);
    const data = [{ StartDate: startDate, EndDate: endDate }];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${currentTitle}.xlsx`);
    setLoading(false);
  };

  const exportToPDF = () => {
    setLoading(true);
    const doc = new jsPDF();
    doc.text(`${currentTitle}`, 20, 20);
    doc.text(`Start Date: ${startDate}`, 20, 30);
    doc.text(`End Date: ${endDate}`, 20, 40);
    doc.save(`${currentTitle}.pdf`);
    setLoading(false);
  };

  const renderDateFilter = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{currentTitle}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate a report for the selected date range.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button
            className="bg-gray-200 text-black"
            onClick={exportToExcel}
            disabled={!startDate || !endDate || loading}
          >
            <FaFileExcel className="mr-2" />
            {loading ? "Generating..." : "Download Excel"}
          </Button>
          <Button
            className="bg-gray-200 text-black"
            onClick={exportToPDF}
            disabled={!startDate || !endDate || loading}
          >
            <FaFilePdf className="mr-2" />
            {loading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRightsTabs = () => (
    <Tabs
      value={selectedRightsTab}
      onValueChange={(val) => setSelectedRightsTab(val)}
      className="mt-4"
    >
      <TabsList>
        {rightsSubTabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {rightsSubTabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {renderDateFilter()}
        </TabsContent>
      ))}
    </Tabs>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reports Dashboard</h1>
      <Tabs
        value={selectedMainTab}
        onValueChange={(val) => {
          setSelectedMainTab(val);
          setStartDate("");
          setEndDate("");
        }}
        className="mt-6"
      >
        <TabsList className="overflow-x-auto">
          {mainTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {mainTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.id === "rights" ? renderRightsTabs() : renderDateFilter()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
