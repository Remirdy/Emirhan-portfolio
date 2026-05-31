import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import MotionGallery, { type MotionItem } from '@/components/motion/MotionGallery'

export const metadata: Metadata = {
  title: 'Motion Reel | Emirhan Doygun',
  description: 'Motion graphics & image-to-motion showreel — animated PSD work, AI motion enhancement and cinematic visual production.',
}

// Always read the folder fresh so newly uploaded files appear without a rebuild.
export const dynamic = 'force-dynamic'

const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i
const IMAGE_RE = /\.(jpg|jpeg|png|webp|gif|avif)$/i

function build(file: string, fallbackIndex: number): MotionItem {
  const isVideo = VIDEO_RE.test(file)
  const re = isVideo ? VIDEO_RE : IMAGE_RE
  const base = file.replace(re, '')
  const num = (file.match(/(\d+)/) || [])[1]

  return {
    file,
    src: `/motion/${encodeURIComponent(file)}`,
    name: base.replace(/[_-]+/g, ' ').trim(),
    index: num ? parseInt(num, 10) : Number.MAX_SAFE_INTEGER - fallbackIndex,
    type: isVideo ? 'video' : 'image',
  }
}

function getMedia(): { videos: MotionItem[]; images: MotionItem[] } {
  const dir = path.join(process.cwd(), 'public', 'motion')
  let files: string[] = []
  try { files = fs.readdirSync(dir) } catch { return { videos: [], images: [] } }

  const sortFn = (a: MotionItem, b: MotionItem) => a.index - b.index || a.file.localeCompare(b.file)

  const videos = files
    .filter((f) => VIDEO_RE.test(f))
    .map((f, i) => {
      const item = build(f, i)
      const base = f.replace(VIDEO_RE, '')
      // Still search for a poster if we need it
      const poster = files.find((p) => IMAGE_RE.test(p) && p.replace(IMAGE_RE, '') === base)
      return poster ? { ...item, poster: `/motion/${encodeURIComponent(poster)}` } : item
    })
    .sort(sortFn)

  const images = files
    .filter((f) => IMAGE_RE.test(f))
    .map((f, i) => build(f, i))
    .sort(sortFn)

  return { videos, images }
}

export default function MotionPage() {
  const { videos, images } = getMedia()
  return <MotionGallery videos={videos} images={images} />
}
