import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cities } from "@/data/demo"
import { InteractiveSkylineMap } from "@/components/review/InteractiveSkylineMap"
import { CinemaChrome, CinemaStatus } from "./CinemaChrome"
import { useDigest } from "./DigestContext"
import {
  DIRECTORY_GLOBE_ZOOM,
  PLACE_HANDOFF_ZOOM,
  prefetchPlaceTiles,
  type PlaceHandoff,
  type ReturnHandoff,
} from "./mapHandoff"
import { SortSheet } from "./SortSheet"

function readReturn(state: unknown): {
  cityId: string | null
  returnHandoff: ReturnHandoff | null
} {
  if (!state || typeof state !== "object") {
    return { cityId: null, returnHandoff: null }
  }
  const s = state as {
    cityId?: unknown
    returnHandoff?: Partial<ReturnHandoff>
  }
  const cityId = typeof s.cityId === "string" ? s.cityId : null
  const rh = s.returnHandoff
  const returnHandoff =
    rh &&
    typeof rh.cityId === "string" &&
    typeof rh.zoom === "number"
      ? { cityId: rh.cityId, zoom: rh.zoom }
      : null
  return { cityId, returnHandoff }
}

export function DirectoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const arrival = readReturn(location.state)
  const returnedCityId = arrival.cityId
  const { countsFor, unsortedFor } = useDigest()
  const [activeCityId, setActiveCityId] = useState(
    returnedCityId && cities.some((c) => c.id === returnedCityId)
      ? returnedCityId
      : cities[0].id
  )
  const [globeZoom, setGlobeZoom] = useState(
    arrival.returnHandoff?.zoom ?? DIRECTORY_GLOBE_ZOOM
  )
  const [sortOpen, setSortOpen] = useState(false)
  const returning = useRef(!!arrival.returnHandoff)

  useEffect(() => {
    if (!returning.current) return
    returning.current = false
    // Let the globe mount at the closer zoom, then ease out.
    const t = window.setTimeout(() => setGlobeZoom(DIRECTORY_GLOBE_ZOOM), 420)
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: { cityId: activeCityId } }
    )
    return () => window.clearTimeout(t)
    // Only on arrival from a place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeCity = cities.find((c) => c.id === activeCityId) ?? cities[0]
  const unsorted = unsortedFor(activeCity.id)

  const cityPins = useMemo(
    () =>
      cities.map((city) => {
        const c = countsFor(city.id)
        return {
          id: city.id,
          name: city.name,
          lat: city.lat,
          lng: city.lng,
          thumb: city.heroImage,
          subtitle: `${c.spots} spots · ${c.tips} tip`,
          active: city.id === activeCityId,
        }
      }),
    [activeCityId, countsFor]
  )

  return (
    <CinemaChrome>
      <InteractiveSkylineMap
        mode="globe"
        globeTone="dark"
        pinTheme="cinema"
        popupOnActive
        eager
        pins={cityPins}
        center={[activeCity.lng, activeCity.lat]}
        zoom={globeZoom}
        pitch={0}
        bearing={-20}
        onPinSelect={setActiveCityId}
        onPinOpening={() => {
          prefetchPlaceTiles(activeCity.lat, activeCity.lng, PLACE_HANDOFF_ZOOM)
        }}
        onPinOpen={(id) => {
          const city = cities.find((c) => c.id === id) ?? activeCity
          prefetchPlaceTiles(city.lat, city.lng, PLACE_HANDOFF_ZOOM)
          const handoff: PlaceHandoff = {
            cityId: city.id,
            lat: city.lat,
            lng: city.lng,
            zoom: PLACE_HANDOFF_ZOOM,
          }
          const go = () => navigate(`/place/${id}`, { state: { handoff } })
          const doc = document as Document & {
            startViewTransition?: (cb: () => void) => void
          }
          if (doc.startViewTransition) doc.startViewTransition(go)
          else go()
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-44 bg-gradient-to-b from-[#11100e] via-[#11100e]/70 to-transparent" />

      <div className="pointer-events-none relative z-10 flex min-h-svh flex-col">
        <CinemaStatus />
        <div className="flex items-start justify-between gap-3 px-4 pb-1">
          <div className="text-left">
            <h1 className="font-heading text-3xl tracking-tight text-[#f6f1e8]">
              Travel Daddy
            </h1>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Choose a place
            </p>
          </div>
          {unsorted.length > 0 ? (
            <Button
              size="sm"
              variant="secondary"
              className="pointer-events-auto shrink-0 bg-white/10 text-white hover:bg-white/15"
              onClick={() => setSortOpen(true)}
            >
              Sort pile
            </Button>
          ) : null}
        </div>

        <div className="pointer-events-auto flex gap-2 overflow-x-auto px-4 pb-3 pt-1">
          {cities.map((city) => {
            const selected = city.id === activeCityId
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => setActiveCityId(city.id)}
                onDoubleClick={() => navigate(`/place/${city.id}`)}
                className={
                  selected
                    ? "relative aspect-[3/4] w-[84px] shrink-0 rounded-xl bg-cover bg-center ring-2 ring-[#f6f1e8]"
                    : "relative aspect-[3/4] w-[84px] shrink-0 rounded-xl bg-cover bg-center opacity-45 grayscale"
                }
                style={{ backgroundImage: `url(${city.heroImage})` }}
              >
                <span className="absolute inset-x-1 bottom-1 text-left text-[11px] font-semibold text-white drop-shadow">
                  {city.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <SortSheet
        open={sortOpen}
        onOpenChange={setSortOpen}
        items={unsorted}
        cityName={activeCity.name}
      />
    </CinemaChrome>
  )
}
