/**
 * High-Fidelity Browser-Based Print Pipeline for Selectable-Text A4 PDF Generation
 */

export interface PdfExportOptions {
  title?: string;
  author?: string;
}

export function triggerPrintPdf(htmlContent: string, options: PdfExportOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const docTitle = options.title || 'Document';

      // Create an invisible iframe for isolated printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      iframe.setAttribute('aria-hidden', 'true');

      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        document.body.removeChild(iframe);
        throw new Error('Failed to access print frame document.');
      }

      // Build complete self-contained printable HTML document
      const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(docTitle)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm 18mm 20mm 18mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Prevent headings from being orphaned at the bottom of pages */
    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      break-after: avoid;
      page-break-after: avoid;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    h1 {
      font-size: 24pt;
      margin-top: 0;
      margin-bottom: 0.5em;
      border-bottom: 1.5pt solid #cbd5e1;
      padding-bottom: 0.25em;
    }

    h2 {
      font-size: 17pt;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
      border-bottom: 1pt solid #e2e8f0;
      padding-bottom: 0.2em;
    }

    h3 {
      font-size: 13pt;
      margin-top: 1em;
      margin-bottom: 0.3em;
    }

    h4 {
      font-size: 11.5pt;
      margin-top: 0.8em;
      margin-bottom: 0.2em;
    }

    p {
      margin-top: 0;
      margin-bottom: 0.85em;
    }

    /* Prevent tables and rows from splitting awkwardly across pages */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.2em 0;
      font-size: 9.5pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    th, td {
      border: 1pt solid #cbd5e1;
      padding: 7pt 10pt;
      text-align: left;
    }

    th {
      background-color: #f1f5f9 !important;
      font-weight: 600;
      color: #0f172a;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc !important;
    }

    /* Monospaced code blocks */
    pre {
      background-color: #f8fafc !important;
      color: #0f172a !important;
      border: 1pt solid #e2e8f0;
      border-radius: 4pt;
      padding: 10pt 12pt;
      margin: 1em 0;
      font-family: 'JetBrains Mono', Consolas, Monaco, 'Courier New', monospace;
      font-size: 9pt;
      line-height: 1.45;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    code {
      font-family: 'JetBrains Mono', Consolas, Monaco, 'Courier New', monospace;
      font-size: 0.9em;
      background-color: #f1f5f9 !important;
      padding: 2pt 4pt;
      border-radius: 3pt;
      border: 0.5pt solid #e2e8f0;
      color: #b91c1c;
    }

    pre code {
      background: transparent !important;
      padding: 0;
      border: none;
      color: inherit;
    }

    blockquote {
      margin: 1em 0;
      padding: 6pt 14pt;
      border-left: 3.5pt solid #3b82f6 !important;
      background-color: #f8fafc !important;
      color: #334155;
      font-style: italic;
      border-radius: 0 4pt 4pt 0;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 0.85em;
      padding-left: 20pt;
    }

    li {
      margin-bottom: 0.3em;
    }

    hr {
      border: 0;
      height: 1pt;
      background: #cbd5e1;
      margin: 1.5em 0;
    }

    a {
      color: #1d4ed8;
      text-decoration: underline;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 4pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    /* Syntax Highlighting for code */
    .hljs-comment, .hljs-quote { color: #64748b; font-style: italic; }
    .hljs-keyword, .hljs-selector-tag { color: #e11d48; font-weight: 600; }
    .hljs-string, .hljs-title, .hljs-section, .hljs-attribute, .hljs-literal { color: #059669; }
    .hljs-variable, .hljs-template-variable { color: #0284c7; }
    .hljs-number { color: #ea580c; }
    .hljs-function { color: #7c3aed; }
  </style>
</head>
<body>
  <div class="markdown-body">
    ${htmlContent}
  </div>
</body>
</html>`;

      iframeDoc.open();
      iframeDoc.write(printHtml);
      iframeDoc.close();

      // Ensure images and fonts load before triggering print
      const checkReadyAndPrint = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            resolve();
          } catch (err) {
            reject(err);
          } finally {
            // Clean up iframe after printing dialog closes
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            }, 3000);
          }
        }, 350);
      };

      if (iframeDoc.readyState === 'complete') {
        checkReadyAndPrint();
      } else {
        iframe.onload = checkReadyAndPrint;
      }
    } catch (error) {
      reject(error);
    }
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
