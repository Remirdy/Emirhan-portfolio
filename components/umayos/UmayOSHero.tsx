'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import styles from './UmayOSHero.module.css'

/* ----------------------------------------------------------------
   UmayOS — flashy interactive hero section
   Pure C · Assembly · Custom GUI · Window Manager
   Self-contained: only framer-motion + CSS module needed.
----------------------------------------------------------------- */

const BOOT_LINES = [
  'booting umayos...',
  '[ ok ] riscv64 kernel loaded | memory map: 0x80000000',
  '[ ok ] trap vector installed -> mtvec = 0x80000180',
  '[ ok ] page tables initialised (sv39)',
  '[ ok ] uart0 @ 0x10000000 ready',
  '[ ok ] plic + clint online',
  '[ ok ] scheduler: round-robin, quantum 10ms',
  '[ ok ] framebuffer 1024x600 @ 32bpp',
  '[ ok ] mounting /root/fs ... done',
  '[ ok ] starting window manager (UmayWM)',
  'welcome to umayos $',
]

const ASM_SNIPPET = `    .section .text
    .globl _start
_start:
    csrr  t0, mstatus
    li    a0, 0x1
    jal   ra, draw_window
    la    sp, _stack_top
    csrw  mtvec, t1
    li    a7, 64
    ecall
draw_window:
    addi  sp, sp, -16
    sd    ra, 8(sp)
    ld    ra, 8(sp)
    ret`

const FILES = [
  { name: 'kernel/', kind: 'dir' },
  { name: 'mm/', kind: 'dir' },
  { name: 'drivers/', kind: 'dir' },
  { name: 'gui/', kind: 'dir' },
  { name: 'asm/', kind: 'dir' },
  { name: 'fs/', kind: 'dir' },
]

const FEATURES = ['PURE C', 'ASSEMBLY', 'CUSTOM GUI', 'WINDOW MANAGER']

/* ---------------- Boot terminal (self-typing) ---------------- */
function BootTerminal() {
  const [shown, setShown] = useState<string[]>([])
  const [partial, setPartial] = useState('')

  useEffect(() => {
    let line = 0
    let char = 0
    let cancelled = false
    function tick() {
      if (cancelled) return
      if (line >= BOOT_LINES.length) {
        // loop after a pause
        setTimeout(() => {
          if (cancelled) return
          setShown([])
          setPartial('')
          line = 0
          char = 0
          tick()
        }, 2600)
        return
      }
      const target = BOOT_LINES[line]
      if (char <= target.length) {
        setPartial(target.slice(0, char))
        char++
        setTimeout(tick, 18 + Math.random() * 22)
      } else {
        setShown((s) => [...s, target])
        setPartial('')
        line++
        char = 0
        setTimeout(tick, 160)
      }
    }
    tick()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={styles.terminalBody}>
      {shown.map((l, i) => (
        <div key={i} className={styles.termLine} data-ok={l.startsWith('[ ok ]')}>
          {l}
        </div>
      ))}
      <div className={styles.termLine}>
        {partial}
        <span className={styles.caret} />
      </div>
    </div>
  )
}

/* ---------------- Self-playing Snake game ---------------- */
function SnakeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COLS = 16
    const ROWS = 12
    const CELL = 14
    canvas.width = COLS * CELL
    canvas.height = ROWS * CELL

    let snake = [{ x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }]
    let dir = { x: 1, y: 0 }
    let food = { x: 10, y: 6 }
    let running = true
    let localScore = 0

    const eq = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x === b.x && a.y === b.y

    function placeFood() {
      let p: { x: number; y: number }
      do {
        p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
      } while (snake.some((s) => eq(s, p)))
      food = p
    }

    // simple greedy AI that avoids self-collision
    function chooseDir() {
      const head = snake[0]
      const options = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ].filter((d) => !(d.x === -dir.x && d.y === -dir.y))

      const safe = options.filter((d) => {
        const nx = head.x + d.x
        const ny = head.y + d.y
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return false
        return !snake.slice(0, -1).some((s) => s.x === nx && s.y === ny)
      })
      const pool = safe.length ? safe : options
      pool.sort((a, b) => {
        const da = Math.abs(head.x + a.x - food.x) + Math.abs(head.y + a.y - food.y)
        const db = Math.abs(head.x + b.x - food.x) + Math.abs(head.y + b.y - food.y)
        return da - db
      })
      dir = pool[0]
    }

    function step() {
      if (!running) return
      chooseDir()
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || snake.some((s) => eq(s, head))) {
        // reset
        snake = [{ x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }]
        dir = { x: 1, y: 0 }
        localScore = 0
        setScore(0)
        placeFood()
        draw()
        return
      }
      snake.unshift(head)
      if (eq(head, food)) {
        localScore += 1
        setScore(localScore)
        placeFood()
      } else {
        snake.pop()
      }
      draw()
    }

    function draw() {
      if (!ctx) return
      ctx.fillStyle = '#040b06'
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)
      // food
      ctx.fillStyle = '#39ff9a'
      ctx.shadowColor = '#39ff9a'
      ctx.shadowBlur = 8
      ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4)
      ctx.shadowBlur = 0
      // snake
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#7dffc0' : '#1fae6b'
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2)
      })
    }

    placeFood()
    draw()
    const id = window.setInterval(step, 130)
    return () => {
      running = false
      window.clearInterval(id)
    }
  }, [])

  return (
    <div className={styles.snakeWrap}>
      <div className={styles.snakeScore}>{String(score).padStart(3, '0')}</div>
      <canvas ref={canvasRef} className={styles.snakeCanvas} />
    </div>
  )
}

