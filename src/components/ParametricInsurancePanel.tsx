import React, { useState } from "react";
import { ParametricInsurancePolicy, CycloneSystem, SurgeMetrics } from "../types/cyclone";

interface ParametricInsurancePanelProps {
  policy: ParametricInsurancePolicy;
  cyclone: CycloneSystem;
  surgeMetrics: SurgeMetrics;
}

export const ParametricInsurancePanel: React.FC<ParametricInsurancePanelProps> = ({
  policy,
  cyclone,
  surgeMetrics,
}) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const totalPool = policy.totalLiquidityPoolUsd;
  const disbursed = policy.disbursedAmountUsd;

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Friendly Overview Banner */}
      <div className="bg-white border-2 border-amber-100 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">💰</span>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Community Emergency Relief Fund
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Learn how fast relief money works: Instead of waiting weeks after a storm, funds unlock <strong>before landfall</strong> as soon as satellites measure high winds!
            </p>
          </div>
        </div>
      </div>

      {/* 4 Colorful Readout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Emergency Fund */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
            <span>🏦</span>
            <span>Total Emergency Pool</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">
              ${(totalPool / 1000000).toFixed(1)}M
            </span>
            <span className="text-xs text-slate-500 font-semibold">USD</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-snug">
            Protected pool provided by state relief and partner organizations.
          </p>
        </div>

        {/* Immediate Liquidity Released */}
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
            <span>💸</span>
            <span>Money Ready Today</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-950">
              ${(disbursed / 1000000).toFixed(1)}M
            </span>
            <span className="text-xs text-emerald-700 font-bold">Available Now</span>
          </div>
          <p className="mt-1.5 text-xs text-emerald-800 leading-snug font-medium">
            Automatically sent 18 hours before the storm hits land!
          </p>
        </div>

        {/* Status */}
        <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-sky-800 uppercase tracking-wide flex items-center gap-1.5">
            <span>⚡</span>
            <span>Automatic Approval</span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-black text-sky-950">
              {policy.claimStatus === "APPROVED_PRE_LANDFALL" ? "✅ Approved Fast" : policy.claimStatus}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-sky-800 leading-snug">
            Weather satellites confirmed wind speed exceeded the danger limit.
          </p>
        </div>

        {/* Community Beneficiary */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
            <span>🤝</span>
            <span>Who Receives Help?</span>
          </div>
          <div className="mt-1 font-bold text-slate-900 text-sm truncate">{policy.insuredEntity}</div>
          <div className="text-xs text-slate-500 mt-1">Community Protection Policy #{policy.policyNumber}</div>
        </div>
      </div>

      {/* Satellite Check Triggers Table */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
          <div>
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🛰️</span>
              <span>How Weather Checks Unlock Money Instantly</span>
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              If wind or wave measurements pass the danger threshold, the bank transfers aid immediately
            </p>
          </div>

          <button
            onClick={() => setShowCertificateModal(true)}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1"
          >
            <span>📜</span>
            <span>View Relief Certificate</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-2.5 px-3">Weather Condition</th>
                <th className="py-2.5 px-3">Trigger Level</th>
                <th className="py-2.5 px-3">Satellite Reading</th>
                <th className="py-2.5 px-3">Aid Sent</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(policy?.triggers || []).map((trigger) => {
                const isTriggered = trigger.status === "TRIGGERED";

                return (
                  <tr key={trigger.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{trigger.parameter}</td>
                    <td className="py-3 px-3 text-slate-600 font-semibold">{trigger.threshold}</td>
                    <td className="py-3 px-3 font-black text-sky-700">{trigger.currentObserved}</td>
                    <td className="py-3 px-3 text-emerald-700 font-black">
                      ${(trigger.payoutAmountUsd / 1000000).toFixed(1)} Million
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isTriggered ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {isTriggered ? "✅ Funds Sent" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{trigger.verificationSource}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* How the Funds Are Spent */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="border-b border-slate-100 pb-2.5 mb-3">
          <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span>🛒</span>
            <span>What This $15.0 Million Buys for Families:</span>
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            Immediate supplies purchased and placed in shelters before the storm arrives
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-xl">💧</span>
            <div className="font-bold text-blue-900 text-xs mt-1">Clean Water & Baby Food ($5.5M)</div>
            <p className="text-[11px] text-blue-700 mt-1 leading-snug">
              Bottled drinking water, baby formula, water purification drops, and shelf-stable meal packs.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-xl">⚡</span>
            <div className="font-bold text-amber-900 text-xs mt-1">Backup Power & Fuel ($4.5M)</div>
            <p className="text-[11px] text-amber-700 mt-1 leading-snug">
              Diesel for hospital generators, mobile phone charging stations, and satellite communication links.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xl">🚑</span>
            <div className="font-bold text-emerald-900 text-xs mt-1">Rescue Boats & Medical Aid ($5.0M)</div>
            <p className="text-[11px] text-emerald-700 mt-1 leading-snug">
              Inflatable swift-water rescue craft, emergency trauma kits, blankets, and temporary roofing tarps.
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-amber-200 rounded-3xl max-w-lg w-full p-6 text-xs shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Emergency Relief Funding Certificate</h3>
                  <p className="text-[11px] text-slate-500">Official Early Action Guarantee</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs text-amber-950">
              <div className="flex justify-between">
                <span>Storm System:</span>
                <strong>{cyclone.name} ({cyclone.category})</strong>
              </div>
              <div className="flex justify-between">
                <span>Maximum Wind Speed:</span>
                <strong>{cyclone.maxWindSpeedKmph} km/h (Satellite Verified)</strong>
              </div>
              <div className="flex justify-between">
                <span>Immediate Relief Authorized:</span>
                <strong className="text-emerald-800 text-sm">$15,000,000 USD</strong>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <strong className="text-emerald-800">✅ Transferred to Disaster Response Teams</strong>
              </div>
            </div>

            <div className="text-slate-600 text-xs leading-relaxed">
              This certificate confirms that pre-arranged relief funds were unlocked ahead of landfall to support swift-water rescue, food delivery, and medical care for coastal residents.
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
