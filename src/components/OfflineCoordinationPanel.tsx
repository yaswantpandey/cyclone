import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import WaterDropRounded from "@mui/icons-material/WaterDropRounded";
import RestaurantRounded from "@mui/icons-material/RestaurantRounded";
import FlashlightOnRounded from "@mui/icons-material/FlashlightOnRounded";
import MedicalServicesRounded from "@mui/icons-material/MedicalServicesRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import FolderZipRounded from "@mui/icons-material/FolderZipRounded";
import PetsRounded from "@mui/icons-material/PetsRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import LocalPhoneRounded from "@mui/icons-material/LocalPhoneRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import RestartAltRounded from "@mui/icons-material/RestartAltRounded";
import CalculateRounded from "@mui/icons-material/CalculateRounded";
import CheckBoxRounded from "@mui/icons-material/CheckBoxRounded";
import CheckBoxOutlineBlankRounded from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import ContentCopyRounded from "@mui/icons-material/ContentCopyRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import ChildCareRounded from "@mui/icons-material/ChildCareRounded";

export interface KitItem {
  id: string;
  name: string;
  category: "water" | "food" | "light" | "medical" | "gear" | "docs" | "kids";
  rationDetails: string;
  whyNeeded: string;
  isPacked: boolean;
  priority: "essential" | "recommended";
}

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

