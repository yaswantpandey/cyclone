import {
  CycloneSystem,
  GEELayer,
  SurgeMetrics,
  RainfallMetrics,
  InfrastructureAsset,
  ParametricInsurancePolicy,
  OfflineActionTask,
  OutboxRadioMessage,
  EarlyWarningAdvisory,
} from "../types/cyclone";

export const CYCLONE_SCENARIOS: CycloneSystem[] = [
  {
    id: "chandra-2026",
    name: "CHANDRA",
    basin: "North Indian Ocean / Bay of Bengal",
    category: "Very Severe Cyclonic Storm (VSCS)",
    centralPressureHpa: 958,
    maxWindSpeedKmph: 185,
    gustsKmph: 215,
    forwardSpeedKmph: 17,
    headingDeg: 335,
    landfallEstimateHours: 18,
    landfallZone: "Dhamra Port / Balasore Coastal Arc, Odisha",
    currentPosition: [19.2, 88.6], // Bay of Bengal, moving NW
    trackHistory: [
      { timeOffsetHours: -36, lat: 15.8, lng: 91.2, windSpeedKmph: 95, centralPressureHpa: 994, coneRadiusKm: 15, label: "T-36h (Deep Depression)" },
      { timeOffsetHours: -24, lat: 17.1, lng: 90.3, windSpeedKmph: 130, centralPressureHpa: 980, coneRadiusKm: 25, label: "T-24h (Severe Cyclonic Storm)" },
      { timeOffsetHours: -12, lat: 18.2, lng: 89.4, windSpeedKmph: 165, centralPressureHpa: 968, coneRadiusKm: 35, label: "T-12h (VSCS Upgrade)" },
      { timeOffsetHours: 0, lat: 19.2, lng: 88.6, windSpeedKmph: 185, centralPressureHpa: 958, coneRadiusKm: 45, label: "Current Position (T-18h to Landfall)" },
    ],
    forecastTrack: [
      { timeOffsetHours: 6, lat: 20.1, lng: 87.9, windSpeedKmph: 190, centralPressureHpa: 952, coneRadiusKm: 60, label: "T-12h (Peak Intensity)" },
      { timeOffsetHours: 12, lat: 20.8, lng: 87.3, windSpeedKmph: 185, centralPressureHpa: 955, coneRadiusKm: 80, label: "T-6h (Approaching Outer Shelf)" },
      { timeOffsetHours: 18, lat: 21.4, lng: 86.9, windSpeedKmph: 180, centralPressureHpa: 958, coneRadiusKm: 100, label: "T-0h Landfall (Dhamra/Balasore)", isLandfall: true },
      { timeOffsetHours: 24, lat: 22.1, lng: 86.4, windSpeedKmph: 110, centralPressureHpa: 982, coneRadiusKm: 130, label: "T+6h (Inland Weakening)" },
      { timeOffsetHours: 36, lat: 23.2, lng: 85.8, windSpeedKmph: 65, centralPressureHpa: 996, coneRadiusKm: 170, label: "T+18h (Depression over Jharkhand)" },
    ],
    windRadii: {
      r34Km: 280, // Gale radius
      r50Km: 140, // Storm radius
      r64Km: 65,  // Hurricane/Destructive radius
    },
    synopticOverview:
      "VSCS Chandra is tracking north-northwestward fueled by high Oceanic Heat Content (>90 kJ/cm²) and warm Sea Surface Temperatures (30.4°C). The storm exhibits tight eyewall convection with severe storm surge potential over the shallow continental shelf of Balasore Bay compounding with astronomical spring high tide.",
  },
  {
    id: "varuna-2026",
    name: "VARUNA",
    basin: "South-Central Bay of Bengal",
    category: "Extremely Severe Cyclonic Storm (ESCS)",
    centralPressureHpa: 942,
    maxWindSpeedKmph: 210,
    gustsKmph: 245,
    forwardSpeedKmph: 14,
    headingDeg: 310,
    landfallEstimateHours: 24,
    landfallZone: "Machilipatnam - Kakinada, Andhra Pradesh",
    currentPosition: [14.8, 83.4],
    trackHistory: [
      { timeOffsetHours: -36, lat: 12.5, lng: 86.2, windSpeedKmph: 110, centralPressureHpa: 988, coneRadiusKm: 20, label: "T-36h (SCS)" },
      { timeOffsetHours: -24, lat: 13.3, lng: 85.1, windSpeedKmph: 155, centralPressureHpa: 972, coneRadiusKm: 30, label: "T-24h (VSCS)" },
      { timeOffsetHours: 0, lat: 14.8, lng: 83.4, windSpeedKmph: 210, centralPressureHpa: 942, coneRadiusKm: 50, label: "Current (ESCS Cat-4 Equivalent)" },
    ],
    forecastTrack: [
      { timeOffsetHours: 12, lat: 15.6, lng: 82.3, windSpeedKmph: 205, centralPressureHpa: 946, coneRadiusKm: 75, label: "T-12h (Krishna Delta Shelf)" },
      { timeOffsetHours: 24, lat: 16.3, lng: 81.6, windSpeedKmph: 195, centralPressureHpa: 950, coneRadiusKm: 95, label: "T-0h Landfall (Machilipatnam)", isLandfall: true },
      { timeOffsetHours: 36, lat: 17.2, lng: 80.8, windSpeedKmph: 120, centralPressureHpa: 978, coneRadiusKm: 130, label: "T+12h (Inland Degrade)" },
    ],
    windRadii: {
      r34Km: 320,
      r50Km: 160,
      r64Km: 80,
    },
    synopticOverview:
      "Extremely Severe Cyclonic Storm Varuna features rapid intensification under low vertical wind shear. Deltaic estuaries of Krishna and Godavari are exceptionally vulnerable to 4.8m storm surges and saltwater ingress impacting 180,000 hectares of aquaculture and coastal settlements.",
  },
  {
    id: "sagar9-2026",
    name: "SAGAR-9",
    basin: "North Bay of Bengal / Gangetic Delta",
    category: "Super Cyclonic Storm (SuCS)",
    centralPressureHpa: 928,
    maxWindSpeedKmph: 240,
    gustsKmph: 275,
    forwardSpeedKmph: 19,
    headingDeg: 15,
    landfallEstimateHours: 14,
    landfallZone: "Sundarbans Biosphere & Sagar Island / Khepupara",
    currentPosition: [20.4, 88.9],
    trackHistory: [
      { timeOffsetHours: -24, lat: 17.8, lng: 89.2, windSpeedKmph: 195, centralPressureHpa: 952, coneRadiusKm: 30, label: "T-24h (ESCS)" },
      { timeOffsetHours: 0, lat: 20.4, lng: 88.9, windSpeedKmph: 240, centralPressureHpa: 928, coneRadiusKm: 55, label: "Current (Super Cyclone)" },
    ],
    forecastTrack: [
      { timeOffsetHours: 6, lat: 21.2, lng: 89.1, windSpeedKmph: 235, centralPressureHpa: 932, coneRadiusKm: 70, label: "T-8h (Estuary Entrance)" },
      { timeOffsetHours: 14, lat: 21.9, lng: 89.3, windSpeedKmph: 220, centralPressureHpa: 940, coneRadiusKm: 90, label: "T-0h Landfall (Sundarbans)", isLandfall: true },
      { timeOffsetHours: 24, lat: 23.1, lng: 89.8, windSpeedKmph: 130, centralPressureHpa: 974, coneRadiusKm: 120, label: "T+10h (Inland Over Bangladesh)" },
    ],
    windRadii: {
      r34Km: 360,
      r50Km: 190,
      r64Km: 95,
    },
    synopticOverview:
      "Catastrophic Super Cyclone SAGAR-9 poses an existential threat to low-lying delta islands. With funneling effects in the northern apex of the bay, storm surges may surpass 6.2 meters, with tidal inundation penetrating over 16 km inland through deltaic tidal creeks.",
  },
];

