/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Chapter, TypingSessionStats } from "../types";
import { Award, ArrowRight, RotateCcw, BookOpen, CheckCircle, Clock, Sparkles } from "lucide-react";

interface ChapterCompletionViewProps {
  book: Book;
  chapter: Chapter;
  stats: TypingSessionStats;
  onNextChapter?: () => void;
  onRestart: () => void;
  onBackToBook: () => void;
}

export default function ChapterCompletionView({
  book,
  chapter,
  stats,
  onNextChapter,
  onRestart,
  onBackToBook,
}: ChapterCompletionViewProps) {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8 text-center">
      
      {/* Animated victory badge */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Award size={32} className="stroke-[2.5]" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
            {book.title} &middot; CH {chapter.number}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Chapter Completed!
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Outstanding! You successfully read and typed through Jane Austen's or Wells' timeless transcription. Here is your performance overview:
          </p>
        </div>
      </div>

      {/* Grid of session statistics */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Speed */}
        <div className="p-5 bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1 justify-center">
            <Sparkles size={11} className="text-amber-500" />
            <span>TYPING SPEED</span>
          </span>
          <p className="text-3xl font-bold font-mono text-zinc-800 dark:text-zinc-50">
            {stats.wpm}
          </p>
          <span className="text-[10px] font-mono text-zinc-400">WORDS / MINUTE</span>
        </div>

        {/* Accuracy */}
        <div className="p-5 bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1 justify-center">
            <CheckCircle size={11} className="text-emerald-500" />
            <span>ACCURACY</span>
          </span>
          <p className="text-3xl font-bold font-mono text-zinc-800 dark:text-zinc-50">
            {stats.accuracy}%
          </p>
          <span className="text-[10px] font-mono text-zinc-400">PRECISION ACCURACY</span>
        </div>

        {/* Mistakes */}
        <div className="p-5 bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase block">
            MISTAKES MADE
          </span>
          <p className="text-3xl font-bold font-mono text-zinc-800 dark:text-zinc-50">
            {stats.mistakes}
          </p>
          <span className="text-[10px] font-mono text-zinc-400">UNCORRECTED KEYS</span>
        </div>

        {/* Time Elapsed */}
        <div className="p-5 bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl shadow-xs space-y-1">
          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1 justify-center">
            <Clock size={11} className="text-zinc-400" />
            <span>TIME ELAPSED</span>
          </span>
          <p className="text-3xl font-bold font-mono text-zinc-800 dark:text-zinc-50">
            {Math.floor(stats.elapsedTime / 60)}:
            {String(stats.elapsedTime % 60).padStart(2, "0")}
          </p>
          <span className="text-[10px] font-mono text-zinc-400">MINUTES spent</span>
        </div>

      </div>

      {/* Primary Navigation Actions */}
      <div className="space-y-3">
        {onNextChapter ? (
          <button
            onClick={onNextChapter}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            <span>Proceed to Next Chapter</span>
            <ArrowRight size={15} />
          </button>
        ) : (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl text-xs font-semibold">
            🎉 Amazing! You have fully completed the final chapter of this book!
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer transition-all"
          >
            <RotateCcw size={13} />
            <span>Practice Again</span>
          </button>
          
          <button
            onClick={onBackToBook}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer transition-all"
          >
            <BookOpen size={13} />
            <span>Book Directory</span>
          </button>
        </div>
      </div>

    </div>
  );
}
