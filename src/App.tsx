import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { FileDropZone } from './components/FileDropZone';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ExportControls } from './components/ExportControls';
import { Toast } from './components/Toast';
import { SAMPLE_DOCUMENTS } from './lib/sampleMarkdown';
import { generateDocxBlob } from './lib/docxExporter';
import { triggerPrintPdf } from './lib/pdfExporter';
import { triggerDownload, getMarkdownStats, getSuggestedTitle } from './lib/fileUtils';
import type { ExportFormat, ToastMessage, ViewMode } from './types';
import { Columns, Eye, Edit3 } from 'lucide-react';

export function App() {
  // Theme state - defaults to dark mode as required
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mdtodocs_theme');
    if (saved) return saved === 'dark';
    return true; // Default to dark mode
  });

  // Markdown content state - initialize with the showcase document so users see immediate value
  const [markdown, setMarkdown] = useState<string>(() => {
    return SAMPLE_DOCUMENTS[0].content;
  });

  const [currentFilename, setCurrentFilename] = useState<string | undefined>(
    SAMPLE_DOCUMENTS[0].filename
  );
  const [fileSizeBytes, setFileSizeBytes] = useState<number | undefined>(
    SAMPLE_DOCUMENTS[0].content.length
  );

  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [documentTitle, setDocumentTitle] = useState<string>(() => {
    return getSuggestedTitle(SAMPLE_DOCUMENTS[0].content, SAMPLE_DOCUMENTS[0].filename);
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Sync dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mdtodocs_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mdtodocs_theme', 'light');
    }
  }, [darkMode]);

  // Compute stats
  const stats = getMarkdownStats(markdown);

  // Add toast helper
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // File loading
  const handleFileLoaded = (content: string, filename: string, sizeBytes: number) => {
    setMarkdown(content);
    setCurrentFilename(filename);
    setFileSizeBytes(sizeBytes);
    setDocumentTitle(getSuggestedTitle(content, filename));
    addToast('success', `Loaded "${filename}" successfully.`);
  };

  const handleClearFile = () => {
    setMarkdown('');
    setCurrentFilename(undefined);
    setFileSizeBytes(undefined);
    setDocumentTitle('Document');
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId) || SAMPLE_DOCUMENTS[0];
    setMarkdown(sample.content);
    setCurrentFilename(sample.filename);
    setFileSizeBytes(sample.content.length);
    setDocumentTitle(getSuggestedTitle(sample.content, sample.filename));
    addToast('info', `Loaded sample: "${sample.name}".`);
  };

  const handleCopyMarkdown = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      addToast('success', 'Markdown copied to clipboard!');
    } catch {
      addToast('error', 'Failed to copy to clipboard.');
    }
  };

  // Export handlers
  const handleExport = async () => {
    if (!markdown.trim()) {
      addToast('error', 'Cannot export empty document.');
      return;
    }

    const filenameBase = (documentTitle.trim() || 'Document').replace(/[\\/:*?"<>|]/g, '_');
    setIsExporting(true);

    try {
      if (exportFormat === 'pdf') {
        const previewElement = previewContainerRef.current;
        const htmlToPrint = previewElement ? previewElement.innerHTML : markdown;

        await triggerPrintPdf(htmlToPrint, {
          title: filenameBase,
        });

        addToast(
          'success',
          'PDF print dialog opened! Choose "Save as PDF" to save your A4 document.'
        );
      } else {
        // DOCX Export
        const docxBlob = await generateDocxBlob(markdown, {
          title: filenameBase,
          author: 'mdToDocs User',
        });

        triggerDownload(docxBlob, `${filenameBase}.docx`);
        addToast('success', `Saved "${filenameBase}.docx" successfully!`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      addToast('error', 'Export failed. Please review your content and try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        stats={stats}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">
        {/* Method A: File Upload / Drop zone */}
        <FileDropZone
          currentFilename={currentFilename}
          fileSizeBytes={fileSizeBytes}
          onFileLoaded={handleFileLoaded}
          onClearFile={handleClearFile}
          onLoadSample={handleLoadSample}
          hasContent={Boolean(markdown.trim())}
        />

        {/* View Mode Switcher (Visible on small screens or for maximizing work area) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-200/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'editor'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor Only</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Only</span>
            </button>
          </div>

          {/* Quick word count on mobile */}
          <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden">
            {stats.words.toLocaleString()} words
          </div>
        </div>

        {/* Workspace: Split or Tabbed Editor & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 items-stretch">
          {/* Editor Column */}
          <div
            className={`${
              viewMode === 'preview' ? 'hidden' : viewMode === 'editor' ? 'col-span-full' : 'flex'
            } flex-col`}
          >
            <Editor
              value={markdown}
              onChange={(val) => {
                setMarkdown(val);
                if (!currentFilename) {
                  setDocumentTitle(getSuggestedTitle(val));
                }
              }}
              onCopy={handleCopyMarkdown}
              onClear={handleClearFile}
            />
          </div>

          {/* Preview Column */}
          <div
            className={`${
              viewMode === 'editor' ? 'hidden' : viewMode === 'preview' ? 'col-span-full' : 'flex'
            } flex-col`}
          >
            <Preview ref={previewContainerRef} content={markdown} />
          </div>
        </div>

        {/* Export Controls Bar */}
        <ExportControls
          format={exportFormat}
          onFormatChange={setExportFormat}
          documentTitle={documentTitle}
          onTitleChange={setDocumentTitle}
          onExport={handleExport}
          isExporting={isExporting}
          disabled={!markdown.trim()}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-6 bg-white/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="mdToDocs Logo" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">mdToDocs</span>
            <span>—</span>
            <span>Client-side Markdown to PDF & DOCX converter. 100% private.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span>
              Crafted by{' '}
              <a
                href="https://github.com/Debanjan110d"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                @Debanjan110d
              </a>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href="https://github.com/Debanjan110d/mdToDocs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-slate-200 hover:underline"
            >
              GitHub Repository
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href="https://buymeachai.in/debanjan110d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>☕ Buy me a Chai</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
export default App;
