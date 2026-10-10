import type { Lens, Save } from "@/data/demo"
import type { DaySlot } from "./DigestContext"

export type PlanStop = {
  save: Save
  order: number
  timeLabel: string
  slot: DaySlot
  walkMinutesFromPrev: number | null
}

export type DayItinerary = {
  stops: PlanStop[]
  totalWalkMinutes: number
  lensMix: string
}

const EARTH_KM = 6371

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Rough city-walk pace for the demo (~4.5 km/h). */
function walkMinutes(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  return Math.max(3, Math.round((haversineKm(a, b) / 4.5) * 60))
}

function withCoords(spots: Save[]) {
  return spots.filter(
    (s): s is Save & { lat: number; lng: number } =>
      s.lat != null && s.lng != null
  )
}

/** Preferred lens by stop index for a paced day (see/do → eat → see/do → eat). */
function preferredLens(index: number, total: number): Lens[] {
  if (total <= 1) return ["see", "do", "eat", "stay"]
  if (index === 0) return ["see", "do", "eat"]
  if (index === total - 1) return ["eat", "see", "do"]
  if (index === Math.floor(total / 2)) return ["eat", "see", "do"]
  return ["see", "do", "eat"]
}

const TIME_BANDS: Record<number, string[]> = {
  2: ["10:30", "16:00"],
  3: ["10:00", "13:00", "17:30"],
  4: ["09:45", "12:30", "15:30", "18:30"],
  5: ["09:30", "11:45", "13:30", "16:00", "18:45"],
}

function timeLabels(count: number): string[] {
  if (count <= 0) return []
  if (TIME_BANDS[count]) return TIME_BANDS[count]
  if (count === 1) return ["11:00"]
  const start = 9.5
  const end = 19
  return Array.from({ length: count }, (_, i) => {
    const t = start + ((end - start) * i) / (count - 1)
    const h = Math.floor(t)
    const m = Math.round((t - h) * 60)
    return `${String(h).padStart(2, "0")}:${String(m === 60 ? 0 : m).padStart(2, "0")}`
  })
}

function slotForIndex(index: number, total: number): DaySlot {
  if (total <= 1) return "mid"
  if (index === 0) return "am"
  if (index === total - 1) return "pm"
  return "mid"
}

function pickStart(
  pool: Array<Save & { lat: number; lng: number }>
): Save & { lat: number; lng: number } {
  const sight = pool.find((s) => s.lens === "see" || s.lens === "do")
  if (sight) return sight
  // Geographic center seed: nearest to mean of all pins.
  const mean = {
    lat: pool.reduce((n, s) => n + s.lat, 0) / pool.length,
    lng: pool.reduce((n, s) => n + s.lng, 0) / pool.length,
  }
  return [...pool].sort(
    (a, b) => haversineKm(a, mean) - haversineKm(b, mean)
  )[0]
}

/**
 * Build a walkable day from saved spots: mix lenses, chain by proximity.
 * Stay spots are optional anchors (start/end only) so the walk stays outdoors.
 */
export function planDayFromSpots(
  spots: Save[],
  maxStops = 4
): DayItinerary | null {
  const pinned = withCoords(spots)
  if (pinned.length === 0) return null

  const walkPool = pinned.filter((s) => s.lens !== "stay")
  const stayPool = pinned.filter((s) => s.lens === "stay")
  const pool = walkPool.length > 0 ? walkPool : pinned
  const target = Math.min(maxStops, pool.length)
  if (target === 0) return null

  const remaining = new Set(pool.map((s) => s.id))
  const ordered: Array<Save & { lat: number; lng: number }> = []

  const start = pickStart(pool)
  ordered.push(start)
  remaining.delete(start.id)

  while (ordered.length < target && remaining.size > 0) {
    const prev = ordered[ordered.length - 1]
    const prefs = preferredLens(ordered.length, target)
    const candidates = pool.filter((s) => remaining.has(s.id))
    const ranked = [...candidates].sort((a, b) => {
      const aPref = prefs.indexOf(a.lens as Lens)
      const bPref = prefs.indexOf(b.lens as Lens)
      const aScore = (aPref === -1 ? 9 : aPref) * 1000 + haversineKm(prev, a)
      const bScore = (bPref === -1 ? 9 : bPref) * 1000 + haversineKm(prev, b)
      return aScore - bScore
    })
    const next = ranked[0]
    ordered.push(next)
    remaining.delete(next.id)
  }

  // Optional stay as soft bookend when we have room and a nearby stay.
  if (ordered.length < maxStops && stayPool.length > 0) {
    const last = ordered[ordered.length - 1]
    const nearStay = [...stayPool].sort(
      (a, b) => haversineKm(last, a) - haversineKm(last, b)
    )[0]
    if (haversineKm(last, nearStay) < 2.5) ordered.push(nearStay)
  }

  const times = timeLabels(ordered.length)
  let totalWalk = 0
  const stops: PlanStop[] = ordered.map((save, i) => {
    const walk =
      i === 0 ? null : walkMinutes(ordered[i - 1], save)
    if (walk != null) totalWalk += walk
    return {
      save,
      order: i + 1,
      timeLabel: times[i] ?? "12:00",
      slot: slotForIndex(i, ordered.length),
      walkMinutesFromPrev: walk,
    }
  })

  const lenses = [
    ...new Set(
      stops
        .map((s) => s.save.lens)
        .filter((l): l is NonNullable<Lens> => l != null)
    ),
  ]
  const lensMix =
    lenses.length === 0
      ? "spots"
      : lenses.map((l) => (l === "see" ? "sightseeing" : l)).join(" · ")

  return { stops, totalWalkMinutes: totalWalk, lensMix }
}

/** Map itinerary stops onto the AM / Mid / PM day strip (first, middle, last). */
export function daySlotsFromItinerary(
  itinerary: DayItinerary
): Record<DaySlot, string | null> {
  const { stops } = itinerary
  if (stops.length === 0) return { am: null, mid: null, pm: null }
  if (stops.length === 1) {
    return { am: null, mid: stops[0].save.id, pm: null }
  }
  if (stops.length === 2) {
    return { am: stops[0].save.id, mid: null, pm: stops[1].save.id }
  }
  const midIdx = Math.floor(stops.length / 2)
  return {
    am: stops[0].save.id,
    mid: stops[midIdx].save.id,
    pm: stops[stops.length - 1].save.id,
  }
}
