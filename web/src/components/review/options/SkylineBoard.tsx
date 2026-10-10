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
import { InteractiveSkylineMap } from "../InteractiveSkylineMap"
import { InteractiveTerrainMap } from "../InteractiveTerrainMap"
import { OptionBlock } from "../OptionBlock"
import { PhoneShell, StatusBar } from "../PhoneShell"

const shell = "border-zinc-200 bg-[#f4f7fb] text-zinc-900"
const panel =
  "rounded-2xl border border-zinc-200/90 bg-white/92 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md"

export function SkylineBoardOption() {
  const [activeCityId, setActiveCityId] = useState(cities[0].id)
  const [activeSpotId, setActiveSpotId] = useState(athensSpotMapPins[0]?.id)
  const activeCity = cities.find((c) => c.id === activeCityId) ?? cities[0]
  const activeCounts = countsFor(activeCity.id)
  const activeSpot =
    athensSpots.find((s) => s.id === activeSpotId) ?? athensSpots[0]

  const cityPins = useMemo(
    () =>
      cities.map((city) => {
        const c = countsFor(city.id)
        return {
          id: city.id,
          name: city.name,
          lat: city.lat,
          lng: city.lng,
          subtitle: `${c.spots} spots · ${c.tips} tip`,
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

  return (
    <OptionBlock
      letter="D"
      title="Skyline Board"
      note="Second 3D direction beside Terrain Glass. Directory uses a soft illustrated globe (no labels). Location reuses the realistic pitched terrain map (Esri + DEM), with light board chrome. Circular pins. No API key."
      keeps="map-first IA + real lat/lng"
      costs="globe and terrain both need WebGL"
    >
      <PhoneShell label="Directory" className={shell}>
        <InteractiveSkylineMap
          mode="globe"
          pins={cityPins}
          center={[28, 28]}
          zoom={1.55}
          pitch={0}
          bearing={-20}
          onPinSelect={setActiveCityId}
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#f4f7fb]/90 via-transparent to-[#f4f7fb]/55" />
        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <StatusBar />
          <div className="px-3.5 pt-1 text-left">
            <p className="text-lg font-semibold tracking-tight text-zinc-900">
              Travel Daddy
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Orbit your places
            </p>
          </div>

          <div className="min-h-0 flex-1" />

          <div className={`pointer-events-auto mx-3 mb-3 ${panel} p-3 text-left`}>
            <p className="text-sm font-semibold">{activeCity.name}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {activeCounts.spots} spots · {activeCounts.tips} tip · drag the
              globe
            </p>
            <Button
              size="sm"
              className="mt-2 w-full bg-teal-800 text-white hover:bg-teal-700"
            >
              Open {activeCity.name}
            </Button>
          </div>
        </div>
      </PhoneShell>

      <PhoneShell label="Location" className={shell}>
        <InteractiveTerrainMap
          variant="light"
          pins={athensPins}
          center={[23.7315, 37.9755]}
          zoom={12.8}
          pitch={62}
          bearing={28}
          paddingBottom={220}
          terrainExaggeration={1.8}
          onPinSelect={setActiveSpotId}
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#f4f7fb]/85 via-transparent to-[#f4f7fb]/45" />
        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <StatusBar right="Athens" />
          <div className="flex items-center gap-2 px-3 pt-1">
            <Badge className="rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-white">
              ← Places
            </Badge>
            <span className="text-sm font-semibold">Athens</span>
            <Badge className="rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-white">
              {athensSpotMapPins.length} pins
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5 px-3">
            {["Eat", "See", "Do", "Tips"].map((lens, i) => (
              <Badge
                key={lens}
                className={
                  i === 0
                    ? "rounded-full border-0 bg-teal-800 text-white hover:bg-teal-800"
                    : "rounded-full border border-zinc-200 bg-white/90 text-zinc-700 hover:bg-white"
                }
              >
                {lens}
              </Badge>
            ))}
          </div>

          <div className="min-h-0 flex-1" />

          <div
            className={`pointer-events-auto mx-3 mb-1.5 ${panel} overflow-hidden p-0 text-left`}
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
                <p className="mt-0.5 text-[10px] text-zinc-500">
                  {activeSpot.source} · tilt the terrain
                </p>
              </div>
              <Button
                size="xs"
                className="shrink-0 bg-teal-800 text-white hover:bg-teal-700"
              >
                Add
              </Button>
            </div>
          </div>

          <div
            className={`pointer-events-auto mx-3 mb-1.5 ${panel} px-2.5 py-2 text-left`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              Tips
            </p>
            <p className="text-xs font-medium">{athensTips[0].title}</p>
          </div>

          <div
            className={`pointer-events-auto mx-3 mb-3 grid grid-cols-3 gap-1.5 ${panel} p-2`}
          >
            <div className="rounded-xl bg-teal-800/10 px-1.5 py-1.5 text-center text-[10px] font-semibold text-teal-900">
              AM · Souvlaki
            </div>
            <div className="rounded-xl border border-dashed border-zinc-300 px-1.5 py-1.5 text-center text-[10px] text-zinc-400">
              Mid
            </div>
            <div className="rounded-xl border border-dashed border-zinc-300 px-1.5 py-1.5 text-center text-[10px] text-zinc-400">
              PM
            </div>
          </div>
        </div>
      </PhoneShell>
    </OptionBlock>
  )
}
