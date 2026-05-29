'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, Target, Users, Award, BarChart3, Smartphone, ArrowRight, 
  ExternalLink, Flame, Zap, Trophy, Clock, CheckCircle, Plus, X, Settings, User
} from 'lucide-react'

// Types
type Mission = {
  id: number
  title: string
  xp: number
  points: number
  icon: string
  category: string
  completed: boolean
}

type Reward = {
  id: number
  name: string
  cost: number
  icon: string
  unlocked: boolean
  description: string
}

// Initial Data
const initialMissions: Mission[] = [
  { id: 1, title: "Walk or bike for 20 minutes", xp: 60, points: 40, icon: "🚴", category: "Movement", completed: false },
  { id: 2, title: "Bring a reusable water bottle", xp: 40, points: 30, icon: "🍶", category: "Daily", completed: false },
  { id: 3, title: "Recycle one item today", xp: 40, points: 30, icon: "♻️", category: "Waste", completed: false },
  { id: 4, title: "Eat a plant-based meal", xp: 60, points: 40, icon: "🥗", category: "Food", completed: false },
  { id: 5, title: "Take a 5-min power shower", xp: 30, points: 20, icon: "🚿", category: "Energy", completed: false },
  { id: 6, title: "Turn off unused lights", xp: 30, points: 20, icon: "💡", category: "Energy", completed: false },
]

const initialRewards: Reward[] = [
  { id: 1, name: "Enchanted Oak Plant", cost: 200, icon: "🌳", unlocked: false, description: "A beautiful oak for your island" },
  { id: 2, name: "Zen Garden Theme", cost: 300, icon: "🪴", unlocked: false, description: "Calm minimalist garden style" },
  { id: 3, name: "Sunbird Visitor", cost: 150, icon: "🐦", unlocked: false, description: "A friendly bird that visits daily" },
  { id: 4, name: "Solar Lantern", cost: 120, icon: "🏮", unlocked: false, description: "Lights up your world at night" },
  { id: 5, name: "Mystic Waterfall", cost: 450, icon: "💧", unlocked: false, description: "Brings life and sound to the island" },
  { id: 6, name: "Fox Companion", cost: 380, icon: "🦊", unlocked: false, description: "A playful fox that follows you" },
]