const DEFAULT_KIT_ITEMS: KitItem[] = [
  // Water & Hydration
  {
    id: "water-rations",
    name: "3-Day Drinking Water Rations",
    category: "water",
    rationDetails: "1 Gallon (3.8 Liters) per person per day",
    whyNeeded: "Municipal pipes can flood or lose pressure during severe storms.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "water-purification",
    name: "Water Purification Tablets or Filter",
    category: "water",
    rationDetails: "1 pack of chlorine dioxide or portable squeeze filter",
    whyNeeded: "Ensures emergency groundwater is safe from bacteria and runoff silt.",
    isPacked: false,
    priority: "essential",
  },
  {
    id: "water-canteen",
    name: "Durable Water Canteens or Bladders",
    category: "water",
    rationDetails: "1 lightweight leakproof bottle per family member",
    whyNeeded: "Easy to carry in hands or backpack if evacuating quickly.",
    isPacked: true,
    priority: "recommended",
  },

  // Food & Nutrition
  {
    id: "food-cans",
    name: "3-Day Ready-to-Eat Canned Meals",
    category: "food",
    rationDetails: "Tuna, chicken, hearty beans, chili, and ready stews",
    whyNeeded: "Provides high protein and needs no refrigeration or stove power.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "food-opener",
    name: "Manual Hand Can Opener",
    category: "food",
    rationDetails: "Rotary mechanical opener",
    whyNeeded: "Electric openers will not work without wall power!",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "food-energy",
    name: "High-Energy Bars, Nuts & Dried Fruits",
    category: "food",
    rationDetails: "Granola bars, trail mix, peanut butter pouches",
    whyNeeded: "Quick carbohydrate energy that stays fresh for months.",
    isPacked: false,
    priority: "essential",
  },
  {
    id: "food-infant",
    name: "Baby Formula & Infant Food Pouches",
    category: "food",
    rationDetails: "Powdered formula, sterile bottles, pureed fruit",
    whyNeeded: "Special nutritional needs for the littlest family members.",
    isPacked: false,
    priority: "recommended",
  },

  // Light, Power & Radio
  {
    id: "power-radio",
    name: "Solar & Hand-Crank Emergency NOAA/FM Radio",
    category: "light",
    rationDetails: "With built-in crank generator and USB charging",
    whyNeeded: "Receives government weather updates when cellular network is down.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "power-flashlight",
    name: "LED Flashlights & Hands-Free Headlamps",
    category: "light",
    rationDetails: "At least 1 per adult + 1 spare per family",
    whyNeeded: "Headlamps keep both hands free for packing or carrying children.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "power-batteries",
    name: "Spare Alkaline Batteries in Sealed Bag",
    category: "light",
    rationDetails: "AA and AAA packs in a waterproof ziplock",
    whyNeeded: "Power outages from cyclones often last 3 to 7 days.",
    isPacked: false,
    priority: "essential",
  },
  {
    id: "power-bank",
    name: "20,000mAh Portable Phone Power Bank",
    category: "light",
    rationDetails: "Fully charged with braided USB-C and Lightning cables",
    whyNeeded: "Keeps smartphones alive for emergency SMS and GPS location.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "power-matches",
    name: "Waterproof Matches or Sealed Lighter",
    category: "light",
    rationDetails: "Windproof storm matches in airtight case",
    whyNeeded: "Emergency heating or lighting candles in dry rooms.",
    isPacked: false,
    priority: "recommended",
  },

  // First Aid & Health
  {
    id: "med-rx",
    name: "7-Day Supply of Daily Prescription Medicines",
    category: "medical",
    rationDetails: "Heart, blood pressure, asthma inhalers, insulin",
    whyNeeded: "Pharmacies will likely remain closed for several days after landfall.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "med-firstaid",
    name: "Comprehensive First Aid Box",
    category: "medical",
    rationDetails: "Bandages, sterile gauze rolls, antiseptic, adhesive tape",
    whyNeeded: "Treats scratches, small cuts, and debris injuries immediately.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "med-thermal",
    name: "Mylar Thermal Space Blankets",
    category: "medical",
    rationDetails: "1 silver reflective foil blanket per person",
    whyNeeded: "Prevents hypothermia if caught in cold driving rain or wet clothes.",
    isPacked: false,
    priority: "essential",
  },
  {
    id: "med-masks",
    name: "N95 Respirator Dust Masks",
    category: "medical",
    rationDetails: "2 per person",
    whyNeeded: "Protects lungs from flood debris dust, insulation, and mold spores.",
    isPacked: false,
    priority: "recommended",
  },

  // Personal Gear & Safety
  {
    id: "gear-whistle",
    name: "High-Decibel Emergency Rescue Whistle",
    category: "gear",
    rationDetails: "Pealess whistle on a lanyard",
    whyNeeded: "A whistle carries 1 mile over storm roar without exhausting your vocal cords!",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "gear-poncho",
    name: "Heavy-Duty Rain Ponchos & Windbreakers",
    category: "gear",
    rationDetails: "Rip-stop waterproof hooded ponchos",
    whyNeeded: "Keeps core body dry while navigating between house and vehicle.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "gear-boots",
    name: "Sturdy Closed-Toe Walking or Rain Boots",
    category: "gear",
    rationDetails: "Thick rubber or leather soles",
    whyNeeded: "Protects feet from hidden nails, sheet metal, and sharp glass in puddles.",
    isPacked: false,
    priority: "essential",
  },
  {
    id: "gear-gloves",
    name: "Heavy-Duty Work Gloves",
    category: "gear",
    rationDetails: "Puncture-resistant leather/canvas gloves",
    whyNeeded: "Safely move broken tree branches and sharp debris out of doorways.",
    isPacked: false,
    priority: "recommended",
  },

  // Documents & Cash
  {
    id: "docs-folder",
    name: "Waterproof Zipper Pouch for ID & Documents",
    category: "docs",
    rationDetails: "IDs, birth certificates, deeds, insurance policy numbers",
    whyNeeded: "Critical proof for accessing emergency shelters and relief aid.",
    isPacked: true,
    priority: "essential",
  },
  {
    id: "docs-cash",
    name: "Small Denomination Emergency Cash ($10, $20)",
    category: "docs",
    rationDetails: "$100 to $200 in small bills and coins",
    whyNeeded: "Credit card terminals and bank ATMs stop working when power is down.",
    isPacked: false,
    priority: "essential",
  },

  // Kids & Pets
  {
    id: "kids-comfort",
    name: "Children's Comfort Item & Activity Pack",
    category: "kids",
    rationDetails: "Favorite small stuffed animal, coloring book, and crayons",
    whyNeeded: "Calms young children and reduces storm anxiety during shelter stays.",
    isPacked: true,
    priority: "recommended",
  },
  {
    id: "pets-kit",
    name: "Pet Carrier, Leash & 3-Day Pet Kibble",
    category: "kids",
    rationDetails: "Sturdy pet crate, collar with phone tag, canned/dry pet food",
    whyNeeded: "Most emergency shelters require pets to be crated or leashed for safety.",
    isPacked: false,
    priority: "recommended",
  },
];

