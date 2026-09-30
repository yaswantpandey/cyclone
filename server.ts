import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
      aiClient = null;
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Vulnerability and Impact Assessment using Gemini
  app.post("/api/gemini/vulnerability-analysis", async (req: Request, res: Response) => {
    try {
      const { cyclone, infrastructureStats, surgeMetrics, rainfallMetrics, geeLayersActive } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // High-fidelity fallback modeling if API key is not configured or in sandbox
        return res.json({
          status: "simulated",
          analysis: generateFallbackAnalysis(cyclone, surgeMetrics, rainfallMetrics, infrastructureStats),
        });
      }

      const prompt = `
You are a friendly, encouraging weather and safety educator for CycloneWatch, helping kids, families, and community helpers understand storm safety.
Analyze this cyclone situation and explain the risks in clear, warm, friendly language (avoid robotic, bureaucratic, or overly scary jargon):

CYCLONE DETAILS:
- Storm Name: ${cyclone.name} (${cyclone.category})
- Max Wind Speed: ${cyclone.maxWindSpeedKmph} km/h (Strong gusts around ${Math.round(cyclone.maxWindSpeedKmph * 1.25)} km/h)
- Landfall ETA: Approaching coast in about ${cyclone.landfallEstimateHours} hours
- Approaching: ${cyclone.landfallZone || "Coastal towns and villages"}

WATER & RAIN:
- Sea Wave Rise: +${surgeMetrics.totalWaterLevelMeters}m above normal high tide (reaches up to ${surgeMetrics.inlandPenetrationKm} km inland)
- Rain Expected: ${rainfallMetrics.cumulativeRainfallMm} mm (Ground is ${rainfallMetrics.soilSaturationPercent}% full of water)

TOWN PLACES TO PROTECT:
- Power Stations: ${infrastructureStats?.substationsAtRisk || 3} near flood waters
- Roads: ${infrastructureStats?.arteriesAtRisk || 2} needing pump helpers
- Community Shelters & Hospitals: ${infrastructureStats?.sheltersInZone || 8} getting ready
- Emergency Fund: $15.0M released early to buy clean water and blankets!

Respond with a JSON object strictly matching this schema:
{
  "executiveSummary": "warm, friendly, easy-to-understand 2-3 sentence explanation of the storm and safety steps",
  "criticalLifelineRiskScore": {
    "powerGrid": number between 0 and 100,
    "arterialRoads": number between 0 and 100,
    "medicalShelters": number between 0 and 100,
    "waterTreatment": number between 0 and 100
  },
  "prioritizedActionTimeline": [
    {
      "timeWindow": "e.g. 18 Hours Before Landfall",
      "action": "friendly, clear safety action for families or helpers"
    }
  ],
  "parametricTriggerNote": "friendly explanation of how the $15M relief fund helps buy clean water, baby food, and rescue boats"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a warm, supportive, and knowledgeable storm safety guide for kids and families. You speak clearly and encouragingly without dry robotic or militaristic terms.",
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      let parsed = null;
      try {
        parsed = JSON.parse(response.text?.trim() || "{}");
      } catch (e) {
        console.warn("Could not parse JSON analysis from Gemini:", e);
      }

      if (parsed && parsed.executiveSummary && Array.isArray(parsed.prioritizedActionTimeline)) {
        return res.json({
          status: "success",
          analysis: parsed,
        });
      }

      res.json({
        status: "success",
        analysis: generateFallbackAnalysis(cyclone, surgeMetrics, rainfallMetrics, infrastructureStats),
      });
    } catch (error: any) {
      console.error("Gemini vulnerability analysis error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate AI vulnerability assessment",
        analysis: generateFallbackAnalysis(req.body?.cyclone, req.body?.surgeMetrics, req.body?.rainfallMetrics, req.body?.infrastructureStats),
      });
    }
  });

  // Automated Early-Warning Advisory Dispatches using Gemini
  app.post("/api/gemini/generate-advisories", async (req: Request, res: Response) => {
    try {
      const { cyclone, surgeMetrics, rainfallMetrics } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          status: "simulated",
          advisories: generateFallbackAdvisories(cyclone, surgeMetrics, rainfallMetrics),
        });
      }

      const prompt = `
Generate 6 helpful, easy-to-understand Storm Safety Action Guides for Cyclone ${cyclone.name} (${cyclone.category}, Winds: ${cyclone.maxWindSpeedKmph} km/h, Approaching Coast in ${cyclone.landfallEstimateHours} hours, Water Level: +${surgeMetrics.totalWaterLevelMeters}m).
Keep the tone warm, clear, and reassuring—friendly for children, families, and community helpers, avoiding robotic or scary language.

Format strictly as JSON with an array of advisories containing:
- role: string ("Families & Neighbors", "Rescue Helpers & Volunteers", "Power & Light Teams", "Health & Shelter Caretakers", "Community Radio Announcement", "Emergency Relief Fund")
- priority: "CRITICAL" | "URGENT" | "HIGH"
- timeframe: string (e.g., "1 Day Before", "12 Hours Before", "When Rain Starts")
- subject: string (friendly title)
- keyDirectives: string[] (3-4 friendly, actionable safety tips)
- fullDispatchText: string (clear explanation of why this step keeps everyone safe)
- broadcastSnippet: string (under 160 characters for simple radio or text message)
- language: string ("English / Community Languages")
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a caring, friendly safety educator helping communities prepare for tropical storms.",
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      let parsed = null;
      try {
        parsed = JSON.parse(response.text?.trim() || "{}");
      } catch (e) {
        console.warn("Could not parse JSON directly from Gemini, using structured text fallback");
      }

      res.json({
        status: "success",
        advisories: parsed?.advisories || parsed || generateFallbackAdvisories(cyclone, surgeMetrics, rainfallMetrics),
      });
    } catch (error: any) {
      console.error("Gemini advisory dispatch error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate advisories",
        advisories: generateFallbackAdvisories(req.body.cyclone, req.body.surgeMetrics, req.body.rainfallMetrics),
      });
    }
  });

  // Interactive Command & Tactical Query Assistant
  app.post("/api/gemini/disaster-chat", async (req: Request, res: Response) => {
    try {
      const { message, cyclone, surgeMetrics, rainfallMetrics } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          reply: `Here is a friendly safety tip for Cyclone ${cyclone.name}: Coastal waters will rise +${surgeMetrics.peakSurgeMeters}m as the storm nears land in ${cyclone.landfallEstimateHours} hours. Families living near the beach should move to community shelters early before roads get wet. Charge flashlights and keep fresh drinking water handy!`,
        });
      }

      const contextPrompt = `
You are the friendly CycloneWatch Storm Safety Guide. You explain storm science and safety in a warm, patient, kid-friendly way.
CURRENT STORM:
- Cyclone: ${cyclone.name} (${cyclone.category})
- Wind Speed: ${cyclone.maxWindSpeedKmph} km/h
- Ocean Water Rise: +${surgeMetrics.totalWaterLevelMeters}m
- Rain Total: ${rainfallMetrics.cumulativeRainfallMm} mm | Hours to Coast: ${cyclone.landfallEstimateHours}h
User Question: "${message}"

Give a kind, easy-to-understand answer with 2-3 clear tips. Explain science simply and reassuringly.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contextPrompt,
        config: {
          systemInstruction: "You are a warm, reassuring storm safety companion for families and kids. Avoid scary jargon or robotic terms.",
          temperature: 0.3,
        },
      });

      res.json({
        reply: response.text,
      });
    } catch (error: any) {
      console.error("Gemini disaster chat error:", error);
      res.json({
        reply: `Friendly Safety Tip: When winds reach high speeds, stay inside a sturdy concrete building and keep away from large windows. Make sure your flashlight has fresh batteries and you have a 3-day supply of drinking water!`,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CycloneWatch forecaster running on http://localhost:${PORT}`);
  });
}

