'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Banknote, BookOpen, Coffee, Copy, Gauge, GraduationCap, Lock, Play, Plus, Sparkles, Timer, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'

type Building = {
  id: string
  name: string
  icon: React.ReactNode
  status: 'Live' | 'Semi-unlocked' | 'Locked'
  level: number
  income: number
  chaos: number
  description: string
  color: string
}

const systems = [
  ['Core Gameplay Loop', 'Collect income, resolve campus events, upgrade buildings and improve reputation without letting chaos take over.', Play],
  ['Main Systems', 'Idle economy, building upgrades, student traffic, event reactions, AFK rewards and reputation pressure.', Gauge],
  ['Economy System', 'Campus Cash funds upgrades, Chaos Points represent funny problems, Reputation keeps progression meaningful.', Banknote],
  ['Building System', 'Each building has a different role: food income, printing demand and study-focused reputation bonuses.', GraduationCap],
  ['Event System', 'Short popups like Printer Jam or Random Quiz interrupt the loop and reward fast reactions.', Zap],
  ['AFK Progression', 'The player returns to a compact report showing income, chaos growth and reputation changes.', Timer],
]

const loop = ['Buildings generate rewards', 'Students create demand', 'Events add chaos', 'Player upgrades campus', 'Reputation unlocks more systems']

const future = ['Dormitory and club room buildings', 'Final Week seasonal event', 'Mini quest chains for student groups', 'More readable analytics dashboard', 'Cosmetic campus themes']

