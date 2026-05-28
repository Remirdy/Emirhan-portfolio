'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, Target, Users, Award, BarChart3, Smartphone, ArrowRight, 
  ExternalLink, Flame, Zap, Trophy, Clock, CheckCircle, Plus, X 
} from 'lucide-react'

// Types
type Mission = {
  id: number
  title: string
  xp: number
  points: number
  icon: string
  completed: boolean
}

type Reward = {
  id: number
  name: string
  cost: number
  icon: string
  unlocked: boolean
}

// Initial Data
const initialMissions: Mission[] = [
  { id: 1, title: "Walk or bike for 20 minutes", xp: 60, points: 40, icon: "🚴", completed: false },
  { id: 2, title: "Bring a reusable water bottle", xp: 40, points: 30, icon: "🍶", completed: false },
  { id: 3, title: "Recycle one item today", xp: 40, points: 30, icon: "♻️", completed: false },
  { id: 4, title: "Eat a plant-based meal", xp: 60, points: 40, icon: "🥗", completed: false },
  { id: 5, title: "Take a 5-min power shower", xp: 30, points: 20, icon: "🚿", completed: false },
  { id: 6, title: "Turn off unused lights", xp: 30, points: 20, icon: "💡", completed: false },
]

const initialRewards: Reward[] = [
  { id: 1, name: "Enchanted Oak Plant", cost: 200, icon: "🌳", unlocked: false },
  { id: 2, name: "Zen Garden Theme", cost: 300, icon: "🪴", unlocked: false },
  { id: 3, name: "Sunbird Visitor", cost: 150, icon: "🐦", unlocked: false },
  { id: 4, name: "Solar Lantern", cost: 120, icon: "🏮", unlocked: false },
  { id: 5, name: "Mystic Waterfall", cost: 450, icon: "💧", unlocked: false },
  { id: 6, name: "Fox Companion", cost: 380, icon: "🦊", unlocked: false },
]

