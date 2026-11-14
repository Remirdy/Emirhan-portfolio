'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, MotionConfig, motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Asterisk, Check, Code2, Layers, Pause, Play, RotateCw } from 'lucide-react'
import Experiments from './Experiments'
import s from './Portfolio.module.css'

const deskProjects = [
  { name: 'Dirty Birdy!', category: 'UNITY / MOBILE GAME', image: '/portfolio/dirty-birdy-1.jpg', second: '/portfolio/dirty-birdy-2.jpg', color: '#e9be4c', href: '#dirty' },
  { name: 'Juggle Trap', category: 'UNITY / MOBILE GAME', image: '/portfolio/juggle-trap-1.jpg', second: '/portfolio/juggle-trap-2.jpg', color: '#b4acd7', href: '#juggle' },
  { name: 'Motion studies', category: 'AFTER EFFECTS / MOTION DESIGN', image: '/motion/Example_1.jpg', second: '/motion/Example_1.jpg', color: '#a8c8b7', href: '/motion' },
]

const tools = [
  { name: 'Photoshop', short: 'Ps', repo: 'PhotoshopMCP', title: 'Document and asset automation.', description: 'A local MCP integration for Photoshop documents, editable layers, and asset exports.', items: ['Editable layers', 'Structured documents', 'Asset exports'], file: 'creative-direction.psd' },
  { name: 'Blender', short: 'B', repo: 'BlenderMCP', title: 'A local bridge to 3D production.', description: 'Scene creation, materials, rendering, and game-ready assets through a local MCP workflow.', items: ['3D scenes', 'Materials & lighting', 'GLB exports'], file: 'workbench.blend' },
  { name: 'After Effects', short: 'Ae', repo: 'AfterEffectsMCP', title: 'Motion workflow automation.', description: 'MotionPilot connects creative direction to After Effects: PSD analysis, animation, rendering, and game-ready VFX.', items: ['Motion planning', 'Keyframes & easing', 'VFX exports'], file: 'motion-study.aep' },
]

function Desk({ paused }: { paused: boolean }) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(y, { stiffness: 100, damping: 22 })
  const rotateY = useSpring(x, { stiffness: 100, damping: 22 })
  const project = deskProjects[index]

  function move(event: PointerEvent<HTMLDivElement>) {
    if (paused || reduced || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set(((event.clientX - bounds.left) / bounds.width - .5) * 9)
    y.set(((event.clientY - bounds.top) / bounds.height - .5) * -9)
  }

  return <div className={s.desk} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0) }}>
    <span className={s.deskCorner}>SELECTED PROJECTS<br />DEVELOPMENT & DESIGN ↘</span>
    <motion.div className={s.deskScene} style={{ rotateX: paused ? 0 : rotateX, rotateY: paused ? 0 : rotateY }}>
      <div className={s.deskCircle} style={{ backgroundColor: project.color }} />
      <div className={s.deskCross} aria-hidden="true"><Asterisk strokeWidth={1.2} /></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={project.name} className={s.deskArtifacts} initial={{ opacity: 0, y: reduced || paused ? 0 : 28, rotate: reduced || paused ? 0 : -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: reduced || paused ? 0 : -20 }} transition={{ duration: reduced || paused ? 0 : .45 }}>
          <div className={s.backPrint}><Image src={project.second} alt="" width={600} height={1300} priority /></div>
          <a href={project.href} className={s.frontPrint} aria-label={`Explore ${project.name}`}>
            <div className={s.printImage}><Image src={project.image} alt={`${project.name} project artwork`} width={600} height={1300} priority /></div>
            <span>{project.name}<ArrowUpRight size={15} /></span>
          </a>
        </motion.div>
      </AnimatePresence>
      <span className={s.deskNote}>Development.<br /><em>Design. Production.</em></span>
      <div className={s.sticker}><span>INTERACTIVE<br />PORTFOLIO</span><ArrowDownRight size={28} /></div>
    </motion.div>
    <div className={s.deskControls}>
      <div aria-live="polite"><span>{project.category}</span><strong>{project.name}</strong></div>
      <button onClick={() => setIndex(value => (value + 1) % deskProjects.length)} aria-label="Show next project"><span>0{index + 1} / 03</span><RotateCw size={17} /></button>
    </div>
  </div>
}

