import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Eye } from 'lucide-react';

interface PreviewProps {
  content: string;
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ content }, ref) => {
  const hasContent = Boolean(content.trim());

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
      {/* Preview Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-3 py-2 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
            Document Live Preview
          </span>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          A4 Standard Layout
        </span>
      </div>

      {/* Preview Sheet Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/70 dark:bg-slate-950/40">
        {hasContent ? (
          <div
            ref={ref}
            className="printable-document markdown-body max-w-3xl mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 sm:p-10 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 min-h-[500px]"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                a: ({ ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  />
                ),
                table: ({ ...props }) => (
                  <div className="overflow-x-auto my-3">
                    <table {...props} />
                  </div>
                ),
                input: ({ ...props }) => {
                  if (props.type === 'checkbox') {
                    return (
                      <input
                        {...props}
                        disabled
                        className="rounded border-slate-300 text-emerald-600 focus:ring-0 mr-1.5 cursor-default"
                      />
                    );
                  }
                  return <input {...props} />;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center p-6 text-slate-400 dark:text-slate-500">
            <div className="w-14 h-14 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 flex items-center justify-center mb-3">
              <img src="/logo.svg" alt="mdToDocs Logo" className="w-9 h-9 object-contain opacity-75" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Preview will appear here
            </h3>
            <p className="text-xs max-w-xs text-slate-500 dark:text-slate-400">
              Type or paste Markdown into the editor, or upload a .md file to see the formatted document.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