export const INITIAL_GEE_LAYERS: GEELayer[] = [
  {
    id: "sentinel-1-sar",
    name: "Sentinel-1 SAR Inundation & Backscatter",
    satellite: "Sentinel-1 SAR",
    description: "C-band Synthetic Aperture Radar VV/VH dual-pol backscatter; cloud-penetrating water surface detection and baseline flood thresholding.",
    badge: "Cloud-Penetrating Radar",
    enabled: true,
    opacity: 0.75,
    colorScale: ["#0284c7", "#06b6d4", "#22d3ee", "#e0f2fe"],
    unit: "Backscatter dB / Flood Index",
  },
  {
    id: "srtm-dem",
    name: "SRTM / NASADEM Coastal Topography (0-10m)",
    satellite: "SRTM / NASADEM",
    description: "30m Digital Elevation Model highlighting vulnerable low-lying coastal shelves (<3m, <6m, <10m MSL) prone to rapid seawater ingress.",
    badge: "30m Topography DEM",
    enabled: true,
    opacity: 0.65,
    colorScale: ["#ef4444", "#f97316", "#eab308", "#22c55e"],
    unit: "Meters above MSL",
  },
  {
    id: "landsat-sst",
    name: "Landsat-8/9 & MODIS Sea Surface Temp (SST)",
    satellite: "Landsat-8/9 SST",
    description: "Thermal infrared marine heat layer showing tropical cyclone fuel (SST > 29.5°C) and oceanic heat content gradient.",
    badge: "Thermal SST 30.5°C",
    enabled: false,
    opacity: 0.55,
    colorScale: ["#3b82f6", "#eab308", "#f97316", "#ef4444"],
    unit: "Celsius (°C)",
  },
  {
    id: "sentinel-2-water",
    name: "Sentinel-2 MSI Normalized Water Index (MNDWI)",
    satellite: "Sentinel-2 MSI",
    description: "Modified Normalized Difference Water Index isolating estuarine channels, mangrove buffers, and pre-existing wetland reservoirs.",
    badge: "Multispectral 10m",
    enabled: false,
    opacity: 0.6,
    colorScale: ["#0f172a", "#0284c7", "#38bdf8"],
    unit: "MNDWI (-1 to +1)",
  },
  {
    id: "imd-radar",
    name: "IMD / JTWC Doppler Weather Radar Reflectivity",
    satellite: "IMD Doppler Radar",
    description: "S-band Doppler Radar composite exhibiting eyewall spiral rainbands and intense convective precipitation cores (>50 dBZ).",
    badge: "Doppler dBZ Feed",
    enabled: true,
    opacity: 0.7,
    colorScale: ["#22c55e", "#eab308", "#ef4444", "#a855f7"],
    unit: "Reflectivity dBZ",
  },
];

