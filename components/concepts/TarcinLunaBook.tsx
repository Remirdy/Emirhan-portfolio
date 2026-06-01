'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import s from './TarcinLunaBook.module.css'

type GalleryPage = {
  img: string
  src?: string
  title: string
  sub: string
  glow?: string
}

type RawGalleryPage = Omit<GalleryPage, 'img'> & {
  img?: string
}

type GalleryCategory = {
  slug: string
  title: string
  images: RawGalleryPage[]
}

type NormalizedGalleryCategory = Omit<GalleryCategory, 'images'> & {
  images: GalleryPage[]
}

const FALLBACK_CATEGORIES: GalleryCategory[] = [
  {
    slug: 'tarcin-luna',
    title: 'Tarçın & Luna',
    images: [
      { img: '/tarcin-luna/1.png', title: 'Tarçın & Luna', sub: '1. PNG artwork', glow: '#f6a54c' },
      { img: '/tarcin-luna/2.png', title: 'Tarçın & Luna', sub: '2. PNG artwork', glow: '#d8753c' },
      { img: '/tarcin-luna/3.png', title: 'Tarçın & Luna', sub: '3. PNG artwork', glow: '#2a4a9a' },
      { img: '/tarcin-luna/4.png', title: 'Tarçın & Luna', sub: '4. PNG artwork', glow: '#1a5a50' },
      { img: '/tarcin-luna/5.png', title: 'Tarçın & Luna', sub: '5. PNG artwork', glow: '#3a2a7a' },
    ],
  },
]

const GLOW_COLORS = ['#f6a54c', '#d8753c', '#2a4a9a', '#1a5a50', '#3a2a7a', '#4c7c9f', '#8b5fbd', '#d2a14a']

interface FlipState {
  from: number
  to: number
  dir: 'next' | 'prev'
}

function normalizeCategory(category: GalleryCategory): NormalizedGalleryCategory {
  return {
    ...category,
    images: category.images
      .map((page, index) => ({
        ...page,
        img: page.img ?? page.src,
        glow: page.glow ?? GLOW_COLORS[index % GLOW_COLORS.length],
      }))
      .filter((page): page is GalleryPage => Boolean(page.img)),
  }
}

