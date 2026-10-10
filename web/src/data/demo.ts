export type SaveKind = "spot" | "tip" | "unsorted"
export type Lens = "eat" | "see" | "do" | "stay" | null

export type City = {
  id: string
  name: string
  heroImage: string
  lat: number
  lng: number
}

export type Save = {
  id: string
  cityId: string
  kind: SaveKind
  lens: Lens
  title: string
  thumb: string
  source: "instagram" | "tiktok"
  reelUrl: string
  lat: number | null
  lng: number | null
  venueName: string | null
}

export const cities: City[] = [
  {
    id: "athens",
    name: "Athens",
    heroImage:
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=80",
    lat: 37.9838,
    lng: 23.7275,
  },
  {
    id: "lisbon",
    name: "Lisbon",
    heroImage:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
    lat: 38.7223,
    lng: -9.1393,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    heroImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
    lat: 35.6762,
    lng: 139.6503,
  },
  {
    id: "new-york",
    name: "New York",
    heroImage:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    heroImage:
      "https://images.unsplash.com/photo-1518659526054-0335ecb0b0e0?w=1200&q=80",
    lat: 19.4326,
    lng: -99.1332,
  },
  {
    id: "bangkok",
    name: "Bangkok",
    heroImage:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
    lat: 13.7563,
    lng: 100.5018,
  },
  {
    id: "cape-town",
    name: "Cape Town",
    heroImage:
      "https://images.unsplash.com/photo-1580060839134-75a5ed44e17b?w=1200&q=80",
    lat: -33.9249,
    lng: 18.4241,
  },
  {
    id: "sydney",
    name: "Sydney",
    heroImage:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
    lat: -33.8688,
    lng: 151.2093,
  },
]

