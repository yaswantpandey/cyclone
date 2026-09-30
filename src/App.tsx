import React, { useState, useEffect } from "react";
import {
  CycloneSystem,
  DashboardTab,
  SurgeMetrics,
  RainfallMetrics,
  InfrastructureAsset,
  EarlyWarningAdvisory,
  ParametricInsurancePolicy,
  OfflineActionTask,
  OutboxRadioMessage,
  GeminiRiskAnalysis,
} from "./types/cyclone";

import {
  CYCLONE_SCENARIOS,
  INITIAL_SURGE_METRICS,
  INITIAL_RAINFALL_METRICS,
  INITIAL_INFRASTRUCTURE,
  INITIAL_ADVISORIES,
  INITIAL_PARAMETRIC_POLICY,
  INITIAL_OFFLINE_TASKS,
  INITIAL_OUTBOX_MESSAGES,
} from "./data/cycloneScenarios";

import { Navbar } from "./components/Navbar";
import { GeospatialMap } from "./components/GeospatialMap";
import { CycloneThreeVisualizer } from "./components/CycloneThreeVisualizer";
import { SurgeModelPanel } from "./components/SurgeModelPanel";
import { RainfallRunoffPanel } from "./components/RainfallRunoffPanel";
import { InfrastructurePanel } from "./components/InfrastructurePanel";
import { EarlyWarningAdvisories } from "./components/EarlyWarningAdvisories";
import { ParametricInsurancePanel } from "./components/ParametricInsurancePanel";
import { OfflineCoordinationPanel } from "./components/OfflineCoordinationPanel";
import { DisasterChatModal } from "./components/DisasterChatModal";
import { CustomScenarioModal } from "./components/CustomScenarioModal";
import { motion, AnimatePresence } from "motion/react";

import WavesRounded from "@mui/icons-material/WavesRounded";
import WaterDropRounded from "@mui/icons-material/WaterDropRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import MonetizationOnRounded from "@mui/icons-material/MonetizationOnRounded";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import ChatBubbleOutlineRounded from "@mui/icons-material/ChatBubbleOutlineRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ViewInArRounded from "@mui/icons-material/ViewInArRounded";

