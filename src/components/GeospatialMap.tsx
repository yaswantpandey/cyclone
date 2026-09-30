import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import { motion, AnimatePresence } from "motion/react";
import AddRounded from "@mui/icons-material/AddRounded";
import RemoveRounded from "@mui/icons-material/RemoveRounded";
import CenterFocusStrongRounded from "@mui/icons-material/CenterFocusStrongRounded";
import WavesRounded from "@mui/icons-material/WavesRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import LayersRounded from "@mui/icons-material/LayersRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import RestartAltRounded from "@mui/icons-material/RestartAltRounded";
import ViewInArRounded from "@mui/icons-material/ViewInArRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import FilterListRounded from "@mui/icons-material/FilterListRounded";
import {
  CycloneSystem,
  GEELayer,
  InfrastructureAsset,
  SurgeMetrics,
  RainfallMetrics,
  GeminiRiskAnalysis,
} from "../types/cyclone";
import { INITIAL_GEE_LAYERS } from "../data/cycloneScenarios";

export interface GeospatialMapProps {
  cyclone: CycloneSystem;
  geeLayers?: GEELayer[];
  onToggleGeeLayer?: (id: string) => void;
  onUpdateGeeOpacity?: (id: string, opacity: number) => void;
  infrastructure: InfrastructureAsset[];
  onToggleHardening: (id: string) => void;
  surgeMetrics: SurgeMetrics;
  rainfallMetrics?: RainfallMetrics;
  selectedTimeHour?: number;
  onSelectTimeHour?: (hr: number | ((prev: number) => number)) => void;
  onSimulateCustom?: () => void;
  geminiAnalysis?: GeminiRiskAnalysis | null;
  onRunGeminiAssessment?: () => void;
  isAnalyzing?: boolean;
  onSwitchTo3D?: () => void;
}

