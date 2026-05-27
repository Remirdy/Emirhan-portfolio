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

// ==================== IMPROVED 3D CHARACTER WITH LIMBS ====================
function DetailedCharacter({ characterSpeed }: { characterSpeed: number }) {
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
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.3);

      velocity.current.lerp(move.multiplyScalar(characterSpeed), 0.35);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.25);
    }

    groupRef.current.position.add(velocity.current.clone().multiplyScalar(delta * 60));

    // Bounds
    const p = groupRef.current.position;
    p.x = Math.max(-13, Math.min(13, p.x));
    p.z = Math.max(-9, Math.min(7, p.z));
    p.y = 0;

    // Camera follow
    const camTarget = p.clone().add(new THREE.Vector3(0, 8.5, 12));
    camera.position.lerp(camTarget, 0.1);
    camera.lookAt(p.x, 2.8, p.z);

    // Walk bob + arm swing
    const walkCycle = Math.sin(state.clock.elapsedTime * 14) * 0.12;
    groupRef.current.position.y = walkCycle * 0.3 + 0.15;

    // Simple arm swing
    const leftArm = groupRef.current.children.find(c => c.userData.name === 'leftArm') as THREE.Group;
    const rightArm = groupRef.current.children.find(c => c.userData.name === 'rightArm') as THREE.Group;
    if (leftArm) leftArm.rotation.x = walkCycle * 1.8;
    if (rightArm) rightArm.rotation.x = -walkCycle * 1.8;
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1.3, 5]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[0.55]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>

      {/* Chef Hat */}
      <mesh position={[0, 4.2, 0]}>
        <cylinderGeometry args={[0.7, 0.88, 0.65, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 3.6, 0.5]}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.2, 3.6, 0.5]}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.75, 2.2, 0]} userData={{ name: 'leftArm' }}>
        <mesh>
          <capsuleGeometry args={[0.18, 0.9, 3]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.22]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.75, 2.2, 0]} userData={{ name: 'rightArm' }}>
        <mesh>
          <capsuleGeometry args={[0.18, 0.9, 3]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.22]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.28, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.22, 1.1, 4]} />
        <meshStandardMaterial color="#854d0e" />
      </mesh>
      <mesh position={[0.28, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.22, 1.1, 4]} />
        <meshStandardMaterial color="#854d0e" />
      </mesh>
    </group>
  );
}

// ==================== CUSTOMER ====================
function CustomerMesh({ customer }: { customer: Customer }) {
  return (
    <group position={[customer.position.x, 0, customer.position.z]}>
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.38, 0.95]} />
        <meshStandardMaterial color={customer.state === 'waiting' ? '#4ade80' : '#86efac'} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.36]} />
        <meshStandardMaterial color="#86efac" />
      </mesh>
    </group>
  );
}

// ==================== COOKING STATION ====================
function CookingStation({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      {/* Counter top */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[3.2, 0.25, 2.2]} />
        <meshStandardMaterial color="#854d0e" />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1, 2]} />
        <meshStandardMaterial color="#6b4420" />
      </mesh>
      {/* Donut display area */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 24]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
}

