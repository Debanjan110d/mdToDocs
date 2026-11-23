import type { DocumentStats } from '../types';

/**
 * Triggers a native browser file download from a Blob
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Revoke object URL after brief delay to prevent memory leak
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Computes word, char, line, and reading time stats
 */
export function getMarkdownStats(markdown: string): DocumentStats {
  const trimmed = markdown.trim();
  if (!trimmed) {
    return { words: 0, characters: 0, lines: 0, readingTimeMinutes: 0 };
  }

  const lines = markdown.split(/\r\n|\r|\n/).length;
  const characters = markdown.length;

  // Simple clean regex for words
  const words = trimmed
    .replace(/[#*`~_>[\]()\-+|]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    lines,
    readingTimeMinutes,
  };
}

/**
 * Extracts a suggested document title from markdown or filename
 */
export function getSuggestedTitle(markdown: string, fallbackFilename?: string): string {
  if (fallbackFilename) {
    const base = fallbackFilename.replace(/\.(md|markdown|txt)$/i, '').trim();
    if (base) return base;
  }

  // Look for first H1 `# Heading`
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match && h1Match[1]) {
    const sanitized = h1Match[1].replace(/[*_`~[\]]/g, '').trim();
    if (sanitized) return sanitized;
  }

  // Look for first non-empty line
  const firstLine = markdown.split('\n').find((l) => l.trim().length > 0);
  if (firstLine) {
    const sanitized = firstLine.replace(/^[#*\->\s]+/, '').replace(/[*_`~[\]]/g, '').trim();
    if (sanitized && sanitized.length <= 40) return sanitized;
  }

  return 'Document';
}
