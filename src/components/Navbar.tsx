import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import AppsRounded from "@mui/icons-material/AppsRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";

interface NavbarProps {
  currentCyclone: CycloneSystem;
  scenarios: CycloneSystem[];
  onSelectScenario: (id: string) => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onOpenAiAssistant: () => void;
  onOpenCustomModal: () => void;
  onExportIAP: () => void;
  queuedRadioCount?: number;
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
  queuedRadioCount = 0,
  activeTab,
  onSelectTab,
  onRunGeminiAssessment,
  isAnalyzing,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "geospatial", label: "2D Map View", shortLabel: "Map", icon: <MapRounded fontSize="small" />, desc: "Satellite track, radar cone & shelters" },
    { id: "3d-vortex", label: "3D Storm Lab", shortLabel: "3D Lab", icon: <ViewInArRounded fontSize="small" />, highlight: true, desc: "14,000-particle Rankine vortex & eye calm" },
    { id: "surge", label: "Sea & Waves", shortLabel: "Waves", icon: <WavesRounded fontSize="small" />, desc: "Wave heights & coastal inundation depth" },
    { id: "rainfall", label: "Rain & Rivers", shortLabel: "Rain", icon: <WaterDropRounded fontSize="small" />, desc: "24h rainfall & flash flood basin alerts" },
    { id: "infrastructure", label: "City Helpers", shortLabel: "City", icon: <ShieldRounded fontSize="small" />, desc: "Hospitals, power grid & emergency bases" },
    { id: "parametric", label: "Help Fund", shortLabel: "Fund", icon: <MonetizationOnRounded fontSize="small" />, desc: "Instant parametric payouts & recovery" },
    { id: "advisories", label: "Safety Guides", shortLabel: "Guides", icon: <CampaignRounded fontSize="small" />, desc: "Civil defense evacuation & siren alerts" },
    { id: "offline-coordination", label: "Emergency Kit", shortLabel: "Go-Bag", icon: <BackpackRounded fontSize="small" />, desc: "Interactive packing, rations & VHF radio" },
  ];

  // Mobile Bottom App Bar items (primary quick-access buttons)
  const mobilePrimaryTabs = [
    { id: "geospatial", label: "Map", icon: <MapRounded /> },
    { id: "3d-vortex", label: "3D Lab", icon: <ViewInArRounded />, badge: "3D" },
    { id: "offline-coordination", label: "Go-Bag", icon: <BackpackRounded />, badge: isOfflineMode ? "OFF" : queuedRadioCount > 0 ? String(queuedRadioCount) : undefined },
    { id: "advisories", label: "Guides", icon: <CampaignRounded /> },
  ];

  // Is active tab one of the secondary tabs in the "More" menu?
  const isMoreTabActive = !mobilePrimaryTabs.some((t) => t.id === activeTab);

  const handleSelectTabFromMobile = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs touch-manipulation">
        {/* Top Main Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => onSelectTab("geospatial")}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-md cursor-pointer shrink-0"
              title="CycloneWatch Home"
            >
              🌀
            </motion.div>
            <div>
              <div
                onClick={() => onSelectTab("geospatial")}
                className="text-sm sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5 cursor-pointer hover:text-sky-600 transition-colors"
              >
                <span>CycloneWatch</span>
                <span className="text-[10px] bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-800 font-extrabold px-1.5 py-0.5 rounded-full border border-sky-200 hidden md:inline">
                  Storm & Safety Lab
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 hidden lg:block leading-tight">
                3D WebGL vortex, flood forecasting & child-friendly safety actions
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Visible on lg and larger screens) */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
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

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Active Storm Selector Dropdown */}
            <div className="flex items-center bg-sky-50 border border-sky-200 rounded-xl px-2 py-1 text-xs max-w-[130px] sm:max-w-[170px] md:max-w-none shadow-xs">
              <span className="text-sky-800 font-bold mr-1 hidden sm:flex items-center gap-0.5">
                <AirRounded fontSize="inherit" className="text-sky-600" />
                <span>Storm:</span>
              </span>
              <select
                value={currentCyclone?.id || ""}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="bg-transparent text-sky-950 font-bold focus:outline-none cursor-pointer text-xs truncate w-full"
                title="Select cyclonic system to inspect"
              >
                {(scenarios || []).map((s) => (
                  <option key={s.id} value={s.id} className="bg-white text-slate-800">
                    {s.name} ({s.maxWindSpeedKmph} km/h)
                  </option>
                ))}
              </select>
            </div>

            {/* Weather Lab / Custom Simulator Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenCustomModal}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              title="Design and test your own storm parameters"
            >
              <ScienceRounded fontSize="small" className="text-indigo-600" />
              <span className="hidden sm:inline">Storm Lab</span>
            </motion.button>

            {/* AI Safety Assessment Check */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onRunGeminiAssessment}
              disabled={isAnalyzing}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1"
              title="Run AI Community Safety Analysis"
            >
              <HealthAndSafetyRounded fontSize="small" />
              <span className="hidden md:inline">{isAnalyzing ? "Checking..." : "Safety Check"}</span>
            </motion.button>

            {/* Offline Mode Switch */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onToggleOfflineMode}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                isOfflineMode
                  ? "bg-rose-100 text-rose-800 border-rose-300 shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
              }`}
              title="Toggle offline emergency kit mode"
            >
              {isOfflineMode ? <WifiOffRounded fontSize="small" /> : <WifiRounded fontSize="small" />}
              <span className="hidden md:inline">{isOfflineMode ? "Offline Kit" : "Live"}</span>
              {queuedRadioCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1 rounded-full font-black">
                  {queuedRadioCount}
                </span>
              )}
            </motion.button>

            {/* Friendly Guide Chat (Desktop Header Button) */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenAiAssistant}
              className="hidden sm:flex px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm items-center gap-1.5"
              title="Ask our friendly storm guide questions"
            >
              <ChatBubbleOutlineRounded fontSize="small" />
              <span>Ask Guide</span>
            </motion.button>
          </div>
        </div>

        {/* Medium-Screen Horizontal Sub-nav Bar (Tablets only; hidden on mobile phones & large desktop) */}
        <div className="hidden md:flex xl:hidden items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar touch-pan-x">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[34px] ${
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

      {/* 📱 NATIVE-STYLE MOBILE BOTTOM NAVIGATION BAR (Phones: < 768px) */}
      <nav
        aria-label="Mobile Bottom App Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-2 safe-area-bottom flex items-center justify-between"
      >
        {mobilePrimaryTabs.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelectTabFromMobile(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all touch-manipulation cursor-pointer relative ${
                isActive
                  ? "text-sky-600 font-black"
                  : "text-slate-500 hover:text-slate-800 font-semibold"
              }`}
            >
              {/* Active Highlight Pill */}
              <div
                className={`relative px-3.5 py-1 rounded-full transition-all flex items-center justify-center ${
                  isActive
                    ? "bg-sky-100 text-sky-700 shadow-xs"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {item.icon}
                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.2 rounded-full leading-tight shadow-xs ${
                      item.badge === "OFF"
                        ? "bg-rose-500 text-white"
                        : item.badge === "3D"
                        ? "bg-indigo-600 text-white"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 leading-tight ${isActive ? "text-sky-700 font-extrabold" : "text-slate-500"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-0.5"
                />
              )}
            </motion.button>
          );
        })}

        {/* 5th Mobile Tab: "More / All Tools" Drawer Trigger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all touch-manipulation cursor-pointer relative ${
            isMoreTabActive || isMobileMenuOpen
              ? "text-sky-600 font-black"
              : "text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <div
            className={`relative px-3.5 py-1 rounded-full transition-all flex items-center justify-center ${
              isMoreTabActive || isMobileMenuOpen
                ? "bg-sky-100 text-sky-700 shadow-xs"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <AppsRounded />
            {isMoreTabActive && !isMobileMenuOpen && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 leading-tight ${isMoreTabActive ? "text-sky-700 font-extrabold" : "text-slate-500"}`}>
            {isMoreTabActive ? "More •" : "More"}
          </span>
          {isMoreTabActive && (
            <motion.div
              layoutId="activeTabIndicator"
              className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-0.5"
            />
          )}
        </motion.button>
      </nav>

      {/* 📱 NATIVE-STYLE MOBILE BOTTOM DRAWER / SHEET FOR "MORE" TOOLS */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Bottom Sheet Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-h-[85vh] bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-4 pb-8 flex flex-col safe-area-bottom overflow-y-auto z-10"
            >
              {/* Drag Pill Handle */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                    🌀
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-tight">All CycloneWatch Modules</h3>
                    <p className="text-[11px] text-slate-500">Tap to jump directly to any weather station view</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <CloseRounded fontSize="small" />
                </button>
              </div>

              {/* Grid of All Features */}
              <div className="grid grid-cols-1 gap-2.5">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTabFromMobile(tab.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? "bg-sky-50/90 border-sky-300 shadow-xs"
                          : "bg-slate-50/80 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isActive
                              ? "bg-sky-500 text-white shadow-xs"
                              : tab.highlight
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-white text-slate-600 border border-slate-200"
                          }`}
                        >
                          {tab.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900">{tab.label}</span>
                            {isActive && (
                              <span className="text-[9px] bg-sky-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                                Active
                              </span>
                            )}
                            {tab.highlight && !isActive && (
                              <span className="text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.2 rounded-full border border-indigo-200">
                                3D Lab
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{tab.desc}</p>
                        </div>
                      </div>
                      <ChevronRightRounded fontSize="small" className={isActive ? "text-sky-600" : "text-slate-400"} />
                    </motion.button>
                  );
                })}
              </div>

              {/* Quick Actions Footer inside Drawer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAiAssistant();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <ChatBubbleOutlineRounded fontSize="small" />
                  <span>Ask AI Assistant</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCustomModal();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                >
                  <ScienceRounded fontSize="small" />
                  <span>Custom Lab</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