// ==================== SHOP SCENE ====================
function ShopScene({ customers, floatingTexts, serveRange, onServe }: any) {
  const characterRef = useRef<THREE.Group>(null!);

  const checkServe = useCallback((charPos: THREE.Vector3) => {
    customers.forEach((c: Customer) => {
      if (c.state !== 'waiting') return;
      const dist = charPos.distanceTo(c.position);
      if (dist < serveRange) {
        onServe(c.id, c.position.clone());
      }
    });
  }, [customers, serveRange, onServe]);

  useFrame(() => {
    if (characterRef.current) checkServe(characterRef.current.position);
  });

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[40, 26]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>

      {/* Main Counter */}
      <mesh position={[0, 1.1, -8.5]} castShadow receiveShadow>
        <boxGeometry args={[18, 2.2, 4]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>

      {/* Cooking Stations */}
      <CookingStation position={[-7, 0, 3]} label="Fırın 1" />
      <CookingStation position={[7, 0, 3]} label="Fırın 2" />

      {/* Character */}
      <group ref={characterRef}>
        <DetailedCharacter characterSpeed={5.8} />
      </group>

      {/* Customers */}
      {customers.map((c: Customer) => (
        <CustomerMesh key={c.id} customer={c} />
      ))}

      {/* Floating texts */}
      {floatingTexts.map((ft: FloatingText) => (
        <Html key={ft.id} position={[ft.position.x, ft.position.y + 2.8, ft.position.z]} style={{ pointerEvents: 'none' }}>
          <div className="text-2xl font-bold text-emerald-400 drop-shadow" style={{ opacity: ft.life / 55 }}>
            {ft.text}
          </div>
        </Html>
      ))}

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 22, 6]} intensity={1.25} castShadow shadow-mapSize={[1024, 1024]} />
    </>
  );
}

