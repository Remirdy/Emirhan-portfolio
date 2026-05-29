'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, Target, Award, BarChart3, Clock, CheckCircle, Plus, X, 
  Wifi, Battery, Globe, Flame, Trophy, Play, Pause, RotateCcw, AlertCircle
} from 'lucide-react'
import s from './PhoneSimulator.module.css'

// Types
type Mission = {
  id: number
  titleEn: string
  titleTr: string
  xp: number
  points: number
  icon: string
  categoryEn: string
  categoryTr: string
  completed: boolean
}

type Reward = {
  id: number
  nameEn: string
  nameTr: string
  cost: number
  icon: string
  unlocked: boolean
  descEn: string
  descTr: string
}

type QuickLogItem = {
  nameEn: string
  nameTr: string
  xp: number
  points: number
  impact: number
}

// Initial Data
const initialMissions: Mission[] = [
  { id: 1, titleEn: "Walk or bike for 20 minutes", titleTr: "20 dk yürü veya bisiklete bin", xp: 60, points: 40, icon: "🚴", categoryEn: "Movement", categoryTr: "Hareket", completed: false },
  { id: 2, titleEn: "Bring a reusable water bottle", titleTr: "Matara/şişe kullan", xp: 40, points: 30, icon: "🍶", categoryEn: "Daily", categoryTr: "Günlük", completed: false },
  { id: 3, titleEn: "Recycle one item today", titleTr: "Bir eşyayı geri dönüştür", xp: 40, points: 30, icon: "♻️", categoryEn: "Waste", categoryTr: "Atık", completed: false },
  { id: 4, titleEn: "Eat a plant-based meal", titleTr: "Bitki bazlı öğün tüket", xp: 60, points: 40, icon: "🥗", categoryEn: "Food", categoryTr: "Besin", completed: false },
  { id: 5, titleEn: "Take a 5-min power shower", titleTr: "5 dakikalık hızlı duş al", xp: 30, points: 20, icon: "🚿", categoryEn: "Energy", categoryTr: "Enerji", completed: false },
  { id: 6, titleEn: "Turn off unused lights", titleTr: "Gereksiz ışıkları kapat", xp: 30, points: 20, icon: "💡", categoryEn: "Energy", categoryTr: "Enerji", completed: false },
]

const initialRewards: Reward[] = [
  { id: 1, nameEn: "Enchanted Oak Plant", nameTr: "Efsunlu Meşe Ağacı", cost: 200, icon: "🌳", unlocked: false, descEn: "A beautiful oak for your island", descTr: "Adanız için görkemli meşe ağacı" },
  { id: 2, nameEn: "Zen Garden Theme", nameTr: "Zen Bahçesi Teması", cost: 300, icon: "🪴", unlocked: false, descEn: "Calm minimalist garden style", descTr: "Sakin minimalist bahçe stili" },
  { id: 3, nameEn: "Sunbird Visitor", nameTr: "Güneş Kuşu Misafiri", cost: 150, icon: "🐦", unlocked: false, descEn: "A friendly bird that visits daily", descTr: "Günlük ziyaretçi tatlı bir kuş" },
  { id: 4, nameEn: "Solar Lantern", nameTr: "Güneş Enerjili Fener", cost: 120, icon: "🏮", unlocked: false, descEn: "Lights up your world at night", descTr: "Geceleri adanızı aydınlatır" },
  { id: 5, nameEn: "Mystic Waterfall", nameTr: "Mistik Şelale", cost: 450, icon: "💧", unlocked: false, descEn: "Brings life and sound to the island", descTr: "Adaya hayat ve su şırıltısı katar" },
  { id: 6, nameEn: "Fox Companion", nameTr: "Tilki Dost", cost: 380, icon: "🦊", unlocked: false, descEn: "A playful fox that follows you", descTr: "Adaya yerleşen sevimli bir tilki" },
]

