import { NextResponse } from 'next/server'

type StoreShot = {
  src: string
  source: 'App Store' | 'Google Play'
  title: string
}

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.moonlight.dirtybirdy&hl=tr&pli=1'
const APP_STORE_SHARE_URL = 'https://share.google/U7h89HcJizfiUYHlt'

const fallback: StoreShot[] = [
  { src: 'https://placehold.co/720x1280/ffbb00/1a0f00?text=DIRTY+BIRDY%21', source: 'Google Play', title: 'Dirty Birdy!' },
  { src: 'https://placehold.co/720x1280/00eaff/03121a?text=CHAOS+COMBO', source: 'Google Play', title: 'Dirty Birdy!' },
  { src: 'https://placehold.co/720x1280/ff4d8d/1b0610?text=BIRD+STORM', source: 'App Store', title: 'Dirty Birdy!' },
  { src: 'https://placehold.co/720x1280/7cff6b/041500?text=MISSION+RUN', source: 'App Store', title: 'Dirty Birdy!' },
]

function cleanUrl(raw: string) {
  return raw
    .replace(/\\u003d/g, '=')
    .replace(/\\u0026/g, '&')
    .replace(/\\/g, '')
}

function unique(items: StoreShot[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (!item.src || seen.has(item.src)) return false
    seen.add(item.src)
    return true
  })
}

async function googlePlayShots(): Promise<StoreShot[]> {
  const res = await fetch(PLAY_URL, {
    next: { revalidate: 60 * 60 * 3 },
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
      accept: 'text/html,application/xhtml+xml',
    },
  })
  if (!res.ok) return []
  const html = await res.text()
  const urls = [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/[A-Za-z0-9_\-=./%]+/g)]
    .map((match) => cleanUrl(match[0]))
    .filter((url) => !url.includes('=w48') && !url.includes('=s48'))
  return unique(urls.map((src) => ({ src, source: 'Google Play' as const, title: 'Dirty Birdy!' }))).slice(0, 12)
}

async function appStoreShots(): Promise<StoreShot[]> {
  const terms = ['Dirty Birdy MoonLight', 'Dirty Birdy com.moonlight.dirtybirdy', 'Dirty Birdy game']
  const all: StoreShot[] = []

  for (const term of terms) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&media=software&limit=8`
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 } })
    if (!res.ok) continue
    const data = await res.json()
    for (const app of data.results || []) {
      const name = String(app.trackName || '')
      const bundle = String(app.bundleId || '')
      if (!/dirty|birdy|moonlight/i.test(`${name} ${bundle}`)) continue
      const shots = [...(app.screenshotUrls || []), ...(app.ipadScreenshotUrls || [])]
      for (const src of shots) all.push({ src, source: 'App Store', title: name || 'Dirty Birdy!' })
    }
  }

  // Kept for the share link you provided; if it resolves to a public Apple page, images can be detected here too.
  try {
    const res = await fetch(APP_STORE_SHARE_URL, { next: { revalidate: 60 * 60 * 6 }, redirect: 'follow' })
    if (res.ok) {
      const html = await res.text()
      const urls = [...html.matchAll(/https:\/\/[^"' ]+mzstatic\.com[^"' ]+/g)].map((m) => cleanUrl(m[0]))
      for (const src of urls) all.push({ src, source: 'App Store', title: 'Dirty Birdy!' })
    }
  } catch {}

  return unique(all).slice(0, 12)
}

export async function GET() {
  try {
    const [play, apple] = await Promise.allSettled([googlePlayShots(), appStoreShots()])
    const images = unique([
      ...(play.status === 'fulfilled' ? play.value : []),
      ...(apple.status === 'fulfilled' ? apple.value : []),
    ]).slice(0, 18)

    return NextResponse.json({
      images: images.length ? images : fallback,
      live: images.length > 0,
      links: {
        googlePlay: PLAY_URL,
        appStoreShare: APP_STORE_SHARE_URL,
      },
    })
  } catch {
    return NextResponse.json({ images: fallback, live: false, links: { googlePlay: PLAY_URL, appStoreShare: APP_STORE_SHARE_URL } })
  }
}
