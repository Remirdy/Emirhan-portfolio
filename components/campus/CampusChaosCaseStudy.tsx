'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Banknote, BookOpen, Coffee, Copy, Gauge, GraduationCap, Lock, Play, Plus, ShieldCheck, Sparkles, Timer, Trophy, WandSparkles, Zap } from 'lucide-react'
import Link from 'next/link'

type Building = {
  id: string
  name: string
  status: 'Live' | 'Semi-unlocked' | 'Locked'
  level: number
  income: number
  description: string
  image: string
  icon: React.ReactNode
  color: string
}

const loopSteps = ['Buildings generate passive income', 'Students create traffic and demand', 'Events add urgency and chaos', 'The player upgrades key facilities', 'Reputation unlocks better campus tools']

const systems = [
  ['Core gameplay loop', 'Collect income, react to campus events, upgrade buildings and keep the university productive.', Play],
  ['Economy system', 'Campus Cash funds upgrades, Chaos Points measure operational pressure, and Reputation unlocks progress.', Banknote],
  ['Building system', 'Canteen starts the loop, Copy Center creates risk, and Library becomes a reputation-focused unlock.', GraduationCap],
  ['Event system', 'Short popups like Printer Jam create quick interactive moments inside the idle loop.', Zap],
  ['AFK progression', 'A compact report shows rewards earned while away from the game.', Timer],
  ['Interface clarity', 'The prototype focuses on mobile readability, visual hierarchy and responsive interaction.', Gauge],
] as const

const visualPillars = ['Vertical 9:16 mobile-first layout', 'Clean premium portfolio framing', 'Cartoon campus visuals with proper art cards', 'Bright game UI without looking childish', 'Readable hierarchy and soft motion']

const studentSprites = [
  { id: 'a', image: '/campus-chaos/student-a.svg', className: 'left-[6%] top-[16%] w-11', initial: { x: 10, y: 40 }, animate: { x: [10, 120, 42], y: [40, 170, 280] }, duration: 9 },
  { id: 'b', image: '/campus-chaos/student-b.svg', className: 'left-[68%] top-[14%] w-11', initial: { x: 0, y: 0 }, animate: { x: [0, -96, -38], y: [0, 126, 230] }, duration: 8.4 },
  { id: 'c', image: '/campus-chaos/student-c.svg', className: 'left-[28%] top-[59%] w-11', initial: { x: 0, y: 0 }, animate: { x: [0, 80, 20], y: [0, -88, 30] }, duration: 7.6 },
]

