# CycloneWatch 🌀
### Anticipatory Storm Safety & Weather Explorer

[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-black.svg?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285f4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900.svg?logo=leaflet&logoColor=white)](https://leafletjs.com/)

**CycloneWatch** is a colorful, interactive storm safety and weather exploration platform. It transforms complex meteorology, hydrodynamic storm surge modeling, satellite inundation data, and anticipatory disaster management into an engaging, kid- and family-friendly experience.

Powered by **Three.js** 3D visualization, **Leaflet** geospatial maps, **Google Gemini 3.8 Flash**, and **Google Material UI**, CycloneWatch empowers neighborhoods, families, volunteers, and emergency crews to anticipate storm impacts before landfall occurs.

---

## 🌟 Key Highlights & Capabilities

### 1. 🌀 Interactive 3D Storm Lab (Three.js WebGL)
- **14,000-Particle Rankine Vortex**: A high-density logarithmic spiral particle cloud with color-graded temperature zones (calm cyan eye, energetic amber-orange eyewall, and deep oceanic cirrus bands).
- **Dynamic 3D Ocean Surface**: A tessellated plane geometry with real-time wave vertex displacement driven by storm intensity, tidal amplitude, and wind velocity.
- **Topographical Shoreline**: 3D coastal landmass and sandy beach showing water pushing inland during peak surge.
- **Interactive Orbit Camera**: Full mouse/touch drag rotation, zoom scroll, and one-click camera angles:
  - 📐 **Isometric 3D**: Panoramic perspective of the full vortex and coastline.
  - 🛰️ **Satellite Top-Down**: Directly into the eye of the storm.
  - 🏖️ **Shoreline View**: Low-angle beach perspective watching incoming waves.
- **Interactive Storm Anatomy**: Clickable 3D markers for **The Calm Eye**, **Violent Eyewall**, **Outer Rainbands**, and **Storm Surge Swell** with kid-friendly explanations.
- **Live Simulator Controls**: Toggle ocean wireframes, adjust playback speed (0.5x, 1x, 2x), and dynamically slide wind speed to see storm physics in action.

### 2. 🗺️ Geospatial Forecast Map (Leaflet & OpenStreetMap)
- **Forecast Track & Cone of Uncertainty**: 72-hour forecast projection with historical points, future nodes, and wind radii isotachs (34 kt, 50 kt, 64 kt).
- **OpenStreetMap (OSM) Live Basemaps**: Powered by OpenStreetMap community tiles with instant style switching between:
  - 🗺️ **OSM Standard**: Crisp, highly detailed official community street and coastline cartography.
  - 🚑 **OSM Humanitarian (HOT)**: High-contrast relief and infrastructure styling built for disaster response operations.
  - 🏔️ **OSM Topo (OpenTopoMap)**: Elevation contour lines and topographical terrain shading.
- **Google Earth Engine (GEE) Satellite Layers**: Toggleable synthetic flood extent, coastal bathymetry, and satellite radar overlays.
- **Critical Lifeline Pins**: Interactive markers for community hospitals, safe evacuation shelters, electrical substations, and clear evacuation arteries.
- **Interactive Timeline Scrubber**: Step through forecast hours (-24h past to +48h post-landfall) to observe wind field and surge progressions.

### 3. 🌊 Storm Surge & Wave Hydrodynamics
- **Dynamic Cross-Section Canvas**: Animated 2D water column showing wind stress pushing sea water over offshore shelves and seawalls.
- **Environmental Sliders**: Experiment with astronomical spring/neap tides, coastal ocean depth, and barrier dune conditions.
- **Educational Explanations**: Simple explanations of how wind piles water into a "surge mound" and why low central pressure causes the sea to rise like a straw.

### 4. 🌧️ Rainfall & River Runoff Modeling
- **Watershed Hydrograph Gauges**: Real-time river capacity meters across major river basins (Brahmani-Baitarani, Mahanadi Delta, Subarnarekha).
- **Soil Moisture Saturation**: Visual gauge of Antecedent Soil Moisture (ASM) showing how saturated ground accelerates flash flooding.
- **Interactive Flood Simulator**: Simple rainfall sliders demonstrating the threshold where retention ponds overflow into streets.

### 5. 🏥 Community Lifeline Protection & Hardening
- **Asset Health Roster**: Status monitoring of emergency shelters, clinics, power transformers, bridges, and drinking water facilities.
- **Interactive Hardening Action**: One-click protection simulation (deploying sandbags, auxiliary generators, and flood barriers) that lowers community risk scores in real-time.

### 6. 💰 Parametric Emergency Relief Fund
- **Pre-Landfall Liquidity Mechanism**: Visual explanation of how index-based parametric insurance triggers funds *before* storm landfall rather than waiting weeks for damage adjusters.
- **Relief Pool Allocation**: Visual breakdown of funds allocated to clean drinking water, infant food kits, temporary shelters, and emergency rescue boats.
- **Downloadable Guarantee Certificate**: Printable verification certificate showing relief authorization.

### 7. 📢 Automated Early-Warning Dispatches (Gemini AI)
- **Role-Based Safety Guides**: Targeted guidance generated for:
  - 👨‍👩‍👧‍👦 **Families & Neighbors** (safe rooms, emergency kits, pet care)
  - 🦺 **Rescue Volunteers & Helpers** (high-clearance routes, life vest staging)
  - ⚡ **Power & Utility Teams** (proactive de-energization to prevent fires)
  - 🏥 **Health & Shelter Caretakers** (medical oxygen reserves, clean water tanks)
- **Short Radio Snippets**: Compact (<160 characters) broadcast messages for walkie-talkies, community loudspeakers, and SMS.

### 8. 🎒 Offline Disaster Mode & Walkie-Talkie Outbox
- **100% Offline Capability**: Runs seamlessly without active internet connectivity using local browser state.
- **Interactive Packing Bags**: Checklists categorized by Family Essentials, Helpers & Tools, and Pet Safety.
- **Simulated Radio Dispatcher**: Queue and test emergency radio messages on VHF/HF channels with audible transmission feedback.
- **Incident Action Plan (IAP) Export**: One-click printable briefing document for community coordinators.

### 9. 🤖 Storm Safety Guide AI (Conversational Companion)
- Powered by `gemini-3.8-flash`, this warm, encouraging chat assistant answers questions about packing flashlights, securing roofs, comforting pets, and staying calm during severe weather.

### 10. 🧪 Custom Storm Lab (Scenario Builder)
- Custom weather laboratory where users can invent their own tropical storm, customize central pressure (hPa), maximum sustained winds (km/h), forward translation speed, and landfall targets to observe resulting impacts.

---

## 🏗️ Technical Architecture & Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`
- **3D Graphics**: Three.js (`three` & `@types/three`)
- **Animations**: Motion (`motion/react`) for spring transitions and animated UI elements
- **Iconography**: Google Material UI Icons (`@mui/icons-material`, `@mui/material`, `@emotion/react`)
- **Mapping**: Leaflet 1.9 with responsive custom layer controls and HTML markers

### Backend & API
- **Server**: Express.js with `tsx` runtime
- **AI Engine**: Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash`
- **Build System**: Vite 6 + esbuild bundle for server deployment

### Project Structure

```text
├── .env.example                  # Environment configuration template
├── index.html                    # HTML entry point with metadata & SEO tags
├── metadata.json                 # AI Studio capability & permission declarations
├── package.json                  # Dependencies, scripts, and build pipeline
├── server.ts                     # Express server & Gemini API endpoints
├── tsconfig.json                 # TypeScript compiler options
├── vite.config.ts                # Vite build and plugin configurations
└── src/
    ├── App.tsx                   # Main dashboard layout, state & tab orchestration
    ├── main.tsx                  # React root mount
    ├── index.css                 # Global Tailwind styles & font imports
    ├── types/
    │   └── cyclone.ts            # Type definitions (cyclone, surge, assets, etc.)
    ├── data/
    │   └── cycloneScenarios.ts   # Preset cyclone scenarios (Dana, Amphan, Phailin)
    └── components/
        ├── CycloneThreeVisualizer.tsx    # Three.js 3D vortex & ocean simulation
        ├── GeospatialMap.tsx             # Leaflet forecast map & timeline scrubber
        ├── SurgeModelPanel.tsx           # Ocean surge & animated wave section
        ├── RainfallRunoffPanel.tsx       # Watershed runoff & rainfall hydrograph
        ├── InfrastructurePanel.tsx       # Critical assets & one-click hardening
        ├── ParametricInsurancePanel.tsx  # Pre-landfall emergency fund triggers
        ├── EarlyWarningAdvisories.tsx    # Role-based community safety dispatches
        ├── OfflineCoordinationPanel.tsx  # Offline checklists & VHF walkie-talkie
        ├── DisasterChatModal.tsx         # Friendly Gemini storm assistant modal
        ├── CustomScenarioModal.tsx       # Build-your-own cyclone scenario modal
        └── Navbar.tsx                    # Header bar with storm picker & tabs
```

---

## 🔌 API Endpoints Reference

All backend endpoints are hosted on the local Express server and proxy securely to the Google GenAI SDK:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns backend operational health and Gemini configuration status |
| `POST` | `/api/gemini/vulnerability-analysis` | Generates a friendly anticipatory vulnerability assessment and community timeline |
| `POST` | `/api/gemini/generate-advisories` | Generates 6 role-specific community action guides and radio broadcast snippets |
| `POST` | `/api/gemini/disaster-chat` | Interactive conversational companion providing reassuring storm safety guidance |

*Note: All endpoints include reliable fallback generators to guarantee instant, seamless functionality even if an API key is unconfigured or rate-limited.*

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
Clone the repository and install all required dependencies:

```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Add your Gemini API key (optional for simulated mode, required for live AI responses):

```env
GEMINI_API_KEY="your-google-gemini-api-key-here"
```

### 3. Development Server
Start the local full-stack server (runs Express and Vite on port `3000`):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Code Quality & Type Check
Verify that there are no syntax or type errors:

```bash
npm run lint
```

### 5. Production Build
Build both the frontend Vite bundle and backend Express server:

```bash
npm run build
npm start
```

---

## 🎨 Design Philosophy & Child-Friendly Guidelines

CycloneWatch intentionally abandons dark, militaristic emergency command aesthetics in favor of a **warm, supportive, and educational experience**:

- **Color Palette**:
  - 🌊 **Sky Blue Canvas** (`#f1f6fb`): Soft, open sky atmosphere.
  - ☀️ **Sunshine Amber** (`#f59e0b`): Clear, positive attention without panic.
  - 🌿 **Emerald Green** (`#10b981`): Safe zones, open shelters, and prepared status.
  - 🌸 **Coral Rose** (`#f43f5e`): Friendly warning for areas needing preparation.
- **Language & Voice**: Clear, encouraging instructions. Phrases like *"Keep clean water bottles handy"* replace scary phrases like *"MANDATORY MASS CASUALTY PROTOCOL"*.
- **Micro-Interactions**: Rounded bubbly corners (`rounded-3xl`), bouncy hover feedback, and fluid layout animations powered by `motion/react`.
- **Iconography**: Rounded Google Material Symbols with clear visual silhouettes for rapid recognition by children and elders alike.

---

## 🛡️ License & Attribution
CycloneWatch is crafted for educational and community disaster-resilience use. Weather patterns and bathymetric formulas are based on public domain meteorological principles and simplified for learning.
