'use client'

import { Suspense } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls, useGLTF } from '@react-three/drei'
import { BookOpen, Box, Camera, Cuboid, Palette, Sparkles } from 'lucide-react'
import TiltCard from '@/components/fx/TiltCard'
import TarcinLunaBook from './TarcinLunaBook'
import s from './BookConcepts.module.css'

const ENABLE_3D_CONCEPT_PREVIEW = false

type Concept = {
  no: string
  title: string
  subtitle: string
  logline: string
  palette: string[]
  world: string
  hero: string
  props: string[]
  accent: string
  visual: 'cats' | 'inventor' | 'clouds' | 'dragon' | 'library' | 'whale' | 'museum' | 'rain' | 'fox' | 'ferry'
}

const concepts: Concept[] = [
  {
    no: '01',
    title: 'Tarcin & Luna',
    subtitle: 'The Moonlight Map',
    logline: 'Two city cats discover a glowing rooftop map that only appears when every window light tells a secret.',
    palette: ['#1b2b3a', '#f6a54c', '#f2d080', '#0d1218'],
    world: 'Warm night rooftops, paper lanterns, tiny constellations and a soft adventure tone.',
    hero: 'Tarcin is brave and impulsive; Luna reads the moon like a quiet detective.',
    props: ['moon map', 'brass compass', 'rooftop tiles'],
    accent: '#f2b15f',
    visual: 'cats',
  },
  {
    no: '02',
    title: 'The Little Inventor',
    subtitle: 'and the Clockwork Garden',
    logline: 'A curious child rebuilds a forgotten greenhouse where every flower ticks, clicks and remembers a dream.',
    palette: ['#6c4a2c', '#d59a55', '#87a878', '#26201b'],
    world: 'Workshop dust, brass mechanisms, friendly robots and overgrown botanical machinery.',
    hero: 'A maker kid who solves emotional problems by building small impossible machines.',
    props: ['gear flower', 'tin helper', 'clock seed'],
    accent: '#d49b52',
    visual: 'inventor',
  },
  {
    no: '03',
    title: 'The Cloud Shepherd',
    subtitle: 'A Sky-Pasture Tale',
    logline: 'A girl learns to herd runaway cloud-lambs before they float away and forget how to rain.',
    palette: ['#9db7e7', '#f4bfd5', '#fff0d6', '#6d84ad'],
    world: 'Pastel sky fields, cotton animals, high-altitude tools and gentle motion.',
    hero: 'A tiny sky shepherd with a ribbon staff and a very serious responsibility.',
    props: ['cloud lamb', 'wind bell', 'sky bicycle'],
    accent: '#f4bfd5',
    visual: 'clouds',
  },
  {
    no: '04',
    title: 'The Tiny Dragon',
    subtitle: "Who Couldn't Roar",
    logline: 'A little dragon finds a different kind of courage when bubbles, bells and laughter become his voice.',
    palette: ['#8dbb83', '#e7a86d', '#f7d7b6', '#5d7866'],
    world: 'Festival streets, paper garlands, friendly children and toy-like fantasy props.',
    hero: 'A round-eyed dragon whose silence becomes a superpower instead of a flaw.',
    props: ['bubble horn', 'lantern cart', 'soft helmet'],
    accent: '#8dbb83',
    visual: 'dragon',
  },
  {
    no: '05',
    title: 'The Library',
    subtitle: 'That Grew Leaves',
    logline: 'A quiet reader wakes a library where book spines sprout roots and stories climb the walls.',
    palette: ['#263626', '#8b6c3f', '#d8b777', '#152018'],
    world: 'Botanical shelves, candlelit aisles, old paper, moss and professor-like warmth.',
    hero: 'A bookish child guided by a gentle librarian and a plant that chooses its reader.',
    props: ['leaf book', 'seed lamp', 'growing ladder'],
    accent: '#9fbd74',
    visual: 'library',
  },
  {
    no: '06',
    title: 'The Whale',
    subtitle: 'Under the Bed',
    logline: 'At bedtime, a child meets a starlit whale hiding in the room where fear used to live.',
    palette: ['#233d5b', '#84a9c7', '#f4d8a6', '#0e1823'],
    world: 'Moonlit bedroom ocean, floating toys, soft blue scale and safe nocturnal wonder.',
    hero: 'A child who learns that the dark can be a place for friendship.',
    props: ['bedside lamp', 'toy boat', 'star bubbles'],
    accent: '#84b9d6',
    visual: 'whale',
  },
  {
    no: '07',
    title: 'The Museum',
    subtitle: 'at Midnight',
    logline: 'A night guard kid discovers that fossils, statues and tiny exhibits rehearse history after closing.',
    palette: ['#211a16', '#d18a3d', '#6f4d2f', '#f2d390'],
    world: 'Amber museum halls, dinosaur silhouettes, lantern light and hidden mini-theaters.',
    hero: 'A careful explorer who listens before touching ancient things.',
    props: ['oil lantern', 'dino fossil', 'bronze bird'],
    accent: '#d18a3d',
    visual: 'museum',
  },
  {
    no: '08',
    title: 'The Girl',
    subtitle: 'Who Painted Rain',
    logline: 'A young painter turns a gray street into a moving rainbow and teaches the city to look up.',
    palette: ['#2f3d4f', '#f4c44f', '#dc6a8f', '#5bb6ad'],
    world: 'Rainy cobblestones, umbrella silhouettes, reflective streets and painterly color bursts.',
    hero: 'A focused girl with a yellow coat, a pink umbrella and a brush that changes weather.',
    props: ['paint umbrella', 'color cart', 'rain clock'],
    accent: '#f4c44f',
    visual: 'rain',
  },
  {
    no: '09',
    title: 'The Fox',
    subtitle: 'and the Paper Moon',
    logline: 'A fox folds paper stars to repair a fallen moon before the forest forgets nighttime.',
    palette: ['#142334', '#dc763c', '#f0c96a', '#0b111a'],
    world: 'Deep forest stage, origami constellations, warm fox fur and handmade magic.',
    hero: 'A clever fox who crafts his way through loneliness.',
    props: ['paper moon', 'folded stars', 'twig theater'],
    accent: '#dc763c',
    visual: 'fox',
  },
  {
    no: '10',
    title: 'The Little Ferry',
    subtitle: 'That Wanted to Fly',
    logline: 'A harbor ferry dreams of the sky and learns that carrying people can still feel like flying.',
    palette: ['#54768e', '#f1a85d', '#f6d2a1', '#24404e'],
    world: 'Golden harbor mornings, gulls, toy-scale boats and a hopeful engineering mood.',
    hero: 'A stubborn little ferry with a captain heart and airplane dreams.',
    props: ['life ring', 'harbor bell', 'paper wings'],
    accent: '#f1a85d',
    visual: 'ferry',
  },
]

