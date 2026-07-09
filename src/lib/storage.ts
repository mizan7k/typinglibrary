/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppSettings, ChapterProgress, GlobalStats } from "../types";

const STORAGE_KEYS = {
  SETTINGS: "typing_library_settings",
  PROGRESS_PREFIX: "typing_library_progress:", // key format: prefix + bookId + ":" + chapterId
  COMPLETED_PREFIX: "typing_library_completed:", // key format: prefix + bookId
  GLOBAL_STATS: "typing_library_global_stats",
  LAST_READ: "typing_library_last_read", // stores { bookId, chapterId }
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  fontSize: "lg",
  fontFamily: "serif",
  blindMode: false,
  showKeyboard: true,
};

const DEFAULT_GLOBAL_STATS: GlobalStats = {
  totalTimeSpent: 0,
  totalWordsTyped: 0,
  totalChaptersCompleted: 0,
  averageWpm: 0,
  averageAccuracy: 0,
  bestWpm: 0,
  typingStreak: 0,
  lastTypingDate: null,
};

// 1. Settings storage
export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error("Error reading settings", e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving settings", e);
  }
}

// 2. Typing Progress storage
export function getChapterProgress(bookId: string, chapterId: string): ChapterProgress | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEYS.PROGRESS_PREFIX}${bookId}:${chapterId}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading chapter progress", e);
  }
  return null;
}

export function saveChapterProgress(progress: ChapterProgress): void {
  try {
    const key = `${STORAGE_KEYS.PROGRESS_PREFIX}${progress.bookId}:${progress.chapterId}`;
    localStorage.setItem(key, JSON.stringify(progress));
    
    // Save as last read
    localStorage.setItem(
      STORAGE_KEYS.LAST_READ,
      JSON.stringify({ bookId: progress.bookId, chapterId: progress.chapterId })
    );

    // If completed, add to completed list
    if (progress.completed) {
      markChapterCompleted(progress.bookId, progress.chapterId);
    }
  } catch (e) {
    console.error("Error saving chapter progress", e);
  }
}

// 3. Book completion tracking
export function getCompletedChapters(bookId: string): string[] {
  try {
    const data = localStorage.getItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${bookId}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading completed chapters", e);
  }
  return [];
}

export function markChapterCompleted(bookId: string, chapterId: string): void {
  try {
    const completed = getCompletedChapters(bookId);
    if (!completed.includes(chapterId)) {
      completed.push(chapterId);
      localStorage.setItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${bookId}`, JSON.stringify(completed));
    }
  } catch (e) {
    console.error("Error saving completed chapter", e);
  }
}

export function resetChapterProgress(bookId: string, chapterId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_KEYS.PROGRESS_PREFIX}${bookId}:${chapterId}`);
    
    // Also remove from completed list if present
    const completed = getCompletedChapters(bookId);
    const index = completed.indexOf(chapterId);
    if (index > -1) {
      completed.splice(index, 1);
      localStorage.setItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${bookId}`, JSON.stringify(completed));
    }
  } catch (e) {
    console.error("Error resetting chapter progress", e);
  }
}

// 4. Continue Reading lookup
export function getLastRead(): { bookId: string; chapterId: string } | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_READ);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading last read progress", e);
  }
  return null;
}

// 5. Global Stats Tracking
export function getGlobalStats(): GlobalStats {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GLOBAL_STATS);
    if (data) {
      return { ...DEFAULT_GLOBAL_STATS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error("Error reading global stats", e);
  }
  return DEFAULT_GLOBAL_STATS;
}

export function updateGlobalStats(session: {
  wordsTyped: number;
  timeSpent: number; // in seconds
  accuracy: number;
  wpm: number;
  chapterCompleted: boolean;
}): GlobalStats {
  const current = getGlobalStats();
  
  // Calculate new streak
  let streak = current.typingStreak;
  const todayStr = new Date().toISOString().split("T")[0];
  
  if (current.lastTypingDate) {
    const lastDate = new Date(current.lastTypingDate);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1; // Streak broken, start fresh
    }
    // if diffDays === 0, streak remains unchanged (already practiced today)
  } else {
    streak = 1; // First session
  }

  const newTotalWords = current.totalWordsTyped + session.wordsTyped;
  const newTotalTime = current.totalTimeSpent + session.timeSpent;
  const newChaptersCompleted = current.totalChaptersCompleted + (session.chapterCompleted ? 1 : 0);
  const newBestWpm = Math.max(current.bestWpm, session.wpm);
  
  // Weighted averages
  const previousSessionsCount = Math.max(1, current.totalWordsTyped / 50); // assume 50 words per session average
  const newAverageWpm = current.averageWpm === 0 
    ? session.wpm 
    : Math.round((current.averageWpm * previousSessionsCount + session.wpm) / (previousSessionsCount + 1));
    
  const newAverageAccuracy = current.averageAccuracy === 0
    ? session.accuracy
    : Math.round((current.averageAccuracy * previousSessionsCount + session.accuracy) / (previousSessionsCount + 1));

  const updated: GlobalStats = {
    totalTimeSpent: newTotalTime,
    totalWordsTyped: newTotalWords,
    totalChaptersCompleted: newChaptersCompleted,
    averageWpm: newAverageWpm,
    averageAccuracy: newAverageAccuracy,
    bestWpm: newBestWpm,
    typingStreak: streak,
    lastTypingDate: todayStr,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_STATS, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving global stats", e);
  }

  return updated;
}
