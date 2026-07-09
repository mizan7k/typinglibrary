/// <reference types="vite/client" />

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Chapter } from "../types";

// Dynamically discover all metadata and markdown chapter files at build time using Vite glob imports.
const metadataGlob = import.meta.glob("/src/books/*/metadata.json", { eager: true });
const chapterGlob = import.meta.glob("/src/books/*/*.md", { query: "?raw", eager: true });

// Extract a clean title from markdown chapter content.
// Typically the first line is "# Chapter Title" or "# Chapter 1 - Title"
function parseChapterMarkdown(filename: string, rawContent: string, index: number): Chapter {
  const lines = rawContent.split("\n");
  let title = `Chapter ${index + 1}`;
  let contentStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("# ")) {
      title = line.replace("# ", "").trim();
      contentStartIndex = i + 1;
      break;
    }
  }

  // Join the remaining lines of the file for typing content, trimming trailing/leading empty lines
  const rawBody = lines.slice(contentStartIndex).join("\n").trim();
  
  // Clean up content for smooth typing (standardizing curly quotes and double spaces)
  const cleanedContent = rawBody
    .replace(/[\u201c\u201d]/g, '"') // Typographical double quotes to standard double quotes
    .replace(/[\u2018\u2019]/g, "'") // Typographical single quotes to standard single quotes
    .replace(/\r\n/g, "\n")          // Standardize line breaks
    .replace(/\n{3,}/g, "\n\n");     // Max 2 consecutive line breaks

  // Calculate word count (standard typing calculation is 5 characters per word)
  const wordCount = Math.round(cleanedContent.length / 5);

  const fileId = filename.split("/").pop()?.replace(".md", "") || `chapter-${String(index + 1).padStart(2, "0")}`;

  return {
    id: fileId,
    number: index + 1,
    title,
    content: cleanedContent,
    wordCount,
  };
}

// Map the discovered files into structured Book objects
export function getBooks(): Book[] {
  const booksMap: Record<string, Partial<Book> & { rawChapters: { filename: string; raw: string }[] }> = {};

  // 1. Process metadata files
  for (const path in metadataGlob) {
    const segments = path.split("/");
    // path looks like: /src/books/pride-and-prejudice/metadata.json
    const bookId = segments[segments.length - 2];
    const module = metadataGlob[path] as any;
    
    // Support default exports or direct JSON properties depending on Vite config
    const data = module.default ? module.default : module;

    booksMap[bookId] = {
      id: bookId,
      title: data.title || bookId,
      author: data.author || "Unknown Author",
      description: data.description || "",
      coverImage: data.coverImage || "linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)",
      difficulty: data.difficulty || "Medium",
      year: data.year,
      tags: data.tags || [],
      rawChapters: [],
    };
  }

  // 2. Process chapter files
  for (const path in chapterGlob) {
    const segments = path.split("/");
    // path looks like: /src/books/pride-and-prejudice/chapter-01.md
    const bookId = segments[segments.length - 2];
    const filename = segments[segments.length - 1];
    const module = chapterGlob[path] as any;
    
    const rawContent = typeof module === "string" ? module : (module.default || "");

    if (booksMap[bookId]) {
      booksMap[bookId].rawChapters.push({
        filename,
        raw: rawContent,
      });
    }
  }

  // 3. Assemble books with sorted chapters and complete stats
  const books: Book[] = [];

  for (const bookId in booksMap) {
    const bookData = booksMap[bookId];
    
    // Sort chapters by filename (e.g. chapter-01.md, chapter-02.md)
    const sortedRaw = [...bookData.rawChapters].sort((a, b) => a.filename.localeCompare(b.filename));
    
    const chapters: Chapter[] = sortedRaw.map((ch, idx) => 
      parseChapterMarkdown(ch.filename, ch.raw, idx)
    );

    const totalWordCount = chapters.reduce((acc, ch) => acc + ch.wordCount, 0);
    // standard adult reading speed: 200 WPM
    const estimatedReadTime = Math.max(1, Math.round(totalWordCount / 200));
    // standard typing speed: 40 WPM
    const estimatedTypeTime = Math.max(1, Math.round(totalWordCount / 40));

    books.push({
      id: bookData.id!,
      title: bookData.title!,
      author: bookData.author!,
      description: bookData.description!,
      coverImage: bookData.coverImage!,
      difficulty: bookData.difficulty!,
      year: bookData.year,
      tags: bookData.tags!,
      chapters,
      stats: {
        wordCount: totalWordCount,
        estimatedReadTime,
        estimatedTypeTime,
      },
    });
  }

  // Sort books by title by default
  return books.sort((a, b) => a.title.localeCompare(b.title));
}

export function getBookById(id: string): Book | undefined {
  return getBooks().find((b) => b.id === id);
}
