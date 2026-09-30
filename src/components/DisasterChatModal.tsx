import React, { useState } from "react";
import { CycloneSystem, SurgeMetrics, RainfallMetrics } from "../types/cyclone";

interface DisasterChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  cyclone: CycloneSystem;
  surgeMetrics: SurgeMetrics;
  rainfallMetrics: RainfallMetrics;
}

interface ChatMessage {
  sender: "user" | "gemini";
  text: string;
  timestamp: string;
}

export const DisasterChatModal: React.FC<DisasterChatModalProps> = ({
  isOpen,
  onClose,
  cyclone,
  surgeMetrics,
  rainfallMetrics,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "gemini",
      text: `Hi there! 👋 I'm your friendly Storm Safety Guide for Cyclone ${cyclone.name}. We're watching winds of ${cyclone.maxWindSpeedKmph} km/h and coastal waves rising +${surgeMetrics.totalWaterLevelMeters}m above normal. How can I help you and your family prepare today?`,
      timestamp: "Ready",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "🎒 What should we pack in our storm safety bag?",
    "🌊 How high will the ocean waves get?",
    "⚡ Why do power companies turn off electricity?",
    "🐶 How do we keep our pets safe during high winds?",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isSending) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch("/api/gemini/disaster-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Please answer in a warm, encouraging, kid and family-friendly tone without robotic jargon: ${query.trim()}`,
          cyclone,
          surgeMetrics,
          rainfallMetrics,
        }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        sender: "gemini",
        text: data.reply || "Stay indoors away from windows! Keep fresh drinking water and flashlights handy.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "gemini",
          text: `Great question! For "${query}", the most important thing is to stay inside a sturdy shelter away from large windows, keep your phone and flashlights fully charged, and make sure you have plenty of clean bottled water.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-sky-100 rounded-3xl max-w-2xl w-full h-[600px] flex flex-col overflow-hidden text-xs font-sans shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/70">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-2 rounded-xl bg-white shadow-xs">💬</span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Friendly Storm Safety Guide
              </h3>
              <p className="text-xs text-sky-700">
                Ask questions about cyclone science, weather, and staying safe!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-sky-600 text-white shadow-xs rounded-br-xs"
                    : "bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-xs"
                }`}
              >
                <div>{m.text}</div>
                <div className={`text-[10px] mt-1.5 text-right ${m.sender === "user" ? "text-sky-200" : "text-slate-400"}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="p-3.5 rounded-2xl bg-white border border-sky-200 space-y-1 text-xs text-sky-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
              <span>Thinking of the best safety tip for you...</span>
            </div>
          )}
        </div>

        {/* Query Prompt Quick Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="font-bold text-slate-500 shrink-0 text-[11px]">Ideas:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about the storm, flood safety, or supplies..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
