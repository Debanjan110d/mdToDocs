export type ExportFormat = 'pdf' | 'docx';

export interface DocumentStats {
  words: number;
  characters: number;
  lines: number;
  readingTimeMinutes: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type ViewMode = 'split' | 'editor' | 'preview';
