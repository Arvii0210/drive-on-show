import { useState, useMemo } from "react";
import {
  Send,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/shared/PageHeader";
import { FileUpload } from "@/components/shared/FileUpload";
import { StatusBadge } from "@/components/shared/StatusBadge";
import SubmissionVersionHistory from "@/components/shared/SubmissionVersionHistory";
import { useCategoryStore } from "@/store/categoryStore";
import { useFinalCategoryStore } from "@/store/finalCategoryStore";
import { useSubmissionStore } from "@/store/submissionStore";
import { useFormConfigStore } from "@/store/formConfigStore";
import { useEventStore } from "@/store/eventStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Submission } from "@/data/mockData";

interface CoAuthor {
  name: string;
  email: string;
  institution: string;
}

export default function SubmitAbstract() {
  const {
    addSubmission,
    submissions,
    checkCanEditSubmission,
    updateSubmissionWithVersion,
    canAddSubmission,
  } = useSubmissionStore();
  const { getCategoriesForConference } = useCategoryStore();
  const { events } = useEventStore();
  const { getSubmissionFields } = useFormConfigStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");
  const editingSub = editId ? submissions.find((s) => s.id === editId) : null;

  // Check edit permissions
  const eventId = events[0]?.id || "";
  const editPermission = editingSub
    ? checkCanEditSubmission(editingSub.id, eventId)
    : { allowed: true };

  // Check submission limit for new submissions
  const authorEmail = editingSub?.authorEmail || "sarah.chen@university.edu";
  const submissionLimit = !editingSub
    ? canAddSubmission(authorEmail, eventId)
    : { allowed: true };

  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Use first event as default context for field config
  const defaultEventId = events[0]?.id || "";
  const fields = useMemo(
    () => getSubmissionFields(defaultEventId),
    [defaultEventId, getSubmissionFields],
  );

  const categories = useMemo(
    () => getCategoriesForConference(defaultEventId),
    [defaultEventId, getCategoriesForConference],
  );

  // Group fields into steps
  const basicFields = fields.filter((f) =>
    ["text", "select", "keywords", "category", "subcategory"].includes(f.type),
  );
  const contentFields = fields.filter((f) => f.type === "textarea");
  const imageFields = fields.filter((f) => f.type === "image");
  const hasCoauthors = fields.some((f) => f.type === "coauthors");
  const hasFileUpload = fields.some((f) => f.type === "file");

  const STEPS = useMemo(() => {
    const steps = ["Basic Info"];
    if (contentFields.length > 0 || imageFields.length > 0) steps.push("Abstract Content");
    if (hasCoauthors) steps.push("Co-Authors");
    if (hasFileUpload) steps.push("File Upload");
    steps.push("Preview");
    return steps;
  }, [contentFields.length, imageFields.length, hasCoauthors, hasFileUpload]);

  const [step, setStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Record<string, File | null>>({});
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>(
    editingSub?.coAuthors?.length
      ? editingSub.coAuthors
      : [{ name: "", email: "", institution: "" }],
  );
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (editingSub) {
      return {
        title: editingSub.title || "",
        category: editingSub.category || "",
        subcategory: editingSub.subcategory || "",
        keywords: editingSub.keywords?.join(", ") || "",
        introduction: editingSub.content?.introduction || "",
        aim: editingSub.content?.aim || "",
        methods: editingSub.content?.methods || "",
        results: editingSub.content?.results || "",
        conclusion: editingSub.content?.conclusion || "",
      };
    }
    return {};
  });

  const updateField = (id: string, value: string) =>
    setFormData((prev) => ({ ...prev, [id]: value }));

  const updateCoAuthor = (i: number, k: keyof CoAuthor, v: string) =>
    setCoAuthors((prev) =>
      prev.map((ca, idx) => (idx === i ? { ...ca, [k]: v } : ca)),
    );
  const addCoAuthor = () =>
    setCoAuthors((prev) => [...prev, { name: "", email: "", institution: "" }]);
  const removeCoAuthor = (i: number) =>
    setCoAuthors((prev) => prev.filter((_, idx) => idx !== i));

  const getStepType = (stepIndex: number) => {
    let idx = 0;
    if (stepIndex === idx) return "basic";
    idx++;
    if (contentFields.length > 0) {
      if (stepIndex === idx) return "content";
      idx++;
    }
    if (hasCoauthors) {
      if (stepIndex === idx) return "coauthors";
      idx++;
    }
    if (hasFileUpload) {
      if (stepIndex === idx) return "file";
      idx++;
    }
    return "preview";
  };

  const currentStepType = getStepType(step);

  const canGoNext = () => {
    if (currentStepType === "basic") {
      const basicValid = basicFields
        .filter((f) => f.required)
        .every((f) => formData[f.id]?.trim());
      const selectedCategory = categories.find(
        (c) => c.name === formData["category"],
      );
      const subcategoryValid =
        selectedCategory && selectedCategory.subcategories.length > 0
          ? !!formData["subcategory"]
          : true;
      return basicValid && subcategoryValid;
    }
    if (currentStepType === "content") {
      return contentFields
        .filter((f) => f.required)
        .every((f) => formData[f.id]?.trim());
    }
    return true;
  };

  const buildSubmission = (status: "draft" | "submitted"): Submission => ({
    id: editingSub?.id || `ABS-2025-${String(Date.now()).slice(-3)}`,
    title: formData["title"] || "Untitled Draft",
    category: formData["category"] || "Uncategorized",
    subcategory: formData["subcategory"] || "",
    author: editingSub?.author || "Dr. Sarah Chen",
    authorEmail: editingSub?.authorEmail || "sarah.chen@university.edu",
    institution: editingSub?.institution || "MIT",
    department: editingSub?.department || "Computer Science",
    keywords: (formData["keywords"] || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    submissionDate: new Date().toISOString().split("T")[0],
    status: status as any,
    averageScore: editingSub?.averageScore ?? null,
    assignedReviewers: editingSub?.assignedReviewers || [],
    content: {
      introduction: formData["introduction"] || "",
      aim: formData["aim"] || "",
      methods: formData["methods"] || "",
      results: formData["results"] || "",
      conclusion: formData["conclusion"] || "",
    },
    coAuthors: coAuthors.filter((ca) => ca.name),
  });

  const handleSaveDraft = () => {
    if (!editingSub) {
      addSubmission(buildSubmission("draft"));
      toast.info("Draft saved!");
    } else {
      const changeSummary = "Updated draft - abstract content modified";
      updateSubmissionWithVersion(
        editingSub.id,
        buildSubmission("draft"),
        changeSummary,
      );
      toast.info("Draft updated with version snapshot!");
    }
    navigate("/author/submissions");
  };

  const handleSubmit = () => {
    if (!submissionLimit.allowed) {
      toast.error(submissionLimit.reason || "Cannot submit at this time");
      return;
    }

    if (!editingSub) {
      addSubmission(buildSubmission("submitted"));
      toast.success("Abstract submitted successfully!", {
        description: "You will be notified when the review is complete.",
      });
    } else {
      const changeSummary = "Final submission - abstract ready for review";
      updateSubmissionWithVersion(
        editingSub.id,
        buildSubmission("submitted"),
        changeSummary,
      );
      toast.success("Submission updated successfully!");
    }
    navigate("/author/submissions");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <PageHeader
        title={editingSub ? "Edit Submission" : "Submit Abstract"}
        subtitle={
          editingSub
            ? `Editing ${editingSub.id}`
            : "Follow the steps to submit your research abstract"
        }
        icon={Send}
      />

      {/* Edit permission warning */}
      {editingSub && !editPermission.allowed && (
        <Alert className="border-warning/50 bg-warning/8">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription>
            <p className="text-sm font-semibold text-warning mb-1">
              Editing Disabled
            </p>
            <p className="text-xs text-warning/90">{editPermission.reason}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Submission limit warning for new submissions */}
      {!editingSub && !submissionLimit.allowed && (
        <Alert className="border-destructive/50 bg-destructive/8">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription>
            <p className="text-sm font-semibold text-destructive mb-1">
              Submission Limit Reached
            </p>
            <p className="text-xs text-destructive/90">
              {submissionLimit.reason}
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Submission count info */}
      {!editingSub &&
        submissionLimit.allowed &&
        submissionLimit.currentCount !== undefined && (
          <div className="bg-primary/8 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-primary/80">
              <span className="font-semibold">Submission Progress:</span>{" "}
              {submissionLimit.currentCount} of {submissionLimit.maxCount}{" "}
              submissions used
            </p>
          </div>
        )}

      {/* Edit permission info */}
      {editingSub && editPermission.allowed && (
        <div className="bg-primary/8 border border-primary/20 rounded-lg p-3 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-primary mb-0.5">
              Editing Enabled
            </p>
            <p className="text-xs text-primary/80">
              Version {editingSub.currentVersion} • Last edited{" "}
              {editingSub.lastEditedDate}
            </p>
          </div>
          {editingSub.versionHistory &&
            editingSub.versionHistory.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs text-primary hover:bg-primary/10"
                onClick={() => setShowVersionHistory(true)}
              >
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                History
              </Button>
            )}
        </div>
      )}

      {/* Step progress tracker */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 shrink-0",
                  i < step
                    ? "bg-success text-white"
                    : i === step
                      ? "gradient-primary text-white shadow-glow"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold whitespace-nowrap transition-colors",
                  i === step
                    ? "text-primary"
                    : i < step
                      ? "text-success"
                      : "text-muted-foreground",
                )}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-4 transition-all duration-500",
                  i < step ? "bg-success" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div
        className={cn(
          "bg-card rounded-xl border border-border shadow-card p-6 space-y-5 animate-scale-in transition-opacity",
          editingSub && !editPermission.allowed
            ? "opacity-50 pointer-events-none"
            : "",
        )}
      >
        {currentStepType === "basic" && (
          <>
            <h3 className="text-sm font-bold">Basic Information</h3>
            {basicFields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label>
                  {field.label} {field.required && "*"}
                </Label>
                {field.type === "text" && (
                  <Input
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => updateField(field.id, e.target.value)}
                  />
                )}
                {field.type === "select" && (
                  <div className="space-y-3">
                    <Select
                      value={formData[field.id] || ""}
                      onValueChange={(v) => {
                        updateField(field.id, v);
                        // Reset subcategory if category changes
                        if (field.id === "category")
                          updateField("subcategory", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select ${field.label.toLowerCase()}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Use configured options if available, fall back to categories for category field */}
                        {field.options && field.options.length > 0
                          ? field.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))
                          : field.id === "category"
                            ? categories.map((c) => (
                                <SelectItem key={c.id} value={c.name}>
                                  {c.name}
                                </SelectItem>
                              ))
                            : null}
                      </SelectContent>
                    </Select>

                    {field.id === "category" && formData["category"] && (
                      <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                        <Label>Subcategory *</Label>
                        <Select
                          value={formData["subcategory"] || ""}
                          onValueChange={(v) => updateField("subcategory", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find((c) => c.name === formData["category"])
                              ?.subcategories.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
                {field.type === "keywords" && (
                  <Input
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => updateField(field.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </>
        )}

        {currentStepType === "content" && (
          <>
            <h3 className="text-sm font-bold">Abstract Content</h3>
            {contentFields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label>
                  {field.label} {field.required && "*"}
                </Label>
                <Textarea
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            ))}
            {imageFields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label>
                  {field.label} {field.required && "*"}
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedImages((prev) => ({
                          ...prev,
                          [field.id]: file,
                        }));
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadedImages[field.id] ? (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-success">✓ Image uploaded</div>
                      <div className="text-xs text-muted-foreground">{uploadedImages[field.id]?.name}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs mt-2"
                        onClick={(e) => {
                          e.preventDefault();
                          setUploadedImages((prev) => ({
                            ...prev,
                            [field.id]: null,
                          }));
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Click to upload image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF or WebP</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {currentStepType === "coauthors" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Co-Authors</h3>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={addCoAuthor}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Co-Author
              </Button>
            </div>
            <div className="space-y-3">
              {coAuthors.map((ca, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Co-Author {i + 1}
                    </span>
                    {i > 0 && (
                      <button
                        onClick={() => removeCoAuthor(i)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="Dr. Jane Doe"
                        value={ca.name}
                        onChange={(e) =>
                          updateCoAuthor(i, "name", e.target.value)
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Email</Label>
                      <Input
                        type="email"
                        placeholder="jane@institution.edu"
                        value={ca.email}
                        onChange={(e) =>
                          updateCoAuthor(i, "email", e.target.value)
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Institution</Label>
                      <Input
                        placeholder="MIT"
                        value={ca.institution}
                        onChange={(e) =>
                          updateCoAuthor(i, "institution", e.target.value)
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {currentStepType === "file" && (
          <>
            <h3 className="text-sm font-bold">Upload Abstract File</h3>
            <p className="text-xs text-muted-foreground">
              Upload your abstract as a PDF, DOC, or DOCX file.
            </p>
            <FileUpload
              onFileSelect={setUploadedFile}
              accept={["pdf", "doc", "docx"]}
              maxSizeMB={10}
            />
          </>
        )}

        {currentStepType === "preview" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Abstract Preview</h3>
              <StatusBadge status="submitted" size="sm" />
            </div>
            <div className="p-4 bg-secondary/40 rounded-xl space-y-3">
              {basicFields.map((f) => (
                <div key={f.id}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                    {f.label}
                  </p>
                  <p className="text-sm font-bold">
                    {formData[f.id] || "—"}
                    {f.id === "category" && formData["subcategory"] && (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        › {formData["subcategory"]}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
            {contentFields.map(
              (f) =>
                formData[f.id] && (
                  <div key={f.id}>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                      {f.label}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {formData[f.id]}
                    </p>
                  </div>
                ),
            )}
            {imageFields.map(
              (f) =>
                uploadedImages[f.id] && (
                  <div key={f.id}>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                      {f.label}
                    </p>
                    <img
                      src={URL.createObjectURL(uploadedImages[f.id]!)}
                      alt={f.label}
                      className="max-w-full h-auto rounded-lg border border-border"
                    />
                  </div>
                ),
            )}
            {coAuthors.filter((ca) => ca.name).length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Co-Authors
                </p>
                {coAuthors
                  .filter((ca) => ca.name)
                  .map((ca, i) => (
                    <p key={i} className="text-sm">
                      {ca.name}
                      {ca.institution ? ` — ${ca.institution}` : ""}
                    </p>
                  ))}
              </div>
            )}
            {uploadedFile && (
              <div className="p-3 bg-success/8 border border-success/20 rounded-lg">
                <p className="text-xs font-medium text-success">
                  📎 File attached: {uploadedFile.name}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="gap-1.5"
            disabled={editingSub && !editPermission.allowed}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
        )}
        <div className="flex-1" />
        {step === STEPS.length - 1 ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={editingSub && !editPermission.allowed}
            >
              Save Draft
            </Button>
            <Button
              className="gradient-primary text-white border-0 hover:opacity-90"
              onClick={handleSubmit}
              disabled={
                (editingSub && !editPermission.allowed) ||
                (!editingSub && !submissionLimit.allowed)
              }
            >
              <Send className="h-4 w-4 mr-2" />{" "}
              {editingSub ? "Update Submission" : "Submit Abstract"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canGoNext() || (editingSub && !editPermission.allowed)}
            className="gradient-primary text-white border-0 hover:opacity-90 gap-1.5 disabled:opacity-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Version history modal */}
      {editingSub && (
        <SubmissionVersionHistory
          versions={editingSub.versionHistory || []}
          currentVersion={editingSub.currentVersion || 1}
          open={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
    </div>
  );
}
