import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AtlasSheetOption } from "@/components/review/options/AtlasSheet"
import { CinemaMapOption } from "@/components/review/options/CinemaMap"
import { SkylineBoardOption } from "@/components/review/options/SkylineBoard"
import { TerrainGlassOption } from "@/components/review/options/TerrainGlass"

export function ReviewDirections() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-10 max-w-2xl text-left">
          <Badge variant="secondary" className="mb-3 tracking-[0.14em] uppercase">
            Mock review · shadcn
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Travel Daddy — overall directions
          </h1>
          <p className="mt-3 text-muted-foreground">
            Main direction is Cinema Map: film-strip picker, dark illustrated
            globe, and a flat dark minimal location map. Other options stay as
            comparisons. Same product objects. Built with shadcn/ui.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/">Open working prototype</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/review/lens-icons">Lens icon mocks</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/review/motion">Motion mocks</Link>
            </Button>
          </div>
        </header>

        <div className="space-y-8">
          <CinemaMapOption />
          <Separator />
          <AtlasSheetOption />
          <Separator />
          <TerrainGlassOption />
          <Separator />
          <SkylineBoardOption />
        </div>
      </div>
    </div>
  )
}