export default function CampusChaosCaseStudy() {
  const [cash, setCash] = useState(12840)
  const [chaos, setChaos] = useState(320)
  const [reputation, setReputation] = useState(72)
  const [rewardVisible, setRewardVisible] = useState(false)
  const [eventVisible, setEventVisible] = useState(true)
  const [afkOpen, setAfkOpen] = useState(false)
  const [buildings, setBuildings] = useState<Building[]>([
    { id: 'canteen', name: 'Canteen', status: 'Live', level: 3, income: 420, description: 'The starting building: fast income, student foot traffic and easy upgrade readability.', image: '/campus-chaos/building-canteen.svg', icon: <Coffee className="h-5 w-5" />, color: 'from-amber-300 to-orange-400' },
    { id: 'copy', name: 'Copy Center', status: 'Semi-unlocked', level: 1, income: 260, description: 'A high-demand building with more risk and event-heavy gameplay moments.', image: '/campus-chaos/building-copy.svg', icon: <Copy className="h-5 w-5" />, color: 'from-cyan-300 to-blue-400' },
    { id: 'library', name: 'Library', status: 'Locked', level: 0, income: 0, description: 'A reputation-focused building designed as the next unlock milestone.', image: '/campus-chaos/building-library.svg', icon: <BookOpen className="h-5 w-5" />, color: 'from-violet-300 to-fuchsia-400' },
  ])

  const incomePerMinute = useMemo(() => buildings.reduce((total, building) => total + building.income, 0), [buildings])

  const showReward = () => {
    setRewardVisible(true)
    window.setTimeout(() => setRewardVisible(false), 1000)
  }

  const upgradeBuilding = (id: string) => {
    setBuildings((current) => current.map((building) => {
      if (building.id !== id || building.status === 'Locked') return building
      return { ...building, level: building.level + 1, income: building.income + 95 }
    }))
    setCash((value) => value + 210)
    setChaos((value) => value + 14)
    setReputation((value) => Math.min(100, value + 1))
    showReward()
  }

  const resolveEvent = () => {
    setEventVisible(false)
    setCash((value) => value + 780)
    setChaos((value) => Math.max(0, value - 65))
    setReputation((value) => Math.min(100, value + 4))
    showReward()
    window.setTimeout(() => setEventVisible(true), 3600)
  }

  return (
    <main className="mx-auto w-[min(1240px,calc(100%-28px))] pb-16 pt-28 text-white">
      <Hero />
      <section className="mt-8 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
        <CasePanel eyebrow="01 / Project overview" title="A more premium game concept presentation">
          <p className="text-white/68 leading-8">The project is designed to feel like a strong game design and UI/UX case study: readable systems, a clean mobile-first layout, better game-facing visuals and enough interaction to make the concept feel real inside a portfolio.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3"><Metric label="Income / min" value={`$${incomePerMinute}`} /><Metric label="Prototype scope" value="Web UI" /><Metric label="Format" value="9:16 mobile" /></div>
        </CasePanel>
        <CasePanel eyebrow="02 / Core gameplay loop" title="Simple loop, clearer game value"><div className="grid gap-3">{loopSteps.map((step, index) => <motion.div key={step} initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">{index + 1}</span><span className="font-bold text-white/78">{step}</span></motion.div>)}</div></CasePanel>
      </section>
      <section className="mt-8 rounded-[2rem] border border-cyan-300/15 bg-slate-950/70 p-6 md:p-8"><div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200/70">03 / Main systems</p><h2 className="mt-2 font-display text-4xl font-black tracking-[-0.05em] md:text-6xl">Design systems</h2></div><p className="max-w-xl text-white/60">Economy, progression, readability, event rhythm and interface clarity.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{systems.map(([title, body, Icon]) => <motion.article key={title} whileHover={{ y: -8, rotate: 0.35 }} className="rounded-3xl border border-white/10 bg-white/[.045] p-6 shadow-xl shadow-black/20"><Icon className="mb-5 h-8 w-8 text-cyan-200" /><h3 className="font-display text-2xl font-black">{title}</h3><p className="mt-3 leading-7 text-white/62">{body}</p></motion.article>)}</div></section>
      <section className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start" id="prototype"><div className="sticky top-28"><p className="text-xs font-black uppercase tracking-[0.32em] text-amber-100/80">04 / Interactive prototype</p><h2 className="mt-2 font-display text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">Phone mockup with proper visuals</h2><p className="mt-5 leading-8 text-white/64">The prototype now uses illustrated building cards and student assets instead of emoji. The UI aims to feel closer to a professional mobile game pitch.</p><div className="mt-6 grid gap-3">{visualPillars.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.045] px-4 py-3 text-sm font-bold text-white/72">{item}</div>)}</div></div><div className="grid gap-6 xl:grid-cols-[390px_1fr]"><PhonePrototype cash={cash} chaos={chaos} reputation={reputation} buildings={buildings} rewardVisible={rewardVisible} eventVisible={eventVisible} onResolveEvent={resolveEvent} onUpgrade={upgradeBuilding} onOpenAfk={() => setAfkOpen(true)} /><BuildingCards buildings={buildings} /></div></section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><CasePanel eyebrow="05 / Visual direction" title="Cleaner art direction, less generic portfolio filler"><div className="grid gap-4 md:grid-cols-3">{buildings.map((building) => <div key={building.id} className="rounded-3xl border border-white/10 bg-white/[.045] p-4"><img src={building.image} alt={`${building.name} key art`} className="w-full rounded-2xl" /><h3 className="mt-4 font-display text-xl font-black">{building.name}</h3><p className="mt-2 text-sm leading-6 text-white/58">{building.status === 'Locked' ? 'Planned unlock with cleaner pacing and higher reputation value.' : 'Core early-to-mid game visual anchor with clear thematic identity.'}</p></div>)}</div></CasePanel><CasePanel eyebrow="06 / System snapshot" title="What makes the prototype feel game-like"><div className="grid gap-3"><SnapshotRow icon={<ShieldCheck className="h-5 w-5" />} title="Readable currencies" body="Campus Cash, Chaos Points and Reputation are visible at the top." /><SnapshotRow icon={<WandSparkles className="h-5 w-5" />} title="Micro interactions" body="Upgrade buttons, event taps and AFK collection make the prototype feel alive." /><SnapshotRow icon={<Trophy className="h-5 w-5" />} title="Portfolio presentation" body="The surrounding layout stays premium and restrained." /></div></CasePanel></section>
      <AfkModal open={afkOpen} onClose={() => setAfkOpen(false)} />
    </main>
  )
}