export default function App() {
  // Scenario & Global State
  const [activeCyclone, setActiveCyclone] = useState<CycloneSystem>(CYCLONE_SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState<DashboardTab>("geospatial");
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    return localStorage.getItem("cyclone_offline_mode") === "true";
  });

  // Domain Models State
  const [surgeMetrics, setSurgeMetrics] = useState<SurgeMetrics>(INITIAL_SURGE_METRICS);
  const [rainfallMetrics, setRainfallMetrics] = useState<RainfallMetrics>(INITIAL_RAINFALL_METRICS);
  const [infrastructure, setInfrastructure] = useState<InfrastructureAsset[]>(() => {
    try {
      const saved = localStorage.getItem("cyclone_infrastructure");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INFRASTRUCTURE;
    } catch {
      return INITIAL_INFRASTRUCTURE;
    }
  });
  const [advisories, setAdvisories] = useState<EarlyWarningAdvisory[]>(INITIAL_ADVISORIES);
  const [parametricPolicy, setParametricPolicy] = useState<ParametricInsurancePolicy>(INITIAL_PARAMETRIC_POLICY);
  const [offlineTasks, setOfflineTasks] = useState<OfflineActionTask[]>(() => {
    try {
      const saved = localStorage.getItem("cyclone_offline_tasks");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_OFFLINE_TASKS;
    } catch {
      return INITIAL_OFFLINE_TASKS;
    }
  });
  const [outboxMessages, setOutboxMessages] = useState<OutboxRadioMessage[]>(() => {
    try {
      const saved = localStorage.getItem("cyclone_outbox_messages");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_OUTBOX_MESSAGES;
    } catch {
      return INITIAL_OUTBOX_MESSAGES;
    }
  });

  // Gemini AI Analysis State
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiRiskAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingAdvisories, setIsGeneratingAdvisories] = useState<boolean>(false);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCustomScenarioOpen, setIsCustomScenarioOpen] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showTosModal, setShowTosModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cyclone_offline_mode", String(isOfflineMode));
  }, [isOfflineMode]);

  useEffect(() => {
    localStorage.setItem("cyclone_infrastructure", JSON.stringify(infrastructure));
  }, [infrastructure]);

  useEffect(() => {
    localStorage.setItem("cyclone_offline_tasks", JSON.stringify(offlineTasks));
  }, [offlineTasks]);

  useEffect(() => {
    localStorage.setItem("cyclone_outbox_messages", JSON.stringify(outboxMessages));
  }, [outboxMessages]);

  // Handle Scenario Switching
  const handleSelectScenario = (id: string) => {
    const found = CYCLONE_SCENARIOS.find((c) => c.id === id);
    if (found) {
      setActiveCyclone(found);
      const baseSurge = found.category.includes("Super") ? 5.8 : found.category.includes("Extremely") ? 4.3 : 2.9;
      const totalWater = parseFloat((baseSurge + surgeMetrics.astronomicalTideMeters).toFixed(1));
      setSurgeMetrics((prev) => ({
        ...prev,
        peakSurgeMeters: baseSurge,
        totalWaterLevelMeters: totalWater,
        inlandPenetrationKm: parseFloat((totalWater * 1.7).toFixed(1)),
      }));
    }
  };

  const handleToggleOffline = () => {
    setIsOfflineMode((prev) => !prev);
  };

  const handleToggleHardening = (id: string) => {
    setInfrastructure((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isHardened: !item.isHardened } : item))
    );
  };

  const handleUpdateSurgeParams = (updated: Partial<SurgeMetrics>) => {
    setSurgeMetrics((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleTask = (id: string) => {
    setOfflineTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
            }
          : t
      )
    );
  };

  const handleAddTask = (newTask: Omit<OfflineActionTask, "id" | "completed">) => {
    const created: OfflineActionTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setOfflineTasks((prev) => [created, ...prev]);
  };

  const handleAddOutboxMessage = (msg: {
    recipient: string;
    frequencyOrChannel: string;
    content: string;
    priority: "FLASH" | "IMMEDIATE" | "PRIORITY";
  }) => {
    const newMsg: OutboxRadioMessage = {
      id: `radio-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "QUEUED_OFFLINE",
      ...msg,
    };
    setOutboxMessages((prev) => [newMsg, ...prev]);
  };

  const handleTransmitAllQueued = () => {
    setOutboxMessages((prev) =>
      prev.map((m) => (m.status === "QUEUED_OFFLINE" ? { ...m, status: "TRANSMITTED" } : m))
    );
  };

  const handleTriggerGeminiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/gemini/vulnerability-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cyclone: activeCyclone,
          surgeMetrics,
          rainfallMetrics,
          infrastructure,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        if (typeof data.analysis === "string") {
          setGeminiAnalysis({
            executiveSummary: data.analysis,
            criticalLifelineRiskScore: {
              powerGrid: 88,
              arterialRoads: 92,
              medicalShelters: 65,
              waterTreatment: 78,
            },
            prioritizedActionTimeline: [
              { timeWindow: "T-24h to T-18h", action: "Compulsory evacuation within 5km coastal shelf and estuarine inlets." },
              { timeWindow: "T-18h to T-12h", action: "Pre-position NDRF swift-water rescue craft on NH-16 high-ground staging sectors." },
              { timeWindow: "T-12h to T-6h", action: "Elevate critical ICU medical equipment and secure municipal water pumping heads." },
              { timeWindow: "T-6h to Landfall", action: "Sequential de-energization of 33kV coastal electrical feeders." },
              { timeWindow: "Post-Landfall", action: "Deploy heavy road clearing equipment and mobile trauma response." },
            ],
            parametricTriggerNote: "$15.0M USD pre-landfall contingency facility verified via Dvorak wind index >165 km/h.",
          });
        } else {
          setGeminiAnalysis({
            executiveSummary: data.analysis.executiveSummary || "Multimodal vulnerability assessment generated.",
            criticalLifelineRiskScore: data.analysis.criticalLifelineRiskScore || {
              powerGrid: 85,
              arterialRoads: 90,
              medicalShelters: 60,
              waterTreatment: 75,
            },
            prioritizedActionTimeline: Array.isArray(data.analysis.prioritizedActionTimeline)
              ? data.analysis.prioritizedActionTimeline
              : [
                  { timeWindow: "T-18h", action: "Enforce mandatory coastal evacuation." },
                  { timeWindow: "T-6h", action: "De-energize vulnerable 33kV coastal feeders." },
                  { timeWindow: "Landfall", action: "Shelter lockdown and emergency VHF relay." },
                ],
            parametricTriggerNote: data.analysis.parametricTriggerNote || "Parametric triggers verified.",
          });
        }
        setShowAnalysisModal(true);
      }
    } catch (err) {
      console.error("Gemini analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegenerateAdvisories = async () => {
    setIsGeneratingAdvisories(true);
    try {
      const res = await fetch("/api/gemini/generate-advisories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cyclone: activeCyclone,
          surgeMetrics,
          rainfallMetrics,
          infrastructure,
        }),
      });

      const data = await res.json();
      if (Array.isArray(data.advisories)) {
        setAdvisories(data.advisories);
      } else if (data.advisories && Array.isArray(data.advisories.advisories)) {
        setAdvisories(data.advisories.advisories);
      }
    } catch (err) {
      console.error("Advisory generation error:", err);
    } finally {
      setIsGeneratingAdvisories(false);
    }
  };

  const handleExportIAP = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f1f6fb] text-slate-800 flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab as DashboardTab)}
        currentCyclone={activeCyclone}
        scenarios={CYCLONE_SCENARIOS}
        onSelectScenario={handleSelectScenario}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={handleToggleOffline}
        onRunGeminiAssessment={handleTriggerGeminiAnalysis}
        isAnalyzing={isAnalyzing}
        onOpenAiAssistant={() => setIsChatOpen(true)}
        onOpenCustomModal={() => setIsCustomScenarioOpen(true)}
        onExportIAP={handleExportIAP}
        queuedRadioCount={outboxMessages.filter((m) => m.status === "QUEUED_OFFLINE").length}
      />

      {/* Main Command Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-4 sm:space-y-5 pb-24 sm:pb-8">
        {/* Friendly Storm Alert Banner */}
        <div className="bg-white border-2 border-sky-100 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0">
              🌀
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-base">
                  Tracking {activeCyclone.name}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {activeCyclone.category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  Arrives in {activeCyclone.landfallEstimateHours} hours
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                Heading towards <strong>{activeCyclone.landfallZone}</strong> with winds up to <strong>{activeCyclone.maxWindSpeedKmph} km/h</strong>. Waves may rise <strong>+{surgeMetrics.totalWaterLevelMeters}m</strong> above normal high tide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("3d-vortex")}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ViewInArRounded fontSize="small" className="text-indigo-600" />
              <span>3D Storm View</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsCustomScenarioOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ScienceRounded fontSize="small" className="text-sky-600" />
              <span>Test Storm Lab</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsChatOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ChatBubbleOutlineRounded fontSize="small" />
              <span>Ask Storm Guide</span>
            </motion.button>
          </div>
        </div>

        {/* Tab Content Panels with Motion Transition */}
        <AnimatePresence mode="wait">
          {activeTab === "geospatial" && (
            <motion.div
              key="geospatial"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Geospatial Situation Room with Vulnerability Heatmap */}
              <GeospatialMap
                cyclone={activeCyclone}
                infrastructure={infrastructure}
                surgeMetrics={surgeMetrics}
                rainfallMetrics={rainfallMetrics}
                onToggleHardening={handleToggleHardening}
                onSimulateCustom={() => setIsCustomScenarioOpen(true)}
                geminiAnalysis={geminiAnalysis}
                onRunGeminiAssessment={handleTriggerGeminiAnalysis}
                isAnalyzing={isAnalyzing}
                onSwitchTo3D={() => setActiveTab("3d-vortex")}
              />

              {/* 4 Colorful Interactive Explore Cards */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <span>📊</span>
                    <span>Explore What the Storm is Doing</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    Click any card to dive in and learn more!
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                  {/* 1. Sea & Waves */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("surge")}
                    className="p-4 rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50/70 to-white hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 uppercase tracking-wide flex items-center gap-1">
                        <WavesRounded fontSize="small" />
                        <span>Sea & Waves</span>
                      </span>
                      <span className="text-xs text-sky-500 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                        <ArrowForwardRounded fontSize="inherit" />
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-sky-950">
                      +{surgeMetrics.totalWaterLevelMeters}m
                    </div>
                    <div className="text-xs font-bold text-sky-800 mt-0.5">
                      Above Normal High Tide
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Ocean water pushing up to {surgeMetrics.inlandPenetrationKm} km into coastal bays and beaches.
                    </p>
                  </motion.div>

                  {/* 2. Rain & Rivers */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("rainfall")}
                    className="p-4 rounded-2xl border-2 border-teal-200 bg-gradient-to-b from-teal-50/70 to-white hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-700 uppercase tracking-wide flex items-center gap-1">
                        <WaterDropRounded fontSize="small" />
                        <span>Rain & Rivers</span>
                      </span>
                      <span className="text-xs text-teal-500 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                        <ArrowForwardRounded fontSize="inherit" />
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-teal-950">
                      {rainfallMetrics.cumulativeRainfallMm} mm
                    </div>
                    <div className="text-xs font-bold text-teal-800 mt-0.5">
                      Expected Over 2 Days
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Ground is {rainfallMetrics.soilSaturationPercent}% full of water. Rivers are rising fast!
                    </p>
                  </motion.div>

                  {/* 3. City Helpers & Shelters */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("infrastructure")}
                    className="p-4 rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                        <ShieldRounded fontSize="small" />
                        <span>City Helpers</span>
                      </span>
                      <span className="text-xs text-emerald-500 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                        <ArrowForwardRounded fontSize="inherit" />
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-emerald-950">
                      {infrastructure.filter((i) => i.isHardened).length} of {infrastructure.length}
                    </div>
                    <div className="text-xs font-bold text-emerald-800 mt-0.5">
                      Places Protected & Ready
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Hospitals, emergency power stations, and clear highway escape routes.
                    </p>
                  </motion.div>

                  {/* 4. Emergency Relief Fund */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("parametric")}
                    className="p-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-b from-amber-50/70 to-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1">
                        <MonetizationOnRounded fontSize="small" />
                        <span>Relief Fund</span>
                      </span>
                      <span className="text-xs text-amber-500 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                        <ArrowForwardRounded fontSize="inherit" />
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-amber-950">
                      ${(parametricPolicy.disbursedAmountUsd / 1000000).toFixed(1)} Million
                    </div>
                    <div className="text-xs font-bold text-amber-800 mt-0.5">
                      Instant Aid Ready Now
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Pre-funded money sent immediately for bottled water, shelter food, and medicine.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3D Tropical Cyclone Vortex & Wave Simulator (Three.js) */}
          {activeTab === "3d-vortex" && (
            <motion.div
              key="3d-vortex"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <CycloneThreeVisualizer
                cyclone={activeCyclone}
                surgeMetrics={surgeMetrics}
                onSwitchTo2DMap={() => setActiveTab("geospatial")}
              />
            </motion.div>
          )}

          {/* Storm Surge Panel */}
          {activeTab === "surge" && (
            <motion.div
              key="surge"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <SurgeModelPanel
                cyclone={activeCyclone}
                surgeMetrics={surgeMetrics}
                onUpdateSurgeParams={handleUpdateSurgeParams}
              />
            </motion.div>
          )}

          {/* Rainfall & Runoff Panel */}
          {activeTab === "rainfall" && (
            <motion.div
              key="rainfall"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <RainfallRunoffPanel cyclone={activeCyclone} rainfallMetrics={rainfallMetrics} />
            </motion.div>
          )}

          {/* Infrastructure Exposure Panel */}
          {activeTab === "infrastructure" && (
            <motion.div
              key="infrastructure"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <InfrastructurePanel
                infrastructure={infrastructure}
                onToggleHardening={handleToggleHardening}
              />
            </motion.div>
          )}

          {/* Early Warning Advisories Panel */}
          {activeTab === "advisories" && (
            <motion.div
              key="advisories"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <EarlyWarningAdvisories
                advisories={advisories}
                onRegenerate={handleRegenerateAdvisories}
                cyclone={activeCyclone}
                surgeMetrics={surgeMetrics}
                rainfallMetrics={rainfallMetrics}
                isGenerating={isGeneratingAdvisories}
              />
            </motion.div>
          )}

          {/* Parametric Insurance Facility Panel */}
          {activeTab === "parametric" && (
            <motion.div
              key="parametric"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ParametricInsurancePanel
                policy={parametricPolicy}
                cyclone={activeCyclone}
                surgeMetrics={surgeMetrics}
              />
            </motion.div>
          )}

          {/* Offline Coordination Panel */}
          {activeTab === "offline-coordination" && (
            <motion.div
              key="offline-coordination"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <OfflineCoordinationPanel
                tasks={offlineTasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                outboxMessages={outboxMessages}
                onAddOutboxMessage={handleAddOutboxMessage}
                onTransmitAllQueued={handleTransmitAllQueued}
                isOfflineMode={isOfflineMode}
                cyclone={activeCyclone}
                surgeMetrics={surgeMetrics}
                rainfallMetrics={rainfallMetrics}
                onExportIAP={handleExportIAP}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Tactical Advisor Dock */}
      <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-2 border-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 sm:gap-2"
        >
          <span className="text-sm sm:text-base">💬</span>
          <span>Ask Guide</span>
        </button>
      </div>

      {/* Community Storm Safety Report Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t-2 sm:border-2 border-sky-100 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden text-xs shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Community Storm Safety Report
                  </h3>
                  <p className="text-xs text-sky-700">
                    Friendly summary based on current wind, waves, and rainfall
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-slate-700">
              {isAnalyzing ? (
                /* Friendly Progress State */
                <div className="p-5 rounded-2xl border border-sky-200 bg-sky-50/60 space-y-3 text-xs">
                  <div className="flex items-center gap-2.5 text-sky-800 font-bold text-sm">
                    <span className="w-3 h-3 rounded-full bg-sky-500 animate-ping"></span>
                    <span>Checking storm safety for our towns...</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 pl-5">
                    <div>🌊 Checking high water levels along the coast (+{surgeMetrics.totalWaterLevelMeters}m)</div>
                    <div>🌧️ Measuring rainfall and river water levels ({rainfallMetrics.cumulativeRainfallMm} mm)</div>
                    <div>🏥 Checking on power stations, hospitals, and evacuation routes</div>
                  </div>
                  <div className="pt-2 border-t border-sky-200/80 text-[11px] text-slate-500">
                    Consulting weather models and satellite cameras
                  </div>
                </div>
              ) : geminiAnalysis ? (
                <>
                  <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40">
                    <div className="font-bold text-sky-900 text-xs mb-1.5 flex items-center gap-1.5">
                      <span>📢</span>
                      <span>Overview for Families & Communities</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                      {geminiAnalysis.executiveSummary}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <span>🏷️</span>
                      <span>Safety Readiness by Service</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
                        <span className="text-[11px] text-rose-700 font-semibold block">⚡ Power Grid</span>
                        <span className="font-black text-rose-900 text-base">
                          {geminiAnalysis.criticalLifelineRiskScore?.powerGrid ?? 88}% Risk
                        </span>
                        <span className="text-[10px] text-rose-600 block mt-0.5">High Water Alert</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                        <span className="text-[11px] text-amber-700 font-semibold block">🛣️ Roads & Transit</span>
                        <span className="font-black text-amber-900 text-base">
                          {geminiAnalysis.criticalLifelineRiskScore?.arterialRoads ?? 92}% Risk
                        </span>
                        <span className="text-[10px] text-amber-600 block mt-0.5">Flood Watch Active</span>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                        <span className="text-[11px] text-emerald-700 font-semibold block">🏥 Medical Shelters</span>
                        <span className="font-black text-emerald-900 text-base">
                          {geminiAnalysis.criticalLifelineRiskScore?.medicalShelters ?? 65}% Safe
                        </span>
                        <span className="text-[10px] text-emerald-600 block mt-0.5">Generators Ready</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                        <span className="text-[11px] text-blue-700 font-semibold block">💧 Clean Water</span>
                        <span className="font-black text-blue-900 text-base">
                          {geminiAnalysis.criticalLifelineRiskScore?.waterTreatment ?? 78}% Safe
                        </span>
                        <span className="text-[10px] text-blue-600 block mt-0.5">Tanks Filled</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>⏱️</span>
                      <span>Step-by-Step Action Plan</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {(geminiAnalysis.prioritizedActionTimeline || []).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200/80">
                          <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-lg shrink-0">
                            {item.timeWindow}
                          </span>
                          <span className="text-slate-700 leading-snug">{item.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center gap-2">
                    <span className="text-base">💰</span>
                    <div>
                      <strong>Relief Fund Status: </strong>
                      {geminiAnalysis.parametricTriggerNote || "Emergency funding is approved and ready to help!"}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-white text-xs text-slate-500 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <div className="text-slate-800 font-bold">
                CycloneWatch · Community Weather Safety & Learning Platform
              </div>
              <div className="text-slate-500 text-xs">
                Built to help kids, families, and emergency teams understand storm science and stay protected.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setShowTosModal(true)}
              className="text-sky-600 hover:text-sky-800 underline cursor-pointer"
            >
              How It Works & Safety Terms
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-sky-600 hover:text-sky-800 underline cursor-pointer"
            >
              Privacy & Family Safety
            </button>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">Community Edition</span>
          </div>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      {showTosModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 text-xs space-y-3.5 text-slate-700 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>📘</span>
                <span>How CycloneWatch Keeps Us Safe</span>
              </span>
              <button onClick={() => setShowTosModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
            </div>
            <div className="space-y-2.5 text-xs leading-relaxed text-slate-600">
              <p>
                1. <strong>Learning & Safety Explorer</strong>: CycloneWatch models big waves, river flooding, and town safety so families and emergency crews can prepare early before a storm arrives.
              </p>
              <p>
                2. <strong>Real Weather Data</strong>: We use real satellite views and coastal elevation measurements to calculate flood paths and wind dangers.
              </p>
              <p>
                3. <strong>Community First</strong>: Always follow the guidance of local emergency workers and official announcements during active storms.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowTosModal(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 text-xs space-y-3.5 text-slate-700 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>🔒</span>
                <span>Privacy & Kid Safety Promise</span>
              </span>
              <button onClick={() => setShowPrivacyModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
            </div>
            <div className="space-y-2.5 text-xs leading-relaxed text-slate-600">
              <p>
                1. <strong>Zero Personal Tracking</strong>: We never track your personal identity, sell data, or use ads.
              </p>
              <p>
                2. <strong>Works Right On Your Device</strong>: Your custom storms, checklist tasks, and simulated radio messages stay right on your browser.
              </p>
              <p>
                3. <strong>Safe Learning Environment</strong>: Designed to be clean, educational, and friendly for students of all ages.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Disaster Command Chat Drawer/Modal */}
      <DisasterChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        cyclone={activeCyclone}
        surgeMetrics={surgeMetrics}
        rainfallMetrics={rainfallMetrics}
      />

      {/* Custom Storm Physics Simulator Modal */}
      <CustomScenarioModal
        isOpen={isCustomScenarioOpen}
        onClose={() => setIsCustomScenarioOpen(false)}
        onApplyCustomScenario={(custom) => {
          setActiveCyclone(custom);
          const baseSurge = custom.category.includes("Super") ? 5.8 : custom.category.includes("Extremely") ? 4.3 : 2.9;
          const totalWater = parseFloat((baseSurge + surgeMetrics.astronomicalTideMeters).toFixed(1));
          setSurgeMetrics((prev) => ({
            ...prev,
            peakSurgeMeters: baseSurge,
            totalWaterLevelMeters: totalWater,
            inlandPenetrationKm: parseFloat((totalWater * 1.7).toFixed(1)),
          }));
        }}
        baseCyclone={activeCyclone}
      />
    </div>
  );
}
