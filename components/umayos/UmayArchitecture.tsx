'use client'

import { motion } from 'framer-motion'
import styles from './UmayArchitecture.module.css'

/* ----------------------------------------------------------------
   UmayOS — technical "how it works" section
   Sober, readable companion to the flashy hero above.
----------------------------------------------------------------- */

const BOOT_FLOW = [
  {
    n: '01',
    title: 'Reset & machine mode',
    body:
      'The CPU starts in M-mode at the reset vector. Early assembly sets up the stack pointer, clears the BSS, and installs the trap vector (mtvec) before any C runs.',
  },
  {
    n: '02',
    title: 'Trap & interrupt setup',
    body:
      'CLINT provides the timer interrupt for preemptive scheduling; PLIC routes external device interrupts. Handlers are written in assembly to save/restore the full register frame.',
  },
  {
    n: '03',
    title: 'Virtual memory (Sv39)',
    body:
      'Three-level page tables are built and satp is switched on, giving the kernel a clean 39-bit virtual address space and isolating kernel pages from user pages.',
  },
  {
    n: '04',
    title: 'Drivers & subsystems',
    body:
      'UART for the console, a framebuffer driver for graphics, and a simple block layer mount /root/fs. The round-robin scheduler comes online with a 10 ms quantum.',
  },
  {
    n: '05',
    title: 'Window manager (UmayWM)',
    body:
      'Once graphics is up, UmayWM draws the desktop, composites windows, and dispatches input events — the GUI you see in the demo above runs on this stack.',
  },
]

const MEMORY_MAP = [
  { range: '0x0000_1000', region: 'Boot ROM / reset vector', note: 'entry point' },
  { range: '0x0200_0000', region: 'CLINT', note: 'timer + software interrupts' },
  { range: '0x0C00_0000', region: 'PLIC', note: 'external interrupt controller' },
  { range: '0x1000_0000', region: 'UART0', note: 'serial console' },
  { range: '0x8000_0000', region: 'Kernel image + RAM', note: 'text, data, heap, stacks' },
]

const WM_PARTS = [
  {
    title: 'Compositor',
    body: 'Maintains a z-ordered list of windows and blits dirty regions to the framebuffer each frame.',
  },
  {
    title: 'Event loop',
    body: 'Polls keyboard/mouse, hit-tests windows, and routes events to the focused surface.',
  },
  {
    title: 'Widget toolkit',
    body: 'Title bars, buttons, file icons and the terminal are drawn by a small custom GUI library — no external deps.',
  },
]

const STACK = [
  { k: 'ISA', v: 'RISC-V · rv32 / rv64' },
  { k: 'Languages', v: 'Pure C + RISC-V assembly' },
  { k: 'Memory', v: 'Sv39 paging, custom allocator' },
  { k: 'Scheduling', v: 'Preemptive round-robin' },
  { k: 'Graphics', v: 'Framebuffer + custom WM' },
  { k: 'Toolchain', v: 'riscv-gnu-toolchain, QEMU' },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function UmayArchitecture() {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <Reveal>
          <p className={styles.kicker}>How it works</p>
          <h2 className={styles.heading}>Under the hood</h2>
          <p className={styles.lede}>
            UmayOS is a small operating system written from zero for the RISC-V architecture. No
            Linux, no existing kernel — just C, assembly, and the hardware spec. Here is the path
            from power-on to a running window manager.
          </p>
        </Reveal>

        {/* boot flow */}
        <div className={styles.flow}>
          {BOOT_FLOW.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <div>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepBody}>{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* two columns: memory map + WM */}
        <div className={styles.cols}>
          <Reveal>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Physical memory map</h3>
              <div className={styles.mmap}>
                {MEMORY_MAP.map((m) => (
                  <div key={m.range} className={styles.mrow}>
                    <code className={styles.maddr}>{m.range}</code>
                    <span className={styles.mregion}>{m.region}</span>
                    <span className={styles.mnote}>{m.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Window manager (UmayWM)</h3>
              <div className={styles.wmList}>
                {WM_PARTS.map((p) => (
                  <div key={p.title} className={styles.wmItem}>
                    <span className={styles.dot} />
                    <div>
                      <strong className={styles.wmName}>{p.title}</strong>
                      <p className={styles.wmBody}>{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* stack */}
        <Reveal>
          <div className={styles.stack}>
            {STACK.map((s) => (
              <div key={s.k} className={styles.stackItem}>
                <span className={styles.stackK}>{s.k}</span>
                <span className={styles.stackV}>{s.v}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
