import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileCode, X, RefreshCw, Sparkles } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../lib/sampleMarkdown';

interface FileDropZoneProps {
  currentFilename?: string;
  fileSizeBytes?: number;
  onFileLoaded: (content: string, filename: string, sizeBytes: number) => void;
  onClearFile: () => void;
  onLoadSample: (sampleId: string) => void;
  hasContent: boolean;
}

export const FileDropZone = ({
  currentFilename,
  fileSizeBytes,
  onFileLoaded,
  onClearFile,
  onLoadSample,
  hasContent,
}: FileDropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    // Validate file type
    const validExtensions = ['.md', '.markdown', '.txt'];
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt && !file.type.includes('markdown') && !file.type.includes('text')) {
      alert('Please upload a valid Markdown file (.md, .markdown, or .txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content || '', file.name, file.size);
    };
    reader.onerror = () => {
      alert('Failed to read the selected file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      // Reset input value so re-selecting the same file triggers change
      e.target.value = '';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // If a file is uploaded, show the active file banner
  if (currentFilename) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {currentFilename}
            </p>
            {fileSizeBytes !== undefined && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatFileSize(fileSizeBytes)} • Loaded in browser
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".md,.markdown,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Replace current file"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replace</span>
          </button>
          <button
            onClick={onClearFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Clear file"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    );
  }

  // Otherwise show the drag & drop area
  return (
    <div className="flex flex-col gap-2.5">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-xl px-6 py-5 text-center transition-all duration-150 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
            : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".md,.markdown,.txt"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              <span className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2">Click to upload</span> or drag and drop Markdown file
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Supports .md, .markdown, and .txt documents (processed locally in browser)
            </p>
          </div>
        </div>
      </div>

      {/* Quick Sample Selector */}
      {!hasContent && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Or load a sample:
          </span>
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={(e) => {
                e.stopPropagation();
                onLoadSample(sample.id);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {sample.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
