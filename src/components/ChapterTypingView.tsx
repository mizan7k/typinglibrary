/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Book, Chapter, TypingSessionStats, AppSettings } from "../types";
import { Play, Pause, RotateCcw, ArrowLeft, Keyboard, HelpCircle, Eye } from "lucide-react";
import KeyboardVisualizer from "./KeyboardVisualizer";

interface ChapterTypingViewProps {
  book: Book;
  chapter: Chapter;
  onBack: () => void;
  onComplete: (stats: TypingSessionStats) => void;
  settings: AppSettings;
}

export default function ChapterTypingView({
  book,
  chapter,
  onBack,
  onComplete,
  settings,
}: ChapterTypingViewProps) {
  const text = chapter.content;

  // Typing states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedStates, setTypedStates] = useState<(boolean | null)[]>(new Array(text.length).fill(null));
  const [mistakes, setMistakes] = useState<Record<number, boolean>>({}); // track which indices were missed
  const [mistakesCount, setMistakesCount] = useState(0);
  
  // Timing states
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Focus and layout
  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Re-focus hidden textarea when clicked
  const forceFocus = () => {
    if (inputRef.current && !isPaused && !isCompleted) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Focus on mount
  useEffect(() => {
    forceFocus();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isCompleted]);

  // Handle auto-scroll to keep active character in view
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const activeEl = activeCharRef.current;
      const containerEl = containerRef.current;
      
      const containerHeight = containerEl.clientHeight;
      const activeTop = activeEl.offsetTop;
      const activeHeight = activeEl.clientHeight;
      
      // Calculate scroll position to keep active element centered
      const targetScrollTop = activeTop - containerHeight / 2 + activeHeight / 2;
      
      containerEl.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  // Live Timer Effect
  useEffect(() => {
    if (startTime !== null && !isPaused && !isCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isPaused, isCompleted]);

  // Calculate live statistics
  const timeInMins = elapsedTime > 0 ? elapsedTime / 60 : 0;
  // Standard typing word is 5 characters
  const wordsTyped = currentIndex / 5;
  const liveWpm = timeInMins > 0 ? Math.round(wordsTyped / timeInMins) : 0;
  
  // Accuracy = (total typed - incorrect keys) / total typed
  const liveAccuracy = currentIndex > 0 
    ? Math.round(((currentIndex - mistakesCount) / currentIndex) * 100) 
    : 100;

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isPaused || isCompleted || val.length === 0) return;

    // Start timer on first character typed
    if (startTime === null) {
      setStartTime(Date.now());
    }

    const typedChar = val[val.length - 1];
    const targetChar = text[currentIndex];

    // Check if correct
    const isCorrect = typedChar === targetChar;

    const newTypedStates = [...typedStates];
    newTypedStates[currentIndex] = isCorrect;
    setTypedStates(newTypedStates);

    if (!isCorrect) {
      // Record mistake once for this index
      if (!mistakes[currentIndex]) {
        setMistakes((prev) => ({ ...prev, [currentIndex]: true }));
        setMistakesCount((prev) => prev + 1);
      }
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // Reset input textarea value so it doesn't grow infinitely
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Check if completed
    if (nextIndex >= text.length) {
      setIsCompleted(true);
      const finalStats: TypingSessionStats = {
        wpm: liveWpm || 30, // fallback
        accuracy: liveAccuracy,
        mistakes: mistakesCount + (!isCorrect ? 1 : 0),
        elapsedTime: Math.max(1, elapsedTime),
        completedChars: text.length,
        totalChars: text.length,
        wordsTyped: Math.round(text.length / 5),
        currentStreak: 1, // handled in storage
        bestWpm: liveWpm,
      };
      onComplete(finalStats);
    }
  };

  // Handle special keys like backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPaused || isCompleted) return;

    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        
        const newTypedStates = [...typedStates];
        newTypedStates[prevIndex] = null;
        setTypedStates(newTypedStates);
      }
    }
  };

  // Reset the current chapter
  const handleRestart = () => {
    setCurrentIndex(0);
    setTypedStates(new Array(text.length).fill(null));
    setMistakes({});
    setMistakesCount(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsPaused(false);
    setIsCompleted(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setTimeout(() => forceFocus(), 50);
  };

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
    if (isPaused) {
      setTimeout(() => forceFocus(), 50);
    }
  };

  // Keyboard shortcut listeners (e.g. Esc to pause, Ctrl+R or Tab to restart)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handlePauseToggle();
      }
    };

    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, [isPaused, isCompleted]);

  // Adjust font size styling
  const fontSizeClasses = {
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl md:text-2xl",
    xl: "text-xl sm:text-2xl md:text-3xl",
  };

  const fontStyleClasses = {
    serif: "font-serif leading-relaxed sm:leading-loose tracking-wide",
    sans: "font-sans leading-relaxed tracking-normal",
    mono: "font-mono leading-relaxed text-sm tracking-tight",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 space-y-4">
      
      {/* Header controls & book metadata */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>BACK TO BOOK</span>
        </button>

        <div className="text-right sm:text-right">
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
            {book.title} &middot; {book.author}
          </span>
          <h2 className="text-base font-serif font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">
            {chapter.title}
          </h2>
        </div>
      </div>

      {/* Live stats banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-100/50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
        <div className="text-center p-1.5 rounded-lg bg-white dark:bg-zinc-900 shadow-2xs">
          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Speed</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-zinc-800 dark:text-zinc-100">
            {liveWpm} <span className="text-[10px] font-normal text-zinc-400">WPM</span>
          </div>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-white dark:bg-zinc-900 shadow-2xs">
          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Accuracy</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-zinc-800 dark:text-zinc-100">
            {liveAccuracy}<span className="text-[10px] font-normal text-zinc-400">%</span>
          </div>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-white dark:bg-zinc-900 shadow-2xs">
          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Mistakes</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-zinc-800 dark:text-zinc-100">
            {mistakesCount}
          </div>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-white dark:bg-zinc-900 shadow-2xs">
          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">Time</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-zinc-800 dark:text-zinc-100">
            {Math.floor(elapsedTime / 60)}:
            {String(elapsedTime % 60).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Typing Workspace */}
      <div
        onClick={forceFocus}
        className={`relative rounded-2xl border transition-all duration-300 p-4 sm:p-6 md:p-8 ${
          isFocused 
            ? "bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 shadow-md" 
            : "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/60 dark:border-zinc-800 shadow-inner"
        } cursor-text`}
      >
        
        {/* Hidden Input Textarea to capture typing securely */}
        <textarea
          ref={inputRef}
          value=""
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none z-0 resize-none"
          disabled={isPaused || isCompleted}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {/* Unfocused click invitation */}
        {!isFocused && !isPaused && !isCompleted && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-lg text-[9px] font-mono font-semibold border border-amber-200/50 dark:border-amber-900/20 animate-pulse z-10">
            <Eye size={11} />
            <span>CLICK TO FOCUS & TYPE</span>
          </div>
        )}

        {/* Typing container with vertical scroll */}
        <div
          ref={containerRef}
          className="max-h-48 overflow-y-auto pr-2 relative z-10 scrollbar-none"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className={`${fontSizeClasses[settings.fontSize]} ${fontStyleClasses[settings.fontFamily]}`}>
            {text.split("").map((char, index) => {
              const isTyped = index < currentIndex;
              const isCorrect = typedStates[index];
              const isActive = index === currentIndex;

              let charClass = "transition-all duration-150 ";
              if (isActive) {
                charClass += "text-amber-600 dark:text-amber-400 font-bold underline decoration-amber-500 bg-amber-100/40 dark:bg-amber-950/20";
              } else if (isTyped) {
                if (isCorrect) {
                  charClass += "text-zinc-400 dark:text-zinc-600";
                } else {
                  charClass += "text-rose-600 dark:text-rose-400 font-semibold underline decoration-rose-400 bg-rose-50 dark:bg-rose-950/20";
                }
              } else {
                charClass += "text-zinc-800 dark:text-zinc-200";
              }

              return (
                <span
                  key={index}
                  ref={isActive ? activeCharRef : null}
                  className={charClass}
                >
                  {/* Visual newline replacement */}
                  {char === "\n" ? (
                    <span className="inline-block w-full h-1">
                      <span className="text-zinc-300 dark:text-zinc-700 font-mono text-xs select-none">↵</span>
                    </span>
                  ) : (
                    char
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-white/90 dark:bg-zinc-950/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center space-y-3 z-20">
            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Practice Paused
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Press Escape or click Resume to continue reading.
              </p>
            </div>
            <button
              onClick={handlePauseToggle}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm"
            >
              <Play size={12} className="fill-current" />
              <span>Resume Typing</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Actions & Help shortcuts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePauseToggle}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer transition-all"
            title="Esc shortcut"
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer transition-all"
          >
            <RotateCcw size={13} />
            <span>Restart Chapter</span>
          </button>
        </div>

        {/* Short inline guide */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
          <div className="flex items-center gap-1">
            <HelpCircle size={12} />
            <span>ESC to pause</span>
          </div>
          <div>
            <span>Progress: {Math.round((currentIndex / text.length) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Ergonomic Keyboard Helper */}
      {settings.showKeyboard && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5 max-w-2xl mx-auto px-2">
            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Keyboard size={12} />
              <span>Ergonomic Guide</span>
            </span>
            <span className="text-[9px] font-mono text-zinc-400">
              Target Key: <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-bold">{currentIndex < text.length ? (text[currentIndex] === " " ? "SPACE" : text[currentIndex] === "\n" ? "ENTER" : text[currentIndex]) : "COMPLETE"}</span>
            </span>
          </div>
          <KeyboardVisualizer nextChar={currentIndex < text.length ? text[currentIndex] : ""} />
        </div>
      )}
    </div>
  );
}
