import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function OptionBlock({
  letter,
  title,
  note,
  keeps,
  costs,
  main = false,
  children,
}: {
  letter: string
  title: string
  note: string
  keeps: string
  costs: string
  main?: boolean
  children: ReactNode
}) {
  return (
    <Card
      className={
        main
          ? "overflow-hidden border-foreground/20 shadow-md ring-1 ring-foreground/15"
          : "overflow-hidden border-border/80 shadow-sm"
      }
    >
      <CardHeader className="gap-2">
        <div className="flex flex-wrap gap-2">
          {main ? (
            <Badge className="w-fit tracking-[0.14em] uppercase">
              Main direction
            </Badge>
          ) : null}
          <Badge variant="secondary" className="w-fit tracking-[0.14em] uppercase">
            Option {letter}
          </Badge>
        </div>
        <CardTitle className="font-heading text-2xl tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-relaxed">
          {note}
        </CardDescription>
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">Keeps</span> {keeps}
          </span>
          <span>
            <span className="font-medium text-foreground">Costs</span> {costs}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid justify-items-center gap-8 sm:grid-cols-2 sm:justify-items-start">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
