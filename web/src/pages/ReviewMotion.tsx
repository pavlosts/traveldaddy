import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PhoneShell, StatusBar } from "@/components/review/PhoneShell"
import {
  athensSpots,
  athensTips,
  cities,
  countsFor,
  unsortedFor,
} from "@/data/demo"
import { cn } from "@/lib/utils"

function MotionBlock({
  letter,
  title,
  source,
  note,
  tryHint,
  children,
}: {
  letter: string
  title: string
  source: string
  note: string
  tryHint: string
  children: ReactNode
}) {
  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="w-fit tracking-[0.14em] uppercase">
            Round 2 · {letter}
          </Badge>
          <Badge variant="outline" className="w-fit tracking-[0.08em]">
            {source}
          </Badge>
        </div>
        <CardTitle className="font-heading text-2xl tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-relaxed">
          {note}
        </CardDescription>
        <p className="pt-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Try</span> {tryHint}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center sm:justify-start">{children}</div>
      </CardContent>
    </Card>
  )
}

function CinemaPhone({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <PhoneShell
      label={label}
      className="border-zinc-800 bg-[#11100e] text-[#f6f1e8]"
    >
      {children}
    </PhoneShell>
  )
}

function MapWash() {
  return (
    <div className="absolute inset-0 bg-[#1a1916]">
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% 38%, rgba(246,241,232,0.1), transparent 70%), linear-gradient(rgba(246,241,232,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(246,241,232,0.04) 1px, transparent 1px)",
          backgroundSize: "auto, 28px 28px, 28px 28px",
        }}
      />
    </div>
  )
}

/** F — SmoothUI Photo Stack */
function MockPhotoStack() {
  const deck = unsortedFor("athens").length
    ? unsortedFor("athens")
    : athensSpots.slice(0, 4)
  const [order, setOrder] = useState(deck.map((s) => s.id))
  const drag = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  function cycle() {
    setOrder((prev) => [...prev.slice(1), prev[0]])
    setOffset({ x: 0, y: 0 })
  }

  function onDown(e: ReactPointerEvent<HTMLButtonElement>) {
    drag.current = { x: e.clientX, y: e.clientY, active: true }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!drag.current.active) return
    setOffset({
      x: e.clientX - drag.current.x,
      y: e.clientY - drag.current.y,
    })
  }

  function onUp() {
    if (!drag.current.active) return
    drag.current.active = false
    const dist = Math.hypot(offset.x, offset.y)
    if (dist > 48) cycle()
    else setOffset({ x: 0, y: 0 })
  }

  const frontId = order[0]
  const front = deck.find((s) => s.id === frontId) ?? deck[0]

  return (
    <CinemaPhone label="Unsorted pile">
      <MapWash />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar />
        <p className="px-3.5 font-heading text-xl">Athens</p>
        <p className="px-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Flick to sort later
        </p>
        <div className="relative mx-auto mt-8 h-[280px] w-[200px]">
          {order.map((id, i) => {
            const item = deck.find((s) => s.id === id)
            if (!item) return null
            const isFront = i === 0
            const depth = Math.min(i, 3)
            return (
              <button
                key={id}
                type="button"
                aria-label={item.title}
                tabIndex={isFront ? 0 : -1}
                onClick={() => {
                  if (isFront && Math.hypot(offset.x, offset.y) < 4) cycle()
                }}
                onPointerDown={isFront ? onDown : undefined}
                onPointerMove={isFront ? onMove : undefined}
                onPointerUp={isFront ? onUp : undefined}
                onPointerCancel={isFront ? onUp : undefined}
                className={cn(
                  "absolute inset-0 overflow-hidden rounded-2xl border border-white/20 bg-black text-left shadow-xl transition-[transform,opacity] duration-300 ease-out",
                  !isFront && "pointer-events-none"
                )}
                style={
                  {
                    zIndex: 10 - depth,
                    transform: isFront
                      ? `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x * 0.04}deg)`
                      : `translateY(${depth * 10}px) scale(${1 - depth * 0.04})`,
                    opacity: 1 - depth * 0.18,
                  } as CSSProperties
                }
              >
                <img
                  src={item.thumb}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                    Unsorted
                  </p>
                  <p className="text-sm font-medium leading-snug">{item.title}</p>
                </div>
              </button>
            )
          })}
        </div>
        <p className="mt-4 px-3.5 text-center text-[11px] text-white/40">
          {front.title}
        </p>
      </div>
    </CinemaPhone>
  )
}

