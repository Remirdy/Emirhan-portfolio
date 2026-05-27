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

// ==================== PROFESSIONAL 3D BAKER ====================
function ProfessionalBaker({ characterSpeed }: { characterSpeed: number }) {
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
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.28);

      velocity.current.lerp(move.multiplyScalar(characterSpeed), 0.32);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.22);
    }

    groupRef.current.position.add(velocity.current.clone().multiplyScalar(delta * 55));

    // Soft bounds
    const p = groupRef.current.position;
    p.x = Math.max(-12.5, Math.min(12.5, p.x));
    p.z = Math.max(-8.5, Math.min(6.5, p.z));
    p.y = 0;

    // Smooth camera follow (cinematic)
    const camTarget = p.clone().add(new THREE.Vector3(0, 7.8, 11.5));
    camera.position.lerp(camTarget, 0.085);
    camera.lookAt(p.x, 3.2, p.z);

    // Elegant walk animation
    const t = state.clock.elapsedTime * 13;
    const bob = Math.sin(t) * 0.09;
    groupRef.current.position.y = bob * 0.35 + 0.12;

    // Arm swing
    const leftArm = groupRef.current.children.find((c: any) => c.userData?.name === 'leftArm') as THREE.Group | undefined;
    const rightArm = groupRef.current.children.find((c: any) => c.userData?.name === 'rightArm') as THREE.Group | undefined;
    if (leftArm) leftArm.rotation.x = Math.sin(t) * 1.6;
    if (rightArm) rightArm.rotation.x = -Math.sin(t) * 1.6;
  });

  return (
    <group ref={groupRef}>
      {/* Torso (white shirt + apron) */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <capsuleGeometry args={[0.52, 1.25, 5]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Apron */}
      <mesh position={[0, 1.6, 0.35]} castShadow>
        <boxGeometry args={[1.1, 1.4, 0.12]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 3.65, 0]} castShadow>
        <sphereGeometry args={[0.58]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>

      {/* Chef Hat (more professional) */}
      <mesh position={[0, 4.35, 0]}>
        <cylinderGeometry args={[0.68, 0.82, 0.55, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 4.55, 0]}>
        <sphereGeometry args={[0.55]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 3.75, 0.52]}>
        <sphereGeometry args={[0.11]} />
        <meshStandardMaterial color="#1e2937" />
      </mesh>
      <mesh position={[0.2, 3.75, 0.52]}>
        <sphereGeometry args={[0.11]} />
        <meshStandardMaterial color="#1e2937" />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.78, 2.35, 0]} userData={{ name: 'leftArm' }}>
        <mesh>
          <capsuleGeometry args={[0.17, 0.85, 4]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.78, 2.35, 0]} userData={{ name: 'rightArm' }}>
        <mesh>
          <capsuleGeometry args={[0.17, 0.85, 4]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      </group>

      {/* Legs (dark pants) */}
      <mesh position={[-0.3, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.2, 1.05, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.3, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.2, 1.05, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

// ==================== CUSTOMER ====================
function CustomerMesh({ customer }: { customer: Customer }) {
  return (
    <group position={[customer.position.x, 0, customer.position.z]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.36, 0.9]} />
        <meshStandardMaterial color={customer.state === 'waiting' ? '#4ade80' : '#86efac'} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.34]} />
        <meshStandardMaterial color="#86efac" />
      </mesh>
    </group>
  );
}