export const INITIAL_SURGE_METRICS: SurgeMetrics = {
  peakSurgeMeters: 4.3,
  astronomicalTideMeters: 1.2,
  totalWaterLevelMeters: 5.5,
  inlandPenetrationKm: 9.4,
  bathymetryShelfDepthMeters: 14.2, // Shallow apex causes acute surge amplification
  tidalPhase: "Spring High Tide",
  highestRiskSectors: [
    { sector: "Dhamra Estuary & Port Channel", surgeM: 5.5, risk: "Extreme" },
    { sector: "Chandipur - Balasore Beachfront", surgeM: 4.8, risk: "Extreme" },
    { sector: "Bhadrak Riverine Tidal Flats", surgeM: 4.2, risk: "Severe" },
    { sector: "Digha Coastal Embankment (WB)", surgeM: 3.9, risk: "Severe" },
    { sector: "Paradeep Industrial Complex", surgeM: 3.2, risk: "Moderate" },
  ],
};

export const INITIAL_RAINFALL_METRICS: RainfallMetrics = {
  cumulativeRainfallMm: 395,
  peakRateMmPerHour: 48,
  soilSaturationPercent: 89, // Highly saturated soil = severe runoff
  riverBasinAlerts: [
    { river: "Baitarani River (Anandapur Basin)", currentLevelM: 38.6, dangerLevelM: 38.36, status: "Breaching" },
    { river: "Subarnarekha River (Rajghat)", currentLevelM: 10.8, dangerLevelM: 10.36, status: "Breaching" },
    { river: "Budhabalanga River (NH-5 Bridge)", currentLevelM: 8.1, dangerLevelM: 8.13, status: "Critical" },
    { river: "Brahmani River (Jenapur)", currentLevelM: 65.4, dangerLevelM: 67.0, status: "Warning" },
  ],
  flashFloodChokePoints: [
    { location: "NH-16 Culvert 42/8 (Bahanaga section)", elevationM: 3.2, riskLevel: "Critical" },
    { location: "Balasore Railway Underpass Link", elevationM: 2.1, riskLevel: "Critical" },
    { location: "Dhamra Port Rail Corridor km 18", elevationM: 2.8, riskLevel: "Critical" },
    { location: "Bhadrak State Highway 9 Bridge Scour Zone", elevationM: 4.5, riskLevel: "High" },
  ],
};