/** G — React Bits Carousel (story / gallery) */
function MockCarousel() {
  const slides = athensSpots.slice(0, 5)
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const touchX = useRef<number | null>(null)

  function go(next: number, d: number) {
    setDir(d)
    setIndex((next + slides.length) % slides.length)
  }

  useEffect(() => {
    const t = window.setInterval(() => go(index + 1, 1), 3200)
    return () => window.clearInterval(t)
  }, [index])

  const slide = slides[index]

  return (
    <CinemaPhone label="Spot stories">
      <div className="absolute inset-0 bg-black" />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar />
        <div className="flex gap-1 px-3.5 pb-2">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20"
            >
              <div
                className={cn(
                  "h-full bg-[#f6f1e8] transition-all duration-300",
                  i < index ? "w-full" : i === index ? "w-2/3" : "w-0"
                )}
              />
            </div>
          ))}
        </div>
        <div
          className="relative min-h-0 flex-1 overflow-hidden"
          onPointerDown={(e) => {
            touchX.current = e.clientX
          }}
          onPointerUp={(e) => {
            if (touchX.current == null) return
            const dx = e.clientX - touchX.current
            touchX.current = null
            if (dx < -40) go(index + 1, 1)
            else if (dx > 40) go(index - 1, -1)
          }}
        >
          <img
            key={slide.id}
            src={slide.thumb}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              dir > 0 ? "motion-slide-next" : "motion-slide-prev"
            )}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent px-3.5 pb-5 pt-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
              {slide.lens ?? "spot"} · {slide.source}
            </p>
            <p className="mt-1 font-heading text-xl leading-snug">{slide.title}</p>
            <p className="mt-1 text-[11px] text-white/55">{slide.venueName}</p>
          </div>
        </div>
      </div>
    </CinemaPhone>
  )
}

/** H — Fan / pile stack for cities */
function MockFanStack() {
  const [active, setActive] = useState(0)

  return (
    <CinemaPhone label="Directory · fan deck">
      <MapWash />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar />
        <p className="px-3.5 font-heading text-xl">Travel Daddy</p>
        <p className="px-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Tap a card in the fan
        </p>
        <div className="relative mx-auto mt-10 h-[300px] w-[220px]">
          {cities.map((city, i) => {
            const offset = i - active
            const c = countsFor(city.id)
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => setActive(i)}
                className="absolute left-1/2 top-6 w-[170px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/20 bg-black text-left shadow-2xl transition-transform duration-400 ease-out"
                style={{
                  zIndex: 20 - Math.abs(offset),
                  transform: `
                    translateX(calc(-50% + ${offset * 28}px))
                    translateY(${Math.abs(offset) * 8}px)
                    rotate(${offset * 7}deg)
                    scale(${1 - Math.abs(offset) * 0.06})
                  `,
                  opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2,
                }}
              >
                <img
                  src={city.heroImage}
                  alt=""
                  className="aspect-[3/4] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-10">
                  <p className="font-heading text-lg">{city.name}</p>
                  <p className="text-[10px] text-white/55">
                    {c.spots} spots · {c.tips} tips
                  </p>
                </div>
              </button>
            )
          })}
        </div>
        <div className="mt-auto px-3.5 pb-5">
          <Button className="w-full bg-[#f6f1e8] text-[#11100e] hover:bg-[#f6f1e8]/90">
            Open {cities[active].name}
          </Button>
        </div>
      </div>
    </CinemaPhone>
  )
}

