import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  athensSpotMapPins,
  athensSpots,
  athensTips,
  cities,
  cityMapPins,
  countsFor,
} from "@/data/demo"
import { MapPin } from "lucide-react"
import { LeafletPlacesMap } from "../LeafletPlacesMap"
import { OptionBlock } from "../OptionBlock"
import { PhoneShell, StatusBar } from "../PhoneShell"

const shell =
  "border-zinc-200 bg-white text-zinc-900"
const sheet =
  "rounded-t-3xl border border-zinc-200/80 bg-white shadow-[0_-8px_32px_rgba(15,23,42,0.08)]"
const chip =
  "rounded-full border border-zinc-200 bg-white/90 text-zinc-800 shadow-sm backdrop-blur hover:bg-white"

export function AtlasSheetOption() {
  return (
    <OptionBlock
      letter="A"
      title="Atlas Sheet"
      note="White map-first shell on Leaflet with Esri light gray canvas (no API key). City and spot pins use real lat/lng. Sheets and chrome stay paper-white."
      keeps="pin = spot rule"
      costs="less room for tips until the sheet expands"
    >
      <PhoneShell label="Directory" className={shell}>
        <StatusBar />
        <div className="relative flex-1 overflow-hidden">
          <LeafletPlacesMap
            pins={cityMapPins}
            paddingBottom={200}
            variant="minimal"
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/80 via-transparent to-transparent" />
          <p className="absolute left-3.5 top-1 z-10 text-sm font-semibold tracking-tight text-zinc-900">
            Travel Daddy
          </p>
          <div className={`absolute inset-x-0 bottom-0 z-10 ${sheet} p-3 text-left`}>
            <div className="mx-auto mb-2 h-1 w-9 rounded-full bg-zinc-300" />
            <p className="text-sm font-semibold text-zinc-900">Your places</p>
            <p className="mb-2 text-[11px] text-zinc-500">
              Tap a pin or a row
            </p>
            {cities.slice(0, 2).map((city) => {
              const c = countsFor(city.id)
              return (
                <div
                  key={city.id}
                  className="flex items-center gap-2 border-t border-zinc-100 py-2"
                >
                  <img
                    src={city.heroImage}
                    alt=""
                    className="size-9 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-900">
                      {city.name}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {c.spots} spots · {c.tips} tip
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-zinc-500">
                    Sort {c.unsorted}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </PhoneShell>

      <PhoneShell label="Location" className={shell}>
        <StatusBar right="Athens" />
        <div className="relative flex-1 overflow-hidden">
          <LeafletPlacesMap
            pins={athensSpotMapPins}
            paddingBottom={280}
            variant="minimal"
            fitMaxZoom={13}
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/75 via-transparent to-transparent" />
          <div className="absolute left-3 top-2 z-10 flex items-center gap-2">
            <Badge className={chip}>← Places</Badge>
            <span className="text-sm font-semibold text-zinc-900">Athens</span>
            <Badge className={`${chip} gap-1`}>
              <MapPin className="size-3" />
              {athensSpotMapPins.length} pins
            </Badge>
          </div>

          <div
            className={`absolute inset-x-0 bottom-0 z-10 max-h-[48%] ${sheet} p-3 text-left`}
          >
            <div className="mx-auto mb-2 h-1 w-9 rounded-full bg-zinc-300" />
            <div className="mb-2 flex flex-wrap gap-1">
              {["Eat", "See", "Tips", "Unsorted"].map((lens, i) => (
                <Badge
                  key={lens}
                  className={
                    i === 0
                      ? "rounded-full border-0 bg-zinc-900 text-white hover:bg-zinc-900"
                      : "rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-50"
                  }
                >
                  {lens}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 py-1.5">
              <img
                src={athensSpots[0].thumb}
                alt=""
                className="size-9 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-zinc-900">
                  {athensSpots[0].title}
                </p>
                <p className="text-[10px] text-zinc-500">
                  Instagram · drag to day
                </p>
              </div>
            </div>
            <Separator className="my-1 bg-zinc-100" />
            <div className="flex items-center gap-2 py-1.5">
              <img
                src={athensTips[0].thumb}
                alt=""
                className="size-9 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-zinc-900">
                  {athensTips[0].title}
                </p>
                <p className="text-[10px] text-zinc-500">Tip · no pin</p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1">
              <Button
                size="sm"
                className="h-8 bg-zinc-900 text-[10px] text-white hover:bg-zinc-800"
              >
                AM · Souvlaki
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-zinc-200 bg-white text-[10px] text-zinc-700"
              >
                Mid
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-zinc-200 bg-white text-[10px] text-zinc-700"
              >
                PM
              </Button>
            </div>
          </div>
        </div>
      </PhoneShell>
    </OptionBlock>
  )
}
