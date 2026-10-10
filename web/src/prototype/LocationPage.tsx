import { useEffect, useMemo, useRef, useState } from "react"
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
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
import { cities, cityById, type Lens } from "@/data/demo"
import { CinemaChrome, CinemaStatus } from "./CinemaChrome"
import { useDigest } from "./DigestContext"
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
import { clayLensIcon, lensFilterLabels } from "./lensIcons"
import { SortSheet } from "./SortSheet"
import { cn } from "@/lib/utils"

const lensOptions: Array<Lens | "all"> = ["all", "eat", "see", "do", "stay"]

function lensWord(lens: Lens) {
  if (lens === "see") return "sightseeing"
  if (!lens) return "spot"
  return lens
}

function LensBadge({
  lens,
  className = "",
}: {
  lens: Lens
  className?: string
}) {
  return (
    <span
      className={cn(
        "relative z-[1] flex size-7 shrink-0 items-center justify-center",
        className
      )}
      aria-label={lensWord(lens)}
    >
      <img
        src={clayLensIcon(lens)}
        alt=""
        width={28}
        height={28}
        draggable={false}
        className="size-full object-contain"
      />
    </span>
  )
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
    unsortedFor,
    setDaySlot,
    applyDayPlan,
  } = useDigest()

  const spots = spotsFor(city.id)
  const unsorted = unsortedFor(city.id)

  const [lens, setLens] = useState<Lens | "all">("all")
  const [activeSpotId, setActiveSpotId] = useState(spots[0]?.id)
  const [sortOpen, setSortOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [itinerary, setItinerary] = useState<DayItinerary | null>(null)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

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

  const goBackToPlaces = () => {
    if (leaving) return
    setLeaving(true)
    // Soft map ease in the background. Skip View Transitions on return:
    // snapshotting Leaflet then remounting MapLibre is what felt laggy.
    void mapRef.current?.zoomOut()
    const returnHandoff: ReturnHandoff = {
      cityId: city.id,
      zoom: RETURN_GLOBE_ZOOM,
    }
    window.setTimeout(() => {
      navigate("/", { state: { cityId: city.id, returnHandoff } })
    }, 140)
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
    const planMode = !!itinerary
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
          lens: (s.lens ?? "all") as "eat" | "see" | "do" | "stay" | "all",
          active: s.id === activeSpot?.id,
          // Plan day uses Walk Ribbon pins (labels + order). Browse stays clay.
          marker: planMode ? ("label" as const) : ("clay" as const),
          order: orderById.get(s.id),
        }
      })
  }, [visibleSpots, activeSpot?.id, itinerary, orderById])

  const route = useMemo(() => {
    if (!itinerary || itinerary.stops.length < 2) return null
    return {
      style: "ribbon" as const,
      color: "#f6f1e8",
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
        paddingBottom={80}
        pinTheme="cinema"
        zoomable
        popupOnActive={!itinerary}
        introCenter={handoff ? [handoff.lat, handoff.lng] : undefined}
        introZoom={handoff?.zoom}
        onPinSelect={(id) => setActiveSpotId(id)}
        onAddToDay={(id) => setDaySlot(city.id, "am", id)}
        onOpenDetails={(id) => {
          setActiveSpotId(id)
          setDetailsOpen(true)
        }}
      />
      <div
        className={`pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#11100e]/90 via-transparent to-[#11100e]/40 transition-opacity duration-150 ${
          chromeIn && !leaving ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`pointer-events-none relative z-10 flex min-h-svh flex-col transition-opacity duration-150 ${
          chromeIn && !leaving ? "opacity-100" : "opacity-0"
        }`}
      >
        <CinemaStatus right={city.name} />
        <div className="flex items-center justify-between gap-2 px-4 pb-2">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={goBackToPlaces}
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
            {itinerary ? (
              <>
                <button
                  type="button"
                  onClick={() => setTimelineOpen(true)}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                >
                  Timeline
                </button>
                <button
                  type="button"
                  onClick={clearPlan}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                >
                  Clear
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="pointer-events-auto flex gap-2 overflow-x-auto px-4 pb-2">
          {lensOptions.map((l) => {
            const on = lens === l && !itinerary
            const label = lensFilterLabels[l === null ? "all" : l]
            return (
              <button
                key={String(l)}
                type="button"
                onClick={() => {
                  setLens(l)
                  if (itinerary) setItinerary(null)
                }}
                className={cn(
                  "flex w-[64px] shrink-0 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 transition-all",
                  on ? "text-[#f6f1e8]" : "text-white/55"
                )}
              >
                <img
                  src={clayLensIcon(l)}
                  alt=""
                  width={44}
                  height={44}
                  draggable={false}
                  className={cn(
                    "size-11 object-contain transition-transform",
                    on
                      ? "scale-110 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
                      : "opacity-85"
                  )}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">
                  {label}
                </span>
              </button>
            )
          })}
          {unsorted.length > 0 ? (
            <button
              type="button"
              onClick={() => setSortOpen(true)}
              className="flex w-[64px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-amber-300/40 text-[10px] font-semibold tracking-[0.08em] text-amber-100 uppercase"
            >
              <span className="text-sm font-bold leading-none">{unsorted.length}</span>
              Sort
            </button>
          ) : null}
        </div>

        <div className="min-h-0 flex-1" />

        {!activeSpot && !itinerary ? (
          <div className="pointer-events-auto mx-3 mb-4 rounded-2xl border border-dashed border-white/20 bg-black/50 px-4 py-4 text-center text-sm text-white/60">
            {spots.length === 0
              ? "No spots yet. Sort the pile or open another place."
              : "No spots in this lens. Try All."}
          </div>
        ) : null}
      </div>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent
          side="left"
          className="w-[min(100%,22rem)] border-white/10 bg-[#1c1b19] p-0 text-[#f6f1e8] sm:max-w-sm"
        >
          {activeSpot ? (
            <div className="flex h-full flex-col">
              <div className="relative h-44 shrink-0 bg-[#2a2723]">
                <img
                  src={activeSpot.thumb}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c1b19] via-transparent to-black/20" />
              </div>
              <SheetHeader className="gap-1 px-4 pt-3 text-left">
                <SheetTitle className="font-heading text-xl text-[#f6f1e8]">
                  {activeSpot.title}
                </SheetTitle>
                <SheetDescription className="text-white/55">
                  {lensWord(activeSpot.lens).replace(/^./, (c) =>
                    c.toUpperCase()
                  )}{" "}
                  · {activeSpot.source}
                  {activeSpot.venueName ? ` · ${activeSpot.venueName}` : ""}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-6">
                <p className="text-sm leading-relaxed text-white/70">
                  Saved from {activeSpot.source}. Add it to your day, or open
                  the original reel to rewatch why you kept it.
                </p>
                <div className="mt-auto grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDaySlot(city.id, "am", activeSpot.id)
                      setDetailsOpen(false)
                    }}
                    className="rounded-xl bg-[#f6f1e8] px-4 py-2.5 text-sm font-semibold text-[#11100e] hover:bg-white"
                  >
                    Add to day
                  </button>
                  <a
                    href={activeSpot.reelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Open original reel
                  </a>
                  <button
                    type="button"
                    onClick={() => setDetailsOpen(false)}
                    className="rounded-xl px-4 py-2 text-sm text-white/55 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-sm text-white/55">No spot selected.</div>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={timelineOpen} onOpenChange={setTimelineOpen} modal={false}>
        <SheetContent
          side="right"
          showOverlay={false}
          className="w-[min(100%,24rem)] border-white/10 bg-[#1c1b19] text-[#f6f1e8] shadow-[-12px_0_40px_rgba(0,0,0,0.45)] sm:max-w-md"
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
          <div className="min-h-0 flex-1 space-y-0 overflow-y-auto px-4 pb-6">
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
                      className="absolute left-[13px] top-8 bottom-0 w-px bg-white/15"
                    />
                  ) : null}
                  <LensBadge lens={stop.save.lens} className="mt-0.5" />
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
  return cities.some((c) => c.id === cityId)
}
