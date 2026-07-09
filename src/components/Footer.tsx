/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Award, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-zinc-500 dark:text-zinc-400">
        
        {/* About column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900">
              <BookOpen size={12} className="stroke-[2.5]" />
            </div>
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 font-sans">
              Typing Library
            </span>
          </div>
          <p className="text-xs leading-relaxed max-w-sm">
            A premium visual space combining the joy of timeless public domain literature with active motor typing practice. Build muscle memory and reading pacing simultaneously.
          </p>
        </div>

        {/* Sources/Credit column */}
        <div className="space-y-3">
          <h4 className="font-medium text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
            Source & Curation
          </h4>
          <p className="text-xs leading-relaxed max-w-sm">
            All text selections are derived from timeless, public-domain books provided by <strong>Project Gutenberg</strong>. Chapter transcriptions are lightly formatted to optimize the core typing experience.
          </p>
        </div>

        {/* Badges/Features column */}
        <div className="space-y-3">
          <h4 className="font-medium text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
            Integrity Safeguards
          </h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
              <Award size={14} className="text-zinc-400" />
              <span>Offline First — Data stored locally</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
              <CheckCircle size={14} className="text-zinc-400" />
              <span>No Accounts required — Ready to type</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">
          &copy; {new Date().getFullYear()} TYPING LIBRARY. ALL CLASSIC BOOK CONTENTS ARE IN THE PUBLIC DOMAIN.
        </p>
        <div className="flex gap-4 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">
          <span className="hover:text-zinc-600 dark:hover:text-zinc-300">PRIVACY FRIENDLY</span>
          <span>&middot;</span>
          <span className="hover:text-zinc-600 dark:hover:text-zinc-300">ACCESSIBILITY COMPLIANT</span>
        </div>
      </div>
    </footer>
  );
}
