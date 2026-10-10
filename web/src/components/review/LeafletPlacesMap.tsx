import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export type MapPin = {
  id: string
  name?: string
  lat: number
  lng: number
  active?: boolean
  /** Glass place card marker (directory) */
  thumb?: string
  subtitle?: string
  /** Original reel / source link for popup card */
  reelUrl?: string
  marker?: "dot" | "label" | "glass"
  /** 1-based stop index when showing a planned route */
  order?: number
}

export type MapRoute = {
  points: Array<{ lat: number; lng: number }>
  /** Cinema cream stroke by default */
  color?: string
}

export type MapVariant = "streets" | "minimal" | "dark"

type Props = {
  pins: MapPin[]
  /** Planned walk polyline (lat/lng order) */
  route?: MapRoute | null
  /** Extra bottom padding in px so pins sit above a sheet overlay */
  paddingBottom?: number
  className?: string
  /** streets = OSM · minimal / dark = Esri gray canvas (no API key) */
  variant?: MapVariant
  /** Cap zoom so dense street grids stay quiet */
  fitMaxZoom?: number
  /** When set, glass/dot pins become clickable */
  onPinSelect?: (id: string) => void
  /** Cinema prototype pin colors (cream active, coral idle) */
  pinTheme?: "default" | "cinema"
  /** Active pin shows a detail card above the dot */
  popupOnActive?: boolean
  onAddToDay?: (id: string) => void
  /** Start camera when arriving from the globe fly (lat, lng). */
  introCenter?: [number, number]
  introZoom?: number
}

export type LeafletPlacesMapHandle = {
  /** Animate a wide zoom-out, then resolve (for leaving the place). */
  zoomOut: () => Promise<void>
}

/** Free tiles only. Esri gray canvas stays quiet without a Carto API key. */
const TILES: Record<
  MapVariant,
  { url: string; maxZoom: number; subdomains?: string }
> = {
  streets: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
  },
  minimal: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 16,
  },
  dark: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 16,
  },
}

function pinColors(theme: "default" | "cinema", active: boolean) {
  if (theme === "cinema") {
    return {
      fill: active ? "#f6f1e8" : "#c45c3a",
      border: active ? "#11100e" : "#fff",
      labelBg: active ? "#f6f1e8" : "rgba(28,27,25,0.92)",
      labelFg: active ? "#11100e" : "#f6f1e8",
    }
  }
  return {
    fill: active ? "#2f5d50" : "#c45c3a",
    border: "#fff",
    labelBg: "#fff",
    labelFg: "#141816",
  }
}