export const saves: Save[] = [
  {
    id: "ath-01",
    cityId: "athens",
    kind: "spot",
    lens: "eat",
    title: "Late souvlaki in Exarchia",
    thumb:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/athens-souvlaki-dummy",
    lat: 37.9865,
    lng: 23.7342,
    venueName: "Exarchia street grill",
  },
  {
    id: "ath-02",
    cityId: "athens",
    kind: "spot",
    lens: "see",
    title: "Sunset from Filopappou",
    thumb:
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/athens-filopappou-dummy",
    lat: 37.9682,
    lng: 23.7215,
    venueName: "Filopappou Hill",
  },
  {
    id: "ath-05",
    cityId: "athens",
    kind: "spot",
    lens: "eat",
    title: "Plaka taverna courtyard",
    thumb:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/athens-plaka-dummy",
    lat: 37.972,
    lng: 23.7295,
    venueName: "Plaka taverna",
  },
  {
    id: "ath-06",
    cityId: "athens",
    kind: "spot",
    lens: "see",
    title: "Lycabettus night lights",
    thumb:
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/athens-lycabettus-dummy",
    lat: 37.9795,
    lng: 23.743,
    venueName: "Mount Lycabettus",
  },
  {
    id: "ath-07",
    cityId: "athens",
    kind: "spot",
    lens: "do",
    title: "Anafiotika alley wander",
    thumb:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/athens-anafiotika-dummy",
    lat: 37.9725,
    lng: 23.7278,
    venueName: "Anafiotika",
  },
  {
    id: "ath-08",
    cityId: "athens",
    kind: "spot",
    lens: "do",
    title: "Monastiraki flea browse",
    thumb:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/athens-monastiraki-dummy",
    lat: 37.9761,
    lng: 23.7257,
    venueName: "Monastiraki Square",
  },
  {
    id: "ath-09",
    cityId: "athens",
    kind: "spot",
    lens: "stay",
    title: "Rooftop near Acropolis",
    thumb:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/athens-rooftop-dummy",
    lat: 37.9708,
    lng: 23.7265,
    venueName: "Acropolis view stay",
  },
  {
    id: "ath-03",
    cityId: "athens",
    kind: "tip",
    lens: null,
    title: "Metro day pass beats taxis",
    thumb:
      "https://images.unsplash.com/photo-1544620341-11cbdc6839cc?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/athens-metro-tip-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "ath-04",
    cityId: "athens",
    kind: "unsorted",
    lens: null,
    title: "Hidden courtyard cafe clip",
    thumb:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/athens-unsorted-cafe-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "lis-01",
    cityId: "lisbon",
    kind: "spot",
    lens: "eat",
    title: "Pastel de nata queue hack",
    thumb:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/lisbon-nata-dummy",
    lat: 38.6979,
    lng: -9.2034,
    venueName: "Belém bakery line",
  },
  {
    id: "lis-02",
    cityId: "lisbon",
    kind: "spot",
    lens: "see",
    title: "Tram 28 skip the crush",
    thumb:
      "https://images.unsplash.com/photo-1513735492246-483525079686?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/lisbon-tram28-dummy",
    lat: 38.7139,
    lng: -9.1334,
    venueName: "Tram 28 route",
  },
  {
    id: "lis-03",
    cityId: "lisbon",
    kind: "spot",
    lens: "do",
    title: "LX Factory Sunday stroll",
    thumb:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/lisbon-lx-dummy",
    lat: 38.7035,
    lng: -9.1785,
    venueName: "LX Factory",
  },
  {
    id: "lis-04",
    cityId: "lisbon",
    kind: "tip",
    lens: null,
    title: "Hills: wear real shoes",
    thumb:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/lisbon-shoes-tip-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "lis-05",
    cityId: "lisbon",
    kind: "unsorted",
    lens: null,
    title: "Rooftop wine at golden hour",
    thumb:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/lisbon-unsorted-rooftop-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "tok-01",
    cityId: "tokyo",
    kind: "spot",
    lens: "eat",
    title: "Conveyor sushi near Shibuya",
    thumb:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/tokyo-sushi-dummy",
    lat: 35.6595,
    lng: 139.7004,
    venueName: "Shibuya sushi chain",
  },
  {
    id: "tok-02",
    cityId: "tokyo",
    kind: "spot",
    lens: "see",
    title: "TeamLab night slots",
    thumb:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/tokyo-teamlab-dummy",
    lat: 35.6496,
    lng: 139.7884,
    venueName: "teamLab Planets",
  },
  {
    id: "tok-03",
    cityId: "tokyo",
    kind: "tip",
    lens: null,
    title: "IC card before anything else",
    thumb:
      "https://images.unsplash.com/photo-1544620341-11cbdc6839cc?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/tokyo-ic-card-tip-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "tok-04",
    cityId: "tokyo",
    kind: "spot",
    lens: "stay",
    title: "Capsule near Shinjuku station",
    thumb:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/tokyo-capsule-dummy",
    lat: 35.6938,
    lng: 139.7034,
    venueName: "Shinjuku capsule hotel",
  },
  {
    id: "tok-05",
    cityId: "tokyo",
    kind: "unsorted",
    lens: null,
    title: "Alley ramen steam clip",
    thumb:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/tokyo-unsorted-ramen-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "nyc-01",
    cityId: "new-york",
    kind: "spot",
    lens: "eat",
    title: "Late slice in the East Village",
    thumb:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/nyc-pizza-dummy",
    lat: 40.7265,
    lng: -73.9815,
    venueName: "East Village slice shop",
  },
  {
    id: "nyc-02",
    cityId: "new-york",
    kind: "spot",
    lens: "see",
    title: "Brooklyn Bridge walk at dusk",
    thumb:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/nyc-bridge-dummy",
    lat: 40.7061,
    lng: -73.9969,
    venueName: "Brooklyn Bridge",
  },
  {
    id: "nyc-03",
    cityId: "new-york",
    kind: "tip",
    lens: null,
    title: "MetroCard before midtown chaos",
    thumb:
      "https://images.unsplash.com/photo-1544620341-11cbdc6839cc?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/nyc-metro-tip-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "mex-01",
    cityId: "mexico-city",
    kind: "spot",
    lens: "eat",
    title: "Tacos al pastor after midnight",
    thumb:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/mex-tacos-dummy",
    lat: 19.4326,
    lng: -99.1332,
    venueName: "Centro taco stand",
  },
  {
    id: "mex-02",
    cityId: "mexico-city",
    kind: "spot",
    lens: "see",
    title: "Sunrise over Teotihuacan",
    thumb:
      "https://images.unsplash.com/photo-1518659526054-0335ecb0b0e0?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/mex-teotihuacan-dummy",
    lat: 19.6925,
    lng: -98.8438,
    venueName: "Teotihuacan",
  },
  {
    id: "mex-03",
    cityId: "mexico-city",
    kind: "tip",
    lens: null,
    title: "Altitude hits harder than you think",
    thumb:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/mex-altitude-tip-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "bkk-01",
    cityId: "bangkok",
    kind: "spot",
    lens: "eat",
    title: "Boat noodles by the canal",
    thumb:
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/bkk-noodles-dummy",
    lat: 13.7563,
    lng: 100.5018,
    venueName: "Khlong boat noodle stall",
  },
  {
    id: "bkk-02",
    cityId: "bangkok",
    kind: "spot",
    lens: "do",
    title: "Dawn at Wat Arun",
    thumb:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/bkk-watarun-dummy",
    lat: 13.7437,
    lng: 100.4888,
    venueName: "Wat Arun",
  },
  {
    id: "bkk-03",
    cityId: "bangkok",
    kind: "tip",
    lens: null,
    title: "Grab beats taxis in the rain",
    thumb:
      "https://images.unsplash.com/photo-1544620341-11cbdc6839cc?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/bkk-grab-tip-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "cpt-01",
    cityId: "cape-town",
    kind: "spot",
    lens: "see",
    title: "Table Mountain cable wait",
    thumb:
      "https://images.unsplash.com/photo-1580060839134-75a5ed44e17b?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/cpt-table-dummy",
    lat: -33.9628,
    lng: 18.4098,
    venueName: "Table Mountain",
  },
  {
    id: "cpt-02",
    cityId: "cape-town",
    kind: "spot",
    lens: "eat",
    title: "Seafood on the Waterfront",
    thumb:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/cpt-seafood-dummy",
    lat: -33.9036,
    lng: 18.4207,
    venueName: "V&A Waterfront",
  },
  {
    id: "cpt-03",
    cityId: "cape-town",
    kind: "tip",
    lens: null,
    title: "Wind can cancel the cable car",
    thumb:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/cpt-wind-tip-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
  {
    id: "syd-01",
    cityId: "sydney",
    kind: "spot",
    lens: "see",
    title: "Opera House from Mrs Macquarie",
    thumb:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/syd-opera-dummy",
    lat: -33.8601,
    lng: 151.233,
    venueName: "Mrs Macquarie's Chair",
  },
  {
    id: "syd-02",
    cityId: "sydney",
    kind: "spot",
    lens: "do",
    title: "Bondi to Coogee coastal walk",
    thumb:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    source: "tiktok",
    reelUrl: "https://example.com/short/syd-bondi-dummy",
    lat: -33.8915,
    lng: 151.2767,
    venueName: "Bondi Beach",
  },
  {
    id: "syd-03",
    cityId: "sydney",
    kind: "tip",
    lens: null,
    title: "Opal card before the ferry",
    thumb:
      "https://images.unsplash.com/photo-1544620341-11cbdc6839cc?w=600&q=80",
    source: "instagram",
    reelUrl: "https://example.com/reel/syd-opal-tip-dummy",
    lat: null,
    lng: null,
    venueName: null,
  },
]

export function savesFor(cityId: string) {
  return saves.filter((s) => s.cityId === cityId)
}

export function countsFor(cityId: string) {
  const list = savesFor(cityId)
  return {
    spots: list.filter((s) => s.kind === "spot").length,
    tips: list.filter((s) => s.kind === "tip").length,
    unsorted: list.filter((s) => s.kind === "unsorted").length,
  }
}

export function spotsFor(cityId: string) {
  return savesFor(cityId).filter((s) => s.kind === "spot")
}

export function tipsFor(cityId: string) {
  return savesFor(cityId).filter((s) => s.kind === "tip")
}

export function unsortedFor(cityId: string) {
  return savesFor(cityId).filter((s) => s.kind === "unsorted")
}

export function cityById(cityId: string) {
  return cities.find((c) => c.id === cityId) ?? cities[0]
}

/** Leaflet pin sets shared across mock directions */
export const cityMapPins = cities.map((c) => ({
  id: c.id,
  name: c.name,
  lat: c.lat,
  lng: c.lng,
}))

export function spotPinsFor(
  cityId: string,
  activeId?: string,
  list: Save[] = spotsFor(cityId)
) {
  return list
    .filter((s) => s.lat != null && s.lng != null)
    .map((s, i) => ({
      id: s.id,
      name: s.title,
      lat: s.lat as number,
      lng: s.lng as number,
      active: activeId ? s.id === activeId : i === 0,
      marker: "label" as const,
    }))
}

export const athens = cities[0]
export const athensSaves = savesFor("athens")
export const athensSpots = spotsFor("athens")
export const athensTips = tipsFor("athens")
export const athensUnsorted = unsortedFor("athens")

export const athensSpotMapPins = spotPinsFor("athens")
