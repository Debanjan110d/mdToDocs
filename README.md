# mdToDocs — Minimal Markdown to PDF & DOCX Converter

<div align="center">
  <img src="public/logo.svg" alt="mdToDocs Logo" width="80" height="80" />
  <p><strong>A fast, distraction-free utility to convert Markdown into beautifully formatted PDF and DOCX documents directly in your browser.</strong></p>
  <p>100% Client-Side • Zero Data Storage • Selectable Vector PDF • Native Word OOXML</p>
</div>

---

## Features

### 1. Dual Input Methods
- **File Upload & Drag-and-Drop:** Drop any `.md`, `.markdown`, or `.txt` file into the upload zone or browse from your device. Read directly using the native browser File API.
- **Direct Markdown Editor:** Type or paste Markdown directly. Features a formatting toolbar (Headings, Bold, Italic, Strikethrough, Lists, Tables, Quotes, Code blocks, Links) and keyboard shortcuts (such as tab indentation).

### 2. Live Document Preview
- Styled in an A4 document sheet layout.
- Full **GitHub Flavored Markdown (GFM)** support:
  - Headings (H1–H6) with hierarchical typography.
  - Bold, italic, strikethrough, and inline code.
  - Monospaced code blocks with syntax highlighting (`rehype-highlight`).
  - Native tables with alternating rows and headers.
  - Ordered, unordered, and nested lists.
  - Task lists with checkboxes (`[x]` and `[ ]`).
  - Blockquotes with accent styling.
  - Links, images, and escaped Markdown characters.
  - Strict client-side sanitization to prevent XSS.

### 3. High-Quality Document Export
- **PDF Export (A4 Vector Document):**
  - Uses an isolated browser-based print pipeline with `@page { size: A4 portrait; margin: 20mm 18mm; }`.
  - 100% **selectable text**, crisp vector fonts, and clickable hyperlinks (no blurry canvas screenshots).
  - Page-break management: avoids breaking tables and code blocks awkwardly across pages; avoids orphan headings (`break-after: avoid`).
- **DOCX Export (Microsoft Word OOXML):**
  - Generates genuine Microsoft Word `.docx` documents using the `docx` library.
  - Maps Markdown headings to Word heading styles (Heading 1 to Heading 6).
  - Preserves bold, italic, strikethrough, and inline code.
  - Converts Markdown tables into native Word tables with header styling and cell padding.
  - Preserves bullet lists, numbered lists, and task checkboxes.
  - Preserves blockquotes with indentation and accent borders.
  - Fully compatible with Microsoft Word, LibreOffice, and Google Docs.

### 4. Privacy & Performance
- **100% Client-Side:** All Markdown parsing, syntax highlighting, PDF layout, and DOCX generation happen strictly in the browser.
- **Zero Network Tracking:** No backend, no accounts, no database, no telemetry. Your documents never leave your machine.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + Custom Print Stylesheet
- **Markdown Parser & Preview:** `react-markdown`, `remark-gfm`, `rehype-highlight`
- **DOCX Engine:** `docx`, `unified`, `remark-parse`
- **Icons:** `lucide-react`

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Debanjan110d/mdToDocs.git
cd mdToDocs

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
# Typecheck and build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment to Vercel

The repository includes a ready-to-use `vercel.json` configuration for single-page app deployment.

### Option 1: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Deploy via Vercel Dashboard
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Framework Preset: **Vite**.
5. Click **Deploy**.

---

## License

MIT License. Open source and free to use.