function StorybookModel() {
  const gltf = useGLTF('/models/storybook-concept-explorer.glb')

  return (
    <Float speed={1.6} rotationIntensity={0.16} floatIntensity={0.22}>
      <primitive object={gltf.scene} scale={1.35} position={[0, -1.25, 0]} rotation={[0, -0.35, 0]} />
    </Float>
  )
}

function ConceptIllustration({ concept }: { concept: Concept }) {
  return (
    <div className={`${s.illustration} ${s[concept.visual]}`} style={{ '--accent': concept.accent } as CSSProperties}>
      <div className={s.sky} />
      <div className={s.stage} />
      <div className={s.moon} />
      <div className={s.character} />
      <div className={s.companion} />
      <div className={s.propA} />
      <div className={s.propB} />
      <div className={s.sparkField}>
        {Array.from({ length: 8 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>
    </div>
  )
}

export default function BookConcepts() {
  return (
    <section id="concepts" className={s.conceptsSection}>
      <div className={s.header}>
        <div>
          <div className={s.kicker}><BookOpen /> Illustration portfolio</div>
          <h2>Children&apos;s Book Concepts</h2>
          <p>
            A collection of soft, story-led children&apos;s book ideas with characters, palettes, props and atmosphere.
          </p>
        </div>
        <div className={s.pipeline}>
          <span><Palette /> Palette</span>
          <span><Box /> Characters</span>
          <span><Cuboid /> Props</span>
          <span><Camera /> Pages</span>
        </div>
      </div>

      <div className={s.feature}>
        <div className={`${s.showcase} ${ENABLE_3D_CONCEPT_PREVIEW ? s.withModel : ''}`}>
          {ENABLE_3D_CONCEPT_PREVIEW && (
            <div className={s.modelStage} aria-label="3D storybook character preview">
              <Canvas camera={{ position: [0, 1.1, 4.2], fov: 36 }} dpr={[1, 1.75]}>
                <ambientLight intensity={1.6} />
                <directionalLight position={[3, 4, 4]} intensity={2.4} />
                <Suspense fallback={null}>
                  <StorybookModel />
                  <Environment preset="city" />
                </Suspense>
                <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.05} maxPolarAngle={1.65} />
              </Canvas>
              <span>Book preview</span>
            </div>
          )}
          <TarcinLunaBook />
        </div>
        <div>
          <div className={s.featureLabel}><Sparkles /> Story collection</div>
          <h3>Gentle worlds for illustrated children&apos;s books</h3>
          <p>
            Tarcin & Luna and the other story ideas are presented as small book worlds built around warm palettes,
            charming characters and soft fairytale scenes.
          </p>
        </div>
      </div>

      <div className={s.grid}>
        {concepts.map((concept, index) => (
          <TiltCard className={`${s.card} group relative`} key={concept.title}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.22) }}
            >
              <ConceptIllustration concept={concept} />
              <div className={s.cardTop}>
                <span>{concept.no}</span>
                <div className={s.swatches}>
                  {concept.palette.map((color) => (
                    <i key={color} style={{ background: color }} />
                  ))}
                </div>
              </div>
              <h3>{concept.title}</h3>
              <h4>{concept.subtitle}</h4>
              <p>{concept.logline}</p>
              <dl>
                <div><dt>World</dt><dd>{concept.world}</dd></div>
                <div><dt>Hero</dt><dd>{concept.hero}</dd></div>
              </dl>
              <div className={s.props}>
                {concept.props.map((prop) => (
                  <span key={prop}>{prop}</span>
                ))}
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}

if (ENABLE_3D_CONCEPT_PREVIEW) {
  useGLTF.preload('/models/storybook-concept-explorer.glb')
}
