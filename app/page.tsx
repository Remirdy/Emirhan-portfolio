'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Aperture,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  Clapperboard,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Gamepad2,
  Github,
  GraduationCap,
  Layers3,
  Lightbulb,
  MapPin,
  Megaphone,
  Monitor,
  Repeat2,
  Smartphone,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react'

type Skill = {
  icon: ReactNode
  title: string
}

type Experience = {
  icon: ReactNode
  title: string
  body: string
}

type Project = {
  index: string
  title: string
  body: string
  icon: ReactNode
  visual: 'imageforge' | 'ui' | 'motion' | 'book'
}

const panelMotion = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
  },
}

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const itemMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.23, 1, 0.32, 1] },
  },
}

const coreStrengths: Skill[] = [
  { icon: <Gamepad2 />, title: 'Unity Development' },
  { icon: <Code2 />, title: 'C# Programming' },
  { icon: <Monitor />, title: 'Game UI / HUD Design' },
  { icon: <Aperture />, title: 'Motion Graphics' },
  { icon: <Sparkles />, title: 'AI Prompt Design' },
  { icon: <Lightbulb />, title: 'Creative Problem Solving' },
]

const tools: Skill[] = [
  { icon: <Gamepad2 />, title: 'Unity' },
  { icon: <Code2 />, title: 'C#' },
  { icon: <Repeat2 />, title: 'Git' },
  { icon: <Github />, title: 'GitHub' },
  { icon: <Layers3 />, title: 'Photoshop' },
  { icon: <Clapperboard />, title: 'After Effects' },
  { icon: <Zap />, title: 'CapCut' },
  { icon: <Cpu />, title: 'React' },
  { icon: <Wrench />, title: 'Tailwind' },
  { icon: <Sparkles />, title: 'Prompt Engineering' },
]

const experiences: Experience[] = [
  {
    icon: <Gamepad2 />,
    title: 'Zargas Labs — Game & AI Creative Development',
    body: 'Contributed to game concepts, visual direction, interface ideas, and AI-assisted creative production workflows.',
  },
  {
    icon: <Megaphone />,
    title: 'Zargas Labs — Digital Marketing & Prompt Design',
    body: 'Created visual concepts, ad scripts, and AI prompt systems for digital campaigns and social content.',
  },
  {
    icon: <Clapperboard />,
    title: 'Metraj Production — Motion Graphics',
    body: 'Worked on motion-driven visuals, After Effects production, and creative video design.',
  },
]

const projects: Project[] = [
  {
    index: '1.',
    title: 'ImageForge',
    body: 'A creator-focused image resizing and export tool concept featuring crop controls, batch export, and preset-based workflows.',
    icon: <Sparkles />,
    visual: 'imageforge',
  },
  {
    index: '2.',
    title: 'Unity UI & VFX Systems',
    body: 'A collection of animated health bars, HUD elements, effects, and interactive UI concepts designed for more expressive game feel.',
    icon: <Gamepad2 />,
    visual: 'ui',
  },
  {
    index: '3.',
    title: 'AI Motion Ads',
    body: 'Cinematic ad concepts and prompt-driven visual storytelling for social media campaigns, product promotions, and short-form content.',
    icon: <Brain />,
    visual: 'motion',
  },
  {
    index: '4.',
    title: 'Calculus Book Design',
    body: 'A long-form academic content project focused on structure, visual organization, consistency, and polished presentation.',
    icon: <BookOpen />,
    visual: 'book',
  },
]

const bringItems: { label: string; icon: ReactNode }[] = [
  { label: 'Game-focused thinking', icon: <Gamepad2 /> },
  { label: 'Clean visual communication', icon: <Monitor /> },
  { label: 'Strong creative iteration', icon: <Repeat2 /> },
  { label: 'AI-assisted production', icon: <Brain /> },
  { label: 'Cross-disciplinary workflow', icon: <Database /> },
]

function Panel({
  children,
  eyebrow,
  page,
  id,
  className = '',
}: {
  children: ReactNode
  eyebrow?: string
  page: string
  id?: string
  className?: string
}) {
  return (
    <motion.section
      id={id}
      variants={panelMotion}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-120px' }}
      className={`pdf-panel ${className}`}
    >
      <div className="panel-corner panel-corner-tl" />
      <div className="panel-corner panel-corner-br" />
      {eyebrow && <div className="panel-eyebrow">{eyebrow}</div>}
      <div className="panel-number">{page}</div>
      <div className="scanline" />
      {children}
    </motion.section>
  )
}

function TechIllustration() {
  return (
    <div className="tech-illustration" aria-hidden="true">
      <div className="orbit-ring" />
      <div className="orbit-ring orbit-ring-small" />
      <div className="blue-streak blue-streak-one" />
      <div className="blue-streak blue-streak-two" />
      <div className="cube-stack cube-stack-one">
        <span>U</span>
      </div>
      <div className="cube-stack cube-stack-two">
        <span>C#</span>
      </div>
      <div className="hud-card hud-card-one">
        <i />
        <b />
        <em />
      </div>
      <div className="hud-card hud-card-two">
        <i />
        <b />
        <em />
      </div>
      <div className="particle-field" />
    </div>
  )
}

