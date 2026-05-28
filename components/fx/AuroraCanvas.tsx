'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  varying vec2 vUv;

  vec3 hash3(vec2 p){
    vec3 q = vec3(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)));
    return fract(sin(q)*43758.5453);
  }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    float a = hash3(i).x;
    float b = hash3(i+vec2(1.0,0.0)).x;
    float c = hash3(i+vec2(0.0,1.0)).x;
    float d = hash3(i+vec2(1.0,1.0)).x;
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float amp = 0.5;
    mat2 m = mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<5;i++){ v += amp*noise(p); p = m*p; amp *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x/uRes.y, 1.0);
    float t = uTime * 0.05;
    vec2 m = (uMouse - 0.5);

    vec2 q = vec2(fbm(p*2.0 + t), fbm(p*2.0 - t + 3.1));
    vec2 r = vec2(fbm(p*2.0 + q + m*0.6 + t*1.3), fbm(p*2.0 + q - m*0.6));
    float f = fbm(p*2.0 + r);

    vec3 cyan = vec3(0.0, 0.92, 1.0);
    vec3 violet = vec3(0.49, 0.24, 1.0);
    vec3 deep = vec3(0.01, 0.03, 0.06);

    vec3 col = mix(deep, violet, smoothstep(0.0, 0.9, f));
    col = mix(col, cyan, smoothstep(0.4, 1.1, length(r)));
    col += cyan * 0.08 * smoothstep(0.5, 0.0, length(p - m*0.4));

    float vig = smoothstep(1.2, 0.2, length(uv-0.5));
    col *= vig;
    gl_FragColor = vec4(col, 1.0);
  }
`

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
`

function Plane() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { size, viewport } = useThree()
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))

  useFrame((state) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value = state.clock.elapsedTime
    mat.current.uniforms.uRes.value.set(size.width, size.height)
    const target = mat.current.uniforms.uMouse.value as THREE.Vector2
    target.lerp(mouse.current, 0.05)
  })

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={(e) => {
        mouse.current.set(e.uv ? e.uv.x : 0.5, e.uv ? e.uv.y : 0.5)
      }}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        fragmentShader={fragment}
        vertexShader={vertex}
        uniforms={{
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }}
      />
    </mesh>
  )
}

export default function AuroraCanvas() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Plane />
    </Canvas>
  )
}
