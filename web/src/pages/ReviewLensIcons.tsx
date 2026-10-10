import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Lens = "all" | "eat" | "see" | "do" | "stay"

const LENSES: Lens[] = ["all", "eat", "see", "do", "stay"]
const LABELS: Record<Lens, string> = {
  all: "All",
  eat: "Eat",
  see: "See",
  do: "Do",
  stay: "Stay",
}

/** Locked art direction: soft clay 3D. */
function clay(lens: Lens) {
  return `/lens-icons/clay/${lens}.png`
}

function Stage({
  children,
  bottom,
}: {
  children: ReactNode
  bottom?: ReactNode
}) {
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
      <div className="relative flex min-h-[280px] flex-col px-4 pt-10 pb-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white">
            ← Places
          </span>
          <span className="font-heading text-xl text-[#f6f1e8]">Athens</span>
          <span className="ml-auto rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white">
            Tips · 1
          </span>
        </div>
        {children}
        <div className="min-h-0 flex-1" />
        {bottom}
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

function ClayImg({
  kind,
  size,
  className,
}: {
  kind: Lens
  size: number
  className?: string
}) {
  return (
    <img
      src={clay(kind)}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={cn("shrink-0 object-cover", className)}
    />
  )
}

/** A: clay stickers in the existing pill row. */
function OptionA() {
  const [lens, setLens] = useState<Lens>("eat")
  return (
    <Stage
      bottom={
        <p className="text-center text-[10px] text-white/35">
          7 pins · 1 tip · 1 unsorted
        </p>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {LENSES.map((l) => {
          const on = lens === l
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLens(l)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-xs font-medium capitalize",
                on
                  ? "bg-[#f6f1e8] text-[#11100e]"
                  : "border border-white/15 bg-white/5 text-white/85"
              )}
            >
              <ClayImg kind={l} size={26} className="rounded-[30%]" />
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

/** B: icon-first sticker shelf under the title. */
function OptionB() {
  const [lens, setLens] = useState<Lens>("eat")
  return (
    <Stage
      bottom={
        <p className="text-center text-[10px] text-white/35">
          Filtering · {LABELS[lens].toLowerCase()}
        </p>
      }
    >
      <div className="flex gap-2 overflow-x-auto pb-1">
        {LENSES.map((l) => {
          const on = lens === l
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLens(l)}
              className={cn(
                "flex w-[64px] shrink-0 flex-col items-center gap-1.5 rounded-2xl px-1 py-2 transition-all",
                on ? "text-[#f6f1e8]" : "text-white/55"
              )}
            >
              <ClayImg
                kind={l}
                size={44}
                className={cn(
                  "rounded-[28%] transition-transform",
                  on
                    ? "scale-110 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
                    : "opacity-75"
                )}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">
                {LABELS[l]}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          className="flex w-[64px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-amber-300/40 text-[10px] font-semibold tracking-[0.08em] text-amber-100 uppercase"
        >
          <span className="text-sm font-bold">1</span>
          Sort
        </button>
      </div>
    </Stage>
  )
}

/** C: expanding clay rail; only active shows the word. */
function OptionC() {
  const [lens, setLens] = useState<Lens>("eat")
  return (
    <Stage>
      <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/45 p-1 backdrop-blur">
        {LENSES.map((l) => {
          const on = lens === l
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLens(l)}
              aria-label={LABELS[l]}
              aria-pressed={on}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full transition-all duration-300",
                on
                  ? "bg-[#f6f1e8] px-3 text-[#11100e]"
                  : "w-11 hover:bg-white/10"
              )}
            >
              <ClayImg kind={l} size={30} className="rounded-[32%]" />
              <span
                className={cn(
                  "text-xs font-semibold capitalize whitespace-nowrap transition-all duration-300",
                  on ? "max-w-[4rem] opacity-100" : "max-w-0 opacity-0"
                )}
              >
                {LABELS[l]}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          className="ml-0.5 inline-flex h-11 items-center rounded-full bg-amber-300/15 px-2.5 text-[11px] font-semibold text-amber-100"
        >
          1
        </button>
      </div>
      <p className="mt-3 text-[11px] text-white/45">
        Showing{" "}
        <span className="text-[#f6f1e8]">{LABELS[lens].toLowerCase()}</span>{" "}
        spots
      </p>
    </Stage>
  )
}

/** D: lenses as map legend docked bottom-left. */
function OptionD() {
  const [lens, setLens] = useState<Lens>("eat")
  return (
    <Stage
      bottom={
        <div className="pointer-events-auto flex items-end justify-between gap-3">
          <div className="rounded-2xl border border-white/12 bg-black/70 p-2 shadow-lg backdrop-blur-md">
            <p className="mb-1.5 px-1 text-[9px] font-semibold tracking-[0.14em] text-white/40 uppercase">
              Lenses
            </p>
            <div className="flex flex-col gap-1">
              {LENSES.map((l) => {
                const on = lens === l
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLens(l)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-1.5 py-1 text-left transition-colors",
                      on ? "bg-[#f6f1e8] text-[#11100e]" : "text-white/80 hover:bg-white/8"
                    )}
                  >
                    <ClayImg kind={l} size={28} className="rounded-[30%]" />
                    <span className="pr-2 text-[11px] font-semibold">
                      {LABELS[l]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          <button
            type="button"
            className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-[11px] font-semibold text-amber-100"
          >
            1 unsorted
          </button>
        </div>
      }
    >
      <p className="max-w-[14rem] text-[11px] text-white/40">
        Map stays open. Lenses live as a legend on the board.
      </p>
    </Stage>
  )
}

/** E: one hero clay icon + swipeable lens story. */
function OptionE() {
  const [lens, setLens] = useState<Lens>("eat")
  const blurb: Record<Lens, string> = {
    all: "Everything you saved in Athens",
    eat: "Tables worth the walk",
    see: "Views you bookmarked",
    do: "Things to go do",
    stay: "Beds and bases",
  }
  const i = LENSES.indexOf(lens)
  return (
    <Stage
      bottom={
        <div className="flex items-center justify-center gap-1.5">
          {LENSES.map((l) => (
            <button
              key={l}
              type="button"
              aria-label={LABELS[l]}
              onClick={() => setLens(l)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                lens === l ? "w-5 bg-[#f6f1e8]" : "w-1.5 bg-white/25"
              )}
            />
          ))}
        </div>
      }
    >
      <div className="flex flex-col items-center pt-2 text-center">
        <ClayImg
          kind={lens}
          size={88}
          className="rounded-[26%] shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
        />
        <p className="mt-3 font-heading text-2xl text-[#f6f1e8]">
          {LABELS[lens]}
        </p>
        <p className="mt-1 text-sm text-white/55">{blurb[lens]}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            disabled={i === 0}
            onClick={() => setLens(LENSES[i - 1]!)}
            className="rounded-full border border-white/15 px-3 py-1 text-xs text-white disabled:opacity-30"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={i === LENSES.length - 1}
            onClick={() => setLens(LENSES[i + 1]!)}
            className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white disabled:opacity-30"
          >
            Next lens
          </button>
        </div>
      </div>
    </Stage>
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
            Mock review · clay icons in app
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            How clay icons show up
          </h1>
          <p className="mt-3 text-muted-foreground">
            Soft clay art is locked. Five ways to place All / Eat / See / Do /
            Stay on the Cinema Map location screen.
          </p>
          <div className="mt-4 mb-2 flex flex-wrap gap-3">
            {LENSES.map((l) => (
              <div key={l} className="flex flex-col items-center gap-1">
                <ClayImg kind={l} size={52} className="rounded-2xl shadow-sm" />
                <span className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  {LABELS[l]}
                </span>
              </div>
            ))}
          </div>
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
            title="Pill + sticker"
            note="Clay icons drop into the current pill strip beside labels. Wins when you want the least layout change."
            keeps="Familiar density"
            costs="Art stays small"
          >
            <OptionA />
          </OptionBlock>

          <OptionBlock
            letter="B"
            title="Sticker shelf"
            note="Larger clay stickers in a horizontal shelf under the title. Wins when icons should feel thumbable and toy-like."
            keeps="Icon-first scan"
            costs="Taller chrome over the map"
          >
            <OptionB />
          </OptionBlock>

          <OptionBlock
            letter="C"
            title="Expanding rail"
            note="Compact clay capsule; only the active lens spells its name. Wins on tight widths while keeping art readable."
            keeps="One control"
            costs="Idle lenses lose words"
          >
            <OptionC />
          </OptionBlock>

          <OptionBlock
            letter="D"
            title="Map legend"
            note="Lenses move to a bottom-left legend so the top bar stays light. Wins when the map should stay the hero."
            keeps="Full vertical map"
            costs="New docking pattern"
          >
            <OptionD />
          </OptionBlock>

          <OptionBlock
            letter="E"
            title="Lens story"
            note="One giant clay hero at a time with prev/next. Wins if filtering should feel like flipping collectible cards."
            keeps="Maximum charm"
            costs="Slowest to switch lenses"
          >
            <OptionE />
          </OptionBlock>
        </div>
      </div>
    </div>
  )
}
