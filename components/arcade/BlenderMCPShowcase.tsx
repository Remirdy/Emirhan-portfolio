'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei'
import s from './BlenderMCPShowcase.module.css'

const MODEL_URL = '/models/donuttycoon_bakery_furniture.glb'

function BakeryFurnitureModel() {
  const gltf = useGLTF(MODEL_URL)
  return <primitive object={gltf.scene} />
}

export default function BlenderMCPShowcase() {
  return (
    <div className={s.viewer} aria-label="Interactive BlenderMCP 3D preview">
      <div className={s.viewport}>
        <Canvas camera={{ position: [2.8, 1.6, 4.8], fov: 32 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
          <color attach="background" args={['#050911']} />
          <ambientLight intensity={1.35} />
          <directionalLight position={[3, 4, 3]} intensity={2.4} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.4}>
              <BakeryFurnitureModel />
            </Bounds>
            <Environment preset="city" />
            <ContactShadows position={[0, -0.6, 0]} opacity={0.45} scale={6} blur={2.8} far={4} />
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={2.2}
            maxDistance={7.5}
            autoRotate
            autoRotateSpeed={0.6}
          />
        </Canvas>
      </div>
      <div className={s.caption}>
        <div>
          <span>Live MCP output • game-ready</span>
          <strong>Bakery Furniture Pack (Donut Tycoon)</strong>
        </div>
        <div className={s.noteInline}>Tables • Chairs • Counter • Pastry Display • Shelves</div>
      </div>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