function Hero() {
  return <section className="relative overflow-hidden rounded-[2.4rem] border border-cyan-300/20 bg-slate-950/80 p-6 shadow-2xl shadow-black/40 md:p-10"><div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_82%_16%,rgba(34,211,238,.2),transparent_28rem),radial-gradient(circle_at_12%_80%,rgba(251,191,36,.13),transparent_24rem)]" /><div className="relative z-10 grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center"><div><Link href="/" className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100 hover:border-cyan-200/50"><ArrowLeft className="h-4 w-4" /> Portfolio</Link><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-amber-100"><Sparkles className="h-4 w-4" /> Interactive mobile game case study</div><h1 className="font-display text-6xl font-black leading-[.86] tracking-[-0.07em] md:text-8xl">Campus Chaos<br />Tycoon</h1><p className="mt-6 max-w-2xl border-l-4 border-cyan-300/50 pl-5 text-lg leading-8 text-white/72">A polished portfolio concept for a vertical idle tycoon game where the player manages a chaotic university campus.</p><div className="mt-7 flex flex-wrap gap-3">{['React / Next.js', 'Tailwind CSS', 'Framer Motion', 'Mobile Game UX', 'Idle Tycoon Concept'].map((tag) => <span key={tag} className="rounded-2xl border border-cyan-200/15 bg-white/[.045] px-4 py-3 text-sm font-bold text-white/72">{tag}</span>)}</div></div><motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-white/10 bg-white/[.04] p-3 shadow-2xl shadow-cyan-950/40"><img src="/campus-chaos/hero-campus.svg" alt="Cartoon campus overview for Campus Chaos Tycoon" className="h-auto w-full rounded-[1.55rem]" /></motion.div></div></section>
}

