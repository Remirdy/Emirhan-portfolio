'use client'

import { useEffect, useMemo, useState } from 'react'
import { Power, Terminal, Wifi, Volume2, Folder, Gamepad2, Image as ImageIcon, Sparkles } from 'lucide-react'
import s from './UmayOSDemo.module.css'

const bootLines = ['booting umay kernel...', 'loading remirdy shell...', 'mounting creative tools...', 'starting desktop...', 'ready.']

export default function UmayOSDemo() {
  const [on, setOn] = useState(true)
  const [bootIndex, setBootIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const word = 'REMIRDY'

  useEffect(() => {
    if (!on) return
    setBootIndex(0)
    setTyped('')
    const boot = setInterval(() => setBootIndex((i) => Math.min(i + 1, bootLines.length)), 420)
    const type = setTimeout(() => {
      let n = 0
      const typer = setInterval(() => {
        n += 1
        setTyped(word.slice(0, n))
        if (n >= word.length) clearInterval(typer)
      }, 135)
    }, 2350)
    return () => { clearInterval(boot); clearTimeout(type) }
  }, [on])

  const time = useMemo(() => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), [])

  return (
    <div className={s.tvShell}>
      <div className={s.antenna}><span /><span /></div>
      <div className={s.screenWrap}>
        <div className={`${s.screen} ${on ? s.screenOn : s.screenOff}`}>
          {on ? (
            <>
              <div className={s.topbar}><b>UmayOS mini</b><span>{time}</span><Wifi /><Volume2 /></div>
              <div className={s.desktop}>
                <div className={s.icons}>
                  {[[Folder,'Projects'],[Gamepad2,'Dirty'],[ImageIcon,'Forge'],[Sparkles,'Ideas']].map(([Icon,label]) => <button key={label as string}><Icon className={s.iconSvg}/><span>{label as string}</span></button>)}
                </div>
                <div className={s.terminalWindow}>
                  <div className={s.windowBar}><span/><span/><span/><b>remirdy@umayos</b></div>
                  <div className={s.termBody}>
                    {bootLines.slice(0, bootIndex).map((line) => <p key={line}>› {line}</p>)}
                    <h3>{typed}<i>_</i></h3>
                  </div>
                </div>
              </div>
              <div className={s.dock}><span/><span/><span/><span/></div>
            </>
          ) : <div className={s.offText}>UmayOS sleeping</div>}
        </div>
      </div>
      <div className={s.controls}>
        <button onClick={() => setOn(!on)}><Power /> {on ? 'Sleep' : 'Boot'}</button>
        <button onClick={() => { setOn(false); setTimeout(() => setOn(true), 160) }}><Terminal /> Reboot demo</button>
      </div>
    </div>
  )
}
