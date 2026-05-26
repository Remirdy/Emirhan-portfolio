import { NextResponse } from 'next/server'

type StoreShot = {
  src: string
  source: 'App Store' | 'Google Play'
  title: string
}

const fallback: StoreShot[] = [
  { src: 'https://placehold.co/720x1280/ffb800/1a0f00?text=Dirty+Birdy%21', source: 'App Store', title: 'Dirty Birdy!' },
  { src: 'https://placehold.co/720x1280/36d399/02110a?text=Chaos+Mode', source: 'Google Play', title: 'Dirty Birdy!' },
  { src: 'https://placehold.co/720x1280/60a5fa/020617?text=Arcade+HUD', source: 'App Store', title: 'Dirty Birdy!' },
]

function unique(items: StoreShot[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (!item.src || seen.has(item.src)) return false
    seen.add(item.src)
    return true
  })
}

async function appleShots(): Promise<StoreShot[]> {
  const url = 'https://itunes.apple.com/search?term=Dirty%20Birdy&entity=software&media=software&limit=8'
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 } })
  if (!res.ok) return []
  const data = await res.json()
  return (data.results || []).flatMap((app: any) => {
    const title = app.trackName || 'Dirty Birdy!'
    const shots = [...(app.screenshotUrls || []), ...(app.ipadScreenshotUrls || [])]
    return shots.map((src: string) => ({ src, source: 'App Store' as const, title }))
  })
}

async function playShots(): Promise<StoreShot[]> {
  const url = 'https://play.google.com/store/search?q=Dirty%20Birdy&c=apps&hl=en&gl=US'
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 }, headers: { 'user-agent': 'Mozilla/5.0' } })
  if (!res.ok) return []
  const html = await res.text()
  const matches = [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/[A-Za-z0-9_\-=./]+/g)]
  return matches.slice(0, 12).map((match) => ({ src: match[0].replace(/\\u003d/g, '='), source: 'Google Play' as const, title: 'Dirty Birdy!' }))
}

export async function GET() {
  try {
    const [apple, play] = await Promise.allSettled([appleShots(), playShots()])
    const data = unique([
      ...(apple.status === 'fulfilled' ? apple.value : []),
      ...(play.status === 'fulfilled' ? play.value : []),
    ]).slice(0, 14)

    return NextResponse.json({ images: data.length ? data : fallback, live: data.length > 0 })
  } catch {
    return NextResponse.json({ images: fallback, live: false })
  }
}
