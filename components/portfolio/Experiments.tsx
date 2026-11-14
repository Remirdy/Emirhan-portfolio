'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUpRight, Plus, X } from 'lucide-react'
import s from './Portfolio.module.css'

const ImageForge = dynamic(() => import('@/components/arcade/ImageForge'), { loading: () => <p className={s.loading}>Loading image tool…</p> })
const BookConcepts = dynamic(() => import('@/components/concepts/BookConcepts'), { loading: () => <p className={s.loading}>Loading concepts…</p> })

export default function Experiments() {
  const [tool, setTool] = useState<'images' | 'books' | null>(null)
  return <section className={s.experiments} id="playground">
    <div className={s.sectionLabel}><span>03 / INTERACTIVE PROJECTS</span><span>TOOLS & EXPERIMENTS</span></div>
    <div className={s.experimentIntro} data-reveal><h2>Explore<br /><em>further.</em></h2><p>Playable prototypes, practical tools,<br />and visual concept studies.</p></div>
    <div className={s.experimentLinks}>
      <a href="/play"><span>01</span><div><h3>Donut Tycoon</h3><p>An interactive 3D bakery simulation.</p></div><span className={s.expType}>BROWSER GAME</span><ArrowUpRight /></a>
      <button id="imageforge" aria-expanded={tool === 'images'} aria-controls="experiment-panel" onClick={() => setTool(tool === 'images' ? null : 'images')}><span>02</span><div><h3>ImageForge</h3><p>Browser-based image resizing and PNG export.</p></div><span className={s.expType}>IMAGE TOOL</span>{tool === 'images' ? <X /> : <Plus />}</button>
      <button id="concepts" aria-expanded={tool === 'books'} aria-controls="experiment-panel" onClick={() => setTool(tool === 'books' ? null : 'books')}><span>03</span><div><h3>Visual concepts</h3><p>Character development and children’s book studies.</p></div><span className={s.expType}>CONCEPT DESIGN</span>{tool === 'books' ? <X /> : <Plus />}</button>
    </div>
    <div id="experiment-panel" className={tool ? s.experimentPanel : ''}>
      {tool === 'images' ? <ImageForge /> : tool === 'books' ? <BookConcepts /> : null}
    </div>
  </section>
}
