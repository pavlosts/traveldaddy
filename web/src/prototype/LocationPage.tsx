import { useEffect, useMemo, useRef, useState } from "react"
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  LeafletPlacesMap,
  type LeafletPlacesMapHandle,
} from "@/components/review/LeafletPlacesMap"
import { cityById, type Lens } from "@/data/demo"
import { CinemaChrome, CinemaStatus } from "./CinemaChrome"
import { useDigest, type DaySlot } from "./DigestContext"
import {
  RETURN_GLOBE_ZOOM,
  type PlaceHandoff,
  type ReturnHandoff,
} from "./mapHandoff"
import {
  daySlotsFromItinerary,
  planDayFromSpots,
  type DayItinerary,
} from "./planDay"
import { SortSheet } from "./SortSheet"

const lensOptions: Array<Lens | "all"> = ["all", "eat", "see", "do", "stay"]

const slotLabels: Record<DaySlot, string> = {
  am: "AM",
  mid: "Mid",
  pm: "PM",
}

function lensWord(lens: Lens) {
  if (lens === "see") return "sightseeing"
  if (!lens) return "spot"
  return lens
}

function readHandoff(state: unknown, cityId: string): PlaceHandoff | null {
  if (!state || typeof state !== "object" || !("handoff" in state)) return null
  const h = (state as { handoff?: Partial<PlaceHandoff> }).handoff
  if (
    !h ||
    h.cityId !== cityId ||
    typeof h.lat !== "number" ||
    typeof h.lng !== "number" ||
    typeof h.zoom !== "number"
  ) {
    return null
  }
  return h as PlaceHandoff
}

