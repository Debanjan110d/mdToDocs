import { FileText, FileDown, Loader2 } from 'lucide-react';
import type { ExportFormat } from '../types';

interface ExportControlsProps {
  format: ExportFormat;
  onFormatChange: (f: ExportFormat) => void;
  documentTitle: string;
  onTitleChange: (title: string) => void;
  onExport: () => void;
  isExporting: boolean;
  disabled: boolean;
}

export const ExportControls = ({
  format,
  onFormatChange,
  documentTitle,
  onTitleChange,
  onExport,
  isExporting,
  disabled,
}: ExportControlsProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm transition-colors">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Format Selection Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
            Target Format:
          </span>

          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
            {/* PDF Option */}
            <button
              type="button"
              onClick={() => onFormatChange('pdf')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                format === 'pdf'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF Document</span>
              {format === 'pdf' && <span className="text-[10px] bg-rose-600 px-1.5 py-0.2 rounded">A4</span>}
            </button>

            {/* DOCX Option */}
            <button
              type="button"
              onClick={() => onFormatChange('docx')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                format === 'docx'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Word (.docx)</span>
              {format === 'docx' && <span className="text-[10px] bg-blue-700 px-1.5 py-0.2 rounded">OOXML</span>}
            </button>
          </div>
        </div>

        {/* Center / Right: Title Input & Primary Export Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:max-w-lg lg:justify-end">
          <div className="relative flex-1">
            <label htmlFor="doc-filename" className="sr-only">
              Document Title
            </label>
            <input
              id="doc-filename"
              type="text"
              value={documentTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Document filename..."
              className="w-full px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 select-none pointer-events-none">
              .{format}
            </span>
          </div>

          <button
            type="button"
            onClick={onExport}
            disabled={disabled || isExporting}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              disabled || isExporting
                ? 'opacity-50 cursor-not-allowed bg-slate-300 dark:bg-slate-800 text-slate-500'
                : format === 'pdf'
                ? 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-2 focus:ring-rose-500/40 active:scale-[0.98]'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500/40 active:scale-[0.98]'
            }`}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Export {format === 'pdf' ? 'PDF' : 'Word'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtext description */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>
          {format === 'pdf'
            ? 'Generates standard A4 print-optimized vector PDF with selectable text, page breaks, and heading preservation.'
            : 'Generates native Microsoft Word (.docx) document with formatted headings, tables, bullet lists, and code blocks.'}
        </p>
        <span className="font-mono text-[11px] hidden sm:inline text-slate-400">
          Client-Side • 100% Private
        </span>
      </div>
    </div>
  );
};
