import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Full-viewport Cinema Map shell (mobile-first digest). */
export function CinemaChrome({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative min-h-svh overflow-hidden bg-[#11100e] text-[#f6f1e8]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CinemaStatus({ right = "TD" }: { right?: string }) {
  return (
    <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-10 text-[11px] font-semibold text-white/45">
      <span>9:41</span>
      <span>{right}</span>
    </div>
  )
}
