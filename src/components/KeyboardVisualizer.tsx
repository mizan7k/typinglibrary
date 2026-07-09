/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";

interface KeyboardProps {
  nextChar: string; // The character the user needs to type next
}

export default function KeyboardVisualizer({ nextChar }: KeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key.toLowerCase();
      if (e.key === " ") key = "space";
      setPressedKey(key);
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Standard QWERTY layout
  const rows = [
    [
      { label: "Q", key: "q" },
      { label: "W", key: "w" },
      { label: "E", key: "e" },
      { label: "R", key: "r" },
      { label: "T", key: "t" },
      { label: "Y", key: "y" },
      { label: "U", key: "u" },
      { label: "I", key: "i" },
      { label: "O", key: "o" },
      { label: "P", key: "p" },
    ],
    [
      { label: "A", key: "a" },
      { label: "S", key: "s" },
      { label: "D", key: "d" },
      { label: "F", key: "f" },
      { label: "G", key: "g" },
      { label: "H", key: "h" },
      { label: "J", key: "j" },
      { label: "K", key: "k" },
      { label: "L", key: "l" },
      { label: ";", key: ";" },
    ],
    [
      { label: "Z", key: "z" },
      { label: "X", key: "x" },
      { label: "C", key: "c" },
      { label: "V", key: "v" },
      { label: "B", key: "b" },
      { label: "N", key: "n" },
      { label: "M", key: "m" },
      { label: ",", key: "," },
      { label: ".", key: "." },
      { label: "?", key: "/" },
    ],
  ];

  // Helper to check if a key matches the next character to be typed
  const isTargetKey = (key: string) => {
    if (!nextChar) return false;
    let target = nextChar.toLowerCase();
    
    // Normalize punctuation
    if (target === " ") return key === "space";
    if (target === "\n") return key === "enter";
    if (target === '"' || target === "'") return key === "'";
    if (target === ":" || target === ";") return key === ";";
    if (target === "<" || target === ",") return key === ",";
    if (target === ">" || target === ".") return key === ".";
    if (target === "?" || target === "/") return key === "/";
    
    return target === key;
  };

  const isPressedKey = (key: string) => {
    return pressedKey === key;
  };

  return (
    <div className="hidden sm:flex flex-col gap-1.5 p-3 bg-zinc-100/80 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 max-w-2xl mx-auto shadow-sm">
      {/* 3 standard letter rows */}
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex justify-center gap-1.5"
          style={{ paddingLeft: `${rowIdx * 12}px` }}
        >
          {row.map((k) => {
            const isTarget = isTargetKey(k.key);
            const isPressed = isPressedKey(k.key);
            return (
              <div
                key={k.key}
                className={`w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all duration-100 ${
                  isPressed
                    ? "bg-zinc-950 text-white border-zinc-950 scale-95 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                    : isTarget
                    ? "bg-amber-500 border-amber-500 text-white shadow-md animate-pulse scale-102"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 shadow-2xs"
                }`}
              >
                {k.label}
              </div>
            );
          })}
        </div>
      ))}

      {/* Control row (Space & Enter) */}
      <div className="flex justify-center gap-1.5 mt-1">
        {/* Space key */}
        <div
          className={`w-56 sm:w-64 h-9 sm:h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all duration-100 ${
            isPressedKey("space")
              ? "bg-zinc-950 text-white border-zinc-950 scale-95 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
              : isTargetKey("space")
              ? "bg-amber-500 border-amber-500 text-white shadow-md animate-pulse"
              : "bg-white text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 shadow-2xs"
          }`}
        >
          SPACE
        </div>

        {/* Enter key (shown as a helper if next char is a newline) */}
        {nextChar === "\n" && (
          <div className="w-14 sm:w-16 h-9 sm:h-10 rounded-lg bg-amber-500 border-amber-500 text-white flex items-center justify-center text-[10px] font-mono font-bold shadow-md animate-pulse">
            ENTER ↵
          </div>
        )}
      </div>
    </div>
  );
}