const quickLogItems: QuickLogItem[] = [
  { nameEn: "Bike to work", nameTr: "İşe bisikletle git", xp: 55, points: 35, impact: 1.1 },
  { nameEn: "Reusable bottle used", nameTr: "Matara kullanıldı", xp: 35, points: 25, impact: 0.6 },
  { nameEn: "Recycled 3 items", nameTr: "3 atık geri dönüştürüldü", xp: 50, points: 40, impact: 0.9 },
  { nameEn: "Skipped single-use plastic", nameTr: "Plastik poşet/şişe reddedildi", xp: 45, points: 30, impact: 0.7 },
]

const gardenStages = [
  { emoji: '🌱', nameEn: 'Sprout Island', nameTr: 'Filiz Adası', descEn: 'Tiny but full of potential', descTr: 'Küçük ama potansiyel dolu' },
  { emoji: '🌿', nameEn: 'Green Grove', nameTr: 'Yeşil Koru', descEn: 'First signs of life', descTr: 'Yaşamın ilk belirtileri' },
  { emoji: '🌳', nameEn: 'Living Forest', nameTr: 'Yaşayan Orman', descEn: 'Strong roots, growing fast', descTr: 'Güçlü kökler, hızlı büyüme' },
  { emoji: '🏝️🌊', nameEn: 'Thriving Atoll', nameTr: 'Coşkun Atol', descEn: 'Water and life in balance', descTr: 'Su ve yaşam dengede' },
  { emoji: '🌊🏝️🦊🐦', nameEn: 'Mystic Paradise', nameTr: 'Mistik Cennet', descEn: 'A complete ecosystem', descTr: 'Eksiksiz bir ekosistem' },
]

