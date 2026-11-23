import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table as TableIcon,
  Link as LinkIcon,
  Copy,
  Trash2,
} from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  onCopy: () => void;
  onClear: () => void;
}

export const Editor = ({
  value,
  onChange,
  onCopy,
  onClear,
}: EditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert markdown syntax at cursor position
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const newText =
      value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newText = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newText);

      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
      {/* Editor Header / Formatting Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-3 py-2 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1.5 select-none hidden sm:inline">
            Editor
          </span>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Quick Formatting Buttons */}
          <button
            onClick={() => insertFormatting('# ', '', 'Heading 1')}
            title="Heading 1"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('## ', '', 'Heading 2')}
            title="Heading 2"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />
          <button
            onClick={() => insertFormatting('**', '**', 'bold text')}
            title="Bold"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('*', '*', 'italic text')}
            title="Italic"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('~~', '~~', 'strikethrough')}
            title="Strikethrough"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />
          <button
            onClick={() => insertFormatting('\n- ', '', 'List item')}
            title="Bullet List"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n1. ', '', 'Numbered item')}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('\n- [ ] ', '', 'Task item')}
            title="Task Checkbox"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />
          <button
            onClick={() => insertFormatting('\n> ', '', 'Blockquote text')}
            title="Blockquote"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('`', '`', 'code')}
            title="Inline Code"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() =>
              insertFormatting(
                '\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Item 1 | Item 2 |\n'
              )
            }
            title="Table Template"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting('[', '](https://example.com)', 'Link Title')}
            title="Insert Link"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {value && (
            <>
              <button
                onClick={onCopy}
                title="Copy Markdown"
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span className="hidden sm:inline">Copy</span>
              </button>
              <button
                onClick={onClear}
                title="Clear Markdown"
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 min-h-[380px] lg:min-h-[500px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="# Type or paste Markdown here...&#10;&#10;Supports headings, tables, code blocks, task lists, and formatting. You can also drag and drop a .md file directly above."
          spellCheck={false}
          className="w-full h-full p-4 font-mono text-sm leading-relaxed bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none outline-none focus:ring-0 selection:bg-blue-500/20"
        />
      </div>
    </div>
  );
};
