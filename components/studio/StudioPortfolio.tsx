'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, OrbitControls } from '@react-three/drei'
import { ArrowDown, ArrowLeft, ArrowUpRight, Box, Code2, Gamepad2, RotateCcw, X } from 'lucide-react'
import { projects, type Category, type Project } from './projects'
import s from './Studio.module.css'

const StudioScene = dynamic(() => import('./StudioScene'), { ssr: false, loading: () => <div className={s.sceneFallback}>Preparing the desk<span /></div> })
const InteriorModel = dynamic(() => import('./StudioScene').then(module => module.InteriorModel), { ssr: false })
const categories: Category[] = ['All', 'Games', 'Code', '3D', 'Motion']

function ModelViewer() {
  const [view, setView] = useState<'render' | 'animation' | 'model'>('render')
  return <><div className={s.viewTabs} aria-label="Scene view">{(['render', 'animation', 'model'] as const).map(item => <button key={item} aria-pressed={view === item} onClick={() => setView(item)}>{item === 'model' ? '3D model' : item === 'animation' ? 'Camera study' : 'Render'}</button>)}</div><div className={s.modelViewer}>{view === 'model' ? <><Canvas frameloop="demand" dpr={[1, 1.25]} camera={{ position: [9, 5, 11], fov: 40 }}><color attach="background" args={['#e8e5db']} /><ambientLight intensity={.7} /><directionalLight position={[5, 8, 5]} intensity={1.8} /><directionalLight position={[-5, 4, -3]} intensity={.9} /><Suspense fallback={null}><Bounds fit clip observe margin={.9} maxDuration={0}><InteriorModel /></Bounds></Suspense><OrbitControls makeDefault target={[0, 0, 0]} minDistance={6} maxDistance={20} maxPolarAngle={Math.PI / 2} enablePan={false} /></Canvas><span className={s.viewerHint}>Drag to rotate · Scroll to zoom</span></> : view === 'animation' ? <video src="/studies/quiet-corner.mp4" poster="/studies/quiet-corner.webp" controls loop muted playsInline preload="metadata" aria-label="Quiet Corner camera animation" /> : <Image src="/studies/quiet-corner.webp" alt="Quiet Corner interior study with a linen sofa, oak paneling and a limestone table" width={1800} height={1500} sizes="(max-width: 680px) 100vw, 620px" />}</div></>
}

function ProjectContent({ project, select }: { project: Project; select: (id: string) => void }) {
  return <><div className={s.detailHeading}><span>{project.category} / {project.subtitle}</span><h2 id="project-title">{project.title}</h2></div>{project.id === 'atelier' ? <ModelViewer /> : null}{project.images ? <div className={`${s.screenshots} ${project.id === 'juggle' ? s.portrait : ''}`}>{project.images.map((src, index) => <Image src={src} alt={`${project.title} Google Play gameplay screenshot ${index + 1}`} key={src} width={800} height={project.id === 'juggle' ? 1422 : 450} sizes="(max-width: 680px) 90vw, 600px" />)}</div> : null}<div className={s.detailCopy}><p>{project.description}</p>{project.role ? <div className={s.role}><span>WORK</span><p>{project.role}</p></div> : null}<div className={s.stack}>{project.stack.map(item => <span key={item}>{item}</span>)}</div><div className={s.projectLinks}>{project.links.map(link => <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} download={link.href.startsWith('/studies/') || undefined}>{link.label}<ArrowUpRight size={17} /></a>)}</div>{project.images ? <span className={s.source}>Screenshots from the official Google Play listing.</span> : null}</div>{project.category === 'Code' ? <div className={s.related}><span>OTHER REPOSITORIES</span>{projects.filter(item => item.category === 'Code' && item.id !== project.id).map(item => <button key={item.id} onClick={() => select(item.id)}>{item.title}<ArrowUpRight size={15} /></button>)}</div> : null}</>
}