// ==================== BAKERY PROPS ====================
function BakeryProps() {
  return (
    <>
      {/* Back Wall */}
      <mesh position={[0, 5, -12]}>
        <boxGeometry args={[38, 10, 0.8]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>

      {/* Wooden Shelves */}
      {[-9, 0, 9].map((x, i) => (
        <group key={i} position={[x, 4.2, -11.2]}>
          <mesh>
            <boxGeometry args={[6, 0.25, 1.8]} />
            <meshStandardMaterial color="#57534e" />
          </mesh>
          {/* Donuts on shelf */}
          <mesh position={[-1.5, 0.4, 0]}>
            <torusGeometry args={[0.35, 0.18, 8, 20]} />
            <meshStandardMaterial color="#c2410f" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <torusGeometry args={[0.35, 0.18, 8, 20]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          <mesh position={[1.5, 0.4, 0]}>
            <torusGeometry args={[0.35, 0.18, 8, 20]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      ))}

      {/* Big Window */}
      <mesh position={[-14, 5, 0]}>
        <boxGeometry args={[0.6, 7, 12]} />
        <meshStandardMaterial color="#e7e5e4" transparent opacity={0.25} />
      </mesh>

      {/* Main Counter */}
      <mesh position={[0, 1.15, -8.2]} castShadow receiveShadow>
        <boxGeometry args={[17, 2.3, 4.2]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 2.4, -8.2]}>
        <boxGeometry args={[16.2, 0.25, 3.8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Cooking Stations */}
      {[-6.5, 6.5].map((x, i) => (
        <group key={i} position={[x, 0, 4.5]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[3.8, 2, 2.8]} />
            <meshStandardMaterial color="#854d0e" />
          </mesh>
          <mesh position={[0, 2.1, 0]}>
            <boxGeometry args={[3.4, 0.2, 2.4]} />
            <meshStandardMaterial color="#451a03" />
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
      if (pos.distanceTo(c.position) < serveRange) {
        onServe(c.id, c.position.clone());
      }
    });
  }, [customers, serveRange, onServe]);

  useFrame(() => {
    if (charRef.current) checkServe(charRef.current.position);
  });

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[38, 24]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>

      <BakeryProps />

      {/* Character */}
      <group ref={charRef}>
        <ProfessionalBaker characterSpeed={4.6} />
      </group>

      {customers.map((c: Customer) => <CustomerMesh key={c.id} customer={c} />)}

      {floatingTexts.map((ft: FloatingText) => (
        <Html key={ft.id} position={[ft.position.x, ft.position.y + 2.6, ft.position.z]} style={{ pointerEvents: 'none' }}>
          <div className="text-[22px] font-semibold text-emerald-400 drop-shadow-lg" style={{ opacity: ft.life / 50 }}>
            {ft.text}
          </div>
        </Html>
      ))}

      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 20, 5]} intensity={1.1} castShadow shadow-mapSize={[1536, 1536]} />
      <directionalLight position={[-10, 14, -4]} intensity={0.45} />
    </>
  );
}

