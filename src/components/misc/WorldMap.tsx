"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker, Graticule, Sphere } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import type { FeatureCollection } from "geojson";
import geoData from "@/data/world-countries.json";
import { Globe, Move } from "lucide-react";

const visitedCountries = [
  "CHN", "TWN", "USA", "SGP", "MYS", "THA", "ARE", "AUS", "NZL", "TUR", "RUS",
  "GBR", "JPN", "KOR", "FRA", "ITA", "CHE", "VAT", "CAN"
];

const researchHubs = [
  { name: "Northwestern / UChicago", city: "Chicago", coordinates: [-87.6298, 41.8781] as [number, number] },
  { name: "Univ. of Birmingham", city: "Birmingham", coordinates: [-1.8904, 52.4862] as [number, number] },
  { name: "Jinan University", city: "Guangzhou", coordinates: [113.2644, 23.1291] as [number, number] },
  { name: "National Univ. of Singapore", city: "Singapore", coordinates: [103.8198, 1.3521] as [number, number] },
];

const geographyData = geoData as FeatureCollection;

export default function WorldMap() {
  const [isClient, setIsClient] = useState(false);
  const [rotation, setRotation] = useState<[number, number]>([0, -15]);
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredEntity, setHoveredEntity] = useState<{ name: string; type: 'hub' | 'visited' | 'unvisited' } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const visitedSet = useMemo(() => new Set(visitedCountries), []);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotation(([long, lat]) => [(long + 0.3) % 360, lat]);
    }, 50);
    return () => clearInterval(interval);
  }, [isRotating, isDragging]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ 
        x: clientX - rect.left, 
        y: clientY - rect.top 
      });
    }

    if (!isDragging) return;
    
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    
    setRotation(([long, lat]) => [
      long + dx * 0.4,
      Math.max(-60, Math.min(60, lat - dy * 0.4))
    ]);
    
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsRotating(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsRotating(true), 3000);
  };

  if (!isClient) {
    return <div className="h-[400px] flex items-center justify-center text-neutral-400">Loading Globe...</div>;
  }

  return (
    <div className="space-y-6 relative" ref={containerRef}>
      <div className="flex items-center gap-4 mb-2 px-4 sm:px-0">
          <h2 className="text-3xl font-bold text-primary flex-shrink-0 font-serif">Life Journey</h2>
          <div className="h-[1px] w-full bg-neutral-100 dark:bg-neutral-900" />
      </div>

      <div 
        className="relative flex flex-col items-center group touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { if(isDragging) handleMouseUp(); setIsRotating(true); setHoveredEntity(null); }}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <div className="w-full max-w-[800px] aspect-square relative flex items-center justify-center -my-12">
          <div className="absolute w-[50%] aspect-square rounded-full bg-accent/[0.02] blur-3xl -z-10" />
          
          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{ rotate: [-rotation[0], -rotation[1], 0], scale: 265 }}
            width={800}
            height={800}
            style={{ width: "100%", height: "auto", cursor: isDragging ? "grabbing" : "grab" }}
          >
            <Sphere id="sphere" fill="transparent" stroke="transparent" />
            <Graticule stroke="rgba(128,128,128,0.08)" strokeWidth={0.5} />

            <Geographies geography={geographyData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = visitedSet.has(geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredEntity({ 
                        name: geo.properties.name, 
                        type: isVisited ? 'visited' : 'unvisited' 
                      })}
                      onMouseLeave={() => setHoveredEntity(null)}
                      style={{
                        default: {
                          fill: isVisited ? "var(--accent)" : "var(--neutral-200)",
                          fillOpacity: isVisited ? 0.4 : 0.6,
                          stroke: "var(--background)",
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                        hover: {
                          fill: isVisited ? "var(--accent)" : "var(--neutral-300)",
                          fillOpacity: isVisited ? 0.7 : 0.9,
                          stroke: "var(--background)",
                          strokeWidth: 0.4,
                          outline: "none",
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {researchHubs.map((hub) => (
              <Marker key={hub.name} coordinates={hub.coordinates}>
                <motion.g
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredEntity({ name: hub.name, type: 'hub' });
                  }}
                  onMouseLeave={() => setHoveredEntity(null)}
                  className="cursor-pointer"
                >
                   <circle r={10} fill="var(--accent)" className="animate-ping opacity-10" />
                   <circle r={5} fill="var(--accent)" className="shadow-lg" />
                   <circle r={2} fill="white" />
                </motion.g>
              </Marker>
            ))}
          </ComposableMap>

          {/* Dynamic Follow-Cursor Tooltip */}
          <AnimatePresence>
            {hoveredEntity && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ 
                    position: 'absolute',
                    left: mousePos.x,
                    top: mousePos.y - 20,
                    transform: 'translate(-50%, -100%)',
                    zIndex: 50
                }}
                className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-2 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-xl pointer-events-none text-center min-w-[140px] whitespace-nowrap"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <p className={`text-[9px] uppercase tracking-[0.2em] font-black ${
                    hoveredEntity.type === 'hub' ? 'text-accent' : 
                    hoveredEntity.type === 'visited' ? 'text-accent/70' : 'text-neutral-400'
                  }`}>
                    {hoveredEntity.type === 'hub' ? 'Academic' : 
                     hoveredEntity.type === 'visited' ? 'Visited' : 'To Be Explored'}
                  </p>
                  <h4 className="text-base font-bold text-primary font-serif tracking-tight">{hoveredEntity.name}</h4>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100/40 dark:bg-neutral-800/40 text-[9px] uppercase tracking-widest text-neutral-500 font-bold backdrop-blur-md pointer-events-none border border-neutral-200/10">
             <Move className="h-3 w-3" />
             <span>Drag to Explore</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 mt-4 px-8 py-4 rounded-3xl border border-neutral-100/50 dark:border-neutral-900/50 bg-neutral-50/20 dark:bg-neutral-900/20 backdrop-blur-sm w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.12em]">Academic</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-accent/30" />
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.12em]">Visited</span>
          </div>
          <div className="flex items-center gap-2.5">
             <Globe className="h-3.5 w-3.5 text-neutral-300" />
             <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Rotate Control</span>
          </div>
        </div>
      </div>
    </div>
  );
}
