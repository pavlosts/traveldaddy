import { useEffect, useRef, useState } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import type { MapPin } from "./LeafletPlacesMap"
import {
  attachTerrain,
  esriRasterStyle,
  keepResizing,
} from "./maplibreStage" // also boots MapLibre worker for Vite

type Props = {
  pins: MapPin[]
  /** lng, lat */
  center?: [number, number]
  zoom?: number
  pitch?: number
  bearing?: number
  fitPins?: boolean
  paddingBottom?: number
  terrainExaggeration?: number
  /** dark = Terrain Glass · light = Skyline Board location */
  variant?: "dark" | "light"
  onPinSelect?: (id: string) => void
  className?: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function markerHtml(pin: MapPin) {
  const active = !!pin.active
  const name = escapeHtml(pin.name ?? "pin")

  if (pin.marker === "glass") {
    const size = active ? 14 : 10
    const glow = active
      ? "0 0 0 4px rgba(52,211,153,0.28),0 1px 4px rgba(0,0,0,.4)"
      : "0 1px 4px rgba(0,0,0,.4)"
    return `<button type="button" aria-label="${name}" style="all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center;width:28px;height:28px">
      <span style="width:${size}px;height:${size}px;border-radius:999px;background:#34d399;border:2px solid #fff;box-shadow:${glow}"></span>
    </button>`
  }

  const color = active ? "#34d399" : "#c45c3a"
  const size = active ? 14 : 12
  return `<button type="button" aria-label="${name}" style="all:unset;cursor:pointer;display:block;width:${size}px;height:${size}px;border-radius:999px;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></button>`
}

function syncMarkers(
  map: maplibregl.Map,
  pins: MapPin[],
  markers: maplibregl.Marker[],
  onPinSelect?: (id: string) => void
) {
  for (const m of markers) m.remove()
  markers.length = 0
  for (const pin of pins) {
    const node = document.createElement("div")
    node.innerHTML = markerHtml(pin)
    const btn = node.firstElementChild as HTMLElement | null
    if (btn && onPinSelect) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        onPinSelect(pin.id)
      })
    }
    markers.push(
      new maplibregl.Marker({ element: node, anchor: "center" })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map)
    )
  }
}

/** Interactive MapLibre stage with pitched terrain. Basemap first, DEM after load. */
export function InteractiveTerrainMap({
  pins,
  center,
  zoom = 2.4,
  pitch = 52,
  bearing = -18,
  fitPins = false,
  paddingBottom = 0,
  terrainExaggeration = 1.6,
  variant = "dark",
  onPinSelect,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const onPinSelectRef = useRef(onPinSelect)
  const pinsRef = useRef(pins)
  const [active, setActive] = useState(false)
  const [failed, setFailed] = useState(false)
  onPinSelectRef.current = onPinSelect
  pinsRef.current = pins

  // Only create WebGL maps when the phone is near the viewport.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true)
      },
      { rootMargin: "120px", threshold: 0.05 }
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    const el = containerRef.current
    if (!el || mapRef.current) return

    let cancelled = false
    let stopResize: (() => void) | undefined

    const map = new maplibregl.Map({
      container: el,
      style: esriRasterStyle(variant),
      center: center ?? [20, 30],
      zoom,
      pitch,
      bearing,
      maxPitch: 80,
      attributionControl: false,
      cooperativeGestures: false,
    })

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: false,
      }),
      "top-right"
    )

    mapRef.current = map
    stopResize = keepResizing(map, el)

    const fit = () => {
      const current = pinsRef.current
      if (!fitPins || current.length === 0) return
      const bounds = new maplibregl.LngLatBounds()
      for (const p of current) bounds.extend([p.lng, p.lat])
      map.fitBounds(bounds, {
        padding: {
          top: 48,
          left: 36,
          right: 36,
          bottom: 36 + paddingBottom,
        },
        pitch,
        bearing,
        maxZoom: zoom,
        duration: 0,
      })
    }

    map.on("error", () => {
      // Keep basemap; terrain failures should not blank the stage.
    })

    map.once("load", () => {
      if (cancelled) return
      try {
        attachTerrain(map, terrainExaggeration, true)
      } catch {
        // Pitched raster alone is still a usable 3D-feeling demo.
      }
      map.resize()
      fit()
      syncMarkers(map, pinsRef.current, markersRef.current, (id) =>
        onPinSelectRef.current?.(id)
      )
    })

    map.once("style.load", () => {
      if (cancelled) return
      map.resize()
    })

    // If nothing paints after a beat, surface a soft failure (rare).
    const failTimer = window.setTimeout(() => {
      if (cancelled || !mapRef.current) return
      const canvas = el.querySelector("canvas")
      if (!canvas || canvas.width === 0) setFailed(true)
    }, 4000)

    return () => {
      cancelled = true
      window.clearTimeout(failTimer)
      stopResize?.()
      for (const m of markersRef.current) m.remove()
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    syncMarkers(map, pins, markersRef.current, (id) =>
      onPinSelectRef.current?.(id)
    )
  }, [pins])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !center) return
    map.easeTo({ center, zoom, pitch, bearing, duration: 900 })
  }, [center?.[0], center?.[1], zoom, pitch, bearing])

  const ctrl =
    variant === "light"
      ? "[&_.maplibregl-ctrl-group]:border-zinc-200 [&_.maplibregl-ctrl-group]:bg-white/85 [&_.maplibregl-ctrl-group]:shadow-sm"
      : "[&_.maplibregl-ctrl-group]:border-white/15 [&_.maplibregl-ctrl-group]:bg-black/45 [&_.maplibregl-ctrl-group]:shadow-none [&_.maplibregl-ctrl-group]:backdrop-blur"
  const placeholder = variant === "light" ? "bg-[#e8eef2]" : "bg-[#0c1210]"
  const failChip =
    variant === "light"
      ? "bg-white/90 text-zinc-600 shadow"
      : "bg-black/70 text-white/80 backdrop-blur"

  return (
    <div ref={wrapRef} className={`absolute inset-0 z-0 ${className}`}>
      <div
        ref={containerRef}
        className={`absolute inset-0 h-full w-full [&_.maplibregl-canvas]:outline-none [&_.maplibregl-ctrl-group]:overflow-hidden [&_.maplibregl-ctrl-group]:rounded-xl ${ctrl}`}
      />
      {!active ? <div className={`absolute inset-0 ${placeholder}`} /> : null}
      {failed ? (
        <div
          className={`absolute inset-x-3 bottom-24 z-20 rounded-xl px-3 py-2 text-center text-[11px] ${failChip}`}
        >
          Map engine blocked in this preview. Open in a normal browser tab.
        </div>
      ) : null}
    </div>
  )
}
