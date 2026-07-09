/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppSettings, GlobalStats } from "../types";
import { Settings, Type, Layout, RefreshCcw, Eye, ShieldAlert, Sparkles } from "lucide-react";
import { getGlobalStats } from "../lib/storage";

interface SettingsViewProps {
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
  onClearData: () => void;
}

export default function SettingsView({
  settings,
  onChangeSettings,
  onClearData,
}: SettingsViewProps) {
  const globalStats = getGlobalStats();

  const handleFontSizeChange = (size: AppSettings["fontSize"]) => {
    onChangeSettings({ ...settings, fontSize: size });
  };

  const handleFontFamilyChange = (family: AppSettings["fontFamily"]) => {
    onChangeSettings({ ...settings, fontFamily: family });
  };

  const toggleKeyboard = () => {
    onChangeSettings({ ...settings, showKeyboard: !settings.showKeyboard });
  };

  const toggleBlindMode = () => {
    onChangeSettings({ ...settings, blindMode: !settings.blindMode });
  };

  // Font size name labels
  const sizeLabels = {
    sm: "Small (14px)",
    base: "Standard (16px)",
    lg: "Large (20px)",
    xl: "Extra Large (24px)",
  };

  const fontStyleClasses = {
    serif: "font-serif",
    sans: "font-sans",
    mono: "font-mono",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Settings Heading */}
      <div className="space-y-1.5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Settings size={22} className="text-zinc-400" />
          <span>Practice Preferences</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
          Tailor your reading and typing workspace. All choices are saved immediately to local storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main preference adjustments */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Typography adjust */}
          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl space-y-4 shadow-2xs">
            <h3 className="text-sm font-serif font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <Type size={16} className="text-zinc-400" />
              <span>Typography Settings</span>
            </h3>

            {/* Font Family selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">
                FONT FAMILY
              </label>
              <div className="grid grid-cols-3 gap-2 bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl">
                {(["serif", "sans", "mono"] as const).map((fam) => (
                  <button
                    key={fam}
                    onClick={() => handleFontFamilyChange(fam)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                      settings.fontFamily === fam
                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">
                FONT SIZE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["sm", "base", "lg", "xl"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      settings.fontSize === size
                        ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ergonomic & Accessibility Aids */}
          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl space-y-4 shadow-2xs">
            <h3 className="text-sm font-serif font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <Layout size={16} className="text-zinc-400" />
              <span>Workspace Helpers</span>
            </h3>

            {/* Virtual Keyboard Toggle */}
            <div className="flex items-center justify-between py-1.5">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Virtual Keyboard Guide
                </span>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Displays an ergonomic QWERTY guide highlighting targeted keys.
                </p>
              </div>
              <button
                onClick={toggleKeyboard}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.showKeyboard ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-800"
                }`}
                aria-label="Toggle keyboard helper"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white dark:bg-zinc-950 absolute top-0.75 left-0.75 transition-transform ${
                    settings.showKeyboard ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* Blind Mode toggle */}
            <div className="flex items-center justify-between py-1.5 border-t border-zinc-50 dark:border-zinc-800/40">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Blind Correction Mode
                </span>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Mutes mistake highlighting. Useful for pure touch-typing focus.
                </p>
              </div>
              <button
                onClick={toggleBlindMode}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.blindMode ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-800"
                }`}
                aria-label="Toggle blind mode"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white dark:bg-zinc-950 absolute top-0.75 left-0.75 transition-transform ${
                    settings.blindMode ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset Danger Zone */}
          <div className="p-5 bg-rose-50/40 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-950/20 rounded-2xl space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="text-rose-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wide">
                  Danger Zone
                </h4>
                <p className="text-[11px] text-rose-600 dark:text-rose-400/80 mt-0.5">
                  Resetting deletes all local statistics, completed chapters, and bookmarks permanently. This action is irreversible.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm("Are you absolutely sure you want to clear all your saved books progress and cumulative stats? This cannot be undone.")) {
                  onClearData();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <RefreshCcw size={12} />
              <span>Reset Saved Progress & Statistics</span>
            </button>
          </div>

        </div>

        {/* Live Workspace Preview */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <Eye size={12} />
            <span>Workspace Preview</span>
          </h3>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xs space-y-3">
            <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">
              {sizeLabels[settings.fontSize]}
            </span>
            
            <div className={`p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900 text-center ${fontStyleClasses[settings.fontFamily]}`}>
              <p className={`text-zinc-800 dark:text-zinc-200 leading-relaxed ${
                settings.fontSize === "sm" ? "text-sm" : 
                settings.fontSize === "base" ? "text-base" :
                settings.fontSize === "lg" ? "text-lg" : "text-xl"
              }`}>
                It is a truth <span className="text-zinc-400 line-through decoration-rose-400 decoration-2">universly</span> <span className="text-amber-500 underline font-bold bg-amber-50/50 dark:bg-amber-950/20">acknowledged</span>, that a single man...
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
              <Sparkles size={11} className="text-amber-500" />
              <span>Caret highlights style</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
