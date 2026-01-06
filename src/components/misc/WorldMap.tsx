"use client";

import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import type { FeatureCollection } from "geojson";
import geoData from "@/data/world-countries.json";

const visitedCountries = [
  "CHN", "TWN", "USA", "SGP", "MYS", "THA", "ARE", "AUS", "NZL", "TUR", "RUS",
  "GBR", "JPN", "KOR", "FRA", "ITA", "CHE", "VAT", "CAN"
];

const geographyData = geoData as FeatureCollection;

export default function WorldMap() {
  const [isClient, setIsClient] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1.2 });
  const visitedSet = useMemo(() => new Set(visitedCountries), []);

  useEffect(() => setIsClient(true), []);
  if (!isClient) {
    return <div className="border rounded-lg p-6 text-center text-sm text-neutral-500">Loading map…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-3xl font-bold text-primary">Where I&apos;ve Been</h2>
        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-1">
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm" style={{ background: "#5AC8FA" }} />Visited</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm" style={{ background: "#e5e7eb" }} />Not yet</div>
        </div>
      </div>
      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ rotate: [-10, 0, 0], scale: 150 }}
          width= {800}
          height={400}
          style={{ width: "100%", height: "auto", maxHeight: 420 }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates, zoom })}
          >
            <Geographies geography={geographyData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const code = geo.id;
                  const isVisited = visitedSet.has(code);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHovered(geo.properties.name)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        default: {
                          fill: isVisited ? "#5AC8FA" : "#e5e7eb",
                          stroke: "#ffffff",
                          strokeWidth: 0.6,
                          outline: "none",
                          transition: "fill 0.2s",
                        },
                        hover: {
                          fill: "#3b82f6",
                          stroke: "#ffffff",
                          strokeWidth: 0.9,
                          outline: "none",
                        },
                        pressed: {
                          fill: isVisited ? "#5AC8FA" : "#e5e7eb",
                          stroke: "#ffffff",
                          strokeWidth: 0.9,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        {hovered && (
          <div className="absolute left-1/2 top-2 -translate-x-1/2 bg-white/90 dark:bg-neutral-900/90 text-sm px-3 py-2 rounded-md shadow z-10">
            {hovered}
          </div>
        )}
      </div>
    </div>
  );
}
