import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  athensSpotMapPins,
  athensSpots,
  athensTips,
  cities,
  countsFor,
} from "@/data/demo"
import { LeafletPlacesMap } from "../LeafletPlacesMap"
import { OptionBlock } from "../OptionBlock"
import { PhoneShell, StatusBar } from "../PhoneShell"

const glass =
  "rounded-2xl border border-white/25 bg-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl"
const glassSoft =
  "rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-md"

export function TerrainGlassOption() {
  const [activeCityId, setActiveCityId] = useState(cities[0].id)
  const [activeSpotId, setActiveSpotId] = useState(athensSpotMapPins[0]?.id)
  const activeCity = cities.find((c) => c.id === activeCityId) ?? cities[0]
  const activeCounts = countsFor(activeCity.id)
  const activeSpot =
    athensSpots.find((s) => s.id === activeSpotId) ?? athensSpots[0]

  const glassCityPins = useMemo(
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
          marker: "glass" as const,
          active: city.id === activeCityId,
        }
      }),
    [activeCityId]
  )

  const athensPins = useMemo(
    () =>
      athensSpotMapPins.map((pin) => ({
        ...pin,
        active: pin.id === activeSpotId,
        name: athensSpots.find((s) => s.id === pin.id)?.title,
      })),
    [activeSpotId]
  )

  const unsortedTotal = cities.reduce(
    (n, c) => n + countsFor(c.id).unsorted,
    0
  )

  return (
    <OptionBlock
      letter="C"
      title="Terrain Glass"
      note="Frosted glass UI over a flat Esri dark map (no 3D). Circular pins at real lat/lng; the active place fills the glass sheet below. No API key."
      keeps="map as the stage + glass UI + real coords"
      costs="less spectacle than pitched terrain"
    >
      {/* Directory */}
      <PhoneShell
        label="Directory"
        className="border-white/10 bg-[#0c1210] text-white"
      >
        <LeafletPlacesMap
          key="terrain-dir-world"
          pins={glassCityPins}
          variant="dark"
          fitMaxZoom={3}
          paddingBottom={140}
          onPinSelect={setActiveCityId}
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-transparent to-black/40" />
        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <StatusBar />
          <div className="px-3.5 pt-1 text-left">
            <p className="text-lg font-semibold tracking-tight drop-shadow">
              Travel Daddy
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">
              Your places on the map
            </p>
          </div>

          <div className="min-h-0 flex-1" />

          <div
            className={`pointer-events-auto mx-3 mb-3 ${glass} p-3 text-left`}
          >
            <p className="text-sm font-semibold">{activeCity.name}</p>
            <p className="mt-0.5 text-[11px] text-white/70">
              {activeCounts.spots} spots · {activeCounts.tips} tip · tap a pin
            </p>
            {unsortedTotal > 0 ? (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-white/80">
                  {unsortedTotal} saves need sorting
                </span>
                <Button
                  size="xs"
                  className="border-0 bg-emerald-400 text-[#0c1210] hover:bg-emerald-300"
                >
                  Sort pile
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </PhoneShell>

      {/* Location */}
      <PhoneShell
        label="Location"
        className="border-white/10 bg-[#0c1210] text-white"
      >
        <LeafletPlacesMap
          key="terrain-loc-athens"
          pins={athensPins}
          variant="dark"
          fitMaxZoom={13}
          paddingBottom={240}
          onPinSelect={setActiveSpotId}
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-transparent to-black/30" />
        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <StatusBar right="Athens" />
          <div className="flex items-center gap-2 px-3 pt-1">
            <Badge className={`${glassSoft} hover:bg-white/12`}>← Places</Badge>
            <span className="text-sm font-semibold drop-shadow">Athens</span>
            <Badge className={`${glassSoft} hover:bg-white/12`}>
              {athensSpotMapPins.length} pins
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5 px-3">
            {["Eat", "See", "Do", "Tips"].map((lens, i) => (
              <Badge
                key={lens}
                className={
                  i === 0
                    ? "rounded-full border-0 bg-emerald-400 text-[#0c1210] hover:bg-emerald-400"
                    : `${glassSoft} hover:bg-white/12`
                }
              >
                {lens}
              </Badge>
            ))}
          </div>

          <div className="min-h-0 flex-1" />

          <div
            className={`pointer-events-auto mx-3 mb-1.5 ${glass} overflow-hidden p-0 text-left`}
          >
            <div className="flex items-center gap-2.5 p-2.5">
              <img
                src={activeSpot.thumb}
                alt=""
                className="size-12 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-snug">
                  {activeSpot.title}
                </p>
                <p className="mt-0.5 text-[10px] text-white/70">
                  {activeSpot.source} · Open Maps
                </p>
              </div>
              <Button
                size="xs"
                className="shrink-0 border-0 bg-emerald-400 text-[#0c1210] hover:bg-emerald-300"
              >
                Add
              </Button>
            </div>
          </div>

          <div
            className={`pointer-events-auto mx-3 mb-1.5 ${glass} px-2.5 py-2 text-left`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">
              Tips
            </p>
            <p className="text-xs font-medium">{athensTips[0].title}</p>
          </div>

          <div
            className={`pointer-events-auto mx-3 mb-3 grid grid-cols-3 gap-1.5 ${glass} p-2`}
          >
            <div className="rounded-xl bg-emerald-400/25 px-1.5 py-1.5 text-center text-[10px] font-semibold">
              AM · Souvlaki
            </div>
            <div className="rounded-xl border border-dashed border-white/25 px-1.5 py-1.5 text-center text-[10px] text-white/55">
              Mid
            </div>
            <div className="rounded-xl border border-dashed border-white/25 px-1.5 py-1.5 text-center text-[10px] text-white/55">
              PM
            </div>
          </div>
        </div>
      </PhoneShell>
    </OptionBlock>
  )
}