function PageFlipper({ flip, pages, onDone }: { flip: FlipState; pages: GalleryPage[]; onDone: () => void }) {
  const rotY = useMotionValue(flip.dir === 'next' ? 0 : -180)

  const shadowOp = useTransform(rotY, [-180, -90, 0], [0, 0.6, 0])

  useEffect(() => {
    let alive = true
    const target = flip.dir === 'next' ? -180 : 0
    const anim = animate(rotY, target, {
      duration: 0.85,
      ease: [0.42, 0, 0.2, 1],
    })
    anim.then(() => { if (alive) onDone() })
    return () => { alive = false; anim.stop() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const frontPage = pages[flip.dir === 'next' ? flip.from : flip.to]
  const backPage  = pages[flip.dir === 'next' ? flip.to   : flip.from]

  return (
    <motion.div
      className={s.leaf}
      style={{ rotateY: rotY, transformStyle: 'preserve-3d' }}
    >
      {/* Front face */}
      <div className={s.leafFront}>
        <img src={frontPage.img} alt="" className={s.pageImg} draggable={false} />
        <motion.div className={s.leafShadow} style={{ opacity: shadowOp }} />
      </div>
      {/* Back face */}
      <div className={s.leafBack}>
        <img src={backPage.img} alt="" className={s.pageImg} draggable={false} />
        <motion.div className={s.leafShadow} style={{ opacity: shadowOp }} />
      </div>
    </motion.div>
  )
}

export default function TarcinLunaBook() {
  const [categories, setCategories] = useState<NormalizedGalleryCategory[]>(FALLBACK_CATEGORIES.map(normalizeCategory))
  const [selectedSlug, setSelectedSlug] = useState(FALLBACK_CATEGORIES[0].slug)
  const [current, setCurrent] = useState(0)
  const [flip, setFlip] = useState<FlipState | null>(null)

  useEffect(() => {
    let alive = true

    fetch('/api/concept-galleries')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { categories?: GalleryCategory[] } | null) => {
        if (!alive || !data?.categories?.length) return
        const nextCategories = data.categories.map(normalizeCategory)
        setCategories(nextCategories)
        setSelectedSlug((slug) => nextCategories.some((category) => category.slug === slug) ? slug : nextCategories[0].slug)
      })
      .catch(() => {})

    return () => { alive = false }
  }, [])

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === selectedSlug) ?? categories[0],
    [categories, selectedSlug],
  )
  const pages = activeCategory.images

  const go = useCallback(
    (dir: 'next' | 'prev') => {
      if (flip) return
      const next = dir === 'next' ? current + 1 : current - 1
      if (next < 0 || next >= pages.length) return
      setFlip({ from: current, to: next, dir })
    },
    [current, flip, pages.length],
  )

  const onDone = useCallback(() => {
    setFlip(prev => {
      if (prev) setCurrent(prev.to)
      return null
    })
  }, [])

  const bgPage = flip ? flip.to : current
  const readCount      = current
  const remainingCount = pages.length - 1 - current
  const currentPage = pages[current] ?? pages[0]

  useEffect(() => {
    setFlip(null)
    setCurrent(0)
  }, [activeCategory.slug])

  return (
    <div className={s.wrap}>
      {/* Ambient glow that matches the current page */}
      <div
        className={s.glow}
        style={{ background: `radial-gradient(ellipse at 50% 65%, ${currentPage.glow}55 0%, transparent 68%)` }}
      />

      {/* Drop shadow under the book */}
      <div className={s.bookShadow} />

      {/* ── Book ─────────────────────────────────── */}
      <div className={s.book}>
        {/* Already-read pages stack (left of spine) */}
        <div className={s.leftStack} aria-hidden>
          {Array.from({ length: Math.min(readCount, 7) }).map((_, i) => (
            <div key={i} className={s.stackSlice} style={{ opacity: 0.9 - i * 0.1 }} />
          ))}
        </div>

        {/* Spine */}
        <div className={s.spine} />

        {/* Page area */}
        <div className={s.pageArea}>
          {/* Background image (target/current) */}
          <img
            key={`bg-${bgPage}`}
            src={pages[bgPage].img}
            alt={pages[bgPage].title}
            className={s.pageImg}
            draggable={false}
          />

          {/* Animated flip leaf */}
          {flip && (
            <PageFlipper
              key={`flip-${flip.from}-${flip.to}`}
              flip={flip}
              pages={pages}
              onDone={onDone}
            />
          )}

          {/* Caption overlay */}
          <div className={s.caption}>
            <strong>{currentPage.title}</strong>
            <span>{activeCategory.title} / {currentPage.sub}</span>
          </div>

          {/* Page number */}
          <div className={s.pageNum}>{current + 1}<em>/{pages.length}</em></div>

          {/* Corner curl hint */}
          {!flip && current < pages.length - 1 && (
            <button className={s.curlHint} onClick={() => go('next')} aria-label="Next page" />
          )}
        </div>

        {/* Remaining pages stack (right of page area) */}
        <div className={s.rightStack} aria-hidden>
          {Array.from({ length: Math.min(remainingCount, 7) }).map((_, i) => (
            <div key={i} className={s.stackSlice} style={{ opacity: 0.9 - i * 0.1 }} />
          ))}
        </div>
      </div>

      {categories.length > 1 && (
        <div className={s.categoryTabs} role="tablist" aria-label="Book categories">
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              role="tab"
              aria-selected={category.slug === activeCategory.slug}
              className={`${s.categoryBtn} ${category.slug === activeCategory.slug ? s.categoryBtnActive : ''}`}
              onClick={() => {
                if (category.slug === activeCategory.slug) return
                setSelectedSlug(category.slug)
              }}
            >
              {category.title}
            </button>
          ))}
        </div>
      )}

      {/* ── Navigation ───────────────────────────── */}
      <div className={s.nav}>
        <button
          className={s.navBtn}
          onClick={() => go('prev')}
          disabled={current === 0 || !!flip}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className={s.dots} role="tablist">
          {pages.map((p, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              className={`${s.dot} ${i === current ? s.dotActive : ''}`}
              onClick={() => {
                if (flip || i === current) return
                const dir = i > current ? 'next' : 'prev'
                setFlip({ from: current, to: i, dir })
              }}
              aria-label={`${p.title}`}
            />
          ))}
        </div>

        <button
          className={s.navBtn}
          onClick={() => go('next')}
          disabled={current === pages.length - 1 || !!flip}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Decorative sparkles */}
      <div className={s.sparkles} aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <i key={i} className={s.spark} style={{ '--si': i } as React.CSSProperties} />
        ))}
      </div>
    </div>
  )
}
