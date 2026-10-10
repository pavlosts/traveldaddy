import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  cities,
  cityById,
  saves as fixtureSaves,
  type Lens,
  type Save,
} from "@/data/demo"

export type DaySlot = "am" | "mid" | "pm"

type DayPlan = Record<DaySlot, string | null>

type DigestContextValue = {
  saves: Save[]
  dayPlans: Record<string, DayPlan>
  spotsFor: (cityId: string) => Save[]
  tipsFor: (cityId: string) => Save[]
  unsortedFor: (cityId: string) => Save[]
  countsFor: (cityId: string) => {
    spots: number
    tips: number
    unsorted: number
  }
  dayPlanFor: (cityId: string) => DayPlan
  setDaySlot: (cityId: string, slot: DaySlot, spotId: string | null) => void
  applyDayPlan: (cityId: string, plan: DayPlan) => void
  sortUnsorted: (
    saveId: string,
    as: "spot" | "tip",
    lens?: Lens
  ) => void
}

const emptyPlan = (): DayPlan => ({ am: null, mid: null, pm: null })

const DigestContext = createContext<DigestContextValue | null>(null)

function nearbyCoords(cityId: string, seed: string) {
  const city = cityById(cityId)
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % 97
  const dLat = ((h % 11) - 5) * 0.002
  const dLng = ((h % 13) - 6) * 0.002
  return { lat: city.lat + dLat, lng: city.lng + dLng }
}

export function DigestProvider({ children }: { children: ReactNode }) {
  const [saves, setSaves] = useState<Save[]>(() =>
    fixtureSaves.map((s) => ({ ...s }))
  )
  const [dayPlans, setDayPlans] = useState<Record<string, DayPlan>>(() =>
    Object.fromEntries(cities.map((c) => [c.id, emptyPlan()]))
  )

  const value = useMemo<DigestContextValue>(() => {
    const spotsFor = (cityId: string) =>
      saves.filter((s) => s.cityId === cityId && s.kind === "spot")
    const tipsFor = (cityId: string) =>
      saves.filter((s) => s.cityId === cityId && s.kind === "tip")
    const unsortedFor = (cityId: string) =>
      saves.filter((s) => s.cityId === cityId && s.kind === "unsorted")

    return {
      saves,
      dayPlans,
      spotsFor,
      tipsFor,
      unsortedFor,
      countsFor: (cityId: string) => ({
        spots: spotsFor(cityId).length,
        tips: tipsFor(cityId).length,
        unsorted: unsortedFor(cityId).length,
      }),
      dayPlanFor: (cityId: string) => dayPlans[cityId] ?? emptyPlan(),
      setDaySlot: (cityId, slot, spotId) => {
        setDayPlans((prev) => {
          const plan = { ...(prev[cityId] ?? emptyPlan()) }
          // Clear spot from other slots in this city
          if (spotId) {
            for (const key of ["am", "mid", "pm"] as DaySlot[]) {
              if (plan[key] === spotId) plan[key] = null
            }
          }
          plan[slot] = spotId
          return { ...prev, [cityId]: plan }
        })
      },
      applyDayPlan: (cityId, plan) => {
        setDayPlans((prev) => ({ ...prev, [cityId]: { ...plan } }))
      },
      sortUnsorted: (saveId, as, lens = "eat") => {
        setSaves((prev) =>
          prev.map((s) => {
            if (s.id !== saveId || s.kind !== "unsorted") return s
            if (as === "tip") {
              return {
                ...s,
                kind: "tip",
                lens: null,
                lat: null,
                lng: null,
                venueName: null,
              }
            }
            const coords = nearbyCoords(s.cityId, s.id)
            return {
              ...s,
              kind: "spot",
              lens: lens ?? "eat",
              lat: coords.lat,
              lng: coords.lng,
              venueName: s.venueName ?? s.title,
            }
          })
        )
      },
    }
  }, [saves, dayPlans])

  return (
    <DigestContext.Provider value={value}>{children}</DigestContext.Provider>
  )
}

export function useDigest() {
  const ctx = useContext(DigestContext)
  if (!ctx) throw new Error("useDigest must be used inside DigestProvider")
  return ctx
}
