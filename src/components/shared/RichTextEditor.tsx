import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo2, Redo2, RemoveFormatting, ImagePlus, Palette, Highlighter,
  Type, Eye, Pencil, GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  minHeight?: string;
}

const COLORS = [
  '#000000', '#374151', '#dc2626', '#ea580c', '#ca8a04',
  '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#64748b',
];

const HIGHLIGHTS = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#fecdd3', '#fed7aa',
];

export function RichTextEditor({ content, onChange, placeholder, className, editable = true, minHeight = '200px' }: RichTextEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onImageSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [editor]);

  if (!editor) return null;

  const ToolBtn = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title?: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-150',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-border mx-0.5" />;

  return (
    <div className={cn(
      'rounded-xl overflow-hidden bg-card border border-border shadow-sm',
      className
    )}>
      {/* Toolbar — Unlayer-inspired */}
      {editable && !previewMode && (
        <div className="bg-muted/50 border-b border-border">
          {/* Main toolbar row */}
          <div className="flex flex-wrap items-center gap-0.5 px-3 py-2">
            {/* Text formatting group */}
            <div className="flex items-center gap-0.5 bg-background rounded-lg px-1 py-0.5 border border-border/50">
              <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                <Bold className="h-3.5 w-3.5" />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                <Italic className="h-3.5 w-3.5" />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                <UnderlineIcon className="h-3.5 w-3.5" />
              </ToolBtn>
            </div>

            <Divider />

            {/* Headings group */}
            <div className="flex items-center gap-0.5 bg-background rounded-lg px-1 py-0.5 border border-border/50">
              <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
                <span className="text-xs font-black">H1</span>
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
                <span className="text-xs font-bold">H2</span>
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
                <span className="text-[11px] font-semibold">H3</span>
              </ToolBtn>
            </div>

            <Divider />

            {/* Color & highlight group */}
            <div className="flex items-center gap-0.5 bg-background rounded-lg px-1 py-0.5 border border-border/50">
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all" title="Text color">
                    <Palette className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Text Color</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => editor.chain().focus().setColor(color).run()}
                        className="h-7 w-7 rounded-lg border border-border hover:scale-110 hover:shadow-md transition-all"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all" title="Highlight">
                    <Highlighter className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Highlight</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {HIGHLIGHTS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                        className="h-7 w-7 rounded-lg border border-border hover:scale-110 hover:shadow-md transition-all"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Divider />

            {/* Lists group */}
            <div className="flex items-center gap-0.5 bg-background rounded-lg px-1 py-0.5 border border-border/50">
              <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
                <List className="h-3.5 w-3.5" />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
                <ListOrdered className="h-3.5 w-3.5" />
              </ToolBtn>
            </div>

            <Divider />

            {/* Alignment group */}
            <div className="flex items-center gap-0.5 bg-background rounded-lg px-1 py-0.5 border border-border/50">
              <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
                <AlignLeft className="h-3.5 w-3.5" />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
                <AlignCenter className="h-3.5 w-3.5" />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
                <AlignRight className="h-3.5 w-3.5" />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
                <AlignJustify className="h-3.5 w-3.5" />
              </ToolBtn>
            </div>

            <Divider />

            {/* Media & actions */}
            <div className="flex items-center gap-0.5 bg-background rounded-lg px-1 py-0.5 border border-border/50">
              <ToolBtn onClick={handleImageUpload} title="Insert image">
                <ImagePlus className="h-3.5 w-3.5" />
              </ToolBtn>
            </div>

            <Divider />

            {/* Undo/redo/clear */}
            <div className="flex items-center gap-0.5 bg-background rounded-lg px-1 py-0.5 border border-border/50">
              <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
                <Undo2 className="h-3.5 w-3.5" />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
                <Redo2 className="h-3.5 w-3.5" />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting">
                <RemoveFormatting className="h-3.5 w-3.5" />
              </ToolBtn>
            </div>

            <div className="flex-1" />

            {/* Preview toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 rounded-lg border-border"
              onClick={() => setPreviewMode(true)}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
          </div>
        </div>
      )}

      {/* Preview toggle bar */}
      {previewMode && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary">Preview Mode</span>
          </div>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1.5 rounded-lg" onClick={() => setPreviewMode(false)}>
            <Pencil className="h-3 w-3" /> Edit
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={onImageSelected} />
      <div
        className={cn(
          'prose prose-sm max-w-none px-5 py-4',
          previewMode && 'pointer-events-none bg-muted/20'
        )}
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .ProseMirror { outline: none; min-height: ${minHeight}; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          height: 0;
          font-style: italic;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 8px 0;
        }
        .ProseMirror h1 { font-size: 1.5em; font-weight: 800; margin: 0.5em 0; }
        .ProseMirror h2 { font-size: 1.25em; font-weight: 700; margin: 0.5em 0; }
        .ProseMirror h3 { font-size: 1.1em; font-weight: 600; margin: 0.5em 0; }
        .ProseMirror ul { padding-left: 1.5em; list-style-type: disc; }
        .ProseMirror ol { padding-left: 1.5em; list-style-type: decimal; }
        .ProseMirror li { margin: 0.5em 0; }
        .ProseMirror ul ul { list-style-type: circle; }
        .ProseMirror ul ul ul { list-style-type: square; }
      `}</style>
    </div>
  );
}
