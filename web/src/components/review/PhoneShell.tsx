import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function PhoneShell({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className="w-full max-w-[300px]">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <div
        className={cn(
          "relative aspect-[300/640] overflow-hidden rounded-[2rem] border bg-background shadow-xl",
          className
        )}
      >
        <div className="absolute inset-0 flex flex-col">{children}</div>
      </div>
    </div>
  )
}

export function StatusBar({ right = "TD" }: { right?: string }) {
  return (
    <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-3 text-[11px] font-semibold text-muted-foreground">
      <span>9:41</span>
      <span>{right}</span>
    </div>
  )
}