export const INITIAL_INFRASTRUCTURE: InfrastructureAsset[] = [
  {
    id: "infra-sub-1",
    name: "220kV / 132kV Dhamra Grid Substation",
    type: "power_substation",
    coordinates: [20.82, 86.96],
    elevationM: 3.4,
    distanceToCoastKm: 4.1,
    capacityOrRating: "220/132/33kV 2x100 MVA",
    riskLevel: "CRITICAL",
    inundationDepthM: 1.8,
    windImpactRating: "Insulator Salt Flashover & Switchyard Flooding",
    hardeningAction: "Execute controlled sequential de-energization at T-4h; switch vital loads to elevated islanded diesel generator.",
    isHardened: false,
    notes: "Main power feed for coastal port, coastal radar, and 34 multi-purpose shelters.",
  },
  {
    id: "infra-sub-2",
    name: "132kV Chandipur Coastal Substation",
    type: "power_substation",
    coordinates: [21.46, 87.01],
    elevationM: 2.9,
    distanceToCoastKm: 2.3,
    capacityOrRating: "132/33kV 2x40 MVA",
    riskLevel: "CRITICAL",
    inundationDepthM: 2.2,
    windImpactRating: "Severe salt spray; tower foundation scour",
    hardeningAction: "Coat busbar insulators with silicone grease; raise control room water-stop barriers.",
    isHardened: false,
    notes: "Directly in primary storm surge breach polygon.",
  },
  {
    id: "infra-sub-3",
    name: "400kV / 220kV Balasore Main Grid Substation",
    type: "power_substation",
    coordinates: [21.52, 86.91],
    elevationM: 6.8,
    distanceToCoastKm: 12.5,
    capacityOrRating: "400/220kV 3x315 MVA",
    riskLevel: "MODERATE",
    inundationDepthM: 0.0,
    windImpactRating: "Gale wind shear on gantry towers (>175 km/h)",
    hardeningAction: "Lock down crane gantries; inspect guy-wire tension on 400kV outgoing lines.",
    isHardened: true,
    notes: "Regional backbone station; elevated above projected flood line.",
  },
  {
    id: "infra-hwy-1",
    name: "National Highway 16 (Coastal Arterial Evacuation Route)",
    type: "arterial_highway",
    coordinates: [21.35, 86.78],
    elevationM: 3.6,
    distanceToCoastKm: 18.2,
    capacityOrRating: "6-Lane National Corridor (Primary Evacuation Spine)",
    riskLevel: "CRITICAL",
    inundationDepthM: 1.1,
    windImpactRating: "Overturned high-profile vehicles, fallen trees blocking carriageways",
    hardeningAction: "Stage 8 NDRF road-clearing taskforces with JCBs and hydraulic chainsaw cutters at 5km intervals.",
    isHardened: false,
    notes: "Key lifeline connecting Balasore, Bhadrak, and Cuttack. Vulnerable to Baitarani backflow.",
  },
  {
    id: "infra-hwy-2",
    name: "State Highway 57 (Dhamra - Jamujhadi Port Link)",
    type: "arterial_highway",
    coordinates: [20.91, 86.85],
    elevationM: 2.7,
    distanceToCoastKm: 6.2,
    capacityOrRating: "4-Lane Port Logistics Arterial",
    riskLevel: "CRITICAL",
    inundationDepthM: 2.4,
    windImpactRating: "Complete storm surge overtopping expected at T-6h",
    hardeningAction: "Close road to civil transit at T-10h; reroute all evacuation convoys via inland SH-9.",
    isHardened: false,
    notes: "Will be severed by estuarine tidal surge. Pre-position high-clearance amphibious trucks.",
  },
  {
    id: "infra-hosp-1",
    name: "Balasore District Headquarters Hospital (DHH)",
    type: "hospital_shelter",
    coordinates: [21.49, 86.93],
    elevationM: 7.2,
    distanceToCoastKm: 14.1,
    capacityOrRating: "650 Beds | 42 ICU | Trauma Level-2",
    riskLevel: "HIGH",
    inundationDepthM: 0.4,
    windImpactRating: "Roof sheet detachment on older surgical wing",
    hardeningAction: "Relocate ground floor ICU patients to Level 3; test 500kVA elevated rooftop diesel genset.",
    isHardened: false,
    notes: "Central trauma receiver for 3 coastal districts. Oxygen plant tank locked down.",
  },
  {
    id: "infra-shelter-1",
    name: "Chandipur Multi-Purpose Cyclone Shelter (MPCS-14)",
    type: "hospital_shelter",
    coordinates: [21.44, 87.02],
    elevationM: 5.5,
    distanceToCoastKm: 1.1,
    capacityOrRating: "Capacity: 2,500 evacuees | Reinforced Stilt Design",
    riskLevel: "HIGH",
    inundationDepthM: 1.2,
    windImpactRating: "Impact resistant; stilt structure safe against 4.5m surge",
    hardeningAction: "Stock 5,000L potable water, chlorine tablets, and 48h dry food packs on first floor storage.",
    isHardened: true,
    notes: "Currently sheltering 1,840 coastal fisherfolk and villagers.",
  },
  {
    id: "infra-shelter-2",
    name: "Dhamra Fishery Cyclone Refuge (MPCS-28)",
    type: "hospital_shelter",
    coordinates: [20.79, 86.98],
    elevationM: 4.8,
    distanceToCoastKm: 0.8,
    capacityOrRating: "Capacity: 1,800 evacuees | Elevated Plinth",
    riskLevel: "CRITICAL",
    inundationDepthM: 2.1,
    windImpactRating: "Severe peripheral wave action on access ramp",
    hardeningAction: "Anchor external ramp with sandbags; verify satellite VHF radio battery reserve.",
    isHardened: false,
    notes: "Isolated if SH-57 floods. Helipad on roof cleared for emergency air-drops.",
  },
  {
    id: "infra-water-1",
    name: "Bhadrak-Kasaba Regional Water Intake & Treatment Plant",
    type: "water_facility",
    coordinates: [21.05, 86.51],
    elevationM: 4.1,
    distanceToCoastKm: 28.0,
    capacityOrRating: "75 MLD (Supplies 320,000 residents)",
    riskLevel: "HIGH",
    inundationDepthM: 0.9,
    windImpactRating: "Submersible pump electrical control box flooding",
    hardeningAction: "Install flood barriers around pump house; elevate chlorination dosing tanks.",
    isHardened: false,
    notes: "Crucial to prevent post-cyclone cholera and water-borne enteric outbreaks.",
  },
  {
    id: "infra-telecom-1",
    name: "Coastal Telecom Hub Tower (Bahanaga 80m Lattice)",
    type: "telecom_tower",
    coordinates: [21.31, 86.82],
    elevationM: 5.2,
    distanceToCoastKm: 8.5,
    capacityOrRating: "Cellular 4G/5G + Disaster Public Safety VHF Repeater",
    riskLevel: "HIGH",
    inundationDepthM: 0.0,
    windImpactRating: "Design load 180 km/h; gusts may exceed antenna tilt tolerances",
    hardeningAction: "Switch to dedicated lithium backup rack (72h duration); lower micro-wave dish tilt angles.",
    isHardened: true,
    notes: "Relays emergency broadcast SMS and first responder TETRA radio network.",
  },
];

