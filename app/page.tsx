'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  Aperture,
  ArrowRight,
  Brain,
  Clapperboard,
  Code2,
  ExternalLink,
  Gamepad2,
  Github,
  Layers3,
  MapPin,
  Monitor,
  Orbit,
  Rocket,
  Sparkles,
  Terminal,
  Trophy,
  Wand2,
  Zap,
} from 'lucide-react'

type StoreShot = { src: string; source: string; title: string }

const rise: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

const pop: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } },
}

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
}

const skills = [
  ['Unity Gameplay', Gamepad2, 'arcade feel + feedback'],
  ['C# Systems', Code2, 'clean logic + tools'],
  ['AI Visual Direction', Wand2, 'prompts + campaigns'],
  ['Motion Design', Clapperboard, 'edits + timing'],
  ['Game UI / HUD', Monitor, 'menus + stats'],
  ['Creative Tech', Brain, 'prototype culture'],
]

const projectCards = [
  ['Dirty Birdy!', 'Live store-powered case study', Gamepad2],
  ['ImageForge', 'Batch resize / crop / export lab', Layers3],
  ['AI Motion Ads', 'Cinematic prompt-driven ads', Sparkles],
  ['UI VFX Systems', 'Animated HUD and juice stack', Zap],
]

function Panel({ id, label, children, className = '' }: { id?: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section id={id} variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} className={`pdf-panel relative mb-8 rounded-[32px] p-5 sm:p-8 lg:p-12 ${className}`}>
      <span className="corner-tl" />
      <span className="corner-br" />
      <div className="relative z-10 mb-7 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.38em] text-cyan-200/75"><span className="h-px w-10 bg-cyan-300/60" />{label}</div>
      <div className="relative z-10">{children}</div>
    </motion.section>
  )
}

