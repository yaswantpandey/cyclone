import React from "react";
import { motion } from "motion/react";
import { CycloneSystem } from "../types/cyclone";
import MapRounded from "@mui/icons-material/MapRounded";
import ViewInArRounded from "@mui/icons-material/ViewInArRounded";
import WavesRounded from "@mui/icons-material/WavesRounded";
import WaterDropRounded from "@mui/icons-material/WaterDropRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import MonetizationOnRounded from "@mui/icons-material/MonetizationOnRounded";
import CampaignRounded from "@mui/icons-material/CampaignRounded";
import BackpackRounded from "@mui/icons-material/BackpackRounded";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import HealthAndSafetyRounded from "@mui/icons-material/HealthAndSafetyRounded";
import WifiOffRounded from "@mui/icons-material/WifiOffRounded";
import WifiRounded from "@mui/icons-material/WifiRounded";
import ChatBubbleOutlineRounded from "@mui/icons-material/ChatBubbleOutlineRounded";
import AirRounded from "@mui/icons-material/AirRounded";

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
  queuedRadioCount,
  activeTab,
  onSelectTab,
  onRunGeminiAssessment,
  isAnalyzing,
}) => {
  const tabs = [
    { id: "geospatial", label: "2D Map View", icon: <MapRounded fontSize="small" /> },
    { id: "3d-vortex", label: "3D Storm Lab", icon: <ViewInArRounded fontSize="small" />, highlight: true },
    { id: "surge", label: "Sea & Waves", icon: <WavesRounded fontSize="small" /> },
    { id: "rainfall", label: "Rain & Rivers", icon: <WaterDropRounded fontSize="small" /> },
    { id: "infrastructure", label: "City Helpers", icon: <ShieldRounded fontSize="small" /> },
    { id: "parametric", label: "Help Fund", icon: <MonetizationOnRounded fontSize="small" /> },
    { id: "advisories", label: "Safety Guides", icon: <CampaignRounded fontSize="small" /> },
    { id: "offline-coordination", label: "Emergency Kit", icon: <BackpackRounded fontSize="small" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Area */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md cursor-pointer"
          >
            🌀
          </motion.div>
          <div>
            <a href="/" className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5 hover:text-sky-600 transition-colors">
              <span>CycloneWatch</span>
              <span className="text-[10px] bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-800 font-extrabold px-2 py-0.5 rounded-full border border-sky-200 hidden sm:inline">
                Interactive Storm & Safety Lab
              </span>
            </a>
            <div className="text-[11px] text-slate-500 hidden md:block">
              Learn storm science with 3D WebGL vortex, river gauges & neighborhood protection
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden 2xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? "bg-white text-sky-700 shadow-sm border border-slate-200"
                    : tab.highlight
                    ? "text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 hover:text-indigo-900 font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <span className={isActive ? "text-sky-600" : tab.highlight ? "text-indigo-600" : "text-slate-400"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Storm Selector */}
          <div className="flex items-center bg-sky-50 border border-sky-200 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-sky-800 font-bold mr-1 flex items-center gap-0.5">
              <AirRounded fontSize="inherit" className="text-sky-600" />
              <span>Storm:</span>
            </span>
            <select
              value={currentCyclone?.id || ""}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-transparent text-sky-950 font-bold focus:outline-none cursor-pointer text-xs"
            >
              {(scenarios || []).map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-800">
                  {s.name} ({s.maxWindSpeedKmph} km/h)
                </option>
              ))}
            </select>
          </div>

          {/* Countdown Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Landfall: ~{currentCyclone.landfallEstimateHours}h</span>
          </div>

          {/* Weather Lab / Simulator */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCustomModal}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Design and test your own storm parameters"
          >
            <ScienceRounded fontSize="small" className="text-indigo-600" />
            <span className="hidden md:inline">Storm Lab</span>
          </motion.button>

          {/* AI Safety Check */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRunGeminiAssessment}
            disabled={isAnalyzing}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <HealthAndSafetyRounded fontSize="small" />
            <span className="hidden sm:inline">{isAnalyzing ? "Checking..." : "Safety Check"}</span>
          </motion.button>

          {/* Offline Mode Switch */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleOfflineMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              isOfflineMode
                ? "bg-rose-100 text-rose-800 border-rose-300 shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            title="Switch to offline emergency mode"
          >
            {isOfflineMode ? <WifiOffRounded fontSize="small" /> : <WifiRounded fontSize="small" />}
            <span className="hidden sm:inline">{isOfflineMode ? "Offline Kit" : "Live"}</span>
            {queuedRadioCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {queuedRadioCount}
              </span>
            )}
          </motion.button>

          {/* Friendly Guide Chat */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenAiAssistant}
            className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            title="Ask our friendly storm guide questions"
          >
            <ChatBubbleOutlineRounded fontSize="small" />
            <span className="hidden sm:inline">Ask Guide</span>
          </motion.button>
        </div>
      </div>

      {/* Sub-nav for tablet/mobile and screens under 2xl */}
      <div className="2xl:hidden flex items-center gap-1.5 px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-sky-600 text-white shadow-xs"
                  : tab.highlight
                  ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </header>
  );
};
