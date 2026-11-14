import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import s from '@/components/portfolio/MotionExperience.module.css'

export const metadata: Metadata = {
  title: 'Motion Design — Emirhan Doygun',
  description: 'Motion design experience at Metraj Production: animating prepared layered PSD files, timing, parallax, camera movement and transitions.',
}

export default function MotionPage() {
  return <main className={s.page}>
    <Link className={s.back} href="/#work"><ArrowLeft size={15} /> Back to projects</Link>
    <header className={s.header}><span>EXPERIENCE / METRAJ PRODUCTION</span><h1>Motion<br /><em>design.</em></h1><p>I worked on animating prepared visual designs for agency production.</p></header>
    <div className={s.content}><section><span>MY ROLE</span><h2>From layered artwork<br />to a finished animation.</h2><p>At Metraj Production, I animated existing Photoshop layouts. The original visual designs were supplied by the agency; I was responsible for their animation.</p><p>The work involved planning how layers enter and leave the frame, setting the pace of a sequence, adding depth, and keeping the composition readable throughout the animation.</p></section>
      <section className={s.tasks}><div><span>01</span><h3>Layer animation</h3><p>Separating visual elements into clear sequences and animating position, scale, opacity, and timing.</p></div><div><span>02</span><h3>Depth & camera movement</h3><p>Using parallax and camera movement to give static layouts a sense of depth.</p></div><div><span>03</span><h3>Transitions & refinement</h3><p>Adjusting easing, transitions, and pacing through production feedback and revisions.</p></div><div><span>04</span><h3>Production delivery</h3><p>Preparing motion outputs with attention to legibility, visual continuity, and the intended format.</p></div></section>
      <section className={s.tools}><span>TOOLS</span><p>Adobe After Effects · Adobe Photoshop</p></section>
    </div>
    <a className={s.contact} href="mailto:e_doygun@icloud.com">Discuss a motion project <ArrowUpRight size={18} /></a>
  </main>
}