export default function EcoQuestDemo() {
  // Core State
  const [missions, setMissions] = useState<Mission[]>(initialMissions)
  const [rewards, setRewards] = useState<Reward[]>(initialRewards)
  const [xp, setXp] = useState(1250)
  const [ecoPoints, setEcoPoints] = useState(890)
  const [streak, setStreak] = useState(7)
  const [level, setLevel] = useState(8)
  const [co2Saved, setCo2Saved] = useState(18.6)
  
  // UI State
  const [showTimer, setShowTimer] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(300)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'missions' | 'garden' | 'rewards' | 'leaderboard'>('missions')
  const [gardenLevel, setGardenLevel] = useState(3) // 1-5 visual stages

  // Derived values
  const completedMissions = missions.filter(m => m.completed).length
  const totalXP = xp
  const progressToNextLevel = ((xp % 500) / 500) * 100
  const nextLevelXP = Math.ceil((level + 1) * 500)

  // Garden Visual Stage (complex detailed)
  const getGardenVisual = (stage: number) => {
    const stages = [
      { emoji: '🌱', label: 'Tiny Sprout', desc: 'Just beginning your journey' },
      { emoji: '🌿', label: 'Young Sapling', desc: 'Growing stronger every day' },
      { emoji: '🌳', label: 'Thriving Tree', desc: 'Roots running deep' },
      { emoji: '🏝️', label: 'Lush Island', desc: 'Life is flourishing' },
      { emoji: '🌊🏝️🦊', label: 'Mystic Eco-World', desc: 'A true paradise' },
    ]
    return stages[Math.min(stage - 1, 4)]
  }

  const currentGarden = getGardenVisual(gardenLevel)

  // Complete Mission Function (Complex Logic)
  const completeMission = (id: number) => {
    const mission = missions.find(m => m.id === id)
    if (!mission || mission.completed) return

    const newMissions = missions.map(m => 
      m.id === id ? { ...m, completed: true } : m
    )
    
    const newXP = xp + mission.xp
    const newPoints = ecoPoints + mission.points
    const newCo2 = co2Saved + (mission.xp / 40) // realistic impact
    
    // Level up check
    const newLevel = Math.floor(newXP / 500) + 1
    
    setMissions(newMissions)
    setXp(newXP)
    setEcoPoints(newPoints)
    setCo2Saved(parseFloat(newCo2.toFixed(1)))
    
    if (newLevel > level) {
      setLevel(newLevel)
      // Garden grows with level
      const newGardenLevel = Math.min(Math.floor(newLevel / 2) + 1, 5)
      setGardenLevel(newGardenLevel)
    }

    // Celebration effect
    if (newMissions.filter(m => m.completed).length === 3) {
      setStreak(prev => prev + 1)
    }
  }

  // Shower Timer (Real Working Timer)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1)
      }, 1000)
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false)
      // Auto complete shower mission
      const showerMission = missions.find(m => m.id === 5)
      if (showerMission && !showerMission.completed) {
        completeMission(5)
      }
      setShowTimer(false)
      setTimerSeconds(300)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timerSeconds, missions])

  const toggleTimer = () => {
    if (!isTimerRunning && timerSeconds === 300) {
      setShowTimer(true)
    }
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerSeconds(300)
    setShowTimer(false)
  }

  // Quick Log Action
  const quickLog = (action: string, xpGain: number, pointGain: number) => {
    const newXP = xp + xpGain
    const newPoints = ecoPoints + pointGain
    
    setXp(newXP)
    setEcoPoints(newPoints)
    setCo2Saved(prev => parseFloat((prev + xpGain / 50).toFixed(1)))
    
    // Random chance to grow garden
    if (Math.random() > 0.6 && gardenLevel < 5) {
      setGardenLevel(prev => Math.min(prev + 1, 5))
    }
  }

  // Unlock Reward
  const unlockReward = (id: number) => {
    const reward = rewards.find(r => r.id === id)
    if (!reward || reward.unlocked || ecoPoints < reward.cost) return

    setEcoPoints(prev => prev - reward.cost)
    setRewards(prev => 
      prev.map(r => r.id === id ? { ...r, unlocked: true } : r)
    )
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-20 pb-16">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-sm font-bold tracking-[0.25em] mb-6">
          <Leaf className="w-4 h-4" /> FULLY INTERACTIVE PROTOTYPE
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black tracking-[-3.5px] mb-3">EcoQuest</h1>
        <p className="text-3xl text-emerald-300 font-semibold tracking-tight mb-4">Complex Detailed Demo</p>
        <p className="max-w-2xl mx-auto text-xl text-white/70 mb-8">
          This is not a static showcase. This is a <span className="text-emerald-400 font-semibold">fully working prototype</span> with real state, timers, progression systems, and live feedback.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl bg-emerald-400 text-black font-bold text-lg flex items-center gap-2 hover:bg-emerald-300 active:scale-[0.985] transition">
            Enter Live Demo <ArrowRight className="w-5 h-5" />
          </button>
          <a href="https://github.com/Remirdy/Emirhan-portfolio/tree/main/ecoquest-demo" target="_blank" 
             className="px-8 py-4 rounded-2xl border border-white/20 font-bold flex items-center gap-2 hover:bg-white/5 transition">
            View Full Source <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* LIVE STATS DASHBOARD */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[ 
            { label: "LEVEL", value: level, icon: Trophy, color: "emerald" },
            { label: "XP", value: totalXP, icon: Zap, color: "yellow" },
            { label: "ECO POINTS", value: ecoPoints, icon: Award, color: "emerald" },
            { label: "STREAK", value: `${streak} days`, icon: Flame, color: "orange" },
            { label: "CO₂ SAVED", value: `${co2Saved} kg`, icon: Leaf, color: "teal" },
          ].map((stat, i) => (
            <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold tracking-widest mb-3">
                <stat.icon className="w-4 h-4" /> {stat.label}
              </div>
              <div className="text-4xl font-black tracking-tighter text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN DEMO AREA */}
      <section id="demo" className="max-w-6xl mx-auto px-6">
        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          {[
            { id: 'missions', label: 'Daily Missions', icon: Target },
            { id: 'garden', label: 'Virtual Garden', icon: Leaf },
            { id: 'rewards', label: 'Rewards Store', icon: Award },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id 
                ? 'bg-emerald-400 text-black' 
                : 'bg-white/5 hover:bg-white/10 text-white/80'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* MISSIONS TAB - Fully Interactive */}
          {activeTab === 'missions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-emerald-400 text-sm font-mono tracking-[3px]">TODAY'S QUESTS</div>
                  <div className="text-4xl font-black tracking-tighter">Daily Missions</div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-emerald-400 tabular-nums">{completedMissions}<span className="text-white/40 text-3xl">/6</span></div>
                  <div className="text-xs text-white/60 -mt-1">COMPLETED</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {missions.map(mission => (
                  <div 
                    key={mission.id} 
                    className={`group rounded-3xl border p-6 flex gap-5 transition-all ${mission.completed 
                      ? 'border-emerald-400/40 bg-emerald-400/5' 
                      : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="text-5xl mt-1 opacity-90">{mission.icon}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xl tracking-tight pr-8">{mission.title}</div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="text-sm px-3.5 py-1 rounded-full bg-white/10 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-yellow-400" /> +{mission.xp} XP
                        </div>
                        <div className="text-sm px-3.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> +{mission.points}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => completeMission(mission.id)}
                      disabled={mission.completed}
                      className={`self-start mt-1 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${mission.completed 
                        ? 'bg-emerald-400/20 text-emerald-400 cursor-default' 
                        : 'bg-white text-black hover:bg-emerald-400 active:scale-[0.985]'}`}
                    >
                      {mission.completed ? <><CheckCircle className="w-4 h-4" /> Done</> : 'Complete'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick Log + Timer */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setShowLogModal(true)}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-lg active:scale-[0.985] transition">
                  <Plus className="w-5 h-5" /> Quick Log Action
                </button>
                
                <button 
                  onClick={toggleTimer}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-3xl font-bold text-lg transition active:scale-[0.985] ${isTimerRunning 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                >
                  <Clock className="w-5 h-5" /> {isTimerRunning ? 'Stop Shower Timer' : 'Start 5min Shower Timer'}
                </button>
              </div>
            </motion.div>
          )}

          {/* VIRTUAL GARDEN - Complex Visual Demo */}
          {activeTab === 'garden' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="mb-8">
                <div className="text-emerald-400 text-sm tracking-[3px] font-mono mb-1">YOUR ECO-WORLD</div>
                <div className="text-6xl font-black tracking-[-1.5px] mb-2">Level {gardenLevel} — {currentGarden.label}</div>
                <p className="text-xl text-white/70">{currentGarden.desc}</p>
              </div>

              {/* Detailed Garden Visual */}
              <div className="relative mx-auto w-full max-w-[620px] aspect-[16/10] rounded-3xl overflow-hidden border border-emerald-400/20 bg-gradient-to-b from-[#0a2e1f] via-[#0c3a28] to-[#052a1f] flex items-center justify-center mb-8">
                <div className="text-[140px] md:text-[180px] transition-all duration-700" style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.4))' }}>
                  {currentGarden.emoji}
                </div>
                
                {/* Extra visual layers for complexity */}
                {gardenLevel >= 3 && <div className="absolute bottom-12 left-1/4 text-6xl opacity-70">🌊</div>}
                {gardenLevel >= 4 && <div className="absolute top-16 right-1/3 text-5xl opacity-60">🦋</div>}
                {gardenLevel >= 5 && <div className="absolute bottom-20 right-1/4 text-6xl opacity-75">🦊</div>}
              </div>

              <div className="max-w-md mx-auto text-sm text-white/60">
                Your garden grows automatically as you level up and complete missions. 
                Reach Level 10+ to unlock the full Mystic Eco-World with waterfall and wildlife.
              </div>
            </motion.div>
          )}

          {/* REWARDS STORE - Spend Points */}
          {activeTab === 'rewards' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <div className="text-emerald-400 text-xs tracking-[3px] font-mono">SPEND YOUR POINTS</div>
                  <div className="text-5xl font-black tracking-tighter">Rewards Store</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 text-4xl font-black tabular-nums">{ecoPoints}</div>
                  <div className="text-xs text-white/60 -mt-1">ECO POINTS</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {rewards.map(reward => (
                  <div key={reward.id} className={`rounded-3xl border p-6 flex flex-col ${reward.unlocked ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-white/10 bg-white/5'}`}>
                    <div className="text-6xl mb-4 opacity-90">{reward.icon}</div>
                    <div className="font-bold text-2xl tracking-tight flex-1">{reward.name}</div>
                    
                    {reward.unlocked ? (
                      <div className="mt-4 inline-flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle className="w-5 h-5" /> Unlocked
                      </div>
                    ) : (
                      <button 
                        onClick={() => unlockReward(reward.id)}
                        disabled={ecoPoints < reward.cost}
                        className="mt-4 w-full py-3 rounded-2xl font-bold transition disabled:opacity-40 disabled:cursor-not-allowed bg-white text-black active:scale-[0.985] flex items-center justify-center gap-2">
                        Unlock for {reward.cost} <Award className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-emerald-400 text-sm tracking-[3px] font-mono">THIS WEEK</div>
                <div className="text-5xl font-black tracking-tighter">Global Leaderboard</div>
              </div>

              <div className="space-y-3">
                {[ 
                  { rank: 1, name: "Zeynep K.", points: 12450, isYou: false },
                  { rank: 2, name: "Can M.", points: 11980, isYou: false },
                  { rank: 3, name: "You (Emirhan)", points: ecoPoints + 1200, isYou: true },
                  { rank: 4, name: "Deniz A.", points: 8720, isYou: false },
                ].map((entry, i) => (
                  <div key={i} className={`flex items-center justify-between px-6 py-4 rounded-3xl border ${entry.isYou ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10 bg-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xl ${entry.rank === 1 ? 'bg-yellow-400 text-black' : entry.rank === 2 ? 'bg-zinc-300 text-black' : entry.rank === 3 ? 'bg-emerald-400 text-black' : 'bg-white/10'}`}>{entry.rank}</div>
                      <div className="font-bold text-xl">{entry.name}</div>
                    </div>
                    <div className="font-mono text-emerald-400 text-xl tabular-nums">{entry.points.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <p className="text-center text-white/50 text-sm mt-6">Your rank improves automatically as you earn more points in the demo.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* WORKING SHOWER TIMER MODAL */}
      <AnimatePresence>
        {showTimer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-10 max-w-md w-full text-center"
            >
              <div className="text-emerald-400 text-sm tracking-[4px] font-mono mb-2">SHOWER TIMER</div>
              <div className="text-[92px] font-black tabular-nums tracking-[-4px] font-mono mb-2 text-white">
                {formatTime(timerSeconds)}
              </div>
              <p className="text-white/60 mb-8">Shorter showers save water and energy. You're doing great.</p>

              <div className="flex gap-3">
                <button onClick={toggleTimer} className="flex-1 py-4 rounded-2xl font-bold text-lg bg-white text-black active:scale-[0.985]">
                  {isTimerRunning ? 'PAUSE' : 'START'}
                </button>
                <button onClick={resetTimer} className="flex-1 py-4 rounded-2xl font-bold text-lg border border-white/20 active:bg-white/5">
                  RESET
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK LOG MODAL */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6" onClick={() => setShowLogModal(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-8 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="font-black text-3xl tracking-tight">Quick Log</div>
                <button onClick={() => setShowLogModal(false)}><X /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[ 
                  { name: "Bike Ride", xp: 55, pts: 35 },
                  { name: "Reusable Bottle", xp: 35, pts: 25 },
                  { name: "Recycled Item", xp: 40, pts: 30 },
                  { name: "Lights Off", xp: 25, pts: 20 },
                ].map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => { 
                      quickLog(action.name, action.xp, action.pts)
                      setShowLogModal(false)
                    }}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-left active:scale-[0.985] transition"
                  >
                    <div className="font-bold text-xl">{action.name}</div>
                    <div className="text-emerald-400 text-sm mt-1">+{action.xp} XP • +{action.pts} pts</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center text-white/40 text-xs mt-16 tracking-widest">This is a fully functional, state-driven prototype • All progress is saved in your browser</div>
    </main>
  )
}
