'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// ==================== TYPES ====================
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

// ==================== 3D CHARACTER ====================
function Character({ 
  onServe, 
  serveRange, 
  characterSpeed 
}: { 
  onServe: (customerId: number, position: THREE.Vector3) => void; 
  serveRange: number;
  characterSpeed: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3());

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
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
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.25);

      velocity.current.lerp(move.multiplyScalar(characterSpeed), 0.4);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.3);
    }

    groupRef.current.position.add(velocity.current.clone().multiplyScalar(delta * 60));

    // Bounds
    const p = groupRef.current.position;
    p.x = Math.max(-14, Math.min(14, p.x));
    p.z = Math.max(-10, Math.min(8, p.z));
    p.y = 0;

    // Camera follow (third person style)
    const camTarget = p.clone().add(new THREE.Vector3(0, 9, 13));
    camera.position.lerp(camTarget, 0.12);
    camera.lookAt(p.x, 2.5, p.z);

    // Simple walk bob
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 12) * 0.08 + 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <capsuleGeometry args={[0.55, 1.4, 6]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 3.4, 0]} castShadow>
        <sphereGeometry args={[0.6]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      {/* Chef Hat */}
      <mesh position={[0, 4.15, 0]}>
        <cylinderGeometry args={[0.75, 0.95, 0.7, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.22, 3.5, 0.52]}>
        <sphereGeometry args={[0.13]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.22, 3.5, 0.52]}>
        <sphereGeometry args={[0.13]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Smile */}
      <mesh position={[0, 3.15, 0.55]}>
        <torusGeometry args={[0.18, 0.04, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}

// ==================== CUSTOMER ====================
function CustomerMesh({ customer, onClick }: { customer: Customer; onClick: (id: number) => void }) {
  return (
    <group 
      position={[customer.position.x, 0, customer.position.z]}
      onClick={() => onClick(customer.id)}
    >
      <mesh position={[0, 1.3, 0]} castShadow>
        <capsuleGeometry args={[0.4, 1.0]} />
        <meshStandardMaterial color={customer.state === 'waiting' ? '#4ade80' : '#86efac'} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.38]} />
        <meshStandardMaterial color="#86efac" />
      </mesh>
      {customer.state === 'waiting' && (
        <Html position={[0, 3.2, 0]} style={{ pointerEvents: 'none' }}>
          <div className="text-[10px] bg-black/70 text-white px-2 py-0.5 rounded">Servis et!</div>
        </Html>
      )}
    </group>
  );
}

// ==================== SHOP SCENE ====================
function ShopScene({ 
  customers, 
  onServeCustomer,
  floatingTexts,
  serveRange 
}: { 
  customers: Customer[];
  onServeCustomer: (id: number, pos: THREE.Vector3) => void;
  floatingTexts: FloatingText[];
  serveRange: number;
}) {
  const characterRef = useRef<THREE.Group>(null!);

  // Basit servis kontrolü (karakter yaklaştığında)
  const checkServe = useCallback((charPos: THREE.Vector3) => {
    customers.forEach(c => {
      if (c.state !== 'waiting') return;
      const dist = charPos.distanceTo(c.position);
      if (dist < serveRange) {
        onServeCustomer(c.id, c.position.clone());
      }
    });
  }, [customers, onServeCustomer, serveRange]);

  useFrame(() => {
    if (characterRef.current) {
      checkServe(characterRef.current.position);
    }
  });

  return (
    <>
      {/* Zemin */}
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[42, 28]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>

      {/* Tezgah */}
      <mesh position={[0, 1.1, -9]} castShadow receiveShadow>
        <boxGeometry args={[20, 2.2, 4.5]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 2.3, -9]}>
        <boxGeometry args={[19, 0.3, 4]} />
        <meshStandardMaterial color="#6b4420" />
      </mesh>

      {/* Yan masalar */}
      {[-8, 8].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 2]} castShadow>
          <boxGeometry args={[4, 1.5, 3]} />
          <meshStandardMaterial color="#854d0e" />
        </mesh>
      ))}

      {/* 3D Karakter */}
      <group ref={characterRef}>
        <Character 
          onServe={() => {}} 
          serveRange={serveRange} 
          characterSpeed={6.5} 
        />
      </group>

      {/* Müşteriler */}
      {customers.map(c => (
        <CustomerMesh 
          key={c.id} 
          customer={c} 
          onClick={(id) => onServeCustomer(id, c.position.clone())} 
        />
      ))}

      {/* Floating +para yazıları */}
      {floatingTexts.map(ft => (
        <Html key={ft.id} position={[ft.position.x, ft.position.y + 2.5, ft.position.z]} style={{ pointerEvents: 'none' }}>
          <div className="text-2xl font-bold text-emerald-400 drop-shadow" style={{ opacity: ft.life / 60 }}>
            {ft.text}
          </div>
        </Html>
      ))}

      {/* Işıklar */}
      <ambientLight intensity={0.55} />
      <directionalLight 
        position={[12, 25, 8]} 
        intensity={1.3} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
    </>
  );
}

