import * as maplibregl from "maplibre-gl"
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url"

// Vite serves the worker as a separate asset; without this, maps stay blank.
maplibregl.setWorkerUrl(maplibreWorkerUrl)

/**
 * Soft illustrated globe: flat land/water, no labels, no roads.
 * Uses MapLibre demotiles country polygons (free, no API key).
 */
export function illustratedGlobeStyle(
  tone: "light" | "dark" = "light"
): maplibregl.StyleSpecification {
  const palette =
    tone === "dark"
      ? {
          ocean: "#121110",
          land: "#2c2a26",
          coast: "#6a6358",
        }
      : {
          ocean: "#b9d9e8",
          land: "#e4eee1",
          coast: "#8eb4c2",
        }

  return {
    version: 8,
    name: tone === "dark" ? "Illustrated Globe Dark" : "Illustrated Globe",
    sources: {
      maplibre: {
        type: "vector",
        url: "https://demotiles.maplibre.org/tiles/tiles.json",
      },
    },
    layers: [
      {
        id: "ocean",
        type: "background",
        paint: { "background-color": palette.ocean },
      },
      {
        id: "land",
        type: "fill",
        source: "maplibre",
        "source-layer": "countries",
        paint: {
          "fill-color": palette.land,
        },
      },
      {
        id: "coast",
        type: "line",
        source: "maplibre",
        "source-layer": "countries",
        paint: {
          "line-color": palette.coast,
          "line-width": 0.7,
          "line-opacity": tone === "dark" ? 0.75 : 0.65,
        },
      },
    ],
  }
}

/** Esri light/dark gray raster, no API key. */
export function esriRasterStyle(
  variant: "dark" | "light" = "dark"
): maplibregl.StyleSpecification {
  const service =
    variant === "dark"
      ? "Canvas/World_Dark_Gray_Base"
      : "Canvas/World_Light_Gray_Base"
  return {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      basemap: {
        type: "raster",
        tiles: [
          `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`,
        ],
        tileSize: 256,
        maxzoom: 16,
        attribution: "Esri",
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": variant === "dark" ? "#0c1210" : "#e8eef2",
        },
      },
      {
        id: "basemap",
        type: "raster",
        source: "basemap",
      },
    ],
  }
}

/** Free Terrarium DEM (AWS public terrain tiles). */
export const TERRARIUM_DEM: maplibregl.RasterDEMSourceSpecification = {
  type: "raster-dem",
  tiles: [
    "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
  ],
  encoding: "terrarium",
  tileSize: 256,
  maxzoom: 15,
}

export function attachTerrain(
  map: maplibregl.Map,
  exaggeration: number,
  withHillshade = true
) {
  if (!map.getSource("terrain-dem")) {
    map.addSource("terrain-dem", TERRARIUM_DEM)
  }
  if (withHillshade && !map.getLayer("terrain-hills")) {
    map.addLayer({
      id: "terrain-hills",
      type: "hillshade",
      source: "terrain-dem",
      paint: {
        "hillshade-shadow-color": "#0a1210",
        "hillshade-highlight-color": "#c5d0c8",
        "hillshade-exaggeration": 0.45,
      },
    })
  }
  map.setTerrain({ source: "terrain-dem", exaggeration })
}

export function keepResizing(map: maplibregl.Map, el: HTMLElement) {
  const kick = () => {
    if (el.clientWidth > 0 && el.clientHeight > 0) map.resize()
  }
  kick()
  requestAnimationFrame(kick)
  setTimeout(kick, 80)
  setTimeout(kick, 250)
  const ro = new ResizeObserver(kick)
  ro.observe(el)
  return () => ro.disconnect()
}
