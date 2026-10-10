const ATHENS_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=23.70%2C37.955%2C23.76%2C38.005&layer=mapnik&marker=37.9865%2C23.7342"

const WORLD_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=-25%2C15%2C155%2C60&layer=mapnik"

export const mapEmbeds = {
  athens: ATHENS_EMBED,
  world: WORLD_EMBED,
} as const

export function MapEmbed({
  src,
  className = "",
}: {
  src: string
  className?: string
}) {
  return (
    <>
      <iframe
        title="map"
        src={src}
        className={`pointer-events-none absolute inset-0 size-full border-0 ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/35" />
    </>
  )
}
