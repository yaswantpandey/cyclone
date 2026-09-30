import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RainfallMetrics, CycloneSystem, RiverBasinAlert, RedAlertZone } from "../types/cyclone";
import WaterDropRounded from "@mui/icons-material/WaterDropRounded";
import OpacityRounded from "@mui/icons-material/OpacityRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import DirectionsCarRounded from "@mui/icons-material/DirectionsCarRounded";
import LandscapeRounded from "@mui/icons-material/LandscapeRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import AltRouteRounded from "@mui/icons-material/AltRouteRounded";
import CampaignRounded from "@mui/icons-material/CampaignRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import ReportProblemRounded from "@mui/icons-material/ReportProblemRounded";
import SensorsRounded from "@mui/icons-material/SensorsRounded";
import HomeWorkRounded from "@mui/icons-material/HomeWorkRounded";

interface RainfallRunoffPanelProps {
  cyclone: CycloneSystem;
  rainfallMetrics: RainfallMetrics;
}

export const RainfallRunoffPanel: React.FC<RainfallRunoffPanelProps> = ({
  cyclone,
  rainfallMetrics,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "breaching" | "zones" | "choke">("all");
  const [activeRiverDetail, setActiveRiverDetail] = useState<string | null>(
    rainfallMetrics?.riverBasinAlerts?.[0]?.river || null
  );

  const breachingRivers = (rainfallMetrics?.riverBasinAlerts || []).filter(
    (r) => r.status === "Breaching" || r.isRedZone
  );
  const redAlertZones = rainfallMetrics?.redAlertZones || [];
  const chokePoints = rainfallMetrics?.flashFloodChokePoints || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 text-xs font-sans"
    >
      {/* 🚨 HIGH ALERT RED ZONE EMERGENCY BANNER */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-rose-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-white/20 backdrop-blur-xs rounded-2xl shrink-0 text-white animate-pulse">
              <CampaignRounded fontSize="large" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white text-rose-700 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  🚨 CWC RED ZONE HIGH ALERT
                </span>
                <span className="text-xs font-bold text-rose-100 bg-rose-900/40 px-2 py-0.5 rounded-full border border-rose-400/50">
                  Live River Flood Data
                </span>
                <span className="text-xs font-semibold text-rose-100">
                  Cyclone {cyclone.name} Inundation Arc
                </span>
              </div>
              <h2 className="font-black text-lg sm:text-xl text-white mt-1 leading-snug">
                5 Major Rivers Breaching Danger Marks — 4 Coastal Districts in Red Zone
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-4xl leading-relaxed">
                Central Water Commission (CWC) telemetry confirms extreme water levels in <strong>Baitarani</strong>, <strong>Budhabalanga</strong>, <strong>Subarnarekha</strong>, <strong>Salandi</strong>, and <strong>Hooghly Estuary</strong>. Flash runoffs meeting storm surge tides have caused multiple embankment breaches with over <strong>494,000 residents</strong> impacted in marooned areas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
            <div className="bg-white/15 backdrop-blur-xs border border-white/30 rounded-2xl p-2.5 px-3.5 text-center">
              <div className="text-2xl font-black text-white">{breachingRivers.length}</div>
              <div className="text-[10px] text-rose-100 uppercase font-bold">Breached Rivers</div>
            </div>
            <div className="bg-white/15 backdrop-blur-xs border border-white/30 rounded-2xl p-2.5 px-3.5 text-center">
              <div className="text-2xl font-black text-white">{redAlertZones.length}</div>
              <div className="text-[10px] text-rose-100 uppercase font-bold">Red Zones</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Real Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Total Rainfall */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white border-2 border-teal-200 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wide flex items-center gap-1.5">
            <OpacityRounded fontSize="small" />
            <span>Cumulative Rainfall</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-teal-950">
              {rainfallMetrics.cumulativeRainfallMm}
            </span>
            <span className="text-xs text-slate-500 font-semibold">mm (2-Day Record)</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            Intense cloudbursts up to <strong>{rainfallMetrics.peakRateMmPerHour} mm/hour</strong> across coastal catchments.
          </p>
        </motion.div>

        {/* Soil Moisture */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white border-2 border-sky-200 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wide flex items-center gap-1.5">
            <LandscapeRounded fontSize="small" />
            <span>Soil Saturation Index</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-sky-950">
              {rainfallMetrics.soilSaturationPercent}%
            </span>
            <span className="text-xs text-rose-600 font-bold">100% Runoff Risk</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rainfallMetrics.soilSaturationPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-rose-500 h-full rounded-full"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            Ground cannot absorb more water; 100% of fresh rain rushes straight into riverbeds.
          </p>
        </motion.div>

        {/* Rivers Breaching Danger Mark */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
            <WarningAmberRounded fontSize="small" />
            <span>Rivers Over Danger Mark</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-rose-950">
              {breachingRivers.length}
            </span>
            <span className="text-xs text-rose-700 font-bold">of {(rainfallMetrics.riverBasinAlerts || []).length} Monitored</span>
          </div>
          <p className="mt-1.5 text-xs text-rose-800 leading-snug font-medium">
            Extreme flood: <strong>Baitarani (+1.15m)</strong> and <strong>Budhabalanga (+0.49m)</strong> over danger lines.
          </p>
        </motion.div>

        {/* Marooned Population */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
            <HomeWorkRounded fontSize="small" />
            <span>Marooned Population</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-950">
              {((rainfallMetrics.totalMaroonedPeople || 494000) / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-500 font-semibold">Citizens in Red Zone</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            26 NDRF battalions & 45 ODRAF assault boats deployed for emergency air-drops and rescues.
          </p>
        </motion.div>
      </div>

      {/* FILTER BUTTONS: Real River Telemetry vs District Red Zones */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedFilter("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            selectedFilter === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <SensorsRounded fontSize="small" />
          <span>All River Telemetry ({(rainfallMetrics?.riverBasinAlerts || []).length})</span>
        </button>

        <button
          onClick={() => setSelectedFilter("breaching")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            selectedFilter === "breaching"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-0.5" />
          <span>🚨 Breaching Rivers Only ({breachingRivers.length})</span>
        </button>

        <button
          onClick={() => setSelectedFilter("zones")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            selectedFilter === "zones"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white text-amber-800 hover:bg-amber-50 border border-amber-200"
          }`}
        >
          <ShieldRounded fontSize="small" />
          <span>🔴 District High Alert Red Zones ({redAlertZones.length})</span>
        </button>

        <button
          onClick={() => setSelectedFilter("choke")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            selectedFilter === "choke"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200"
          }`}
        >
          <DirectionsCarRounded fontSize="small" />
          <span>Highway Cuts & Submerged Bridges ({chokePoints.length})</span>
        </button>
      </div>

      {/* SECTION 1: DISTRICT RED ALERT ZONES (KAHA KAHA PE HIGH ALERT HAI) */}
      {(selectedFilter === "all" || selectedFilter === "zones") && (
        <div className="bg-white border-2 border-rose-200 rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-3">
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <span>Kaha Kaha Pe Flood Aaya Hai: District Red Alert Zones</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Government-designated Red Zones where river breach and storm tide backflow pose immediate danger to life
              </p>
            </div>
            <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
              Immediate Evacuation Mandate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {redAlertZones.map((zone) => (
              <motion.div
                key={zone.id}
                whileHover={{ scale: 1.01 }}
                className="p-4 rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-red-50/50 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-600 text-white uppercase tracking-wider">
                          {zone.status}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{zone.district}, {zone.state}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{zone.zoneName}</h4>
                    </div>
                    <span className="text-[11px] font-bold text-rose-700 bg-white border border-rose-300 px-2 py-0.5 rounded-lg shrink-0">
                      {zone.severity}
                    </span>
                  </div>

                  {/* Kaha pe kya dikkat hai box */}
                  <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-slate-700 my-2 space-y-1">
                    <strong className="text-rose-900 flex items-center gap-1 font-bold">
                      <ReportProblemRounded fontSize="inherit" className="text-rose-600" />
                      <span>Kya Dikkat Hai (Ground Issues & Failures):</span>
                    </strong>
                    <p className="text-slate-700 text-xs leading-relaxed">{zone.keyIssues}</p>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <strong>Swollen Rivers:</strong> {zone.riversInvolved.join(", ")}
                    </div>
                    <div>
                      <strong>Marooned Blocks:</strong> {zone.affectedBlocks.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-rose-200/80 flex items-center justify-between text-xs font-semibold">
                  <span className="text-rose-800">
                    👥 <strong>{zone.evacuatedPeople.toLocaleString()}</strong> people evacuated
                  </span>
                  <span className="text-slate-700 bg-rose-100/70 px-2 py-0.5 rounded-md">
                    🛡️ {zone.ndrfTeams} NDRF Teams Active
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: LIVE RIVER TELEMETRY & "KYA DIKKAT HAI" DETAILS */}
      {(selectedFilter === "all" || selectedFilter === "breaching") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* List of Rivers on Left */}
          <div className="lg:col-span-1 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                Live CWC River Gauges
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Click to inspect</span>
            </div>

            {(selectedFilter === "breaching" ? breachingRivers : (rainfallMetrics?.riverBasinAlerts || [])).map((river) => {
              const delta = parseFloat((river.currentLevelM - river.dangerLevelM).toFixed(2));
              const isBreaching = river.status === "Breaching" || delta > 0;
              const isSelected = activeRiverDetail === river.river;

              return (
                <motion.div
                  key={river.river}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveRiverDetail(river.river)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-sky-500 bg-sky-50/80 shadow-md ring-2 ring-sky-300"
                      : isBreaching
                      ? "border-rose-200 bg-white hover:border-rose-300"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-900 text-xs sm:text-sm">{river.river}</span>
                      {river.isRedZone && (
                        <span className="text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.2 rounded-full">
                          RED ZONE
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isBreaching
                          ? "bg-rose-100 text-rose-800 border border-rose-300 font-black"
                          : river.status === "Critical"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {isBreaching ? `🌊 +${delta}m Breach` : `${Math.abs(delta)}m Safe`}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-1.5">
                    {river.stationName} · {river.district}
                  </div>

                  <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-medium">
                    <span>Now: <strong className="text-slate-950 font-bold">{river.currentLevelM}m</strong></span>
                    <span>Danger: <strong className="text-rose-700 font-bold">{river.dangerLevelM}m</strong></span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (river.currentLevelM / (river.dangerLevelM * 1.05)) * 100)}%` }}
                      className={`h-full rounded-full transition-all ${
                        isBreaching ? "bg-rose-600" : river.status === "Critical" ? "bg-amber-500" : "bg-teal-500"
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Detailed River Impact Card on Right */}
          <div className="lg:col-span-2">
            {(() => {
              const selectedRiver = (rainfallMetrics?.riverBasinAlerts || []).find(
                (r) => r.river === activeRiverDetail
              ) || rainfallMetrics?.riverBasinAlerts?.[0];

              if (!selectedRiver) return null;
              const delta = parseFloat((selectedRiver.currentLevelM - selectedRiver.dangerLevelM).toFixed(2));
              const isBreaching = selectedRiver.status === "Breaching" || delta > 0;

              return (
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col justify-between h-full">
                  <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-slate-900">
                            {selectedRiver.river}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                            {selectedRiver.district}, {selectedRiver.state}
                          </span>
                          {selectedRiver.isRedZone && (
                            <span className="text-xs bg-rose-600 text-white font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                              HIGH ALERT RED ZONE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Official Gauge Station: <strong>{selectedRiver.stationName}</strong> · Trend: <strong>{selectedRiver.trend} ↗</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Water Height</div>
                          <div className={`text-xl font-black ${isBreaching ? "text-rose-600" : "text-slate-900"}`}>
                            {selectedRiver.currentLevelM} meters
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gauging Comparison Bars */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-4 text-center">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Current Level</div>
                        <div className="text-sm sm:text-base font-black text-slate-900">{selectedRiver.currentLevelM}m</div>
                        <span className="text-[10px] text-rose-600 font-bold">
                          {delta > 0 ? `+${delta}m Over Bank` : "Within Bank"}
                        </span>
                      </div>
                      <div className="border-x border-slate-200">
                        <div className="text-[10px] uppercase font-bold text-rose-700">Danger Mark (Lal Nishaan)</div>
                        <div className="text-sm sm:text-base font-black text-rose-700">{selectedRiver.dangerLevelM}m</div>
                        <span className="text-[10px] text-slate-500">CWC Threshold</span>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Historic HFL Record</div>
                        <div className="text-sm sm:text-base font-black text-slate-900">{selectedRiver.highestFloodLevelM}m</div>
                        <span className="text-[10px] text-slate-500">All-Time Peak</span>
                      </div>
                    </div>

                    {/* ⚠️ KAHA PE KYA DIKKAT HAI (GROUND ISSUES) */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-black text-rose-900 mb-2">
                        <ReportProblemRounded fontSize="small" className="text-rose-600" />
                        <span>Kaha Pe Kya Dikkat Hai: Ground Damage & Village Flooding Log</span>
                      </div>

                      <div className="space-y-2">
                        {(selectedRiver.groundIssues || []).map((issue, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed font-medium">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact Statistics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                        <div className="text-xs font-bold text-amber-800">Marooned Villages</div>
                        <div className="text-2xl font-black text-amber-950 mt-0.5">
                          {selectedRiver.maroonedVillagesCount} Villages Cut Off
                        </div>
                        <p className="text-[11px] text-amber-700 mt-1">Water surrounded all 4 access roads</p>
                      </div>
                      <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
                        <div className="text-xs font-bold text-sky-800">Affected Population</div>
                        <div className="text-2xl font-black text-sky-950 mt-0.5">
                          {selectedRiver.affectedPopulation.toLocaleString()} People
                        </div>
                        <p className="text-[11px] text-sky-700 mt-1">Receiving emergency aid packets</p>
                      </div>
                    </div>
                  </div>

                  {/* Government & NDRF Action Status */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <ShieldRounded className="text-emerald-400" fontSize="small" />
                      <div>
                        <div className="text-xs font-bold text-white">Emergency Response Deployed:</div>
                        <div className="text-xs text-slate-300">{selectedRiver.rescueAction}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full shrink-0">
                      Live Response Active
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SECTION 3: ROAD CHOKE POINTS & CUT-OFF HIGHWAY SECTIONS */}
      {(selectedFilter === "all" || selectedFilter === "choke") && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <AltRouteRounded className="text-amber-600" fontSize="small" />
                <span>Submerged Highway Underpasses & Severed Lifeline Corridors</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Critical transport sections where river water has spilled onto expressways and rail corridors
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              NH-16 & Rail Traffic Alert
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chokePoints.map((choke, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-black text-slate-900 text-xs sm:text-sm">{choke.location}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Elevation: {choke.elevationM}m MSL · Fast flood accumulation point
                  </div>
                  {choke.issues && (
                    <div className="mt-2 text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded-xl">
                      <strong>Problem:</strong> {choke.issues}
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                    choke.riskLevel === "Critical"
                      ? "bg-rose-100 text-rose-800 border border-rose-300 font-black"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {choke.riskLevel === "Critical" ? "🚨 Cut Off" : "⚠️ High Risk"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
