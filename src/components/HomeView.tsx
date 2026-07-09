/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Book, GlobalStats } from "../types";
import { Sparkles, Play, Clock, Flame, BookOpen, Target, ArrowRight } from "lucide-react";
import { getGlobalStats, getLastRead } from "../lib/storage";
import StatsCard from "./StatsCard";
import BookCard from "./BookCard";

interface HomeViewProps {
  books: Book[];
  onSelectBook: (bookId: string) => void;
  onNavigateTab: (tab: "home" | "library" | "settings") => void;
  onSelectChapter: (bookId: string, chapterId: string) => void;
}

export default function HomeView({
  books,
  onSelectBook,
  onNavigateTab,
  onSelectChapter,
}: HomeViewProps) {
  // Load lifetime stats
  const stats: GlobalStats = getGlobalStats();

  // Load last read/practiced book
  const lastReadInfo = getLastRead();
  const lastBook = lastReadInfo ? books.find((b) => b.id === lastReadInfo.bookId) : null;
  const lastChapter = lastBook ? lastBook.chapters.find((c) => c.id === lastReadInfo.chapterId) : null;

  // Showcase featured books (e.g., first 3)
  const featuredBooks = books.slice(0, 3);

  // Formatting helper for time
  const formatTimeSpent = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    const mins = Math.round(secs / 60);
    if (mins < 60) return `${mins}m`;
    const hrs = (mins / 60).toFixed(1);
    return `${hrs}h`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Editorial Hero Header */}
      <div className="relative rounded-3xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 p-8 sm:p-12 overflow-hidden shadow-xl">
        {/* Abstract luxury paper fold styling in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-white/5 to-transparent hidden md:block" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-zinc-900/10 text-zinc-300 dark:text-zinc-600 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles size={11} className="text-amber-400 dark:text-amber-500 fill-amber-400 dark:fill-amber-500" />
            <span>Interactive Classical Literature</span>
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight">
            Read timeless books.<br />
            Improve your typing.
          </h2>
          
          <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-500 leading-relaxed max-w-lg">
            Typing Library combines literary classics with structured keyboard training. No unrequested gimmicks, just clean typesetting, real chapter progressions, and offline progress saving.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigateTab("library")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Explore Book Library</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onNavigateTab("settings")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 hover:border-white/40 dark:border-zinc-200 dark:hover:border-zinc-300 bg-transparent text-white dark:text-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            >
              Configure Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Lifetime Stats Dashboard */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
          Your Lifetime Progress
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Average Speed"
            value={stats.averageWpm > 0 ? `${stats.averageWpm}` : "0"}
            subtext="WPM (Words Per Min)"
            icon={Target}
          />
          <StatsCard
            label="Typing Accuracy"
            value={stats.averageAccuracy > 0 ? `${stats.averageAccuracy}%` : "100%"}
            subtext="Consistent muscle precision"
            icon={Sparkles}
          />
          <StatsCard
            label="Practice Streak"
            value={`${stats.typingStreak}`}
            subtext={stats.typingStreak === 1 ? "Day active" : "Days active"}
            icon={Flame}
            variant={stats.typingStreak > 0 ? "brand" : "default"}
          />
          <StatsCard
            label="Time Spent"
            value={formatTimeSpent(stats.totalTimeSpent)}
            subtext={`${stats.totalChaptersCompleted} chapters typed`}
            icon={Clock}
          />
        </div>
      </section>

      {/* Continue Reading Section (Conditional) */}
      {lastBook && lastChapter && (
        <section className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            Continue Reading
          </h3>
          
          <div className="bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300">
            <div className="flex items-center gap-4 text-left w-full sm:w-auto">
              <div
                style={{ backgroundImage: lastBook.coverImage }}
                className="w-16 h-20 rounded-lg shrink-0 flex items-end p-1.5 shadow-md relative overflow-hidden hidden sm:flex"
              >
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  {lastBook.title} &middot; {lastBook.author}
                </span>
                <h4 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                  {lastChapter.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Word Count: {lastChapter.wordCount} words
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectChapter(lastBook.id, lastChapter.id)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Play size={13} className="fill-current" />
              <span>Resume Chapter Practice</span>
            </button>
          </div>
        </section>
      )}

      {/* Featured Book Showcase Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
            Featured Literary Classics
          </h3>
          <button
            onClick={() => onNavigateTab("library")}
            className="flex items-center gap-1 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} onSelect={onSelectBook} />
          ))}
        </div>
      </section>

    </div>
  );
}
