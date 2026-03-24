import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  type Review,
  type ReviewScores,
  type Submission,
} from "@/data/mockData";
import { ArrowLeft, Save, Send, AlertTriangle, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BlindReviewBadge } from "@/components/shared/BlindReviewBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSubmissionStore } from "@/store/submissionStore";
import { useReviewStore } from "@/store/reviewStore";
import { useFormConfigStore } from "@/store/formConfigStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ReviewAbstract() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // 'view' | 're-review' | null (new review)
  const { submissions } = useSubmissionStore();
  const { reviews, submitReview } = useReviewStore();
  const { getReviewCriteria } = useFormConfigStore();

  const submission = submissions.find((s) => s.id === id) ?? submissions[1];

  const criteria = useMemo(
    () => getReviewCriteria("EVT-001"),
    [getReviewCriteria],
  );
  const numCriteria = criteria.length;

  const existingReview = reviews.find((r) => r.submissionId === submission?.id);

  const isViewOnly = mode === "view";
  const isReReview = mode === "re-review";

  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (existingReview) {
      return { ...existingReview.scores };
    }
    const defaults: Record<string, number> = {};
    criteria.forEach((c) => {
      defaults[c.key] = 5;
    });
    return defaults;
  });
  const [comments, setComments] = useState(existingReview?.comments ?? "");
  const [recommendation, setRecommendation] = useState(
    existingReview?.recommendation ?? "accept",
  );
  const [conflictOfInterest, setConflictOfInterest] = useState(false);

  const totalScore = useMemo(
    () => Object.values(scores).reduce((a, b) => a + b, 0),
    [scores],
  );
  const maxTotal = useMemo(
    () => criteria.reduce((sum, c) => sum + c.maxScore, 0),
    [criteria],
  );
  const avgScore = numCriteria > 0 ? +(totalScore / numCriteria).toFixed(2) : 0;
  const pct = maxTotal > 0 ? (totalScore / maxTotal) * 100 : 0;

  const scoreColor =
    pct >= 80
      ? "text-success"
      : pct >= 50
        ? "text-primary"
        : pct >= 35
          ? "text-warning"
          : "text-destructive";

  const updateScore = (key: string, val: number[]) =>
    setScores((s) => ({ ...s, [key]: val[0] }));

  const getScoreLabel = (val: number, max: number) => {
    const pctVal = (val / max) * 100;
    return pctVal <= 30
      ? "Poor"
      : pctVal <= 50
        ? "Fair"
        : pctVal <= 70
          ? "Good"
          : pctVal <= 90
            ? "Excellent"
            : "Outstanding";
  };

  const handleSave = () => {
    toast.info("Review saved as draft");
  };

  const handleSubmit = () => {
    // If conflict of interest is checked, comments are mandatory
    if (conflictOfInterest && !comments.trim()) {
      toast.error("Please add comments explaining the conflict of interest");
      return;
    }

    // Comments are now optional for non-conflict cases

    if (existingReview) {
      submitReview({
        ...existingReview,
        scores: scores as unknown as ReviewScores,
        totalScore,
        recommendation: recommendation as Review["recommendation"],
        comments,
        status: conflictOfInterest ? "not_reviewed" : "completed",
        completedDate: new Date().toISOString().split("T")[0],
      });
    }

    if (isReReview) {
      toast.success("Evaluation Updated Successfully", {
        description: conflictOfInterest
          ? "🚨 Conflict of Interest Recorded - Status set to 'Not Reviewed'"
          : `✅ Completed · Total: ${totalScore}/${maxTotal} · Avg: ${avgScore}/${numCriteria > 0 ? criteria[0].maxScore : 10} · Recommendation: ${recommendation.replace(/_/g, " ")}`,
      });
    } else {
      toast.success("Review submitted successfully!", {
        description: conflictOfInterest
          ? "🚨 Conflict of Interest Recorded - Status set to 'Not Reviewed'"
          : `✅ Completed · Total: ${totalScore}/${maxTotal} · Avg: ${avgScore}/${numCriteria > 0 ? criteria[0].maxScore : 10} · Recommendation: ${recommendation.replace(/_/g, " ")}`,
      });
    }
    navigate("/reviewer/assigned");
  };

  if (!submission) return <p className="p-6">Submission not found.</p>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => navigate("/reviewer/assigned")}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex-1" />
        {isViewOnly && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <Eye className="h-3.5 w-3.5" /> View Only
          </div>
        )}
        {isReReview && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-warning bg-warning/10 px-3 py-1.5 rounded-full">
            Re-Review Mode
          </div>
        )}
        <BlindReviewBadge />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* LEFT: Abstract Preview */}
        <AbstractPreview submission={submission} />

        {/* RIGHT: Evaluation Form */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
          <h3 className="text-sm font-bold">
            {isViewOnly
              ? "Evaluation Summary (Read-Only)"
              : isReReview
                ? "Re-Evaluation Form"
                : `Evaluation Form (${numCriteria} Criteria)`}
          </h3>

          {/* Single Instruction Banner */}
          {!isViewOnly && !conflictOfInterest && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs font-semibold text-primary">
                📍 Drag the point to mark score
              </p>
            </div>
          )}

          {/* Scoring sliders */}
          {!conflictOfInterest && (
          <div className="space-y-4">
            {criteria.map((criterion) => (
              <div key={criterion.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold">
                      {criterion.label}
                    </Label>
                    <p className="text-[10px] text-muted-foreground">
                      {criterion.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold tabular-nums text-primary">
                      {scores[criterion.key] || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      /{criterion.maxScore}
                    </span>
                    <p
                      className={cn(
                        "text-[10px] font-semibold",
                        (scores[criterion.key] || 0) / criterion.maxScore >=
                          0.8
                          ? "text-success"
                          : (scores[criterion.key] || 0) /
                                criterion.maxScore >=
                              0.6
                            ? "text-primary"
                            : (scores[criterion.key] || 0) /
                                  criterion.maxScore >=
                                0.4
                              ? "text-warning"
                              : "text-destructive",
                      )}
                    >
                      {getScoreLabel(
                        scores[criterion.key] || 0,
                        criterion.maxScore,
                      )}
                    </p>
                  </div>
                </div>
                <Slider
                  value={[scores[criterion.key] || 0]}
                  onValueChange={(v) => updateScore(criterion.key, v)}
                  min={1}
                  max={criterion.maxScore}
                  step={1}
                  className="cursor-pointer"
                  disabled={isViewOnly}
                />
              </div>
            ))}
          </div>
          )}

          {/* Live score calculator */}
          {!conflictOfInterest && (
          <div className="p-4 bg-gradient-to-br from-primary/8 to-accent/8 rounded-xl border border-primary/15">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Live Score Summary
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    scoreColor,
                  )}
                >
                  {totalScore}
                  <span className="text-sm text-muted-foreground">
                    /{maxTotal}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Average</p>
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    scoreColor,
                  )}
                >
                  {avgScore}
                  <span className="text-sm text-muted-foreground">
                    /{numCriteria > 0 ? criteria[0].maxScore : 10}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Criteria</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {numCriteria}
                </p>
              </div>
            </div>
            <div className="mt-3 w-full rounded-full bg-secondary h-2 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  pct >= 80
                    ? "bg-success"
                    : pct >= 50
                      ? "gradient-primary"
                      : pct >= 35
                        ? "bg-warning"
                        : "bg-destructive",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          )}

          {/* Comments - always show, but label changes based on conflict */}
          <div className="space-y-1.5">
            <Label>
              {conflictOfInterest
                ? "Conflict of Interest Details"
                : "Reviewer Comments"}{" "}
              {!isViewOnly && conflictOfInterest && "*"}
            </Label>
            <Textarea
              placeholder={
                conflictOfInterest
                  ? "Required: Explain your conflict of interest..."
                  : "Provide detailed feedback for the author..."
              }
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isViewOnly}
            />
            {!isViewOnly && conflictOfInterest && (
              <p className="text-xs text-warning font-medium mt-1">
                ⚠️ Comments are required when submitting with conflict of interest
              </p>
            )}
          </div>

          {/* Recommendation */}
          {!conflictOfInterest && (
          <div className="space-y-1.5">
            <Label>Final Recommendation</Label>
            <Select
              value={recommendation}
              onValueChange={(v: Review["recommendation"]) => setRecommendation(v)}
              disabled={isViewOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accept">✅ Accept</SelectItem>
                <SelectItem value="revision_required">
                  ✏️ Revision Required
                </SelectItem>
                <SelectItem value="reject">❌ Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>
          )}

          {/* Conflict of Interest checkbox */}
          {!isViewOnly && (
            <div
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border transition-colors",
                conflictOfInterest
                  ? "bg-warning/8 border-warning/30"
                  : "bg-secondary/40 border-border",
              )}
            >
              <Checkbox
                id="coi"
                checked={conflictOfInterest}
                onCheckedChange={(v) => setConflictOfInterest(!!v)}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="coi"
                  className="text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  {conflictOfInterest && (
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  )}
                  Conflict of Interest
                </Label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  I have a conflict of interest with the author(s)
                </p>
              </div>
            </div>
          )}

          {/* Conflict of Interest Recorded Badge */}
          {!isViewOnly && conflictOfInterest && (
            <div className="flex items-center gap-2 p-3 bg-warning/15 border border-warning/40 rounded-lg">
              <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-warning">
                  🚨 Conflict of Interest Recorded
                </p>
                <p className="text-[11px] text-warning/80 mt-0.5">
                  This submission will be marked as "Not Reviewed" upon submission
                </p>
              </div>
            </div>
          )}

          {/* Submit buttons */}
          {!isViewOnly && (
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save Draft
              </Button>
              <Button
                className="flex-1 gradient-primary text-white border-0 hover:opacity-90"
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4 mr-2" />{" "}
                {isReReview ? "Update Review" : "Submit Review"}
              </Button>
            </div>
          )}

          {/* View mode: back button */}
          {isViewOnly && (
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/reviewer/assigned")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assigned
              </Button>
              <Button
                className="flex-1 hover:border-primary hover:text-primary"
                variant="outline"
                onClick={() =>
                  navigate(`/reviewer/review/${id}?mode=re-review`)
                }
              >
                Re-Review This Abstract
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Extracted abstract preview component */
function AbstractPreview({ submission }: { submission: Submission }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5 max-h-[80vh] overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-muted-foreground">
            {submission.id}
          </span>
          <StatusBadge status={submission.status} size="sm" />
        </div>
        <h2 className="text-base font-bold text-foreground leading-snug">
          {submission.title}
        </h2>
        <p className="text-xs text-primary font-semibold mt-1">
          {submission.category}
        </p>
      </div>

      {submission.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {submission.keywords.map((kw: string) => (
            <span
              key={kw}
              className="px-2 py-0.5 bg-primary/8 text-primary text-xs rounded-full border border-primary/15"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="p-2.5 bg-purple-500/5 border border-purple-500/15 rounded-lg">
        <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
          🔒 Author identity is hidden in blind review mode
        </p>
      </div>

      {[
        { label: "Introduction", value: submission.content.introduction },
        { label: "Aim & Objectives", value: submission.content.aim },
        { label: "Materials & Methods", value: submission.content.methods },
        { label: "Results", value: submission.content.results },
        { label: "Conclusion", value: submission.content.conclusion },
      ].map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
            {label}
          </p>
          <p className="text-sm text-foreground leading-relaxed">{value}</p>
        </div>
      ))}
    </div>
  );
}
