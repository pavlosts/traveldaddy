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
import { LeafletPlacesMap } from "../LeafletPlacesMap"
import { OptionBlock } from "../OptionBlock"
import { PhoneShell, StatusBar } from "../PhoneShell"

export function CinemaMapOption() {
  const [activeCityId, setActiveCityId] = useState(cities[0].id)
  const [activeSpotId, setActiveSpotId] = useState(athensSpotMapPins[0]?.id)
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
          thumb: city.heroImage,
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
      main
      letter="B"
      title="Cinema Map"
      note="Main direction. Film-strip city picker over a dark illustrated 3D globe. Location is map-first on a flat dark Esri canvas (same minimal stage as Terrain Glass), with denser pins, docked card, and day strip."
      keeps="pin/card sync + drag day + cinema chrome"
      costs="globe needs WebGL; tips stay compressed in the dock"
    >
      <PhoneShell
        label="Directory"
        className="border-zinc-800 bg-[#11100e] text-[#f6f1e8]"
      >
        <InteractiveSkylineMap
          mode="globe"
          globeTone="dark"
          pinTheme="cinema"
          popupOnActive
          pins={cityPins}
          center={[28, 28]}
          zoom={1.55}
          pitch={0}
          bearing={-20}
          onPinSelect={setActiveCityId}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-36 bg-gradient-to-b from-[#11100e] via-[#11100e]/65 to-transparent" />
        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <StatusBar />
          <p className="px-3.5 pb-1 text-left font-heading text-xl">
            Travel Daddy
          </p>
          <p className="px-3.5 pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Choose a place
          </p>
          <div className="pointer-events-auto flex gap-2 overflow-hidden px-3 pb-2">
            {cities.map((city) => {
              const selected = city.id === activeCityId
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setActiveCityId(city.id)}
                  className={
                    selected
                      ? "relative aspect-[3/4] w-[72px] shrink-0 rounded-xl bg-cover bg-center ring-2 ring-[#f6f1e8]"
                      : "relative aspect-[3/4] w-[72px] shrink-0 rounded-xl bg-cover bg-center opacity-45 grayscale"
                  }
                  style={{ backgroundImage: `url(${city.heroImage})` }}
                >
                  <span className="absolute inset-x-1 bottom-1 text-[10px] font-semibold text-white drop-shadow">
                    {city.name}
                  </span>
                </button>
              )
            })}
          </div>

        </div>
      </PhoneShell>

      <PhoneShell
        label="Location"
        className="border-zinc-800 bg-[#11100e] text-[#f6f1e8]"
      >
        <LeafletPlacesMap
          key="cinema-athens-dark"
          pins={athensPins}
          variant="dark"
          fitMaxZoom={13}
          paddingBottom={200}
          onPinSelect={setActiveSpotId}
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#11100e]/85 via-transparent to-[#11100e]/35" />
        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <StatusBar right="Athens" />
          <div className="flex items-center justify-between px-3.5 pb-1">
            <p className="font-heading text-lg">Athens</p>
            <Badge variant="secondary" className="bg-white/10 text-white">
              Tips · {athensTips[0].title.slice(0, 18)}…
            </Badge>
          </div>

          <div className="min-h-0 flex-1" />

          <div className="pointer-events-auto mx-2.5 mb-2.5 space-y-1.5">
            <div className="rounded-2xl border border-white/10 bg-black/70 p-2.5 backdrop-blur">
              <div className="flex items-center gap-2">
                <img
                  src={activeSpot.thumb}
                  alt=""
                  className="size-11 rounded-xl object-cover"
                />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-semibold leading-snug">
                    {activeSpot.title}
                  </p>
                  <p className="text-[10px] text-white/60">
                    {(activeSpot.lens ?? "spot").replace(/^./, (c) =>
                      c.toUpperCase()
                    )}{" "}
                    · {activeSpot.source} · Open Maps
                  </p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <Button
                  size="sm"
                  className="bg-[#f6f1e8] text-[#11100e] hover:bg-white"
                >
                  Add to day
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Original
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="rounded-xl border border-amber-300/40 bg-amber-300/10 p-1.5 text-center text-[10px] font-semibold">
                AM · Souvlaki
              </div>
              <div className="rounded-xl border border-dashed border-white/20 p-1.5 text-center text-[10px] text-white/50">
                Mid
              </div>
              <div className="rounded-xl border border-dashed border-white/20 p-1.5 text-center text-[10px] text-white/50">
                PM
              </div>
            </div>
          </div>
        </div>
      </PhoneShell>
    </OptionBlock>
  )
}
