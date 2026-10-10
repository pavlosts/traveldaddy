import { useEffect, useRef, useState } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import type { MapPin } from "./LeafletPlacesMap"
import {
  esriRasterStyle,
  illustratedGlobeStyle,
  keepResizing,
} from "./maplibreStage"

type Props = {
  pins: MapPin[]
  /** lng, lat */
  center?: [number, number]
  zoom?: number
  pitch?: number
  bearing?: number
  /** World stage uses a globe; city stage uses pitched buildings */
  mode?: "globe" | "city"
  /** Illustrated globe tone (directory). City mode ignores this. */
  globeTone?: "light" | "dark"
  /** Pin colors on the globe */
  pinTheme?: "teal" | "cinema"
  /** Active pin shows a floating card above the dot */
  popupOnActive?: boolean
  onPinSelect?: (id: string) => void
  /** Fired when the already-active pin card is clicked again (e.g. open place) */
  onPinOpen?: (id: string) => void
  /** Fired when the open-place camera move begins */
  onPinOpening?: () => void
  /** Skip lazy IntersectionObserver (directory full-bleed). */
  eager?: boolean
  className?: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function markerHtml(
  pin: MapPin,
  pinTheme: "teal" | "cinema" = "teal",
  popupOnActive = false
) {
  const active = !!pin.active
  const name = escapeHtml(pin.name ?? "pin")
  const sub = escapeHtml(pin.subtitle ?? "")
  const thumb = escapeHtml(pin.thumb ?? "")
  const size = active ? 14 : 10
  const color =
    pinTheme === "cinema"
      ? active
        ? "#f6f1e8"
        : "#c45c3a"
      : active
        ? "#0f766e"
        : "#c2410c"
  const glow =
    pinTheme === "cinema"
      ? active
        ? "0 0 0 4px rgba(246,241,232,0.28),0 1px 4px rgba(0,0,0,.45)"
        : "0 1px 4px rgba(0,0,0,.45)"
      : active
        ? "0 0 0 4px rgba(15,118,110,0.22),0 1px 4px rgba(0,0,0,.28)"
        : "0 1px 4px rgba(0,0,0,.28)"
  const border = pinTheme === "cinema" && active ? "#11100e" : "#fff"
  const dot = `<span style="width:${size}px;height:${size}px;border-radius:999px;background:${color};border:2px solid ${border};box-shadow:${glow}"></span>`

  if (popupOnActive && active) {
    const media = thumb
      ? `<img src="${thumb}" alt="" style="display:block;width:100%;height:64px;object-fit:cover;filter:none;opacity:1;background:#ddd6c8" onerror="this.onerror=null;this.style.display='none'" />`
      : ""
    return `<div role="group" aria-label="${name}" style="display:flex;flex-direction:column;align-items:center;width:140px">
      <div data-pin-card style="cursor:pointer;width:140px;overflow:hidden;border-radius:14px;border:1px solid rgba(246,241,232,0.55);background:#f6f1e8;box-shadow:0 12px 32px rgba(0,0,0,0.5);color:#11100e;text-align:left">
        ${media}
        <div style="padding:8px 10px 10px;background:#f6f1e8">
          <div style="font:600 13px/1.2 system-ui,sans-serif;color:#11100e">${name}</div>
          ${sub ? `<div style="margin-top:3px;font:500 10px/1.2 system-ui,sans-serif;color:rgba(17,16,14,0.58)">${sub}</div>` : ""}
          <button type="button" data-open-place style="display:block;width:100%;margin-top:8px;font:600 10px/1 system-ui,sans-serif;color:#f6f1e8;background:#11100e;border:0;border-radius:8px;padding:6px 8px;text-align:center;cursor:pointer">Open place</button>
        </div>
      </div>
      <span style="width:1px;height:8px;background:rgba(246,241,232,0.55);margin-top:2px"></span>
      <button type="button" data-pin-dot aria-label="${name}" style="all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center">${dot}</button>
    </div>`
  }

  return `<button type="button" data-pin-dot aria-label="${name}" style="all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center;width:28px;height:28px">
    ${dot}
  </button>`
}

/** Globe zoom at handoff; pairs with Leaflet PLACE_HANDOFF_ZOOM (~7). */
const OPEN_PLACE_ZOOM = 6.8

function openPlaceWithZoom(
  map: maplibregl.Map,
  pin: MapPin,
  onPinOpen: (id: string) => void,
  onWarm?: () => void
) {
  let settled = false
  const duration = 2000
  const startedAt = performance.now()
  const finish = () => {
    if (settled) return
    // Ignore early moveend from a cancelled camera move.
    if (performance.now() - startedAt < duration * 0.82) return
    settled = true
    onPinOpen(pin.id)
  }

  onWarm?.()
  map.stop()
  map.flyTo({
    center: [pin.lng, pin.lat],
    zoom: OPEN_PLACE_ZOOM,
    pitch: 48,
    bearing: map.getBearing() + 14,
    duration,
    curve: 1.55,
    speed: 0.55,
    essential: true,
  })
  // Hand off near the end of the fly so the next map can continue the zoom.
  window.setTimeout(finish, duration - 80)
  map.once("moveend", finish)
}

function syncMarkers(
  map: maplibregl.Map,
  pins: MapPin[],
  markers: maplibregl.Marker[],
  onPinSelect?: (id: string) => void,
  pinTheme: "teal" | "cinema" = "teal",
  popupOnActive = false,
  onPinOpen?: (id: string) => void,
  onPinOpening?: () => void
) {
  for (const m of markers) m.remove()
  markers.length = 0
  for (const pin of pins) {
    const node = document.createElement("div")
    node.innerHTML = markerHtml(pin, pinTheme, popupOnActive)
    const root = node.firstElementChild as HTMLElement | null
    if (root) {
      root.addEventListener("click", (e) => {
        e.stopPropagation()
        const target = e.target as HTMLElement | null
        const wantsOpen =
          !!pin.active &&
          !!onPinOpen &&
          !!target?.closest("[data-open-place], [data-pin-card]")
        if (wantsOpen && onPinOpen) {
          openPlaceWithZoom(map, pin, onPinOpen, onPinOpening)
          return
        }
        map.stop()
        map.easeTo({
          center: [pin.lng, pin.lat],
          duration: 900,
          offset: popupOnActive ? [0, 78] : [0, 0],
          essential: true,
        })
        onPinSelect?.(pin.id)
      })
    }
    const showCard = popupOnActive && !!pin.active
    markers.push(
      new maplibregl.Marker({
        element: node,
        anchor: showCard ? "bottom" : "center",
      })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map)
    )
  }
}