function generateFallbackAnalysis(cyclone: any, surge: any, rain: any, _infra: any) {
  const isSuper = cyclone?.category?.includes("Super");
  const isExtreme = cyclone?.category?.includes("Extremely");
  return {
    executiveSummary: `Cyclone ${cyclone?.name || "Chandra"} is a strong storm with winds around ${cyclone?.maxWindSpeedKmph || 185} km/h approaching the coast in about ${cyclone?.landfallEstimateHours || 18} hours. Seawater is pushed inland up to +${surge?.totalWaterLevelMeters || 5.5}m above normal, so families near the beach should move to community shelters early. Helper teams have already staged water pumps and opened safe buildings!`,
    criticalLifelineRiskScore: {
      powerGrid: isSuper ? 92 : isExtreme ? 85 : 78,
      arterialRoads: isSuper ? 88 : isExtreme ? 82 : 74,
      medicalShelters: isSuper ? 60 : isExtreme ? 50 : 40,
      waterTreatment: isSuper ? 82 : isExtreme ? 72 : 65,
    },
    prioritizedActionTimeline: [
      {
        timeWindow: "18 Hours Before Storm",
        action: "Pack your family safety bag: drinking water, flashlights, warm blankets, and phone chargers.",
      },
      {
        timeWindow: "12 Hours Before Storm",
        action: "Move to a sturdy community shelter or stay with friends living on higher ground away from the beach.",
      },
      {
        timeWindow: "6 Hours Before Storm",
        action: "Power teams turn off electricity near flood water to keep everyone safe from downed wires.",
      },
      {
        timeWindow: "During the Storm",
        action: "Stay indoors away from large windows. Never walk or bike through moving street water.",
      },
      {
        timeWindow: "After Storm Passes",
        action: "Listen to the emergency radio for the all-clear signal before heading outside.",
      },
    ],
    parametricTriggerNote: `The weather check confirmed high winds, unlocking $15,000,000 USD immediately to buy clean drinking water, hot meals, and baby food for community shelters.`,
  };
}

