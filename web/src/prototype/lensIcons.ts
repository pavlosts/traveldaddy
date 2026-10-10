import type { Lens } from "@/data/demo"

export type LensFilter = Lens | "all"

/** Soft clay stickers with transparent plates (PNG). */
export function clayLensIcon(lens: LensFilter) {
  const key = lens ?? "all"
  return `/lens-icons/clay/${key}.png`
}

export const lensFilterLabels: Record<Exclude<LensFilter, null>, string> = {
  all: "All",
  eat: "Eat",
  see: "See",
  do: "Do",
  stay: "Stay",
}
