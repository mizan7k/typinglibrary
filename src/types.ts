/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Chapter {
  id: string; // e.g., "chapter-01"
  number: number;
  title: string;
  content: string; // The full chapter text
  wordCount: number;
}

export interface Book {
  id: string; // Folder name, e.g., "pride-and-prejudice"
  title: string;
  author: string;
  description: string;
  coverImage: string; // URL or CSS gradient description
  difficulty: "Easy" | "Medium" | "Hard";
  year?: number;
  tags: string[];
  chapters: Chapter[];
  stats: {
    wordCount: number;
    estimatedReadTime: number; // in minutes
    estimatedTypeTime: number; // in minutes
  };
}

export interface ChapterProgress {
  bookId: string;
  chapterId: string;
  currentIndex: number; // character index user is on
  completed: boolean;
  accuracy: number;
  wpm: number;
  timeSpent: number; // in seconds
  lastPracticed: string; // ISO date string
}

export interface BookProgress {
  bookId: string;
  currentChapterId: string;
  completedChapters: string[]; // chapterIds
  overallProgress: number; // percentage completed
}

export interface TypingSessionStats {
  wpm: number;
  accuracy: number;
  mistakes: number;
  elapsedTime: number; // in seconds
  completedChars: number;
  totalChars: number;
  wordsTyped: number;
  currentStreak: number;
  bestWpm: number;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  fontSize: "sm" | "base" | "lg" | "xl";
  fontFamily: "serif" | "sans" | "mono";
  blindMode: boolean; // if true, don't show mistakes highlighted in red, just pause or highlight current letter
  showKeyboard: boolean;
}

export interface GlobalStats {
  totalTimeSpent: number; // in seconds
  totalWordsTyped: number;
  totalChaptersCompleted: number;
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  typingStreak: number; // in days
  lastTypingDate: string | null;
}