function boostBuildings(map: maplibregl.Map) {
  const style = map.getStyle()
  if (!style?.layers) return

  for (const layer of style.layers) {
    if (layer.type !== "fill-extrusion") continue
    map.setPaintProperty(layer.id, "fill-extrusion-color", [
      "interpolate",
      ["linear"],
      ["coalesce", ["get", "render_height"], ["get", "height"], 12],
      0,
      "#d7e0ea",
      24,
      "#b7c6d4",
      60,
      "#8ea3b8",
      120,
      "#6b8499",
    ])
    map.setPaintProperty(layer.id, "fill-extrusion-opacity", 0.92)
  }

  const hasExtrusion = style.layers.some((l) => l.type === "fill-extrusion")
  if (hasExtrusion) return

  const sources = style.sources ?? {}
  const vectorSourceId = Object.keys(sources).find(
    (id) => sources[id]?.type === "vector"
  )

  if (!vectorSourceId) {
    map.addSource("openfreemap", {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    })
  }

  const sourceId = vectorSourceId ?? "openfreemap"
  let beforeId: string | undefined
  for (const layer of map.getStyle().layers ?? []) {
    if (layer.type === "symbol") {
      beforeId = layer.id
      break
    }
  }

  try {
    map.addLayer(
      {
        id: "skyline-3d-buildings",
        source: sourceId,
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 14,
        filter: ["!=", ["get", "hide_3d"], true],
        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "render_height"], ["get", "height"], 12],
            0,
            "#d7e0ea",
            24,
            "#b7c6d4",
            60,
            "#8ea3b8",
            120,
            "#6b8499",
          ],
          "fill-extrusion-height": [
            "coalesce",
            ["get", "render_height"],
            ["get", "height"],
            12,
          ],
          "fill-extrusion-base": [
            "coalesce",
            ["get", "render_min_height"],
            ["get", "min_height"],
            0,
          ],
          "fill-extrusion-opacity": 0.92,
        },
      },
      beforeId
    )
  } catch {
    // Style may already include buildings under another id.
  }
}