export const INITIAL_PARAMETRIC_POLICY: ParametricInsurancePolicy = {
  policyNumber: "PARAM-APAC-BOB-2026-09A",
  insuredEntity: "State Disaster Management Authority & Coastal Municipal Consortium",
  totalLiquidityPoolUsd: 25000000,
  disbursedAmountUsd: 15000000,
  claimStatus: "APPROVED - IMMEDIATE PAYOUT",
  triggers: [
    {
      id: "trig-wind",
      parameter: "Max Sustained Surface Winds at Landfall Corridor",
      threshold: "> 165 km/h (Category-3 Threshold)",
      currentObserved: "185 km/h (IMD Radar & Dvorak T5.5 Verified)",
      status: "TRIGGERED",
      payoutAmountUsd: 10000000,
      verificationSource: "JTWC / IMD Satellite Telemetry & Coastal Buoy OB-4",
    },
    {
      id: "trig-surge",
      parameter: "Simulated Total Coastal Water Level (Surge + Tide)",
      threshold: "> 3.8 meters above MSL",
      currentObserved: "5.5 meters (Peak Inundation Sector Dhamra)",
      status: "TRIGGERED",
      payoutAmountUsd: 5000000,
      verificationSource: "INCOIS Coastal Wave Radar & SLOSH Hydro Model",
    },
    {
      id: "trig-rain",
      parameter: "48-Hour Precipitation Accumulation",
      threshold: "> 300 mm within 50km Landfall Box",
      currentObserved: "395 mm Projected",
      status: "PRIMED",
      payoutAmountUsd: 10000000,
      verificationSource: "GPM IMERG Satellite & Automatic Weather Stations (AWS)",
    },
  ],
  payoutAllocation: [
    { category: "Emergency Food & Potable Water Rations for 140+ Shelters", amountUsd: 4500000, percentage: 30 },
    { category: "Mobile Diesel Fuel Reserves for Hospital Generators & Dewatering", amountUsd: 3750000, percentage: 25 },
    { category: "Search & Rescue Boat Logistics & NDRF Air-Drop Packaging", amountUsd: 3000000, percentage: 20 },
    { category: "Pre-Positioned Pontoon Bridges & Emergency Road Clearing Gear", amountUsd: 2250000, percentage: 15 },
    { category: "Parametric Municipal Cash Assistance for Vulnerable Families", amountUsd: 1500000, percentage: 10 },
  ],
};