export function LocationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cityId = "athens" } = useParams()
  const validCity = citiesHas(cityId)
  const city = cityById(validCity ? cityId : "athens")
  // Freeze arrival camera once so clearing router state cannot cancel the intro.
  const [handoff] = useState(() => readHandoff(location.state, city.id))
  const mapRef = useRef<LeafletPlacesMapHandle>(null)
  const [chromeIn, setChromeIn] = useState(!handoff)
  const {
    spotsFor,
    tipsFor,
    unsortedFor,
    countsFor,
    dayPlanFor,
    setDaySlot,
    applyDayPlan,
  } = useDigest()

  const spots = spotsFor(city.id)
  const tips = tipsFor(city.id)
  const unsorted = unsortedFor(city.id)
  const counts = countsFor(city.id)
  const dayPlan = dayPlanFor(city.id)

  const [lens, setLens] = useState<Lens | "all">("all")
  const [activeSpotId, setActiveSpotId] = useState(spots[0]?.id)
  const [tipsOpen, setTipsOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [itinerary, setItinerary] = useState<DayItinerary | null>(null)
  const [timelineOpen, setTimelineOpen] = useState(false)

  useEffect(() => {
    if (!handoff) return
    const t = window.setTimeout(() => setChromeIn(true), 280)
    // Drop handoff so lens changes do not replay the globe intro.
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: {} }
    )
    return () => window.clearTimeout(t)
  }, [handoff, navigate, location.pathname, location.search])

  const goBackToPlaces = async () => {
    if (leaving) return
    setLeaving(true)
    await (mapRef.current?.zoomOut() ?? Promise.resolve())
    const returnHandoff: ReturnHandoff = {
      cityId: city.id,
      zoom: RETURN_GLOBE_ZOOM,
    }
    const go = () =>
      navigate("/", { state: { cityId: city.id, returnHandoff } })
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void
    }
    if (doc.startViewTransition) doc.startViewTransition(go)
    else go()
  }

  const visibleSpots = useMemo(() => {
    if (lens === "all") return spots
    return spots.filter((s) => s.lens === lens)
  }, [spots, lens])

  const activeSpot =
    visibleSpots.find((s) => s.id === activeSpotId) ??
    visibleSpots[0] ??
    null

  useEffect(() => {
    if (!activeSpot && visibleSpots[0]) {
      setActiveSpotId(visibleSpots[0].id)
    } else if (
      activeSpotId &&
      visibleSpots.length > 0 &&
      !visibleSpots.some((s) => s.id === activeSpotId)
    ) {
      setActiveSpotId(visibleSpots[0].id)
    }
  }, [visibleSpots, activeSpot, activeSpotId])

  const orderById = useMemo(() => {
    const map = new Map<string, number>()
    if (!itinerary) return map
    for (const stop of itinerary.stops) map.set(stop.save.id, stop.order)
    return map
  }, [itinerary])

  const pins = useMemo(() => {
    const base = itinerary
      ? itinerary.stops.map((stop) => stop.save)
      : visibleSpots
    return base
      .filter((s) => s.lat != null && s.lng != null)
      .map((s) => {
        const lensLabel = lensWord(s.lens).replace(/^./, (c) => c.toUpperCase())
        return {
          id: s.id,
          name: s.title,
          lat: s.lat as number,
          lng: s.lng as number,
          thumb: s.thumb,
          subtitle: `${lensLabel} · ${s.source}`,
          reelUrl: s.reelUrl,
          active: s.id === activeSpot?.id,
          marker: "label" as const,
          order: orderById.get(s.id),
        }
      })
  }, [visibleSpots, activeSpot?.id, itinerary, orderById])

  const route = useMemo(() => {
    if (!itinerary || itinerary.stops.length < 2) return null
    return {
      points: itinerary.stops
        .filter((s) => s.save.lat != null && s.save.lng != null)
        .map((s) => ({
          lat: s.save.lat as number,
          lng: s.save.lng as number,
        })),
    }
  }, [itinerary])

  const runPlanDay = () => {
    const plan = planDayFromSpots(spots, 4)
    if (!plan) return
    setItinerary(plan)
    applyDayPlan(city.id, daySlotsFromItinerary(plan))
    setActiveSpotId(plan.stops[0]?.save.id)
    setLens("all")
    setTimelineOpen(true)
  }

  const clearPlan = () => {
    setItinerary(null)
    applyDayPlan(city.id, { am: null, mid: null, pm: null })
    setTimelineOpen(false)
  }

  if (!validCity) {
    return <Navigate to="/" replace />
  }

  const canPlan = spots.some((s) => s.lat != null && s.lng != null)

  return (
    <CinemaChrome>
      <LeafletPlacesMap
        ref={mapRef}
        key={`loc-${city.id}`}
        pins={pins}
        route={route}
        variant="dark"
        fitMaxZoom={14}
        paddingBottom={itinerary ? 220 : 120}
        pinTheme="cinema"
        popupOnActive={!itinerary}
        introCenter={handoff ? [handoff.lat, handoff.lng] : undefined}
        introZoom={handoff?.zoom}
        onPinSelect={(id) => setActiveSpotId(id)}
        onAddToDay={(id) => setDaySlot(city.id, "am", id)}
      />
      <div
        className={`pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#11100e]/90 via-transparent to-[#11100e]/40 transition-opacity duration-300 ${
          chromeIn && !leaving ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`pointer-events-none relative z-10 flex min-h-svh flex-col transition-opacity duration-300 ${
          chromeIn && !leaving ? "opacity-100" : "opacity-0"
        }`}
      >
        <CinemaStatus right={city.name} />
        <div className="flex items-center justify-between gap-2 px-4 pb-2">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void goBackToPlaces()}
              className="pointer-events-auto rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/15"
            >
              ← Places
            </button>
            <h1 className="truncate font-heading text-xl">{city.name}</h1>
          </div>
          <div className="pointer-events-auto flex shrink-0 items-center gap-1.5">
            {canPlan ? (
              <button
                type="button"
                onClick={runPlanDay}
                className="rounded-full bg-[#f6f1e8] px-3 py-1 text-xs font-semibold text-[#11100e] hover:bg-white"
              >
                {itinerary ? "Re-plan" : "Plan day"}
              </button>
            ) : null}
            <button
              type="button"
              className="max-w-[9rem] truncate rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
              onClick={() => setTipsOpen(true)}
            >
              Tips · {tips.length}
            </button>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-wrap gap-1.5 px-4 pb-2">
          {lensOptions.map((l) => (
            <Badge
              key={l}
              role="button"
              onClick={() => {
                setLens(l)
                if (itinerary) setItinerary(null)
              }}
              className={
                lens === l && !itinerary
                  ? "cursor-pointer rounded-full border-0 bg-[#f6f1e8] text-[#11100e] capitalize hover:bg-white"
                  : "cursor-pointer rounded-full border border-white/15 bg-white/5 text-white/75 capitalize hover:bg-white/10"
              }
            >
              {l === "all" ? "All" : l}
            </Badge>
          ))}
          {unsorted.length > 0 ? (
            <Badge
              role="button"
              onClick={() => setSortOpen(true)}
              className="cursor-pointer rounded-full border border-amber-300/40 bg-amber-300/10 text-amber-100 hover:bg-amber-300/20"
            >
              {unsorted.length} unsorted
            </Badge>
          ) : null}
        </div>

        <div className="min-h-0 flex-1" />

        {!activeSpot && !itinerary ? (
          <div className="pointer-events-auto mx-3 mb-2 rounded-2xl border border-dashed border-white/20 bg-black/50 px-4 py-4 text-center text-sm text-white/60">
            {spots.length === 0
              ? "No spots yet. Sort the pile or open another place."
              : "No spots in this lens. Try All."}
          </div>
        ) : null}

        <div className="pointer-events-auto mx-3 mb-4 space-y-2">
          {itinerary ? (
            <div className="rounded-2xl border border-white/10 bg-black/75 p-3 backdrop-blur-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#f6f1e8]">
                    {itinerary.stops.length} stops · ~{itinerary.totalWalkMinutes}{" "}
                    min walk
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/55">
                    {itinerary.lensMix}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTimelineOpen(true)}
                    className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-white/15"
                  >
                    Timeline
                  </button>
                  <button
                    type="button"
                    onClick={clearPlan}
                    className="rounded-full border border-white/15 bg-transparent px-2.5 py-1 text-[10px] text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <ol className="mt-3 space-y-2">
                {itinerary.stops.map((stop) => (
                  <li key={stop.save.id}>
                    <button
                      type="button"
                      onClick={() => setActiveSpotId(stop.save.id)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors ${
                        activeSpot?.id === stop.save.id
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f6f1e8] text-[10px] font-bold text-[#11100e]">
                        {stop.order}
                      </span>
                      <span className="w-10 shrink-0 text-[11px] font-semibold tabular-nums text-amber-100/90">
                        {stop.timeLabel}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium text-[#f6f1e8]">
                          {stop.save.title}
                        </span>
                        <span className="text-[10px] text-white/45">
                          {lensWord(stop.save.lens)}
                          {stop.walkMinutesFromPrev != null
                            ? ` · ${stop.walkMinutesFromPrev} min walk`
                            : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ) : canPlan ? (
            <button
              type="button"
              onClick={runPlanDay}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f6f1e8] px-4 py-3 text-sm font-semibold text-[#11100e] hover:bg-white"
            >
              Plan day
              <span className="text-[11px] font-medium text-[#11100e]/55">
                route · timeline
              </span>
            </button>
          ) : null}

          <div className="grid grid-cols-3 gap-1.5">
            {(["am", "mid", "pm"] as DaySlot[]).map((slot) => {
              const filled = spots.find((s) => s.id === dayPlan[slot])
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    if (activeSpot) setDaySlot(city.id, slot, activeSpot.id)
                  }}
                  className={
                    filled
                      ? "rounded-xl border border-amber-300/40 bg-amber-300/15 px-2 py-2 text-center text-[10px] font-semibold text-[#f6f1e8]"
                      : "rounded-xl border border-dashed border-white/25 px-2 py-2 text-center text-[10px] text-white/45"
                  }
                >
                  {filled
                    ? `${slotLabels[slot]} · ${filled.title.split(" ").slice(0, 2).join(" ")}`
                    : slotLabels[slot]}
                </button>
              )
            })}
          </div>

          <p className="text-center text-[10px] text-white/35">
            {counts.spots} pins · {counts.tips} tips
            {counts.unsorted > 0 ? ` · ${counts.unsorted} unsorted` : ""}
            {itinerary
              ? " · route on map"
              : activeSpot
                ? " · tap AM/Mid/PM to schedule"
                : ""}
          </p>
        </div>
      </div>

      <Sheet open={timelineOpen} onOpenChange={setTimelineOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[75vh] rounded-t-3xl border-white/10 bg-[#1c1b19] text-[#f6f1e8]"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="font-heading text-[#f6f1e8]">
              Day plan · {city.name}
            </SheetTitle>
            <SheetDescription className="text-white/55">
              {itinerary
                ? `${itinerary.stops.length} stops by proximity and type · ~${itinerary.totalWalkMinutes} min walk`
                : "No plan yet."}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-0 px-4 pb-6">
            {!itinerary ? (
              <p className="text-sm text-white/55">
                Tap Plan day to build a walkable loop from your saves.
              </p>
            ) : (
              itinerary.stops.map((stop, i) => (
                <div key={stop.save.id} className="relative flex gap-3 pb-4">
                  {i < itinerary.stops.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute left-[11px] top-7 bottom-0 w-px bg-white/15"
                    />
                  ) : null}
                  <span className="relative z-[1] mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f6f1e8] text-[10px] font-bold text-[#11100e]">
                    {stop.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug">
                        {stop.save.title}
                      </p>
                      <p className="shrink-0 text-[11px] font-semibold tabular-nums text-amber-100/90">
                        {stop.timeLabel}
                      </p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-white/50">
                      {lensWord(stop.save.lens)}
                      {stop.save.venueName ? ` · ${stop.save.venueName}` : ""}
                    </p>
                    {stop.walkMinutesFromPrev != null ? (
                      <p className="mt-1 text-[10px] text-white/35">
                        {stop.walkMinutesFromPrev} min walk from previous
                      </p>
                    ) : (
                      <p className="mt-1 text-[10px] text-white/35">Start here</p>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSpotId(stop.save.id)
                          setTimelineOpen(false)
                        }}
                        className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] text-white hover:bg-white/15"
                      >
                        Show on map
                      </button>
                      <a
                        href={stop.save.reelUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] text-white/70 hover:bg-white/10 hover:text-white"
                      >
                        Original
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={tipsOpen} onOpenChange={setTipsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[70vh] rounded-t-3xl border-white/10 bg-[#1c1b19] text-[#f6f1e8]"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="font-heading text-[#f6f1e8]">
              Tips · {city.name}
            </SheetTitle>
            <SheetDescription className="text-white/55">
              Generic advice. No map pin.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-2 px-4 pb-6">
            {tips.length === 0 ? (
              <p className="text-sm text-white/55">No tips yet for this place.</p>
            ) : (
              tips.map((tip) => (
                <div
                  key={tip.id}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5"
                >
                  <img
                    src={tip.thumb}
                    alt=""
                    className="size-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{tip.title}</p>
                    <a
                      href={tip.reelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-white/55 underline-offset-2 hover:underline"
                    >
                      Open original
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <SortSheet
        open={sortOpen}
        onOpenChange={setSortOpen}
        items={unsorted}
        cityName={city.name}
      />
    </CinemaChrome>
  )
}

function citiesHas(cityId: string) {
  return ["athens", "lisbon", "tokyo"].includes(cityId)
}
