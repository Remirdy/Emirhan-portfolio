'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  Aperture,
  ArrowRight,
  BookOpen,
  Brain,
  Clapperboard,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Gamepad2,
  Github,
  GraduationCap,
  Layers3,
  Lightbulb,
  MapPin,
  Megaphone,
  Monitor,
  Repeat2,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Wand2,
  Zap,
} from 'lucide-react'

const rise: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

const card: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } },
}

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
}

const stackCards = [
  { label: 'Unity Runtime', value: 'C# + UI + VFX', icon: Gamepad2 },
  { label: 'Creative Engine', value: 'AI Prompt Systems', icon: Sparkles },
  { label: 'Motion Layer', value: 'After Effects Flow', icon: Clapperboard },
]

const skills = [
  ['Unity Development', Gamepad2],
  ['C# Programming', Code2],
  ['Game UI and HUD', Monitor],
  ['Motion Graphics', Aperture],
  ['AI Prompt Design', Wand2],
  ['Creative Problem Solving', Lightbulb],
]

const workflow = [
  ['Research', 'Understand the product, audience and visual direction.'],
  ['Prototype', 'Build fast layout, UI, motion and interaction tests.'],
  ['Polish', 'Add glow, timing, micro animation and responsive structure.'],
  ['Ship', 'Package, deploy, iterate and improve from feedback.'],
]

const projects = [
  {
    title: 'Dirty Birdy!',
    tag: 'Featured Mobile Game',
    text: 'A chaotic arcade experience shaped with cartoon identity, playful UI, animated feedback, combo energy and promotional visual direction.',
    icon: Gamepad2,
  },
  {
    title: 'ImageForge',
    tag: 'Creator Tool',
    text: 'A resize and export workflow concept with crop states, preset cards, batch export logic and creator focused interaction patterns.',
    icon: Layers3,
  },
  {
    title: 'AI Motion Ads',
    tag: 'Creative Production',
    text: 'Cinematic social media concepts supported by prompt systems, camera language, pacing, visual transitions and brand-safe execution.',
    icon: Brain,
  },
  {
    title: 'Calculus Book Design',
    tag: 'Editorial System',
    text: 'A structured long-form academic project focused on hierarchy, visual rhythm, example formatting and consistent presentation language.',
    icon: BookOpen,
  },
]

function Panel({ id, eyebrow, children, className = '' }: { id?: string; eyebrow: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      id={id}
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-120px' }}
      className={`pdf-panel relative mb-8 rounded-[28px] p-6 sm:p-9 lg:p-12 ${className}`}
    >
      <span className="corner-tl" />
      <span className="corner-br" />
      <div className="relative z-10 mb-7 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.42em] text-cyan-200/80">
        <span className="h-px w-10 bg-cyan-300/50" />{eyebrow}
      </div>
      <div className="relative z-10">{children}</div>
    </motion.section>
  )
}

function HeroVisual() {
  return (
    <motion.div variants={group} initial="hidden" animate="visible" className="relative min-h-[560px] overflow-hidden rounded-[34px] border border-cyan-200/20 bg-black/25 p-5 neon-border">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgba(0,234,255,.25),transparent_190px),radial-gradient(circle_at_28%_72%,rgba(124,60,255,.18),transparent_220px)]" />
      <motion.div variants={card} className="absolute right-8 top-8 h-52 w-52 rounded-full border-4 border-cyan-300/40 neon-glow" />
      <motion.div variants={card} className="absolute right-20 top-20 h-32 w-32 rounded-full border border-cyan-300/30" />
      <div className="absolute left-[-80px] top-56 h-1 w-[620px] -rotate-[23deg] rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_22px_#00eaff]" />
      <div className="absolute right-[-130px] top-72 h-1 w-[720px] -rotate-[23deg] rounded-full bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent shadow-[0_0_18px_#00eaff]" />

      <motion.div variants={card} className="absolute left-8 top-20 w-56 rounded-2xl border border-cyan-200/20 bg-slate-950/70 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3 text-cyan-200"><Terminal /><span className="text-xs font-black tracking-[0.28em]">LIVE STACK</span></div>
        <div className="space-y-3">
          {stackCards.map((item) => {
            const Icon = item.icon
            return <div key={item.label} className="rounded-xl border border-white/10 bg-white/[.03] p-3"><div className="flex items-center gap-2 text-sm font-black"><Icon className="text-cyan-300" />{item.label}</div><p className="mt-1 text-xs text-white/55">{item.value}</p></div>
          })}
        </div>
      </motion.div>

      <motion.div variants={card} className="absolute bottom-16 left-24 grid h-44 w-36 place-items-center border border-cyan-200/25 bg-slate-900/80 text-5xl font-black clip-tech shadow-2xl">U</motion.div>
      <motion.div variants={card} className="absolute bottom-8 right-16 grid h-56 w-44 place-items-center border border-cyan-200/25 bg-slate-900/80 text-4xl font-black clip-tech shadow-2xl">C#</motion.div>
      <motion.div variants={card} className="absolute bottom-36 right-40 w-56 rounded-2xl border border-cyan-200/20 bg-black/35 p-4 backdrop-blur-xl">
        <div className="mb-3 flex justify-between text-xs font-black text-white/55"><span>Portfolio Signal</span><span className="text-cyan-300">98%</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[98%] rounded-full bg-gradient-to-r from-cyan-300 to-white" /></div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-black text-white/65"><span>GAME</span><span>AI</span><span>MOTION</span></div>
      </motion.div>
    </motion.div>
  )
}

