'use client'

import { useEffect, useState } from 'react'
import { Gamepad2, Radar, Sparkles, Terminal, Zap } from 'lucide-react'
import s from './EasterEggLayer.module.css'

type Mode = 'dirty' | 'umay' | 'remirdy' | 'konami' | 'clickstorm'

const wordCodes: Mode[] = ['dirty', 'umay', 'remirdy']
const konami = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

const copy: Record<Mode, { title: string; sub: string; glyph: string }> = {
  dirty: { title: 'BIRD STORM PROTOCOL', sub: 'A hidden arcade layer just hijacked the interface.', glyph: '🐦' },
  umay: { title: 'UMAYOS BACKDOOR', sub: 'The mini operating system opened a secret compositor.', glyph: '🖥️' },
  remirdy: { title: 'REMIRDY SIGNATURE MODE', sub: 'Portfolio identity verified. Runtime aura overclocked.', glyph: '⚡' },
  konami: { title: 'KONAMI PIPELINE UNLOCKED', sub: 'Classic input detected. Developer taste confirmed.', glyph: '🎮' },
  clickstorm: { title: 'CLICKSTORM DEBUG LAYER', sub: 'Seven rapid clicks opened a hidden production monitor.', glyph: '💥' },
}

export default function EasterEggLayer() {
  const [active, setActive] = useState<Mode | null>(null)
  const [combo, setCombo] = useState(0)

  useEffect(() => {
    const keys: string[] = []
    let clicks: number[] = []

    const open = (mode: Mode) => {
      setActive(mode)
      setCombo((n) => n + 1)
      window.setTimeout(() => setActive(null), 5600)
    }

    const keyHandler = (event: KeyboardEvent) => {
      keys.push(event.key.toLowerCase())
      const joined = keys.join('')
      const word = wordCodes.find((code) => joined.includes(code))
      const tail = keys.slice(-konami.length)
      if (word) {
        keys.length = 0
        open(word)
      } else if (tail.join('|') === konami.join('|')) {
        keys.length = 0
        open('konami')
      }
      if (keys.length > 24) keys.shift()
    }

    const clickHandler = () => {
      const now = Date.now()
      clicks = [...clicks.filter((time) => now - time < 1200), now]
      if (clicks.length >= 7) {
        clicks = []
        open('clickstorm')
      }
    }

    window.addEventListener('keydown', keyHandler)
    window.addEventListener('pointerdown', clickHandler)
    return () => {
      window.removeEventListener('keydown', keyHandler)
      window.removeEventListener('pointerdown', clickHandler)
    }
  }, [])

  if (!active) return null

  const data = copy[active]

  return (
    <div className={s.layer}>
      <div className={s.rain} aria-hidden="true">{Array.from({ length: 28 }).map((_, i) => <span key={i}>REMIRDY</span>)}</div>
      <div className={s.portal}><i /><i /><i /></div>
      <div className={s.confetti}>{['🐦','💥','✨','🎮','🚀','🛠️','🧪','🕹️'].map((x) => <span key={x}>{x}</span>)}</div>
      <div className={s.toast}>
        <div className={s.glyph}>{data.glyph}</div>
        <div><b>{data.title}</b><p>{data.sub}</p><small>combo #{combo} · hidden input accepted</small></div>
        <Sparkles />
      </div>
      <div className={s.monitor}>
        <div className={s.monitorBar}><span /><span /><span />runtime.secret</div>
        <p>› listening to invisible inputs</p>
        <p>› rendering surprise layer</p>
        <p>› injecting cinematic chaos</p>
        <h3>{active.toUpperCase()}<em>_</em></h3>
      </div>
      <div className={s.sideQuest}><Gamepad2 /><b>Hidden route opened</b><span>There are multiple triggers; no labels, no spoilers.</span></div>
      <div className={s.zap}><Zap /></div>
      <div className={s.radar}><Radar /><span /></div>
      <div className={s.terminal}><Terminal /></div>
    </div>
  )
}
