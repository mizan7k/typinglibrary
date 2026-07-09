/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Moon, Monitor } from "lucide-react";
import { AppSettings } from "../types";

interface ThemeToggleProps {
  theme: AppSettings["theme"];
  onChange: (theme: AppSettings["theme"]) => void;
}

export default function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const options: { value: AppSettings["theme"]; icon: any; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center gap-0.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
            title={`${opt.label} Mode`}
            aria-label={`${opt.label} Mode`}
          >
            <Icon size={14} className="stroke-[2.5]" />
          </button>
        );
      })}
    </div>
  );
}