/** Interactive MapLibre skyline: globe directory or pitched 3D buildings. */
export function InteractiveSkylineMap({
  pins,
  center,
  zoom = 1.8,
  pitch = 0,
  bearing = 0,
  mode = "city",
  globeTone = "light",
  pinTheme = "teal",
  popupOnActive = false,
  onPinSelect,
  onPinOpen,
  onPinOpening,
  eager = false,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const onPinSelectRef = useRef(onPinSelect)
  const onPinOpenRef = useRef(onPinOpen)
  const onPinOpeningRef = useRef(onPinOpening)
  const pinsRef = useRef(pins)
  const pinThemeRef = useRef(pinTheme)
  const popupOnActiveRef = useRef(popupOnActive)
  const openingRef = useRef(false)
  const [active, setActive] = useState(eager)
  const [failed, setFailed] = useState(false)
  onPinSelectRef.current = onPinSelect
  onPinOpenRef.current = onPinOpen
  onPinOpeningRef.current = onPinOpening
  pinsRef.current = pins
  pinThemeRef.current = pinTheme
  popupOnActiveRef.current = popupOnActive

  useEffect(() => {
    if (eager) {
      setActive(true)
      return
    }
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
  }, [eager])

  useEffect(() => {
    if (!active) return
    const el = containerRef.current
    if (!el || mapRef.current) return

    let cancelled = false
    let stopResize: (() => void) | undefined

    const initialStyle =
      mode === "globe"
        ? illustratedGlobeStyle(globeTone)
        : esriRasterStyle("light")

    const map = new maplibregl.Map({
      container: el,
      style: initialStyle,
      center: center ?? [20, 25],
      zoom,
      pitch,
      bearing,
      maxPitch: 85,
      attributionControl: false,
      cooperativeGestures: false,
      dragRotate: true,
      pitchWithRotate: true,
      touchPitch: true,
      touchZoomRotate: true,
    })

    // Two-finger pitch (tilt) + rotate (bearing); drag with right-click / ctrl on desktop.
    map.touchPitch.enable()
    map.dragRotate.enable()
    map.touchZoomRotate.enable()
    map.touchZoomRotate.enableRotation()

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

    const afterReady = () => {
      if (cancelled) return
      map.resize()
      if (mode === "globe") {
        try {
          ;(
            map as maplibregl.Map & {
              setProjection: (p: { type: string }) => void
            }
          ).setProjection({ type: "globe" })
        } catch {
          // Keep mercator.
        }
        // Re-assert gestures after projection swap (some builds reset handlers).
        map.touchPitch.enable()
        map.dragRotate.enable()
        map.touchZoomRotate.enable()
        map.touchZoomRotate.enableRotation()
      }
      if (mode === "city") {
        try {
          boostBuildings(map)
        } catch {
          // Pitched light map still reads as skyline-adjacent.
        }
      }
      syncMarkers(
        map,
        pinsRef.current,
        markersRef.current,
        (id) => onPinSelectRef.current?.(id),
        pinThemeRef.current,
        popupOnActiveRef.current,
        (id) => onPinOpenRef.current?.(id),
        () => {
          openingRef.current = true
          onPinOpeningRef.current?.()
        }
      )
    }

    map.once("load", () => {
      afterReady()
      // City stage upgrades to OpenFreeMap for building extrusions.
      if (mode === "city") {
        map.setStyle("https://tiles.openfreemap.org/styles/liberty", {
          diff: false,
        })
        map.once("style.load", () => {
          if (cancelled) return
          afterReady()
        })
      }
    })

    map.on("error", () => {
      // Basemap / demotiles failures should not blank the phone.
    })

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
    syncMarkers(
      map,
      pins,
      markersRef.current,
      (id) => onPinSelectRef.current?.(id),
      pinTheme,
      popupOnActive,
      (id) => onPinOpenRef.current?.(id),
      () => {
        openingRef.current = true
        onPinOpeningRef.current?.()
      }
    )
  }, [pins, pinTheme, popupOnActive, onPinOpen])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !center || openingRef.current) return
    map.easeTo({
      center,
      zoom,
      pitch,
      bearing,
      duration: 900,
      // Keep the floating place card in frame above the pin.
      offset: popupOnActive ? [0, 78] : [0, 0],
      essential: true,
    })
  }, [center?.[0], center?.[1], zoom, pitch, bearing, popupOnActive])

  return (
    <div ref={wrapRef} className={`absolute inset-0 z-0 ${className}`}>
      <div
        ref={containerRef}
        className={`absolute inset-0 h-full w-full [&_.maplibregl-canvas]:outline-none [&_.maplibregl-ctrl-group]:overflow-hidden [&_.maplibregl-ctrl-group]:rounded-xl [&_.maplibregl-ctrl-group]:border [&_.maplibregl-ctrl-group]:shadow-sm ${
          globeTone === "dark" || mode === "city"
            ? "bg-[#121110] [&_.maplibregl-ctrl-group]:border-white/15 [&_.maplibregl-ctrl-group]:bg-black/50 [&_.maplibregl-ctrl-group]:backdrop-blur"
            : "bg-[#b9d9e8] [&_.maplibregl-ctrl-group]:border-zinc-200 [&_.maplibregl-ctrl-group]:bg-white/85"
        }`}
      />
      {failed ? (
        <div className="absolute inset-x-3 bottom-24 z-20 rounded-xl bg-white/90 px-3 py-2 text-center text-[11px] text-zinc-600 shadow">
          Map engine blocked in this preview. Open in a normal browser tab.
        </div>
      ) : null}
    </div>
  )
}