export const INITIAL_OFFLINE_TASKS: OfflineActionTask[] = [
  {
    id: "task-1",
    category: "EVACUATION",
    timeframe: "T-24h",
    task: "Complete 100% mandatory evacuation of thatched/kutcha huts within 5km coastal zone (Target: 185,000 residents).",
    assignedTo: "District Collector & Tehsildar Teams",
    completed: true,
    completedAt: "10:15 AM (T-22h)",
    isCrucial: true,
  },
  {
    id: "task-2",
    category: "GRID HARDENING",
    timeframe: "T-12h",
    task: "Sequential de-energization of 33kV coastal feeders once wind speed exceeds 70 km/h; isolate Dhamra 220kV switchyard.",
    assignedTo: "Chief Engineer, OPTCL / Power Distribution Utility",
    completed: false,
    isCrucial: true,
  },
  {
    id: "task-3",
    category: "HEALTH & SHELTER",
    timeframe: "T-12h",
    task: "Verify backup diesel generators and oxygen manifold elevation at Balasore DHH and Bhadrak District Hospital.",
    assignedTo: "Chief District Medical Officer (CDMO)",
    completed: true,
    completedAt: "11:40 AM (T-16h)",
    isCrucial: true,
  },
  {
    id: "task-4",
    category: "LOGISTICS",
    timeframe: "T-6h",
    task: "Position 12 NDRF swift-water rescue teams with Zodiac inflatables at inland elevated staging hubs along NH-16.",
    assignedTo: "Commandant, 3rd Battalion NDRF",
    completed: true,
    completedAt: "01:20 PM (T-14h)",
    isCrucial: true,
  },
  {
    id: "task-5",
    category: "COMMS",
    timeframe: "T-6h",
    task: "Distribute VHF handheld radios (Channel 16 Marine & UHF 433.5 MHz) to all shelter managers; verify HAM radio relay.",
    assignedTo: "Disaster Management Telecom Wing",
    completed: false,
    isCrucial: false,
  },
  {
    id: "task-6",
    category: "EVACUATION",
    timeframe: "Landfall",
    task: "Impose total curfew under Section 144 on all open roads and coastal bridges; seal shelter blast doors.",
    assignedTo: "Superintendent of Police & Executive Magistrates",
    completed: false,
    isCrucial: true,
  },
  {
    id: "task-7",
    category: "LOGISTICS",
    timeframe: "Post-Landfall",
    task: "Initiate immediate road clearance on NH-16 and hospital arteries within 3 hours post-eye passage.",
    assignedTo: "National Highways Authority & State PWD",
    completed: false,
    isCrucial: true,
  },
];

export const INITIAL_OUTBOX_MESSAGES: OutboxRadioMessage[] = [
  {
    id: "msg-101",
    timestamp: "12:15 UTC",
    recipient: "All Shelter In-Charges (Balasore Sector A)",
    frequencyOrChannel: "VHF Marine Ch 16 / UHF 433.500 MHz",
    content: "FLASH: Storm surge model upgraded to 5.5m combined high tide. Do NOT permit anyone to exit shelters. Fasten storm shutters.",
    status: "TRANSMITTED",
    priority: "FLASH",
  },
  {
    id: "msg-102",
    timestamp: "12:30 UTC",
    recipient: "OPTCL Power Dispatch Center",
    frequencyOrChannel: "Dedicated Landline / Satellite Link",
    content: "Execute de-energization of 33kV Feeder-4 (Chandipur coastal line) immediately to prevent substation arc flash.",
    status: "TRANSMITTED",
    priority: "IMMEDIATE",
  },
  {
    id: "msg-103",
    timestamp: "12:48 UTC",
    recipient: "NDRF Team Bravo (Dhamra Port Area)",
    frequencyOrChannel: "Tactical Mesh Radio 145.225 MHz",
    content: "High tide inundation reported at SH-57 km 14. Fall back to elevated depot at Jamujhadi junction with assault craft.",
    status: "QUEUED_OFFLINE",
    priority: "IMMEDIATE",
  },
];

