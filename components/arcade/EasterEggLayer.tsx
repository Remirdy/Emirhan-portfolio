'use client'

import { useEffect, useState } from 'react'
import { Gamepad2, PartyPopper, Sparkles, Zap } from 'lucide-react'
import s from './EasterEggLayer.module.css'

const codes = ['dirty', 'umay', 'remirdy']

export default function EasterEggLayer() {
  const [active, setActive] = useState<string | null>(null)
  const [combo, setCombo] = useState(0)

  useEffect(() => {
    const keys: string[] = []
    const handler = (event: KeyboardEvent) => {
      keys.push(event.key.toLowerCase())
      const joined = keys.join('')
      const code = codes.find((item) => joined.includes(item))
      if (code) {
        setActive(code)
        setCombo((n) => n + 1)
        keys.length = 0
        setTimeout(() => setActive(null), 5200)
      }
      if (keys.length > 18) keys.shift()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!active) {
    return <div className={s.hint}>secret codes: dirty / umay / remirdy</div>
  }

  return (
    <div className={s.layer}>
      <div className={s.confetti}><span>🐦</span><span>💥</span><span>✨</span><span>🎮</span><span>🚀</span><span>🛠️</span></div>
      <div className={s.toast}>
        <PartyPopper />
        <div><b>{active.toUpperCase()} MODE UNLOCKED</b><p>Combo #{combo} activated. Portfolio runtime is now unstable in a good way.</p></div>
        <Sparkles />
      </div>
      <div className={s.sideQuest}><Gamepad2 /><b>Side Quest</b><span>Find the next hidden word.</span></div>
      <div className={s.zap}><Zap /></div>
    </div>
  )
}
