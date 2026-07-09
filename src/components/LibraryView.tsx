/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Book } from "../types";
import { Search, SlidersHorizontal, BookOpen, Clock, RefreshCw } from "lucide-react";
import BookCard from "./BookCard";

interface LibraryViewProps {
  books: Book[];
  onSelectBook: (bookId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type SortOption = "title_asc" | "title_desc" | "diff_easy" | "diff_hard" | "time_asc" | "time_desc";

export default function LibraryView({
  books,
  onSelectBook,
  searchQuery,
  onSearchChange,
}: LibraryViewProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("title_asc");

  // Filter & Sort Books using useMemo for performance
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // 1. Apply Search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 2. Apply Difficulty Filter
    if (selectedDifficulty !== "All") {
      result = result.filter((b) => b.difficulty === selectedDifficulty);
    }

    // 3. Apply Sorting
    result.sort((a, b) => {
      if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title_desc") {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === "diff_easy") {
        const difficultyRank = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
      }
      if (sortBy === "diff_hard") {
        const difficultyRank = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyRank[b.difficulty] - difficultyRank[a.difficulty];
      }
      if (sortBy === "time_asc") {
        return a.stats.estimatedTypeTime - b.stats.estimatedTypeTime;
      }
      if (sortBy === "time_desc") {
        return b.stats.estimatedTypeTime - a.stats.estimatedTypeTime;
      }
      return 0;
    });

    return result;
  }, [books, searchQuery, selectedDifficulty, sortBy]);

  const difficultyOptions = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header Section */}
      <div className="space-y-2 max-w-2xl">
        <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          The Public Domain Library
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
          Browse our curated selection of timeless literature. Select any masterpiece, choose your starting chapter, and read while training your keyboard proficiency.
        </p>
      </div>

      {/* Filter and Search controls bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-zinc-100/40 dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40">
        
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Search by title, author, description, or keyword tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-300 dark:focus:border-zinc-700 rounded-xl text-xs font-medium focus:outline-hidden transition-colors"
          />
        </div>

        {/* Filter & Sort Chips */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider hidden sm:inline">
              DIFFICULTY:
            </span>
            <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5">
              {difficultyOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedDifficulty(opt)}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    selectedDifficulty === opt
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Sort selection dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={12} className="text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 rounded-lg focus:outline-hidden cursor-pointer"
            >
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
              <option value="diff_easy">Difficulty (Easy first)</option>
              <option value="diff_hard">Difficulty (Hard first)</option>
              <option value="time_asc">Type Duration (Shortest)</option>
              <option value="time_desc">Type Duration (Longest)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Grid of cards */}
      {filteredAndSortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedBooks.map((book) => (
            <BookCard key={book.id} book={book} onSelect={onSelectBook} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 max-w-lg mx-auto">
          <BookOpen className="mx-auto text-zinc-300 dark:text-zinc-700 stroke-[1.5]" size={48} />
          <h3 className="text-lg font-serif font-bold text-zinc-800 dark:text-zinc-200 mt-4">
            No Masterpieces Found
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
            We couldn't find any books matching your search "{searchQuery}" or selected filters. Try clearing some keywords!
          </p>
          <button
            onClick={() => {
              onSearchChange("");
              setSelectedDifficulty("All");
              setSortBy("title_asc");
            }}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-95 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw size={12} />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}
