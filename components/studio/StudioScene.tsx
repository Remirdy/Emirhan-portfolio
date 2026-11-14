'use client'

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Center, Html, OrbitControls, RoundedBox, useGLTF, useTexture } from '@react-three/drei'
import { Group, SRGBColorSpace } from 'three'
import type { Category } from './projects'
import s from './Studio.module.css'

type SceneProps = { onSelect: (id: string) => void; category: Category; reset: number }

function Block({ position, size, color, radius = .035 }: { position: [number, number, number]; size: [number, number, number]; color: string; radius?: number }) {
  return <RoundedBox args={size} radius={radius} smoothness={3} position={position} castShadow receiveShadow><meshStandardMaterial color={color} roughness={.65} /></RoundedBox>
}

function Selectable({ id, label, position, children, onSelect, muted = false }: { id: string; label: string; position: [number, number, number]; children: ReactNode; onSelect: (id: string) => void; muted?: boolean }) {
  const ref = useRef<Group>(null)
  const [hover, setHover] = useState(false)
  const { invalidate } = useThree()
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useFrame((_, delta) => {
    if (!ref.current) return
    const target = hover ? .07 : 0
    const next = reduced ? target : ref.current.position.y + (target - ref.current.position.y) * Math.min(delta * 12, 1)
    ref.current.position.y = next
    if (Math.abs(target - next) > .001) invalidate()
  })
  const stop = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); setHover(true); invalidate() }
  return <group position={position} onPointerOver={stop} onPointerOut={() => { setHover(false); invalidate() }} onClick={event => { event.stopPropagation(); if (event.delta < 4) onSelect(id) }}>
    <group ref={ref}>{children}</group>
    <Html position={[0, -.08, .55]} center distanceFactor={7} zIndexRange={[12, 0]}><button className={`${s.objectLabel} ${hover ? s.objectHover : ''} ${muted ? s.objectMuted : ''}`} aria-label={`Open ${label.slice(5)}`} onClick={event => { event.stopPropagation(); onSelect(id) }}>{label.slice(0, 2)}<span className={s.markerTitle}>{label.slice(5)} ↗</span></button></Html>
  </group>
}

function Screen({ image, width, height, position }: { image: string; width: number; height: number; position: [number, number, number] }) {
  const texture = useTexture(image)
  return <mesh position={position}><planeGeometry args={[width, height]} /><meshBasicMaterial map={texture} map-colorSpace={SRGBColorSpace} toneMapped={false} /></mesh>
}

export function InteriorModel() {
  const { scene } = useGLTF('/studies/quiet-corner.glb')
  const model = useMemo(() => scene.clone(true), [scene])
  return <Center><primitive object={model} /></Center>
}

