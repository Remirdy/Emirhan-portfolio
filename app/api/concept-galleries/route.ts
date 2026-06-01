import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

type GalleryImage = {
  src: string
  title: string
  sub: string
}

type GalleryCategory = {
  slug: string
  title: string
  images: GalleryImage[]
}

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const GALLERY_DIR = path.join(PUBLIC_DIR, 'concept-galleries')

const LEGACY_CATEGORIES = [
  {
    slug: 'tarcin-luna',
    title: 'Tarcin & Luna',
    dir: path.join(PUBLIC_DIR, 'tarcin-luna'),
    urlBase: '/tarcin-luna',
  },
]

function titleFromSlug(slug: string) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function imageTitle(file: string, index: number) {
  const name = file.replace(/\.png$/i, '').replace(/^\d+[-_ ]?/, '')
  return name ? titleFromSlug(name) : `Page ${index + 1}`
}

async function readPngImages(dir: string, urlBase: string): Promise<GalleryImage[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map((file, index) => ({
        src: `${urlBase}/${encodeURIComponent(file)}`,
        title: imageTitle(file, index),
        sub: `${index + 1}. PNG artwork`,
      }))
  } catch {
    return []
  }
}

async function readConfiguredCategories() {
  const categories = await Promise.all(
    LEGACY_CATEGORIES.map(async (category) => ({
      slug: category.slug,
      title: category.title,
      images: await readPngImages(category.dir, category.urlBase),
    })),
  )

  return categories.filter((category) => category.images.length > 0)
}

async function readFolderCategories() {
  try {
    const entries = await readdir(GALLERY_DIR, { withFileTypes: true })
    const directories = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))

    const categories = await Promise.all(
      directories.map(async (entry) => {
        const slug = entry.name
        const images = await readPngImages(path.join(GALLERY_DIR, slug), `/concept-galleries/${encodeURIComponent(slug)}`)
        return {
          slug,
          title: titleFromSlug(slug),
          images,
        }
      }),
    )

    return categories.filter((category) => category.images.length > 0)
  } catch {
    return []
  }
}

export async function GET() {
  const [configured, folders] = await Promise.all([readConfiguredCategories(), readFolderCategories()])
  const seen = new Set<string>()
  const categories: GalleryCategory[] = []

  for (const category of [...configured, ...folders]) {
    if (seen.has(category.slug)) continue
    seen.add(category.slug)
    categories.push(category)
  }

  return NextResponse.json({ categories })
}