function GameProject({ juggle = false }: { juggle?: boolean }) {
  const slug = juggle ? 'juggle-trap' : 'dirty-birdy'
  const title = juggle ? 'Juggle Trap' : 'Dirty Birdy!'
  const apple = juggle ? 'https://apps.apple.com/tr/app/juggle-trap-laser-dodge/id6760250230' : 'https://apps.apple.com/tr/app/dirty-birdy/id6747272308'
  const google = `https://play.google.com/store/apps/details?id=${juggle ? 'com.zargaslabs.juggletrap' : 'com.moonlight.dirtybirdy'}`
  return <article className={`${s.gameProject} ${juggle ? s.juggle : ''}`} id={juggle ? 'juggle' : 'dirty'} data-reveal>
    <a href={apple} target="_blank" rel="noreferrer" className={s.gameStage} aria-label={`See ${title} on the App Store`}>
      <span className={s.stageLabel}>0{juggle ? 2 : 1} / MOBILE GAME</span>
      <span className={s.stageWord} aria-hidden="true">{juggle ? 'DODGE.' : 'BIRDY.'}</span>
      <div className={s.phoneBack}><Image src={`/portfolio/${slug}-2.jpg`} alt={`${title} gameplay screenshot`} width={600} height={1300} sizes="(max-width: 700px) 35vw, 240px" /></div>
      <div className={s.phoneFront}><Image src={`/portfolio/${slug}-1.jpg`} alt={`${title} App Store screenshot`} width={600} height={1300} sizes="(max-width: 700px) 40vw, 260px" /></div>
      <span className={s.roundArrow}><ArrowUpRight /></span>
      <span className={s.stageFoot}>UNITY / C#<span>IOS + ANDROID</span></span>
    </a>
    <div className={s.projectTitle}><h3>{title}</h3><span>{juggle ? 'REFLEX ARCADE' : 'MOBILE ARCADE'}</span></div>
    <p>{juggle ? 'A reflex-based arcade game with one-tap controls, laser obstacles, unlockable cosmetics, and score-based progression.' : 'A mobile arcade game. My work covers gameplay systems, UI implementation, and performance on mobile devices.'}</p>
    <div className={s.storeLinks}><a href={apple} target="_blank" rel="noreferrer">App Store <ArrowUpRight size={14} /></a><a href={google} target="_blank" rel="noreferrer">Google Play <ArrowUpRight size={14} /></a></div>
  </article>
}

function MotionProject({ paused }: { paused: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (paused) video.current?.pause()
  }, [paused])

  async function toggle() {
    const player = video.current
    if (!player) return
    if (player.paused) {
      try { await player.play(); setFailed(false) } catch { setFailed(true) }
    } else player.pause()
  }

  return <article className={s.motionProject} id="metraj" data-reveal>
    <div className={s.reelStage}>
      <video ref={video} poster="/motion/Example_1.jpg" muted playsInline loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} aria-label="Motion design sample">
        <source src="/motion/Example_1.mp4" type="video/mp4" />
      </video>
      <span className={s.reelCaption}>03 / MOTION DESIGN</span>
      <button onClick={toggle} className={s.reelPlay} aria-label={playing ? 'Pause motion preview' : 'Play motion preview'}>{playing ? <Pause fill="currentColor" size={21} /> : <Play fill="currentColor" size={21} />}</button>
      <span className={s.reelBottom}>{failed ? 'Preview unavailable · Open the full reel below' : 'PSD ANIMATION / PARALLAX / COMPOSITING'}</span>
    </div>
    <div className={s.projectTitle}><h3>Motion design</h3><a href="/motion">View motion work <ArrowUpRight size={18} /></a></div>
    <p>At Metraj Production, I animated existing layered PSD designs using timing, parallax, camera movement, and image-to-motion workflows.</p>
  </article>
}

