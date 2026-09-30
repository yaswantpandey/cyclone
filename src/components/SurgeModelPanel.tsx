import React, { useState } from "react";
import { motion } from "motion/react";
import { CycloneSystem, SurgeMetrics } from "../types/cyclone";
import WavesRounded from "@mui/icons-material/WavesRounded";
import AirRounded from "@mui/icons-material/AirRounded";
import DarkModeRounded from "@mui/icons-material/DarkModeRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import BeachAccessRounded from "@mui/icons-material/BeachAccessRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";

interface SurgeModelPanelProps {
  cyclone: CycloneSystem;
  surgeMetrics: SurgeMetrics;
  onUpdateSurgeParams: (updated: Partial<SurgeMetrics>) => void;
}

export const SurgeModelPanel: React.FC<SurgeModelPanelProps> = ({
  cyclone,
  surgeMetrics,
  onUpdateSurgeParams,
}) => {
  const [activeTidalPhase, setActiveTidalPhase] = useState<"Spring High Tide" | "Neap High Tide" | "Ebb Tide">(
    surgeMetrics.tidalPhase
  );
  const [shelfDepthInput, setShelfDepthInput] = useState<number>(surgeMetrics.bathymetryShelfDepthMeters);

  const handleTidalPhaseChange = (phase: "Spring High Tide" | "Neap High Tide" | "Ebb Tide") => {
    setActiveTidalPhase(phase);
    let tideOffset = 1.2;
    if (phase === "Neap High Tide") tideOffset = 0.6;
    if (phase === "Ebb Tide") tideOffset = -0.4;

    const newTotal = parseFloat((surgeMetrics.peakSurgeMeters + tideOffset).toFixed(1));
    const newPenetration = parseFloat((newTotal * 1.7).toFixed(1));

    onUpdateSurgeParams({
      tidalPhase: phase,
      astronomicalTideMeters: tideOffset,
      totalWaterLevelMeters: newTotal,
      inlandPenetrationKm: newPenetration,
    });
  };

  const handleShelfDepthChange = (depth: number) => {
    setShelfDepthInput(depth);
    const amplificationFactor = depth < 15 ? 1.25 : depth < 25 ? 1.0 : 0.8;
    const baseSurge = 3.5;
    const newPeakSurge = parseFloat((baseSurge * amplificationFactor).toFixed(1));
    const newTotal = parseFloat((newPeakSurge + surgeMetrics.astronomicalTideMeters).toFixed(1));
    const newPenetration = parseFloat((newTotal * 1.7).toFixed(1));

    onUpdateSurgeParams({
      bathymetryShelfDepthMeters: depth,
      peakSurgeMeters: newPeakSurge,
      totalWaterLevelMeters: newTotal,
      inlandPenetrationKm: newPenetration,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 text-xs font-sans"
    >
      {/* Friendly Briefing Header */}
      <div className="bg-white border-2 border-sky-100 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-100 text-sky-700 rounded-2xl">
            <WavesRounded fontSize="medium" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Sea Waves & Coastal High Water Watch
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Learn why the ocean rises during a cyclone: Strong spinning winds push seawater toward the coast like a giant snowplow!
            </p>
          </div>
        </div>
      </div>

      {/* 4 Colorful Readout Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Wind-Driven Surge */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white border-2 border-sky-200 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wide flex items-center gap-1.5">
            <AirRounded fontSize="small" />
            <span>Wind-Pushed Wave Rise</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-sky-950">
              +{surgeMetrics.peakSurgeMeters}m
            </span>
            <span className="text-xs text-slate-500 font-semibold">Wave Height</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            Caused by {cyclone.maxWindSpeedKmph} km/h winds pushing across the shallow bay.
          </p>
        </motion.div>

        {/* High Tide Addition */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
            <DarkModeRounded fontSize="small" />
            <span>Moon & Ocean Tide</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-950">
              +{surgeMetrics.astronomicalTideMeters}m
            </span>
            <span className="text-xs text-slate-500 font-semibold">{activeTidalPhase}</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            During full moon or new moon, tides are naturally higher!
          </p>
        </motion.div>

        {/* Total Water Level */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
            <WarningAmberRounded fontSize="small" />
            <span>Total Water Level</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-rose-950">
              +{surgeMetrics.totalWaterLevelMeters}m
            </span>
            <span className="text-xs text-rose-700 font-bold">Above Normal</span>
          </div>
          <p className="mt-1.5 text-xs text-rose-800 leading-snug font-medium">
            High enough to flow over coastal sea walls and road bridges.
          </p>
        </motion.div>

        {/* Inland Reach */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white border-2 border-teal-200 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wide flex items-center gap-1.5">
            <BeachAccessRounded fontSize="small" />
            <span>How Far Inshore?</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-teal-950">
              {surgeMetrics.inlandPenetrationKm} km
            </span>
            <span className="text-xs text-slate-500 font-semibold">Inland Reach</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            Water flows up rivers and low creeks into nearby farm fields.
          </p>
        </motion.div>
      </div>

      {/* Cross-Section & Interactive Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Cross-Section Diagram */}
        <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
            <div>
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <TuneRounded className="text-sky-600" fontSize="small" />
                <span>See the Wave in Action: Coastal Cross-Section</span>
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Watch how deep water pushes up into shallow beaches and overtops dikes
              </p>
            </div>
            <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
              Sea Floor Depth: {shelfDepthInput}m
            </span>
          </div>

          {/* Friendly Colorful SVG */}
          <div className="w-full h-52 bg-gradient-to-b from-sky-100 to-sky-50 rounded-2xl p-2 relative overflow-hidden border border-sky-200 shadow-inner">
            <svg viewBox="0 0 700 200" className="w-full h-full">
              {/* Sky background with clouds */}
              <circle cx="80" cy="35" r="16" fill="#ffffff" opacity="0.8" />
              <circle cx="105" cy="30" r="22" fill="#ffffff" opacity="0.9" />
              <circle cx="130" cy="35" r="16" fill="#ffffff" opacity="0.8" />

              {/* Sun / Storm swirls */}
              <circle cx="620" cy="30" r="20" fill="#fef08a" opacity="0.7" />

              {/* Deep Sea Floor Bed */}
              <path
                d="M 0,175 L 150,165 L 300,150 L 430,120 L 510,85 L 560,75 L 700,75 L 700,200 L 0,200 Z"
                fill="#86efac"
                stroke="#22c55e"
                strokeWidth="2"
              />

              {/* Normal Sea Level Line */}
              <line x1="0" y1="110" x2="510" y2="110" stroke="#0284c7" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x="15" y="103" fill="#0369a1" fontSize="10" fontWeight="bold">
                Normal High Tide (0.0m)
              </text>

              {/* Wave Body (Vibrant Blue) */}
              <path
                d="M 0,110 Q 250,105 400,80 Q 480,60 510,45 L 610,55 L 640,75 L 510,85 L 430,120 L 300,150 L 150,165 L 0,175 Z"
                fill="#38bdf8"
                fillOpacity="0.5"
              />

              {/* Surging Wave Crest */}
              <path
                d="M 0,108 Q 30,100 60,108 T 120,108 T 180,104 T 240,98 T 300,90 T 360,78 T 420,62 T 480,48 T 510,42 L 580,48 L 630,75"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
              />

              {/* Protective Sea Dike */}
              <rect x="525" y="58" width="10" height="26" fill="#f59e0b" stroke="#d97706" rx="2" />
              <text x="475" y="52" fill="#b45309" fontSize="10" fontWeight="bold">
                🛡️ Sea Wall (Overtopped)
              </text>

              {/* Flooded Town Area */}
              <rect x="545" y="72" width="100" height="15" fill="#f87171" fillOpacity="0.4" rx="2" />
              <text x="550" y="102" fill="#dc2626" fontSize="10" fontWeight="bold">
                🌊 Flood: {surgeMetrics.inlandPenetrationKm} km Inland
              </text>

              {/* Peak Wave Height Badge */}
              <circle cx="510" cy="42" r="5" fill="#ef4444" />
              <rect x="425" y="10" width="170" height="24" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" rx="6" />
              <text x="435" y="26" fill="#b91c1c" fontSize="11" fontWeight="bold">
                Total Water: +{surgeMetrics.totalWaterLevelMeters}m Above Normal
              </text>
            </svg>
          </div>

          {/* Interactive Sliders */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Shelf Depth */}
            <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100">
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Sea Floor Slope & Depth:</span>
                <span className="text-sky-700">{shelfDepthInput} meters</span>
              </div>
              <input
                type="range"
                min="8"
                max="35"
                value={shelfDepthInput}
                onChange={(e) => handleShelfDepthChange(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-600 block mt-1.5 leading-snug">
                {shelfDepthInput < 15
                  ? "⚠️ Very shallow coast! Water has nowhere to go but up, making big waves!"
                  : "Deeper water allows wave energy to disperse more easily."}
              </span>
            </div>

            {/* Tidal Phase */}
            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100">
              <div className="font-bold text-slate-800 mb-1.5">Moon & Ocean Tide Level:</div>
              <div className="flex items-center gap-1.5">
                {(["Spring High Tide", "Neap High Tide", "Ebb Tide"] as const).map((phase) => (
                  <button
                    key={phase}
                    onClick={() => handleTidalPhaseChange(phase)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTidalPhase === phase
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {phase === "Spring High Tide" ? "🌕 Full Moon" : phase === "Neap High Tide" ? "🌓 Half Moon" : "🌊 Low Tide"}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-600 block mt-1.5">
                Full moon tides add an extra +1.2m to the storm surge wave!
              </span>
            </div>
          </div>
        </div>

        {/* Coastal Towns to Watch */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <PlaceRounded className="text-rose-500" fontSize="small" />
                <span>Coastal Towns to Protect</span>
              </span>
              <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                Active Watch
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Expected water rise for each area based on coastline shape:
            </p>

            <div className="space-y-2">
              {(surgeMetrics?.highestRiskSectors || []).map((sector, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800 text-xs">{sector.sector}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Low-lying beach & estuary zone
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-rose-600 text-sm">+{sector.surgeM}m</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block mt-0.5">
                      {sector.risk}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-snug flex items-start gap-2">
            <ShieldRounded className="text-emerald-600 shrink-0" fontSize="small" />
            <div>
              <strong>Family Safety Advice:</strong> Everyone living within 5 km of the beach or near tidal rivers should move to high-ground shelters before the storm arrives.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
