/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Chapter } from "../types";
import { ArrowLeft, Play, CheckCircle2, Clock, FileText, Award, Calendar } from "lucide-react";
import { getCompletedChapters } from "../lib/storage";

interface BookDetailViewProps {
  book: Book;
  onBack: () => void;
  onSelectChapter: (chapterId: string) => void;
}

export default function BookDetailView({
  book,
  onBack,
  onSelectChapter,
}: BookDetailViewProps) {
  const completedChapters = getCompletedChapters(book.id);
  const totalChapters = book.chapters.length;
  const progressPercent = totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;

  // Determine which chapter to start/resume
  const firstUncompleted = book.chapters.find((ch) => !completedChapters.includes(ch.id));
  const nextChapter = firstUncompleted || book.chapters[0];

  const difficultyColors = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40",
    Medium: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40",
    Hard: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer group"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        <span>BACK TO LIBRARY</span>
      </button>

      {/* Book Hero Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Cover Display Column */}
        <div className="md:col-span-1">
          <div
            style={{ backgroundImage: book.coverImage }}
            className="w-full aspect-[3/4] rounded-2xl relative flex items-end p-6 shadow-xl dark:shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-1.5">
              <span className="text-xs font-mono uppercase font-bold text-white/80 tracking-widest block">
                {book.author}
              </span>
              <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                {book.title}
              </h2>
              {book.year && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-white/60">
                  <Calendar size={10} />
                  <span>{book.year}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info & Metadata Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono uppercase font-bold px-3 py-0.5 rounded-full border ${difficultyColors[book.difficulty]}`}>
                {book.difficulty} Difficulty
              </span>
              {book.tags.map((tag) => (
                <span key={tag} className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              {book.title}
            </h1>
            <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
              By <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{book.author}</span>
            </p>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl font-sans">
            {book.description}
          </p>

          {/* Stat summary counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <FileText className="text-zinc-400" size={16} />
              <div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Word Count</p>
                <p className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200">{book.stats.wordCount.toLocaleString()}</p>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <Clock className="text-zinc-400" size={16} />
              <div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Typing Time</p>
                <p className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200">~{book.stats.estimatedTypeTime} mins</p>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 col-span-2 sm:col-span-1">
              <Award className="text-zinc-400" size={16} />
              <div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Completed</p>
                <p className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200">
                  {completedChapters.length} / {totalChapters} Ch
                </p>
              </div>
            </div>
          </div>

          {/* Quick Resume CTA Banner */}
          <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-serif font-bold text-zinc-800 dark:text-zinc-100">
                {completedChapters.length > 0 ? "Resume Your Reading" : "Begin Your Adventure"}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {completedChapters.length > 0 
                  ? `Next chapter: ${nextChapter.title}` 
                  : `Start with: ${book.chapters[0].title}`
                }
              </p>
            </div>

            <button
              onClick={() => onSelectChapter(nextChapter.id)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Play size={13} className="fill-current" />
              <span>{completedChapters.length > 0 ? "Resume Typing" : "Start Chapter 1"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Completion Progress Tracker */}
      <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">TOTAL BOOK COMPLETION</span>
          <span className="text-zinc-900 dark:text-zinc-50 font-bold">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Chapter Index list */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-50 pb-2 border-b border-zinc-50 dark:border-zinc-800">
          Chapter Directory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {book.chapters.map((chapter) => {
            const isCompleted = completedChapters.includes(chapter.id);
            return (
              <div
                key={chapter.id}
                onClick={() => onSelectChapter(chapter.id)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  isCompleted
                    ? "bg-zinc-50/50 border-zinc-100 dark:bg-zinc-900/20 dark:border-zinc-800/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30"
                    : "bg-white border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-xs"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400">CH {chapter.number}</span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        <CheckCircle2 size={10} className="fill-emerald-100 dark:fill-transparent" />
                        <span>Done</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-serif font-bold text-zinc-800 dark:text-zinc-100 leading-snug">
                    {chapter.title}
                  </h4>
                </div>

                <div className="text-right pl-4">
                  <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                    {chapter.wordCount.toLocaleString()} words
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400">
                    ~{Math.max(1, Math.round(chapter.wordCount / 40))} min
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