function HeroPlayground() {
  return (
    <motion.div variants={group} initial="hidden" animate="visible" className="relative min-h-[620px] overflow-hidden rounded-[38px] border border-cyan-200/20 bg-black/35 p-5 neon-border">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(0,234,255,.28),transparent_210px),radial-gradient(circle_at_20%_78%,rgba(255,190,40,.14),transparent_230px),radial-gradient(circle_at_60%_70%,rgba(124,60,255,.18),transparent_220px)]" />
      <motion.div variants={pop} animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} className="absolute right-10 top-10 h-60 w-60 rounded-full border-4 border-dashed border-cyan-300/40" />
      <motion.div variants={pop} animate={{ rotate: -360 }} transition={{ duration: 38, repeat: Infinity, ease: 'linear' }} className="absolute right-24 top-24 h-32 w-32 rounded-full border border-cyan-300/30" />
      <div className="absolute left-[-80px] top-64 h-1 w-[700px] -rotate-[21deg] rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_24px_#00eaff]" />
      <div className="absolute right-[-120px] top-80 h-1 w-[720px] -rotate-[21deg] rounded-full bg-gradient-to-r from-transparent via-amber-200/80 to-transparent shadow-[0_0_22px_rgba(255,214,80,.8)]" />

      <motion.div variants={pop} className="absolute left-6 top-8 w-64 rounded-3xl border border-cyan-200/20 bg-slate-950/70 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3 text-cyan-200"><Terminal /><span className="text-xs font-black tracking-[0.28em]">PLAYFUL OS</span></div>
        {['Game Feel', 'Cartoon Chaos', 'AI Visuals', 'Motion Timing'].map((x, i) => <div key={x} className="mb-3 rounded-2xl border border-white/10 bg-white/[.035] p-3"><div className="flex justify-between text-sm font-black"><span>{x}</span><span className="text-cyan-300">{92 - i * 7}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${92 - i * 7}%` }} transition={{ duration: 1.2, delay: .25 + i * .1 }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-200" /></div></div>)}
      </motion.div>

      <motion.div variants={pop} animate={{ y: [0, -16, 0], rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-14 left-20 grid h-48 w-40 place-items-center border border-cyan-200/25 bg-slate-900/85 text-6xl font-black clip-tech shadow-2xl">U</motion.div>
      <motion.div variants={pop} animate={{ y: [0, 14, 0], rotate: [3, -1, 3] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-8 right-14 grid h-60 w-48 place-items-center border border-amber-200/30 bg-slate-900/85 text-5xl font-black clip-tech shadow-2xl">C#</motion.div>
      <motion.div variants={pop} animate={{ x: [0, 10, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-40 right-44 w-64 rounded-3xl border border-cyan-200/20 bg-black/45 p-5 backdrop-blur-xl">
        <div className="mb-2 flex justify-between text-xs font-black text-white/55"><span>Chaos Meter</span><span className="text-amber-200">MAX</span></div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-300 via-amber-200 to-fuchsia-300" /></div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-black text-white/70"><span>GAME</span><span>AI</span><span>FUN</span></div>
      </motion.div>
    </motion.div>
  )
}

function DirtyBirdyLiveWall() {
  const [shots, setShots] = useState<StoreShot[]>([])
  const [live, setLive] = useState(false)

  useEffect(() => {
    fetch('/api/store')
      .then((r) => r.json())
      .then((d) => { setShots(d.images || []); setLive(Boolean(d.live)) })
      .catch(() => setShots([]))
  }, [])

  const looped = useMemo(() => [...shots, ...shots, ...shots].slice(0, 18), [shots])

  return (
    <div className="relative overflow-hidden rounded-[34px] border border-amber-200/20 bg-gradient-to-br from-amber-300/20 via-orange-950/40 to-black p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_82%,rgba(255,232,154,.25)_0_70px,transparent_72px),radial-gradient(circle_at_85%_18%,rgba(0,234,255,.18),transparent_190px)]" />
      <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
        <div><div className="text-xs font-black uppercase tracking-[0.32em] text-amber-100/80">Dirty Birdy Live Store Wall</div><div className="mt-1 text-sm text-white/55">{live ? 'App Store / Google Play kaynaklarından çekiliyor' : 'Store kaynağı bulunamazsa fallback posterleri gösteriliyor'}</div></div>
        <div className="rounded-full border border-cyan-200/20 bg-black/35 px-4 py-2 text-xs font-black text-cyan-200">{live ? 'LIVE' : 'FALLBACK'}</div>
      </div>
      <motion.div className="relative z-10 flex gap-4" animate={{ x: ['0%', '-45%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
        {looped.map((img, i) => <motion.div whileHover={{ y: -12, scale: 1.04 }} key={`${img.src}-${i}`} className="h-72 w-40 shrink-0 overflow-hidden rounded-[28px] border-[7px] border-black bg-slate-900 shadow-2xl"><img src={img.src} alt={img.title} className="h-full w-full object-cover" /><div className="-mt-10 mx-3 rounded-full bg-black/70 px-2 py-1 text-center text-[9px] font-black text-white backdrop-blur">{img.source}</div></motion.div>)}
      </motion.div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="mx-auto w-[min(1240px,calc(100%-28px))] pb-10 pt-24">
      <Panel label="Crazy Arcade Portfolio OS" className="min-h-[820px]">
        <div className="grid items-center gap-8 lg:grid-cols-[.88fr_1.12fr]">
          <div>
            <motion.div variants={rise} className="mb-5 inline-flex items-center gap-3 rounded-full border border-amber-200/20 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-amber-100"><Rocket className="h-4 w-4" /> Not boring portfolio</motion.div>
            <motion.h1 variants={rise} className="neon-text text-[clamp(68px,10vw,148px)] font-black uppercase leading-[.82] tracking-[-.08em]">Emirhan<br />Doygun</motion.h1>
            <motion.p variants={rise} className="mt-7 max-w-xl border-l-4 border-cyan-300/45 pl-5 text-lg leading-relaxed text-white/72">PDF estetiğinden çıkıp daha çılgın bir arcade-tech dünyasına dönüştürüldü: canlı mağaza görselleri, neon HUD, hareketli oyun panelleri, floating Unity/C# objeleri ve eğlenceli case-study akışı.</motion.p>
            <motion.div variants={group} initial="hidden" animate="visible" className="mt-8 flex flex-wrap gap-3">
              {['Game Developer', 'AI Creative Technologist', 'Motion Designer', 'Fun UI Builder'].map((x) => <motion.span variants={pop} key={x} className="rounded-2xl border border-cyan-200/20 bg-black/30 px-4 py-3 text-sm font-black text-white/75">{x}</motion.span>)}
            </motion.div>
            <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/70"><span className="flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-black/25 px-4 py-3"><MapPin className="text-cyan-300" /> Istanbul</span><a className="flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-black/25 px-4 py-3 hover:text-cyan-200" href="https://github.com/Remirdy" target="_blank" rel="noreferrer"><Github className="text-cyan-300" /> GitHub</a></motion.div>
          </div>
          <HeroPlayground />
        </div>
      </Panel>

      <Panel id="about" label="Skill Playground">
        <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr]">
          <div><h2 className="text-[clamp(46px,7vw,92px)] font-black uppercase leading-[.9] tracking-[-.06em]">Playful<br />Skill Lab</h2><p className="mt-5 text-lg leading-relaxed text-white/65">Sadece CV değil; oyun hissi, görsel dil, AI üretim pipeline’ı ve motion polish bir arada çalışan bir creative-tech paneli.</p></div>
          <motion.div variants={group} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{skills.map(([name, Icon, sub]) => <motion.div variants={pop} whileHover={{ y: -8, rotate: 1.5 }} key={name as string} className="data-card rounded-3xl p-5"><Icon className="mb-5 h-9 w-9 text-cyan-300" /><h3 className="text-lg font-black">{name as string}</h3><p className="mt-2 text-sm text-white/55">{sub as string}</p></motion.div>)}</motion.div>
        </div>
      </Panel>

      <Panel id="projects" label="Dirty Birdy! Live Case Study">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div><h2 className="text-[clamp(58px,8vw,112px)] font-black uppercase leading-[.86] tracking-[-.07em] text-amber-100">Dirty<br />Birdy!</h2><p className="mt-5 border-l-4 border-amber-200/50 pl-5 text-lg leading-relaxed text-white/68">Bu bölüm artık statik değil. Site, Dirty Birdy! için App Store / Google Play kaynaklarından ekran görüntüsü toplamaya çalışıyor ve bunları hareketli arcade wall olarak gösteriyor.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{['Chaos Combo', 'Bird Selection', 'Mission Flow', 'Stats HUD'].map((x) => <div key={x} className="data-card rounded-2xl p-4 font-black text-white/75"><Trophy className="mb-2 text-amber-200" />{x}</div>)}</div></div>
          <DirtyBirdyLiveWall />
        </div>
      </Panel>

      <Panel id="contact" label="Project Carnival">
        <h2 className="mb-8 text-[clamp(46px,7vw,92px)] font-black uppercase leading-[.9] tracking-[-.06em]">Selected Projects<br /><span className="text-cyan-300">but make it fun</span></h2>
        <motion.div variants={group} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{projectCards.map(([title, text, Icon], i) => <motion.article variants={pop} whileHover={{ y: -12, rotate: i % 2 ? -1.4 : 1.4 }} key={title as string} className="project-card data-card rounded-3xl p-5"><div className="relative mb-5 h-44 overflow-hidden rounded-3xl border border-cyan-200/15 bg-slate-950"><div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(0,234,255,.26),transparent_110px),radial-gradient(circle_at_70%_75%,rgba(255,210,80,.18),transparent_120px)]" /><Icon className="absolute left-5 top-5 h-12 w-12 text-cyan-300" /><Orbit className="absolute bottom-5 right-5 h-16 w-16 text-white/25" /></div><h3 className="text-2xl font-black">{title as string}</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{text as string}</p></motion.article>)}</motion.div>
        <div className="data-card mt-8 rounded-3xl p-7"><h3 className="text-4xl font-black tracking-tight">Let’s build something weird, polished and memorable.</h3><p className="mt-3 text-white/60">Open to internships, freelance work and creative collaborations.</p><a className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-black text-black hover:bg-cyan-200" href="https://github.com/Remirdy" target="_blank" rel="noreferrer">Open GitHub <ExternalLink /></a></div>
      </Panel>
    </main>
  )
}
