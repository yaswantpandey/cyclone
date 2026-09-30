import React, { useState } from "react";
import { motion } from "motion/react";
import { InfrastructureAsset, InfrastructureType } from "../types/cyclone";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import LocalHospitalRounded from "@mui/icons-material/LocalHospitalRounded";
import ElectricBoltRounded from "@mui/icons-material/ElectricBoltRounded";
import AltRouteRounded from "@mui/icons-material/AltRouteRounded";
import WaterDamageRounded from "@mui/icons-material/WaterDamageRounded";
import CellTowerRounded from "@mui/icons-material/CellTowerRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import BuildRounded from "@mui/icons-material/BuildRounded";
import LocationCityRounded from "@mui/icons-material/LocationCityRounded";

interface InfrastructurePanelProps {
  infrastructure: InfrastructureAsset[];
  onToggleHardening: (id: string) => void;
}

export const InfrastructurePanel: React.FC<InfrastructurePanelProps> = ({
  infrastructure = [],
  onToggleHardening,
}) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRisk, setFilterRisk] = useState<string>("all");

  const safeInfra = infrastructure || [];
  const hardenedCount = safeInfra.filter((a) => a.isHardened).length;
  const criticalCount = safeInfra.filter((a) => a.riskLevel === "CRITICAL" && !a.isHardened).length;
  const highCount = safeInfra.filter((a) => a.riskLevel === "HIGH" && !a.isHardened).length;

  const filteredAssets = safeInfra.filter((asset) => {
    if (selectedType !== "all" && asset.type !== selectedType) return false;
    if (filterRisk !== "all") {
      if (filterRisk === "hardened" && !asset.isHardened) return false;
      if (filterRisk === "critical" && (asset.riskLevel !== "CRITICAL" || asset.isHardened)) return false;
      if (filterRisk === "high" && (asset.riskLevel !== "HIGH" || asset.isHardened)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.capacityOrRating.toLowerCase().includes(q) ||
        asset.hardeningAction.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTypeInfo = (type: InfrastructureType) => {
    switch (type) {
      case "power_substation":
        return { icon: <ElectricBoltRounded />, label: "Power Station", color: "bg-amber-100 text-amber-800 border-amber-300" };
      case "arterial_highway":
        return { icon: <AltRouteRounded />, label: "Evacuation Road", color: "bg-sky-100 text-sky-800 border-sky-300" };
      case "hospital_shelter":
        return { icon: <LocalHospitalRounded />, label: "Hospital & Shelter", color: "bg-rose-100 text-rose-800 border-rose-300" };
      case "water_facility":
        return { icon: <WaterDamageRounded />, label: "Clean Water Plant", color: "bg-teal-100 text-teal-800 border-teal-300" };
      case "telecom_tower":
        return { icon: <CellTowerRounded />, label: "Emergency Radio/Phone", color: "bg-indigo-100 text-indigo-800 border-indigo-300" };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 text-xs font-sans"
    >
      {/* Friendly Overview Banner */}
      <div className="bg-white border-2 border-emerald-100 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
            <LocalHospitalRounded fontSize="medium" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
              City Helpers & Safe Shelters
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Explore how cities protect hospitals, keep the lights on, keep roads clear, and guarantee clean water during big storms.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Colorful Readout Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Total Monitored */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
            <LocationCityRounded fontSize="small" />
            <span>Important Town Places</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">
              {infrastructure.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold">Key Facilities</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            Power stations, hospitals, main highways, and water supply plants.
          </p>
        </motion.div>

        {/* Needs Action */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
            <WarningAmberRounded fontSize="small" />
            <span>Needs Sandbags or Care</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-rose-950">{criticalCount}</span>
            <span className="text-xs text-rose-700 font-bold">In Flood Path</span>
          </div>
          <p className="mt-1.5 text-xs text-rose-800 leading-snug font-medium">
            Places close to the beach where wave waters might reach electrical equipment.
          </p>
        </motion.div>

        {/* High Risk Watch */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldRounded fontSize="small" />
            <span>High Wind Watch</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-950">{highCount}</span>
            <span className="text-xs text-amber-700 font-bold">Locations</span>
          </div>
          <p className="mt-1.5 text-xs text-amber-800 leading-snug font-medium">
            Watching for flying tree branches and strong wind gusts.
          </p>
        </motion.div>

        {/* Hardened / Prepared */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-xs"
        >
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
            <CheckCircleRounded fontSize="small" />
            <span>Protected & Ready</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-950">
              {hardenedCount} of {infrastructure.length}
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              ({Math.round((hardenedCount / Math.max(1, infrastructure.length)) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-emerald-200 h-2 rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(hardenedCount / Math.max(1, infrastructure.length)) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-emerald-600 h-full rounded-full transition-all"
            />
          </div>
          <p className="mt-1.5 text-xs text-emerald-800 leading-snug font-medium">
            Sandbagged, backup power tested, and emergency staff ready!
          </p>
        </motion.div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <SearchRounded fontSize="small" />
          </div>
          <input
            type="text"
            placeholder="Search hospital, power station, highway..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 text-xs font-medium"
          />
        </div>

        {/* Type & Risk Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">Show All Categories</option>
            <option value="power_substation">⚡ Power Stations (PWR)</option>
            <option value="arterial_highway">🛣️ Evacuation Highways (HWY)</option>
            <option value="hospital_shelter">🏥 Hospitals & Shelters (MED)</option>
            <option value="water_facility">💧 Clean Water Plants (WTR)</option>
            <option value="telecom_tower">📡 Cell & Radio Towers (TEL)</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Preparedness Statuses</option>
            <option value="critical">⚠️ Needs Immediate Care</option>
            <option value="high">👀 High Risk Watch</option>
            <option value="hardened">✅ Protected & Ready</option>
          </select>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {(filteredAssets || []).map((asset) => {
          const isHardened = asset.isHardened;
          const info = getTypeInfo(asset.type);

          return (
            <motion.div
              key={asset.id}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-3xl border-2 transition-all shadow-xs ${
                isHardened
                  ? "bg-emerald-50/50 border-emerald-300"
                  : asset.riskLevel === "CRITICAL"
                  ? "bg-rose-50/50 border-rose-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-sky-700">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{asset.name}</h4>
                    <span className="text-xs text-slate-500 font-semibold">
                      {info.label} · {asset.capacityOrRating}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isHardened ? (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircleRounded fontSize="inherit" />
                      <span>Protected</span>
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                        asset.riskLevel === "CRITICAL"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      <WarningAmberRounded fontSize="inherit" />
                      <span>{asset.riskLevel === "CRITICAL" ? "Flood Alert" : "Wind Watch"}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600">
                <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Ground Height:</span>
                  <span className="font-bold text-slate-800">{asset.elevationM}m above sea</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Distance to Beach:</span>
                  <span className="font-bold text-slate-800">{asset.distanceToCoastKm} km</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 text-[10px] block">Expected Water:</span>
                  <span className={asset.inundationDepthM > 1 ? "text-rose-700 font-black" : "font-bold text-slate-800"}>
                    +{asset.inundationDepthM}m
                  </span>
                </div>
              </div>

              {/* Safety Action Directive */}
              <div className="mt-3 p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-snug flex items-start gap-2">
                <BuildRounded className="text-slate-400 shrink-0 mt-0.5" fontSize="small" />
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">
                    What Helpers Are Doing:
                  </span>
                  {asset.hardeningAction}
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleHardening(asset.id)}
                className={`mt-3 w-full py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                  isHardened
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                    : "bg-sky-600 hover:bg-sky-700 text-white border-transparent shadow-xs"
                }`}
              >
                <ShieldRounded fontSize="small" />
                <span>{isHardened ? "Protected & Prepared (Click to Reset)" : "Mark as Protected"}</span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
