import React, { useState } from "react";
import { EarlyWarningAdvisory, CycloneSystem } from "../types/cyclone";

interface EarlyWarningAdvisoriesProps {
  advisories: EarlyWarningAdvisory[];
  cyclone: CycloneSystem;
  onQueueRadioMessage?: (msg: { recipient: string; content: string; priority: "FLASH" | "IMMEDIATE" | "PRIORITY" }) => void;
  onRegenerateAdvisories?: () => void;
  isGenerating?: boolean;
  onRegenerate?: () => void;
  surgeMetrics?: any;
  rainfallMetrics?: any;
}

export const EarlyWarningAdvisories: React.FC<EarlyWarningAdvisoriesProps> = ({
  advisories = [],
  cyclone,
  onQueueRadioMessage,
  onRegenerateAdvisories,
  onRegenerate,
  isGenerating = false,
}) => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [queuedSnippet, setQueuedSnippet] = useState<boolean>(false);

  const triggerRegenerate = onRegenerateAdvisories || onRegenerate;
  const safeAdvisories = Array.isArray(advisories) && advisories.length > 0 ? advisories : [];
  const activeAdvisory = safeAdvisories[selectedRoleIndex] || safeAdvisories[0] || null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQueueToRadio = () => {
    if (!activeAdvisory || !onQueueRadioMessage) return;
    onQueueRadioMessage({
      recipient: activeAdvisory.role,
      content: activeAdvisory.broadcastSnippet || activeAdvisory.subject,
      priority: activeAdvisory.priority === "CRITICAL" ? "FLASH" : "IMMEDIATE",
    });
    setQueuedSnippet(true);
    setTimeout(() => setQueuedSnippet(false), 2500);
  };

  const getRoleEmoji = (role: string) => {
    if (role.toLowerCase().includes("executive") || role.toLowerCase().includes("family")) return "👨‍👩‍👧‍👦";
    if (role.toLowerCase().includes("rescue") || role.toLowerCase().includes("ndrf")) return "🚑";
    if (role.toLowerCase().includes("power") || role.toLowerCase().includes("electric")) return "⚡";
    if (role.toLowerCase().includes("radio") || role.toLowerCase().includes("broadcast")) return "📻";
    return "🛡️";
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Friendly Overview Banner */}
      <div className="bg-white border-2 border-indigo-100 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Helpful Storm Safety Action Guides
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Clear, easy-to-follow safety plans for families, emergency rescue workers, power crews, and coastal radio stations.
            </p>
          </div>
        </div>

        {triggerRegenerate && (
          <button
            onClick={triggerRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer self-start md:self-auto flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>{isGenerating ? "Writing Guides..." : "Refresh Safety Guides"}</span>
          </button>
        )}
      </div>

      {isGenerating ? (
        /* Friendly Generating State */
        <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-indigo-800 font-bold text-sm">
            <span className="w-3 h-3 rounded-full bg-indigo-500 animate-ping"></span>
            <span>Writing easy safety tips for Cyclone {cyclone.name}...</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1.5 pl-5">
            <div>👨‍👩‍👧‍👦 Creating simple checklists for families and school shelters</div>
            <div>⚡ Preparing instructions for power and water teams</div>
            <div>📻 Formatting helpful announcements for emergency radio</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Role Selector List */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="text-xs font-bold text-slate-700 mb-2">
              Choose Who Needs Safety Tips:
            </div>

            {safeAdvisories.map((advisory, idx) => {
              const isSelected = selectedRoleIndex === idx;
              const emoji = getRoleEmoji(advisory.role);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedRoleIndex(idx)}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-xs ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-400 text-indigo-950 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <span>{emoji}</span>
                      <span>{advisory.role}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        advisory.priority === "CRITICAL"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {advisory.priority === "CRITICAL" ? "Urgent" : "Important"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{advisory.subject}</div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Advisory Memo */}
          {activeAdvisory && (
            <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-indigo-50 border border-indigo-100">
                    {getRoleEmoji(activeAdvisory.role)}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-indigo-700">Safety Guide For:</span>
                    <div className="font-extrabold text-slate-900 text-sm sm:text-base">{activeAdvisory.role}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{activeAdvisory.subject}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      activeAdvisory.priority === "CRITICAL"
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    {activeAdvisory.priority === "CRITICAL" ? "🔴 Urgent Action" : "🟡 Early Preparation"}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">Issued before landfall</div>
                </div>
              </div>

              {/* Action Directives List */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span>✅</span>
                  <span>Key Action Steps:</span>
                </div>
                <div className="space-y-2">
                  {(activeAdvisory.actions || []).map((action, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {i + 1}
                      </span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radio Broadcast / Public Snippet */}
              {activeAdvisory.broadcastSnippet && (
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                      <span>📢</span>
                      <span>Emergency Radio Announcement Script</span>
                    </span>
                    <button
                      onClick={() => handleCopy(activeAdvisory.broadcastSnippet!, 99)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                    >
                      {copiedIndex === 99 ? "✅ Copied!" : "📋 Copy Script"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-sky-100 leading-relaxed">
                    "{activeAdvisory.broadcastSnippet}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleCopy(activeAdvisory.actions?.join("\n") || "", 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedIndex === 1 ? "✅ Copied Checklist!" : "📋 Copy Checklist"}
                </button>

                {onQueueRadioMessage && (
                  <button
                    onClick={handleQueueToRadio}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>📡</span>
                    <span>{queuedSnippet ? "✅ Added to Radio Outbox!" : "Queue to Emergency Radio"}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