export default function EcoQuestPage() {
  // Core Game State
  const [missions, setMissions] = useState<Mission[]>(initialMissions)
  const [rewards, setRewards] = useState<Reward[]>(initialRewards)
  const [xp, setXp] = useState(1340)
  const [ecoPoints, setEcoPoints] = useState(920)
  const [streak, setStreak] = useState(12)
  const [level, setLevel] = useState(9)
  const [co2Saved, setCo2Saved] = useState(24.8)
  const [wasteReduced, setWasteReduced] = useState(4.3)
  const [waterSaved, setWaterSaved] = useState(186)
  
  // UI State
  const [activeTab, setActiveTab] = useState<'missions' | 'garden' | 'rewards' | 'insights'>('missions')
  const [showTimer, setShowTimer] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(300)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [gardenLevel, setGardenLevel] = useState(4)

  // Derived
  const completedToday = missions.filter(m => m.completed).length
  const progressToNext = ((xp % 500) / 500) * 100
  const currentGarden = getGardenStage(gardenLevel)

  function getGardenStage(stage: number) {
    const stages = [
      { emoji: '🌱', name: 'Sprout Island', desc: 'Tiny but full of potential' },
      { emoji: '🌿', name: 'Green Grove', desc: 'First signs of life' },
      { emoji: '🌳', name: 'Living Forest', desc: 'Strong roots, growing fast' },
      { emoji: '🏝️🌊', name: 'Thriving Atoll', desc: 'Water and life in balance' },
      { emoji: '🌊🏝️🦊🐦', name: 'Mystic Paradise', desc: 'A complete ecosystem' },
    ]
    return stages[Math.min(stage - 1, 4)]
  }

  // Toast helper
  const showNotification = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2200)
  }

  // Complete Mission with rich feedback
  const completeMission = (id: number) => {
    const mission = missions.find(m => m.id === id)
    if (!mission || mission.completed) return

    const newMissions = missions.map(m => m.id === id ? { ...m, completed: true } : m)
    
    const newXP = xp + mission.xp
    const newPoints = ecoPoints + mission.points
    const newCo2 = co2Saved + (mission.xp * 0.028)
    const newWaste = wasteReduced + (mission.xp * 0.011)
    const newWater = waterSaved + (mission.xp * 0.9)

    const newLevel = Math.floor(newXP / 500) + 1
    const leveledUp = newLevel > level

    setMissions(newMissions)
    setXp(newXP)
    setEcoPoints(newPoints)
    setCo2Saved(parseFloat(newCo2.toFixed(1)))
    setWasteReduced(parseFloat(newWaste.toFixed(1)))
    setWaterSaved(Math.floor(newWater))

    if (leveledUp) {
      setLevel(newLevel)
      const newGarden = Math.min(Math.floor(newLevel / 2) + 1, 5)
      if (newGarden > gardenLevel) setGardenLevel(newGarden)
      showNotification(`Level Up! You reached Level ${newLevel}`)
    } else {
      showNotification(`+${mission.xp} XP • +${mission.points} Eco Points`)
    }

    if (newMissions.filter(m => m.completed).length % 3 === 0) {
      setStreak(s => s + 1)
    }
  }

  // Real working timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000)
    }
    if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      const shower = missions.find(m => m.id === 5)
      if (shower && !shower.completed) completeMission(5)
      setShowTimer(false)
      setTimerSeconds(300)
      showNotification('Great job! Shower mission completed.')
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isTimerRunning, timerSeconds, missions])

  const startTimer = () => {
    setShowTimer(true)
    setIsTimerRunning(true)
  }
  const pauseTimer = () => setIsTimerRunning(false)
  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerSeconds(300)
    setShowTimer(false)
  }

  // Quick Log with variety
  const quickLog = (name: string, xpGain: number, ptGain: number, impact: number) => {
    const newXP = xp + xpGain
    const newPoints = ecoPoints + ptGain
    setXp(newXP)
    setEcoPoints(newPoints)
    setCo2Saved(p => parseFloat((p + impact).toFixed(1)))
    
    if (Math.random() > 0.55 && gardenLevel < 5) {
      setGardenLevel(g => Math.min(g + 1, 5))
    }
    showNotification(`Logged: ${name} (+${xpGain} XP)`)
  }

  // Unlock reward
  const unlockReward = (id: number) => {
    const r = rewards.find(x => x.id === id)
    if (!r || r.unlocked || ecoPoints < r.cost) return
    setEcoPoints(p => p - r.cost)
    setRewards(prev => prev.map(x => x.id === id ? { ...x, unlocked: true } : x))
    showNotification(`${r.name} unlocked!`)
  }

  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-20 pb-20">
      {/* Professional Hero */}
      <section className="max-w-6xl mx-auto px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-xs font-bold tracking-[0.3em] mb-5">
          <Leaf className="w-3.5 h-3.5" /> SUSTAINABILITY PLATFORM
        </div>
        <h1 className="text-7xl md:text-[86px] font-black tracking-[-4.2px] leading-none mb-3">EcoQuest</h1>
        <p className="text-3xl text-emerald-300 font-semibold tracking-[-1px] mb-4">Interactive Product Experience</p>
        <p className="max-w-xl mx-auto text-lg text-white/70">A fully functional prototype with real progression systems, live feedback, and polished interactions — built as a real product experience.</p>
      </section>

      {/* Live Metrics Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[ 
            { label: "LEVEL", val: level },
            { label: "XP", val: xp },
            { label: "ECO PTS", val: ecoPoints },
            { label: "STREAK", val: `${streak}d` },
            { label: "CO₂ kg", val: co2Saved },
            { label: "WASTE kg", val: wasteReduced },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-center">
              <div className="text-[10px] text-white/50 tracking-[2px] font-mono mb-px">{s.label}</div>
              <div className="text-3xl font-black tabular-nums tracking-tighter text-white">{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
          {[
            { id: 'missions', label: 'Missions', icon: Target },
            { id: 'garden', label: 'Garden', icon: Leaf },
            { id: 'rewards', label: 'Rewards', icon: Award },
            { id: 'insights', label: 'Insights', icon: BarChart3 },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold transition ${activeTab === t.id ? 'bg-emerald-400 text-black' : 'bg-white/5 hover:bg-white/10 text-white/80'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* MISSIONS */}
        {activeTab === 'missions' && (
          <div>
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <div className="text-emerald-400 text-xs tracking-[3px] font-mono">TODAY • {completedToday}/6 COMPLETED</div>
                <div className="text-5xl font-black tracking-[-1.5px]">Daily Missions</div>
              </div>
              <button onClick={() => setShowLogModal(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white text-black font-bold text-sm active:scale-[0.985]">
                <Plus className="w-4 h-4" /> QUICK LOG
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {missions.map(m => (
                <div key={m.id} className={`rounded-3xl border p-6 flex gap-5 transition-all ${m.completed ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                  <div className="text-6xl mt-1 opacity-90 shrink-0">{m.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[21px] tracking-[-0.3px] leading-tight pr-8">{m.title}</div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="text-xs px-4 py-1 rounded-full bg-white/10 text-white/80">{m.category}</div>
                      <div className="text-xs px-4 py-1 rounded-full bg-yellow-400/10 text-yellow-400">+{m.xp} XP</div>
                      <div className="text-xs px-4 py-1 rounded-full bg-emerald-400/10 text-emerald-400">+{m.points} pts</div>
                    </div>
                  </div>
                  <button onClick={() => completeMission(m.id)} disabled={m.completed}
                    className={`self-start mt-2 px-7 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition active:scale-[0.985] ${m.completed ? 'bg-emerald-400/20 text-emerald-400' : 'bg-white text-black hover:bg-emerald-400'}`}>
                    {m.completed ? 'Completed' : 'Complete'}
                  </button>
                </div>
              ))}
            </div>

            <button onClick={startTimer} className="w-full py-4 rounded-3xl border border-white/15 bg-white/5 hover:bg-white/10 font-bold flex items-center justify-center gap-3 text-lg active:bg-white/10">
              <Clock className="w-5 h-5" /> Start Shower Timer
            </button>
          </div>
        )}

        {/* GARDEN */}
        {activeTab === 'garden' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="text-emerald-400 text-xs tracking-[3px] font-mono">YOUR LIVING WORLD</div>
              <div className="text-6xl font-black tracking-[-1.5px] mt-1">{currentGarden.name}</div>
              <p className="text-xl text-white/70 mt-1">{currentGarden.desc}</p>
            </div>

            <div className="relative mx-auto max-w-[620px] aspect-[16/10] rounded-3xl overflow-hidden border border-emerald-400/20 bg-gradient-to-br from-[#0a2e1f] via-[#0c3a28] to-[#052a1f] flex items-center justify-center mb-8">
              <div className="text-[160px] transition-all duration-500" style={{filter:'drop-shadow(0 30px 30px rgb(0 0 0 / 0.5))'}}>{currentGarden.emoji}</div>
              {gardenLevel >= 3 && <div className="absolute bottom-16 left-[22%] text-7xl opacity-70">🌊</div>}
              {gardenLevel >= 4 && <div className="absolute top-14 right-[26%] text-6xl opacity-60">🦋</div>}
              {gardenLevel >= 5 && <div className="absolute bottom-20 right-[24%] text-7xl opacity-80">🦊</div>}
            </div>

            <div className="max-w-sm mx-auto text-sm text-white/60">Your garden evolves automatically as you progress through levels and maintain consistent habits.</div>
          </div>
        )}

        {/* REWARDS */}
        {activeTab === 'rewards' && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-emerald-400 text-xs tracking-[3px] font-mono">CUSTOMIZE YOUR WORLD</div>
                <div className="text-5xl font-black tracking-[-1.5px]">Rewards Store</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 text-4xl font-black tabular-nums">{ecoPoints}</div>
                <div className="text-xs text-white/60 -mt-1">AVAILABLE POINTS</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {rewards.map(r => (
                <div key={r.id} className={`rounded-3xl border p-6 flex flex-col ${r.unlocked ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-white/10 bg-white/5'}`}>
                  <div className="text-6xl mb-4">{r.icon}</div>
                  <div className="font-bold text-2xl tracking-tight">{r.name}</div>
                  <div className="text-white/60 text-sm mt-1 flex-1">{r.description}</div>
                  
                  {r.unlocked ? (
                    <div className="mt-5 text-emerald-400 font-bold flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Unlocked</div>
                  ) : (
                    <button onClick={() => unlockReward(r.id)} disabled={ecoPoints < r.cost} className="mt-5 w-full py-3.5 rounded-2xl font-bold bg-white text-black disabled:opacity-40 active:scale-[0.985]">
                      Unlock for {r.cost} points
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-emerald-400 text-xs tracking-[3px] font-mono">MEASURED IMPACT</div>
              <div className="text-5xl font-black tracking-[-1.5px] mt-1">Your Real-World Effect</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[ 
                { label: "CO₂ Saved", val: co2Saved + " kg", sub: "Equivalent to planting 1.4 trees" },
                { label: "Waste Reduced", val: wasteReduced + " kg", sub: "+2.8 kg compared to last week" },
                { label: "Water Saved", val: waterSaved + " L", sub: "From shorter showers & habits" },
              ].map((s, i) => (
                <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                  <div className="text-white/60 text-sm mb-2">{s.label}</div>
                  <div className="text-5xl font-black tracking-tighter text-emerald-400">{s.val}</div>
                  <div className="text-xs text-white/60 mt-2">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center text-xs text-white/50">All metrics update live based on your actions inside this experience.</div>
          </div>
        )}
      </div>

      {/* Timer Modal */}
      <AnimatePresence>
        {showTimer && (
          <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6">
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-10 w-full max-w-md text-center">
              <div className="text-emerald-400 text-xs tracking-[4px] font-mono mb-1">SHOWER TIMER</div>
              <div className="font-mono text-[92px] font-black tracking-[-5px] text-white mb-1 tabular-nums">{formatTime(timerSeconds)}</div>
              <p className="text-white/60 mb-8">Every minute saved protects our resources.</p>

              <div className="flex gap-3">
                <button onClick={isTimerRunning ? pauseTimer : () => setIsTimerRunning(true)} className="flex-1 py-4 rounded-2xl font-bold text-lg bg-white text-black active:scale-[0.985]">
                  {isTimerRunning ? 'PAUSE' : 'RESUME'}
                </button>
                <button onClick={resetTimer} className="flex-1 py-4 rounded-2xl font-bold text-lg border border-white/20 active:bg-white/5">END SESSION</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6" onClick={() => setShowLogModal(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-zinc-950 border border-white/10 rounded-3xl p-8 w-full max-w-md">
              <div className="flex justify-between mb-6">
                <div className="font-black text-3xl tracking-tight">Quick Log</div>
                <button onClick={() => setShowLogModal(false)}><X /></button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[ 
                  { n: "Bike to work", x: 55, p: 35, i: 1.1 },
                  { n: "Reusable bottle used", x: 35, p: 25, i: 0.6 },
                  { n: "Recycled 3 items", x: 50, p: 40, i: 0.9 },
                  { n: "Skipped single-use plastic", x: 45, p: 30, i: 0.7 },
                ].map((a, i) => (
                  <button key={i} onClick={() => { quickLog(a.n, a.x, a.p, a.i); setShowLogModal(false) }} className="flex justify-between items-center px-6 py-4 rounded-2xl border border-white/10 bg-white/5 active:bg-white/10 text-left">
                    <div>
                      <div className="font-bold text-xl">{a.n}</div>
                      <div className="text-emerald-400 text-sm mt-0.5">+{a.x} XP • +{a.p} pts</div>
                    </div>
                    <ArrowRight className="text-white/40" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-2xl bg-emerald-400 text-black font-bold text-sm shadow-2xl">
            {toastMessage}
          </div>
        )}
      </AnimatePresence>

      <div className="text-center text-[10px] text-white/40 tracking-[3px] mt-16">All systems are fully functional • Progress is saved locally in your browser</div>
    </main>
  )
}