function labeledIcon(
  name: string,
  active = false,
  theme: "default" | "cinema" = "default",
  clickable = false,
  order?: number
) {
  const safe = escapeHtml(name)
  const short = safe.length > 28 ? `${safe.slice(0, 26)}…` : safe
  const c = pinColors(theme, active)
  const badge =
    order != null
      ? `<span style="position:absolute;top:-6px;right:-8px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:${active ? "#c45c3a" : "#f6f1e8"};color:${active ? "#f6f1e8" : "#11100e"};font:700 9px/16px system-ui,sans-serif;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.4)">${order}</span>`
      : ""
  return L.divIcon({
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;pointer-events:${clickable ? "auto" : "none"};cursor:${clickable ? "pointer" : "default"}">
      <span style="position:relative;background:${c.labelBg};color:${c.labelFg};font:600 10px/1.2 system-ui,sans-serif;padding:4px 8px;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.35);white-space:nowrap;max-width:140px;overflow:hidden;text-overflow:ellipsis">${short}${badge}</span>
      <span style="width:10px;height:10px;margin-top:4px;border-radius:999px;background:${c.fill};border:2px solid ${c.border};box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>
    </div>`,
  })
}

/** Detail card anchored above the active pin. */
function popupCardIcon(pin: MapPin, theme: "default" | "cinema" = "default") {
  const c = pinColors(theme, true)
  const name = escapeHtml(pin.name ?? "Spot")
  const sub = escapeHtml(pin.subtitle ?? "")
  const thumb = escapeHtml(pin.thumb ?? "")
  const reel = escapeHtml(pin.reelUrl ?? "#")
  const media = thumb
    ? `<img src="${thumb}" alt="" style="display:block;width:48px;height:48px;border-radius:12px;object-fit:cover;flex-shrink:0" />`
    : `<div style="width:48px;height:48px;border-radius:12px;background:rgba(246,241,232,0.12);flex-shrink:0"></div>`
  return L.divIcon({
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div data-pin-popup style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;pointer-events:auto;width:260px">
      <div style="width:260px;border-radius:16px;border:1px solid rgba(255,255,255,0.12);background:rgba(12,11,10,0.88);backdrop-filter:blur(10px);box-shadow:0 14px 36px rgba(0,0,0,0.5);padding:10px;color:#f6f1e8;text-align:left">
        <div style="display:flex;align-items:center;gap:10px">
          ${media}
          <div style="min-width:0;flex:1">
            <div style="font:600 13px/1.25 system-ui,sans-serif;color:#f6f1e8">${name}</div>
            ${sub ? `<div style="margin-top:3px;font:500 10px/1.2 system-ui,sans-serif;color:rgba(246,241,232,0.55)">${sub}</div>` : ""}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px">
          <button type="button" data-add-day style="border:0;border-radius:8px;padding:7px 8px;font:600 11px/1 system-ui,sans-serif;background:#f6f1e8;color:#11100e;cursor:pointer">Add to day</button>
          <a data-original href="${reel}" target="_blank" rel="noreferrer" style="display:block;border-radius:8px;padding:7px 8px;font:600 11px/1 system-ui,sans-serif;background:rgba(255,255,255,0.1);color:#f6f1e8;text-align:center;text-decoration:none">Original</a>
        </div>
      </div>
      <span style="width:1px;height:8px;background:rgba(246,241,232,0.45);margin-top:2px"></span>
      <span style="width:12px;height:12px;border-radius:999px;background:${c.fill};border:2px solid ${theme === "cinema" ? "#11100e" : c.border};box-shadow:${theme === "cinema" ? "0 0 0 4px rgba(246,241,232,0.28),0 1px 4px rgba(0,0,0,.35)" : "0 1px 4px rgba(0,0,0,.35)"}"></span>
    </div>`,
  })
}

function dotIcon(
  active = false,
  theme: "default" | "cinema" = "default"
) {
  const c = pinColors(theme, active)
  return L.divIcon({
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `<span style="display:block;width:14px;height:14px;border-radius:999px;background:${c.fill};border:2px solid ${c.border};box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
  })
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function glassPinDot(active = false) {
  const size = active ? 12 : 10
  const glow = active
    ? "0 0 0 4px rgba(52,211,153,0.28),0 1px 4px rgba(0,0,0,.35)"
    : "0 1px 4px rgba(0,0,0,.35)"
  return `<span style="width:${size}px;height:${size}px;border-radius:999px;background:#34d399;border:2px solid #fff;box-shadow:${glow}"></span>`
}

function glassIcon(active = false) {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;cursor:pointer">${glassPinDot(active)}</div>`,
  })
}

function iconForPin(
  pin: MapPin,
  theme: "default" | "cinema" = "default",
  clickable = false,
  popupOnActive = false
) {
  if (popupOnActive && pin.active) {
    return popupCardIcon(pin, theme)
  }
  const style =
    pin.marker ?? (pin.thumb ? "glass" : pin.name ? "label" : "dot")
  if (style === "glass") {
    return glassIcon(!!pin.active)
  }
  if (style === "label" || pin.name) {
    return labeledIcon(
      pin.name ?? "",
      !!pin.active,
      theme,
      clickable,
      pin.order
    )
  }
  return dotIcon(!!pin.active, theme)
}