export default function CampusChaosTycoonPage() {
  const [cash, setCash] = useState(12840)
  const [chaos, setChaos] = useState(320)
  const [rep, setRep] = useState(72)
  const [reward, setReward] = useState(false)
  const [eventVisible, setEventVisible] = useState(true)
  const [afkOpen, setAfkOpen] = useState(false)
  const [buildings, setBuildings] = useState<Building[]>([
    { id: 'canteen', name: 'Canteen', icon: <Coffee className="h-5 w-5" />, status: 'Live', level: 3, income: 420, chaos: 12, description: 'First unlocked income source. Students buy snacks, coffee and emergency sandwiches.', color: 'from-amber-300 to-orange-400' },
    { id: 'copy', name: 'Copy Center', icon: <Copy className="h-5 w-5" />, status: 'Semi-unlocked', level: 1, income: 260, chaos: 34, description: 'High chaos, high demand. Printer jams create funny campus events.', color: 'from-cyan-300 to-blue-400' },
    { id: 'library', name: 'Library', icon: <BookOpen className="h-5 w-5" />, status: 'Locked', level: 0, income: 0, chaos: -18, description: 'Reputation-focused building planned for the next unlock milestone.', color: 'from-violet-300 to-fuchsia-400' },
  ])

  const incomePerMin = useMemo(() => buildings.reduce((sum, building) => sum + building.income, 0), [buildings])

  const upgradeBuilding = (id: string) => {
    setBuildings((current) => current.map((building) => {
      if (building.id !== id || building.status === 'Locked') return building
      return { ...building, level: building.level + 1, income: building.income + 95, chaos: building.chaos + 4 }
    }))
    setCash((value) => value + 210)
    setChaos((value) => value + 14)
    setRep((value) => Math.min(100, value + 1))
    setReward(true)
    window.setTimeout(() => setReward(false), 900)
  }

  const resolveEvent = () => {
    setEventVisible(false)
    setCash((value) => value + 780)
    setChaos((value) => Math.max(0, value - 65))
    setRep((value) => Math.min(100, value + 4))
    setReward(true)
    window.setTimeout(() => setReward(false), 1100)
    window.setTimeout(() => setEventVisible(true), 3600)
  }

  return (
    <main className="mx-auto w-[min(1240px,calc(100%-28px))] pb-16 pt-28 text-white">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-cyan-300/20 bg-slate-950/80 p-6 shadow-2xl shadow-black/40 md:p-10">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_82%_16%,rgba(34,211,238,.22),transparent_28rem),radial-gradient(circle_at_12%_80%,rgba(251,191,36,.16),transparent_24rem)]" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100 hover:border-cyan-200/50">
              <ArrowLeft className="h-4 w-4" /> Portfolio
            </Link>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-amber-100">
              <Sparkles className="h-4 w-4" /> Interactive web case study
            </div>
            <h1 className="font-display text-6xl font-black leading-[.86] tracking-[-0.07em] md:text-8xl">
              Campus Chaos<br />Tycoon
            </h1>
            <p className="mt-6 max-w-2xl border-l-4 border-cyan-300/50 pl-5 text-lg leading-8 text-white/72">
              A portfolio-ready mobile idle tycoon concept where the player manages a chaotic university campus. This page is not a Unity game; it is a polished React prototype and UI/UX case study built to show game design thinking, interaction feel and presentation quality.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {['React / Next.js', 'Tailwind CSS', 'Framer Motion', 'Mobile Game UX', 'Idle Tycoon Prototype'].map((tag) => (
                <span key={tag} className="rounded-2xl border border-cyan-200/15 bg-white/[.045] px-4 py-3 text-sm font-bold text-white/72">{tag}</span>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="rounded-[2rem] border border-white/10 bg-white/[.04] p-3 shadow-2xl shadow-cyan-950/40">
            <img src="/campus-chaos/hero-campus.svg" alt="Cartoon campus overview for Campus Chaos Tycoon" className="h-auto w-full rounded-[1.55rem]" />
          </motion.div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
        <CasePanel eyebrow="01 / Project overview" title="A game concept presented like a premium product case study">
          <p className="text-white/68 leading-8">The goal is to communicate a complete game direction without building a full production game. The page demonstrates the fantasy, interface structure, progression loop and core systems in a way that feels playable enough for a portfolio reviewer.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Income / min" value={`$${incomePerMin}`} />
            <Metric label="Prototype scope" value="Web UI" />
            <Metric label="Format" value="9:16 Mobile" />
          </div>
        </CasePanel>
        <CasePanel eyebrow="02 / Core gameplay loop" title="Simple idle loop, readable in seconds">
          <div className="grid gap-3">
            {loop.map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">{index + 1}</span>
                <span className="font-bold text-white/78">{item}</span>
              </motion.div>
            ))}
          </div>
        </CasePanel>
      </section>

      <section className="mt-8 rounded-[2rem] border border-cyan-300/15 bg-slate-950/70 p-6 md:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200/70">03 / Systems</p>
            <h2 className="mt-2 font-display text-4xl font-black tracking-[-0.05em] md:text-6xl">Game design systems</h2>
          </div>
          <p className="max-w-xl text-white/60">Each card explains one portfolio section: main systems, economy, buildings, events and AFK progression.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {systems.map(([title, body, Icon]) => (
            <motion.article key={title as string} whileHover={{ y: -8, rotate: .35 }} className="rounded-3xl border border-white/10 bg-white/[.045] p-6 shadow-xl shadow-black/20">
              <Icon className="mb-5 h-8 w-8 text-cyan-200" />
              <h3 className="font-display text-2xl font-black">{title as string}</h3>
              <p className="mt-3 leading-7 text-white/62">{body as string}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start" id="prototype">
        <div className="sticky top-28">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-100/80">09 / Interactive prototype</p>
          <h2 className="mt-2 font-display text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">Playable phone mockup</h2>
          <p className="mt-5 leading-8 text-white/64">Tap event popups, upgrade buildings and open the AFK report. The prototype focuses on interface communication and game feel, not backend or real save systems.</p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
          <PhonePrototype cash={cash} chaos={chaos} rep={rep} buildings={buildings} reward={reward} eventVisible={eventVisible} onResolveEvent={resolveEvent} onUpgrade={upgradeBuilding} onOpenAfk={() => setAfkOpen(true)} />
          <div className="grid gap-4">
            {buildings.map((building) => (
              <article key={building.id} className="rounded-3xl border border-white/10 bg-white/[.045] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${building.color} text-slate-950 shadow-lg`}>{building.icon}</div>
                    <div>
                      <h3 className="font-display text-2xl font-black">{building.name}</h3>
                      <p className="mt-1 text-sm font-bold text-white/48">{building.status} · Level {building.level}</p>
                    </div>
                  </div>
                  {building.status === 'Locked' && <Lock className="h-5 w-5 text-white/36" />}
                </div>
                <p className="mt-4 leading-7 text-white/62">{building.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <CasePanel eyebrow="10 / Future improvements" title="Next steps for a stronger portfolio demo">
          <div className="grid gap-3">
            {future.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.045] p-4 font-bold text-white/70">{item}</div>)}
          </div>
        </CasePanel>
        <CasePanel eyebrow="Portfolio positioning" title="Why this works as a portfolio piece">
          <p className="leading-8 text-white/68">It shows game ideation, UI hierarchy, mobile-first design, interaction design, monetizable idle mechanics and presentation polish in one compact web experience. It is intentionally scoped as a case study, so the project feels achievable and professional.</p>
          <a href="/play#prototype" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-slate-950">
            Test prototype <ArrowUpRight className="h-4 w-4" />
          </a>
        </CasePanel>
      </section>

      <AnimatePresence>
        {afkOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-5 backdrop-blur-xl" onClick={() => setAfkOpen(false)}>
            <motion.div initial={{ scale: .9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .94, y: 18 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[2rem] border border-cyan-200/20 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/50">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/70">AFK Report</p>
                  <h3 className="font-display text-4xl font-black tracking-[-0.05em]">Welcome back!</h3>
                </div>
                <Trophy className="h-10 w-10 text-amber-200" />
              </div>
              <div className="grid gap-3">
                <Metric label="Campus Cash earned" value="$4,820" />
                <Metric label="Chaos prevented" value="-42 pts" />
                <Metric label="Reputation bonus" value="+6" />
              </div>
              <button onClick={() => setAfkOpen(false)} className="mt-6 w-full rounded-2xl bg-cyan-200 px-5 py-4 font-black text-slate-950">Collect rewards</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function CasePanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-cyan-300/15 bg-slate-950/70 p-6 shadow-2xl shadow-black/25 md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200/70">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-black leading-none tracking-[-0.05em] md:text-5xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><p className="text-xs font-black uppercase tracking-[0.22em] text-white/42">{label}</p><p className="mt-2 font-display text-2xl font-black text-white">{value}</p></div>
}

function PhonePrototype({ cash, chaos, rep, buildings, reward, eventVisible, onResolveEvent, onUpgrade, onOpenAfk }: { cash: number; chaos: number; rep: number; buildings: Building[]; reward: boolean; eventVisible: boolean; onResolveEvent: () => void; onUpgrade: (id: string) => void; onOpenAfk: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[3rem] border-[10px] border-black bg-black p-2 shadow-2xl shadow-cyan-950/60">
      <div className="relative min-h-[780px] overflow-hidden rounded-[2.35rem] bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-300 text-slate-950">
        <div className="absolute left-1/2 top-3 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative z-10 px-4 pb-4 pt-12">
          <div className="rounded-3xl border border-white/50 bg-white/78 p-4 shadow-xl backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Campus Chaos Tycoon</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Currency label="Cash" value={`$${cash.toLocaleString()}`} />
              <Currency label="Chaos" value={chaos.toString()} />
              <Currency label="Rep" value={`${rep}%`} />
            </div>
          </div>

          <div className="relative mt-4 h-[405px] overflow-hidden rounded-[2rem] border-4 border-white/50 bg-emerald-200 shadow-inner">
            <div className="absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 bg-amber-200/90" />
            <div className="absolute left-0 top-48 h-16 w-full bg-amber-200/90" />
            {[
              ['left-[12%] top-[15%]', '🍔', 'Canteen'],
              ['right-[8%] top-[18%]', '🖨️', 'Copy'],
              ['left-[23%] bottom-[9%]', '📚', 'Library'],
            ].map(([pos, emoji, label]) => <motion.div key={label} whileHover={{ scale: 1.06 }} className={`absolute ${pos} rounded-3xl border-2 border-white bg-white/85 p-3 text-center shadow-xl`}><div className="text-4xl">{emoji}</div><b className="text-xs">{label}</b></motion.div>)}
            {['🎒','🧑‍🎓','☕','📓','🏃'].map((student, index) => (
              <motion.div key={`${student}-${index}`} className="absolute text-2xl" initial={{ x: index * 54, y: 70 + index * 52 }} animate={{ x: [index * 45, 250 - index * 18, 40 + index * 20], y: [86 + index * 35, 180 + index * 18, 290 - index * 24] }} transition={{ duration: 7 + index, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}>{student}</motion.div>
            ))}
            <AnimatePresence>
              {eventVisible && (
                <motion.button initial={{ scale: .8, opacity: 0, y: -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: .7, opacity: 0 }} onClick={onResolveEvent} className="absolute left-5 right-5 top-5 rounded-3xl border-2 border-white bg-rose-500 p-4 text-left text-white shadow-2xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Campus Event</p>
                  <div className="mt-1 flex items-center justify-between"><b className="text-2xl">Printer Jam!</b><Zap className="h-6 w-6" /></div>
                  <p className="mt-1 text-sm font-bold text-white/80">Tap to fix and collect reward.</p>
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {reward && <motion.div initial={{ opacity: 0, y: 30, scale: .85 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30 }} className="absolute bottom-7 left-1/2 z-30 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-amber-200 shadow-xl">+ Reward collected ✨</motion.div>}
            </AnimatePresence>
          </div>

          <div className="mt-4 grid gap-3">
            {buildings.map((building) => (
              <div key={building.id} className="rounded-3xl border border-white/50 bg-white/82 p-3 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${building.color}`}>{building.icon}</div>
                    <div><b>{building.name}</b><p className="text-xs font-bold text-slate-500">Lv. {building.level} · +${building.income}/min</p></div>
                  </div>
                  <button disabled={building.status === 'Locked'} onClick={() => onUpgrade(building.id)} className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-black text-white disabled:bg-slate-400"><Plus className="inline h-3 w-3" /> Upgrade</button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={onOpenAfk} className="mt-4 w-full rounded-3xl bg-slate-950 px-5 py-4 font-black text-white shadow-xl">Open AFK Report</button>
        </div>
      </div>
    </div>
  )
}

function Currency({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-950 px-2 py-3 text-white"><p className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</p><p className="mt-1 text-sm font-black">{value}</p></div>
}
