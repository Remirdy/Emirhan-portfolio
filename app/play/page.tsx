'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface Customer {
  id: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
  state: 'walking' | 'waiting' | 'served';
  speed: number;
  waitTime: number;
}

interface FloatingText {
  id: number;
  position: THREE.Vector3;
  text: string;
  life: number;
}

// ==================== SOPHISTICATED PROFESSIONAL BAKER ====================
function SophisticatedBaker({ characterSpeed }: { characterSpeed: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3());

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const move = new THREE.Vector3();
    if (keys.current['w'] || keys.current['arrowup']) move.z -= 1;
    if (keys.current['s'] || keys.current['arrowdown']) move.z += 1;
    if (keys.current['a'] || keys.current['arrowleft']) move.x -= 1;
    if (keys.current['d'] || keys.current['arrowright']) move.x += 1;

    if (move.lengthSq() > 0.001) {
      move.normalize();
      const targetRot = Math.atan2(move.x, move.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.22);

      velocity.current.lerp(move.multiplyScalar(characterSpeed), 0.18);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.12);
    }

    groupRef.current.position.add(velocity.current.clone().multiplyScalar(delta * 52));

    const p = groupRef.current.position;
    p.x = Math.max(-12, Math.min(12, p.x));
    p.z = Math.max(-8, Math.min(6, p.z));
    p.y = 0;

    const camTarget = p.clone().add(new THREE.Vector3(0, 7.2, 10.8));
    camera.position.lerp(camTarget, 0.07);
    camera.lookAt(p.x, 3.5, p.z);

    const t = state.clock.elapsedTime * 11;
    const bob = Math.sin(t) * 0.07;
    groupRef.current.position.y = bob * 0.4 + 0.1;

    const leftArm = groupRef.current.children.find((c: any) => c.userData?.name === 'leftArm') as THREE.Group | undefined;
    const rightArm = groupRef.current.children.find((c: any) => c.userData?.name === 'rightArm') as THREE.Group | undefined;
    if (leftArm) leftArm.rotation.x = Math.sin(t) * 1.35;
    if (rightArm) rightArm.rotation.x = -Math.sin(t) * 1.35;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1.9, 0]} castShadow>
        <capsuleGeometry args={[0.48, 1.2, 5]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 1.55, 0.38]} castShadow>
        <boxGeometry args={[1.05, 1.35, 0.1]} />
        <meshStandardMaterial color="#1e2937" />
      </mesh>
      <mesh position={[0, 3.7, 0]} castShadow>
        <sphereGeometry args={[0.52]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[0, 4.35, 0]}>
        <cylinderGeometry args={[0.62, 0.78, 0.5, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 4.55, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[-0.18, 3.82, 0.48]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#1e2937" />
      </mesh>
      <mesh position={[0.18, 3.82, 0.48]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#1e2937" />
      </mesh>
      <group position={[-0.72, 2.4, 0]} userData={{ name: 'leftArm' }}>
        <mesh>
          <capsuleGeometry args={[0.155, 0.8, 4]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.18]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      </group>
      <group position={[0.72, 2.4, 0]} userData={{ name: 'rightArm' }}>
        <mesh>
          <capsuleGeometry args={[0.155, 0.8, 4]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.18]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      </group>
      <mesh position={[-0.26, 0.72, 0]} castShadow>
        <capsuleGeometry args={[0.18, 1.0, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.26, 0.72, 0]} castShadow>
        <capsuleGeometry args={[0.18, 1.0, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

// ==================== CUSTOMER ====================
function CustomerMesh({ customer }: { customer: Customer }) {
  return (
    <group position={[customer.position.x, 0, customer.position.z]}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.34, 0.85]} />
        <meshStandardMaterial color={customer.state === 'waiting' ? '#4ade80' : '#86efac'} />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.32]} />
        <meshStandardMaterial color="#86efac" />
      </mesh>
    </group>
  );
}

// ==================== HIGH-END BAKERY PROPS ====================
function PremiumBakery() {
  return (
    <>
      <mesh position={[0, 5.2, -11.5]}>
        <boxGeometry args={[36, 10.5, 0.9]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>
      {[-8, 0, 8].map((x, i) => (
        <group key={i} position={[x, 4.5, -10.8]}>
          <mesh>
            <boxGeometry args={[5.8, 0.22, 1.6]} />
            <meshStandardMaterial color="#44403c" />
          </mesh>
          {[-1.8, 0, 1.8].map((dx, j) => (
            <mesh key={j} position={[dx, 0.35, 0]}>
              <torusGeometry args={[0.32, 0.16, 8, 18]} />
              <meshStandardMaterial color={['#c2410f', '#854d0e', '#f59e0b'][j]} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[-13.5, 5.5, 0]}>
        <boxGeometry args={[0.5, 7.5, 11]} />
        <meshStandardMaterial color="#e7e5e4" transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 1.2, -8]} castShadow receiveShadow>
        <boxGeometry args={[16.5, 2.4, 4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 2.5, -8]}>
        <boxGeometry args={[15.8, 0.22, 3.6]} />
        <meshStandardMaterial color="#431407" />
      </mesh>
      {[-6, 6].map((x, i) => (
        <group key={i} position={[x, 0, 4.2]}>
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[3.6, 2.1, 2.6]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[3.2, 0.18, 2.2]} />
            <meshStandardMaterial color="#431407" />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ==================== SCENE ====================
function Scene({ customers, floatingTexts, serveRange, onServe }: any) {
  const charRef = useRef<THREE.Group>(null!);

  const checkServe = useCallback((pos: THREE.Vector3) => {
    customers.forEach((c: Customer) => {
      if (c.state !== 'waiting') return;
      if (pos.distanceTo(c.position) < serveRange) onServe(c.id, c.position.clone());
    });
  }, [customers, serveRange, onServe]);

  useFrame(() => { if (charRef.current) checkServe(charRef.current.position); });

  return (
    <>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[36, 22]} />
        <meshStandardMaterial color="#c9a36b" />
      </mesh>

      <PremiumBakery />

      <group ref={charRef}>
        <SophisticatedBaker characterSpeed={3.9} />
      </group>

      {customers.map((c: Customer) => <CustomerMesh key={c.id} customer={c} />)}

      {floatingTexts.map((ft: FloatingText) => (
        <Html key={ft.id} position={[ft.position.x, ft.position.y + 2.5, ft.position.z]} style={{ pointerEvents: 'none' }}>
          <div className="text-xl font-semibold text-emerald-400 drop-shadow" style={{ opacity: ft.life / 48 }}>
            {ft.text}
          </div>
        </Html>
      ))}

      <ambientLight intensity={0.48} />
      <directionalLight position={[7, 18, 4]} intensity={1.05} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-9, 13, -3]} intensity={0.4} />
    </>
  );
}

export default function DonutPlaceSophisticated() {
  const [money, setMoney] = useState(820);
  const [score, setScore] = useState(2150);
  const [level, setLevel] = useState(5);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const [serveRange, setServeRange] = useState(5.0);
  const [moneyPerServe, setMoneyPerServe] = useState(38);
  const [spawnRate, setSpawnRate] = useState(1950);

  const nextSpawnRef = useRef(Date.now() + 750);
  const customerIdRef = useRef(500);

  const spawnCustomer = useCallback(() => {
    setCustomers(prev => [...prev, {
      id: customerIdRef.current++,
      position: new THREE.Vector3((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 11 - 0.5),
      target: new THREE.Vector3((Math.random() - 0.5) * 16, 0, (Math.random() - 0.5) * 8),
      state: 'walking',
      speed: 1.85 + Math.random() * 0.7,
      waitTime: 0,
    }]);
  }, []);

  const handleServe = useCallback((id: number, pos: THREE.Vector3) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, state: 'served' as const } : c));
    const earned = moneyPerServe;
    setMoney(m => m + earned);
    setScore(s => s + earned * 3);
    setFloatingTexts(prev => [...prev, { id: Date.now(), position: pos.clone(), text: `+${earned}$`, life: 45 }]);
    setTimeout(() => setCustomers(prev => prev.filter(c => c.id !== id)), 320);
  }, [moneyPerServe]);

  const buyUpgrade = (type: 'range' | 'money' | 'spawn') => {
    if (type === 'range' && money >= 210) { setMoney(m => m - 210); setServeRange(r => Math.min(r + 1.1, 9.2)); }
    if (type === 'money' && money >= 380) { setMoney(m => m - 380); setMoneyPerServe(m => Math.floor(m * 1.36)); }
    if (type === 'spawn' && money >= 290) { setMoney(m => m - 290); setSpawnRate(r => Math.max(r - 480, 680)); }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now > nextSpawnRef.current && customers.length < 6) {
        spawnCustomer();
        nextSpawnRef.current = now + spawnRate;
      }

      setCustomers(prev => prev.map(c => {
        if (c.state === 'served') return c;
        const dist = c.position.distanceTo(c.target);
        if (c.state === 'walking' && dist < 0.95) {
          return { ...c, state: 'waiting', waitTime: now + 4800 + Math.random() * 2800 };
        }
        if (c.state === 'waiting' && now > c.waitTime) {
          return { ...c, state: 'walking', target: new THREE.Vector3((Math.random() - 0.5) * 16, 0, (Math.random() - 0.5) * 8) };
        }
        if (c.state === 'walking') {
          const dir = c.target.clone().sub(c.position).normalize();
          return { ...c, position: c.position.clone().add(dir.multiplyScalar(c.speed * 0.065)) };
        }
        return c;
      }));

      setFloatingTexts(prev => prev.map(t => ({ ...t, life: t.life - 1 })).filter(t => t.life > 0));
    }, 65);

    return () => clearInterval(interval);
  }, [spawnRate]);

  useEffect(() => {
    const init = Array.from({ length: 5 }, (_, i) => ({
      id: 600 + i,
      position: new THREE.Vector3((i - 2) * 5, 0, -1 - i * 1.2),
      target: new THREE.Vector3((i - 2) * 4.2, 0, 1.5 + Math.random() * 2.5),
      state: 'walking' as const,
      speed: 1.9,
      waitTime: 0,
    }));
    setCustomers(init);
  }, []);

  return (
    <div className="min-h-screen bg-[#16120f] text-white">
      <div className="max-w-[1320px] mx-auto p-6">
        <div className="flex justify-between items-end mb-5 px-4">
          <div className="flex items-center gap-4">
            <span className="text-[74px] drop-shadow">🍩</span>
            <div>
              <div className="text-[60px] font-bold tracking-[-4.2px] text-amber-300">DONUT PLACE</div>
              <div className="text-amber-400/60 text-xs tracking-[4px] -mt-2.5">PREMIUM SOPHISTICATED 3D</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[26px] font-mono">
            <div className="bg-black/60 px-7 py-2.5 rounded-2xl border border-amber-900/50 flex items-center gap-3">
              <span>💰</span> <span className="tabular-nums">{money}</span>
            </div>
            <div className="bg-black/60 px-7 py-2.5 rounded-2xl border border-amber-900/50 flex items-center gap-3">
              <span>⭐</span> <span className="tabular-nums">{score}</span>
            </div>
            <div className="bg-amber-500/10 px-6 py-2.5 rounded-2xl text-amber-300 border border-amber-500/30">Lv. {level}</div>
          </div>
        </div>

        <div className="relative mx-auto rounded-[32px] overflow-hidden border-[16px] border-[#2c2118] shadow-[0_35px_80px_rgb(0,0,0,0.7)]" style={{ width: '100%', maxWidth: '1220px', height: '650px' }}>
          <Canvas shadows camera={{ position: [0, 8.5, 13], fov: 46 }} style={{ background: '#2c2118' }}>
            <Scene customers={customers} floatingTexts={floatingTexts} serveRange={serveRange} onServe={handleServe} />
          </Canvas>
        </div>

        <div className="text-center mt-4 text-amber-300/60 text-xs tracking-[2px]">WASD • Yaklaş • Servis • Upgrade ile Geliştir</div>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1220px] mx-auto">
          <button onClick={() => buyUpgrade('range')} disabled={money < 210} className="bg-gradient-to-br from-amber-700 to-amber-800 disabled:opacity-40 px-7 py-5 rounded-3xl text-left border border-amber-950 active:scale-[0.985]">
            <div className="font-semibold text-2xl tracking-tight">⚡ Servis Menzili</div>
            <div className="text-amber-200 text-sm">Daha uzaktan servis</div>
            <div className="text-[33px] font-mono tracking-tighter mt-1.5">210$</div>
          </button>
          <button onClick={() => buyUpgrade('money')} disabled={money < 380} className="bg-gradient-to-br from-orange-700 to-orange-800 disabled:opacity-40 px-7 py-5 rounded-3xl text-left border border-orange-950 active:scale-[0.985]">
            <div className="font-semibold text-2xl tracking-tight">💵 Daha Yüksek Kazanç</div>
            <div className="text-orange-200 text-sm">Her servisten daha fazla para</div>
            <div className="text-[33px] font-mono tracking-tighter mt-1.5">380$</div>
          </button>
          <button onClick={() => buyUpgrade('spawn')} disabled={money < 290} className="bg-gradient-to-br from-yellow-700 to-amber-800 disabled:opacity-40 px-7 py-5 rounded-3xl text-left border border-yellow-950 active:scale-[0.985]">
            <div className="font-semibold text-2xl tracking-tight">👥 Daha Fazla Müşteri</div>
            <div className="text-yellow-200 text-sm">Spawn hızını artır</div>
            <div className="text-[33px] font-mono tracking-tighter mt-1.5">290$</div>
          </button>
        </div>

        <p className="text-center text-[10px] text-amber-500/50 mt-8 tracking-[1.5px]">
          DONUT PLACE 3D • Premium Sophisticated Bakery • Her servis {moneyPerServe}$ • Menzil {serveRange.toFixed(1)}m
        </p>

        {/* KÜÇÜK KREDİ */}
        <p className="text-center text-[9px] text-amber-500/30 mt-3 tracking-[0.5px]">
          3D Character model by <a href="https://skfb.ly/6WPZD" target="_blank" className="underline hover:text-amber-400">Diana Liu</a> (CC BY 4.0)
        </p>
      </div>
    </div>
  );
}
