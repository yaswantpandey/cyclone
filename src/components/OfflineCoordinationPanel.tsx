import React, { useState } from "react";
import { motion } from "motion/react";
import { OfflineActionTask, OutboxRadioMessage, CycloneSystem, SurgeMetrics, RainfallMetrics } from "../types/cyclone";
import BackpackRounded from "@mui/icons-material/BackpackRounded";
import RadioRounded from "@mui/icons-material/RadioRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import SendRounded from "@mui/icons-material/SendRounded";
import PrintRounded from "@mui/icons-material/PrintRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import WifiOffRounded from "@mui/icons-material/WifiOffRounded";
import WifiRounded from "@mui/icons-material/WifiRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";

interface OfflineCoordinationPanelProps {
  tasks: OfflineActionTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<OfflineActionTask, "id" | "completed">) => void;
  outboxMessages: OutboxRadioMessage[];
  onAddOutboxMessage: (msg: { recipient: string; frequencyOrChannel: string; content: string; priority: "FLASH" | "IMMEDIATE" | "PRIORITY" }) => void;
  onTransmitAllQueued: () => void;
  isOfflineMode: boolean;
  cyclone: CycloneSystem;
  surgeMetrics: SurgeMetrics;
  rainfallMetrics: RainfallMetrics;
  onExportIAP: () => void;
}

