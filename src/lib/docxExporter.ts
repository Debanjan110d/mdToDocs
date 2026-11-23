import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ExternalHyperlink,
  LevelFormat,
  ShadingType,
  UnderlineType,
  PageNumber,
  Footer,
  Header,
} from 'docx';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, RootContent, PhrasingContent, TableCell as MdastTableCell } from 'mdast';

export interface DocxExportOptions {
  title?: string;
  author?: string;
  subject?: string;
}

interface FormatContext {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  code?: boolean;
}

export async function generateDocxBlob(
  markdownText: string,
  options: DocxExportOptions = {}
): Promise<Blob> {
  const docTitle = options.title || 'Exported Document';

  // Parse markdown into AST
  const processor = unified().use(remarkParse).use(remarkGfm);
  const ast = processor.parse(markdownText) as Root;

  const docChildren: (Paragraph | Table)[] = [];

  // Helper to extract phrasing children into TextRun or ExternalHyperlink
  function parsePhrasing(
    nodes: PhrasingContent[] | undefined,
    ctx: FormatContext = {}
  ): (TextRun | ExternalHyperlink)[] {
    if (!nodes || nodes.length === 0) return [];
    const runs: (TextRun | ExternalHyperlink)[] = [];

    for (const node of nodes) {
      if (node.type === 'text') {
        runs.push(
          new TextRun({
            text: node.value,
            bold: ctx.bold,
            italics: ctx.italic,
            strike: ctx.strike,
            font: ctx.code ? 'Consolas' : 'Segoe UI',
            size: ctx.code ? 20 : 22, // 10pt or 11pt
            color: ctx.code ? 'B91C1C' : undefined,
          })
        );
      } else if (node.type === 'strong') {
        runs.push(...parsePhrasing(node.children, { ...ctx, bold: true }));
      } else if (node.type === 'emphasis') {
        runs.push(...parsePhrasing(node.children, { ...ctx, italic: true }));
      } else if (node.type === 'delete') {
        runs.push(...parsePhrasing(node.children, { ...ctx, strike: true }));
      } else if (node.type === 'inlineCode') {
        runs.push(
          new TextRun({
            text: ` ${node.value} `,
            font: 'Consolas',
            size: 20,
            shading: {
              fill: 'F1F5F9',
              type: ShadingType.CLEAR,
            },
            color: '0F172A',
          })
        );
      } else if (node.type === 'link') {
        const linkRuns = parsePhrasing(node.children, ctx);
        const textRunsOnly = linkRuns.filter((r): r is TextRun => r instanceof TextRun);
        runs.push(
          new ExternalHyperlink({
            children: textRunsOnly.length > 0
              ? textRunsOnly.map(
                  (r) =>
                    new TextRun({
                      text: (r as unknown as { text?: string }).text || node.url,
                      style: 'Hyperlink',
                      color: '2563EB',
                      underline: { type: UnderlineType.SINGLE },
                      bold: ctx.bold,
                      italics: ctx.italic,
                    })
                )
              : [
                  new TextRun({
                    text: node.url,
                    style: 'Hyperlink',
                    color: '2563EB',
                    underline: { type: UnderlineType.SINGLE },
                  }),
                ],
            link: node.url,
          })
        );
      } else if (node.type === 'break') {
        runs.push(new TextRun({ break: 1 }));
      }
    }

    return runs;
  }

  // Recursive parser for block items
  function processNodes(nodes: RootContent[], listContext?: { ordered: boolean; level: number }): void {
    for (const node of nodes) {
      if (node.type === 'heading') {
        const headingLevels = [
          HeadingLevel.HEADING_1,
          HeadingLevel.HEADING_2,
          HeadingLevel.HEADING_3,
          HeadingLevel.HEADING_4,
          HeadingLevel.HEADING_5,
          HeadingLevel.HEADING_6,
        ];
        const headingLvl = headingLevels[Math.min(node.depth - 1, 5)];
        const runs = parsePhrasing(node.children);

        docChildren.push(
          new Paragraph({
            heading: headingLvl,
            spacing: {
              before: node.depth === 1 ? 400 : 280,
              after: 140,
            },
            children: runs,
          })
        );
      } else if (node.type === 'paragraph') {
        const runs = parsePhrasing(node.children);
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 140, line: 276 }, // 1.15 line spacing
            children: runs,
          })
        );
      } else if (node.type === 'blockquote') {
        for (const child of node.children) {
          if (child.type === 'paragraph') {
            const runs = parsePhrasing(child.children, { italic: true });
            docChildren.push(
              new Paragraph({
                indent: { left: 720 }, // 0.5 inch
                border: {
                  left: {
                    color: '3B82F6',
                    size: 24,
                    style: BorderStyle.SINGLE,
                    space: 12,
                  },
                },
                shading: {
                  fill: 'F8FAFC',
                  type: ShadingType.CLEAR,
                },
                spacing: { before: 100, after: 100 },
                children: runs,
              })
            );
          }
        }
      } else if (node.type === 'code') {
        const lines = node.value.split('\n');
        for (let i = 0; i < lines.length; i++) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: lines[i] || ' ',
                  font: 'Consolas',
                  size: 19, // 9.5pt
                  color: '0F172A',
                }),
              ],
              shading: {
                fill: 'F1F5F9',
                type: ShadingType.CLEAR,
              },
              spacing: { before: i === 0 ? 120 : 0, after: i === lines.length - 1 ? 120 : 0 },
              indent: { left: 360, right: 360 },
            })
          );
        }
      } else if (node.type === 'thematicBreak') {
        docChildren.push(
          new Paragraph({
            border: {
              bottom: {
                color: 'CBD5E1',
                size: 6,
                style: BorderStyle.SINGLE,
                space: 1,
              },
            },
            spacing: { before: 240, after: 240 },
          })
        );
      } else if (node.type === 'list') {
        const isOrdered = Boolean(node.ordered);
        const currentLevel = listContext ? listContext.level + 1 : 0;

        for (let i = 0; i < node.children.length; i++) {
          const listItem = node.children[i];
          const prefixRuns: TextRun[] = [];

          if (listItem.checked !== null && listItem.checked !== undefined) {
            prefixRuns.push(
              new TextRun({
                text: listItem.checked ? '☒ ' : '☐ ',
                font: 'Segoe UI Symbol',
                size: 22,
                bold: true,
                color: listItem.checked ? '059669' : '64748B',
              })
            );
          }

          for (const itemChild of listItem.children) {
            if (itemChild.type === 'paragraph') {
              const runs = parsePhrasing(itemChild.children);
              docChildren.push(
                new Paragraph({
                  ...(isOrdered
                    ? {
                        numbering: {
                          reference: 'default-numbering',
                          level: Math.min(currentLevel, 5),
                        },
                      }
                    : {
                        bullet: {
                          level: Math.min(currentLevel, 5),
                        },
                      }),
                  spacing: { before: 40, after: 60 },
                  children: [...prefixRuns, ...runs],
                })
              );
            } else if (itemChild.type === 'list') {
              processNodes([itemChild], { ordered: Boolean(itemChild.ordered), level: currentLevel });
            }
          }
        }
      } else if (node.type === 'table') {
        const rows: TableRow[] = [];

        for (let rIdx = 0; rIdx < node.children.length; rIdx++) {
          const rowNode = node.children[rIdx];
          const isHeader = rIdx === 0;
          const cells: TableCell[] = [];

          for (const cellNode of rowNode.children) {
            const cellRuns = parsePhrasing((cellNode as MdastTableCell).children, {
              bold: isHeader,
            });

            cells.push(
              new TableCell({
                children: [
                  new Paragraph({
                    children: cellRuns,
                    spacing: { before: 60, after: 60 },
                    alignment: AlignmentType.START,
                  }),
                ],
                shading: {
                  fill: isHeader ? 'F1F5F9' : rIdx % 2 === 0 ? 'F8FAFC' : 'FFFFFF',
                  type: ShadingType.CLEAR,
                },
                margins: {
                  top: 120,
                  bottom: 120,
                  left: 140,
                  right: 140,
                },
              })
            );
          }

          rows.push(
            new TableRow({
              children: cells,
              tableHeader: isHeader,
              cantSplit: true,
            })
          );
        }

        const tableBorder = {
          style: BorderStyle.SINGLE,
          size: 4,
          color: 'CBD5E1',
        };

        docChildren.push(
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows,
            borders: {
              top: tableBorder,
              bottom: tableBorder,
              left: tableBorder,
              right: tableBorder,
              insideHorizontal: tableBorder,
              insideVertical: tableBorder,
            },
          })
        );

        // Add spacing after table
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 80 },
          })
        );
      }
    }
  }

  processNodes(ast.children);

  // Fallback if document is empty
  if (docChildren.length === 0) {
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: 'Empty document.', italics: true })],
      })
    );
  }

  const doc = new Document({
    creator: 'mdToDocs Converter',
    title: docTitle,
    description: 'Converted from Markdown via mdToDocs',
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.START },
            { level: 1, format: LevelFormat.LOWER_LETTER, text: '%2.', alignment: AlignmentType.START },
            { level: 2, format: LevelFormat.LOWER_ROMAN, text: '%3.', alignment: AlignmentType.START },
            { level: 3, format: LevelFormat.DECIMAL, text: '%4.', alignment: AlignmentType.START },
            { level: 4, format: LevelFormat.LOWER_LETTER, text: '%5.', alignment: AlignmentType.START },
            { level: 5, format: LevelFormat.LOWER_ROMAN, text: '%6.', alignment: AlignmentType.START },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            size: 22, // 11pt
            color: '0F172A',
          },
        },
      },
      paragraphStyles: [
        {
          id: HeadingLevel.HEADING_1,
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 40, // 20pt
            bold: true,
            color: '0F172A',
          },
        },
        {
          id: HeadingLevel.HEADING_2,
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 32, // 16pt
            bold: true,
            color: '1E293B',
          },
        },
        {
          id: HeadingLevel.HEADING_3,
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 26, // 13pt
            bold: true,
            color: '334155',
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width in twips
              height: 16838, // A4 height in twips
            },
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: docTitle,
                    size: 16,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        children: docChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