/* ---------------- Draggable window ---------------- */
function Win({
  title,
  className,
  initial,
  z,
  onFocus,
  children,
}: {
  title: string
  className?: string
  initial: { x: number; y: number }
  z: number
  onFocus: () => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.9, x: initial.x, y: initial.y }}
      animate={{ opacity: 1, scale: 1, x: initial.x, y: initial.y }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ zIndex: z }}
      className={`${styles.win} ${className || ''}`}
    >
      <div className={styles.winBar}>
        <span className={styles.winTitle}>{title}</span>
        <span className={styles.winButtons}>
          <i className={styles.winMin} />
          <i className={styles.winMax} />
          <i className={styles.winClose} />
        </span>
      </div>
      <div className={styles.winContent}>{children}</div>
    </motion.div>
  )
}

/* ---------------- Particles ---------------- */
function Particles() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)
    const N = reduce ? 0 : Math.min(70, Math.floor((w * h) / 16000))
    const parts = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 - 0.15,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.6 + 0.2,
    }))
    const onResize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', onResize)
    function frame() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -5) p.y = h + 5
        if (p.x < -5) p.x = w + 5
        if (p.x > w + 5) p.x = -5
        ctx.beginPath()
        ctx.fillStyle = `rgba(57,255,154,${p.a})`
        ctx.shadowColor = '#39ff9a'
        ctx.shadowBlur = 6
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      raf = requestAnimationFrame(frame)
    }
    if (N > 0) frame()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return <canvas ref={ref} className={styles.particles} aria-hidden />
}

/* ---------------- Clock ---------------- */
function Clock() {
  const [t, setT] = useState('--:--')
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    setT(fmt())
    const id = setInterval(() => setT(fmt()), 1000 * 20)
    return () => clearInterval(id)
  }, [])
  return <span className={styles.clock}>{t}</span>
}

/* ---------------- Main ---------------- */
export default function UmayOSHero() {
  const [zTop, setZTop] = useState(30)
  const [zMap, setZMap] = useState<Record<string, number>>({ term: 12, snake: 14, fs: 13, wm: 11 })
  const focus = useCallback(
    (key: string) => {
      setZTop((z) => {
        const next = z + 1
        setZMap((m) => ({ ...m, [key]: next }))
        return next
      })
    },
    []
  )

  return (
    <section className={styles.root}>
      <Particles />
      <div className={styles.scanlines} aria-hidden />
      <div className={styles.vignette} aria-hidden />

      {/* floating background asm */}
      <pre className={styles.asmBg} aria-hidden>
        {ASM_SNIPPET}
      </pre>

      {/* title */}
      <div className={styles.titleWrap}>
        <motion.h1
          className={styles.glitch}
          data-text="UMAYOS"
          initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          UMAYOS
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          FROM&nbsp;SCRATCH&nbsp;·&nbsp;RISC-V&nbsp;OS
        </motion.p>
      </div>

      {/* desktop with windows */}
      <div className={styles.desktop}>
        <Win
          title="umay@riscv: ~"
          className={styles.termWin}
          initial={{ x: 0, y: 0 }}
          z={zMap.term}
          onFocus={() => focus('term')}
        >
          <BootTerminal />
        </Win>

        <Win
          title="snake.umay"
          className={styles.snakeWin}
          initial={{ x: 40, y: 70 }}
          z={zMap.snake}
          onFocus={() => focus('snake')}
        >
          <div className={styles.menuBar}>
            <span>File</span>
            <span>Edit</span>
            <span>Run</span>
            <span>View</span>
          </div>
          <SnakeCanvas />
        </Win>

        <Win
          title="/root/fs"
          className={styles.fsWin}
          initial={{ x: 300, y: 130 }}
          z={zMap.fs}
          onFocus={() => focus('fs')}
        >
          <div className={styles.fileGrid}>
            {FILES.map((f) => (
              <div key={f.name} className={styles.fileItem}>
                <span className={styles.fileIcon} />
                <span className={styles.fileName}>{f.name}</span>
              </div>
            ))}
          </div>
        </Win>

        <Win
          title="Window Manager Demo"
          className={styles.wmWin}
          initial={{ x: 360, y: -30 }}
          z={zMap.wm}
          onFocus={() => focus('wm')}
        >
          <div className={styles.wmRow}>
            <span className={styles.wmIcon} />
            <span className={styles.wmIcon} />
            <span className={styles.wmIcon} />
            <span className={styles.wmIcon} />
          </div>
        </Win>
      </div>

      {/* taskbar */}
      <div className={styles.taskbar}>
        <span className={styles.start}>▻ UmayWM</span>
        <span className={styles.taskItem}>snake.umay</span>
        <span className={styles.taskItem}>/root/fs</span>
        <span className={styles.tray}>
          <span className={styles.trayDot} />
          <Clock />
        </span>
      </div>

      {/* features */}
      <div className={styles.features}>
        {FEATURES.map((f, i) => (
          <motion.span
            key={f}
            className={styles.feature}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
          >
            {f}
          </motion.span>
        ))}
      </div>
      <div className={styles.meta}>riscv32 / riscv64 · built from zero</div>
    </section>
  )
}
