import { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string[];
  maxSizeMB?: number;
}

export function FileUpload({ onFileSelect, accept = ['pdf', 'doc', 'docx'], maxSizeMB = 10 }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = accept.map(e => `.${e}`).join(',');

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!accept.includes(ext ?? '')) {
      toast.error(`Only ${accept.join(', ').toUpperCase()} files are allowed`);
      return;
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File must be smaller than ${maxSizeMB}MB`);
      return;
    }
    setFile(f);
    onFileSelect(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (file) {
    return (
      <div className="flex items-center gap-4 p-4 bg-success/5 border border-success/20 rounded-xl animate-scale-in">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 shrink-0">
          <CheckCircle className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
        </div>
        <button
          onClick={handleRemove}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer',
        dragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/3'
      )}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className={cn(
        'flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200',
        dragging ? 'gradient-primary scale-110' : 'bg-secondary'
      )}>
        <Upload className={cn('h-6 w-6 transition-colors', dragging ? 'text-white' : 'text-muted-foreground')} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {dragging ? 'Drop your file here' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Accepts {accept.join(', ').toUpperCase()} · Max {maxSizeMB}MB
        </p>
      </div>
      <input ref={inputRef} type="file" accept={acceptedTypes} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}
