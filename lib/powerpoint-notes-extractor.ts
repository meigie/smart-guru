import { readFile } from 'fs/promises';
import AdmZip from 'adm-zip';
import { parseString } from 'xml2js';

export interface SlideNotes {
  slideNumber: number;
  notes: string;
  slideText: string[];
  title: string;
}

export interface PresentationNotes {
  slides: SlideNotes[];
  title: string;
  author: string;
  totalSlides: number;
}

export async function extractPowerPointNotes(
  filePath: string
): Promise<PresentationNotes> {
  try {
    const fileBuffer = await readFile(filePath);
    const zip = new AdmZip(fileBuffer);
    const slides: SlideNotes[] = [];
    let title = 'Untitled Presentation';
    let author = 'Unknown Author';
    try {
      const coreXml = zip.getEntry('docProps/core.xml');
      if (coreXml) {
        const coreContent = coreXml.getData().toString('utf8');
        const coreResult = await parseXml(coreContent);
        if (coreResult['cp:coreProperties']?.['dc:title']?.[0]) {
          title = coreResult['cp:coreProperties']['dc:title'][0];
        }
        if (coreResult['cp:coreProperties']?.['dc:creator']?.[0]) {
          author = coreResult['cp:coreProperties']['dc:creator'][0];
        }
      }
    } catch {}
    const slideEntries = zip
      .getEntries()
      .filter(
        (entry: any) =>
          entry.entryName.startsWith('ppt/slides/slide') &&
          entry.entryName.endsWith('.xml')
      );
    for (let i = 0; i < slideEntries.length; i++) {
      const slideNumber = i + 1;
      const slideEntry = slideEntries[i];
      try {
        const slideContent = slideEntry.getData().toString('utf8');
        const slideResult = await parseXml(slideContent);
        const slideText = extractSlideText(slideResult);
        const notes = await extractSlideNotes(zip, slideNumber);
        slides.push({
          slideNumber,
          notes,
          slideText,
          title: slideText[0] || `Slide ${slideNumber}`,
        });
      } catch {
        slides.push({
          slideNumber,
          notes: '',
          slideText: [`Slide ${slideNumber} content`],
          title: `Slide ${slideNumber}`,
        });
      }
    }
    return { slides, title, author, totalSlides: slides.length };
  } catch (error) {
    throw error;
  }
}

function parseXml(xmlString: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(
      xmlString,
      {
        explicitArray: false,
        mergeAttrs: true,
        normalize: true,
        normalizeTags: true,
      },
      (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

function extractSlideText(slideResult: any): string[] {
  const textElements: string[] = [];
  const slideXml = JSON.stringify(slideResult);
  const textMatches = slideXml.match(/"a:t":\s*"([^"]+)"/g);
  if (textMatches) {
    for (const match of textMatches) {
      const text = match
        .replace(/"a:t":\s*"/, '')
        .replace(/"/, '')
        .trim();
      if (text && text.length > 0 && text !== 'null' && text !== 'undefined') {
        textElements.push(text);
      }
    }
  }
  return textElements;
}

async function extractSlideNotes(
  zip: AdmZip,
  slideNumber: number
): Promise<string> {
  const notePaths = [
    `ppt/notesSlides/notesSlide${slideNumber}.xml`,
    `ppt/notesSlides/notesSlide${slideNumber.toString().padStart(1, '0')}.xml`,
    `ppt/notesSlides/notesSlide${slideNumber.toString().padStart(2, '0')}.xml`,
  ];
  for (const notePath of notePaths) {
    const notesEntry = zip.getEntry(notePath);
    if (notesEntry) {
      const notesContent = notesEntry.getData().toString('utf8');
      try {
        const notesResult = await parseXml(notesContent);
        const notesText = extractSlideText(notesResult);
        if (notesText.length > 0) {
          return notesText.join(' ').trim();
        }
      } catch {}
    }
  }
  return '';
}