export default function DonutPlace3DImproved() {
  const [money, setMoney] = useState(720);
  const [score, setScore] = useState(1580);
  const [level, setLevel] = useState(4);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const [serveRange, setServeRange] = useState(4.5);
  const [moneyPerServe, setMoneyPerServe] = useState(32);
  const [spawnRate, setSpawnRate] = useState(2400);

  const nextSpawnRef = useRef(Date.now() + 900);
  const customerIdRef = useRef(200);

  const spawnCustomer = useCallback(() => {
    const x = (Math.random() - 0.5) * 24;
    const z = (Math.random() - 0.5) * 14 - 1;
    setCustomers(prev => [...prev, {
      id: customerIdRef.current++,
      position: new THREE.Vector3(x, 0, z),
      target: new THREE.Vector3((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 10),
      state: 'walking',
      speed: 2.1 + Math.random(),
      waitTime: 0,
    }]);
  }, []);

  const handleServe = useCallback((id: number, pos: THREE.Vector3) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, state: 'served' as const } : c));

    const earned = moneyPerServe;
    setMoney(m => m + earned);
    setScore(s => s + earned * 3);

    setFloatingTexts(prev => [...prev, {
      id: Date.now(),
      position: pos.clone(),
      text: `+${earned}$`,
      life: 50,
    }]);

    setTimeout(() => {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }, 380);
  }, [moneyPerServe]);

  const buyUpgrade = (type: 'range' | 'money' | 'spawn') => {
    if (type === 'range' && money >= 190) { setMoney(m => m - 190); setServeRange(r => Math.min(r + 1.2, 9.5)); }
    if (type === 'money' && money >= 340) { setMoney(m => m - 340); setMoneyPerServe(m => Math.floor(m * 1.4)); }
    if (type === 'spawn' && money >= 270) { setMoney(m => m - 270); setSpawnRate(r => Math.max(r - 580, 780)); }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      if (now > nextSpawnRef.current && customers.length < 8) {
        spawnCustomer();
        nextSpawnRef.current = now + spawnRate;
      }

      setCustomers(prev => prev.map(c => {
        if (c.state === 'served') return c;
        const dist = c.position.distanceTo(c.target);
        if (c.state === 'walking' && dist < 1.1) {
          return { ...c, state: 'waiting', waitTime: now + 5800 + Math.random() * 3500 };
        }
        if (c.state === 'waiting' && now > c.waitTime) {
          return { ...c, state: 'walking', target: new THREE.Vector3((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 11) };
        }
        if (c.state === 'walking') {
          const dir = c.target.clone().sub(c.position).normalize();
          return { ...c, position: c.position.clone().add(dir.multiplyScalar(c.speed * 0.075)) };
        }
        return c;
      }));

      setFloatingTexts(prev => prev.map(t => ({ ...t, life: t.life - 1 })).filter(t => t.life > 0));
    }, 75);

    return () => clearInterval(interval);
  }, [spawnRate, customers.length]);

  useEffect(() => {
    const initial = Array.from({ length: 4 }, (_, i) => ({
      id: 50 + i,
      position: new THREE.Vector3((i - 1.5) * 6, 0, -2 - i * 1.5),
      target: new THREE.Vector3((i - 1.5) * 5, 0, 1 + Math.random() * 3),
      state: 'walking' as const,
      speed: 2.3,
      waitTime: 0,
    }));
    setCustomers(initial);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a120b] text-white">
      <div className="max-w-[1280px] mx-auto p-5">
        <div className="flex justify-between items-end mb-4 px-2">
          <div className="flex items-center gap-4">
            <span className="text-7xl">🍩</span>
            <div>
              <div className="text-6xl font-bold tracking-[-3px] text-amber-300">DONUT PLACE</div>
              <div className="text-amber-400/60 text-sm tracking-[2.5px] -mt-1">3D • DETAILED</div>
            </div>
          </div>
          <div className="flex gap-5 text-3xl font-mono">
            <div className="bg-black/40 px-6 py-2 rounded-2xl border border-amber-900/50">💰 {money}</div>
            <div className="bg-black/40 px-6 py-2 rounded-2xl border border-amber-900/50">⭐ {score}</div>
            <div className="bg-amber-500/10 px-5 py-2 rounded-2xl text-amber-300 border border-amber-500/30">Lv.{level}</div>
          </div>
        </div>

        <div className="relative mx-auto rounded-[26px] overflow-hidden border-[13px] border-[#3a2a1f] shadow-2xl" style={{ width: '100%', maxWidth: '1180px', height: '620px' }}>
          <Canvas shadows camera={{ position: [0, 10, 15], fov: 48 }} style={{ background: '#2c2118' }}>
            <ShopScene 
              customers={customers} 
              floatingTexts={floatingTexts} 
              serveRange={serveRange} 
              onServe={handleServe} 
            />
          </Canvas>
        </div>

        <div className="text-center mt-3 text-amber-300/70 text-sm">WASD ile hareket • Müşterilere yaklaş • Otomatik servis • Upgrade al</div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1180px] mx-auto">
          <button onClick={() => buyUpgrade('range')} disabled={money < 190} className="bg-gradient-to-br from-amber-600 to-amber-700 disabled:opacity-40 px-6 py-5 rounded-3xl text-left border border-amber-900/40 active:scale-[0.985]">
            <div className="font-bold text-2xl">⚡ Servis Menzili +</div>
            <div className="text-amber-200 text-sm">Daha uzaktan servis yap</div>
            <div className="text-4xl font-mono mt-1">190$</div>
          </button>
          <button onClick={() => buyUpgrade('money')} disabled={money < 340} className="bg-gradient-to-br from-orange-600 to-orange-700 disabled:opacity-40 px-6 py-5 rounded-3xl text-left border border-orange-900/40 active:scale-[0.985]">
            <div className="font-bold text-2xl">💵 Daha Fazla Para</div>
            <div className="text-orange-200 text-sm">Her servisten daha çok kazan</div>
            <div className="text-4xl font-mono mt-1">340$</div>
          </button>
          <button onClick={() => buyUpgrade('spawn')} disabled={money < 270} className="bg-gradient-to-br from-yellow-600 to-amber-700 disabled:opacity-40 px-6 py-5 rounded-3xl text-left border border-yellow-900/40 active:scale-[0.985]">
            <div className="font-bold text-2xl">👥 Daha Çok Müşteri</div>
            <div className="text-yellow-200 text-sm">Spawn hızı artar</div>
            <div className="text-4xl font-mono mt-1">270$</div>
          </button>
        </div>

        <p className="text-center text-xs text-amber-500/50 mt-6">Her servis = {moneyPerServe}$ • Menzil {serveRange.toFixed(1)}m • Karakter yavaşlatıldı + kol/bacak eklendi</p>
      </div>
    </div>
  );
}
