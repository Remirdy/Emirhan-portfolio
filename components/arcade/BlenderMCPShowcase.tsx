'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei'
import s from './BlenderMCPShowcase.module.css'

const MODEL_URL = '/models/blendermcp-adventurer-preview.glb'

function AdventurerModel() {
  const gltf = useGLTF(MODEL_URL)
  return <primitive object={gltf.scene} />
}

export default function BlenderMCPShowcase() {
  return (
    <div className={s.viewer} aria-label="Interactive BlenderMCP 3D preview">
      <div className={s.viewport}>
        <Canvas camera={{ position: [1.9, 1.35, 3.4], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
          <color attach="background" args={['#050911']} />
          <ambientLight intensity={1.35} />
          <directionalLight position={[3, 4, 3]} intensity={2.4} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.25}>
              <AdventurerModel />
            </Bounds>
            <Environment preset="city" />
            <ContactShadows position={[0, -1.05, 0]} opacity={0.42} scale={5} blur={2.4} far={3} />
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={1.7}
            maxDistance={5.2}
            autoRotate
            autoRotateSpeed={0.75}
          />
        </Canvas>
      </div>
      <div className={s.caption}>
        <span>Current preview asset</span>
        <strong>standing adventurer GLB</strong>
      </div>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
