'use client'

import { useEffect, useRef, useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Image as ImageIcon, Play, X } from 'lucide-react'
import s from './MotionGallery.module.css'

export type MotionItem = {
  file: string
  src: string
  name: string
  index: number
  type: 'video' | 'image'
}

function MediaDialog({ item, position, count, onClose, onMove }: { item: MotionItem; position: number; count: number; onClose: () => void; onMove: (direction: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    closeButton.current?.focus()
    return () => { element?.close() }
  }, [])

  return <dialog ref={dialog} className={s.dialog} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }} onKeyDown={event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); onMove(-1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); onMove(1) }
  }} aria-label={`${item.type === 'video' ? 'Motion' : 'Image'} preview: ${item.name}`}>
    <div className={s.dialogInner}>
      <div className={s.dialogTop}><span>{String(position + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span><span>{item.name}</span><button ref={closeButton} onClick={onClose} aria-label="Close preview"><X size={23} /></button></div>
      <div className={s.preview}>
        {item.type === 'video' ? <video key={item.src} src={item.src} controls playsInline autoPlay /> : <img src={item.src} alt={item.name} />}
      </div>
      {count > 1 ? <div className={s.dialogNav}><button onClick={() => onMove(-1)}><ChevronLeft size={17} /> Previous</button><span>ARROW KEYS TO NAVIGATE · ESC TO CLOSE</span><button onClick={() => onMove(1)}>Next <ChevronRight size={17} /></button></div> : null}
    </div>
  </dialog>
}

export default function MotionGallery({ videos, images }: { videos: MotionItem[]; images: MotionItem[] }) {
  const [category, setCategory] = useState<'video' | 'image'>(videos.length ? 'video' : 'image')
  const [open, setOpen] = useState<number | null>(null)
  const media = category === 'video' ? videos : images

  return <MotionConfig reducedMotion="user"><main className={s.page}>
    <a href="/#work" className={s.back}><ArrowLeft size={15} /> Back to selected work</a>
    <div className={s.eyebrow}><span>VISUAL PRODUCTION</span><span>EMIRHAN DOYGUN</span></div>
    <header className={s.intro}><h1>Motion<br /><em>& imagery.</em></h1><div><p>Selected animation and visual work.</p><p>My production work includes animating prepared PSD designs, layer timing, parallax, and compositing.</p></div></header>
    <div className={s.tabs} role="tablist" aria-label="Media category">
      {(['video', 'image'] as const).map(type => <button key={type} id={`media-tab-${type}`} role="tab" aria-selected={category === type} aria-controls="media-panel" tabIndex={category === type ? 0 : -1} onClick={() => setCategory(type)} onKeyDown={event => {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault()
          const next = event.key === 'Home' ? 'video' : event.key === 'End' ? 'image' : type === 'video' ? 'image' : 'video'
          setCategory(next)
          document.getElementById(`media-tab-${next}`)?.focus()
        }
      }}>{type === 'video' ? 'Motion' : 'Images'} <span>{String(type === 'video' ? videos.length : images.length).padStart(2, '0')}</span></button>)}
      <span>SELECT A PROJECT TO VIEW</span>
    </div>
    <section id="media-panel" role="tabpanel" aria-labelledby={`media-tab-${category}`} tabIndex={0} className={s.grid}>
      {media.map((item, index) => <motion.article key={item.src} initial={false} whileInView={{ opacity: 1 }} className={s.card}>
        <button className={s.mediaButton} onClick={() => setOpen(index)} aria-label={`Open ${item.name}`}>
          {item.type === 'video' ? <video src={`${item.src}#t=0.1`} preload="metadata" muted playsInline aria-hidden="true" /> : <img src={item.src} alt={item.name} loading="lazy" />}
          <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
          <span className={s.openIcon}>{item.type === 'video' ? <Play size={22} /> : <ImageIcon size={22} />}</span>
        </button>
        <div className={s.caption}><h2>{item.name}</h2><button onClick={() => setOpen(index)} aria-label={`View ${item.name}`}><ArrowUpRight size={19} /></button></div>
        <p>{item.type === 'video' ? 'Motion design / Animation' : 'Visual design / Image study'}</p>
      </motion.article>)}
      {!media.length ? <p className={s.empty}>No {category === 'video' ? 'motion work' : 'images'} in this collection yet.</p> : null}
    </section>
    <div className={s.end}><span>For projects & collaboration</span><a href="mailto:e_doygun@icloud.com">e_doygun@icloud.com <ArrowUpRight size={16} /></a></div>
    {open !== null && media[open] ? <MediaDialog item={media[open]} position={open} count={media.length} onClose={() => setOpen(null)} onMove={direction => setOpen(value => value === null ? null : (value + direction + media.length) % media.length)} /> : null}
  </main></MotionConfig>
}
