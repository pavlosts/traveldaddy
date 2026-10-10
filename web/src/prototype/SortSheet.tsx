import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Lens, Save } from "@/data/demo"
import { useDigest } from "./DigestContext"

const lenses: Lens[] = ["eat", "see", "do", "stay"]

export function SortSheet({
  open,
  onOpenChange,
  items,
  cityName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: Save[]
  cityName: string
}) {
  const { sortUnsorted } = useDigest()
  const [currentId, setCurrentId] = useState(items[0]?.id)
  const [lens, setLens] = useState<Lens>("eat")
  const current =
    items.find((i) => i.id === currentId) ?? items[0] ?? null

  useEffect(() => {
    if (items.length === 0) return
    if (!items.some((i) => i.id === currentId)) {
      setCurrentId(items[0].id)
    }
  }, [items, currentId])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] rounded-t-3xl border-white/10 bg-[#1c1b19] text-[#f6f1e8]"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-[#f6f1e8]">
            Sort pile · {cityName}
          </SheetTitle>
          <SheetDescription className="text-white/55">
            Send each save to Spot (pin + card) or Tip (shelf, no pin).
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 || !current ? (
          <p className="px-4 pb-6 text-sm text-white/60">
            Nothing left to sort here.
          </p>
        ) : (
          <div className="space-y-4 px-4 pb-6">
            {items.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentId(item.id)}
                    className={
                      item.id === current.id
                        ? "size-14 shrink-0 overflow-hidden rounded-xl ring-2 ring-[#f6f1e8]"
                        : "size-14 shrink-0 overflow-hidden rounded-xl opacity-50"
                    }
                  >
                    <img
                      src={item.thumb}
                      alt=""
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <img
                src={current.thumb}
                alt=""
                className="h-36 w-full object-cover"
              />
              <div className="p-3">
                <p className="font-heading text-lg leading-tight">
                  {current.title}
                </p>
                <p className="mt-1 text-xs text-white/55">
                  {current.source} · needs a home in {cityName}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                Spot lens
              </p>
              <div className="flex flex-wrap gap-1.5">
                {lenses.map((l) => (
                  <Badge
                    key={l}
                    role="button"
                    onClick={() => setLens(l)}
                    className={
                      lens === l
                        ? "cursor-pointer rounded-full border-0 bg-[#f6f1e8] text-[#11100e] capitalize hover:bg-white"
                        : "cursor-pointer rounded-full border border-white/15 bg-white/5 text-white/80 capitalize hover:bg-white/10"
                    }
                  >
                    {l}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                className="bg-[#f6f1e8] text-[#11100e] hover:bg-white"
                onClick={() => {
                  sortUnsorted(current.id, "spot", lens)
                  const next = items.find((i) => i.id !== current.id)
                  if (next) setCurrentId(next.id)
                  else onOpenChange(false)
                }}
              >
                Make spot
              </Button>
              <Button
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/15"
                onClick={() => {
                  sortUnsorted(current.id, "tip")
                  const next = items.find((i) => i.id !== current.id)
                  if (next) setCurrentId(next.id)
                  else onOpenChange(false)
                }}
              >
                Make tip
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
