import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { CycloneSystem, SurgeMetrics } from "../types/cyclone";
import AirRounded from "@mui/icons-material/AirRounded";
import WavesRounded from "@mui/icons-material/WavesRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import RestartAltRounded from "@mui/icons-material/RestartAltRounded";
import ViewInArRounded from "@mui/icons-material/ViewInArRounded";
import CenterFocusStrongRounded from "@mui/icons-material/CenterFocusStrongRounded";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import SpeedRounded from "@mui/icons-material/SpeedRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import GridViewRounded from "@mui/icons-material/GridViewRounded";
import WaterDropRounded from "@mui/icons-material/WaterDropRounded";

interface CycloneThreeVisualizerProps {
  cyclone: CycloneSystem;
  surgeMetrics: SurgeMetrics;
  onSwitchTo2DMap?: () => void;
}

export const CycloneThreeVisualizer: React.FC<CycloneThreeVisualizerProps> = ({
  cyclone,
  surgeMetrics,
  onSwitchTo2DMap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // 3D Objects refs
  const cycloneParticlesRef = useRef<THREE.Points | null>(null);
  const oceanMeshRef = useRef<THREE.Mesh | null>(null);
  const oceanGeometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const eyeMarkerMeshRef = useRef<THREE.Mesh | null>(null);

  // Interactive UI state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [showOceanWireframe, setShowOceanWireframe] = useState<boolean>(false);
  const [showAnatomyLabels, setShowAnatomyLabels] = useState<boolean>(true);
  const [selectedCameraPreset, setSelectedCameraPreset] = useState<"isometric" | "satellite" | "shore">("isometric");
  const [simulatedWindSpeed, setSimulatedWindSpeed] = useState<number>(cyclone.maxWindSpeedKmph);
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  // Drag interaction state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraRotationRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3.2,
    radius: 75,
  });

  // Keep wind speed in sync if prop changes
  useEffect(() => {
    setSimulatedWindSpeed(cyclone.maxWindSpeedKmph);
  }, [cyclone.maxWindSpeedKmph]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#e8f2fa");
    scene.fog = new THREE.FogExp2("#e8f2fa", 0.007);

    // 2. Camera Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // Context loss & restore handlers
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("Three.js WebGL context lost");
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
    const handleContextRestored = () => {
      console.info("Three.js WebGL context restored");
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);
    renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored, false);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight("#bfe0f8", 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#fff7ed", 2.2);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight("#38bdf8", 1.4);
    rimLight.position.set(-40, 25, -40);
    scene.add(rimLight);

    // 5. Build 3D Ocean Surface (Wavy Plane)
    const oceanSegments = 64;
    const oceanSize = 130;
    const oceanGeometry = new THREE.PlaneGeometry(oceanSize, oceanSize, oceanSegments, oceanSegments);
    oceanGeometry.rotateX(-Math.PI / 2);
    oceanGeometryRef.current = oceanGeometry;

    // Store initial positions for wave deformation
    const basePositions = oceanGeometry.attributes.position.array.slice();

    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0284c7"),
      roughness: 0.25,
      metalness: 0.15,
      wireframe: false,
      transparent: true,
      opacity: 0.88,
      flatShading: true,
    });
    const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    oceanMesh.position.y = -2;
    scene.add(oceanMesh);
    oceanMeshRef.current = oceanMesh;

    // 6. Build 3D Coastline Terrain Slab
    const coastGeo = new THREE.BoxGeometry(45, 4, 130);
    const coastMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#86efac"),
      roughness: 0.8,
      metalness: 0.05,
    });
    const coastMesh = new THREE.Mesh(coastGeo, coastMat);
    coastMesh.position.set(50, -1, 0);
    scene.add(coastMesh);

    // Beach sand strip
    const sandGeo = new THREE.BoxGeometry(8, 3.8, 130);
    const sandMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#fde68a"),
      roughness: 0.9,
    });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.set(24, -1, 0);
    scene.add(sandMesh);

    // 7. Build Cyclone Particle Spiral Vortex
    const particleCount = 14000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount);

    const spiralArms = 4;
    const colorCore = new THREE.Color("#06b6d4"); // Cyan calm eye
    const colorEyewall = new THREE.Color("#f97316"); // Vibrant amber eyewall
    const colorOuter = new THREE.Color("#0284c7"); // Deep oceanic blue
    const colorCloud = new THREE.Color("#ffffff"); // White cirrus tops

    for (let i = 0; i < particleCount; i++) {
      const arm = i % spiralArms;
      const armOffset = (arm * 2 * Math.PI) / spiralArms;

      // Distance from center (r: 1.5 to 38)
      const u = Math.random();
      const r = 1.5 + Math.pow(u, 1.8) * 36;
      particleRadii[i] = r;

      // Logarithmic spiral angle + jitter
      const angle = armOffset + Math.log(r + 0.1) * 2.8 + (Math.random() - 0.5) * 0.45;
      particleAngles[i] = angle;

      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);

      // Height: eyewall has dramatic vertical convective updraft
      let y = 1.5 + Math.random() * 4.5;
      if (r < 7) {
        // Eyewall updraft reaches up to 14 units
        y = 2 + (1 - r / 7) * 9 + Math.random() * 3.5;
      } else if (r < 18) {
        y = 2 + (1 - r / 18) * 4.5 + Math.random() * 2.5;
      }

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Color interpolation: Center = cyan, Eyewall = orange, Outer = blue, Tops = white
      const c = new THREE.Color();
      if (r < 6) {
        c.lerpColors(colorCore, colorEyewall, r / 6);
      } else if (r < 18) {
        c.lerpColors(colorEyewall, colorOuter, (r - 6) / 12);
      } else {
        c.lerpColors(colorOuter, colorCloud, Math.min(1, (r - 18) / 20));
      }

      // Add slight random brightness variation
      c.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);

      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;

      // Inner particles spin faster (Keplerian / Rankine vortex profile)
      particleSpeeds[i] = (1 / Math.sqrt(Math.max(1.2, r))) * 1.8;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    // Particle texture canvas for smooth rounded glowing dots
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.4, "rgba(255,255,255,0.85)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const cycloneParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(cycloneParticles);
    cycloneParticlesRef.current = cycloneParticles;

    // 8. 3D Calm Eye Marker Center
    const eyeRingGeo = new THREE.RingGeometry(1.2, 2.0, 32);
    eyeRingGeo.rotateX(-Math.PI / 2);
    const eyeRingMat = new THREE.MeshBasicMaterial({
      color: "#06b6d4",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const eyeRingMesh = new THREE.Mesh(eyeRingGeo, eyeRingMat);
    eyeRingMesh.position.set(0, 0.5, 0);
    scene.add(eyeRingMesh);
    eyeMarkerMeshRef.current = eyeRingMesh;

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Only advance motion if isPlaying is active
      const animSpeed = isPlaying ? (simulatedWindSpeed / 140) * speedMultiplier : 0;

      // Animate Cyclone Particles
      if (cycloneParticlesRef.current) {
        const posAttr = cycloneParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const r = particleRadii[i];
          const speed = particleSpeeds[i] * animSpeed;

          // Rotate counterclockwise (Northern hemisphere storm)
          particleAngles[i] += speed * delta * 2.2;
          const newAngle = particleAngles[i];

          positions[i * 3] = r * Math.cos(newAngle);
          positions[i * 3 + 2] = r * Math.sin(newAngle);

          // Subtle vertical atmospheric oscillation
          const baseHeight = i % 2 === 0 ? 3 : 2;
          positions[i * 3 + 1] += Math.sin(elapsedTime * 2 + r) * 0.015 * animSpeed;
        }
        posAttr.needsUpdate = true;
      }

      // Animate Ocean Waves with vertex displacement
      if (oceanMeshRef.current && oceanGeometryRef.current) {
        const posAttr = oceanGeometryRef.current.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;
        const surgeFactor = (surgeMetrics.totalWaterLevelMeters || 3.5) / 3.0;

        for (let i = 0; i < positions.length; i += 3) {
          const x = basePositions[i];
          const z = basePositions[i + 2];

          // Compute distance to cyclone eye center
          const distToEye = Math.sqrt(x * x + z * z);

          // Ocean waves: radial swell towards the beach
          const wavePhase = elapsedTime * 1.8 * (isPlaying ? 1 : 0) - distToEye * 0.18;
          const waveHeight =
            Math.sin(wavePhase) * 1.1 * surgeFactor +
            Math.cos(x * 0.25 + elapsedTime * 1.2) * 0.6 +
            Math.sin(z * 0.2 + elapsedTime * 0.9) * 0.4;

          // Extra bulge under the cyclone center (inverse barometer effect + wind drag)
          const surgeMound = Math.max(0, 1 - distToEye / 30) * 2.8 * surgeFactor;

          positions[i + 1] = waveHeight + surgeMound;
        }
        posAttr.needsUpdate = true;
        oceanGeometryRef.current.computeVertexNormals();
      }

      // Rotate eye ring
      if (eyeMarkerMeshRef.current) {
        eyeMarkerMeshRef.current.rotation.y += delta * 0.8 * (isPlaying ? 1 : 0);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      oceanGeometry.dispose();
      oceanMaterial.dispose();
      coastGeo.dispose();
      coastMat.dispose();
      sandGeo.dispose();
      sandMat.dispose();
    };
  }, [simulatedWindSpeed, speedMultiplier, isPlaying, surgeMetrics.totalWaterLevelMeters]);

  // Update ocean wireframe mode
  useEffect(() => {
    if (oceanMeshRef.current) {
      const mat = oceanMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.wireframe = showOceanWireframe;
      mat.needsUpdate = true;
    }
  }, [showOceanWireframe]);

  // Camera Orbit Helper
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraRotationRef.current;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    cameraRef.current.position.set(x, Math.max(8, y), z);
    cameraRef.current.lookAt(0, 3, 0);
  };

  // Mouse Drag Handler
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cameraRotationRef.current.theta -= deltaX * 0.007;
    cameraRotationRef.current.phi = Math.max(
      0.15,
      Math.min(Math.PI / 2.05, cameraRotationRef.current.phi - deltaY * 0.007)
    );

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraRotationRef.current.radius = Math.max(
      35,
      Math.min(130, cameraRotationRef.current.radius + e.deltaY * 0.05)
    );
    updateCameraPosition();
  };

  // Preset Views
  const applyPresetView = (preset: "isometric" | "satellite" | "shore") => {
    setSelectedCameraPreset(preset);
    if (preset === "satellite") {
      cameraRotationRef.current = { theta: 0, phi: 0.15, radius: 82 };
    } else if (preset === "shore") {
      cameraRotationRef.current = { theta: 0.05, phi: Math.PI / 2.3, radius: 52 };
    } else {
      cameraRotationRef.current = { theta: Math.PI / 4, phi: Math.PI / 3.2, radius: 75 };
    }
    updateCameraPosition();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4 text-xs font-sans select-none"
    >
      {/* Friendly Three.js Showcase Header */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-indigo-50 border-2 border-sky-100 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 text-white rounded-2xl shadow-md">
            <ViewInArRounded fontSize="medium" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                3D Tropical Cyclone Vortex & Wave Simulator
              </h2>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-200">
                Three.js WebGL
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Drag around with your mouse to explore the calm eye, spiraling rainbands, and surging ocean waves in 3D!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onSwitchTo2DMap && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSwitchTo2DMap}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CenterFocusStrongRounded fontSize="small" className="text-sky-600" />
              <span>Switch to 2D Map</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
              isPlaying
                ? "bg-sky-600 hover:bg-sky-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            {isPlaying ? <PauseRounded fontSize="small" /> : <PlayArrowRounded fontSize="small" />}
            <span>{isPlaying ? "Pause 3D Motion" : "Play 3D Motion"}</span>
          </motion.button>
        </div>
      </div>

      {/* Main 3D Viewport Box */}
      <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border-2 border-sky-100 bg-[#e8f2fa] shadow-md flex flex-col">
        {/* Canvas container with mouse drag listeners */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full flex-1 z-0 cursor-grab active:cursor-grabbing"
          title="Drag to rotate view | Scroll to zoom"
        />

        {/* Floating Top-Right Camera Controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          <div className="bg-white/95 backdrop-blur-xs border-2 border-slate-200 rounded-2xl p-1.5 shadow-md flex flex-col gap-1 text-[11px] font-bold">
            <span className="text-[10px] uppercase tracking-wide text-slate-400 px-2 pt-0.5">Camera Views</span>
            <button
              onClick={() => applyPresetView("isometric")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCameraPreset === "isometric"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ViewInArRounded fontSize="inherit" />
              <span>3D Orbit</span>
            </button>
            <button
              onClick={() => applyPresetView("satellite")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCameraPreset === "satellite"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <CenterFocusStrongRounded fontSize="inherit" />
              <span>Top Satellite</span>
            </button>
            <button
              onClick={() => applyPresetView("shore")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCameraPreset === "shore"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <WavesRounded fontSize="inherit" />
              <span>Beach View</span>
            </button>
          </div>

          {/* Quick HUD toggles */}
          <div className="bg-white/95 backdrop-blur-xs border-2 border-slate-200 rounded-2xl p-1.5 shadow-md flex flex-col gap-1 text-xs">
            <button
              onClick={() => setShowOceanWireframe(!showOceanWireframe)}
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] ${
                showOceanWireframe
                  ? "bg-indigo-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Ocean Surface Grid"
            >
              <GridViewRounded fontSize="inherit" />
              <span>Wave Grid</span>
            </button>
            <button
              onClick={() => setShowAnatomyLabels(!showAnatomyLabels)}
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] ${
                showAnatomyLabels
                  ? "bg-emerald-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Storm Anatomy Callouts"
            >
              <InfoOutlined fontSize="inherit" />
              <span>Anatomy Tips</span>
            </button>
          </div>
        </div>

        {/* Floating Top-Left Physics Telemetry Card */}
        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs border-2 border-sky-100 rounded-3xl p-3.5 shadow-lg max-w-xs space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold">
              <ScienceRounded className="text-indigo-600" fontSize="small" />
              <span>Storm Dynamics</span>
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              {cyclone.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
              <span className="text-[10px] text-slate-500 block">Sustained Winds:</span>
              <span className="font-black text-slate-900 text-sm">{simulatedWindSpeed} km/h</span>
            </div>
            <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-100">
              <span className="text-[10px] text-slate-500 block">Wave Rise (Surge):</span>
              <span className="font-black text-amber-900 text-sm">+{surgeMetrics.totalWaterLevelMeters}m</span>
            </div>
            <div className="bg-indigo-50/70 p-2 rounded-xl border border-indigo-100">
              <span className="text-[10px] text-slate-500 block">Eye Radius:</span>
              <span className="font-black text-indigo-900 text-sm">~14 km</span>
            </div>
            <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 block">3D Particles:</span>
              <span className="font-black text-emerald-900 text-sm">14,000</span>
            </div>
          </div>

          {/* Interactive Wind Intensity Slider */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="flex justify-between font-bold text-slate-800 text-[11px]">
              <span className="flex items-center gap-1">
                <SpeedRounded fontSize="inherit" className="text-rose-500" />
                <span>Simulate Wind Speed:</span>
              </span>
              <span className="text-rose-600 font-extrabold">{simulatedWindSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="90"
              max="260"
              value={simulatedWindSpeed}
              onChange={(e) => setSimulatedWindSpeed(parseInt(e.target.value))}
              className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>Cat 1 (100)</span>
              <span>Cat 3 (185)</span>
              <span>Super (250+)</span>
            </div>
          </div>
        </div>

        {/* Floating Storm Anatomy Callouts Overlay */}
        {showAnatomyLabels && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-3 z-10 bg-white/95 backdrop-blur-xs border-2 border-slate-200 rounded-2xl p-3 shadow-lg max-w-sm text-xs space-y-2"
            >
              <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <WaterDropRounded className="text-sky-500" fontSize="small" />
                  <span>3D Storm Anatomy Guide:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Click a label to learn</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    id: "eye",
                    name: "🌀 The Calm Eye",
                    color: "border-cyan-300 bg-cyan-50 text-cyan-900",
                    desc: "The peaceful center of the cyclone where air gently sinks. Skies can be clear inside the eye!",
                  },
                  {
                    id: "eyewall",
                    name: "💨 The Fierce Eyewall",
                    color: "border-amber-300 bg-amber-50 text-amber-900",
                    desc: "The thick ring of towering thunderstorms right outside the eye. This is where winds blow the hardest!",
                  },
                  {
                    id: "surge",
                    name: "🌊 Coastal Wave Rise",
                    color: "border-sky-300 bg-sky-50 text-sky-900",
                    desc: "Winds push the ocean water against the shallow coastline, causing water levels to rise like a giant snowplow.",
                  },
                  {
                    id: "rainbands",
                    name: "🌧️ Spiral Rainbands",
                    color: "border-indigo-300 bg-indigo-50 text-indigo-900",
                    desc: "Curved arms of rain and wind that spiral inward toward the storm center, extending for hundreds of miles.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveCallout(activeCallout === item.id ? null : item.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${item.color} ${
                      activeCallout === item.id ? "ring-2 ring-sky-500 shadow-xs" : "opacity-90 hover:opacity-100"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {activeCallout && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs leading-relaxed"
                >
                  {activeCallout === "eye" &&
                    "🌀 The Calm Eye: The peaceful center of the cyclone where air gently sinks. Skies can be clear inside the eye!"}
                  {activeCallout === "eyewall" &&
                    "💨 The Fierce Eyewall: The thick ring of towering thunderstorms right outside the eye. This is where winds blow the hardest!"}
                  {activeCallout === "surge" &&
                    "🌊 Coastal Wave Rise: Winds push the ocean water against the shallow coastline, causing water levels to rise like a giant snowplow."}
                  {activeCallout === "rainbands" &&
                    "🌧️ Spiral Rainbands: Curved arms of rain and wind that spiral inward toward the storm center, extending for hundreds of miles."}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom Interactive Speed & Controls Bar */}
        <div className="bg-white border-t border-slate-200 p-3 px-4 flex items-center justify-between gap-3 text-xs z-10 rounded-b-3xl shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 hidden sm:inline">Rotation Speed:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  speedMultiplier === s
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}x Speed
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span className="hidden md:inline">💡 Drag with mouse to orbit 360° · Scroll to zoom</span>
            <button
              onClick={() => {
                cameraRotationRef.current = { theta: Math.PI / 4, phi: Math.PI / 3.2, radius: 75 };
                updateCameraPosition();
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <RestartAltRounded fontSize="inherit" />
              <span>Reset 3D View</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Scientific Educational Cards Below 3D View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white border-2 border-sky-100 rounded-2xl p-4 shadow-xs space-y-1.5"
        >
          <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase tracking-wide">
            <AirRounded fontSize="small" />
            <span>Why Cyclones Spin in Circles</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Earth is constantly turning underneath the storm! In the Northern Hemisphere, this turning effect (called the <strong>Coriolis force</strong>) deflects winds to the right, causing the entire storm to spin counterclockwise.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white border-2 border-amber-100 rounded-2xl p-4 shadow-xs space-y-1.5"
        >
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide">
            <WavesRounded fontSize="small" />
            <span>Why Ocean Waves Mound Up</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Notice how the water bulges underneath the storm center in our 3D view? Low air pressure acts like a straw pulling water up, while ferocious winds drag deep water into shallow beaches.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white border-2 border-emerald-100 rounded-2xl p-4 shadow-xs space-y-1.5"
        >
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
            <ScienceRounded fontSize="small" />
            <span>The Power of Early Warning</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Because satellites and 3D weather models track the spiral arms days before landfall, towns can move families to safety shelters, sandbag power stations, and save lives early!
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
