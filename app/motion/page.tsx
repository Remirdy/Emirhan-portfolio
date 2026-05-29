import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import MotionGallery, { type MotionItem } from '@/components/motion/MotionGallery'

export const metadata: Metadata = {
  title: 'Motion Reel | Emirhan Doygun',
  description: 'Motion graphics & image-to-motion showreel — animated PSD work, AI motion enhancement and cinematic visual production.',
}

// Always read the folder fresh so newly uploaded videos appear without a rebuild.
export const dynamic = 'force-dynamic'

const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i
const POSTER_RE = /\.(jpg|jpeg|png|webp)$/i

function getItems(): MotionItem[] {
  const dir = path.join(process.cwd(), 'public', 'motion')
  let files: string[] = []
  try { files = fs.readdirSync(dir) } catch { return [] }

  const posters = new Set(files.filter((f) => POSTER_RE.test(f)).map((f) => f.replace(POSTER_RE, '')))

  return files
    .filter((f) => VIDEO_RE.test(f))
    .map((f) => {
      const base = f.replace(VIDEO_RE, '')
      const num = (f.match(/(\d+)/) || [])[1]
      return {
        file: f,
        src: `/motion/${encodeURIComponent(f)}`,
        name: base.replace(/[_-]+/g, ' ').trim(),
        index: num ? parseInt(num, 10) : Number.MAX_SAFE_INTEGER,
        poster: posters.has(base) ? `/motion/${encodeURIComponent(base)}.jpg` : undefined,
      }
    })
    .sort((a, b) => a.index - b.index || a.file.localeCompare(b.file))
}

export default function MotionPage() {
  const items = getItems()
  return <MotionGallery items={items} />
}
