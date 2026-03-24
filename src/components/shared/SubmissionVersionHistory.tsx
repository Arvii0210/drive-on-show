import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { SubmissionVersion } from '@/data/mockData';

interface SubmissionVersionHistoryProps {
  versions: SubmissionVersion[];
  currentVersion?: number;
  open: boolean;
  onClose: () => void;
}

export default function SubmissionVersionHistory({
  versions,
  currentVersion,
  open,
  onClose,
}: SubmissionVersionHistoryProps) {
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

  // Sort versions in reverse chronological order (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!versions || versions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No version history available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Version History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {sortedVersions.map((version, idx) => (
            <div
              key={idx}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Version Header */}
              <button
                onClick={() =>
                  setExpandedVersion(expandedVersion === idx ? null : idx)
                }
                className="w-full p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">
                        Version {version.versionNumber}
                      </p>
                      {version.versionNumber === currentVersion && (
                        <Badge variant="default" className="h-5 text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(version.createdAt).toLocaleString()} • Edited by{' '}
                      {version.editedBy}
                    </p>
                    <p className="text-xs text-foreground/70 mt-1">
                      {version.changeSummary}
                    </p>
                  </div>
                </div>
                {expandedVersion === idx ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Version Details */}
              {expandedVersion === idx && (
                <div className="p-4 space-y-4 bg-background border-t border-border">
                  {/* Title */}
                  {version.snapshot?.title && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Title
                      </p>
                      <p className="text-sm">{version.snapshot.title}</p>
                    </div>
                  )}

                  {/* Category */}
                  {version.snapshot?.category && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Category
                      </p>
                      <p className="text-sm">{version.snapshot.category}</p>
                    </div>
                  )}

                  {/* Keywords */}
                  {version.snapshot?.keywords &&
                    version.snapshot.keywords.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Keywords
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {version.snapshot.keywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Content Sections */}
                  {version.snapshot?.content && (
                    <div className="space-y-3">
                      {Object.entries(version.snapshot.content).map(
                        ([key, value]: [string, unknown]) =>
                          value && typeof value === 'string' && (
                            <div key={key}>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                {key.charAt(0).toUpperCase() +
                                  key.slice(1).toLowerCase()}
                              </p>
                              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                {value}
                              </p>
                            </div>
                          )
                      )}
                    </div>
                  )}

                  {/* Co-Authors */}
                  {version.snapshot?.coAuthors &&
                    version.snapshot.coAuthors.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Co-Authors
                        </p>
                        <div className="space-y-1">
                          {version.snapshot.coAuthors.map((author, i) => (
                            <p key={i} className="text-sm">
                              {author.name}
                              {author.institution
                                ? ` — ${author.institution}`
                                : ''}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Files */}
                  {version.snapshot?.files && version.snapshot.files.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Files
                      </p>
                      <div className="space-y-1">
                        {version.snapshot.files.map((file, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <p className="text-sm">{file.name}</p>
                            {file.is_latest && (
                              <Badge
                                variant="secondary"
                                className="h-5 text-xs"
                              >
                                Latest
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
