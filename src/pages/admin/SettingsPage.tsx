import { useState } from "react";
import {
  Settings,
  Save,
  Plus,
  X,
  FileText,
  ClipboardCheck,
  GripVertical,
  Pencil,
  ToggleLeft,
  Award,
  Check,
  Trash2,
  Zap,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEventStore } from "@/store/eventStore";
import {
  useFormConfigStore,
  type SubmissionField,
  type ReviewCriterion,
} from "@/store/formConfigStore";
import {
  useGradeCriteriaStore,
  type GradeThreshold,
} from "@/store/gradeCriteriaStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useFinalCategoryStore } from "@/store/finalCategoryStore";

const tabs = [
  "Event Settings",
  "Research Categories",
  "Final Categories",
  "Author Configuration",
  "Reviewer Configuration",
  "Grade Criteria",
  "Notifications",
  "Security",
] as const;
type Tab = (typeof tabs)[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Event Settings");

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Configure submission forms, evaluation criteria, and grading"
        icon={Settings}
      />

      <div className="flex gap-1 bg-secondary/60 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150",
              tab === t
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        {tab === "Event Settings" && <EventSettingsTab />}
        {tab === "Research Categories" && <ResearchCategoriesTab />}
        {tab === "Final Categories" && <FinalCategoriesTab />}
        {tab === "Author Configuration" && <AuthorConfigTab />}
        {tab === "Reviewer Configuration" && <ReviewerConfigTab />}
        {tab === "Grade Criteria" && <GradeCriteriaTab />}
        {tab === "Notifications" && <NotificationsTab />}
        {tab === "Security" && <SecurityTab />}
      </div>
    </div>
  );
}

