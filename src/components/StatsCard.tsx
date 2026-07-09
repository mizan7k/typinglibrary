/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: "default" | "brand";
}

export default function StatsCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "default",
}: StatsCardProps) {
  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
      variant === "brand"
        ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950"
        : "bg-white border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
            variant === "brand"
              ? "text-zinc-400 dark:text-zinc-500"
              : "text-zinc-400 dark:text-zinc-500"
          }`}>
            {label}
          </span>
          <p className="text-3xl font-bold font-mono tracking-tight mt-1.5">
            {value}
          </p>
          {subtext && (
            <p className={`text-[11px] mt-1.5 ${
              variant === "brand"
                ? "text-zinc-300 dark:text-zinc-600"
                : "text-zinc-500 dark:text-zinc-400"
            }`}>
              {subtext}
            </p>
          )}
        </div>
        
        <div className={`p-2 rounded-xl ${
          variant === "brand"
            ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-zinc-50 text-zinc-400 dark:bg-zinc-950 dark:text-zinc-600"
        }`}>
          <Icon size={16} className="stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
}