export interface CalculatedAssetRisk {
  asset: InfrastructureAsset;
  lifelineKey: "powerGrid" | "arterialRoads" | "medicalShelters" | "waterTreatment" | "telecom";
  lifelineLabel: string;
  code: string;
  baseGeminiScore: number;
  inundationModifier: number;
  coastalModifier: number;
  windModifier: number;
  hardeningDiscount: number;
  finalScore: number;
  riskCategory: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  color: string;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  cyclone,
  geeLayers: propGeeLayers,
  onToggleGeeLayer: propOnToggleGeeLayer,
  onUpdateGeeOpacity: propOnUpdateGeeOpacity,
  infrastructure = [],
  onToggleHardening,
  surgeMetrics,
  rainfallMetrics,
  selectedTimeHour: propSelectedTimeHour,
  onSelectTimeHour: propOnSelectTimeHour,
  onSimulateCustom,
  geminiAnalysis,
  onRunGeminiAssessment,
  isAnalyzing = false,
  onSwitchTo3D,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Fallbacks for optional props
  const [internalGeeLayers, setInternalGeeLayers] = useState<GEELayer[]>(INITIAL_GEE_LAYERS);
  const geeLayers = propGeeLayers || internalGeeLayers;
  const handleToggleGee = (id: string) => {
    if (propOnToggleGeeLayer) {
      propOnToggleGeeLayer(id);
    } else {
      setInternalGeeLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l))
      );
    }
  };
  const handleUpdateGeeOpacity = (id: string, opacity: number) => {
    if (propOnUpdateGeeOpacity) {
      propOnUpdateGeeOpacity(id, opacity);
    } else {
      setInternalGeeLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, opacity } : l))
      );
    }
  };

  const [internalTimeHour, setInternalTimeHour] = useState<number>(0);
  const selectedTimeHour = propSelectedTimeHour !== undefined ? propSelectedTimeHour : internalTimeHour;
  const setSelectedTimeHour = (hr: number | ((prev: number) => number)) => {
    if (propOnSelectTimeHour) {
      propOnSelectTimeHour(hr);
    } else {
      setInternalTimeHour(hr);
    }
  };

  // Map Layer States
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [filterInfraType, setFilterInfraType] = useState<string>("all");
  const [showConeOfUncertainty, setShowConeOfUncertainty] = useState(true);
  const [showWindRadii, setShowWindRadii] = useState(true);
  const [showSurgePolygon, setShowSurgePolygon] = useState(true);

  // Vulnerability Heatmap Visual Layer States
  const [showVulnerabilityHeatmap, setShowVulnerabilityHeatmap] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.65);
  const [heatmapRadiusMultiplier, setHeatmapRadiusMultiplier] = useState(1.0);
  const [pulseThreshold, setPulseThreshold] = useState<number>(80);

  // Determine active cyclone eye location based on timeline hour
  const activeEyeData = useMemo(() => {
    let pos: [number, number] = cyclone?.currentPosition || [20.5, 87.5];
    let wind = cyclone?.maxWindSpeedKmph || 160;
    let pressure = cyclone?.centralPressureHpa || 960;

    const trackHistory = cyclone?.trackHistory || [];
    const forecastTrack = cyclone?.forecastTrack || [];
    const allPoints = [...trackHistory, ...forecastTrack];
    const matched = allPoints.find((p) => p.timeOffsetHours === selectedTimeHour);
    if (matched) {
      pos = [matched.lat, matched.lng];
      wind = matched.windSpeedKmph;
      pressure = matched.centralPressureHpa;
    }
    return { pos, wind, pressure };
  }, [cyclone, selectedTimeHour]);

  // Dynamically calculate infrastructure risk scores based on geminiAnalysis state and physical models
  const calculatedRisks = useMemo((): CalculatedAssetRisk[] => {
    const lifelineScores = geminiAnalysis?.criticalLifelineRiskScore || {
      powerGrid: 88,
      arterialRoads: 92,
      medicalShelters: 65,
      waterTreatment: 78,
    };

    return (infrastructure || []).map((asset) => {
      let lifelineKey: "powerGrid" | "arterialRoads" | "medicalShelters" | "waterTreatment" | "telecom" = "powerGrid";
      let lifelineLabel = "Power Grid Substation";
      let code = "PWR";
      let baseScore = lifelineScores.powerGrid;

      if (asset.type === "power_substation") {
        lifelineKey = "powerGrid";
        lifelineLabel = "Power Grid Substation";
        code = "PWR";
        baseScore = lifelineScores.powerGrid;
      } else if (asset.type === "arterial_highway") {
        lifelineKey = "arterialRoads";
        lifelineLabel = "Arterial Highway";
        code = "HWY";
        baseScore = lifelineScores.arterialRoads;
      } else if (asset.type === "hospital_shelter") {
        lifelineKey = "medicalShelters";
        lifelineLabel = "Medical Shelter";
        code = "MED";
        baseScore = lifelineScores.medicalShelters;
      } else if (asset.type === "water_facility") {
        lifelineKey = "waterTreatment";
        lifelineLabel = "Water Treatment";
        code = "WTR";
        baseScore = lifelineScores.waterTreatment;
      } else {
        lifelineKey = "telecom";
        lifelineLabel = "Telecom Repeater";
        code = "TEL";
        baseScore = Math.round(lifelineScores.powerGrid * 0.6 + lifelineScores.arterialRoads * 0.4);
      }

      // Localized physical modifiers
      const inun = asset.inundationDepthM || 0;
      const inundationModifier = inun >= 2.0 ? 14 : inun >= 1.0 ? 9 : inun > 0 ? 5 : 0;

      const distCoast = asset.distanceToCoastKm || 10;
      const elev = asset.elevationM || 10;
      const coastalModifier =
        distCoast < 4 && elev < 3.5 ? 10 : distCoast < 8 && elev < 5 ? 6 : distCoast < 12 ? 3 : 0;

      // Distance to active cyclone eye
      const dLat = (asset.coordinates[0] - activeEyeData.pos[0]) * 111;
      const dLng = (asset.coordinates[1] - activeEyeData.pos[1]) * 111 * Math.cos((activeEyeData.pos[0] * Math.PI) / 180);
      const distToEyeKm = Math.sqrt(dLat * dLat + dLng * dLng);
      const windModifier =
        distToEyeKm <= (cyclone?.windRadii?.r64Km || 65)
          ? 12
          : distToEyeKm <= (cyclone?.windRadii?.r50Km || 140)
          ? 6
          : 0;

      // Hardening mitigation discount
      const hardeningDiscount = asset.isHardened ? 28 : 0;

      const rawScore = baseScore + inundationModifier + coastalModifier + windModifier - hardeningDiscount;
      const finalScore = Math.max(10, Math.min(100, Math.round(rawScore)));

      let riskCategory: "CRITICAL" | "HIGH" | "MODERATE" | "LOW" = "MODERATE";
      let color = "#eab308"; // Amber
      if (finalScore >= 85) {
        riskCategory = "CRITICAL";
        color = "#ef4444"; // Red
      } else if (finalScore >= 70) {
        riskCategory = "HIGH";
        color = "#f97316"; // Orange
      } else if (finalScore >= 50) {
        riskCategory = "MODERATE";
        color = "#eab308"; // Amber
      } else {
        riskCategory = "LOW";
        color = "#10b981"; // Emerald
      }

      return {
        asset,
        lifelineKey,
        lifelineLabel,
        code,
        baseGeminiScore: baseScore,
        inundationModifier,
        coastalModifier,
        windModifier,
        hardeningDiscount,
        finalScore,
        riskCategory,
        color,
      };
    });
  }, [infrastructure, geminiAnalysis, activeEyeData.pos, cyclone]);

  // Regional metrics
  const heatmapStats = useMemo(() => {
    if (!calculatedRisks.length) {
      return { avgScore: 0, criticalCount: 0, hardenedCount: 0, totalCount: 0 };
    }
    const sum = calculatedRisks.reduce((acc, r) => acc + r.finalScore, 0);
    const critical = calculatedRisks.filter((r) => r.riskCategory === "CRITICAL").length;
    const hardened = calculatedRisks.filter((r) => r.asset.isHardened).length;
    return {
      avgScore: Math.round(sum / calculatedRisks.length),
      criticalCount: critical,
      hardenedCount: hardened,
      totalCount: calculatedRisks.length,
    };
  }, [calculatedRisks]);

  const pulsingCount = useMemo(() => {
    return calculatedRisks.filter((r) => r.finalScore > pulseThreshold).length;
  }, [calculatedRisks, pulseThreshold]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: cyclone?.currentPosition || [20.5, 87.5],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
        subdomains: "abcd",
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map contents
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const activeEyePos = activeEyeData.pos;
    const activeWindSpeed = activeEyeData.wind;
    const activePressure = activeEyeData.pressure;

    const trackHistory = cyclone?.trackHistory || [];
    const forecastTrack = cyclone?.forecastTrack || [];

    // 1. Historical Track Line
    const historyLatLngs: L.LatLngExpression[] = trackHistory.map((p) => [p.lat, p.lng]);
    if (historyLatLngs.length > 1) {
      L.polyline(historyLatLngs, {
        color: "#06b6d4",
        weight: 2.5,
        opacity: 0.85,
      }).addTo(group);
    }

    // 2. Forecast Track Line
    const forecastLatLngs: L.LatLngExpression[] = [
      activeEyePos,
      ...forecastTrack.map((p) => [p.lat, p.lng] as [number, number]),
    ];
    if (forecastLatLngs.length > 1) {
      L.polyline(forecastLatLngs, {
        color: "#f97316",
        weight: 2.5,
        dashArray: "4, 6",
        opacity: 0.9,
      }).addTo(group);
    }

    // 3. Forecast Uncertainty Cone
    if (showConeOfUncertainty && forecastTrack.length > 0) {
      forecastTrack.forEach((p) => {
        const coneCircle = L.circle([p.lat, p.lng], {
          radius: (p.coneRadiusKm || 40) * 1000,
          color: "#f97316",
          weight: 1,
          dashArray: "3, 6",
          fillColor: "#ea580c",
          fillOpacity: 0.05,
        });
        coneCircle.bindTooltip(
          `<strong>${p.label}</strong><br/>Winds: ${p.windSpeedKmph} km/h | Pressure: ${p.centralPressureHpa} hPa<br/>Cone: ±${p.coneRadiusKm} km`,
          { className: "custom-map-tooltip" }
        );
        coneCircle.addTo(group);
      });
    }

    // 4. Wind Radii
    if (showWindRadii && cyclone?.windRadii) {
      L.circle(activeEyePos, {
        radius: (cyclone.windRadii.r34Km || 280) * 1000,
        color: "#eab308",
        weight: 1,
        fillColor: "#eab308",
        fillOpacity: 0.04,
      })
        .bindTooltip(`R34 Gale Field: ${cyclone.windRadii.r34Km} km (&gt;63 km/h)`, {
          className: "custom-map-tooltip",
        })
        .addTo(group);

      L.circle(activeEyePos, {
        radius: (cyclone.windRadii.r50Km || 140) * 1000,
        color: "#f97316",
        weight: 1,
        fillColor: "#f97316",
        fillOpacity: 0.08,
      })
        .bindTooltip(`R50 Storm Field: ${cyclone.windRadii.r50Km} km (&gt;93 km/h)`, {
          className: "custom-map-tooltip",
        })
        .addTo(group);

      L.circle(activeEyePos, {
        radius: (cyclone.windRadii.r64Km || 65) * 1000,
        color: "#ef4444",
        weight: 1.5,
        fillColor: "#ef4444",
        fillOpacity: 0.12,
      })
        .bindTooltip(`R64 Destructive Core: ${cyclone.windRadii.r64Km} km (&gt;119 km/h)`, {
          className: "custom-map-tooltip",
        })
        .addTo(group);
    }

    // 5. GEE Hazard Layers
    const sarLayer = (geeLayers || []).find((l) => l.id === "sentinel-1-sar");
    const demLayer = (geeLayers || []).find((l) => l.id === "srtm-dem");
    const radarLayer = (geeLayers || []).find((l) => l.id === "imd-radar");

    if (sarLayer?.enabled && showSurgePolygon) {
      const coastalSurgePolygon: [number, number][] = [
        [20.72, 87.05],
        [20.85, 87.02],
        [21.15, 87.08],
        [21.42, 87.12],
        [21.65, 87.25],
        [21.72, 87.45],
        [21.68, 87.55],
        [21.45, 87.28],
        [21.28, 86.95],
        [21.12, 86.88],
        [20.95, 86.84],
        [20.75, 86.92],
      ];

      L.polygon(coastalSurgePolygon, {
        color: "#06b6d4",
        weight: 1.5,
        fillColor: "#0284c7",
        fillOpacity: (sarLayer.opacity || 0.75) * 0.35,
        dashArray: "3, 3",
      })
        .bindPopup(`
          <div style="font-family: inherit; color: #0f172a; max-width: 250px;">
            <div style="font-weight: 700; font-size: 12px; color: #0369a1;">Sentinel-1 SAR Inundation Zone</div>
            <div style="font-size: 11px; margin-top: 4px; color: #475569;">C-band SAR dual-pol backscatter water anomaly penetrating <strong>${surgeMetrics?.inlandPenetrationKm || 9.4} km</strong> inland.</div>
            <div style="margin-top: 6px; font-size: 11px; font-mono: monospace;">Total Water Level: +${surgeMetrics?.totalWaterLevelMeters || 5.5}m MSL</div>
          </div>
        `)
        .addTo(group);
    }

    if (demLayer?.enabled) {
      const lowElevationContours: [number, number][] = [
        [20.65, 86.85],
        [20.88, 86.82],
        [21.22, 86.75],
        [21.55, 86.85],
        [21.75, 87.15],
        [21.62, 87.12],
        [21.32, 86.88],
        [20.85, 86.9],
      ];

      L.polygon(lowElevationContours, {
        color: "#ef4444",
        weight: 1,
        fillColor: "#f87171",
        fillOpacity: (demLayer.opacity || 0.65) * 0.25,
      })
        .bindPopup(`
          <div style="font-family: inherit; color: #0f172a; max-width: 240px;">
            <div style="font-weight: 700; font-size: 12px; color: #b91c1c;">SRTM DEM Shelf (&lt;3.5m MSL)</div>
            <div style="font-size: 11px; margin-top: 4px; color: #475569;">Low-lying elevation shelf vulnerable to saltwater ingress.</div>
          </div>
        `)
        .addTo(group);
    }

    if (radarLayer?.enabled) {
      const eyewallRainBand = L.circle(activeEyePos, {
        radius: 42000,
        color: "#06b6d4",
        weight: 2,
        fillColor: "#0891b2",
        fillOpacity: (radarLayer.opacity || 0.7) * 0.2,
        dashArray: "6, 6",
      });
      eyewallRainBand.bindTooltip(
        `Doppler Radar Reflectivity: &gt;52 dBZ (&gt;50mm/hr)`,
        { className: "custom-map-tooltip" }
      );
      eyewallRainBand.addTo(group);
    }

    // 6. Vulnerability Heatmap Visual Layer
    if (showVulnerabilityHeatmap && calculatedRisks.length > 0) {
      const regionalCorridorLatLngs: [number, number][] = [
        [20.70, 87.05],
        [20.82, 86.96],
        [21.15, 87.08],
        [21.35, 86.78],
        [21.46, 87.01],
        [21.65, 87.25],
        [21.75, 87.45],
        [21.68, 87.55],
        [21.50, 87.25],
        [21.25, 86.95],
        [20.95, 86.85],
        [20.75, 86.90],
      ];

      const corridorColor =
        heatmapStats.avgScore >= 80 ? "#dc2626" : heatmapStats.avgScore >= 65 ? "#ea580c" : "#ca8a04";

      L.polygon(regionalCorridorLatLngs, {
        color: corridorColor,
        weight: 1,
        fillColor: corridorColor,
        fillOpacity: 0.1 * heatmapOpacity,
        dashArray: "4, 4",
      })
        .bindTooltip(
          `Vulnerability Corridor Index: ${heatmapStats.avgScore}/100 · Critical: ${heatmapStats.criticalCount} · Hardened: ${heatmapStats.hardenedCount}/${heatmapStats.totalCount}`,
          { className: "custom-heat-tooltip" }
        )
        .addTo(group);

      calculatedRisks.forEach((risk) => {
        if (filterInfraType !== "all" && risk.asset.type !== filterInfraType) return;

        const coords = risk.asset.coordinates;
        const score = risk.finalScore;
        const color = risk.color;

        const outerRadiusM = (24 + (score / 100) * 14) * 1000 * heatmapRadiusMultiplier;
        L.circle(coords, {
          radius: outerRadiusM,
          color: color,
          weight: 0,
          fillColor: color,
          fillOpacity: 0.06 * heatmapOpacity,
        }).addTo(group);

        const midRadiusM = (12 + (score / 100) * 8) * 1000 * heatmapRadiusMultiplier;
        L.circle(coords, {
          radius: midRadiusM,
          color: color,
          weight: 0,
          fillColor: color,
          fillOpacity: 0.18 * heatmapOpacity,
        }).addTo(group);

        const coreRadiusM = (5 + (score / 100) * 5) * 1000 * heatmapRadiusMultiplier;
        const coreCircle = L.circle(coords, {
          radius: coreRadiusM,
          color: color,
          weight: 1,
          opacity: 0.5 * heatmapOpacity,
          fillColor: color,
          fillOpacity: 0.35 * heatmapOpacity,
        });

        coreCircle.bindTooltip(
          `<div style="font-family: inherit;">
            <div style="font-weight: 600; color: #fff; font-size: 11px;">${risk.asset.name}</div>
            <div style="font-mono: monospace; font-size: 10px; color: ${color};">
              Risk: ${score}/100 [${risk.riskCategory}] · ${risk.lifelineLabel}
            </div>
          </div>`,
          { className: "custom-heat-tooltip" }
        );
        coreCircle.addTo(group);
      });
    }

    // 7. Community Infrastructure Pins with Friendly Emojis & Vibrant Colors
    calculatedRisks.forEach((risk) => {
      const asset = risk.asset;
      if (filterInfraType !== "all" && asset.type !== filterInfraType) return;

      const isHardened = asset.isHardened;
      const markerColor = risk.color;
      const isExceedingThreshold = showVulnerabilityHeatmap && risk.finalScore > pulseThreshold;

      const iconEmoji =
        asset.type === "power_substation"
          ? "⚡"
          : asset.type === "arterial_highway"
          ? "🛣️"
          : asset.type === "hospital_shelter"
          ? "🏥"
          : asset.type === "water_facility"
          ? "💧"
          : "📡";

      const iconBg = isHardened ? "#10b981" : isExceedingThreshold ? "#ef4444" : "#0284c7";

      const iconHtml = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${
            isExceedingThreshold
              ? `<div class="infra-border-ripple" style="
                  position: absolute;
                  width: 34px;
                  height: 34px;
                  border-radius: 9999px;
                  background: rgba(239, 68, 68, 0.35);
                  pointer-events: none;
                  z-index: 1;
                "></div>`
              : ""
          }
          <div class="${isExceedingThreshold ? "infra-border-pulse-high" : ""}" style="
            background: ${iconBg};
            width: 30px;
            height: 30px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.18);
            position: relative;
            z-index: 2;
            font-size: 14px;
          ">
            <span>${isHardened ? "✅" : iconEmoji}</span>
          </div>
          ${
            showVulnerabilityHeatmap
              ? `<div style="
                  position: absolute;
                  bottom: -3px;
                  right: -4px;
                  background: #ffffff;
                  border: 1.5px solid ${isExceedingThreshold ? "#ef4444" : "#0284c7"};
                  color: ${isExceedingThreshold ? "#dc2626" : "#0369a1"};
                  font-size: 9px;
                  font-weight: 800;
                  font-family: inherit;
                  padding: 1px 3px;
                  border-radius: 6px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.12);
                  line-height: 1;
                  z-index: 3;
                ">
                  ${risk.finalScore}
                </div>`
              : ""
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-infra-div-icon",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(asset.coordinates, { icon: customIcon });

      const popupContent = document.createElement("div");
      popupContent.style.fontFamily = "inherit";
      popupContent.style.maxWidth = "290px";
      popupContent.style.color = "#0f172a";
      popupContent.innerHTML = `
        <div style="padding: 2px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 18px;">${iconEmoji}</span>
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.2;">${asset.name}</div>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: ${isHardened ? "#059669" : markerColor};">
              ${isHardened ? "✅ Protected & Prepared" : risk.riskCategory + " Priority"}
            </span>
            <span style="font-size: 11px; font-weight: 800; background: #f0f9ff; color: #0284c7; padding: 1px 6px; border-radius: 6px; border: 1px solid #bae6fd;">
              Risk: ${risk.finalScore}/100
            </span>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px; font-size: 11px; color: #475569; margin-bottom: 6px;">
            <div>🌊 Expected water depth: <strong>+${asset.inundationDepthM}m</strong></div>
            <div>📍 Distance to coast: <strong>${asset.distanceToCoastKm} km</strong></div>
            <div>🏔️ Elevation above sea: <strong>${asset.elevationM}m</strong></div>
          </div>

          <div style="font-size: 11px; color: #334155; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 6px 8px; margin-bottom: 6px; line-height: 1.3;">
            <strong style="color: #92400e;">Safety Plan:</strong> ${asset.hardeningAction}
          </div>
        </div>
      `;

      const actionButton = document.createElement("button");
      actionButton.style.marginTop = "4px";
      actionButton.style.width = "100%";
      actionButton.style.padding = "7px 8px";
      actionButton.style.fontSize = "11px";
      actionButton.style.fontWeight = "700";
      actionButton.style.borderRadius = "8px";
      actionButton.style.border = "none";
      actionButton.style.cursor = "pointer";
      actionButton.style.transition = "all 0.2s";

      if (isHardened) {
        actionButton.style.background = "#dcfce7";
        actionButton.style.color = "#15803d";
        actionButton.innerText = "✅ Protected (Click to Reset)";
      } else {
        actionButton.style.background = "#0284c7";
        actionButton.style.color = "#ffffff";
        actionButton.innerText = "🛡️ Mark as Protected";
      }

      actionButton.onclick = () => {
        onToggleHardening(asset.id);
        marker.closePopup();
      };

      popupContent.appendChild(actionButton);
      marker.bindPopup(popupContent);
      marker.addTo(group);
    });

    // 8. Cyclone Eye Center Marker (Clean Meteorological Crosshair)
    const eyeIconHtml = `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #ef4444; opacity: 0.7;"></div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background: #dc2626; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center;"></div>
        <div style="position: absolute; width: 1px; height: 40px; background: rgba(239,68,68,0.6);"></div>
        <div style="position: absolute; width: 40px; height: 1px; background: rgba(239,68,68,0.6);"></div>
      </div>
    `;

    const eyeIcon = L.divIcon({
      html: eyeIconHtml,
      className: "custom-cyclone-eye-icon",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const eyeMarker = L.marker(activeEyePos, { icon: eyeIcon });
    eyeMarker.bindPopup(`
      <div style="font-family: inherit; color: #0f172a; max-width: 240px; font-size: 11px;">
        <div style="font-weight: 700; color: #b91c1c;">CYCLONE ${cyclone?.name || "ALERT"}</div>
        <div style="color: #64748b; font-size: 10px;">${cyclone?.category || "VSCS"}</div>
        <div style="margin-top: 4px; font-family: monospace;">
          <div>Winds: ${activeWindSpeed} km/h</div>
          <div>Pressure: ${activePressure} hPa</div>
          <div>Speed: ${cyclone?.forwardSpeedKmph || 16} km/h · Heading ${cyclone?.headingDeg || 330}°</div>
          <div>Zone: ${cyclone?.landfallZone || "Coastal Sector"}</div>
        </div>
      </div>
    `);
    eyeMarker.addTo(group);
  }, [
    cyclone,
    geeLayers,
    infrastructure,
    filterInfraType,
    showConeOfUncertainty,
    showWindRadii,
    showSurgePolygon,
    showVulnerabilityHeatmap,
    heatmapOpacity,
    heatmapRadiusMultiplier,
    calculatedRisks,
    activeEyeData,
    surgeMetrics,
    heatmapStats,
    onToggleHardening,
    pulseThreshold,
  ]);

  // Timeline playback loop
  useEffect(() => {
    let interval: any = null;
    if (isPlayingTimeline) {
      const timelineHours = [-36, -24, -12, 0, 6, 12, 18, 24];
      interval = setInterval(() => {
        setSelectedTimeHour((prev: number) => {
          const currentIndex = timelineHours.indexOf(prev);
          if (currentIndex === -1 || currentIndex >= timelineHours.length - 1) {
            return timelineHours[0];
          }
          return timelineHours[currentIndex + 1];
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && cyclone?.currentPosition) {
      mapInstanceRef.current.setView(cyclone.currentPosition, 7, { animate: true });
    }
  };

  const handleZoomLandfall = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([21.1, 87.1], 9, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border-2 border-sky-100 bg-sky-50 shadow-md flex flex-col">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Floating HUD Controls (Top-Right) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        {onSwitchTo3D && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSwitchTo3D}
            className="px-3 py-1.5 rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-500 to-sky-600 text-white flex items-center justify-center gap-1.5 transition-all text-xs font-black cursor-pointer shadow-md"
            title="Launch Three.js 3D Storm Simulator"
          >
            <ViewInArRounded fontSize="small" />
            <span>3D Storm View</span>
          </motion.button>
        )}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded-xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors text-base font-bold shadow-xs cursor-pointer"
            title="Zoom In"
          >
            <AddRounded fontSize="small" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded-xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors text-base font-bold shadow-xs cursor-pointer"
            title="Zoom Out"
          >
            <RemoveRounded fontSize="small" />
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleRecenter}
          className="px-2.5 h-8 rounded-xl bg-white border-2 border-sky-200 text-sky-700 hover:bg-sky-50 flex items-center justify-center gap-1 transition-colors text-xs font-bold shadow-xs cursor-pointer"
          title="Recenter on Cyclone Eye"
        >
          <CenterFocusStrongRounded fontSize="inherit" className="text-sky-600" />
          <span>Eye</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleZoomLandfall}
          className="px-2.5 h-8 rounded-xl bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-50 flex items-center justify-center gap-1 transition-colors text-xs font-bold shadow-xs cursor-pointer"
          title="Focus Landfall Arc"
        >
          <WavesRounded fontSize="inherit" className="text-amber-600" />
          <span>Waves</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowVulnerabilityHeatmap(!showVulnerabilityHeatmap)}
          className={`px-3 py-1 rounded-xl border-2 flex items-center justify-center gap-1 transition-all text-xs font-bold cursor-pointer shadow-xs ${
            showVulnerabilityHeatmap
              ? "bg-rose-500 border-rose-600 text-white"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
          title="Toggle Vulnerability Heatmap"
        >
          <LocalFireDepartmentRounded fontSize="inherit" />
          <span>Heatmap</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className={`px-3 py-1 rounded-xl border-2 flex items-center justify-center gap-1 transition-all text-xs font-bold cursor-pointer shadow-xs ${
            showLayerPanel
              ? "bg-sky-600 border-sky-700 text-white"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
          title="Toggle Map Layers"
        >
          <LayersRounded fontSize="inherit" />
          <span>Layers</span>
        </motion.button>
      </div>

      {/* Floating Layer Control Dock (Top-Left) */}
      {showLayerPanel && (
        <div className="absolute top-3 left-3 z-10 w-80 max-h-[520px] flex flex-col bg-white/95 backdrop-blur-xs border-2 border-sky-100 rounded-3xl p-4 text-xs shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🗺️</span>
              <span>Map Layers & Overlays</span>
            </span>
            <button
              onClick={() => setShowLayerPanel(false)}
              className="text-slate-400 hover:text-slate-700 w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto space-y-2.5 pr-1">
            {/* Vulnerability Heatmap Controller */}
            <div className="p-3 rounded-2xl border-2 border-rose-100 bg-rose-50/50">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showVulnerabilityHeatmap}
                    onChange={() => setShowVulnerabilityHeatmap(!showVulnerabilityHeatmap)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-rose-950 text-xs">🔥 Risk & Flood Heatmap</span>
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  AI Model
                </span>
              </div>

              {showVulnerabilityHeatmap && (
                <div className="mt-2.5 space-y-2 pt-2 border-t border-rose-200/80 text-xs">
                  {/* Opacity Slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 w-16 text-[11px]">Glow:</span>
                    <input
                      type="range"
                      min="0.15"
                      max="1"
                      step="0.05"
                      value={heatmapOpacity}
                      onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    />
                    <span className="text-slate-700 font-bold w-8 text-right text-[11px]">
                      {Math.round(heatmapOpacity * 100)}%
                    </span>
                  </div>

                  {/* Radius Slider */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 w-16 text-[11px]">Spread:</span>
                    <input
                      type="range"
                      min="0.6"
                      max="1.8"
                      step="0.1"
                      value={heatmapRadiusMultiplier}
                      onChange={(e) => setHeatmapRadiusMultiplier(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    />
                    <span className="text-slate-700 font-bold w-8 text-right text-[11px]">
                      {heatmapRadiusMultiplier.toFixed(1)}x
                    </span>
                  </div>

                  {/* Pulse Threshold */}
                  <div className="flex items-center gap-2 pt-1 border-t border-rose-200/80">
                    <span className="text-slate-600 w-16 text-[11px]">Alert &gt;:</span>
                    <input
                      type="range"
                      min="60"
                      max="90"
                      step="5"
                      value={pulseThreshold}
                      onChange={(e) => setPulseThreshold(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    />
                    <span className="text-rose-700 font-black w-8 text-right text-[11px]">
                      {pulseThreshold}
                    </span>
                  </div>

                  {/* Lifeline Vectors Grid */}
                  <div className="p-2 bg-white rounded-xl border border-rose-200 grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="flex justify-between text-slate-700">
                      <span>⚡ Power:</span>
                      <strong className="text-rose-700">{geminiAnalysis?.criticalLifelineRiskScore?.powerGrid ?? 88}%</strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>🛣️ Roads:</span>
                      <strong className="text-amber-700">{geminiAnalysis?.criticalLifelineRiskScore?.arterialRoads ?? 92}%</strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>🏥 Shelters:</span>
                      <strong className="text-emerald-700">{geminiAnalysis?.criticalLifelineRiskScore?.medicalShelters ?? 65}%</strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>💧 Water:</span>
                      <strong className="text-sky-700">{geminiAnalysis?.criticalLifelineRiskScore?.waterTreatment ?? 78}%</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Satellite Feeds */}
            <div className="space-y-1.5">
              {(geeLayers || []).map((layer) => (
                <div key={layer.id} className="p-2 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={layer.enabled}
                        onChange={() => handleToggleGee(layer.id)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-slate-800 text-xs font-semibold">{layer.name}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Weather Features Toggles */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
              <button
                onClick={() => setShowConeOfUncertainty(!showConeOfUncertainty)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  showConeOfUncertainty
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                🎯 Storm Path
              </button>
              <button
                onClick={() => setShowWindRadii(!showWindRadii)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  showWindRadii
                    ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                💨 Strong Winds
              </button>
              <button
                onClick={() => setShowSurgePolygon(!showSurgePolygon)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  showSurgePolygon
                    ? "bg-sky-500 text-white border-sky-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                🌊 Flood Zone
              </button>
            </div>

            {/* Infrastructure Filter */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Filter Places on Map:
              </label>
              <select
                value={filterInfraType}
                onChange={(e) => setFilterInfraType(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">Show All Places ({infrastructure.length})</option>
                <option value="power_substation">⚡ Power Stations (PWR)</option>
                <option value="arterial_highway">🛣️ Highways & Roads (HWY)</option>
                <option value="hospital_shelter">🏥 Hospitals & Shelters (MED)</option>
                <option value="water_facility">💧 Clean Water Plants (WTR)</option>
                <option value="telecom_tower">📡 Cell & Radio Towers (TEL)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Floating Telemetry Legend Bar (Bottom-Right) */}
      <div className="absolute bottom-16 right-3 z-10 bg-white/95 backdrop-blur-xs border-2 border-slate-200 rounded-2xl p-3 text-xs flex flex-col gap-1.5 max-w-xs shadow-lg">
        <div className="flex items-center justify-between gap-4 text-slate-800">
          <span className="font-bold text-xs">Risk Heatmap Scale</span>
          <span className="font-black text-rose-600 text-xs">{heatmapStats.avgScore}/100 Average</span>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
          <div className="h-full bg-emerald-500 w-1/4" title="Low Risk"></div>
          <div className="h-full bg-amber-400 w-1/4" title="Moderate"></div>
          <div className="h-full bg-orange-500 w-1/4" title="High Risk"></div>
          <div className="h-full bg-rose-600 w-1/4" title="Severe Alert"></div>
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
          <span className="text-emerald-700">Safe</span>
          <span className="text-amber-700">Watch</span>
          <span className="text-orange-700">High</span>
          <span className="text-rose-700">Severe</span>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-slate-600 text-xs">
          <span>Protected Places:</span>
          <strong className="text-emerald-700">{heatmapStats.hardenedCount} of {heatmapStats.totalCount} ready</strong>
        </div>

        {pulsingCount > 0 && (
          <div className="flex items-center justify-between text-rose-600 font-bold text-xs bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
            <span>⚠️ High Alert (&gt;{pulseThreshold}):</span>
            <span>{pulsingCount} places</span>
          </div>
        )}
      </div>

      {/* Timeline Scrubber Bar (Bottom) */}
      <div className="bg-white border-t border-slate-200 p-3 px-4 flex items-center justify-between gap-3 text-xs z-10 rounded-b-3xl shadow-xs">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            {isPlayingTimeline ? <PauseRounded fontSize="small" /> : <PlayArrowRounded fontSize="small" />}
            <span>{isPlayingTimeline ? "Pause" : "Play Storm Motion"}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setIsPlayingTimeline(false);
              setSelectedTimeHour(0);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
          >
            <RestartAltRounded fontSize="small" />
            <span>Reset</span>
          </motion.button>
          <span className="text-sky-800 text-xs font-black ml-1.5 hidden sm:inline">
            {selectedTimeHour === 0
              ? "🌀 Storm Landfall (Peak)"
              : selectedTimeHour < 0
              ? `⏳ In ${Math.abs(selectedTimeHour)}h: Approaching Coast`
              : `💨 In +${selectedTimeHour}h: Storm Moving Inland`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[-36, -24, -12, 0, 6, 12, 18, 24].map((hr) => (
            <motion.button
              key={hr}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsPlayingTimeline(false);
                setSelectedTimeHour(hr);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedTimeHour === hr
                  ? "bg-sky-600 text-white shadow-xs scale-105"
                  : hr === 0
                  ? "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {hr === 0 ? "Landfall" : hr > 0 ? `+${hr}h` : `${hr}h`}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