// ==================== ANA OYUN ====================
export default function DonutPlace3DAdvanced() {
  const [money, setMoney] = useState(650);
  const [score, setScore] = useState(1240);
  const [level, setLevel] = useState(3);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Upgrade parametreleri
  const [serveRange, setServeRange] = useState(4.2);
  const [moneyPerServe, setMoneyPerServe] = useState(28);
  const [spawnRate, setSpawnRate] = useState(2800); // ms
  const [characterSpeed, setCharacterSpeed] = useState(6.5);

  const nextSpawnRef = useRef(Date.now() + 1200);
  const customerIdRef = useRef(100);

  // Müşteri spawn
  const spawnCustomer = useCallback(() => {
    const x = (Math.random() - 0.5) * 26;
    const z = (Math.random() - 0.5) * 16 - 2;
    const newCustomer: Customer = {
      id: customerIdRef.current++,
      position: new THREE.Vector3(x, 0, z),
      target: new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        0,
        (Math.random() - 0.5) * 12 - 1
      ),
      state: 'walking',
      speed: 2.2 + Math.random() * 1.1,
      waitTime: 0,
    };
    setCustomers(prev => [...prev, newCustomer]);
  }, []);

  // Servis yap
  const handleServe = useCallback((id: number, pos: THREE.Vector3) => {
    setCustomers(prev => 
      prev.map(c => 
        c.id === id ? { ...c, state: 'served' as const } : c
      )
    );

    const earned = moneyPerServe;
    setMoney(m => m + earned);
    setScore(s => s + earned * 3);

    // Floating text
    const newText: FloatingText = {
      id: Date.now(),
      position: pos.clone(),
      text: `+${earned}$`,
      life: 55,
    };
    setFloatingTexts(prev => [...prev, newText]);

    // Level up kontrolü
    setTimeout(() => {
      setScore(s => {
        if (s > level * 2200) {
          setLevel(l => l + 1);
          return s;
        }
        return s;
      });
    }, 200);

    // Servis sonrası müşteri temizle
    setTimeout(() => {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }, 420);
  }, [moneyPerServe, level]);

  // Upgrade fonksiyonları
  const buyUpgrade = (type: 'range' | 'money' | 'spawn' | 'speed') => {
    if (type === 'range' && money >= 180) {
      setMoney(m => m - 180);
      setServeRange(r => Math.min(r + 1.1, 9));
    }
    if (type === 'money' && money >= 320) {
      setMoney(m => m - 320);
      setMoneyPerServe(m => Math.floor(m * 1.45));
    }
    if (type === 'spawn' && money >= 260) {
      setMoney(m => m - 260);
      setSpawnRate(r => Math.max(r - 650, 850));
    }
    if (type === 'speed' && money >= 210) {
      setMoney(m => m - 210);
      setCharacterSpeed(s => Math.min(s + 1.8, 14));
    }
  };

  // Game loop (müşteri hareketi + spawn)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      // Spawn
      if (now > nextSpawnRef.current && customers.length < 9) {
        spawnCustomer();
        nextSpawnRef.current = now + spawnRate;
      }

      // Müşteri hareket güncelle
      setCustomers(prev => 
        prev.map(c => {
          if (c.state === 'served') return c;

          const distToTarget = c.position.distanceTo(c.target);

          if (c.state === 'walking' && distToTarget < 1.2) {
            return { 
              ...c, 
              state: 'waiting', 
              waitTime: now + 6500 + Math.random() * 4000 
            };
          }

          if (c.state === 'waiting' && now > c.waitTime) {
            // Yeni hedef belirle
            const newTarget = new THREE.Vector3(
              (Math.random() - 0.5) * 22,
              0,
              (Math.random() - 0.5) * 13 - 1
            );
            return { ...c, state: 'walking', target: newTarget };
          }

          if (c.state === 'walking') {
            const dir = c.target.clone().sub(c.position).normalize();
            const newPos = c.position.clone().add(dir.multiplyScalar(c.speed * 0.08));
            return { ...c, position: newPos };
          }
          return c;
        })
      );

      // Floating text güncelle
      setFloatingTexts(prev => 
        prev
          .map(t => ({ ...t, life: t.life - 1 }))
          .filter(t => t.life > 0)
      );
    }, 80);

    return () => clearInterval(interval);
  }, [spawnRate, customers.length, spawnCustomer]);

  // Başlangıç müşterileri
  useEffect(() => {
    const initial: Customer[] = Array.from({ length: 5 }, (_, i) => ({
      id: 10 + i,
      position: new THREE.Vector3((i - 2) * 5.5, 0, -3 - i * 1.2),
      target: new THREE.Vector3((i - 2) * 4.5, 0, 2 + Math.random() * 4),
      state: 'walking',
      speed: 2.4,
      waitTime: 0,
    }));
    setCustomers(initial);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a120b] via-[#2c2118] to-[#1a120b] text-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto p-5">
        {/* Header */}
        <div className="flex items-end justify-between mb-4 px-2">
          <div className="flex items-center gap-4">
            <div className="text-7xl drop-shadow">🍩</div>
            <div>
              <div className="text-6xl font-bold tracking-[-3.5px] text-amber-300">DONUT PLACE</div>
              <div className="text-amber-400/70 text-sm -mt-1 tracking-[3px]">3D EDITION</div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-3xl font-mono">
            <div className="bg-black/40 border border-amber-900/60 px-6 py-2 rounded-2xl flex items-center gap-3">
              <span>💰</span> <span className="tabular-nums">{money}</span>
            </div>
            <div className="bg-black/40 border border-amber-900/60 px-6 py-2 rounded-2xl flex items-center gap-3">
              <span>⭐</span> <span className="tabular-nums">{score}</span>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/40 px-5 py-2 rounded-2xl text-2xl font-medium text-amber-300">
              Lv.{level}
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="relative mx-auto rounded-[28px] overflow-hidden border-[14px] border-[#3a2a1f] shadow-[0_25px_60px_rgb(0,0,0,0.6)]" 
             style={{ width: '100%', maxWidth: '1180px', height: '620px' }}>
          <Canvas
            shadows
            camera={{ position: [0, 11, 16], fov: 48 }}
            style={{ background: '#2c2118' }}
          >
            <ShopScene 
              customers={customers} 
              onServeCustomer={handleServe}
              floatingTexts={floatingTexts}
              serveRange={serveRange}
            />
          </Canvas>
        </div>

        <div className="text-center mt-3 text-amber-300/80 text-sm tracking-wider">
          WASD ile dolaş • Müşterilere yaklaşınca otomatik servis olur • Para kazan → Upgrade al
        </div>

        {/* Upgrade Butonları */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1180px] mx-auto">
          <button 
            onClick={() => buyUpgrade('range')}
            disabled={money < 180}
            className="bg-gradient-to-br from-amber-600 to-amber-700 disabled:opacity-40 hover:brightness-110 active:scale-[0.985] transition-all text-left px-6 py-5 rounded-3xl border border-amber-900/50">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-2xl tracking-tight">⚡ Servis Menzili</div>
                <div className="text-amber-200 text-sm">Daha uzaktan servis yap</div>
              </div>
              <div className="text-4xl font-mono tabular-nums tracking-tighter">180$</div>
            </div>
          </button>

          <button 
            onClick={() => buyUpgrade('money')}
            disabled={money < 320}
            className="bg-gradient-to-br from-orange-600 to-orange-700 disabled:opacity-40 hover:brightness-110 active:scale-[0.985] transition-all text-left px-6 py-5 rounded-3xl border border-orange-900/50">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-2xl tracking-tight">💵 Daha Çok Para</div>
                <div className="text-orange-200 text-sm">Her servisten daha fazla kazan</div>
              </div>
              <div className="text-4xl font-mono tabular-nums tracking-tighter">320$</div>
            </div>
          </button>

          <button 
            onClick={() => buyUpgrade('spawn')}
            disabled={money < 260}
            className="bg-gradient-to-br from-yellow-600 to-amber-700 disabled:opacity-40 hover:brightness-110 active:scale-[0.985] transition-all text-left px-6 py-5 rounded-3xl border border-yellow-900/50">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-2xl tracking-tight">👥 Daha Fazla Müşteri</div>
                <div className="text-yellow-200 text-sm">Müşteriler daha sık gelir</div>
              </div>
              <div className="text-4xl font-mono tabular-nums tracking-tighter">260$</div>
            </div>
          </button>

          <button 
            onClick={() => buyUpgrade('speed')}
            disabled={money < 210}
            className="bg-gradient-to-br from-red-600 to-orange-700 disabled:opacity-40 hover:brightness-110 active:scale-[0.985] transition-all text-left px-6 py-5 rounded-3xl border border-red-900/50">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-2xl tracking-tight">🏃 Karakter Hızı</div>
                <div className="text-red-200 text-sm">Daha hızlı dolaş</div>
              </div>
              <div className="text-4xl font-mono tabular-nums tracking-tighter">210$</div>
            </div>
          </button>
        </div>

        <p className="text-center text-[10px] text-amber-500/50 mt-7 tracking-[2px]">
          DONUT PLACE 3D • Her servis = {moneyPerServe}$ • Menzil: {serveRange.toFixed(1)}m
        </p>
      </div>
    </div>
  );
}