function ToolBench() {
  const [active, setActive] = useState(0)
  const tool = tools[active]
  return <article className={s.toolBench} id="aftereffects-mcp" data-reveal>
    <div className={s.toolCopy}>
      <span className={s.eyebrow}>04 / SOFTWARE INTEGRATIONS</span><h3>Creative<br /><em>workflow tools.</em></h3>
      <div className={s.toolTabs} role="tablist" aria-label="Creative software tools">
        {tools.map((item, index) => <button role="tab" aria-selected={active === index} aria-controls="tool-panel" id={`tool-tab-${index}`} tabIndex={active === index ? 0 : -1} key={item.name} onClick={() => setActive(index)} onKeyDown={event => {
          const next = event.key === 'ArrowRight' ? (active + 1) % tools.length : event.key === 'ArrowLeft' ? (active + tools.length - 1) % tools.length : event.key === 'Home' ? 0 : event.key === 'End' ? tools.length - 1 : null
          if (next !== null) { event.preventDefault(); setActive(next); document.getElementById(`tool-tab-${next}`)?.focus() }
        }}>{item.name}</button>)}
      </div>
      <div id="tool-panel" role="tabpanel" aria-labelledby={`tool-tab-${active}`} tabIndex={0}><h4>{tool.title}</h4><p>{tool.description}</p><a href={`https://github.com/Remirdy/${tool.repo}`} target="_blank" rel="noreferrer">Explore {tool.repo} <ArrowUpRight size={16} /></a></div>
    </div>
    <div className={s.toolVisual} aria-hidden="true">
      <div className={s.toolWindow}><div className={s.windowBar}><span>● ● ●</span>{tool.file}<Layers size={13} /></div>
        <div className={s.toolCanvas}><span className={s.canvasLabel}>WORKFLOW / EDITABLE OUTPUT</span><div className={`${s.toolShape} ${active === 1 ? s.cubeShape : active === 2 ? s.ringShape : ''}`}><span>{tool.short}</span></div><span className={s.canvasCoord}>X: 1280 / Y: 720</span></div>
        <div className={s.layerStack}>{tool.items.map((item, i) => <div key={item}><Layers size={13} /><span>{item}</span><Check size={12} /><small>0{i + 1}</small></div>)}</div>
      </div><span className={s.toolNote}>Local integrations.<br /><em>Editable source files.</em></span>
    </div>
  </article>
}

function SmallProjects() {
  return <div className={s.smallProjects}>
    <a className={s.systemProject} href="/umayos" id="umayos" data-reveal><div className={s.miniTitle}><span>05 / SYSTEMS PROGRAMMING</span><ArrowUpRight /></div><div className={s.terminal}><div><span>remirdy@umay</span> ~</div><p>$ boot umayos</p><p>RISC-V 32-bit <span>[OK]</span><br />Preemptive multitasking <span>[OK]</span><br />Kernel written in C <span>[OK]</span></p><p className={s.terminalPrompt}>$ <span /></p></div><h3>UmayOS</h3><p>An educational RISC-V operating system.<br />Exploring scheduling, memory, and kernel development.</p><span className={s.textLink}>Explore the system <ArrowRight size={16} /></span></a>
    <a className={s.ecoProject} href="/ecoquest" id="ecoquest" data-reveal><div className={s.miniTitle}><span>06 / ANDROID DEVELOPMENT</span><ArrowUpRight /></div><div className={s.garden} aria-hidden="true"><span className={s.gardenSun} /><div className={s.plant}><i /><i /><i /><i /><span /></div><span className={s.gardenText}>Daily<br /><em>progress.</em></span><span className={s.soil} /></div><h3>EcoQuest</h3><p>A native Android app for sustainable habits.<br />Daily missions, progress tracking, and a virtual garden.</p><span className={s.textLink}>Try the interactive demo <ArrowRight size={16} /></span></a>
  </div>
}

