export type CycloneCategory =
  | "Deep Depression"
  | "Cyclonic Storm (CS)"
  | "Severe Cyclonic Storm (SCS)"
  | "Very Severe Cyclonic Storm (VSCS)"
  | "Extremely Severe Cyclonic Storm (ESCS)"
  | "Super Cyclonic Storm (SuCS)";

export interface TrackPoint {
  timeOffsetHours: number; // e.g., -24, -12, 0 (current), +6, +12, +24
  lat: number;
  lng: number;
  windSpeedKmph: number;
  centralPressureHpa: number;
  coneRadiusKm: number;
  label: string;
  isLandfall?: boolean;
}

export interface WindRadii {
  r34Km: number; // Gale force winds (34 kt / 63 kmph)
  r50Km: number; // Storm force winds (50 kt / 93 kmph)
  r64Km: number; // Hurricane/Destructive force winds (64 kt / 119 kmph)
}

export interface CycloneSystem {
  id: string;
  name: string;
  basin: string;
  category: CycloneCategory;
  centralPressureHpa: number;
  maxWindSpeedKmph: number;
  gustsKmph: number;
  forwardSpeedKmph: number;
  headingDeg: number;
  landfallEstimateHours: number;
  landfallZone: string;
  currentPosition: [number, number];
  trackHistory: TrackPoint[];
  forecastTrack: TrackPoint[];
  windRadii: WindRadii;
  satelliteImageUrl?: string;
  synopticOverview: string;
}

export interface GEELayer {
  id: string;
  name: string;
  satellite: "Sentinel-1 SAR" | "Sentinel-2 MSI" | "SRTM / NASADEM" | "Landsat-8/9 SST" | "IMD Doppler Radar";
  description: string;
  badge: string;
  enabled: boolean;
  opacity: number;
  colorScale: string[];
  unit: string;
}

export interface SurgeMetrics {
  peakSurgeMeters: number;
  astronomicalTideMeters: number;
  totalWaterLevelMeters: number;
  inlandPenetrationKm: number;
  bathymetryShelfDepthMeters: number;
  tidalPhase: "Spring High Tide" | "Neap High Tide" | "Ebb Tide";
  highestRiskSectors: { sector: string; surgeM: number; risk: "Extreme" | "Severe" | "Moderate" }[];
}

export interface RainfallMetrics {
  cumulativeRainfallMm: number;
  peakRateMmPerHour: number;
  soilSaturationPercent: number;
  riverBasinAlerts: { river: string; currentLevelM: number; dangerLevelM: number; status: "Breaching" | "Critical" | "Warning" }[];
  flashFloodChokePoints: { location: string; elevationM: number; riskLevel: "Critical" | "High" }[];
}

export type InfrastructureType = "power_substation" | "arterial_highway" | "hospital_shelter" | "water_facility" | "telecom_tower";

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: InfrastructureType;
  coordinates: [number, number];
  elevationM: number;
  distanceToCoastKm: number;
  capacityOrRating: string;
  riskLevel: "CRITICAL" | "HIGH" | "MODERATE" | "HARDENED";
  inundationDepthM: number;
  windImpactRating: string;
  hardeningAction: string;
  isHardened: boolean;
  notes: string;
}

export interface ParametricTrigger {
  id: string;
  parameter: string;
  threshold: string;
  currentObserved: string;
  status: "TRIGGERED" | "PRIMED" | "MONITORING";
  payoutAmountUsd: number;
  verificationSource: string;
}

export interface ParametricInsurancePolicy {
  policyNumber: string;
  insuredEntity: string;
  totalLiquidityPoolUsd: number;
  triggers: ParametricTrigger[];
  disbursedAmountUsd: number;
  claimStatus: "APPROVED - IMMEDIATE PAYOUT" | "PRIMED FOR LANDFALL" | "STANDBY";
  payoutAllocation: { category: string; amountUsd: number; percentage: number }[];
}

export interface EarlyWarningAdvisory {
  role: string;
  priority: "CRITICAL" | "URGENT" | "HIGH";
  timeframe: string;
  subject: string;
  keyDirectives: string[];
  fullDispatchText: string;
  broadcastSnippet: string;
  language: string;
}

export interface OfflineActionTask {
  id: string;
  category: "EVACUATION" | "GRID HARDENING" | "HEALTH & SHELTER" | "LOGISTICS" | "COMMS";
  timeframe: "T-24h" | "T-12h" | "T-6h" | "Landfall" | "Post-Landfall";
  task: string;
  assignedTo: string;
  completed: boolean;
  completedAt?: string;
  isCrucial: boolean;
}

export interface OutboxRadioMessage {
  id: string;
  timestamp: string;
  recipient: string;
  frequencyOrChannel: string;
  content: string;
  status: "TRANSMITTED" | "QUEUED_OFFLINE" | "FAILED";
  priority: "FLASH" | "IMMEDIATE" | "PRIORITY";
}

export type DashboardTab =
  | "geospatial"
  | "3d-vortex"
  | "surge"
  | "rainfall"
  | "infrastructure"
  | "parametric"
  | "advisories"
  | "offline-coordination";

export interface GeminiRiskAnalysis {
  executiveSummary: string;
  criticalLifelineRiskScore: {
    powerGrid: number;
    arterialRoads: number;
    medicalShelters: number;
    waterTreatment: number;
  };
  prioritizedActionTimeline: {
    timeWindow: string;
    action: string;
  }[];
  parametricTriggerNote: string;
}