export const LeafletPlacesMap = forwardRef<LeafletPlacesMapHandle, Props>(
  function LeafletPlacesMap(
    {
      pins,
      route = null,
      paddingBottom = 0,
      className = "",
      variant = "minimal",
      fitMaxZoom,
      onPinSelect,
      pinTheme = "default",
      popupOnActive = false,
      onAddToDay,
      introCenter,
      introZoom,
    },
    ref
  ) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const pinsRef = useRef(pins)
  const routeRef = useRef(route)
  const paddingRef = useRef(paddingBottom)
  const maxZoomRef = useRef(fitMaxZoom)
  const onPinSelectRef = useRef(onPinSelect)
  const onAddToDayRef = useRef(onAddToDay)
  const popupOnActiveRef = useRef(popupOnActive)
  const introCenterRef = useRef(introCenter)
  const introZoomRef = useRef(introZoom)
  const introDoneRef = useRef(false)
  const prevActiveIdRef = useRef<string | null>(null)
  pinsRef.current = pins
  routeRef.current = route
  paddingRef.current = paddingBottom
  maxZoomRef.current = fitMaxZoom
  onPinSelectRef.current = onPinSelect
  onAddToDayRef.current = onAddToDay
  popupOnActiveRef.current = popupOnActive
  introCenterRef.current = introCenter
  introZoomRef.current = introZoom

  const resolveMaxZoom = (count: number) =>
    maxZoomRef.current ?? (count <= 2 ? 12 : 4)

  useImperativeHandle(ref, () => ({
    zoomOut: () =>
      new Promise((resolve) => {
        const map = mapRef.current
        if (!map) {
          resolve()
          return
        }
        let settled = false
        const done = () => {
          if (settled) return
          settled = true
          resolve()
        }
        const center = map.getCenter()
        // Short ease toward regional framing; navigate before it fully settles.
        map.stop()
        map.flyTo(center, 7.2, { duration: 0.55, easeLinearity: 0.4 })
        window.setTimeout(done, 480)
      }),
  }))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    introDoneRef.current = false

    const map = L.map(el, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
    })

    const tile = TILES[variant]
    L.tileLayer(tile.url, {
      maxZoom: tile.maxZoom,
      ...(tile.subdomains ? { subdomains: tile.subdomains } : {}),
    }).addTo(map)

    mapRef.current = map

    function fit(animate: boolean) {
      const current = pinsRef.current
      const routePts = routeRef.current?.points ?? []
      if (!mapRef.current || (current.length === 0 && routePts.length === 0))
        return
      const bounds = L.latLngBounds([
        ...current.map((p) => [p.lat, p.lng] as [number, number]),
        ...routePts.map((p) => [p.lat, p.lng] as [number, number]),
      ])
      const opts = {
        paddingTopLeft: [28, 36] as [number, number],
        paddingBottomRight: [28, 24 + paddingRef.current] as [number, number],
        maxZoom: resolveMaxZoom(current.length),
      }
      if (animate) {
        const handoffCenter = introCenterRef.current
        const handoffZoom = introZoomRef.current
        if (handoffCenter && handoffZoom != null) {
          // Continue the globe zoom: same framing, then ease into spot pins.
          mapRef.current.setView(handoffCenter, handoffZoom, { animate: false })
          mapRef.current.flyToBounds(bounds, { ...opts, duration: 1.55 })
        } else {
          const center = bounds.getCenter()
          mapRef.current.setView(center, 9, { animate: false })
          mapRef.current.flyToBounds(bounds, { ...opts, duration: 1.35 })
        }
      } else {
        mapRef.current.fitBounds(bounds, opts)
      }
    }

    const ro = new ResizeObserver(() => {
      map.invalidateSize()
      if (introDoneRef.current) fit(false)
    })
    ro.observe(el)

    requestAnimationFrame(() => {
      map.invalidateSize()
      fit(true)
      introDoneRef.current = true
    })

    return () => {
      ro.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [variant])

  const layoutKey = pins.map((p) => `${p.id}:${p.lat}:${p.lng}`).join("|")
  const routeKey =
    route?.points.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join("|") ??
    ""
  const layoutKeyRef = useRef("")

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const clickable = !!onPinSelectRef.current
    if (clickable) {
      map.dragging.enable()
    }

    const centerOnPin = (pin: MapPin, forPopup: boolean) => {
      map.stop()
      const zoom = Math.max(map.getZoom(), Math.min(fitMaxZoom ?? 14, 13))
      // Nudge north so the label/card above the dot sits nearer center.
      const lift = forPopup ? 120 : 56
      const point = map.project([pin.lat, pin.lng], zoom)
      const target = map.unproject(point.subtract([0, lift]), zoom)
      map.flyTo(target, zoom, { duration: 0.65, easeLinearity: 0.35 })
    }

    const layer = L.layerGroup().addTo(map)

    if (route && route.points.length >= 2) {
      const latlngs = route.points.map(
        (p) => [p.lat, p.lng] as [number, number]
      )
      L.polyline(latlngs, {
        color: "#11100e",
        weight: 6,
        opacity: 0.35,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(layer)
      L.polyline(latlngs, {
        color: route.color ?? "#f6f1e8",
        weight: 3.5,
        opacity: 0.9,
        lineJoin: "round",
        lineCap: "round",
        dashArray: "8 10",
      }).addTo(layer)
    }

    for (const pin of pins) {
      const showPopup = popupOnActiveRef.current && !!pin.active
      const marker = L.marker([pin.lat, pin.lng], {
        icon: iconForPin(pin, pinTheme, clickable, popupOnActiveRef.current),
        interactive: clickable,
        zIndexOffset: showPopup ? 600 : pin.order != null ? 200 : 0,
      }).addTo(layer)
      if (clickable) {
        marker.on("click", (e) => {
          const t = e.originalEvent.target as HTMLElement | null
          if (t?.closest?.("[data-add-day], [data-original], [data-pin-popup]")) {
            return
          }
          onPinSelectRef.current?.(pin.id)
          centerOnPin(pin, popupOnActiveRef.current)
        })
      }
      if (showPopup) {
        const root = marker.getElement()
        root
          ?.querySelector("[data-add-day]")
          ?.addEventListener("click", (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
            onAddToDayRef.current?.(pin.id)
          })
        root
          ?.querySelector("[data-original]")
          ?.addEventListener("click", (ev) => {
            ev.stopPropagation()
          })
      }
    }

    const activeId = pins.find((p) => p.active)?.id ?? null
    // Center only on user-driven selection changes, not the initial active pin.
    if (
      activeId &&
      popupOnActiveRef.current &&
      introDoneRef.current &&
      prevActiveIdRef.current !== null &&
      activeId !== prevActiveIdRef.current
    ) {
      const activePin = pins.find((p) => p.id === activeId)
      if (activePin) centerOnPin(activePin, true)
    }
    prevActiveIdRef.current = activeId

    const fitKey = `${layoutKey}::${routeKey}`
    // Re-fit only when the pin set or route moves, not when selection styling changes.
    if (
      (pins.length > 0 || (route?.points.length ?? 0) > 0) &&
      introDoneRef.current &&
      fitKey !== layoutKeyRef.current
    ) {
      layoutKeyRef.current = fitKey
      const bounds = L.latLngBounds([
        ...pins.map((p) => [p.lat, p.lng] as [number, number]),
        ...(route?.points.map((p) => [p.lat, p.lng] as [number, number]) ??
          []),
      ])
      map.invalidateSize()
      map.flyToBounds(bounds, {
        paddingTopLeft: [28, 36],
        paddingBottomRight: [28, 24 + paddingBottom],
        maxZoom: fitMaxZoom ?? (pins.length <= 2 ? 12 : 14),
        duration: 0.85,
      })
    }

    return () => {
      layer.remove()
    }
  }, [
    pins,
    layoutKey,
    route,
    routeKey,
    paddingBottom,
    variant,
    fitMaxZoom,
    onPinSelect,
    onAddToDay,
    pinTheme,
    popupOnActive,
  ])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 bg-[#121110] [&_.leaflet-tile-pane]:saturate-[0.55] [&_.leaflet-tile-pane]:contrast-[0.92] ${className}`}
      aria-hidden
    />
  )
  }
)