export default function DonutPlacePolished() {
  const [money, setMoney] = useState(780);
  const [score, setScore] = useState(1920);
  const [level, setLevel] = useState(5);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const [serveRange, setServeRange] = useState(4.8);
  const [moneyPerServe, setMoneyPerServe] = useState(35);
  const [spawnRate, setSpawnRate] = useState(2100);

  const nextSpawnRef = useRef(Date.now() + 800);
  const customerIdRef = useRef(300);

  const spawnCustomer = useCallback(() => {
    setCustomers(prev => [...prev, {
      id: customerIdRef.current++,
      position: new THREE.Vector3((Math.random() - 0.5) * 22, 0, (Math.random() - 0.5) * 12 - 1),
      target: new THREE.Vector3((Math.random() - 0.5) * 18, 0, (Math.random() - 0.5) * 9),
      state: 'walking',
      speed: 1.9 + Math.random() * 0.8,
      waitTime: 0,
    }]);
  }, []);

  const handleServe = useCallback((id: number, pos: THREE.Vector3) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, state: 'served' as const } : c));
    const earned = moneyPerServe;
    setMoney(m => m + earned);
    setScore(s => s + earned * 3);

    setFloatingTexts(prev => [...prev, { id: Date.now(), position: pos.clone(), text: `+${earned}$`, life: 48 }]);

    setTimeout(() => setCustomers(prev => prev.filter(c => c.id !== id)), 350);
  }, [moneyPerServe]);

  const buyUpgrade = (type: 'range' | 'money' | 'spawn') => {
    if (type === 'range' && money >= 200) { setMoney(m => m - 200); setServeRange(r => Math.min(r + 1.15, 9)); }
    if (type === 'money' && money >= 360) { setMoney(m => m - 360); setMoneyPerServe(m => Math.floor(m * 1.38)); }
    if (type === 'spawn' && money >= 280) { setMoney(m => m - 280); setSpawnRate(r => Math.max(r - 520, 720)); }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now > nextSpawnRef.current && customers.length < 7) {
        spawnCustomer();
        nextSpawnRef.current = now + spawnRate;
      }

      setCustomers(prev => prev.map(c => {
        if (c.state === 'served') return c;
        const dist = c.position.distanceTo(c.target);
        if (c.state === 'walking' && dist < 1) {
          return { ...c, state: 'waiting', waitTime: now + 5200 + Math.random() * 3000 };
        }
        if (c.state === 'waiting' && now > c.waitTime) {
          return { ...c, state: 'walking', target: new THREE.Vector3((Math.random() - 0.5) * 18, 0, (Math.random() - 0.5) * 9) };
        }
        if (c.state === 'walking') {
          const dir = c.target.clone().sub(c.position).normalize();
          return { ...c, position: c.position.clone().add(dir.multiplyScalar(c.speed * 0.07)) };
        }
        return c;
      }));

      setFloatingTexts(prev => prev.map(t => ({ ...t, life: t.life - 1 })).filter(t => t.life > 0));
    }, 70);

    return () => clearInterval(interval);
  }, [spawnRate]);

  useEffect(() => {
    const init = Array.from({ length: 5 }, (_, i) => ({
      id: 400 + i,
      position: new THREE.Vector3((i - 2) * 5.5, 0, -1.5 - i * 1.3),
      target: new THREE.Vector3((i - 2) * 4.8, 0, 2 + Math.random() * 3),
      state: 'walking' as const,
      speed: 2.0,
      waitTime: 0,
    }));
    setCustomers(init);
  }, []);

  return (
    <div className="min-h-screen bg-[#18120f] text-white">
      <div className="max-w-[1300px] mx-auto p-6">
        <div className="flex justify-between items-end mb-5 px-3">
          <div className="flex items-center gap-4">
            <span className="text-[72px] drop-shadow">🍩</span>
            <div>
              <div className="text-[58px] font-bold tracking-[-4px] text-amber-300">DONUT PLACE</div>
              <div className="text-amber-400/60 text-[13px] tracking-[3.5px] -mt-2">PREMIUM 3D EDITION</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[27px] font-mono">
            <div className="bg-black/50 px-7 py-2.5 rounded-2xl border border-amber-900/60 flex items-center gap-3">
              <span>💰</span><span className="tabular-nums">{money}</span>
            </div>
            <div className="bg-black/50 px-7 py-2.5 rounded-2xl border border-amber-900/60 flex items-center gap-3">
              <span>⭐</span><span className="tabular-nums">{score}</span>
            </div>
            <div className="bg-amber-500/10 px-6 py-2.5 rounded-2xl text-amber-300 border border-amber-500/30 font-medium">Level {level}</div>
          </div>
        </div>

        <div className="relative mx-auto rounded-[30px] overflow-hidden border-[15px] border-[#2c2118] shadow-[0_30px_70px_rgb(0,0,0,0.65)]" style={{ width: '100%', maxWidth: '1200px', height: '640px' }}>
          <Canvas shadows camera={{ position: [0, 9, 14], fov: 47 }} style={{ background: '#2c2118' }}>
            <Scene customers={customers} floatingTexts={floatingTexts} serveRange={serveRange} onServe={handleServe} />
          </Canvas>
        </div>

        <div className="text-center mt-4 text-amber-300/70 text-[13px] tracking-wider">
          WASD ile hareket et • Müşterilere yaklaş • Otomatik servis • Upgrade ile geliştir
        </div>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1200px] mx-auto">
          <button onClick={() => buyUpgrade('range')} disabled={money < 200} className="bg-gradient-to-br from-amber-700 to-amber-800 disabled:opacity-40 px-7 py-5 rounded-3xl text-left border border-amber-950 active:scale-[0.985] transition-all">
            <div className="font-semibold text-2xl tracking-tight">⚡ Servis Menzili</div>
            <div className="text-amber-200/90 text-sm mt-0.5">Daha uzaktan servis yap</div>
            <div className="text-[34px] font-mono tracking-tighter mt-2">200$</div>
          </button>

          <button onClick={() => buyUpgrade('money')} disabled={money < 360} className="bg-gradient-to-br from-orange-700 to-orange-800 disabled:opacity-40 px-7 py-5 rounded-3xl text-left border border-orange-950 active:scale-[0.985] transition-all">
            <div className="font-semibold text-2xl tracking-tight">💵 Daha Yüksek Kazanç</div>
            <div className="text-orange-200/90 text-sm mt-0.5">Her servisten daha fazla para</div>
            <div className="text-[34px] font-mono tracking-tighter mt-2">360$</div>
          </button>

          <button onClick={() => buyUpgrade('spawn')} disabled={money < 280} className="bg-gradient-to-br from-yellow-700 to-amber-800 disabled:opacity-40 px-7 py-5 rounded-3xl text-left border border-yellow-950 active:scale-[0.985] transition-all">
            <div className="font-semibold text-2xl tracking-tight">👥 Daha Fazla Müşteri</div>
            <div className="text-yellow-200/90 text-sm mt-0.5">Spawn hızını artır</div>
            <div className="text-[34px] font-mono tracking-tighter mt-2">280$</div>
          </button>
        </div>

        <p className="text-center text-[10px] text-amber-500/50 mt-8 tracking-[1.5px]">
          DONUT PLACE 3D • Premium Bakery Feel • Her servis {moneyPerServe}$ • Menzil {serveRange.toFixed(1)}m
        </p>
      </div>
    </div>
  );
}
