import React from "react";
import { RainfallMetrics, CycloneSystem } from "../types/cyclone";

interface RainfallRunoffPanelProps {
  cyclone: CycloneSystem;
  rainfallMetrics: RainfallMetrics;
}

export const RainfallRunoffPanel: React.FC<RainfallRunoffPanelProps> = ({
  cyclone,
  rainfallMetrics,
}) => {
  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Friendly Overview Banner */}
      <div className="bg-white border-2 border-teal-100 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌧️</span>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Rain & River Flood Watch
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Track how much rain Cyclone {cyclone.name} drops, and see how water travels down rivers toward the coast.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Colorful Readout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Rainfall */}
        <div className="bg-white border-2 border-teal-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wide flex items-center gap-1.5">
            <span>🌧️</span>
            <span>2-Day Total Rain</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-teal-950">
              {rainfallMetrics.cumulativeRainfallMm}
            </span>
            <span className="text-xs text-slate-500 font-semibold">millimeters</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            Heaviest downpours near the storm center: up to {rainfallMetrics.peakRateMmPerHour} mm per hour!
          </p>
        </div>

        {/* Soil Moisture */}
        <div className="bg-white border-2 border-sky-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wide flex items-center gap-1.5">
            <span>🧽</span>
            <span>Ground Sponge Level</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-sky-950">
              {rainfallMetrics.soilSaturationPercent}%
            </span>
            <span className="text-xs text-slate-500 font-semibold">Soaked</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full"
              style={{ width: `${rainfallMetrics.soilSaturationPercent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            The soil is almost completely full, so rain runs straight into rivers and creeks.
          </p>
        </div>

        {/* River Spills */}
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
            <span>🏞️</span>
            <span>Rivers Overflowing</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-rose-950">
              {(rainfallMetrics.riverBasinAlerts || []).filter((r) => r.status === "Breaching").length}
            </span>
            <span className="text-xs text-rose-700 font-bold">of {(rainfallMetrics.riverBasinAlerts || []).length} Rivers</span>
          </div>
          <p className="mt-1.5 text-xs text-rose-800 leading-snug font-medium">
            High tide at the coast blocks river mouths, causing water to back up upstream!
          </p>
        </div>

        {/* Road Choke Points */}
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
            <span>🚗</span>
            <span>Low Road Underpasses</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-950">
              {(rainfallMetrics.flashFloodChokePoints || []).length}
            </span>
            <span className="text-xs text-slate-500 font-semibold">Flood Dips</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            Low highway sections where water pools quickly. Emergency pumps are being set up.
          </p>
        </div>
      </div>

      {/* River Gauges and Road Safety Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* River Gauges */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div>
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>🏞️</span>
                <span>River Water Height Meters</span>
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Live measurements showing water height compared to flood banks
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Active Gauges
            </span>
          </div>

          <div className="space-y-3">
            {(rainfallMetrics?.riverBasinAlerts || []).map((river, idx) => {
              const delta = parseFloat((river.currentLevelM - river.dangerLevelM).toFixed(2));
              const isBreaching = river.status === "Breaching";

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{river.river}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isBreaching
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : river.status === "Critical"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {isBreaching ? `🌊 +${delta}m Over Flood Mark` : `${Math.abs(delta)}m Below Danger`}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 mb-2">
                    <span>Current Water: <strong>{river.currentLevelM}m</strong></span>
                    <span>Flood Mark: <strong>{river.dangerLevelM}m</strong></span>
                  </div>

                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isBreaching ? "bg-rose-500" : river.status === "Critical" ? "bg-amber-500" : "bg-teal-500"
                      }`}
                      style={{ width: `${Math.min(100, (river.currentLevelM / (river.dangerLevelM * 1.05)) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-snug">
            <strong>Why River Water Backs Up:</strong> High ocean waves at the river mouth act like a closed gate, stopping the river from emptying into the sea and causing water to back up onto riverside roads.
          </div>
        </div>

        {/* Road Choke Points */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>🛣️</span>
                  <span>Highway Dips & Evacuation Roads</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Low culverts and bridge approaches that rescue teams are monitoring
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {(rainfallMetrics?.flashFloodChokePoints || []).map((choke, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors flex items-start justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{choke.location}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Ground height: {choke.elevationM}m · Rain collects here quickly
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      choke.riskLevel === "Critical"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {choke.riskLevel === "Critical" ? "⚠️ Needs Pump" : "👀 Watching"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-snug">
            <strong>Safe Road Tip for Families:</strong> "Turn around, don't drown!" Never walk or drive across moving water. Road rescue crews have already parked giant dewatering pumps along National Highway 16 to keep rescue lanes open.
          </div>
        </div>
      </div>
    </div>
  );
};