export default function Portfolio() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })

  useEffect(() => {
    const elements = root.current?.querySelectorAll('[data-reveal]')
    if (!elements || reduced || paused) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.animate([{ opacity: .35, transform: 'translateY(35px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'none' })
        observer.unobserve(entry.target)
      })
    }, { threshold: .12 })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [reduced, paused])

  return <MotionConfig reducedMotion={paused ? 'always' : 'user'}><main ref={root} className={`${s.site} ${paused ? s.paused : ''}`} id="top">
    <motion.div className={s.progress} style={{ scaleX: reduced ? 0 : progress }} />
    <section className={s.hero} aria-labelledby="intro-title">
      <div className={s.heroTop}><span>EMIRHAN DOYGUN / SELECTED WORK</span><span><i /> ISTANBUL, TR</span></div>
      <div className={s.heroGrid}><div className={s.heroCopy}>
        <h1 id="intro-title"><span>Games.</span><span>Tools.</span><span className={s.playWord}>Motion<Asterisk aria-hidden="true" /></span></h1>
        <div className={s.heroIntro}><span className={s.introArrow}><ArrowDownRight /></span><div><p>I’m Emirhan, a developer and Computer Engineering<br className={s.desktopBreak} /> student. I build Unity games and creative software tools.</p><a href="#work">View selected work <ArrowDown size={17} /></a></div></div>
      </div><Desk paused={paused || Boolean(reduced)} /></div>
      <div className={s.heroBottom}><span>DEVELOPMENT / DESIGN / PRODUCTION</span><button onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? 'Resume motion' : 'Pause motion'}</button><a href="#work">EXPLORE <ArrowDown size={13} /></a></div>
    </section>
    <div className={s.marquee} aria-hidden="true"><div>{[0, 1].map(i => <span key={i}>UNITY & C# <Asterisk /> CREATIVE TOOLING <Asterisk /> MOTION DESIGN <Asterisk /> SYSTEMS PROGRAMMING <Asterisk /> </span>)}</div></div>
    <section className={s.work} id="work" aria-labelledby="work-title">
      <div className={s.sectionLabel}><span>01 / SELECTED PROJECTS</span><span>GAMES, SOFTWARE & VISUAL PRODUCTION</span></div>
      <div className={s.workIntro} data-reveal><h2 id="work-title">Selected<br /><em>work.</em></h2><p>Mobile games, creative software integrations,<br />and motion design.<br /><span>Explore the projects below.</span></p></div>
      <div className={s.gameGrid}><GameProject /><GameProject juggle /></div>
      <MotionProject paused={paused || Boolean(reduced)} />
      <ToolBench />
      <SmallProjects />
      <a className={s.allRepos} href="https://github.com/Remirdy?tab=repositories" target="_blank" rel="noreferrer"><Code2 size={18} /><span>Source code & development projects</span>View GitHub <ArrowUpRight size={17} /></a>
    </section>
    <section className={s.about} id="about" aria-labelledby="about-title">
      <div className={s.sectionLabel}><span>02 / ABOUT</span><span>EMIRHAN DOYGUN</span></div>
      <div className={s.aboutGrid}><div className={s.aboutHeading} data-reveal><span className={s.aboutStar}><Asterisk strokeWidth={1} /></span><h2 id="about-title">Development.<br />Design.<br /><em>Perspective.</em></h2><p>Working across software development<br />and visual production.</p></div>
        <div className={s.aboutDetails} data-reveal><p className={s.aboutLead}>I’m a Computer Engineering student at Istanbul Commerce University, focused on game development and creative tools.</p><p>My work spans Unity gameplay systems, mobile performance, motion design, and MCP integrations for creative software. I also explore systems programming in C, from operating-system fundamentals to graphics experiments.</p>
          <div className={s.experience} id="cv"><div><span>EDUCATION</span><h3>Computer Engineering</h3><p>Istanbul Commerce University · 2024 — present</p></div><div><span>MOTION DESIGN</span><h3>Metraj Production</h3><p>Animation of existing PSD designs, parallax, and image-to-motion production.</p></div><div><span>CREATIVE PRODUCTION</span><h3>MoonLight</h3><p>Campaign visuals, digital content, and visual storytelling.</p></div></div>
          <div className={s.skills}><span>TECHNOLOGIES & SOFTWARE</span><p>Unity · C# · C / C++ · TypeScript · Python<br />Blender · After Effects · Photoshop · Git</p></div>
        </div>
      </div>
    </section>
    <Experiments />
    <section className={s.contact} id="contact"><div className={s.sectionLabel}><span>04 / CONTACT</span><span>PROJECTS & COLLABORATION</span></div><div className={s.contactBody} data-reveal><h2>Let’s discuss<br /><em>your project.</em></h2><a href="mailto:e_doygun@icloud.com" className={s.contactCircle} aria-label="Email Emirhan Doygun"><ArrowUpRight strokeWidth={1} /></a></div><div className={s.contactBottom}><p>For development, motion design,<br />and creative software projects.</p><a href="mailto:e_doygun@icloud.com">e_doygun@icloud.com <ArrowUpRight size={19} /></a><span>BASED IN ISTANBUL<br />OPEN TO REMOTE COLLABORATION</span></div></section>
  </main></MotionConfig>
}