function BuildingCards({ buildings }: { buildings: Building[] }) {
  return <div className="grid gap-4">{buildings.map((building) => <article key={building.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] p-5"><div className="grid gap-5 md:grid-cols-[170px_1fr] md:items-center"><div className="rounded-[1.6rem] border border-white/12 bg-black/20 p-3"><img src={building.image} alt={`${building.name} illustration`} className="h-auto w-full rounded-2xl" /></div><div><div className="flex items-start justify-between gap-4"><div className="flex gap-4"><div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${building.color} text-slate-950 shadow-lg`}>{building.icon}</div><div><h3 className="font-display text-2xl font-black">{building.name}</h3><p className="mt-1 text-sm font-bold text-white/48">{building.status} · Level {building.level} · +${building.income}/min</p></div></div>{building.status === 'Locked' ? <Lock className="h-5 w-5 text-white/36" /> : null}</div><p className="mt-4 leading-7 text-white/62">{building.description}</p></div></div></article>)}</div>
}

function CasePanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <section className="rounded-[2rem] border border-cyan-300/15 bg-slate-950/70 p-6 shadow-2xl shadow-black/25 md:p-8"><p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200/70">{eyebrow}</p><h2 className="mt-3 font-display text-4xl font-black leading-none tracking-[-0.05em] md:text-5xl">{title}</h2><div className="mt-6">{children}</div></section> }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><p className="text-xs font-black uppercase tracking-[0.22em] text-white/42">{label}</p><p className="mt-2 font-display text-2xl font-black text-white">{value}</p></div> }
function SnapshotRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4"><div className="flex items-center gap-3 text-cyan-200">{icon}<h3 className="font-display text-xl font-black text-white">{title}</h3></div><p className="mt-2 leading-7 text-white/60">{body}</p></div> }
function Currency({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-950 px-2 py-3 text-white"><p className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</p><p className="mt-1 text-sm font-black">{value}</p></div> }

function PhonePrototype({ cash, chaos, reputation, buildings, rewardVisible, eventVisible, onResolveEvent, onUpgrade, onOpenAfk }: { cash: number; chaos: number; reputation: number; buildings: Building[]; rewardVisible: boolean; eventVisible: boolean; onResolveEvent: () => void; onUpgrade: (id: string) => void; onOpenAfk: () => void }) {
  return <div className="mx-auto w-full max-w-[390px] rounded-[3rem] border-[10px] border-black bg-black p-2 shadow-2xl shadow-cyan-950/60"><div className="relative min-h-[780px] overflow-hidden rounded-[2.35rem] bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-300 text-slate-950"><div className="absolute left-1/2 top-3 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-black" /><div className="relative z-10 px-4 pb-4 pt-12"><div className="rounded-3xl border border-white/50 bg-white/78 p-4 shadow-xl backdrop-blur"><p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Campus Chaos Tycoon</p><div className="mt-3 grid grid-cols-3 gap-2 text-center"><Currency label="Cash" value={`$${cash.toLocaleString()}`} /><Currency label="Chaos" value={chaos.toString()} /><Currency label="Rep" value={`${reputation}%`} /></div></div><div className="relative mt-4 h-[405px] overflow-hidden rounded-[2rem] border-4 border-white/50 bg-[linear-gradient(180deg,#b3ecff_0%,#9ceba9_42%,#7fd676_100%)] shadow-inner"><div className="absolute left-[50%] top-0 h-full w-[70px] -translate-x-1/2 bg-[#efc988] shadow-inner" /><div className="absolute left-0 top-[48%] h-[70px] w-full -translate-y-1/2 bg-[#efc988] shadow-inner" /><div className="absolute left-[47.6%] top-[44.8%] z-[1] h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[12px] border-[#fee8ae] bg-emerald-400/90 shadow-lg" /><div className="absolute left-[47.6%] top-[44.8%] z-[1] h-[38px] w-[38px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600" /><CampusMapBuildings /><Students /><EventPopup visible={eventVisible} onResolve={onResolveEvent} /><Reward visible={rewardVisible} /></div><div className="mt-4 grid gap-3">{buildings.map((building) => <div key={building.id} className="rounded-3xl border border-white/50 bg-white/82 p-3 shadow-lg backdrop-blur"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><img src={building.image} alt={`${building.name} thumb`} className="h-12 w-14 rounded-2xl object-cover" /><div><b>{building.name}</b><p className="text-xs font-bold text-slate-500">Lv. {building.level} · +${building.income}/min</p></div></div><button disabled={building.status === 'Locked'} onClick={() => onUpgrade(building.id)} className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-black text-white disabled:bg-slate-400"><Plus className="inline h-3 w-3" /> Upgrade</button></div></div>)}</div><button onClick={onOpenAfk} className="mt-4 w-full rounded-3xl bg-slate-950 px-5 py-4 font-black text-white shadow-xl">Open AFK Report</button></div></div></div>
}

function CampusMapBuildings() { return <><motion.div whileHover={{ scale: 1.04 }} className="absolute left-[7%] top-[15%] z-10 w-[118px] rounded-[1.35rem] border-2 border-white bg-white/90 p-2 shadow-xl"><img src="/campus-chaos/building-canteen.svg" alt="Canteen building" className="w-full rounded-[1rem]" /></motion.div><motion.div whileHover={{ scale: 1.04 }} className="absolute right-[6%] top-[16%] z-10 w-[118px] rounded-[1.35rem] border-2 border-white bg-white/90 p-2 shadow-xl"><img src="/campus-chaos/building-copy.svg" alt="Copy Center building" className="w-full rounded-[1rem]" /></motion.div><motion.div whileHover={{ scale: 1.04 }} className="absolute left-[23%] bottom-[9%] z-10 w-[132px] rounded-[1.35rem] border-2 border-white bg-white/90 p-2 shadow-xl"><img src="/campus-chaos/building-library.svg" alt="Library building" className="w-full rounded-[1rem] opacity-80" /></motion.div></> }
function Students() { return <>{studentSprites.map((student) => <motion.img key={student.id} src={student.image} alt="Student character" className={`absolute z-20 drop-shadow-lg ${student.className}`} initial={student.initial} animate={student.animate} transition={{ duration: student.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />)}</> }
function EventPopup({ visible, onResolve }: { visible: boolean; onResolve: () => void }) { return <AnimatePresence>{visible ? <motion.button initial={{ scale: 0.8, opacity: 0, y: -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.7, opacity: 0 }} onClick={onResolve} className="absolute left-5 right-5 top-5 z-30 rounded-3xl border-2 border-white bg-rose-500 p-4 text-left text-white shadow-2xl"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Campus event</p><div className="mt-1 flex items-center justify-between gap-3"><div><b className="block text-2xl">Printer Jam!</b><p className="mt-1 text-sm font-bold text-white/80">Tap to fix and collect reward.</p></div><div className="rounded-2xl bg-white/15 p-2"><Zap className="h-6 w-6" /></div></div></motion.button> : null}</AnimatePresence> }
function Reward({ visible }: { visible: boolean }) { return <AnimatePresence>{visible ? <motion.div initial={{ opacity: 0, y: 30, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30 }} className="absolute bottom-7 left-1/2 z-30 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-amber-200 shadow-xl">Reward collected</motion.div> : null}</AnimatePresence> }
function AfkModal({ open, onClose }: { open: boolean; onClose: () => void }) { return <AnimatePresence>{open ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-5 backdrop-blur-xl" onClick={onClose}><motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 18 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[2rem] border border-cyan-200/20 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/50"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/70">AFK report</p><h3 className="font-display text-4xl font-black tracking-[-0.05em]">Welcome back!</h3></div><Trophy className="h-10 w-10 text-amber-200" /></div><div className="grid gap-3"><Metric label="Campus Cash earned" value="$4,820" /><Metric label="Chaos prevented" value="-42 pts" /><Metric label="Reputation bonus" value="+6" /></div><button onClick={onClose} className="mt-6 w-full rounded-2xl bg-cyan-200 px-5 py-4 font-black text-slate-950">Collect rewards</button></motion.div></motion.div> : null}</AnimatePresence> }