export const INITIAL_ADVISORIES: EarlyWarningAdvisory[] = [
  {
    role: "Municipal Commissioner & District Magistrate",
    priority: "CRITICAL",
    timeframe: "T-18 Hours to Landfall",
    subject: "EMERGENCY MANDATE: Full Coastal Sector Evacuation & Section 144 Enactment",
    keyDirectives: [
      "Enforce mandatory evacuation of all residential settlements within 5km of Dhamra and Chandipur coastline by 16:00 hrs.",
      "Impose Section 144 prohibiting civilian vehicular movements on arterial highway corridors NH-16 and SH-57.",
      "Transition all 142 Multi-Purpose Cyclone Shelters (MPCS) to self-contained lockdown with 96-hour dry rations and backup diesel generators.",
      "Direct municipal treasuries to receive $15,000,000 USD pre-landfall parametric liquidity for emergency logistics disbursements.",
    ],
    fullDispatchText: `MEMORANDUM FOR IMMEDIATE TRANSMISSION
FROM: Office of the Municipal Commissioner & District Magistrate
TO: Sub-Divisional Magistrates, Block Development Officers, Tehsildars
SUBJECT: EMERGENCY EXECUTIVE ORDER - EVACUATION & HARDENING FOR CYCLONE CHANDRA

1. SITUATION ASSESSMENT:
Cyclone Chandra (Category-4 ESCS) is tracking northwest at 18 km/h with central pressure 940 hPa and sustained eyewall winds of 195 km/h. Hydrodynamic modeling indicates extreme storm surge of 4.3m coinciding with astronomical spring high tide (+1.2m), yielding total coastal water levels of +5.5m above MSL. Inland seawater ingress will penetrate up to 9.4 km.

2. MANDATORY OPERATIONAL ACTIONS:
- Complete 100% evacuation of kutcha/thatched dwellings across 38 vulnerable Gram Panchayats by T-12 hours.
- Authorize immediate local procurement utilizing the initial $15M parametric risk liquidity facility for clean water tanker staging and emergency medical caches.
- Restrict all port logistics and chemical terminal operations at Dhamra Port.
- Maintain continuous VHF radio connectivity with District Emergency Operations Centre on Ch 16 / 145.225 MHz.`,
    broadcastSnippet: "URGENT: Cyclone Chandra landfall in 18h. 5.5m storm surge alert for Balasore & Bhadrak. Move to designated cyclone shelters immediately. Dial 1077 for emergency assistance.",
    language: "English & Odia (Bilingual Dispatch)",
  },
  {
    role: "NDRF / State Disaster Response Force (SDRF)",
    priority: "CRITICAL",
    timeframe: "T-12 Hours to Landfall",
    subject: "TACTICAL PRE-POSITIONING: Swift Water Assault Teams & Road Clearance Battalions",
    keyDirectives: [
      "Pre-position 12 Swift-Water Rescue Task Forces with Zodiac assault boats at elevated staging depots along NH-16.",
      "Stage 6 heavy earthmover (JCB) clearing columns equipped with hydraulic tree cutters at 5km intervals on NH-16 and hospital feeder routes.",
      "Establish primary operational hub at Jamujhadi junction to retain mobility regardless of estuarine flooding.",
    ],
    fullDispatchText: `TACTICAL OPERATION ORDER: BATTALION COMMANDER
UNIT: 3rd & 10th NDRF Response Battalions
MISSION: Pre-Landfall Staging & Rapid Arterial Extraction

1. THREAT VECTORS:
Flash flood breaches expected on Baitarani and Subarnarekha river corridors; high risk of NH-16 culvert 42/8 submergence.

2. TASK FORCE ASSIGNMENTS:
- Team Alpha (Dhamra): 4 Inflatable Motor Boats (IRBs), 2 Satellite BGAN units. Staged at MPCS-28 high ground.
- Team Bravo (Bahanaga/Balasore): Heavy clearance equipment (chainsaws, cranes) for immediate post-eye clearing of NH-16.
- Comms protocol: Default to 145.225 MHz Tactical VHF in event of cellular tower collapse.`,
    broadcastSnippet: "NDRF TEAMS ALERT: Pre-position boat units at Jamujhadi high ridge. Severe tidal surge warning in effect.",
    language: "English / Hindi",
  },
  {
    role: "Chief Engineer, State Power Utility (OPTCL / Discom)",
    priority: "URGENT",
    timeframe: "T-6 Hours to Landfall",
    subject: "GRID PROTECTION: Sequential Substation De-Energization & Anti-Arc Protocols",
    keyDirectives: [
      "Initiate controlled de-energization of 33kV coastal overhead feeders when sustained wind exceeds 70 km/h.",
      "Isolate Dhamra 220kV outdoor switchyard busbars at T-4h to avert salt spray insulator flashovers.",
      "Transfer vital municipal water pumping and hospital circuits to elevated emergency diesel generator circuits.",
    ],
    fullDispatchText: `GRID PROTECTION DIRECTIVE
FROM: State Load Dispatch Center (SLDC)
TO: All Substation In-Charges (Balasore, Bhadrak, Kendrapara)

1. SALINITY & WIND MITIGATION:
Coastal winds carrying heavy marine salt spray pose extreme flashover risk to energized porcelain insulators. At T-4h, open circuit breakers on 220kV Dhamra line. Lock down gantry cranes.

2. RESTORATION PRE-POSITIONING:
Stage 40 mobile diesel emergency generator sets and replacement conductor rolls at inland depots for rapid post-landfall line restoration.`,
    broadcastSnippet: "POWER ALERT: Coastal 33kV lines to be systematically de-energized at T-4h. Ensure home battery & lantern reserves.",
    language: "English",
  },
  {
    role: "District Chief Medical Officer (CDMO)",
    priority: "URGENT",
    timeframe: "T-14 Hours to Landfall",
    subject: "HOSPITAL HARDENING: Critical Care Relocation & Potable Water Disease Prevention",
    keyDirectives: [
      "Evacuate ground-floor Intensive Care Unit (ICU) and neonatal incubators to Level 2/3 at Balasore DHH.",
      "Inspect rooftop liquid medical oxygen (LMO) manifolds and ensure 96-hour backup diesel generator fuel capacity.",
      "Pre-distribute 250,000 halogen tablets and ORS sachets across all community shelters to suppress waterborne disease.",
    ],
    fullDispatchText: `HEALTH DIRECTORATE EMERGENCY PROTOCOL
TO: Superintendents, District Hospitals & Community Health Centers (CHCs)

1. VITAL SYSTEMS REDUNDANCY:
Ensure all dialysis and ventilator patients are centralized in structurally reinforced upper-level wards. Anchor external oxygen tanks against gale-force wind shear.

2. SURGE CAPACITY:
Deploy trauma mobile surgical teams to Bhadrak and Balasore headquarters. Prepare mobile water purification units for deployment within 6 hours post-landfall.`,
    broadcastSnippet: "HEALTH ALERT: Balasore DHH outpatient services suspended. Critical trauma upper floors open. Boiled water advisories active.",
    language: "English & Odia",
  },
  {
    role: "Public Broadcast & Coastal Fisherfolk Warning",
    priority: "CRITICAL",
    timeframe: "Immediate Broadcast (T-24h to Landfall)",
    subject: "RED ALERT: Complete Prohibition of Sea Venturing & Evacuation Sirens",
    keyDirectives: [
      "Total ban on all marine and estuarine navigation in Bay of Bengal coastal waters.",
      "Immediate evacuation from low-lying beaches and river banks into multi-purpose cyclone shelters.",
      "Secure livestock, emergency cash, and identity documents in sealed waterproof pouches.",
    ],
    fullDispatchText: `ALL INDIA RADIO & COASTAL SIREN BROADCAST
SPECIAL CYCLONE WEATHER BULLETIN

"Cyclone Chandra has intensified into an Extremely Severe Cyclonic Storm. Maximum wind speeds will reach 195 to 220 km per hour with sea waves rising up to 5.5 meters along Dhamra, Chandipur, and Balasore. All fisherfolk who are still at sea must return to port immediately. Do not stay in mud, tin, or thatched houses. Evacuate to the nearest concrete Multi-Purpose Cyclone Shelter immediately. Food, clean water, and medical care are available free of charge at all shelters."`,
    broadcastSnippet: "RED ALERT: Extreme Cyclone Chandra. Winds 195km/h, 5.5m tidal waves. Evacuate thatched houses now to Cyclone Shelters. Call 1077.",
    language: "Bilingual: Odia & English",
  },
  {
    role: "Parametric Risk Insurance Trustee & Financial Consortium",
    priority: "HIGH",
    timeframe: "T-18 Hours to Landfall",
    subject: "PARAMETRIC LIQUIDITY RELEASE: $15,000,000 USD Pre-Landfall Treasury Authorization",
    keyDirectives: [
      "Execute automated cryptographic payout of $15.0M USD based on verified Dvorak T-number (T5.5) and surface wind >165 km/h.",
      "Wire funds into State Disaster Management Contingency Account before landfall disrupts banking clearing networks.",
      "Maintain audit trail based on INCOIS tidal buoy OB-4 and SLOSH numerical storm surge validation.",
    ],
    fullDispatchText: `PARAMETRIC CATASTROPHE FACILITY DISBURSEMENT ADVISORY
FACILITY REF: PARAM-APAC-BOB-2026-09A

The underlying physical trigger conditions for Policy PARAM-APAC-BOB-2026-09A have been objectively verified by satellite radar and marine buoys:
1. Max Sustained Winds: 185 km/h (Threshold: >165 km/h) -> $10,000,000 USD Triggered
2. Total Water Level (Surge + Tide): 5.5m MSL (Threshold: >3.8m) -> $5,000,000 USD Triggered

Total Immediate Pre-Landfall Cash Release: $15,000,000.00 USD.
Funds are released unconditionally for anticipatory evacuation food, fuel, and rescue operations.`,
    broadcastSnippet: "FINANCIAL DISBURSEMENT: $15M USD pre-landfall parametric liquidity released to State Treasury based on verified satellite wind trigger.",
    language: "English",
  },
];