export default function PhoneSimulator() {
  // Localization state ('en' or 'tr')
  const [lang, setLang] = useState<'en' | 'tr'>('tr')

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

  // System State
  const [timeStr, setTimeStr] = useState('23:30')
  const [batteryPercent, setBatteryPercent] = useState(88)

  // Derived values
  const completedToday = missions.filter(m => m.completed).length
  const progressToNext = ((xp % 500) / 500) * 100
  const currentGarden = useMemo(() => {
    const stage = Math.min(gardenLevel - 1, 4)
    return gardenStages[stage]
  }, [gardenLevel])

  // Update clock & battery simulating reality
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 15000)
    return () => clearInterval(interval)
  }, [])

  // Dynamic status text translating dictionary
  const t = {
    missions: lang === 'tr' ? 'Görevler' : 'Missions',
    garden: lang === 'tr' ? 'Bahçem' : 'My Garden',
    rewards: lang === 'tr' ? 'Ödüller' : 'Shop',
    insights: lang === 'tr' ? 'Analiz' : 'Insights',
    level: lang === 'tr' ? 'SEVİYE' : 'LEVEL',
    streak: lang === 'tr' ? 'GÜN' : 'STREAK',
    points: lang === 'tr' ? 'PUAN' : 'PTS',
    today: lang === 'tr' ? 'BUGÜN' : 'TODAY',
    completed: lang === 'tr' ? 'TAMAMLANDI' : 'COMPLETED',
    quickLog: lang === 'tr' ? 'KAYIT EKLE' : 'QUICK LOG',
    startTimerBtn: lang === 'tr' ? 'Duş Kronometresini Başlat' : 'Start Shower Timer',
    unlockedText: lang === 'tr' ? 'Kilidi Açıldı' : 'Unlocked',
    unlockBtn: lang === 'tr' ? 'Puanla Kilit Aç' : 'Unlock with',
    co2Label: lang === 'tr' ? 'CO₂ Tasarrufu' : 'CO₂ Saved',
    wasteLabel: lang === 'tr' ? 'Geri Dönüşüm' : 'Waste Reduced',
    waterLabel: lang === 'tr' ? 'Su Tasarrufu' : 'Water Saved',
    insightsDesc: lang === 'tr' ? 'Portfolyoda yaptığınız tüm eylemler anlık olarak etkiyi günceller.' : 'All metrics update live based on your actions in this simulator.',
    toastLevelUp: lang === 'tr' ? 'Seviye Atladınız! Seviye' : 'Leveled Up! You are now Level',
    showerTimerTitle: lang === 'tr' ? 'DUŞ KRONOMETRESİ' : 'SHOWER STOPWATCH',
    timerSavingText: lang === 'tr' ? 'Tasarruf edilen her dakika geleceğimizi korur.' : 'Every minute saved protects our future.',
    timerEndBtn: lang === 'tr' ? 'DUŞU BİTİR' : 'END SHOWER',
    timerPause: lang === 'tr' ? 'DURAKLAT' : 'PAUSE',
    timerResume: lang === 'tr' ? 'BAŞLAT' : 'RESUME',
    quickLogTitle: lang === 'tr' ? 'Çevre Hareketi Kaydet' : 'Log Eco Action',
    quickLogDesc: lang === 'tr' ? 'Gerçekleştirdiğiniz yeşil alışkanlığı seçin.' : 'Select a green habit you completed just now.',
    livingWorld: lang === 'tr' ? 'YAŞAYAN ADANIZ' : 'YOUR LIVING ISLAND',
    gardenHint: lang === 'tr' ? 'Bahçeniz seviye atladıkça ve ödül aldıkça otomatik gelişir.' : 'Your garden grows as you level up and purchase shop items.',
  }

  // Toast notifier
  const triggerNotification = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  // Complete mission with state calculations
  const completeMission = (id: number) => {
    const mission = missions.find(m => m.id === id)
    if (!mission || mission.completed) return

    const newMissions = missions.map(m => m.id === id ? { ...m, completed: true } : m)
    const xpReward = mission.xp
    const ptReward = mission.points

    const newXP = xp + xpReward
    const newPoints = ecoPoints + ptReward
    const newCo2 = co2Saved + (xpReward * 0.025)
    const newWaste = wasteReduced + (xpReward * 0.012)
    const newWater = waterSaved + (xpReward * 0.85)

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
      triggerNotification(`${t.toastLevelUp} ${newLevel}! 🎉`)
    } else {
      triggerNotification(`+${xpReward} XP • +${ptReward} ${t.points}`)
    }

    if (newMissions.filter(m => m.completed).length % 3 === 0) {
      setStreak(prev => prev + 1)
    }
  }

  // Active Timer Hook
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null
    if (isTimerRunning && timerSeconds > 0) {
      timerInterval = setInterval(() => {
        setTimerSeconds(s => s - 1)
      }, 1000)
    }
    if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      const showerMission = missions.find(m => m.id === 5)
      if (showerMission && !showerMission.completed) {
        completeMission(5)
      }
      setShowTimer(false)
      setTimerSeconds(300)
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [isTimerRunning, timerSeconds])

  // Start & Control Timer
  const handleStartTimer = () => {
    setShowTimer(true)
    setIsTimerRunning(true)
  }
  const handleToggleTimer = () => setIsTimerRunning(!isTimerRunning)
  const handleResetTimer = () => {
    setIsTimerRunning(false)
    setTimerSeconds(300)
    setShowTimer(false)
  }

  // Quick action logging
  const handleQuickLog = (item: QuickLogItem) => {
    const newXP = xp + item.xp
    const newPoints = ecoPoints + item.points
    const newCo2 = co2Saved + item.impact

    setXp(newXP)
    setEcoPoints(newPoints)
    setCo2Saved(parseFloat(newCo2.toFixed(1)))

    const newLevel = Math.floor(newXP / 500) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      const newGarden = Math.min(Math.floor(newLevel / 2) + 1, 5)
      if (newGarden > gardenLevel) setGardenLevel(newGarden)
      triggerNotification(`${t.toastLevelUp} ${newLevel}! 🎉`)
    } else {
      triggerNotification(lang === 'tr' ? `Kaydedildi: ${item.nameTr} (+${item.xp} XP)` : `Logged: ${item.nameEn} (+${item.xp} XP)`)
    }

    setShowLogModal(false)
  }

  // Store action unlock
  const handleUnlockReward = (id: number) => {
    const item = rewards.find(r => r.id === id)
    if (!item || item.unlocked || ecoPoints < item.cost) return

    setEcoPoints(pts => pts - item.cost)
    setRewards(prev => prev.map(r => r.id === id ? { ...r, unlocked: true } : r))
    
    // Increment garden items representation
    if (gardenLevel < 5) {
      setGardenLevel(g => Math.min(g + 1, 5))
    }

    triggerNotification(lang === 'tr' ? `${item.nameTr} açıldı! 🌸` : `${item.nameEn} unlocked! 🌸`)
  }

  // Format stopwatch
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={s.wrapper}>
      {/* Phone Hardware Shell */}
      <div className={s.phoneShell}>
        {/* Bezel details */}
        <div className={s.speaker} />
        <div className={s.leftButtons}>
          <div className={s.btnVolumeUp} />
          <div className={s.btnVolumeDown} />
        </div>
        <div className={s.rightButton} />

        {/* Screen Frame */}
        <div className={s.screen}>
          {/* Glass reflection gradient overlay */}
          <div className={s.reflection} />

          {/* iOS-like Dynamic Island */}
          <div className={`${s.dynamicIsland} ${isTimerRunning ? s.islandActive : ''}`} onClick={() => isTimerRunning && setShowTimer(true)}>
            {isTimerRunning ? (
              <div className={s.islandContent}>
                <span className={s.islandIcon}>🚿</span>
                <span className={s.islandTimer}>{formatTime(timerSeconds)}</span>
              </div>
            ) : (
              <div className={s.cameraLens} />
            )}
          </div>

          {/* Phone Status Bar */}
          <div className={s.statusBar}>
            <div className={s.time}>{timeStr}</div>
            <div className={s.statusIcons}>
              {/* Language Switch Button */}
              <button className={s.langBadge} onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')}>
                <Globe className={s.globeSvg} />
                <span>{lang.toUpperCase()}</span>
              </button>
              <Wifi className={s.wifiIcon} />
              <div className={s.batteryWrap}>
                <span>{batteryPercent}%</span>
                <Battery className={s.batteryIcon} />
              </div>
            </div>
          </div>

          {/* App Core Container */}
          <div className={s.appContainer}>
            {/* Header User Panel */}
            <div className={s.appHeader}>
              <div className={s.userInfo}>
                <div className={s.avatar}>🌱</div>
                <div>
                  <div className={s.welcome}>Merhaba, Emirhan!</div>
                  <div className={s.userLevel}>{t.level} {level}</div>
                </div>
              </div>
              <div className={s.streakPill}>
                <Flame className={s.flameIcon} />
                <span>{streak} {t.streak}</span>
              </div>
            </div>

            {/* Level Progression Progress Bar */}
            <div className={s.progressContainer}>
              <div className={s.progressLabels}>
                <span>XP {xp}</span>
                <span>{level * 500} XP</span>
              </div>
              <div className={s.progressBar}>
                <motion.div className={s.progressFill} initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>

            {/* In-App Tab Content */}
            <div className={s.tabView}>
              <AnimatePresence mode="wait">
                {/* 1. MISSIONS TAB */}
                {activeTab === 'missions' && (
                  <motion.div className={s.scrollArea} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} key="missions-tab">
                    <div className={s.tabTitleRow}>
                      <div>
                        <h3>{t.missions}</h3>
                        <p>{t.today} • {completedToday}/{missions.length} {t.completed}</p>
                      </div>
                      <button className={s.quickLogBtn} onClick={() => setShowLogModal(true)}>
                        <Plus />
                      </button>
                    </div>

                    <div className={s.missionList}>
                      {missions.map(m => (
                        <div key={m.id} className={`${s.missionCard} ${m.completed ? s.completedCard : ''}`}>
                          <div className={s.missionIcon}>{m.icon}</div>
                          <div className={s.missionInfo}>
                            <h4>{lang === 'tr' ? m.titleTr : m.titleEn}</h4>
                            <div className={s.missionRewards}>
                              <span className={s.rewardTag}>+{m.xp} XP</span>
                              <span className={s.pointTag}>+{m.points} {t.points}</span>
                            </div>
                          </div>
                          <button className={`${s.doneBtn} ${m.completed ? s.doneBtnCompleted : ''}`} onClick={() => completeMission(m.id)} disabled={m.completed}>
                            {m.completed ? <CheckCircle /> : <Play />}
                          </button>
                        </div>
                      ))}
                    </div>

                    <button className={s.powerShowerBanner} onClick={handleStartTimer}>
                      <Clock className={s.clockIconAnim} />
                      <span>{t.startTimerBtn}</span>
                    </button>
                  </motion.div>
                )}

                {/* 2. GARDEN TAB */}
                {activeTab === 'garden' && (
                  <motion.div className={s.scrollArea} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} key="garden-tab">
                    <div className={s.gardenHeader}>
                      <span className={s.gardenBadge}>{t.livingWorld}</span>
                      <h3>{lang === 'tr' ? currentGarden.nameTr : currentGarden.nameEn}</h3>
                      <p>{lang === 'tr' ? currentGarden.descTr : currentGarden.descEn}</p>
                    </div>

                    {/* Highly interactive Garden Render Box */}
                    <div className={s.gardenRenderZone}>
                      {/* Floating glowing background sparks */}
                      <div className={s.gardenAmbient} />
                      
                      {/* Interactive visual layout */}
                      <div className={s.mainGardenEmoji}>
                        {currentGarden.emoji}
                      </div>

                      {/* Displaying dynamically unlocked shop decoration ornaments overlay */}
                      {rewards[0].unlocked && <div className={s.decorOak}>🌳</div>}
                      {rewards[2].unlocked && <div className={s.decorBird}>🐦</div>}
                      {rewards[3].unlocked && <div className={s.decorLantern}>🏮</div>}
                      {rewards[4].unlocked && <div className={s.decorWaterfall}>💧</div>}
                      {rewards[5].unlocked && <div className={s.decorFox}>🦊</div>}
                    </div>

                    <div className={s.gardenFooterDesc}>
                      <AlertCircle />
                      <p>{t.gardenHint}</p>
                    </div>
                  </motion.div>
                )}

                {/* 3. REWARDS SHOP TAB */}
                {activeTab === 'rewards' && (
                  <motion.div className={s.scrollArea} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} key="rewards-tab">
                    <div className={s.shopTitleBar}>
                      <h3>{t.rewards}</h3>
                      <div className={s.ptsCounter}>
                        <span>{ecoPoints}</span>
                        <small>{t.points}</small>
                      </div>
                    </div>

                    <div className={s.shopGrid}>
                      {rewards.map(r => (
                        <div key={r.id} className={`${s.shopCard} ${r.unlocked ? s.shopCardUnlocked : ''}`}>
                          <div className={s.shopEmoji}>{r.icon}</div>
                          <h4>{lang === 'tr' ? r.nameTr : r.nameEn}</h4>
                          <p>{lang === 'tr' ? r.descTr : r.descEn}</p>
                          
                          {r.unlocked ? (
                            <div className={s.unlockedPill}><CheckCircle /> {t.unlockedText}</div>
                          ) : (
                            <button className={s.unlockButton} onClick={() => handleUnlockReward(r.id)} disabled={ecoPoints < r.cost}>
                              {t.unlockBtn} {r.cost} pts
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. INSIGHTS IMPACT TAB */}
                {activeTab === 'insights' && (
                  <motion.div className={s.scrollArea} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} key="insights-tab">
                    <div className={s.insightHeader}>
                      <h3>{t.insights}</h3>
                      <p>{t.insightsDesc}</p>
                    </div>

                    <div className={s.metricGrid}>
                      <div className={s.metricCard}>
                        <div className={s.metricIcon}>🌱</div>
                        <div className={s.metricVal}>{co2Saved} kg</div>
                        <div className={s.metricLabel}>{t.co2Label}</div>
                      </div>
                      <div className={s.metricCard}>
                        <div className={s.metricIcon}>♻️</div>
                        <div className={s.metricVal}>{wasteReduced} kg</div>
                        <div className={s.metricLabel}>{t.wasteLabel}</div>
                      </div>
                      <div className={s.metricCard}>
                        <div className={s.metricIcon}>💧</div>
                        <div className={s.metricVal}>{waterSaved} L</div>
                        <div className={s.metricLabel}>{t.waterLabel}</div>
                      </div>
                    </div>

                    {/* Premium glass micro chart mock */}
                    <div className={s.weeklyChartCard}>
                      <h4>{lang === 'tr' ? 'Haftalık Katkı Dağılımı' : 'Weekly Activity Balance'}</h4>
                      <div className={s.chartBars}>
                        {[40, 75, 55, 90, 60, 80, 95].map((val, idx) => (
                          <div className={s.chartCol} key={idx}>
                            <div className={s.chartBarFill} style={{ height: `${val}%` }} />
                            <span>{['P', 'S', 'Ç', 'P', 'C', 'C', 'P'][idx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Native Mobile Bottom Navigation Bar */}
            <div className={s.bottomNavbar}>
              {[
                { id: 'missions', icon: Target, label: t.missions },
                { id: 'garden', icon: Leaf, label: t.garden },
                { id: 'rewards', icon: Award, label: t.rewards },
                { id: 'insights', icon: BarChart3, label: t.insights },
              ].map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button key={tab.id} className={`${s.navItem} ${isActive ? s.navItemActive : ''}`} onClick={() => setActiveTab(tab.id as any)}>
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Screen Bottom Bar Notch Indicator */}
            <div className={s.bottomHomeLine} />
          </div>

          {/* ACTIVE TOAST POPUP NOTIFICATION CONTAINER */}
          <AnimatePresence>
            {showToast && (
              <motion.div className={s.toastAlert} initial={{ opacity: 0, y: 40, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} transition={{ duration: 0.2 }}>
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. TIMED STOPWATCH MODAL DRAWER */}
          <AnimatePresence>
            {showTimer && (
              <motion.div className={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleResetTimer}>
                <motion.div className={s.modalSheet} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 280 }} onClick={e => e.stopPropagation()}>
                  <div className={s.modalDragIndicator} />
                  <div className={s.modalHeader}>
                    <h4>{t.showerTimerTitle}</h4>
                    <button className={s.modalClose} onClick={handleResetTimer}><X /></button>
                  </div>

                  <div className={s.timerRadialDisplay}>
                    <div className={s.timerDigitalDigits}>{formatTime(timerSeconds)}</div>
                    <p>{t.timerSavingText}</p>
                  </div>

                  <div className={s.timerActionsGrid}>
                    <button className={`${s.btnControl} ${isTimerRunning ? s.btnControlPause : s.btnControlResume}`} onClick={handleToggleTimer}>
                      {isTimerRunning ? <Pause /> : <Play />}
                      <span>{isTimerRunning ? t.timerPause : t.timerResume}</span>
                    </button>
                    <button className={s.btnEndSession} onClick={handleResetTimer}>
                      <RotateCcw />
                      <span>{t.timerEndBtn}</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. QUICK LOG ACTIVITY MODAL DRAWER */}
          <AnimatePresence>
            {showLogModal && (
              <motion.div className={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogModal(false)}>
                <motion.div className={s.modalSheet} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 280 }} onClick={e => e.stopPropagation()}>
                  <div className={s.modalDragIndicator} />
                  <div className={s.modalHeader}>
                    <h4>{t.quickLogTitle}</h4>
                    <button className={s.modalClose} onClick={() => setShowLogModal(false)}><X /></button>
                  </div>
                  <p className={s.modalSubheading}>{t.quickLogDesc}</p>

                  <div className={s.quickLogOptions}>
                    {quickLogItems.map((item, idx) => (
                      <button key={idx} className={s.quickLogCard} onClick={() => handleQuickLog(item)}>
                        <div className={s.quickLogLeft}>
                          <h5>{lang === 'tr' ? item.nameTr : item.nameEn}</h5>
                          <div className={s.quickLogRewards}>
                            <span>+{item.xp} XP</span>
                            <span>+{item.points} pts</span>
                          </div>
                        </div>
                        <div className={s.quickLogImpact}>-{item.impact} kg CO₂</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
