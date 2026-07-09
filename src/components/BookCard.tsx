/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Book, BookProgress } from "../types";
import { BookOpen, Clock, AlertCircle } from "lucide-react";
import { getCompletedChapters } from "../lib/storage";

interface BookCardProps {
  key?: string;
  book: Book;
  onSelect: (bookId: string) => void;
}

export default function BookCard({ book, onSelect }: BookCardProps) {
  // Read progress dynamically from local storage
  const completed = getCompletedChapters(book.id);
  const totalChapters = book.chapters.length;
  const progressPercent = totalChapters > 0 ? Math.round((completed.length / totalChapters) * 100) : 0;

  const difficultyColors = {
    Easy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40",
    Medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/40",
    Hard: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900/40",
  };

  return (
    <div
      onClick={() => onSelect(book.id)}
      className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Visual Cover Header */}
      <div
        style={{ backgroundImage: book.coverImage }}
        className="h-44 w-full relative flex items-end p-5 transition-transform group-hover:scale-[1.02] duration-300 ease-out"
      >
        {/* Soft overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-white/80 tracking-widest">
            {book.author}
          </span>
          <h3 className="text-lg font-serif font-bold text-white leading-tight line-clamp-2">
            {book.title}
          </h3>
        </div>

        {/* Difficulty Tag Overlay */}
        <span className={`absolute top-4 right-4 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${difficultyColors[book.difficulty]}`}>
          {book.difficulty}
        </span>
      </div>

      {/* Book description and metadata */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {book.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {book.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-sm font-sans"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Indicators & Progress */}
        <div className="space-y-3 pt-3 border-t border-zinc-50 dark:border-zinc-800">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            <div className="flex items-center gap-1">
              <BookOpen size={12} />
              <span>{totalChapters} {totalChapters === 1 ? "Chapter" : "Chapters"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>~{book.stats.estimatedTypeTime} min typing</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400 dark:text-zinc-500">COMPLETION</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