function SkillBox({ skill }: { skill: Skill }) {
  return (
    <motion.div variants={itemMotion} className="skill-box">
      <span>{skill.icon}</span>
      <strong>{skill.title}</strong>
    </motion.div>
  )
}

function ExperienceCard({ item }: { item: Experience }) {
  return (
    <motion.article variants={itemMotion} className="experience-card">
      <div className="experience-icon">{item.icon}</div>
      <div>
        <h4>{item.title}</h4>
        <p>{item.body}</p>
      </div>
    </motion.article>
  )
}

function DirtyVisualCard({
  headline,
  subline,
  size = 'small',
}: {
  headline: string
  subline: string
  size?: 'large' | 'small'
}) {
  return (
    <motion.div variants={itemMotion} className={`dirty-visual-card ${size === 'large' ? 'dirty-visual-large' : ''}`}>
      <div className="dirty-clouds" />
      <div className="dirty-phone">
        <div className="dirty-phone-screen">
          <span className="bird-dot bird-red" />
          <span className="bird-dot bird-yellow" />
          <span className="bird-dot bird-green" />
        </div>
      </div>
      <div className="dirty-copy">
        <h4>{headline}</h4>
        <p>{subline}</p>
      </div>
    </motion.div>
  )
}

function ProjectVisual({ type }: { type: Project['visual'] }) {
  if (type === 'imageforge') {
    return (
      <div className="project-visual visual-imageforge">
        <div className="crop-frame" />
        <span>1:1</span>
        <span>16:9</span>
        <span>4:5</span>
        <button>Export All</button>
      </div>
    )
  }

  if (type === 'ui') {
    return (
      <div className="project-visual visual-ui">
        <div className="metric-ring">78%</div>
        <i />
        <i />
        <i />
        <div className="ui-buttons">
          <span>+</span>
          <span>↻</span>
          <span>✉</span>
        </div>
      </div>
    )
  }

  if (type === 'motion') {
    return (
      <div className="project-visual visual-motion">
        <div className="play-button">▶</div>
        <small>00:15</small>
      </div>
    )
  }

  return (
    <div className="project-visual visual-book">
      <div className="book-spread">
        <i />
        <i />
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article variants={itemMotion} whileHover={{ y: -8 }} className="project-tile">
      <ProjectVisual type={project.visual} />
      <div className="project-title-row">
        <span className="project-icon">{project.icon}</span>
        <h4>
          {project.index} {project.title}
        </h4>
      </div>
      <p>{project.body}</p>
    </motion.article>
  )
}

