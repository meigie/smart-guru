import { extractPowerPointNotes } from './powerpoint-notes-extractor';

export interface SlideData {
  id: number;
  imageUrl: string;
  transcript: string;
  slideNumber: number;
}

export interface ProcessingResult {
  slides: SlideData[];
  originalFile: string;
  success: boolean;
  error?: string;
}

export async function processPowerPointFileReal(
  filePath: string
): Promise<ProcessingResult> {
  try {
    const notesData = await extractPowerPointNotes(filePath);
    const slides: SlideData[] = notesData.slides.map((slide, idx) => ({
      id: idx + 1,
      imageUrl: '',
      transcript: slide.notes || '',
      slideNumber: idx + 1,
    }));
    return {
      slides,
      originalFile: filePath,
      success: true,
    };
  } catch (error) {
    return {
      slides: [],
      originalFile: filePath,
      success: false,
      error:
        error instanceof Error ? error.message : 'Unknown processing error',
    };
  }
}
