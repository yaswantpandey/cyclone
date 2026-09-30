import React from "react";
import { CycloneSystem } from "../types/cyclone";

interface NavbarProps {
  currentCyclone: CycloneSystem;
  scenarios: CycloneSystem[];
  onSelectScenario: (id: string) => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onOpenAiAssistant: () => void;
  onOpenCustomModal: () => void;
  onExportIAP: () => void;
  queuedRadioCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onRunGeminiAssessment: () => void;
  isAnalyzing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCyclone,
  scenarios,
  onSelectScenario,
  isOfflineMode,
  onToggleOfflineMode,
  onOpenAiAssistant,
  onOpenCustomModal,
  onExportIAP,
  queuedRadioCount,
  activeTab,
  onSelectTab,
  onRunGeminiAssessment,
  isAnalyzing,
}) => {
  const tabs = [
    { id: "geospatial", label: "Map & Town View", color: "text-sky-600 bg-sky-50 border-sky-300" },
    { id: "surge", label: "Sea & Waves", color: "text-blue-600 bg-blue-50 border-blue-300" },
    { id: "rainfall", label: "Rain & Rivers", color: "text-teal-600 bg-teal-50 border-teal-300" },
    { id: "infrastructure", label: "City Helpers", color: "text-emerald-600 bg-emerald-50 border-emerald-300" },
    { id: "parametric", label: "Help Fund", color: "text-amber-600 bg-amber-50 border-amber-300" },
    { id: "advisories", label: "Safety Guides", color: "text-indigo-600 bg-indigo-50 border-indigo-300" },
    { id: "offline-coordination", label: "Emergency Kit", color: "text-rose-600 bg-rose-50 border-rose-300" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Area */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            🌀
          </div>
          <div>
            <a href="/" className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 hover:text-sky-600 transition-colors">
              <span>CycloneWatch</span>
              <span className="text-xs bg-sky-100 text-sky-700 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
                Kids & Family Weather Explorer
              </span>
            </a>
            <div className="text-xs text-slate-500 hidden sm:block">
              Learn how storms work and discover how communities stay safe
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-white text-sky-700 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Storm Selector */}
          <div className="flex items-center bg-sky-50 border border-sky-200 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-sky-800 font-bold mr-1.5">Storm:</span>
            <select
              value={currentCyclone?.id || ""}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-transparent text-sky-950 font-bold focus:outline-none cursor-pointer"
            >
              {(scenarios || []).map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-800">
                  {s.name} ({s.maxWindSpeedKmph} km/h)
                </option>
              ))}
            </select>
          </div>

          {/* Countdown Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Landfall: in {currentCyclone.landfallEstimateHours} hours</span>
          </div>

          {/* Weather Lab / Simulator */}
          <button
            onClick={onOpenCustomModal}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            title="Design and test your own storm parameters"
          >
            <span>🧪</span>
            <span className="hidden md:inline">Storm Lab</span>
          </button>

          {/* AI Safety Check */}
          <button
            onClick={onRunGeminiAssessment}
            disabled={isAnalyzing}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <span>🛡️</span>
            <span>{isAnalyzing ? "Checking Safety..." : "Safety Check"}</span>
          </button>

          {/* Offline Mode Switch */}
          <button
            onClick={onToggleOfflineMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
              isOfflineMode
                ? "bg-rose-100 text-rose-800 border-rose-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            title="Switch to offline emergency mode"
          >
            <span>{isOfflineMode ? "📡 Offline Bag" : "📶 Live"}</span>
            {queuedRadioCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {queuedRadioCount}
              </span>
            )}
          </button>

          {/* Friendly Guide Chat */}
          <button
            onClick={onOpenAiAssistant}
            className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1"
            title="Ask our friendly storm guide questions"
          >
            <span>💬</span>
            <span className="hidden sm:inline">Ask Guide</span>
          </button>
        </div>
      </div>

      {/* Sub-nav for tablet/mobile */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