export const OfflineCoordinationPanel: React.FC<OfflineCoordinationPanelProps> = ({
  tasks = [],
  onToggleTask,
  onAddTask,
  outboxMessages = [],
  onAddOutboxMessage,
  onTransmitAllQueued,
  isOfflineMode,
  cyclone,
  onExportIAP,
}) => {
  // Navigation tabs within the Emergency Kit page
  const [activeSection, setActiveSection] = useState<"gobag" | "calculator" | "tasks" | "radio" | "contacts" | "detective">("gobag");

  // Go-Bag items state
  const [kitItems, setKitItems] = useState<KitItem[]>(DEFAULT_KIT_ITEMS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [showOnlyUnpacked, setShowOnlyUnpacked] = useState(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemCategory, setCustomItemCategory] = useState<KitItem["category"]>("gear");
  const [customItemReason, setCustomItemReason] = useState("");

  // Family Ration Calculator state
  const [numAdults, setNumAdults] = useState(2);
  const [numKids, setNumKids] = useState(2);
  const [numPets, setNumPets] = useState(1);
  const [numDays, setNumDays] = useState(3);

  // Safety Tasks filter & form state
  const [activeTaskCategory, setActiveTaskCategory] = useState<string>("ALL");
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<OfflineActionTask["category"]>("EVACUATION");
  const [newTaskTimeframe, setNewTaskTimeframe] = useState<OfflineActionTask["timeframe"]>("T-12h");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  // Radio Outbox state
  const [newRadioRecipient, setNewRadioRecipient] = useState("");
  const [newRadioChannel, setNewRadioChannel] = useState("VHF 145.225 MHz / Marine Ch 16");
  const [newRadioContent, setNewRadioContent] = useState("");
  const [newRadioPriority, setNewRadioPriority] = useState<"FLASH" | "IMMEDIATE" | "PRIORITY">("IMMEDIATE");
  const [isTransmittingBeep, setIsTransmittingBeep] = useState(false);

  // Pocket Contact Card state
  const [contactFamilyName, setContactFamilyName] = useState("The Sharma Family");
  const [contactOutOfTownName, setContactOutOfTownName] = useState("Uncle David (Bangalore)");
  const [contactOutOfTownPhone, setContactOutOfTownPhone] = useState("+91 98765 43210");
  const [contactMeetingSpot, setContactMeetingSpot] = useState("City High School Memorial Ground");
  const [contactDoctorName, setContactDoctorName] = useState("Dr. Rao (District Community Clinic)");
  const [contactDoctorPhone, setContactDoctorPhone] = useState("+91 91234 56789");
  const [contactCopied, setContactCopied] = useState(false);

  // Junior Storm Detective Missions state
  const [detectiveMissions, setDetectiveMissions] = useState([
    { id: 1, title: "Flashlight Inspector", desc: "Find every flashlight in the house, check the batteries, and turn each one ON!", done: true, icon: "🔦" },
    { id: 2, title: "Water Bottle Sentry", desc: "Help count clean water bottles in the kitchen and store them away from the floor.", done: true, icon: "💧" },
    { id: 3, title: "Comfort Scout", desc: "Choose one favorite book, coloring pad, or small stuffed toy to put in your backpack.", done: false, icon: "🧸" },
    { id: 4, title: "Safe Spot Explorer", desc: "Walk with grown-ups to test your interior safe room (away from glass windows!).", done: false, icon: "🏠" },
  ]);

  // Derived statistics for Go-Bag
  const totalItemsCount = kitItems.length;
  const packedItemsCount = kitItems.filter((item) => item.isPacked).length;
  const packedPercentage = Math.round((packedItemsCount / totalItemsCount) * 100);

  // Filtered Go-Bag items
  const filteredKitItems = useMemo(() => {
    return kitItems.filter((item) => {
      if (activeCategoryFilter !== "all" && item.category !== activeCategoryFilter) return false;
      if (showOnlyUnpacked && item.isPacked) return false;
      return true;
    });
  }, [kitItems, activeCategoryFilter, showOnlyUnpacked]);

  // Toggle packing state of an item
  const handleTogglePackItem = (id: string) => {
    setKitItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPacked: !item.isPacked } : item))
    );
  };

  // Add custom item to the kit
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    const newItem: KitItem = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      category: customItemCategory,
      rationDetails: "Custom family item",
      whyNeeded: customItemReason.trim() || "Important for our family's safety.",
      isPacked: true,
      priority: "recommended",
    };
    setKitItems((prev) => [newItem, ...prev]);
    setCustomItemName("");
    setCustomItemReason("");
    setShowAddCustomModal(false);
  };

  // Reset kit items
  const handleResetKit = () => {
    if (window.confirm("Reset all kit items to default?")) {
      setKitItems(DEFAULT_KIT_ITEMS);
    }
  };

  // Safe tasks count
  const safeTasks = tasks || [];
  const safeOutbox = outboxMessages || [];
  const completedTaskCount = safeTasks.filter((t) => t.completed).length;
  const queuedRadioCount = safeOutbox.filter((m) => m.status === "QUEUED_OFFLINE").length;

  const filteredTasks = safeTasks.filter(
    (t) => activeTaskCategory === "ALL" || t.category === activeTaskCategory
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      task: newTaskTitle.trim(),
      category: newTaskCategory,
      timeframe: newTaskTimeframe,
      assignedTo: newTaskAssignee.trim() || "Family / Helper",
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

  const handleQuickRadioTemplate = (text: string) => {
    setNewRadioContent(text);
  };

  const handleSimulateBroadcastAll = () => {
    setIsTransmittingBeep(true);
    setTimeout(() => {
      onTransmitAllQueued();
      setIsTransmittingBeep(false);
    }, 1200);
  };

  const handleCopyContactCard = () => {
    const cardText = `--- EMERGENCY CONTACT CARD ---
Family: ${contactFamilyName}
Out-of-Town Relative: ${contactOutOfTownName} (${contactOutOfTownPhone})
Safe Meeting Point: ${contactMeetingSpot}
Primary Doctor: ${contactDoctorName} (${contactDoctorPhone})
Emergency VHF Channel: ${newRadioChannel}
Storm Watched: Cyclone ${cyclone.name}`;
    navigator.clipboard?.writeText(cardText);
    setContactCopied(true);
    setTimeout(() => setContactCopied(false), 2200);
  };

  // Toggle Detective mission
  const handleToggleMission = (id: number) => {
    setDetectiveMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };
  const detectiveDoneCount = detectiveMissions.filter((m) => m.done).length;

  // Dynamic calculations
  const totalWaterLiters = Math.round(((numAdults + numKids) * 3.8 + numPets * 1.9) * numDays);
  const totalWaterGallons = Math.round(totalWaterLiters / 3.785);
  const totalCalories = (numAdults * 2000 + numKids * 1500) * numDays;
  const recommendedFlashlights = Math.max(2, numAdults + 1);
  const recommendedBatteries = recommendedFlashlights * 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 text-xs font-sans touch-manipulation pb-8"
    >
      {/* 1. Header Banner & Section Switcher */}
      <div className="bg-white border-2 border-rose-100 rounded-3xl p-3.5 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
              <BackpackRounded fontSize="medium" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Emergency Go-Bag & Family Kit Hub
                </h1>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    isOfflineMode
                      ? "bg-rose-100 text-rose-800 border-rose-300"
                      : "bg-emerald-100 text-emerald-800 border-emerald-300"
                  }`}
                >
                  {isOfflineMode ? <WifiOffRounded fontSize="inherit" /> : <WifiRounded fontSize="inherit" />}
                  <span>{isOfflineMode ? "Offline Mode (Saved Locally)" : "Live Synced"}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Pack your 3-day survival go-bag, calculate water & food rations, write emergency cards, and practice radio drills!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExportIAP}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Print your complete action plan and packing checklist"
            >
              <PrintRounded fontSize="small" />
              <span>Print Kit Checklist</span>
            </motion.button>
          </div>
        </div>

        {/* Sub-Section Navigation Tabs (Thumb-Friendly on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 text-xs">
          <button
            onClick={() => setActiveSection("gobag")}
            className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeSection === "gobag"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <BackpackRounded fontSize="inherit" />
            <span>Go-Bag Checklist ({packedPercentage}%)</span>
          </button>

          <button
            onClick={() => setActiveSection("calculator")}
            className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeSection === "calculator"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <CalculateRounded fontSize="inherit" />
            <span>Ration Calculator</span>
          </button>

          <button
            onClick={() => setActiveSection("tasks")}
            className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeSection === "tasks"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <CheckBoxRounded fontSize="inherit" />
            <span>Safety Tasks ({completedTaskCount}/{safeTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveSection("radio")}
            className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeSection === "radio"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <RadioRounded fontSize="inherit" />
            <span>VHF Walkie-Talkie</span>
            {queuedRadioCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full font-black">
                {queuedRadioCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection("contacts")}
            className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeSection === "contacts"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <LocalPhoneRounded fontSize="inherit" />
            <span>Emergency ID Card</span>
          </button>

          <button
            onClick={() => setActiveSection("detective")}
            className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeSection === "detective"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            <EmojiEventsRounded fontSize="inherit" />
            <span>Kid Detective ({detectiveDoneCount}/4)</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION A: GO-BAG INTERACTIVE PACKING BUILDER */}
      {activeSection === "gobag" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Progress & Live Readiness Meter */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">Go-Bag Packing Readiness</span>
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                      packedPercentage >= 80
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : packedPercentage >= 50
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    {packedPercentage >= 100
                      ? "🎉 100% Fully Packed & Storm Ready!"
                      : packedPercentage >= 80
                      ? "🟢 Almost Ready (80%+ Packed)"
                      : packedPercentage >= 50
                      ? "🟡 In Progress (Halfway There)"
                      : "🔴 Needs Attention"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Packed <strong className="text-slate-800 font-bold">{packedItemsCount}</strong> of{" "}
                  <strong className="text-slate-800 font-bold">{totalItemsCount}</strong> survival essentials
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowAddCustomModal(true)}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <AddRounded fontSize="small" />
                  <span>Add Custom Item</span>
                </button>
                <button
                  onClick={handleResetKit}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Reset packing list"
                >
                  <RestartAltRounded fontSize="small" />
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${packedPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full transition-colors ${
                  packedPercentage >= 80
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : packedPercentage >= 50
                    ? "bg-gradient-to-r from-amber-500 to-emerald-500"
                    : "bg-gradient-to-r from-rose-500 to-amber-500"
                }`}
              />
            </div>

            {/* Quick Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All Items", icon: null },
                  { id: "water", label: "Water", icon: <WaterDropRounded fontSize="inherit" /> },
                  { id: "food", label: "Food", icon: <RestaurantRounded fontSize="inherit" /> },
                  { id: "light", label: "Light & Radio", icon: <FlashlightOnRounded fontSize="inherit" /> },
                  { id: "medical", label: "Medical", icon: <MedicalServicesRounded fontSize="inherit" /> },
                  { id: "gear", label: "Gear & Tools", icon: <ShieldRounded fontSize="inherit" /> },
                  { id: "docs", label: "Docs & Cash", icon: <FolderZipRounded fontSize="inherit" /> },
                  { id: "kids", label: "Kids & Pets", icon: <PetsRounded fontSize="inherit" /> },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeCategoryFilter === cat.id
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showOnlyUnpacked}
                  onChange={(e) => setShowOnlyUnpacked(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 cursor-pointer"
                />
                <span>Show Unpacked Only</span>
              </label>
            </div>
          </div>

          {/* Interactive Items Grid (Mobile Responsive) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredKitItems.map((item) => {
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleTogglePackItem(item.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                    item.isPacked
                      ? "bg-emerald-50/70 border-emerald-300 shadow-xs"
                      : "bg-white border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xl ${item.isPacked ? "text-emerald-600" : "text-slate-400"}`}>
                          {item.isPacked ? <CheckBoxRounded /> : <CheckBoxOutlineBlankRounded />}
                        </span>
                        <div>
                          <div className={`font-bold text-xs sm:text-sm ${item.isPacked ? "text-emerald-950" : "text-slate-900"}`}>
                            {item.name}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            {item.rationDetails}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          item.isPacked
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : item.priority === "essential"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.isPacked ? "✓ Packed" : item.priority === "essential" ? "Essential" : "Recommended"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-white/70 p-2 rounded-xl border border-slate-100">
                      💡 <strong className="font-semibold text-slate-800">Why needed:</strong> {item.whyNeeded}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 3. SECTION B: FAMILY WATER & FOOD RATION CALCULATOR */}
      {activeSection === "calculator" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
                <CalculateRounded fontSize="medium" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Family Water & Survival Ration Calculator
                </h2>
                <p className="text-xs text-slate-600">
                  Enter your family members to calculate exact gallons of water, calories, and flashlights for Cyclone {cyclone.name}.
                </p>
              </div>
            </div>

            {/* Interactive Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              {/* Adults */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <span className="text-xs font-bold text-slate-600 block">Adults (18+)</span>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    onClick={() => setNumAdults(Math.max(1, numAdults - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-black text-slate-900">{numAdults}</span>
                  <button
                    onClick={() => setNumAdults(numAdults + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <span className="text-xs font-bold text-slate-600 block">Children</span>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    onClick={() => setNumKids(Math.max(0, numKids - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-black text-slate-900">{numKids}</span>
                  <button
                    onClick={() => setNumKids(numKids + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Pets */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <span className="text-xs font-bold text-slate-600 block">Pets (Dogs / Cats)</span>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    onClick={() => setNumPets(Math.max(0, numPets - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-black text-slate-900">{numPets}</span>
                  <button
                    onClick={() => setNumPets(numPets + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Days */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <span className="text-xs font-bold text-slate-600 block">Days of Ration</span>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    onClick={() => setNumDays(Math.max(1, numDays - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-black text-amber-700">{numDays} Days</span>
                  <button
                    onClick={() => setNumDays(numDays + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Clean Water */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200">
                <div className="flex items-center justify-between text-sky-800 font-bold text-xs">
                  <span>Drinking Water</span>
                  <WaterDropRounded fontSize="small" className="text-sky-600" />
                </div>
                <div className="text-2xl font-black text-sky-950 mt-1">
                  {totalWaterLiters} Liters
                </div>
                <div className="text-xs font-bold text-sky-700 mt-0.5">
                  (~{totalWaterGallons} Gallons)
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Rule: 3.8L (1 gal) per human per day + 1.9L per pet per day for drinking & hygiene.
                </p>
              </div>

              {/* Food Calories */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200">
                <div className="flex items-center justify-between text-amber-800 font-bold text-xs">
                  <span>Food Calories</span>
                  <RestaurantRounded fontSize="small" className="text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-950 mt-1">
                  {totalCalories.toLocaleString()} kcal
                </div>
                <div className="text-xs font-bold text-amber-700 mt-0.5">
                  ~{Math.round(totalCalories / 450)} Ready-to-Eat Cans
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Ready-to-eat stews, tuna, peanut butter, and granola bars requiring no cooking.
                </p>
              </div>

              {/* Lights & Batteries */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200">
                <div className="flex items-center justify-between text-emerald-800 font-bold text-xs">
                  <span>Flashlights & Power</span>
                  <FlashlightOnRounded fontSize="small" className="text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {recommendedFlashlights} Lights
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-0.5">
                  + {recommendedBatteries} Spare Batteries
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Minimum 1 hands-free headlamp per adult plus spare AA/D cells in a dry ziplock.
                </p>
              </div>

              {/* Pet Supplies */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
                <div className="flex items-center justify-between text-purple-800 font-bold text-xs">
                  <span>Pet Survival Bag</span>
                  <PetsRounded fontSize="small" className="text-purple-600" />
                </div>
                <div className="text-2xl font-black text-purple-950 mt-1">
                  {numPets * numDays * 2} Meals
                </div>
                <div className="text-xs font-bold text-purple-700 mt-0.5">
                  + {numPets} Secure Carrier / Leashes
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Pack collars with written phone numbers, pet vaccination records, and a warm towel.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. SECTION C: COMMUNITY & HOME SAFETY TASKS BOARD */}
      {activeSection === "tasks" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircleRounded className="text-emerald-600" fontSize="small" />
                  <span>Cyclone Readiness Task Checklist</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Completed: <strong className="text-emerald-700 font-bold">{completedTaskCount}</strong> of {safeTasks.length} tasks ready
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 self-start sm:self-auto"
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
                  onClick={() => setActiveTaskCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTaskCategory === cat
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
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
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
                    <option value="Landfall">Landfall Time</option>
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
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredTasks.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ scale: 1.005 }}
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
        </motion.div>
      )}

      {/* 5. SECTION D: VHF WALKIE-TALKIE RADIO OUTBOX */}
      {activeSection === "radio" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
                  <RadioRounded fontSize="medium" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    VHF Walkie-Talkie Emergency Dispatcher
                  </h2>
                  <p className="text-xs text-slate-500">
                    Simulates short radio broadcasts over local frequencies when cellular base stations lose power.
                  </p>
                </div>
              </div>

              {queuedRadioCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSimulateBroadcastAll}
                  disabled={isTransmittingBeep}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <SendRounded fontSize="small" />
                  <span>{isTransmittingBeep ? "Transmitting Ch 16..." : `Broadcast All (${queuedRadioCount})`}</span>
                </motion.button>
              )}
            </div>

            {/* Quick 1-Click Message Presets */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                ⚡ Quick Emergency Radio Templates:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Family of 4 safely inside high school shelter, dry and accounted for.",
                  "Main coastal road flooded with 35cm water depth, small vehicles avoid.",
                  "Downed power line on Elm St sparking in standing water, stay clear!",
                  "Requesting clean drinking water tank refill at Community Center.",
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickRadioTemplate(preset)}
                    className="p-2 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs text-left font-medium transition-colors cursor-pointer"
                  >
                    💬 "{preset}"
                  </button>
                ))}
              </div>
            </div>

            {/* Compose Message Form */}
            <form onSubmit={handleSendRadio} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-2.5">
              <span className="font-bold text-slate-800 text-xs block">
                Draft an Outbox Radio Transmission
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Recipient (e.g. Coastguard / Shelter Caretaker)"
                  value={newRadioRecipient}
                  onChange={(e) => setNewRadioRecipient(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                  required
                />
                <select
                  value={newRadioChannel}
                  onChange={(e) => setNewRadioChannel(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <option value="VHF 145.225 MHz / Marine Ch 16">Marine Ch 16 (Emergency Call & Distress)</option>
                  <option value="VHF 144.500 MHz (Local Volunteers)">VHF 144.500 MHz (Volunteer Helpers)</option>
                  <option value="FRS Ch 1 (Family Walkie-Talkies)">FRS Ch 1 (Family Walkie-Talkies)</option>
                  <option value="HF 7.080 MHz (Disaster Regional Net)">HF 7.080 MHz (Amateur Disaster Net)</option>
                </select>
                <select
                  value={newRadioPriority}
                  onChange={(e) => setNewRadioPriority(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700"
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

              <div className="flex justify-end items-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <AddRounded fontSize="small" />
                  <span>Queue in Outbox</span>
                </motion.button>
              </div>
            </form>

            {/* Outbox Queue */}
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-2">
                Radio Transmission Queue ({safeOutbox.length} Messages)
              </span>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {safeOutbox.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No radio messages queued right now.
                  </div>
                ) : (
                  safeOutbox.map((msg) => (
                    <motion.div
                      key={msg.id}
                      whileHover={{ scale: 1.005 }}
                      className={`p-3 rounded-2xl border text-xs ${
                        msg.status === "TRANSMITTED"
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-xs">
                          To: {msg.recipient} <span className="text-[11px] text-slate-500 font-normal">({msg.frequencyOrChannel})</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5">
                          {msg.status === "TRANSMITTED" ? (
                            <>
                              <CheckCircleRounded fontSize="inherit" className="text-emerald-600" />
                              <span>Transmitted</span>
                            </>
                          ) : (
                            <span>⏳ Queued in Device</span>
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
        </motion.div>
      )}

      {/* 6. SECTION E: POCKET EMERGENCY ID CARD */}
      {activeSection === "contacts" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Form Inputs (Left) */}
            <div className="lg:col-span-6 bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <LocalPhoneRounded className="text-emerald-600" fontSize="small" />
                <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Emergency Pocket ID Card Maker
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Fill in your family's essential meeting point and phone numbers. Keep a printed or screenshotted copy in each child's backpack.
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Family / Household Name</label>
                <input
                  type="text"
                  value={contactFamilyName}
                  onChange={(e) => setContactFamilyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Out-of-Town Relative / Contact (Less likely affected by local outages)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Name & City"
                    value={contactOutOfTownName}
                    onChange={(e) => setContactOutOfTownName(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={contactOutOfTownPhone}
                    onChange={(e) => setContactOutOfTownPhone(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Safe Family Meeting Spot (Outside home)</label>
                <input
                  type="text"
                  value={contactMeetingSpot}
                  onChange={(e) => setContactMeetingSpot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Family Doctor or Pediatrician</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Doctor Name"
                    value={contactDoctorName}
                    onChange={(e) => setContactDoctorName(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Doctor Phone"
                    value={contactDoctorPhone}
                    onChange={(e) => setContactDoctorPhone(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Live Pocket Card Preview (Right) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="p-5 rounded-3xl bg-gradient-to-tr from-sky-600 to-indigo-700 text-white shadow-lg relative overflow-hidden border-4 border-white">
                {/* Decorative Badge */}
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <div className="text-[10px] tracking-wider uppercase font-black text-sky-200">
                        EMERGENCY POCKET CARD
                      </div>
                      <div className="font-black text-sm">{contactFamilyName}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                    CYCLONE SAFE
                  </span>
                </div>

                <div className="space-y-3 mt-3.5 text-xs">
                  <div>
                    <span className="text-[10px] text-sky-200 uppercase font-bold block">Safe Meeting Spot:</span>
                    <strong className="text-white text-xs sm:text-sm font-bold flex items-center gap-1 mt-0.5">
                      <HomeRounded fontSize="inherit" />
                      <span>{contactMeetingSpot}</span>
                    </strong>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-sky-200 uppercase font-bold block">Out-of-Town Relative:</span>
                      <div className="font-bold text-white mt-0.5">{contactOutOfTownName}</div>
                      <div className="text-sky-200 font-mono text-[11px]">{contactOutOfTownPhone}</div>
                    </div>

                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-sky-200 uppercase font-bold block">Doctor / Clinic:</span>
                      <div className="font-bold text-white mt-0.5">{contactDoctorName}</div>
                      <div className="text-sky-200 font-mono text-[11px]">{contactDoctorPhone}</div>
                    </div>
                  </div>

                  <div className="bg-black/20 p-2.5 rounded-xl border border-white/10 text-[11px]">
                    <span className="font-bold text-amber-300">📻 Emergency Frequency: </span>
                    <span>{newRadioChannel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleCopyContactCard}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ContentCopyRounded fontSize="small" />
                  <span>{contactCopied ? "✓ Card Copied!" : "Copy Pocket Card"}</span>
                </button>
                <button
                  onClick={onExportIAP}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <PrintRounded fontSize="small" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 7. SECTION F: KID'S STORM DETECTIVE BADGE */}
      {activeSection === "detective" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="bg-white border-2 border-purple-200 rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
                  <EmojiEventsRounded fontSize="medium" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Junior Storm Detective Missions
                  </h2>
                  <p className="text-xs text-slate-600">
                    Fun, kid-safe missions to help Mom, Dad, and family get ready for storm day!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                  {detectiveDoneCount === 4 ? "🎖️ All Missions Complete!" : `${detectiveDoneCount} of 4 Missions Done`}
                </span>
              </div>
            </div>

            {/* Missions List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detectiveMissions.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleToggleMission(m.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    m.done
                      ? "bg-purple-50/70 border-purple-300"
                      : "bg-slate-50 border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <span className="text-2xl shrink-0">{m.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-black text-xs sm:text-sm ${m.done ? "text-purple-950" : "text-slate-900"}`}>
                        Mission #{m.id}: {m.title}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        m.done ? "bg-purple-200 text-purple-900" : "bg-slate-200 text-slate-600"
                      }`}>
                        {m.done ? "✓ Complete!" : "To Do"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detective Badge Reward */}
            {detectiveDoneCount === 4 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-100 via-purple-100 to-sky-100 border-2 border-purple-300 text-center"
              >
                <div className="text-4xl mb-1">🎖️ 🏆 🌟</div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base">
                  Hooray! You Earned the "Official Junior Storm Detective" Badge!
                </h3>
                <p className="text-xs text-slate-700 mt-1 max-w-md mx-auto">
                  You helped your family get flashlight power, fresh water bottles, comfort toys, and a safe room ready. You are a true weather hero!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Custom Item Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xl max-w-md w-full"
          >
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">
              Add Personal Item to Go-Bag
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Add anything special your family needs (e.g. Grandma's glasses, insulin cooler, cat medication).
            </p>

            <form onSubmit={handleAddCustomItem} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Insulin Cooler & Syringes"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={customItemCategory}
                  onChange={(e) => setCustomItemCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                >
                  <option value="medical">Medical & Medicine</option>
                  <option value="water">Water & Hydration</option>
                  <option value="food">Food & Nutrition</option>
                  <option value="light">Light & Power</option>
                  <option value="gear">Gear & Safety Tools</option>
                  <option value="docs">Important Documents</option>
                  <option value="kids">Kids & Pet Care</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Why Needed</label>
                <input
                  type="text"
                  placeholder="e.g. Kept cold with ice pack for daily glucose control"
                  value={customItemReason}
                  onChange={(e) => setCustomItemReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-3.5 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Pack in Go-Bag
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
