/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Book, Chapter, AppSettings, TypingSessionStats } from "./types";
import { getBooks, getBookById } from "./lib/books";
import {
  getSettings,
  saveSettings,
  saveChapterProgress,
  updateGlobalStats,
} from "./lib/storage";

// Views
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import LibraryView from "./components/LibraryView";
import BookDetailView from "./components/BookDetailView";
import ChapterTypingView from "./components/ChapterTypingView";
import ChapterCompletionView from "./components/ChapterCompletionView";
import SettingsView from "./components/SettingsView";

export default function App() {
  // Core datasets loaded on startup
  const [books, setBooks] = useState<Book[]>([]);

  // Page Routing & Navigation State
  const [activeTab, setActiveTab] = useState<"home" | "library" | "settings">("home");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState<TypingSessionStats | null>(null);

  // Global settings and search states
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [searchQuery, setSearchQuery] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Load books on mounting
  useEffect(() => {
    setBooks(getBooks());
  }, []);

  // Theme Sync effect (Light, Dark, and System)
  useEffect(() => {
    const syncTheme = () => {
      const root = document.documentElement;
      if (settings.theme === "dark") {
        root.classList.add("dark");
      } else if (settings.theme === "light") {
        root.classList.remove("dark");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    syncTheme();

    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => syncTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [settings.theme]);

  // Handle settings adjustments
  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Wipe statistics / progress completely
  const handleClearAllData = () => {
    localStorage.clear();
    setSettings({
      theme: "system",
      fontSize: "lg",
      fontFamily: "serif",
      blindMode: false,
      showKeyboard: true,
    });
    setResetMessage("Success: All library progress and stats have been cleared.");
    setTimeout(() => setResetMessage(null), 4000);
    
    // Reset page router states to clean slate
    setSelectedBookId(null);
    setSelectedChapterId(null);
    setSessionStats(null);
    setActiveTab("home");
  };

  // Navigating to detail pages
  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterId(null);
    setSessionStats(null);
  };

  const handleSelectChapter = (bookId: string, chapterId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterId(chapterId);
    setSessionStats(null);
  };

  // Handle successful typing completion of a chapter
  const handleChapterComplete = (stats: TypingSessionStats) => {
    if (!selectedBookId || !selectedChapterId) return;

    // Save progress to local storage
    saveChapterProgress({
      bookId: selectedBookId,
      chapterId: selectedChapterId,
      currentIndex: stats.completedChars,
      completed: true,
      accuracy: stats.accuracy,
      wpm: stats.wpm,
      timeSpent: stats.elapsedTime,
      lastPracticed: new Date().toISOString(),
    });

    // Save global aggregated stats
    updateGlobalStats({
      wordsTyped: stats.wordsTyped,
      timeSpent: stats.elapsedTime,
      accuracy: stats.accuracy,
      wpm: stats.wpm,
      chapterCompleted: true,
    });

    // Set statistics to trigger completion view
    setSessionStats(stats);
  };

  // Navigation handlers
  const handleBackToBook = () => {
    setSessionStats(null);
    setSelectedChapterId(null);
  };

  const handleBackToCatalog = () => {
    setSessionStats(null);
    setSelectedChapterId(null);
    setSelectedBookId(null);
    setActiveTab("library");
  };

  const activeBook = selectedBookId ? getBookById(selectedBookId) : null;
  const activeChapter = activeBook && selectedChapterId
    ? activeBook.chapters.find((c) => c.id === selectedChapterId)
    : null;

  // Determine which next chapter is available in sequence
  const handleNextChapter = () => {
    if (!activeBook || !activeChapter) return;
    const currentIdx = activeBook.chapters.findIndex((c) => c.id === activeChapter.id);
    const nextCh = activeBook.chapters[currentIdx + 1];
    if (nextCh) {
      handleSelectChapter(activeBook.id, nextCh.id);
    }
  };

  // Determine if there is a next chapter in the sequence
  const hasNextChapter = () => {
    if (!activeBook || !activeChapter) return false;
    const currentIdx = activeBook.chapters.findIndex((c) => c.id === activeChapter.id);
    return currentIdx < activeBook.chapters.length - 1;
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* Navbar section */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          setSelectedBookId(null);
          setSelectedChapterId(null);
          setSessionStats(null);
        }}
        theme={settings.theme}
        onChangeTheme={(theme) => handleSettingsChange({ ...settings, theme })}
        onSearchFocus={() => {
          setActiveTab("library");
          setSelectedBookId(null);
          setSelectedChapterId(null);
          setSessionStats(null);
        }}
      />

      {/* Floating alert for reset notifications */}
      {resetMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            {resetMessage}
          </p>
        </div>
      )}

      {/* Primary views routing */}
      <main className="flex-1 pb-16">
        {selectedBookId && activeBook ? (
          // Nested detailed screens
          selectedChapterId && activeChapter ? (
            sessionStats ? (
              /* Session Victory / Completed view */
              <ChapterCompletionView
                book={activeBook}
                chapter={activeChapter}
                stats={sessionStats}
                onNextChapter={hasNextChapter() ? handleNextChapter : undefined}
                onRestart={() => setSessionStats(null)}
                onBackToBook={handleBackToBook}
              />
            ) : (
              /* Core Typing game experience */
              <ChapterTypingView
                book={activeBook}
                chapter={activeChapter}
                onBack={handleBackToBook}
                onComplete={handleChapterComplete}
                settings={settings}
              />
            )
          ) : (
            /* Single book chapters dashboard overview */
            <BookDetailView
              book={activeBook}
              onBack={handleBackToCatalog}
              onSelectChapter={(chapterId) => handleSelectChapter(activeBook.id, chapterId)}
            />
          )
        ) : (
          /* Main Tab Panels routing */
          <>
            {activeTab === "home" && (
              <HomeView
                books={books}
                onSelectBook={handleSelectBook}
                onNavigateTab={setActiveTab}
                onSelectChapter={handleSelectChapter}
              />
            )}
            
            {activeTab === "library" && (
              <LibraryView
                books={books}
                onSelectBook={handleSelectBook}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
            
            {activeTab === "settings" && (
              <SettingsView
                settings={settings}
                onChangeSettings={handleSettingsChange}
                onClearData={handleClearAllData}
              />
            )}
          </>
        )}
      </main>

      {/* Footnote details */}
      <Footer />
    </div>
  );
}