export default function StudioPortfolio() {
  const [category, setCategory] = useState<Category>('All')
  const [active, setActive] = useState<string | null>(null)
  const [reset, setReset] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const detailScroll = useRef<HTMLDivElement>(null)
  const current = projects.find(project => project.id === active)
  const filtered = projects.filter(project => category === 'All' || project.category === category)

  useEffect(() => {
    if (active && dialog.current && !dialog.current.open) dialog.current.showModal()
    if (!active && dialog.current?.open) dialog.current.close()
    if (active) {
      const overflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      detailScroll.current?.scrollTo(0, 0)
      return () => { document.body.style.overflow = overflow }
    }
  }, [active])

  return <main className={s.page}>
    <section className={s.workspace} id="work" aria-label="Selected work"><div className={s.intro}><div className={s.eyebrow}><span /> SOFTWARE DEVELOPER · ISTANBUL</div><h1>Emirhan<br /><em>Doygun.</em></h1><p>I develop mobile games and tools for creative software.</p><a href="#project-index" className={s.indexLink}>Browse projects<ArrowDown size={16} /></a><div className={s.introFoot}><span>GAMES / CODE / 3D / MOTION</span><span>SCROLL TO THE PROJECT INDEX ↘</span></div></div><div className={s.stage}><div className={s.stageTop}><span>THE WORK DESK</span><button onClick={() => setReset(value => value + 1)} aria-label="Reset desk camera"><RotateCcw size={14} /> Reset view</button></div><div className={s.canvasWrap} aria-label="A 3D desk with projects. Select an object or use the project list below."><StudioScene onSelect={setActive} category={category} reset={reset} /></div><div className={s.stageBottom}><span>↔ Drag to look around</span><span>Select an object to open a project <ArrowUpRight size={13} /></span></div></div></section>
    <section className={s.projectIndex} id="project-index" aria-labelledby="index-title"><div className={s.indexHeader}><div><span className={s.overline}>SELECTED WORK</span><h2 id="index-title">Project index<span>({projects.length})</span></h2></div><div className={s.filters} aria-label="Filter projects">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className={s.projectList}>{filtered.map(project => <button className={s.projectRow} key={project.id} onClick={() => setActive(project.id)}><span className={s.rowNumber}>{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span className={s.rowIcon}>{project.category === 'Games' ? <Gamepad2 size={20} /> : project.category === '3D' ? <Box size={20} /> : <Code2 size={20} />}</span><strong>{project.title}</strong><span className={s.rowSubtitle}>{project.subtitle}</span><span className={s.rowCategory}>{project.category}</span><ArrowUpRight size={19} /></button>)}</div><a className={s.allRepos} href="https://github.com/Remirdy?tab=repositories" target="_blank" rel="noreferrer">All repositories on GitHub<ArrowUpRight size={16} /></a></section>
    <section className={s.about} id="about"><div><span className={s.overline}>ABOUT / EXPERIENCE</span><h2>Development<br /><em>& production.</em></h2><p>I’m Emirhan, a Computer Engineering student and software developer based in Istanbul. My work spans Unity games, desktop tools and systems programming. I also work with Blender and After Effects.</p></div><div className={s.experience}><article><span>GAME DEVELOPMENT</span><h3>ZargasLabs</h3><p>Mobile games, gameplay systems, interface implementation and release work.</p><button onClick={() => setActive('dirty')}>View games<ArrowUpRight size={15} /></button></article><article><span>MOTION DESIGN</span><h3>Metraj Production</h3><p>Animating supplied PSD designs in After Effects, with layer animation, camera movement, transitions and revisions.</p><a href="/motion">View experience<ArrowUpRight size={15} /></a></article></div></section>
    <section className={s.contact} id="contact"><span className={s.overline}>CONTACT</span><h2>Project enquiries.</h2><a href="mailto:e_doygun@icloud.com">e_doygun@icloud.com<ArrowUpRight /></a><span>Istanbul, Türkiye · <a href="https://www.linkedin.com/in/remirdy/" target="_blank" rel="noreferrer">LinkedIn ↗</a></span></section>
    <dialog className={s.dialog} ref={dialog} aria-labelledby="project-title" onClose={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) setActive(null) }}><div className={s.drawer} ref={detailScroll}><div className={s.drawerNav}><button onClick={() => setActive(null)}><ArrowLeft size={16} /> Project index</button><button onClick={() => setActive(null)} aria-label="Close project"><X size={21} /></button></div>{current ? <ProjectContent key={current.id} project={current} select={setActive} /> : null}</div></dialog>
  </main>
}