export default function EmirhanDoygunPortfolio() {
  return (
    <main className="portfolio-shell">
      <Panel page="01" eyebrow="SELECTED PORTFOLIO" className="cover-panel">
        <div className="cover-grid">
          <div className="cover-copy">
            <motion.h1 variants={itemMotion}>
              EMIRHAN
              <br />
              DOYGUN
            </motion.h1>

            <motion.div variants={itemMotion} className="role-line">
              <span>Game Developer</span>
              <i />
              <span>AI Creative Technologist</span>
              <i />
              <span>Computer Engineering Student</span>
            </motion.div>

            <motion.p variants={itemMotion} className="cover-intro">
              I build playful digital experiences through Unity, C#, motion design,
              AI-assisted visuals, and interactive interface design. My work blends
              software, animation, and creative technology into polished, user-focused projects.
            </motion.p>

            <motion.div variants={stagger} className="hero-pills">
              {['Unity', 'C#', 'Game UI', 'Motion Design', 'Prompt Engineering'].map((label) => (
                <motion.span variants={itemMotion} key={label}>
                  {label}
                </motion.span>
              ))}
            </motion.div>

            <motion.div variants={itemMotion} className="cover-contact-strip">
              <div>
                <MapPin />
                Istanbul, Türkiye
              </div>
              <a href="https://github.com/Remirdy" target="_blank" rel="noreferrer">
                <Github />
                GitHub: github.com/Remirdy
              </a>
            </motion.div>
          </div>

          <TechIllustration />
        </div>
      </Panel>

      <Panel id="about" page="02" eyebrow="PAGE 02" className="profile-panel">
        <div className="section-title-block">
          <h2>PROFILE &amp; EXPERTISE</h2>
          <p className="about-text">
            I am a Computer Engineering student with a strong interest in game development,
            interactive design, AI-assisted visual production, and motion-driven interfaces.
            I enjoy combining software, animation, and storytelling to create engaging digital
            experiences that feel polished, playful, and technically solid.
          </p>
        </div>

        <div className="profile-grid">
          <motion.div variants={stagger} className="data-panel core-strengths-panel">
            <div className="data-panel-header"><span>1</span> CORE STRENGTHS</div>
            <div className="skills-grid">
              {coreStrengths.map((skill) => (
                <SkillBox key={skill.title} skill={skill} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger} className="data-panel tools-panel">
            <div className="data-panel-header"><span>2</span> TOOLS &amp; WORKFLOW</div>
            <div className="tools-grid">
              {tools.map((skill) => (
                <SkillBox key={skill.title} skill={skill} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger} className="data-panel experience-panel">
            <div className="data-panel-header"><span>3</span> EXPERIENCE HIGHLIGHTS</div>
            <div className="experience-list">
              {experiences.map((item) => (
                <ExperienceCard key={item.title} item={item} />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemMotion} className="education-strip">
          <div className="data-panel-header"><span>4</span> EDUCATION</div>
          <div className="education-content">
            <GraduationCap />
            <strong>Istanbul Ticaret University — Computer Engineering</strong>
          </div>
        </motion.div>
      </Panel>

      <Panel id="projects" page="03" eyebrow="FEATURED PROJECT" className="dirty-panel">
        <div className="dirty-grid">
          <div className="dirty-info">
            <h2>DIRTY BIRDY!</h2>
            <p className="dirty-description">
              Dirty Birdy! is a fast-paced mobile arcade game built around timing,
              chaos, cartoon energy, and playful humor. The experience combines engaging
              gameplay, animated feedback, memorable UI, and a strong comedic identity.
            </p>

            <div className="project-summary-card">
              <h3>PROJECT SUMMARY</h3>
              <dl>
                <div>
                  <dt>Role Focus:</dt>
                  <dd>Game concept, UI ideas, visual direction, creative production</dd>
                </div>
                <div>
                  <dt>Platform:</dt>
                  <dd>Mobile</dd>
                </div>
                <div>
                  <dt>Genre:</dt>
                  <dd>Arcade / Casual</dd>
                </div>
                <div>
                  <dt>Highlights:</dt>
                  <dd>Cartoon identity, combo system, power-ups, animated interfaces</dd>
                </div>
              </dl>
            </div>

            <div className="contributions-card">
              <h3>KEY CONTRIBUTIONS</h3>
              <ul>
                <li>UI / HUD concepts</li>
                <li>Game feel and visual feedback ideas</li>
                <li>Creative direction for promotional visuals</li>
                <li>AI-assisted design and content workflows</li>
              </ul>
            </div>

            <div className="store-note">
              <span>DB!</span>
              <p>
                Screenshots sourced from official store listings.
                <br />
                Available on App Store &amp; Google Play
              </p>
            </div>
          </div>

          <motion.div variants={stagger} className="dirty-gallery">
            <DirtyVisualCard size="large" headline="Cause Chaos. Rule the Sky." subline="Be Legendary • Be Dirty!" />
            <DirtyVisualCard headline="Who Will Rule the Sky?" subline="Choose Your Bird • Pick Your Chaos Style" />
            <DirtyVisualCard headline="Aim. Drop. Chaos." subline="Chaos Combo • Perfect Drop!" />
            <DirtyVisualCard headline="Missions That Keep the Chaos Going" subline="Complete Missions • Unlock More Chaos" />
            <DirtyVisualCard headline="Detailed Player Stats" subline="Track your progress • Proof of your chaos" />
          </motion.div>
        </div>
      </Panel>

      <Panel id="contact" page="04" eyebrow="SELECTED PROJECTS" className="contact-panel">
        <div className="contact-heading">
          <h2>
            SELECTED PROJECTS
            <br />
            <span>&amp;</span> CONTACT
          </h2>
        </div>

        <motion.div variants={stagger} className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>

        <div className="contact-bottom-grid">
          <motion.div variants={itemMotion} className="what-i-bring data-panel">
            <div className="data-panel-header">WHAT I BRING</div>
            <div className="bring-grid">
              {bringItems.map((item) => (
                <div key={item.label}>
                  <span>{item.icon}</span>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemMotion} className="contact-card data-panel">
            <div className="contact-lines">
              <div>
                <Sparkles />
                <span>Open to internships, freelance work, and creative collaborations</span>
              </div>
              <div>
                <MapPin />
                <span>Location: Istanbul, Türkiye</span>
              </div>
              <a href="https://github.com/Remirdy" target="_blank" rel="noreferrer">
                <Github />
                <span>GitHub: github.com/Remirdy</span>
                <ExternalLink />
              </a>
              <div>
                <Aperture />
                <span>Portfolio Focus: Game Development • Creative Technology • Motion Design</span>
              </div>
            </div>
            <div className="build-cta">
              <p>Let’s build something creative.</p>
              <ArrowRight />
            </div>
          </motion.div>
        </div>
      </Panel>

      <footer className="portfolio-footer">
        <span>© {new Date().getFullYear()} Emirhan Doygun</span>
        <a href="https://github.com/Remirdy" target="_blank" rel="noreferrer">
          View GitHub <ArrowUpRight />
        </a>
      </footer>
    </main>
  )
}