function Desk({ onSelect, category, reset }: SceneProps) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null)
  useEffect(() => { controls.current?.reset() }, [reset])
  return <>
    <color attach="background" args={['#e9e7df']} />
    <ambientLight intensity={1.5} />
    <directionalLight position={[-4, 8, 5]} intensity={3} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.001} />
    <directionalLight position={[5, 4, -4]} intensity={1.5} color="#f4dab4" />
    <group position={[0, -.4, 0]}>
      <Block position={[0, .55, 0]} size={[7, .22, 3.8]} color="#a67c51" radius={.1} />
      <Block position={[0, .68, 0]} size={[5.8, .025, 2.9]} color="#bcc3ad" radius={.03} />
      {[-2.7, 2.7].map(x => <Block key={x} position={[x, -.12, 0]} size={[.18, 1.25, 2.9]} color="#3c4840" />)}
      <Selectable id="dirty" label="01 · Dirty Birdy!" position={[-.8, .72, -.65]} onSelect={onSelect} muted={category !== 'All' && category !== 'Games'}>
        <Block position={[0, .025, 0]} size={[1, .07, .65]} color="#343c36" />
        <Block position={[0, .4, -.12]} size={[.15, .8, .13]} color="#485349" />
        <Block position={[0, 1.25, -.07]} size={[2.5, 1.58, .15]} color="#303c35" radius={.07} />
        <Screen image="/portfolio/dirty-birdy-1.jpg" width={2.32} height={1.305} position={[0, 1.29, .011]} />
        <mesh position={[0, .53, .015]}><circleGeometry args={[.018, 16]} /><meshBasicMaterial color="#b9d99a" /></mesh>
      </Selectable>
      <Selectable id="juggle" label="02 · Juggle Trap" position={[1.18, .74, .12]} onSelect={onSelect} muted={category !== 'All' && category !== 'Games'}>
        <group rotation={[-.17, -.12, 0]}>
          <Block position={[0, .6, 0]} size={[.63, 1.22, .09]} color="#252a27" radius={.07} />
          <Screen image="/portfolio/juggle-trap-1.jpg" width={.55} height={.978} position={[0, .6, .048]} />
          <Block position={[0, 1.14, .05]} size={[.16, .025, .008]} color="#252a27" radius={.003} />
        </group>
        <Block position={[0, .02, .05]} size={[.64, .1, .46]} color="#56634c" />
      </Selectable>
      <Selectable id="blender" label="03 · GitHub projects" position={[-1.1, .74, 1]} onSelect={onSelect} muted={category !== 'All' && category !== 'Code'}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Block position={[0, 0, .03]} size={[1.9, .64, .09]} color="#e8e5d8" />
          {Array.from({ length: 4 }, (_, row) => Array.from({ length: 13 }, (_, col) => <Block key={`${row}-${col}`} position={[-.82 + col * .137, -.22 + row * .14, .09]} size={[.11, .105, .025]} color={row === 3 && col > 3 && col < 9 ? '#6e7f53' : '#c5c9ba'} radius={.012} />))}
        </group>
      </Selectable>
      <Selectable id="atelier" label="04 · Quiet Corner" position={[2.4, .74, -.83]} onSelect={onSelect} muted={category !== 'All' && category !== '3D'}>
        <Block position={[0, .015, 0]} size={[1.35, .07, 1.16]} color="#eee6d3" />
        <group rotation={[-.13, -.15, 0]}><Block position={[0, .48, 0]} size={[1.19, .98, .07]} color="#616e50" /><Screen image="/studies/quiet-corner.webp" width={1.11} height={.925} position={[0, .49, .04]} /></group>
      </Selectable>
      <Selectable id="motion" label="05 · Motion Design" position={[2.5, .75, 1.05]} onSelect={onSelect} muted={category !== 'All' && category !== 'Motion'}>
        <group rotation={[-.06, 0, -.12]}>
          <Block position={[0, .04, 0]} size={[1.03, .08, .7]} color="#c7774d" />
          <Block position={[0, .09, 0]} size={[.94, .02, .62]} color="#e4c7a4" />
          <Block position={[-.25, .108, -.1]} size={[.3, .008, .24]} color="#556344" radius={.01} />
          <Block position={[.2, .108, .08]} size={[.35, .008, .13]} color="#b96a49" radius={.01} />
        </group>
      </Selectable>
      <group position={[-2.7, .73, -.9]}>
        <mesh position={[0, .05, 0]} castShadow><cylinderGeometry args={[.25, .27, .09, 32]} /><meshStandardMaterial color="#303d33" /></mesh>
        <mesh position={[0, .6, 0]} castShadow><cylinderGeometry args={[.025, .025, 1.2, 16]} /><meshStandardMaterial color="#3f4b3d" metalness={.4} roughness={.4} /></mesh>
        <mesh position={[0, 1.2, 0]} castShadow><coneGeometry args={[.43, .36, 32, 1, true]} /><meshStandardMaterial color="#566647" side={2} /></mesh>
        <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[.4, 32]} /><meshBasicMaterial color="#f2dcb1" side={2} /></mesh>
      </group>
      <mesh position={[-2.65, .88, .95]} castShadow><cylinderGeometry args={[.15, .11, .32, 32]} /><meshStandardMaterial color="#c87750" /></mesh>
      <mesh position={[-2.65, 1.045, .95]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.13, 32]} /><meshStandardMaterial color="#38231b" /></mesh>
      <mesh position={[-2.45, .91, .95]} rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[.085, .024, 10, 24]} /><meshStandardMaterial color="#c87750" /></mesh>
    </group>
    <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={.13} /></mesh>
    <OrbitControls ref={controls} makeDefault target={[0, .65, 0]} enablePan={false} enableZoom={false} minPolarAngle={.65} maxPolarAngle={1.2} minAzimuthAngle={-.5} maxAzimuthAngle={.75} enableDamping dampingFactor={.08} />
  </>
}

export default function StudioScene(props: SceneProps) {
  return <Canvas shadows frameloop="demand" dpr={[1, 1.5]} camera={{ position: [6, 6.1, 9.8], fov: 35 }} gl={{ antialias: true, alpha: false }} onCreated={({ gl }) => gl.setClearColor('#e9e7df')} fallback={<div className={s.sceneFallback}>Choose a project from the list below.</div>}><Suspense fallback={null}><Desk {...props} /></Suspense></Canvas>
}
