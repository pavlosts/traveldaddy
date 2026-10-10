import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LeafletPlacesMap,
  type MapRoute,
  type RoutePathStyle,
} from "@/components/review/LeafletPlacesMap"
import { OptionBlock } from "@/components/review/OptionBlock"
import { PhoneShell, StatusBar } from "@/components/review/PhoneShell"
import { athensSpots } from "@/data/demo"

/** Sample day plan order used across all path mocks. */
const PLAN_IDS = ["ath-02", "ath-06", "ath-01", "ath-05"] as const

const LENS_COLOR: Record<string, string> = {
  see: "#c45c3a",
  eat: "#f6f1e8",
  do: "#e8c07a",
  stay: "#9bb0a5",
}

function usePlanPins() {
  return useMemo(() => {
    const stops = PLAN_IDS.map((id, i) => {
      const s = athensSpots.find((x) => x.id === id)!
      return { save: s, order: i + 1 }
    })
    const pins = stops.map((stop, i) => ({
      id: stop.save.id,
      name: stop.save.title,
      lat: stop.save.lat as number,
      lng: stop.save.lng as number,
      active: i === 0,
      marker: "label" as const,
      order: stop.order,
    }))
    const points = stops.map((s) => ({
      lat: s.save.lat as number,
      lng: s.save.lng as number,
    }))
    const segmentColors = stops.slice(1).map((s) => {
      const lens = s.save.lens ?? "see"
      return LENS_COLOR[lens] ?? "#f6f1e8"
    })
    return { pins, points, segmentColors }
  }, [])
}

function PathPhone({
  label,
  style,
  segmentColors,
}: {
  label: string
  style: RoutePathStyle
  segmentColors?: string[]
}) {
  const { pins, points, segmentColors: typed } = usePlanPins()
  const route: MapRoute = {
    points,
    style,
    color: "#f6f1e8",
    segmentColors: segmentColors ?? typed,
  }

  return (
    <PhoneShell
      label={label}
      className="border-zinc-800 bg-[#11100e] text-[#f6f1e8]"
    >
      <LeafletPlacesMap
        pins={pins}
        route={route}
        variant="dark"
        fitMaxZoom={14}
        paddingBottom={72}
        pinTheme="cinema"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#11100e]/85 via-transparent to-[#11100e]/35" />
      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        <StatusBar right="Athens" />
        <div className="flex items-center justify-between px-3.5 pb-2">
          <p className="font-heading text-lg">Athens</p>
          <span className="rounded-full bg-[#f6f1e8] px-2.5 py-0.5 text-[10px] font-semibold text-[#11100e]">
            Day plan
          </span>
        </div>
        <div className="min-h-0 flex-1" />
        <div className="mx-3 mb-4 rounded-2xl border border-white/10 bg-black/70 px-3 py-2.5 backdrop-blur-md">
          <p className="text-[11px] font-semibold text-[#f6f1e8]">
            4 stops · path style
          </p>
          <p className="mt-0.5 text-[10px] capitalize text-white/50">{style}</p>
        </div>
      </div>
    </PhoneShell>
  )
}

export function ReviewRoutePath() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-10 max-w-2xl text-left">
          <Badge variant="secondary" className="mb-3 tracking-[0.14em] uppercase">
            Mock review · route path
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Day plan path styles
          </h1>
          <p className="mt-3 text-muted-foreground">
            Five treatments for the walk polyline on the Cinema Map location
            stage. Same Athens stops. Pick a direction for the live Plan day
            route.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/place/athens">Open Athens location</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/review">Overall directions</Link>
            </Button>
          </div>
        </header>

        <div className="space-y-8">
          <OptionBlock
            letter="A"
            title="Cream Dash"
            note="Sharpened version of today: dark understroke plus cream dashes that read as a walk, not a driving route. Wins when the path should stay quiet next to numbered pins."
            keeps="current Cinema Map language"
            costs="legs do not encode type"
          >
            <PathPhone label="Location · dashed" style="dashed" />
          </OptionBlock>

          <OptionBlock
            letter="B"
            title="Typed Legs"
            note="Each hop paints the lens of the stop you are walking toward (coral sightseeing, cream eat, gold do). Wins when scanning the map for what kind of next beat you get."
            keeps="proximity order"
            costs="multi-color path can compete with pin labels"
          >
            <PathPhone label="Location · typed" style="typed" />
          </OptionBlock>

          <OptionBlock
            letter="C"
            title="Marching Ants"
            note="Same cream path, but dashes drift along the line so direction and progress feel alive. Wins when you want motion to sell the day without adding chrome."
            keeps="single cream stroke"
            costs="motion can feel busy on dense street tiles; respects reduced-motion"
          >
            <PathPhone label="Location · marching" style="marching" />
          </OptionBlock>

          <OptionBlock
            letter="D"
            title="Film Beads"
            note="Hairline connector with cream beads at mid-legs, like sprocket marks on a film strip. Wins when the route should feel like Cinema Map, not Google Maps."
            keeps="cinema metaphor"
            costs="weaker continuous path at a glance"
          >
            <PathPhone label="Location · beads" style="beads" />
          </OptionBlock>

          <OptionBlock
            main
            letter="E"
            title="Walk Ribbon"
            note="Locked for Plan day. Soft wide corridor under a solid cream spine: the path is a walkable band, not a dashed instruction. Wins when you want the day to feel like territory you own on the map."
            keeps="single color family + numbered label pins"
            costs="can wash out tiny streets; less sketch-like"
          >
            <PathPhone label="Location · ribbon" style="ribbon" />
          </OptionBlock>
        </div>
      </div>
    </div>
  )
}
