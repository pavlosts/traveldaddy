/** Shared camera so globe ↔ location map feels continuous (no black gap). */
export type PlaceHandoff = {
  cityId: string
  lat: number
  lng: number
  /** Leaflet zoom matching the end of the globe fly. */
  zoom: number
}

export type ReturnHandoff = {
  cityId: string
  /** MapLibre zoom to start at before easing out to the directory framing. */
  zoom: number
}

export const PLACE_HANDOFF_ZOOM = 7
/** Globe zoom right after leaving a place (then ease to DIRECTORY_GLOBE_ZOOM). */
export const RETURN_GLOBE_ZOOM = 3.35
export const DIRECTORY_GLOBE_ZOOM = 2.15

/** Warm Esri dark tiles around the city before the route swap. */
export function prefetchPlaceTiles(lat: number, lng: number, zoom = PLACE_HANDOFF_ZOOM) {
  const n = 2 ** zoom
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  )
  const base =
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile"
  for (let dz = 0; dz <= 2; dz++) {
    const z = zoom + dz
    const scale = 2 ** dz
    const cx = x * scale
    const cy = y * scale
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const img = new Image()
        img.decoding = "async"
        img.src = `${base}/${z}/${cy + dy}/${cx + dx}`
      }
    }
  }
}