function SkillCell({ name, Icon }: { name: string; Icon: any }) {
  return (
    <motion.div variants={card} whileHover={{ y: -5, scale: 1.02 }} className="data-card rounded-2xl p-4">
      <Icon className="mb-4 h-8 w-8 text-cyan-300" />
      <h4 className="text-sm font-black leading-tight text-white/90">{name}</h4>
    </motion.div>
  )
}

function ProjectCard({ p, i }: { p: any; i: number }) {
  const Icon = p.icon
  return (
    <motion.article variants={card} whileHover={{ y: -10, rotateX: 1.5 }} className="project-card data-card rounded-3xl p-5">
      <div className="relative mb-5 h-40 overflow-hidden rounded-2xl border border-cyan-200/15 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,234,255,.24),transparent_110px),linear-gradient(135deg,rgba(255,255,255,.08),transparent)]" />
        <div className="absolute left-5 top-5 grid h-14 w-14 place-items-center rounded-2xl border border-cyan-200/25 bg-cyan-300/10 text-cyan-300"><Icon /></div>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="mb-2 h-2 w-full rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${72 + i * 6}%` }} /></div>
          <div className="flex gap-2"><span className="h-8 flex-1 rounded-lg bg-white/10" /><span className="h-8 w-12 rounded-lg bg-cyan-300/20" /></div>
        </div>
      </div>
      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300/80">{p.tag}</div>
      <h3 className="text-2xl font-black tracking-tight">{p.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/62">{p.text}</p>
    </motion.article>
  )
}

export default function Home() {
  return (
    <main className="mx-auto w-[min(1240px,calc(100%-28px))] pb-10 pt-24">
      <Panel eyebrow="PDF Inspired Interactive Portfolio" className="min-h-[760px]">
        <div className="grid items-center gap-8 lg:grid-cols-[.92fr_1.08fr]">
          <div>
            <motion.div variants={rise} className="mb-5 inline-flex items-center gap-3 rounded-full border border-cyan-200/20 bg-cyan-300/5 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-200"><Rocket className="h-4 w-4" /> Selected Portfolio</motion.div>
            <motion.h1 variants={rise} className="neon-text text-[clamp(70px,10vw,150px)] font-black uppercase leading-[.82] tracking-[-.08em]">Emirhan<br />Doygun</motion.h1>
            <motion.p variants={rise} className="mt-7 max-w-xl border-l-4 border-cyan-300/45 pl-5 text-lg leading-relaxed text-white/72">A complex digital portfolio inspired by the PDF visual language: cinematic neon panels, live HUD systems, motion driven case studies, game UI energy and AI-assisted creative production.</motion.p>
            <motion.div variants={group} initial="hidden" animate="visible" className="mt-8 flex flex-wrap gap-3">
              {['Game Developer', 'AI Creative Technologist', 'Motion Designer', 'Computer Engineering'].map((x) => <motion.span variants={card} key={x} className="rounded-2xl border border-cyan-200/20 bg-black/30 px-4 py-3 text-sm font-black text-white/75">{x}</motion.span>)}
            </motion.div>
            <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/70">
              <span className="flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-black/25 px-4 py-3"><MapPin className="text-cyan-300" /> Istanbul, Turkiye</span>
              <a className="flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-black/25 px-4 py-3 hover:text-cyan-200" href="https://github.com/Remirdy" target="_blank" rel="noreferrer"><Github className="text-cyan-300" /> github.com/Remirdy</a>
            </motion.div>
          </div>
          <HeroVisual />
        </div>
      </Panel>

      <Panel id="about" eyebrow="Profile Operating System">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <h2 className="text-[clamp(46px,7vw,92px)] font-black uppercase leading-[.9] tracking-[-.06em]">Profile<br />Dashboard</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">I combine software, animation, interface design and visual storytelling to build playful, polished and technically structured digital products.</p>
          </div>
          <motion.div variants={group} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map(([name, Icon]) => <SkillCell key={name as string} name={name as string} Icon={Icon} />)}
          </motion.div>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {workflow.map(([title, text], i) => <motion.div variants={card} key={title} className="data-card rounded-2xl p-5"><div className="mb-4 text-4xl font-black text-cyan-300/40">0{i + 1}</div><h3 className="text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p></motion.div>)}
        </div>
      </Panel>

      <Panel id="projects" eyebrow="Featured Case Study">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <h2 className="text-[clamp(56px,8vw,106px)] font-black uppercase leading-[.88] tracking-[-.07em]">Dirty<br />Birdy!</h2>
            <p className="mt-5 max-w-lg border-l-4 border-cyan-300/45 pl-5 text-lg leading-relaxed text-white/68">A mobile arcade case study presented as a living system: character choice, chaos feedback, missions, stats, combo language, promotional visuals and animated HUD direction.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Cartoon identity', 'Combo feedback', 'Power-up UI', 'Mission systems'].map((x) => <div key={x} className="data-card rounded-2xl p-4 text-sm font-black text-white/75"><ShieldCheck className="mb-2 text-cyan-300" />{x}</div>)}
            </div>
          </div>
          <motion.div variants={group} className="grid gap-4 sm:grid-cols-2">
            {['Choose Your Bird', 'Aim Drop Chaos', 'Mission Flow', 'Detailed Stats'].map((x, i) => <motion.div variants={card} key={x} className={`${i === 0 ? 'sm:col-span-2 min-h-64' : 'min-h-44'} relative overflow-hidden rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-amber-300 via-amber-800 to-black p-5`}><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(255,244,173,.42)_0_52px,transparent_54px),radial-gradient(circle_at_72%_70%,rgba(255,211,101,.3)_0_58px,transparent_60px)]" /><div className="relative z-10 text-3xl font-black leading-none text-amber-50 [text-shadow:0_3px_0_rgba(74,35,4,.75)]">{x}</div><div className="absolute bottom-5 right-5 aspect-video w-40 -rotate-3 rounded-2xl border-[7px] border-black bg-gradient-to-b from-sky-300 via-white to-orange-700 shadow-2xl"><span className="absolute bottom-3 left-1/4 h-6 w-6 rounded-full bg-red-700" /><span className="absolute bottom-3 left-1/2 h-6 w-6 rounded-full bg-yellow-300" /></div></motion.div>)}
          </motion.div>
        </div>
      </Panel>

      <Panel id="contact" eyebrow="Project Lab and Contact">
        <h2 className="mb-8 text-[clamp(46px,7vw,92px)] font-black uppercase leading-[.9] tracking-[-.06em]">Selected Projects<br /><span className="text-cyan-300">and Collaboration</span></h2>
        <motion.div variants={group} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
        </motion.div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="data-card rounded-3xl p-6"><h3 className="mb-5 text-2xl font-black">What I bring</h3><div className="grid gap-3 sm:grid-cols-2">{['Game-focused thinking', 'Clean visual communication', 'Strong creative iteration', 'AI-assisted production'].map((x) => <div key={x} className="rounded-2xl border border-cyan-200/15 bg-white/[.03] p-4 text-sm font-black text-white/70"><Zap className="mb-2 text-cyan-300" />{x}</div>)}</div></div>
          <div className="data-card rounded-3xl p-6"><h3 className="text-4xl font-black tracking-tight">Let us build something creative.</h3><p className="mt-3 text-white/60">Open to internships, freelance work and creative collaborations.</p><a className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-black text-black hover:bg-cyan-200" href="https://github.com/Remirdy" target="_blank" rel="noreferrer">Open GitHub <ExternalLink /></a></div>
        </div>
      </Panel>
    </main>
  )
}