function generateFallbackAdvisories(cyclone: any, surge: any, _rain: any) {
  return [
    {
      role: "Families & Neighbors",
      priority: "CRITICAL",
      timeframe: "12 to 18 Hours Before",
      subject: `Family Storm Prep Guide for Cyclone ${cyclone?.name || "Chandra"}`,
      keyDirectives: [
        "Pack a 3-day supply of fresh drinking water, non-perishable snacks, and baby food",
        "Charge your flashlights, power banks, and mobile phones fully",
        "If you live near the beach or a tidal river, head to the nearest community shelter today",
        "Keep pets safe indoors in a quiet, sheltered room with food and water bowls",
      ],
      fullDispatchText: `Friendly Community Guide: Cyclone ${cyclone?.name || "Chandra"} will bring ocean waves up to +${surge?.totalWaterLevelMeters || 5.2}m above normal. Taking a few simple steps today keeps your family and neighbors safe and comfortable!`,
      broadcastSnippet: `Cyclone ${cyclone?.name || "Chandra"} approaches: Move to high ground shelters by 4 PM. Charge flashlights and pack clean water. Help is ready!`,
      language: "English / Community Languages",
    },
    {
      role: "Rescue Helpers & Volunteers",
      priority: "CRITICAL",
      timeframe: "12 Hours Before Landfall",
      subject: `Rescue Helper Guide: Safe Boat Stations & Checkpoints`,
      keyDirectives: [
        "Park rescue boats and medical vans on high ground above expected water levels",
        "Check that chain saws and road clearing gear have fresh fuel to remove fallen branches",
        "Keep walkie-talkie radios charged and tuned to Channel 16",
        "Set up friendly welcome desks at all community shelters with blankets and warm tea",
      ],
      fullDispatchText: `Volunteer Team Briefing: Community helpers are pre-staging inflatable boats and high-clearance trucks at elevated highway locations to help neighbors stay safe before winds increase.`,
      broadcastSnippet: `Volunteer teams & rescue helpers are ready at highway shelters. Emergency team hotline is open 24/7.`,
      language: "English / Hindi",
    },
    {
      role: "Power & Light Teams",
      priority: "URGENT",
      timeframe: "6 Hours Before Landfall",
      subject: `Power Safety & Neighborhood Lighting Plan`,
      keyDirectives: [
        "Safely switch off power in flooded beach zones to prevent any electrical hazards",
        "Start diesel generators at hospitals and community water supply stations",
        "Park mobile repair trucks on high ground so they can restore lines quickly once winds calm down",
        "Remind neighbors: Never touch a fallen wire on the ground!",
      ],
      fullDispatchText: `Power Team Safety Update: Turning off power in low-lying water areas is a standard safety measure that prevents sparks and keeps everyone safe during deep ocean surge.`,
      broadcastSnippet: `Electricity in coastal streets will turn off a few hours before storm for safety. Please charge lights and phones now!`,
      language: "English / Regional",
    },
    {
      role: "Health & Shelter Caretakers",
      priority: "HIGH",
      timeframe: "12 Hours Before Landfall",
      subject: `Shelter Health, Clean Water & Comfort Supplies`,
      keyDirectives: [
        "Move hospital patient beds and essential medicines to upper floors above flood lines",
        "Stock plenty of clean drinking water, clean bandages, and basic first aid kits",
        "Set up comfortable resting mats and play corners for children in every shelter",
        "Ensure emergency backup generators have at least 4 days of clean fuel",
      ],
      fullDispatchText: `Shelter Health Notice: Every community cyclone shelter is stocked with clean drinking water, emergency medicines, and clean bedding to ensure every family is warm and cared for.`,
      broadcastSnippet: `Community shelters are open and fully stocked with food, water, and friendly nurses. Everyone is welcome!`,
      language: "English / Regional",
    },
    {
      role: "Community Radio Announcement",
      priority: "CRITICAL",
      timeframe: "Hourly Radio Broadcast",
      subject: `Friendly Weather Bulletin for Coastal Residents`,
      keyDirectives: [
        "Stay comfortably indoors inside a sturdy concrete building; avoid windows and tin roofs",
        "Keep a battery-powered radio tuned to our station for fun music and helpful updates",
        "Stay away from beaches, sea walls, and swollen rivers until authorities give the all-clear",
        "Watch out for the cyclone 'Eye'—the calm break in the middle is followed by winds from the opposite direction",
      ],
      fullDispatchText: `Community Radio Broadcast: Hello neighbors! Cyclone ${cyclone?.name || "Chandra"} is bringing high waves and strong winds. Please stay cozy and safe inside your homes or shelters today!`,
      broadcastSnippet: `Friendly Weather Alert: Cyclone ${cyclone?.name || "Chandra"} winds picking up. Stay indoors and cozy with family. We will keep you updated!`,
      language: "Bilingual (English + Regional)",
    },
    {
      role: "Emergency Relief Fund",
      priority: "URGENT",
      timeframe: "Unlocked Pre-Landfall",
      subject: `Community Emergency Fund: Instant Support Guarantee`,
      keyDirectives: [
        "Satellite wind check confirmed winds above 165 km/h, automatically unlocking the relief pool",
        "$15,000,000 USD is immediately made available to disaster teams",
        "Funds are being used right now to purchase fresh food, drinking water, and blankets",
        "No waiting weeks for paperwork—aid arrives before the storm touches the beach!",
      ],
      fullDispatchText: `Relief Fund Update: Thanks to automatic weather checks, $15.0 Million has already been delivered to ensure every resident has clean water, food, and warm shelter supplies.`,
      broadcastSnippet: `Relief fund unlocked! $15.0M released to purchase clean water, baby food, and blankets for shelters right now.`,
      language: "English",
    },
  ];
}

startServer();
