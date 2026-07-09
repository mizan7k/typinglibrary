/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Library as LibraryIcon, Sparkles, Settings as SettingsIcon, Search } from "lucide-react";
import { AppSettings } from "../types";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  activeTab: "home" | "library" | "settings";
  onChangeTab: (tab: "home" | "library" | "settings") => void;
  theme: AppSettings["theme"];
  onChangeTheme: (theme: AppSettings["theme"]) => void;
  onSearchFocus?: () => void;
}

export default function Navbar({
  activeTab,
  onChangeTab,
  theme,
  onChangeTheme,
  onSearchFocus,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => onChangeTab("home")}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 transition-transform group-hover:scale-105 duration-200">
            <BookOpen size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
              Typing Library
            </h1>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold mt-1 tracking-[0.16em] uppercase font-mono leading-none">
              Read & Type Classics
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/60 dark:bg-zinc-900/40 p-1 rounded-full border border-zinc-200/40 dark:border-zinc-800/40">
          <button
            onClick={() => onChangeTab("home")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onChangeTab("library")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === "library"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Browse Books
          </button>
          <button
            onClick={() => onChangeTab("settings")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Preferences
          </button>
        </nav>

        {/* Theme Selector Only */}
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onChange={onChangeTheme} />
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex border-t border-zinc-100 dark:border-zinc-900 bg-white/90 dark:bg-zinc-950/90 py-1.5 px-4 justify-around">
        <button
          onClick={() => onChangeTab("home")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all cursor-pointer ${
            activeTab === "home" ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"
          }`}
        >
          <Sparkles size={16} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => onChangeTab("library")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all cursor-pointer ${
            activeTab === "library" ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"
          }`}
        >
          <LibraryIcon size={16} />
          <span>Library</span>
        </button>
        <button
          onClick={() => onChangeTab("settings")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all cursor-pointer ${
            activeTab === "settings" ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"
          }`}
        >
          <SettingsIcon size={16} />
          <span>Preferences</span>
        </button>
      </div>
    </header>
  );
}
