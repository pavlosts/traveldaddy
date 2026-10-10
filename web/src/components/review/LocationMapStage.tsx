import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { athensSpotMapPins } from "@/data/demo"
import { MapPin } from "lucide-react"
import { LeafletPlacesMap, type MapVariant } from "./LeafletPlacesMap"

/** Full-bleed location map with chrome layered on top. */
export function LocationMapStage({
  mapKey,
  variant = "minimal",
  top,
  bottom,
  fitMaxZoom = 13,
  paddingBottom = 200,
  showPinCount = true,
}: {
  mapKey: string
  variant?: MapVariant
  top?: ReactNode
  bottom?: ReactNode
  fitMaxZoom?: number
  paddingBottom?: number
  showPinCount?: boolean
}) {
  const pinCount = athensSpotMapPins.length

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <LeafletPlacesMap
        key={mapKey}
        pins={athensSpotMapPins}
        variant={variant}
        fitMaxZoom={fitMaxZoom}
        paddingBottom={paddingBottom}
      />
      {showPinCount ? (
        <Badge className="absolute left-3 top-3 z-10 gap-1 rounded-full border-0 bg-black/55 text-white backdrop-blur hover:bg-black/55">
          <MapPin className="size-3" />
          {pinCount} pins
        </Badge>
      ) : null}
      {top ? <div className="absolute inset-x-0 top-0 z-10">{top}</div> : null}
      {bottom ? (
        <div className="absolute inset-x-0 bottom-0 z-10">{bottom}</div>
      ) : null}
    </div>
  )
}
