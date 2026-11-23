export interface SampleDocument {
  id: string;
  name: string;
  filename: string;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'feature-showcase',
    name: 'Feature Showcase',
    filename: 'Markdown_Feature_Showcase.md',
    content: `# Markdown to PDF & Word Showcase

Welcome to **mdToDocs**, a lightweight utility designed to convert Markdown into high-quality **PDF** and **Microsoft Word (DOCX)** documents.

---

## 1. Typography & Inline Styles

This paragraph showcases text formatting:
- **Bold text** for strong emphasis.
- *Italic text* for subtle emphasis.
- ***Bold and italic combined***.
- ~~Strikethrough~~ for deprecated or outdated items.
- \`inline_code()\` with monospaced font styling.
- [External Hyperlink to GitHub](https://github.com) with standard link styling.

> "Simplicity is prerequisite for reliability."
> — *Edsger W. Dijkstra*

---

## 2. Lists & Task Checklists

### Unordered & Nested Lists
* High-level architectural overview
  * Core rendering engine
    * CommonMark compliant
    * GitHub Flavored Markdown (GFM)
  * Export subsystem
    * Native Vector PDF Pipeline
    * Native Microsoft Word Document Builder
* Local browser client-side execution
* No backend server dependency

### Ordered Steps
1. Upload or paste your Markdown content.
2. Review the live side-by-side preview.
3. Choose your desired target format (**PDF** or **DOCX**).
4. Download the generated document instantly.

### Task List
- [x] Implement browser-based File API upload
- [x] GitHub Flavored Markdown preview
- [x] Microsoft Word (DOCX) native table mapping
- [x] Vector PDF A4 pagination with orphan prevention
- [ ] Schedule team retrospective

---

## 3. Data Tables

Below is a structured table showing document export capabilities:

| Format | Output Type | Page Breaks | Selectable Text | Office Compatible |
| :--- | :--- | :---: | :---: | :---: |
| **PDF** | Vector Document | Automatic | Yes (100%) | Adobe / Chrome / Apple |
| **DOCX** | Native OOXML | Automatic | Yes (100%) | Word & LibreOffice |
| **HTML** | Web Document | N/A | Yes (100%) | Modern Web Browsers |

---

## 4. Source Code Blocks

Here is a sample TypeScript implementation showing clean asynchronous conversion:

\`\`\`typescript
interface ExportOptions {
  format: 'pdf' | 'docx';
  documentTitle: string;
  pageSize?: 'A4' | 'Letter';
}

export async function exportDocument(
  markdown: string, 
  options: ExportOptions
): Promise<void> {
  console.log(\`Generating \${options.format.toUpperCase()} for "\${options.documentTitle}"...\`);
  
  if (options.format === 'docx') {
    const docxBlob = await generateDocxFromMarkdown(markdown, options.documentTitle);
    triggerDownload(docxBlob, \`\${options.documentTitle}.docx\`);
  } else {
    await triggerPrintPdf(markdown, options.documentTitle);
  }
}
\`\`\`

---

## 5. Notes & Boundary Cases

Here is a blockquote demonstrating nested content:

> **Important Note:**
> All processing happens 100% locally on your machine. Your private documents are never sent over the network or stored on any remote cloud server.

Document generated securely with **mdToDocs**.
`
  },
  {
    id: 'project-spec',
    name: 'Project Spec',
    filename: 'Project_Specification.md',
    content: `# System Architecture Specification

**Project:** Cloud Gateway Microservice  
**Author:** Engineering Architecture Team  
**Status:** Approved  
**Version:** 2.4.0  

---

## Executive Summary

The Cloud Gateway service acts as the central ingress controller for all incoming REST and gRPC traffic. It handles authentication, dynamic rate limiting, request validation, and telemetry forwarding.

### Key Objectives
1. **Low Latency:** P99 overhead must not exceed 2.5 milliseconds.
2. **High Availability:** 99.99% uptime target across multi-region deployments.
3. **Zero Data Leakage:** Fully compliant with security audit standards.

---

## Component Topology

| Component | Responsibility | Failure Domain |
| :--- | :--- | :--- |
| **Ingress Router** | TLS termination & HTTP/2 routing | Edge Node |
| **Auth Sidecar** | JWT token validation & claims extraction | Pod Local |
| **Rate Limiter** | Redis-backed token bucket algorithm | Cluster Local |
| **Metrics Collector** | OpenTelemetry scrape endpoint | Node Local |

---

## Implementation Sample

\`\`\`go
package main

import (
    "context"
    "net/http"
    "time"
)

func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 1*time.Second)
    defer cancel()
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"status":"healthy","uptime_seconds":86400}\`))
}
\`\`\`
`
  }
];