/** I — Flying posters column */
function MockFlyingPosters() {
  const posters = [...athensSpots.slice(0, 4), ...athensTips.slice(0, 2)]
  const scroller = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState(0)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    function onScroll() {
      if (!el) return
      const max = el.scrollHeight - el.clientHeight
      setTilt(max > 0 ? (el.scrollTop / max) * 18 - 9 : 0)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <CinemaPhone label="Reel column">
      <div className="absolute inset-0 bg-[#0d0c0b]" />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar />
        <p className="px-3.5 font-heading text-xl">Athens reels</p>
        <p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Scroll the posters
        </p>
        <div
          ref={scroller}
          className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 perspective-[900px]"
        >
          <div
            className="space-y-4 transition-transform duration-150"
            style={{ transform: `rotateY(${tilt}deg)` }}
          >
            {posters.map((p, i) => (
              <div
                key={p.id}
                className="motion-poster overflow-hidden rounded-xl border border-white/15 bg-black shadow-lg"
                style={{
                  transform: `rotateX(${(i % 2 === 0 ? -1 : 1) * 4}deg) translateZ(0)`,
                }}
              >
                <img
                  src={p.thumb}
                  alt=""
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">
                    {p.kind}
                  </p>
                  <p className="text-sm font-medium leading-snug">{p.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CinemaPhone>
  )
}

/** J — Coverflow / depth carousel */
function MockCoverflow() {
  const [active, setActive] = useState(0)

  return (
    <CinemaPhone label="Directory · coverflow">
      <MapWash />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar />
        <p className="px-3.5 font-heading text-xl">Your places</p>
        <div className="relative mt-8 h-[260px] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center perspective-[700px]">
            {cities.map((city, i) => {
              const offset = i - active
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className="absolute w-[140px] overflow-hidden rounded-xl border border-white/20 bg-black shadow-xl transition-all duration-400 ease-out"
                  style={{
                    zIndex: 10 - Math.abs(offset),
                    transform: `
                      translateX(${offset * 78}px)
                      translateZ(${-Math.abs(offset) * 60}px)
                      rotateY(${offset * -28}deg)
                      scale(${1 - Math.abs(offset) * 0.12})
                    `,
                    opacity: Math.abs(offset) > 1.5 ? 0 : 1 - Math.abs(offset) * 0.25,
                  }}
                >
                  <img
                    src={city.heroImage}
                    alt=""
                    className="aspect-[3/4] w-full object-cover"
                  />
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-auto px-3.5 pb-5 text-center">
          <p className="font-heading text-2xl">{cities[active].name}</p>
          <p className="text-[11px] text-white/45">
            Swipe focus · {countsFor(cities[active].id).spots} spots
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/10 text-[#f6f1e8]"
              onClick={() =>
                setActive((a) => (a - 1 + cities.length) % cities.length)
              }
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/10 text-[#f6f1e8]"
              onClick={() => setActive((a) => (a + 1) % cities.length)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </CinemaPhone>
  )
}

/** K — Card swap dock */
function MockCardSwap() {
  const cards = athensSpots.slice(0, 3)
  const [order, setOrder] = useState([0, 1, 2])

  useEffect(() => {
    const t = window.setInterval(() => {
      setOrder((prev) => [prev[1], prev[2], prev[0]])
    }, 2200)
    return () => window.clearInterval(t)
  }, [])

  const positions = [
    "translate(0px, 0px) scale(1)",
    "translate(18px, 14px) scale(0.94)",
    "translate(36px, 28px) scale(0.88)",
  ]

  return (
    <CinemaPhone label="Location · swap dock">
      <MapWash />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar />
        <p className="px-3.5 font-heading text-xl">Athens</p>
        <p className="px-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Cards cycle under the pin
        </p>
        <div className="flex-1" />
        <div className="relative mx-3 mb-5 h-[170px]">
          {order.map((cardIndex, slot) => {
            const spot = cards[cardIndex]
            return (
              <div
                key={spot.id}
                className="absolute inset-x-0 top-0 flex gap-3 rounded-2xl border border-white/15 bg-[#1c1b18]/95 p-3 shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  zIndex: 3 - slot,
                  transform: positions[slot],
                  opacity: 1 - slot * 0.15,
                }}
              >
                <img
                  src={spot.thumb}
                  alt=""
                  className="h-[120px] w-[88px] shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 pt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                    {spot.lens ?? "spot"}
                  </p>
                  <p className="mt-1 font-heading text-base leading-snug">
                    {spot.title}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-white/50">
                    {spot.venueName}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </CinemaPhone>
  )
}

export function ReviewMotion() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-10 max-w-2xl text-left">
          <Badge variant="secondary" className="mb-3 tracking-[0.14em] uppercase">
            Mock review · motion round 2
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Media deck motions
          </h1>
          <p className="mt-3 text-muted-foreground">
            Fresh set after Round 1. Built around tactile save piles and place
            pickers from{" "}
            <a
              className="underline underline-offset-2"
              href="https://smoothui.dev/docs/components/photo-stack"
              target="_blank"
              rel="noreferrer"
            >
              SmoothUI Photo Stack
            </a>{" "}
            and{" "}
            <a
              className="underline underline-offset-2"
              href="https://reactbits.dev/components/carousel"
              target="_blank"
              rel="noreferrer"
            >
              React Bits Carousel
            </a>
            , plus nearby siblings (Stack, Flying Posters, Coverflow, Card Swap).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/">Open working prototype</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/review">Overall directions</Link>
            </Button>
          </div>
        </header>

        <div className="space-y-8">
          <MotionBlock
            letter="F"
            title="Photo stack"
            source="SmoothUI"
            note="Draggable deck of unsorted save stills. Flick or tap the top card to the back. Feels like a real pile of Reels, not a ticker."
            tryHint="Drag the top card away, or tap to cycle."
          >
            <MockPhotoStack />
          </MotionBlock>

          <MotionBlock
            letter="G"
            title="Story carousel"
            source="React Bits Carousel"
            note="Full-bleed spot stories with progress ticks and swipe. Closest to how people already browse saves."
            tryHint="Swipe left/right on the image, or wait for autoplay."
          >
            <MockCarousel />
          </MotionBlock>

          <MotionBlock
            letter="H"
            title="Fan stack"
            source="React Bits Stack"
            note="Directory as a fanned pile of place cards instead of a film strip. Tap a side card to bring it forward."
            tryHint="Tap Lisbon or Tokyo in the fan."
          >
            <MockFanStack />
          </MotionBlock>

          <MotionBlock
            letter="I"
            title="Flying posters"
            source="React Bits"
            note="Vertical column of reel posters that twist slightly as you scroll. Cinema without logo-marquee energy."
            tryHint="Scroll the column slowly."
          >
            <MockFlyingPosters />
          </MotionBlock>

          <MotionBlock
            letter="J"
            title="Coverflow"
            source="React Bits Depth Carousel"
            note="Perspective city picker. Center place is sharp; neighbors fall away in depth."
            tryHint="Use Prev / Next or tap a side city."
          >
            <MockCoverflow />
          </MotionBlock>

          <MotionBlock
            letter="K"
            title="Card swap"
            source="React Bits Card Swap"
            note="Docked location cards cycle positions under the active pin. Quiet motion that keeps the map first."
            tryHint="Watch the stack rotate every couple of seconds."
          >
            <MockCardSwap />
          </MotionBlock>
        </div>

        <section className="mt-12 max-w-2xl text-left">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Also worth mocking next
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <span className="text-foreground">Folder / Folder Float</span>:
              each city as a folder that opens into saves.
            </li>
            <li>
              <span className="text-foreground">Accordion Gallery</span>: one
              expanded spot still among a row of frames.
            </li>
            <li>
              <span className="text-foreground">Sticker Peel</span>: peel an
              unsorted clip to Spot or Tip.
            </li>
            <li>
              <span className="text-foreground">Time Machine Stack</span>{" "}
              (SmoothUI): day-strip as layered time cards.
            </li>
            <li>
              <span className="text-foreground">Orbital Image Wheel</span>:
              radial browse around a map pin.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