export const OfflineCoordinationPanel: React.FC<OfflineCoordinationPanelProps> = ({
  tasks = [],
  onToggleTask,
  onAddTask,
  outboxMessages = [],
  onAddOutboxMessage,
  onTransmitAllQueued,
  isOfflineMode,
  onExportIAP,
}) => {
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>("ALL");
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<OfflineActionTask["category"]>("EVACUATION");
  const [newTaskTimeframe, setNewTaskTimeframe] = useState<OfflineActionTask["timeframe"]>("T-12h");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  const [newRadioRecipient, setNewRadioRecipient] = useState("");
  const [newRadioChannel, setNewRadioChannel] = useState("VHF 145.225 MHz / Marine Ch 16");
  const [newRadioContent, setNewRadioContent] = useState("");
  const [newRadioPriority, setNewRadioPriority] = useState<"FLASH" | "IMMEDIATE" | "PRIORITY">("IMMEDIATE");

  const safeTasks = tasks || [];
  const safeOutbox = outboxMessages || [];
  const completedCount = safeTasks.filter((t) => t.completed).length;
  const queuedCount = safeOutbox.filter((m) => m.status === "QUEUED_OFFLINE").length;

  const filteredTasks = safeTasks.filter(
    (t) => activeFilterCategory === "ALL" || t.category === activeFilterCategory
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      task: newTaskTitle.trim(),
      category: newTaskCategory,
      timeframe: newTaskTimeframe,
      assignedTo: newTaskAssignee.trim() || "Local Safety Volunteer",
      isCrucial: true,
    });
    setNewTaskTitle("");
    setNewTaskAssignee("");
    setShowNewTaskForm(false);
  };

  const handleSendRadio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRadioContent.trim() || !newRadioRecipient.trim()) return;
    onAddOutboxMessage({
      recipient: newRadioRecipient.trim(),
      frequencyOrChannel: newRadioChannel,
      content: newRadioContent.trim(),
      priority: newRadioPriority,
    });
    setNewRadioContent("");
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
      <div className="bg-white border-2 border-rose-100 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl">
            <BackpackRounded fontSize="medium" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Emergency Field Kit & Walkie-Talkies
              </h2>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  isOfflineMode
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300"
                }`}
              >
                {isOfflineMode ? <WifiOffRounded fontSize="inherit" /> : <WifiRounded fontSize="inherit" />}
                <span>{isOfflineMode ? "Offline Mode (Saved on Device)" : "Connected"}</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Works completely without WiFi! Everything is safely stored in your browser so emergency helpers can check tasks anywhere.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExportIAP}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start md:self-auto flex items-center gap-1.5"
        >
          <PrintRounded fontSize="small" />
          <span>Print Action Plan</span>
        </motion.button>
      </div>

      {/* Main Grid: Task Checklist & Walkie-Talkie Radio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Safety Task Checklist */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircleRounded className="text-emerald-600" fontSize="small" />
                  <span>Safety Checklist Tasks</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Completed: <strong className="text-emerald-700 font-bold">{completedCount}</strong> of {safeTasks.length} tasks ready
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <AddRounded fontSize="small" />
                <span>Add Task</span>
              </motion.button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
              {["ALL", "EVACUATION", "GRID HARDENING", "HEALTH & SHELTER", "LOGISTICS", "COMMS"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilterCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterCategory === cat
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* New Task Form */}
            {showNewTaskForm && (
              <form onSubmit={handleCreateTask} className="p-4 rounded-2xl border-2 border-sky-200 bg-sky-50/60 mb-3 space-y-3">
                <span className="font-bold text-slate-900 text-xs block">
                  Add New Safety Task
                </span>
                <input
                  type="text"
                  placeholder="e.g. Check backup flashlight batteries in school shelter..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="EVACUATION">Evacuation</option>
                    <option value="GRID HARDENING">Power & Safety</option>
                    <option value="HEALTH & SHELTER">Health & Shelter</option>
                    <option value="LOGISTICS">Food & Water</option>
                    <option value="COMMS">Radio & Signs</option>
                  </select>
                  <select
                    value={newTaskTimeframe}
                    onChange={(e) => setNewTaskTimeframe(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="T-24h">T-24h (1 Day Before)</option>
                    <option value="T-12h">T-12h (12 Hours Before)</option>
                    <option value="T-6h">T-6h (6 Hours Before)</option>
                    <option value="T-0h">Landfall Time</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Helper name or team"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNewTaskForm(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Tasks List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredTasks.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => onToggleTask(t.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs ${
                    t.completed
                      ? "bg-emerald-50/60 border-emerald-300 opacity-80"
                      : "bg-slate-50 border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-emerald-600 cursor-pointer pointer-events-none"
                    />
                    <div>
                      <div className={`font-bold ${t.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                        {t.task}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <PersonRounded fontSize="inherit" />
                          <span>{t.assignedTo}</span>
                        </span>
                        <span>·</span>
                        <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                          {t.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {t.completed ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <CheckCircleRounded fontSize="inherit" />
                        <span>Done!</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        To Do
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Walkie-Talkie Radio Outbox */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <RadioRounded className="text-sky-600" fontSize="small" />
                  <span>Walkie-Talkie Radio Outbox</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Send simple radio messages when cell towers lose power
                </p>
              </div>

              {queuedCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onTransmitAllQueued}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <SendRounded fontSize="small" />
                  <span>Broadcast All ({queuedCount})</span>
                </motion.button>
              )}
            </div>

            {/* Compose Message Form */}
            <form onSubmit={handleSendRadio} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-3 space-y-2.5">
              <span className="font-bold text-slate-800 text-xs block">
                Draft a Radio Broadcast Message
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Recipient (e.g. Coastguard)"
                  value={newRadioRecipient}
                  onChange={(e) => setNewRadioRecipient(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-medium"
                  required
                />
                <select
                  value={newRadioPriority}
                  onChange={(e) => setNewRadioPriority(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700"
                >
                  <option value="FLASH">🔴 Urgent Flash</option>
                  <option value="IMMEDIATE">🟡 Important</option>
                  <option value="PRIORITY">🟢 Standard</option>
                </select>
              </div>

              <textarea
                placeholder="Type your message: e.g. Highway 16 water depth 30cm, trucks please slow down..."
                value={newRadioContent}
                onChange={(e) => setNewRadioContent(e.target.value)}
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                required
              />

              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-semibold">{newRadioChannel}</span>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <AddRounded fontSize="small" />
                  <span>Add to Radio Queue</span>
                </motion.button>
              </div>
            </form>

            {/* Outbox Queue */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {safeOutbox.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No radio messages queued right now.
                </div>
              ) : (
                safeOutbox.map((msg) => (
                  <motion.div
                    key={msg.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3 rounded-2xl border text-xs ${
                      msg.status === "TRANSMITTED"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 text-xs">
                        To: {msg.recipient}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5">
                        {msg.status === "TRANSMITTED" ? (
                          <>
                            <CheckCircleRounded fontSize="inherit" className="text-emerald-600" />
                            <span>Sent Over Radio</span>
                          </>
                        ) : (
                          <span>⏳ Ready in Radio Queue</span>
                        )}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      "{msg.content}"
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