/* ─── Event Settings Tab ─── */
function EventSettingsTab() {
  const { events, updateEvent } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || "");
  const event = events.find((e) => e.id === selectedEvent);

  if (!event) return <div className="text-sm text-muted-foreground">No events found</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">Event Configuration</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Configure submission limits and policies for individual conferences.
      </p>

      <div className="flex items-center gap-3">
        <Label className="text-xs font-semibold whitespace-nowrap">
          Select Conference:
        </Label>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Choose a conference" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEvent && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6 p-4 rounded-lg border border-border bg-secondary/20">
            <div className="space-y-2">
              <Label htmlFor="max-submissions" className="text-xs font-semibold">
                Max Submissions Per Author
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="max-submissions"
                  type="number"
                  min={1}
                  max={100}
                  value={event.maxSubmissionsPerAuthor || 5}
                  onChange={(e) =>
                    updateEvent(event.id, {
                      maxSubmissionsPerAuthor: parseInt(e.target.value) || 5,
                    })
                  }
                  className="h-9"
                />
                <span className="text-xs text-muted-foreground">per conference</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Authors cannot submit more than this number of abstracts for {event.name}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-editing" className="text-xs font-semibold">
                  Allow Editing After Deadline
                </Label>
              </div>
              <div className="flex items-center gap-2 h-9 px-3 rounded border border-border bg-background">
                <Switch
                  id="allow-editing"
                  checked={event.allowEditingAfterDeadline || false}
                  onCheckedChange={(checked) =>
                    updateEvent(event.id, {
                      allowEditingAfterDeadline: checked,
                    })
                  }
                />
                <span className="text-xs text-muted-foreground">
                  {event.allowEditingAfterDeadline ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Allows authors to edit submissions after the deadline has passed
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Submission Policies</h4>
            </div>
            <div className="p-4 rounded-lg border border-border bg-secondary/10 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Submission Period
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {event.submissionStartDate || "Not specified"} to{" "}
                    {event.submissionDeadline}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Review Period
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Until {event.reviewDeadline}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Current Submissions
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {event.submissions} abstracts submitted
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="gradient-primary text-white border-0"
            onClick={() => toast.success("Event settings saved!")}
          >
            <Save className="h-4 w-4 mr-2" /> Save Settings
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─── Research Categories Tab ─── */
function ResearchCategoriesTab() {
  const { events } = useEventStore();
  const {
    conferenceCategories,
    getCategoriesForConference,
    addCategory,
    removeCategory,
    updateCategory,
    addSubcategory,
    removeSubcategory,
    updateSubcategory,
  } = useCategoryStore();
  const [selectedConference, setSelectedConference] = useState(events[0]?.id || '');
  const [newCat, setNewCat] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editingSub, setEditingSub] = useState<{
    catId: string;
    sub: string;
  } | null>(null);
  const [newSub, setNewSub] = useState<{ id: string; name: string }>({
    id: '',
    name: '',
  });

  const categories = getCategoriesForConference(selectedConference);

  const handleAddCat = () => {
    if (!newCat.trim()) return toast.error('Category name is required');
    if (
      categories.some(
        (c) => c.name.toLowerCase() === newCat.trim().toLowerCase(),
      )
    )
      return toast.error('Category already exists');
    addCategory(selectedConference, newCat.trim());
    setNewCat('');
    toast.success('Category added!');
  };

  const handleAddSub = (catId: string) => {
    if (!newSub.name.trim()) return toast.error('Subcategory name is required');
    addSubcategory(selectedConference, catId, newSub.name.trim());
    setNewSub({ id: '', name: '' });
    toast.success('Subcategory added!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">
            Research Categories & Subcategories
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Define the taxonomy for abstract submissions per conference.
          </p>
        </div>
      </div>

      {/* Conference Selector */}
      <div className="flex items-center gap-3">
        <Label className="text-xs font-semibold whitespace-nowrap">
          Select Conference:
        </Label>
        <Select value={selectedConference} onValueChange={setSelectedConference}>
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Choose a conference" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedConference && (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="New category name..."
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCat()}
            />
            <Button
              onClick={handleAddCat}
              className="gradient-primary text-white border-0"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add Category
            </Button>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-xl border border-border overflow-hidden bg-card/50"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-b border-border">
              <div className="flex-1 min-w-0 mr-4">
                {editingCat === cat.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={cat.name}
                      onChange={(e) => updateCategory(selectedConference, cat.id, e.target.value)}
                      className="h-8 text-sm max-w-[200px]"
                      autoFocus
                      onBlur={() => setEditingCat(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingCat(null)
                      }
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingCat(null)}
                    >
                      <Check className="h-4 w-4 text-success" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {cat.name}
                    </span>
                    <button
                      onClick={() => setEditingCat(cat.id)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-bold text-muted-foreground uppercase">
                  {cat.subcategories.length} Subcategories
                </span>
                <button
                  onClick={() => {
                    removeCategory(selectedConference, cat.id);
                    toast.info("Category removed");
                  }}
                  className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-card group"
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      {editingSub?.catId === cat.id &&
                      editingSub.sub === sub ? (
                        <Input
                          defaultValue={sub}
                          className="h-7 text-xs"
                          autoFocus
                          onBlur={(e) => {
                            if (e.target.value !== sub)
                              updateSubcategory(selectedConference, cat.id, sub, e.target.value);
                            setEditingSub(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateSubcategory(
                                selectedConference,
                                cat.id,
                                sub,
                                e.currentTarget.value,
                              );
                              setEditingSub(null);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground truncate">
                          {sub}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingSub({ catId: cat.id, sub })}
                        className="text-muted-foreground hover:text-primary p-1 rounded transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeSubcategory(selectedConference, cat.id, sub)}
                        className="text-destructive hover:text-destructive/20 p-1 rounded transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {newSub.id === cat.id ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Subcategory name..."
                    value={newSub.name}
                    onChange={(e) =>
                      setNewSub({ ...newSub, name: e.target.value })
                    }
                    className="h-8 text-xs flex-1"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleAddSub(cat.id)}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddSub(cat.id)}
                    className="h-8 text-xs"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs"
                    onClick={() => setNewSub({ id: "", name: "" })}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-primary hover:bg-primary/5 w-fit"
                  onClick={() => setNewSub({ id: cat.id, name: "" })}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Subcategory
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

/* ─── Final Categories Tab ─── */
function FinalCategoriesTab() {
  const { events } = useEventStore();
  const {
    conferenceFinalCategories,
    getFinalCategoriesForConference,
    addFinalCategory,
    removeFinalCategory,
    updateFinalCategory,
  } = useFinalCategoryStore();
  const [selectedConference, setSelectedConference] = useState(events[0]?.id || '');
  const [newFinalCat, setNewFinalCat] = useState('');
  const [editingFinalCat, setEditingFinalCat] = useState<string | null>(null);

  const finalCategories = getFinalCategoriesForConference(selectedConference);

  const handleAddFinalCat = () => {
    if (!newFinalCat.trim()) return toast.error('Category name is required');
    if (
      finalCategories.some(
        (c) => c.name.toLowerCase() === newFinalCat.trim().toLowerCase(),
      )
    )
      return toast.error('Category already exists');
    addFinalCategory(selectedConference, newFinalCat.trim());
    setNewFinalCat('');
    toast.success('Final category added!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">
            Final Categories (Submission Types)
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Define submission format options (e.g., e-poster, free poster, oral presentation).
          </p>
        </div>
      </div>

      {/* Conference Selector */}
      <div className="flex items-center gap-3">
        <Label className="text-xs font-semibold whitespace-nowrap">
          Select Conference:
        </Label>
        <Select value={selectedConference} onValueChange={setSelectedConference}>
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Choose a conference" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedConference && (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="New final category name..."
              value={newFinalCat}
              onChange={(e) => setNewFinalCat(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddFinalCat()}
            />
            <Button
              onClick={handleAddFinalCat}
              className="gradient-primary text-white border-0"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add Category
            </Button>
          </div>

          <div className="space-y-2">
            {finalCategories.length > 0 ? (
              finalCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    {editingFinalCat === cat.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={cat.name}
                          onChange={(e) => updateFinalCategory(selectedConference, cat.id, e.target.value)}
                          className="h-8 text-sm flex-1"
                          autoFocus
                          onBlur={() => setEditingFinalCat(null)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && setEditingFinalCat(null)
                          }
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setEditingFinalCat(null)}
                        >
                          <Check className="h-4 w-4 text-success" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {cat.name}
                        </span>
                        <button
                          onClick={() => setEditingFinalCat(cat.id)}
                          className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      removeFinalCategory(selectedConference, cat.id);
                      toast.info("Category removed");
                    }}
                    className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground italic p-4 text-center border border-dashed border-border rounded-lg">
                No final categories defined. Add one above.
              </div>
            )}
          </div>

          <Button
            className="gradient-primary text-white border-0 mt-4"
            onClick={() => toast.success("Final categories saved!")}
          >
            <Save className="h-4 w-4 mr-2" /> Save Final Categories
          </Button>
        </>
      )}
    </div>
  );
}

/* ─── Grade Criteria Tab ─── */
function GradeCriteriaTab() {
  const { events } = useEventStore();
  const {
    getEventThresholds,
    updateEventThreshold,
    addEventThreshold,
    removeEventThreshold,
  } = useGradeCriteriaStore();
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || "");
  const [showAdd, setShowAdd] = useState(false);
  const [newGrade, setNewGrade] = useState({
    label: "",
    status: "rejected" as GradeThreshold["status"],
    min: 0,
    max: 0,
  });

  const thresholds = getEventThresholds(selectedEvent);

  const handleAdd = () => {
    if (!newGrade.label.trim()) return toast.error("Label is required");
    addEventThreshold(selectedEvent, {
      id: `grade-${Date.now()}`,
      label: newGrade.label.trim(),
      status: newGrade.status,
      min: newGrade.min,
      max: newGrade.max,
      color:
        newGrade.status === "accepted"
          ? "text-success"
          : newGrade.status === "rejected"
            ? "text-destructive"
            : "text-warning",
    });
    setNewGrade({ label: "", status: "rejected", min: 0, max: 0 });
    setShowAdd(false);
    toast.success("Grade threshold added!");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Award className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">Grade Criteria Configuration</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Define score thresholds for automatic grading per conference. Submissions will be
        auto-assigned a status based on their average review score.
      </p>

      <div className="flex items-center gap-3">
        <Label className="text-xs font-semibold whitespace-nowrap">
          Select Conference:
        </Label>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Choose a conference" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEvent && (
        <>
          <div className="space-y-3">
            {thresholds
              .sort((a, b) => a.min - b.min)
              .map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-secondary/20 hover:border-primary/30 transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-sm font-bold", t.color)}>
                        {t.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-semibold text-muted-foreground uppercase">
                        {t.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Score range: {t.min} – {t.max}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-[10px] text-muted-foreground">
                        Min
                      </Label>
                      <Input
                        type="number"
                        value={t.min}
                        onChange={(e) =>
                          updateEventThreshold(selectedEvent, t.id, {
                            min: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-8 w-20 text-xs"
                        step="0.1"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Label className="text-[10px] text-muted-foreground">
                        Max
                      </Label>
                      <Input
                        type="number"
                        value={t.max}
                        onChange={(e) =>
                          updateEventThreshold(selectedEvent, t.id, {
                            max: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-8 w-20 text-xs"
                        step="0.1"
                      />
                    </div>
                    <button
                      onClick={() => {
                        removeEventThreshold(selectedEvent, t.id);
                        toast.info("Threshold removed");
                      }}
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {!showAdd ? (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => setShowAdd(true)}
            >
              <Plus className="h-3.5 w-3.5" /> Add Grade Threshold
            </Button>
          ) : (
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
              <h4 className="text-xs font-bold text-primary">
                New Grade Threshold
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Label *</Label>
                  <Input
                    placeholder="e.g. Accepted"
                    value={newGrade.label}
                    onChange={(e) =>
                      setNewGrade((p) => ({ ...p, label: e.target.value }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={newGrade.status}
                    onValueChange={(v) =>
                      setNewGrade((p) => ({
                        ...p,
                        status: v as GradeThreshold["status"],
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="revision_required">
                        Revision Required
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Min Score</Label>
                  <Input
                    type="number"
                    value={newGrade.min}
                    onChange={(e) =>
                      setNewGrade((p) => ({
                        ...p,
                        min: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="h-8 text-xs"
                    step="0.1"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Score</Label>
                  <Input
                    type="number"
                    value={newGrade.max}
                    onChange={(e) =>
                      setNewGrade((p) => ({
                        ...p,
                        max: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="h-8 text-xs"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="gradient-primary text-white border-0 h-8 text-xs"
                  onClick={handleAdd}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Button
            className="gradient-primary text-white border-0 mt-4"
            onClick={() => toast.success("Grade criteria saved!")}
          >
            <Save className="h-4 w-4 mr-2" /> Save Grade Criteria
          </Button>
        </>
      )}
    </div>
  );
}

/* ─── Author Configuration Tab ─── */
function AuthorConfigTab() {
  const { events } = useEventStore();
  const { getCategoriesForConference } = useCategoryStore();
  const {
    configs,
    getConfigForEvent,
    addSubmissionField,
    updateSubmissionField,
    removeSubmissionField,
    toggleSubmissionField,
    reorderSubmissionFields,
    addFieldOption,
    removeFieldOption,
  } = useFormConfigStore();
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || "");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showAddField, setShowAddField] = useState(false);
  const [managingOptions, setManagingOptions] = useState<string | null>(null);
  const [newOption, setNewOption] = useState("");
  const [newField, setNewField] = useState<Partial<SubmissionField>>({
    label: "",
    type: "text",
    required: false,
    placeholder: "",
    enabled: true,
  });

  const config = getConfigForEvent(selectedEvent);
  const fields = config.submissionFields.sort((a, b) => a.order - b.order);
  const categories = getCategoriesForConference(selectedEvent);

  const handleAddField = () => {
    if (!newField.label?.trim()) return toast.error("Field label is required.");
    const id =
      newField.label
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") +
      "_" +
      Date.now();
    addSubmissionField(selectedEvent, {
      id,
      label: newField.label.trim(),
      type: newField.type || "text",
      required: newField.required || false,
      placeholder: newField.placeholder || "",
      enabled: true,
      order: fields.length,
      options: newField.type === "select" ? [] : undefined,
    });
    setNewField({
      label: "",
      type: "text",
      required: false,
      placeholder: "",
      enabled: true,
    });
    setShowAddField(false);
    toast.success("Field added!");
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    const newFields = [...fields];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newFields.length) return;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    newFields.forEach((f, i) => (f.order = i));
    reorderSubmissionFields(selectedEvent, newFields);
    toast.success(`Field moved ${direction}!`);
  };

  const handleAddOption = (fieldId: string) => {
    if (!newOption.trim()) return toast.error("Option cannot be empty");
    addFieldOption(selectedEvent, fieldId, newOption.trim());
    setNewOption("");
    toast.success("Option added!");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">
          Author Submission Form Configuration
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Configure which fields appear in the abstract submission form. Changes
        reflect immediately.
      </p>

      <div className="flex items-center gap-3">
        <Label className="text-xs font-semibold whitespace-nowrap">
          Select Conference:
        </Label>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Choose a conference" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Linked Research Categories Section */}
      {selectedEvent && (
        <div className="p-4 rounded-xl border border-blue-200/50 bg-blue-50 dark:bg-blue-950/20 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-100 mb-1">
                📋 Research Categories (Auto-Linked)
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
                The Category and Subcategory fields automatically use the research categories from{" "}
                <button
                  onClick={() => {
                    const tabs = document.querySelectorAll(
                      "button[class*='font-semibold']",
                    );
                    tabs.forEach((tab) => {
                      if ((tab as HTMLElement).textContent?.includes("Research Categories"))
                        (tab as HTMLElement).click();
                    });
                  }}
                  className="font-semibold underline hover:opacity-80 transition-opacity"
                >
                  Research Categories tab
                </button>
                .
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="text-xs bg-white dark:bg-slate-800 rounded p-2 space-y-1"
                    >
                      <div className="font-semibold text-foreground">
                        • {cat.name}
                      </div>
                      {cat.subcategories.length > 0 ? (
                        <div className="ml-3 space-y-0.5">
                          {cat.subcategories.map((sub) => (
                            <div key={sub} className="text-muted-foreground">
                              ↳ {sub}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-3 text-muted-foreground text-[10px] italic">
                          No subcategories
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-blue-700 dark:text-blue-300 italic">
                    No research categories defined. Add categories in the
                    Research Categories tab.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                {fields.filter((f) => f.enabled).length} of {fields.length}{" "}
                fields enabled
              </Label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5"
                onClick={() => setShowAddField(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Add Field
              </Button>
            </div>
            <div className="grid gap-2">
              {fields.map((field, fieldIndex) => (
                <div
                  key={field.id}
                  className={cn(
                    "rounded-lg border group transition-all",
                    field.enabled
                      ? "border-border bg-secondary/20"
                      : "border-border/50 bg-muted/20 opacity-60",
                  )}
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      {editingField === field.id ? (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateSubmissionField(selectedEvent, field.id, {
                                label: e.target.value,
                              })
                            }
                            className="h-7 text-xs"
                            placeholder="Field label"
                          />
                          <Input
                            value={field.placeholder || ""}
                            onChange={(e) =>
                              updateSubmissionField(selectedEvent, field.id, {
                                placeholder: e.target.value,
                              })
                            }
                            placeholder="Placeholder text..."
                            className="h-7 text-xs"
                          />
                          <Select
                            value={field.type}
                            onValueChange={(v) =>
                              updateSubmissionField(selectedEvent, field.id, {
                                type: v as SubmissionField["type"],
                              })
                            }
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text Input</SelectItem>
                              <SelectItem value="textarea">Text Area</SelectItem>
                              <SelectItem value="select">
                                Dropdown Select
                              </SelectItem>
                              <SelectItem value="category">
                                Research Category
                              </SelectItem>
                              <SelectItem value="subcategory">
                                Subcategory
                              </SelectItem>
                              <SelectItem value="keywords">Keywords</SelectItem>
                              <SelectItem value="image">Image Upload</SelectItem>
                              <SelectItem value="file">File Upload</SelectItem>
                              <SelectItem value="coauthors">
                                Co-Authors
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(v) =>
                                updateSubmissionField(selectedEvent, field.id, {
                                  required: v,
                                })
                              }
                            />
                            <span className="text-[10px] text-muted-foreground">
                              Required
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs col-span-2 w-fit"
                            onClick={() => setEditingField(null)}
                          >
                            Done
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">
                            {field.label}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground uppercase font-semibold">
                            {field.type}
                          </span>
                          {field.required && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                              Required
                            </span>
                          )}
                          {(field.id === "category" ||
                            field.id === "subcategory") && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                              🔗 Auto-Linked
                            </span>
                          )}
                        </div>
                      )}

                      {/* Options management for dropdown fields (except auto-linked category fields) */}
                      {field.type === "select" &&
                        field.id !== "category" &&
                        field.id !== "subcategory" &&
                        managingOptions === field.id && (
                        <div className="p-3 rounded bg-background/50 border border-border/50 space-y-2 mt-2">
                          <div className="text-[11px] font-semibold text-foreground mb-2">
                            Dropdown Options
                          </div>
                          <div className="space-y-1">
                            {field.options?.map((option) => (
                              <div
                                key={option}
                                className="flex items-center justify-between text-xs bg-card px-2 py-1.5 rounded border border-border/50"
                              >
                                <span>{option}</span>
                                <button
                                  onClick={() =>
                                    removeFieldOption(selectedEvent, field.id, option)
                                  }
                                  className="text-destructive hover:text-destructive/80 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-1.5 pt-1">
                            <Input
                              type="text"
                              placeholder="Add new option..."
                              value={newOption}
                              onChange={(e) => setNewOption(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleAddOption(field.id)
                              }
                              className="h-7 text-xs flex-1"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs px-2"
                              onClick={() => handleAddOption(field.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs px-2"
                              onClick={() => {
                                setManagingOptions(null);
                                setNewOption("");
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move up/down buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => handleMoveField(fieldIndex, "up")}
                          disabled={fieldIndex === 0}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-secondary p-1 rounded disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleMoveField(fieldIndex, "down")}
                          disabled={fieldIndex === fields.length - 1}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-secondary p-1 rounded disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Toggle and edit */}
                      <Switch
                        checked={field.enabled}
                        onCheckedChange={() =>
                          toggleSubmissionField(selectedEvent, field.id)
                        }
                        className="scale-75"
                      />
                      <button
                        onClick={() =>
                          setEditingField(
                            editingField === field.id ? null : field.id,
                          )
                        }
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-md transition-all"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>

                      {/* Options button for dropdowns (except auto-linked category fields) */}
                      {field.type === "select" &&
                        field.id !== "category" &&
                        field.id !== "subcategory" && (
                        <button
                          onClick={() =>
                            setManagingOptions(
                              managingOptions === field.id ? null : field.id,
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 text-primary hover:bg-primary/10 px-2 py-1.5 rounded text-[10px] font-semibold transition-all"
                        >
                          {field.options?.length || 0} Options
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => {
                          removeSubmissionField(selectedEvent, field.id);
                          toast.success("Field removed.");
                        }}
                        className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-all"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showAddField && (
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
              <h4 className="text-xs font-bold">Add New Field</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Field Label *</Label>
                  <Input
                    placeholder="e.g. Research Area"
                    value={newField.label}
                    onChange={(e) =>
                      setNewField((p) => ({ ...p, label: e.target.value }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Field Type</Label>
                  <Select
                    value={newField.type}
                    onValueChange={(v) =>
                      setNewField((p) => ({
                        ...p,
                        type: v as SubmissionField["type"],
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Input</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="select">Dropdown Select</SelectItem>
                      <SelectItem value="keywords">Keywords</SelectItem>
                      <SelectItem value="image">Image Upload</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Placeholder</Label>
                  <Input
                    placeholder="Placeholder text..."
                    value={newField.placeholder}
                    onChange={(e) =>
                      setNewField((p) => ({
                        ...p,
                        placeholder: e.target.value,
                      }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 self-end pb-1">
                  <Switch
                    checked={newField.required}
                    onCheckedChange={(v) =>
                      setNewField((p) => ({ ...p, required: v }))
                    }
                  />
                  <span className="text-xs">Required</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="gradient-primary text-white border-0 h-8 text-xs"
                  onClick={handleAddField}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Field
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => setShowAddField(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Reviewer Configuration Tab ─── */
function ReviewerConfigTab() {
  const { events } = useEventStore();
  const {
    getConfigForEvent,
    addReviewCriterion,
    updateReviewCriterion,
    removeReviewCriterion,
    toggleReviewCriterion,
  } = useFormConfigStore();
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || "");
  const [editingCriterion, setEditingCriterion] = useState<string | null>(null);
  const [showAddCriterion, setShowAddCriterion] = useState(false);
  const [newCriterion, setNewCriterion] = useState({
    label: "",
    description: "",
    maxScore: 10,
  });

  const config = getConfigForEvent(selectedEvent);
  const criteria = config.reviewCriteria.sort((a, b) => a.order - b.order);

  const handleAddCriterion = () => {
    if (!newCriterion.label.trim())
      return toast.error("Criterion label is required.");
    const id =
      newCriterion.label
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") +
      "_" +
      Date.now();
    addReviewCriterion(selectedEvent, {
      id,
      key: id,
      label: newCriterion.label.trim(),
      description: newCriterion.description.trim(),
      maxScore: newCriterion.maxScore,
      enabled: true,
      order: criteria.length,
    });
    setNewCriterion({ label: "", description: "", maxScore: 10 });
    setShowAddCriterion(false);
    toast.success("Criterion added!");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">
          Reviewer Evaluation Form Configuration
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Configure the scoring criteria that reviewers use to evaluate
        submissions.
      </p>

      <div className="flex items-center gap-3">
        <Label className="text-xs font-semibold whitespace-nowrap">
          Select Conference:
        </Label>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Choose a conference" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEvent && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                {criteria.filter((c) => c.enabled).length} of {criteria.length}{" "}
                criteria enabled
              </Label>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5"
                onClick={() => setShowAddCriterion(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Add Criterion
              </Button>
            </div>

            <div className="grid gap-2">
              {criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg border group transition-all",
                    criterion.enabled
                      ? "border-border bg-secondary/20 hover:border-primary/30"
                      : "border-border/50 bg-muted/20 opacity-60",
                  )}
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingCriterion === criterion.id ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px]">Label</Label>
                          <Input
                            value={criterion.label}
                            onChange={(e) =>
                              updateReviewCriterion(
                                selectedEvent,
                                criterion.id,
                                { label: e.target.value },
                              )
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Max Score</Label>
                          <Input
                            type="number"
                            value={criterion.maxScore}
                            onChange={(e) =>
                              updateReviewCriterion(
                                selectedEvent,
                                criterion.id,
                                { maxScore: parseInt(e.target.value) || 10 },
                              )
                            }
                            className="h-7 text-xs"
                            min={1}
                            max={100}
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-[10px]">Description</Label>
                          <Input
                            value={criterion.description}
                            onChange={(e) =>
                              updateReviewCriterion(
                                selectedEvent,
                                criterion.id,
                                { description: e.target.value },
                              )
                            }
                            className="h-7 text-xs"
                            placeholder="Describe this criterion..."
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs w-fit"
                          onClick={() => setEditingCriterion(null)}
                        >
                          Done
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {criterion.label}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                            Max: {criterion.maxScore}
                          </span>
                        </div>
                        {criterion.description && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {criterion.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Switch
                      checked={criterion.enabled}
                      onCheckedChange={() =>
                        toggleReviewCriterion(selectedEvent, criterion.id)
                      }
                      className="scale-75"
                    />
                    <button
                      onClick={() =>
                        setEditingCriterion(
                          editingCriterion === criterion.id
                            ? null
                            : criterion.id,
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-md transition-all"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => {
                        removeReviewCriterion(selectedEvent, criterion.id);
                        toast.success("Criterion removed.");
                      }}
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showAddCriterion && (
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
              <h4 className="text-xs font-bold">Add New Criterion</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Label *</Label>
                  <Input
                    placeholder="e.g. Innovation"
                    value={newCriterion.label}
                    onChange={(e) =>
                      setNewCriterion((p) => ({ ...p, label: e.target.value }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input
                    placeholder="Describe..."
                    value={newCriterion.description}
                    onChange={(e) =>
                      setNewCriterion((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Score</Label>
                  <Input
                    type="number"
                    value={newCriterion.maxScore}
                    onChange={(e) =>
                      setNewCriterion((p) => ({
                        ...p,
                        maxScore: parseInt(e.target.value) || 10,
                      }))
                    }
                    className="h-8 text-xs"
                    min={1}
                    max={100}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="gradient-primary text-white border-0 h-8 text-xs"
                  onClick={handleAddCriterion}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Criterion
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => setShowAddCriterion(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Notifications Tab ─── */
function NotificationsTab() {
  const [notifSettings, setNotifSettings] = useState({
    emailSubmission: true,
    emailReview: true,
    emailDeadline: true,
    emailResult: true,
    browserPush: false,
  });
  const toggle = (k: keyof typeof notifSettings) =>
    setNotifSettings((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="space-y-5 max-w-lg">
      <h3 className="text-sm font-bold">Notification Preferences</h3>
      {[
        {
          key: "emailSubmission" as const,
          label: "Submission Confirmation Emails",
          desc: "Send email when abstract is submitted",
        },
        {
          key: "emailReview" as const,
          label: "Review Assignment Emails",
          desc: "Notify reviewers when assigned",
        },
        {
          key: "emailDeadline" as const,
          label: "Deadline Reminder Emails",
          desc: "Send reminders 3 days before deadlines",
        },
        {
          key: "emailResult" as const,
          label: "Result Announcement Emails",
          desc: "Notify authors of review decisions",
        },
        {
          key: "browserPush" as const,
          label: "Browser Push Notifications",
          desc: "Real-time in-browser notifications",
        },
      ].map(({ key, label, desc }) => (
        <div
          key={key}
          className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
        >
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
          <Switch
            checked={notifSettings[key]}
            onCheckedChange={() => toggle(key)}
          />
        </div>
      ))}
      <Button
        className="gradient-primary text-white border-0"
        onClick={() => toast.success("Notification settings saved!")}
      >
        <Save className="h-4 w-4 mr-2" /> Save
      </Button>
    </div>
  );
}

/* ─── Security Tab ─── */
function SecurityTab() {
  return (
    <div className="space-y-5 max-w-lg">
      <h3 className="text-sm font-bold">Security Settings</h3>
      <div className="space-y-1.5">
        <Label>Current Password</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-1.5">
        <Label>New Password</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-1.5">
        <Label>Confirm New Password</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="flex items-center justify-between p-3 bg-secondary/60 rounded-xl">
        <div>
          <p className="text-sm font-medium">Two-Factor Authentication</p>
          <p className="text-xs text-muted-foreground">
            Add an extra layer of security
          </p>
        </div>
        <Switch />
      </div>
      <Button
        className="gradient-primary text-white border-0"
        onClick={() => toast.success("Security settings updated!")}
      >
        <Save className="h-4 w-4 mr-2" /> Update Security
      </Button>
    </div>
  );
}
