import React, { useState } from "react";
import { motion } from "motion/react";
import { CycloneSystem, CycloneCategory } from "../types/cyclone";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SpeedRounded from "@mui/icons-material/SpeedRounded";
import AirRounded from "@mui/icons-material/AirRounded";
import RocketLaunchRounded from "@mui/icons-material/RocketLaunchRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";

interface CustomScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomScenario: (customCyclone: CycloneSystem) => void;
  baseCyclone: CycloneSystem;
}

export const CustomScenarioModal: React.FC<CustomScenarioModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomScenario,
  baseCyclone,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState("SUPER-SPINNER");
  const [category, setCategory] = useState<CycloneCategory>("Extremely Severe Cyclonic Storm (ESCS)");
  const [pressure, setPressure] = useState<number>(945);
  const [windSpeed, setWindSpeed] = useState<number>(205);
  const [forwardSpeed, setForwardSpeed] = useState<number>(18);
  const [landfallEta, setLandfallEta] = useState<number>(14);
  const [landfallZone, setLandfallZone] = useState("Dhamra Estuary & Sundarbans Coast");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const r34 = Math.round(windSpeed * 1.55);
    const r50 = Math.round(windSpeed * 0.78);
    const r64 = Math.round(windSpeed * 0.38);

    const custom: CycloneSystem = {
      ...baseCyclone,
      id: `custom-${Date.now()}`,
      name: name.toUpperCase(),
      category,
      centralPressureHpa: pressure,
      maxWindSpeedKmph: windSpeed,
      gustsKmph: Math.round(windSpeed * 1.25),
      forwardSpeedKmph: forwardSpeed,
      landfallEstimateHours: landfallEta,
      landfallZone,
      windRadii: {
        r34Km: r34,
        r50Km: r50,
        r64Km: r64,
      },
      synopticOverview: `Custom simulated storm: ${name} (${category}) with central pressure ${pressure} hPa and maximum sustained winds of ${windSpeed} km/h approaching ${landfallZone}.`,
    };

    onApplyCustomScenario(custom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25 }}
        className="bg-white border-2 border-indigo-100 rounded-3xl max-w-lg w-full p-6 text-xs font-sans space-y-4 text-slate-700 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700">
              <ScienceRounded fontSize="medium" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Storm Weather Lab
              </h3>
              <p className="text-xs text-indigo-700">
                Design your own storm and see how high the waves rise!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            <CloseRounded fontSize="small" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Storm Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Name Your Storm:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Storm Strength Tier:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:border-indigo-500"
              >
                <option value="Cyclonic Storm (CS)">Cyclonic Storm (65-88 km/h)</option>
                <option value="Severe Cyclonic Storm (SCS)">Severe Storm (89-117 km/h)</option>
                <option value="Very Severe Cyclonic Storm (VSCS)">Very Severe Storm (118-165 km/h)</option>
                <option value="Extremely Severe Cyclonic Storm (ESCS)">Extremely Severe Storm (166-220 km/h)</option>
                <option value="Super Cyclonic Storm (SuCS)">Super Cyclone (&gt;220 km/h)</option>
              </select>
            </div>
          </div>

          {/* Wind Speed & Pressure Sliders */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1">
                  <AirRounded fontSize="inherit" className="text-rose-600" />
                  <span>Maximum Wind Speed:</span>
                </span>
                <span className="text-rose-600 font-black text-sm">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="90"
                max="260"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                {windSpeed > 200 ? "💨 Super destructive gusts! Capable of uprooting big trees." : "Strong tropical storm winds."}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1">
                  <SpeedRounded fontSize="inherit" className="text-sky-600" />
                  <span>Center Air Pressure:</span>
                </span>
                <span className="text-sky-700 font-black">{pressure} hPa</span>
              </div>
              <input
                type="range"
                min="910"
                max="995"
                value={pressure}
                onChange={(e) => setPressure(parseInt(e.target.value))}
                className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Fun Fact: Lower air pressure sucks up the ocean water beneath the storm like a straw!
              </span>
            </div>
          </div>

          {/* Speed & Arrival Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Forward Speed:</span>
                <span className="text-indigo-700 font-bold">{forwardSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={forwardSpeed}
                onChange={(e) => setForwardSpeed(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Time to Coast:</span>
                <span className="text-amber-700 font-bold">{landfallEta} hours</span>
              </div>
              <input
                type="range"
                min="6"
                max="36"
                value={landfallEta}
                onChange={(e) => setLandfallEta(parseInt(e.target.value))}
                className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <PlaceRounded fontSize="inherit" className="text-rose-500" />
              <span>Target Coastline Destination:</span>
            </label>
            <input
              type="text"
              value={landfallZone}
              onChange={(e) => setLandfallZone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <RocketLaunchRounded fontSize="small" />
              <span>Launch Simulation!</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
