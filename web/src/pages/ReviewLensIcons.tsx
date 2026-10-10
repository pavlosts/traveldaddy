import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Lens = "all" | "eat" | "see" | "do" | "stay"
type IconStyle = "clay" | "flat" | "engraved" | "enamel" | "sketch"

const LENSES: Lens[] = ["all", "eat", "see", "do", "stay"]
const LABELS: Record<Lens, string> = {
  all: "All",
  eat: "Eat",
  see: "See",
  do: "Do",
  stay: "Stay",
}

function iconSrc(style: IconStyle, lens: Lens) {
  return `/lens-icons/${style}/${lens}.jpg`
}

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#11100e]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,241,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(246,241,232,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative px-4 pb-4 pt-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white">
            ← Places
          </span>
          <span className="font-heading text-xl text-[#f6f1e8]">Athens</span>
        </div>
        {children}
      </div>
    </div>
  )
}

function OptionBlock({
  letter,
  title,
  note,
  keeps,
  costs,
  children,
}: {
  letter: string
  title: string
  note: string
  keeps?: string
  costs?: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Option {letter}
        </p>
        <h2 className="mt-1 font-heading text-2xl tracking-tight">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{note}</p>
        {(keeps || costs) && (
          <p className="mt-2 text-xs text-zinc-500">
            {keeps ? <span>Keeps: {keeps}. </span> : null}
            {costs ? <span>Costs: {costs}.</span> : null}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

function Illu({
  style,
  kind,
  size = 28,
  className,
}: {
  style: IconStyle
  kind: Lens
  size?: number
  className?: string
}) {
  return (
    <img
      src={iconSrc(style, kind)}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={cn("shrink-0 object-cover", className)}
    />
  )
}

/** Shared strip so style is the only variable. */
function StyleStrip({
  style,
  imgClass,
}: {
  style: IconStyle
  imgClass?: string
}) {
  const [lens, setLens] = useState<Lens>("eat")
  return (
    <Stage>
      <div className="flex flex-wrap gap-1.5">
        {LENSES.map((l) => {
          const on = lens === l
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLens(l)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-xs font-medium capitalize transition-colors",
                on
                  ? "bg-[#f6f1e8] text-[#11100e]"
                  : "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
              )}
            >
              <Illu
                style={style}
                kind={l}
                size={26}
                className={cn("rounded-[30%]", imgClass)}
              />
              {LABELS[l]}
            </button>
          )
        })}
        <button
          type="button"
          className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs text-amber-100"
        >
          1 unsorted
        </button>
      </div>
    </Stage>
  )
}

function StyleRoster({
  style,
  imgClass,
}: {
  style: IconStyle
  imgClass?: string
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-3">
      {LENSES.map((l) => (
        <div key={l} className="flex flex-col items-center gap-1">
          <Illu
            style={style}
            kind={l}
            size={56}
            className={cn("rounded-2xl shadow-sm", imgClass)}
          />
          <span className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            {LABELS[l]}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ReviewLensIcons() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-10 max-w-2xl text-left">
          <Badge
            variant="secondary"
            className="mb-3 tracking-[0.14em] uppercase"
          >
            Mock review · icon styles
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Category icon styles
          </h1>
          <p className="mt-3 text-muted-foreground">
            Five illustration languages for All / Eat / See / Do / Stay. Same
            Cinema Map pill strip in every option so you are judging style, not
            layout.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link to="/place/athens">Back to Athens</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/review">Overall directions</Link>
            </Button>
          </div>
        </header>

        <div className="space-y-12">
          <OptionBlock
            letter="A"
            title="Soft clay"
            note="Toy-like 3D clay props with soft light. Wins when the app should feel warm, friendly, and collectible."
            keeps="Clear metaphor per lens"
            costs="Heavier files; can fight the dark map chrome"
          >
            <StyleRoster style="clay" />
            <StyleStrip style="clay" />
          </OptionBlock>

          <OptionBlock
            letter="B"
            title="Flat stickers"
            note="Bold flat color shapes, no shading. Wins when icons need to stay sharp at 24px and load like UI, not renders."
            keeps="Simple production pipeline"
            costs="Less 'fun object' presence than clay"
          >
            <StyleRoster style="flat" imgClass="rounded-xl" />
            <StyleStrip style="flat" imgClass="rounded-xl" />
          </OptionBlock>

          <OptionBlock
            letter="C"
            title="Guidebook engraving"
            note="Cream line glyphs on charcoal tiles. Wins when Cinema Map should feel editorial and filmic, not playful toy."
            keeps="Matches dark chrome closely"
            costs="Less friendly; metaphors read quieter"
          >
            <StyleRoster style="engraved" imgClass="rounded-lg" />
            <StyleStrip style="engraved" imgClass="rounded-lg" />
          </OptionBlock>

          <OptionBlock
            letter="D"
            title="Enamel pins"
            note="Hard cloisonne badges with metal rims. Wins if lenses should feel like souvenirs you collect on the trip."
            keeps="Strong identity, very 'object'"
            costs="Busy next to map labels; gold can feel premium-tour"
          >
            <StyleRoster style="enamel" imgClass="rounded-full" />
            <StyleStrip style="enamel" imgClass="rounded-full" />
          </OptionBlock>

          <OptionBlock
            letter="E"
            title="Scrapbook marker"
            note="Wobbly felt-tip drawings on paper. Wins when saves should feel personal, like notes from your own reel pile."
            keeps="Maximum personality"
            costs="Hardest to keep consistent across new lenses"
          >
            <StyleRoster style="sketch" imgClass="rounded-lg" />
            <StyleStrip style="sketch" imgClass="rounded-lg" />
          </OptionBlock>
        </div>
      </div>
    </div>
  )
}
