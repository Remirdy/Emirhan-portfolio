'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, Users, Zap, ArrowUpCircle, Briefcase, TrendingUp, Star, Shield
} from 'lucide-react';

interface Customer {
  id: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
  state: 'walking' | 'waiting' | 'served' | 'leaving' | 'angry';
  speed: number;
  waitTime: number;
  color?: string;
  moodTimer?: number;
  rotationY?: number;
}

interface FloatingText {
  id: number;
  position: THREE.Vector3;
  text: string;
  life: number;
  color?: string;
}

interface Employee {
  id: number;
  type: 'cashier' | 'waiter' | 'baker';
  level: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
  state: 'idle' | 'walking_to_customer' | 'serving' | 'returning' | 'working';
  targetCustomerId?: number;
  rotationY?: number;
}

// ==================== PARTICLE SYSTEM ====================
function Particles({ count = 50, color = "#fbbf24", isPlaying = false, position = [0, 5, 0] }: { count?: number, color?: string, isPlaying?: boolean, position?: [number, number, number] }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particlesRef = useRef<{t: number, factor: number, speed: number, xFactor: number, yFactor: number, zFactor: number, mx: number, my: number}[]>([]);

  useEffect(() => {
    if (particlesRef.current.length === 0) {
      const temp = [];
      for (let i = 0; i < count; i++) {
        const t = Math.random() * 100;
        const factor = 20 + Math.random() * 100;
        const speed = 0.01 + Math.random() / 200;
        const xFactor = -10 + Math.random() * 20;
        const yFactor = -10 + Math.random() * 20;
        const zFactor = -10 + Math.random() * 20;
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
      }
      particlesRef.current = temp;
    }
  }, [count]);

  useFrame(() => {
    if (!mesh.current || !isPlaying) return;
    particlesRef.current.forEach((particle, i) => {
      let { t } = particle; const { factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (!isPlaying) return null;

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={position}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color={color} roughness={0.1} emissive={color} emissiveIntensity={0.5} />
    </instancedMesh>
  );
}

// ==================== PROCEDURAL CHARACTER ====================
function ProceduralCharacter({ position, scale = 1, color = '#facc15', isMoving = false, type = 'customer', rotationY = 0 }: { position: THREE.Vector3, scale?: number, color?: string | null, isMoving?: boolean, type?: string, rotationY?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.copy(position);
      // We handle rotation manually outside for smooth turn, but if passed down, just apply it
      groupRef.current.rotation.y = rotationY;

      if (isMoving) {
        const time = state.clock.elapsedTime * 10; // Slower, more realistic animation
        // Bobbing
        groupRef.current.position.y = position.y + Math.abs(Math.sin(time)) * 0.08;
        
        // Leg swing
        if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.rotation.x = Math.sin(time) * 0.4;
            rightLegRef.current.rotation.x = -Math.sin(time) * 0.4;
        }
        // Arm swing
        if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.x = -Math.sin(time) * 0.4;
            rightArmRef.current.rotation.x = Math.sin(time) * 0.4;
        }
        // Slight body tilt
        if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(time * 0.5) * 0.03;

      } else {
        // Idle
        const time = state.clock.elapsedTime * 2;
        groupRef.current.position.y = position.y + Math.sin(time) * 0.02;
        
        if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
            rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
        }
        if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);
        }
        if (bodyRef.current) bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, 0, 0.1);
      }
    }
  });

  // Clothing colors based on type
  let shirtColor = '#ffffff';
  let pantsColor = '#3b82f6'; // Jeans
  const skinColor = '#fcd34d'; // Skin tone
  
  if (type === 'player') {
      shirtColor = '#fbbf24'; // Yellow
      pantsColor = '#1f2937';
  } else if (type === 'cashier') {
      shirtColor = '#3b82f6'; // Blue
      pantsColor = '#1e3a8a';
  } else if (type === 'waiter') {
      shirtColor = '#8b5cf6'; // Purple
      pantsColor = '#111827';
  } else if (type === 'baker') {
      shirtColor = '#ec4899'; // Pink
      pantsColor = '#e5e7eb'; // Apron-like
  } else {
      // Customers
      shirtColor = color || '#a8a29e';
  }

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Body Group */}
      <group ref={bodyRef} position={[0, 1.0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.7, 0.35]} />
          <meshStandardMaterial color={shirtColor} roughness={0.8} />
        </mesh>
        
        {/* Left Arm Group */}
        <group ref={leftArmRef} position={[-0.4, 0.25, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.18, 0.5, 0.18]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
          <mesh position={[0, -0.55, 0]} castShadow>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </group>

        {/* Right Arm Group */}
        <group ref={rightArmRef} position={[0.4, 0.25, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.18, 0.5, 0.18]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
          <mesh position={[0, -0.55, 0]} castShadow>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </group>
      </group>

      {/* Left Leg Group */}
      <group ref={leftLegRef} position={[-0.18, 0.65, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.22, 0.5, 0.22]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.55, 0.05]} castShadow>
          <boxGeometry args={[0.24, 0.15, 0.3]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* Right Leg Group */}
      <group ref={rightLegRef} position={[0.18, 0.65, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.22, 0.5, 0.22]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.55, 0.05]} castShadow>
          <boxGeometry args={[0.24, 0.15, 0.3]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* Mood/Role Indicator */}
      {type !== 'player' && color && type === 'customer' && (
        <mesh position={[0, 2.1, 0]}>
          <coneGeometry args={[0.12, 0.25, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

function PlayerCharacter({ characterSpeed, customers, serveRange, onServe, isFever }: { characterSpeed: number, customers: Customer[], serveRange: number, onServe: (id: number, pos: THREE.Vector3) => void, isFever: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3());
  const [isMoving, setIsMoving] = useState(false);

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

  const checkServe = useCallback((pos: THREE.Vector3) => {
    customers.forEach((c: Customer) => {
      if (c.state !== 'waiting') return;
      if (pos.distanceTo(c.position) < serveRange) onServe(c.id, c.position.clone());
    });
  }, [customers, serveRange, onServe]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const move = new THREE.Vector3();
    if (keys.current['w'] || keys.current['arrowup']) move.z -= 1;
    if (keys.current['s'] || keys.current['arrowdown']) move.z += 1;
    if (keys.current['a'] || keys.current['arrowleft']) move.x -= 1;
    if (keys.current['d'] || keys.current['arrowright']) move.x += 1;

    const actualSpeed = isFever ? characterSpeed * 1.5 : characterSpeed;
    const moving = move.lengthSq() > 0.001;
    
    if (moving !== isMoving) setIsMoving(moving);

    if (moving) {
      move.normalize();
      const targetRot = Math.atan2(move.x, move.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.2);
      velocity.current.lerp(move.multiplyScalar(actualSpeed), 0.15);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.1);
    }

    const proposedPos = groupRef.current.position.clone().add(velocity.current.clone().multiplyScalar(delta * 50));
    let hit = false;
    
    // Counter Collision (approx x: -9 to 9, z: -10 to -6)
    if (proposedPos.x > -9.5 && proposedPos.x < 9.5 && proposedPos.z < -6.5 && proposedPos.z > -10.5) hit = true;
    
    // Tables Collision (x: ~ -8 and 8, z: ~ 5)
    if (Math.abs(proposedPos.x - (-8)) < 2.5 && Math.abs(proposedPos.z - 5) < 2.5) hit = true;
    if (Math.abs(proposedPos.x - (8)) < 2.5 && Math.abs(proposedPos.z - 5) < 2.5) hit = true;

    if (!hit) {
       groupRef.current.position.copy(proposedPos);
    }

    // World Bounds
    const p = groupRef.current.position;
    p.x = Math.max(-14, Math.min(14, p.x));
    p.z = Math.max(-10, Math.min(9, p.z));
    p.y = 0;

    checkServe(p);

    // Camera follow
    const camTarget = p.clone().add(new THREE.Vector3(0, 8, 12));
    camera.position.lerp(camTarget, 0.05);
    camera.lookAt(p.x, 3.2, p.z);
  });

  return (
    <group ref={groupRef}>
      <ProceduralCharacter position={new THREE.Vector3(0,0,0)} isMoving={isMoving} type="player" />
      {/* Player Indicator */}
      <mesh position={[0, 2.5, 0]}>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color={isFever ? "#ff00ff" : "#fbbf24"} emissive={isFever ? "#ff00ff" : "#fbbf24"} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// ==================== PREMIUM BAKERY ENVIRONMENT ====================
function PremiumBakery({ isFever, hasVipLounge, hasDriveThru }: { isFever: boolean, hasVipLounge: boolean, hasDriveThru: boolean }) {
  const counterColor = isFever ? "#ff00ff" : "#78350f";
  
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color={isFever ? "#2a0a2a" : "#c9a36b"} roughness={0.8} />
      </mesh>
      
      {/* Tile Pattern */}
      <gridHelper args={[40, 20, isFever ? "#ff00ff" : "#ffffff", isFever ? "#4a004a" : "#d9b37b"]} position={[0, 0, 0]} />

      {/* Back Wall */}
      <mesh position={[0, 5.2, -12.5]} receiveShadow>
        <boxGeometry args={[40, 10.5, 1]} />
        <meshStandardMaterial color={isFever ? "#110022" : "#57534e"} />
      </mesh>
      
      {/* Neon Sign */}
      <group position={[0, 7.5, -11.9]}>
        <mesh>
          <boxGeometry args={[10, 2, 0.2]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[9.5, 1.5]} />
          <meshStandardMaterial 
            color={isFever ? "#ff00ff" : "#f59e0b"} 
            emissive={isFever ? "#ff00ff" : "#f59e0b"} 
            emissiveIntensity={isFever ? 5 : 2} 
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Shelves */}
      {[-9, 0, 9].map((x, i) => (
        <group key={"shelf-"+i} position={[x, 4.5, -11.5]}>
          <mesh>
            <boxGeometry args={[6.5, 0.3, 2]} />
            <meshStandardMaterial color="#44403c" />
          </mesh>
          {[-2.2, 0, 2.2].map((dx, j) => (
            <mesh key={"donut-"+i+"-"+j} position={[dx, 0.4, 0]} rotation={[Math.PI/4, 0, 0]}>
              <torusGeometry args={[0.4, 0.2, 16, 32]} />
              <meshStandardMaterial color={['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'][Math.floor(Math.random() * 4)]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Glass Divider */}
      <mesh position={[-15.5, 5.5, 0]}>
        <boxGeometry args={[0.5, 7.5, 14]} />
        <meshStandardMaterial color={isFever ? "#ff00ff" : "#e7e5e4"} transparent opacity={0.2} />
      </mesh>
      <mesh position={[15.5, 5.5, 0]}>
        <boxGeometry args={[0.5, 7.5, 14]} />
        <meshStandardMaterial color={isFever ? "#ff00ff" : "#e7e5e4"} transparent opacity={0.2} />
      </mesh>

      {/* Main Counter */}
      <mesh position={[0, 1.2, -8.5]} castShadow receiveShadow>
        <boxGeometry args={[18, 2.4, 4.5]} />
        <meshStandardMaterial color={counterColor} />
      </mesh>
      <mesh position={[0, 2.5, -8.5]}>
        <boxGeometry args={[18.5, 0.2, 4.8]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Display Cases */}
      {[-5, 5].map((x, i) => (
        <group key={"case-"+i} position={[x, 3.5, -8.5]}>
          <mesh transparent opacity={0.3}>
            <boxGeometry args={[4, 1.8, 2]} />
            <meshStandardMaterial color="#88ccff" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}

      
      {/* VIP Lounge */}
      {hasVipLounge && (
        <group position={[12, 0, -4]}>
          <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
          <mesh position={[0, 1, -4]}>
            <boxGeometry args={[8, 2, 0.5]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>
          {/* Fancy Sofa */}
          <mesh position={[0, 0.5, -2]} castShadow>
             <boxGeometry args={[6, 1, 2]} />
             <meshStandardMaterial color="#dc2626" />
          </mesh>
          {/* VIP Text */}
          <mesh position={[0, 3, -4]}>
             <planeGeometry args={[4, 1]} />
             <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
          </mesh>
        </group>
      )}

      {/* Drive Thru */}
      {hasDriveThru && (
        <group position={[-14, 0, -5]}>
           <mesh position={[-2, 2.5, 0]}>
             <boxGeometry args={[0.5, 5, 6]} />
             <meshStandardMaterial color="#111827" />
           </mesh>
           <mesh position={[-2, 1.5, 0]}>
             <boxGeometry args={[0.6, 1.5, 3]} />
             <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} />
           </mesh>
           <mesh position={[-3, 4, 0]}>
             <boxGeometry args={[3, 0.5, 4]} />
             <meshStandardMaterial color="#f59e0b" />
           </mesh>
        </group>
      )}

      {/* Tables */}
      {[-8, 8].map((x, i) => (
        <group key={"table-"+i} position={[x, 0, 5]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
            <meshStandardMaterial color="#e5e5e5" />
          </mesh>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.5, 1.5, 16]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Chairs */}
          {[0, 1, 2, 3].map((j) => (
            <mesh key={"chair-"+i+"-"+j} position={[Math.cos(j * Math.PI/2) * 2.2, 0.8, Math.sin(j * Math.PI/2) * 2.2]} castShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.1, 16]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

// ==================== SCENE ====================
function Scene({ customers, employees, floatingTexts, serveRange, onServe, isFever, playerSpeed, currentTime, hasVipLounge, hasDriveThru }: { customers: Customer[], employees: Employee[], floatingTexts: FloatingText[], serveRange: number, onServe: (id: number, pos: THREE.Vector3) => void, isFever: boolean, playerSpeed: number, currentTime: number, hasVipLounge: boolean, hasDriveThru: boolean }) {
  return (
    <>
      <PremiumBakery isFever={isFever} hasVipLounge={hasVipLounge} hasDriveThru={hasDriveThru} />
      <Particles isPlaying={isFever} count={100} color="#ff00ff" />

      <PlayerCharacter 
        characterSpeed={playerSpeed} 
        customers={customers}
        serveRange={serveRange}
        onServe={onServe}
        isFever={isFever}
      />

      {customers.map((c: Customer) => (
        <ProceduralCharacter 
          key={"cust-"+c.id} 
          position={c.position} 
          rotationY={c.rotationY || 0}
          type="customer"
          color={
            c.state === 'waiting' 
              ? (c.moodTimer && currentTime - c.moodTimer > 18000 ? '#ef4444' : c.moodTimer && currentTime - c.moodTimer > 10000 ? '#eab308' : '#4ade80') 
              : (c.state === 'leaving' ? '#9ca3af' : c.state === 'angry' ? '#dc2626' : '#a8a29e')
          } 
          isMoving={c.state === 'walking' || c.state === 'leaving' || c.state === 'angry'}
        />
      ))}

      {employees.map((e: Employee) => (
        <ProceduralCharacter 
          key={"emp-"+e.id} 
          position={e.position} 
          rotationY={e.rotationY || 0}
          type={e.type}
          scale={0.85} 
          isMoving={e.state === 'walking_to_customer' || e.state === 'returning' || e.state === 'working'}
        />
      ))}

      {floatingTexts.map((ft: FloatingText) => (
        <Html key={"ft-"+ft.id} position={[ft.position.x, ft.position.y + 2.5, ft.position.z]} style={{ pointerEvents: 'none' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: ft.life / 48, y: -((48 - ft.life) * 2), scale: 1 }}
            className={"text-2xl font-bold drop-shadow-lg whitespace-nowrap " + (ft.color || 'text-emerald-400')}
          >
            {ft.text}
          </motion.div>
        </Html>
      ))}

      <ambientLight intensity={isFever ? 0.8 : 0.5} color={isFever ? "#ffccff" : "#ffffff"} />
      <directionalLight position={[7, 18, 4]} intensity={isFever ? 1.5 : 1.1} castShadow shadow-mapSize={[2048, 2048]} color={isFever ? "#ff00ff" : "#ffffff"} />
      <directionalLight position={[-9, 13, -3]} intensity={0.4} color={isFever ? "#00ffff" : "#ffffff"} />
      
      {isFever && (
        <pointLight position={[0, 8, 0]} intensity={3} color="#ff0000" distance={20} />
      )}
    </>
  );
}

// --- UI Components ---
const StatCard = ({ icon: Icon, label, value, colorClass }: { icon: React.ElementType, label: string, value: string|number, colorClass: string }) => (
    <div className={"flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 " + colorClass}>
      <div className="p-2 bg-white/10 rounded-lg"><Icon size={20} /></div>
      <div>
        <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
        <div className="font-mono font-bold text-lg">{value}</div>
      </div>
    </div>
  );

const UpgradeBtn = ({ title, desc, cost, onClick, icon: Icon, disabled, active }: { title: string, desc: string, cost: number, onClick: () => void, icon: React.ElementType, disabled: boolean, active?: boolean }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={"w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all " + (
        disabled 
          ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed' 
          : active 
            ? 'bg-fuchsia-600/20 border-fuchsia-500/50 hover:bg-fuchsia-600/30'
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      )}
    >
      <div className={"p-3 rounded-xl " + (disabled ? 'bg-white/5' : 'bg-gradient-to-br from-amber-400 to-orange-500 text-black')}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <div className="font-bold">{title}</div>
        <div className="text-xs opacity-60">{desc}</div>
      </div>
      <div className="font-mono font-bold text-amber-400">{"$" + cost}</div>
    </button>
  );

// ==================== MAIN COMPONENT ====================
export default function DonutTycoon() {
  // --- Game State ---
  const [money, setMoney] = useState(1500);
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => { const interval = setInterval(() => setCurrentTime(Date.now()), 1000); return () => clearInterval(interval); }, []);
  const [totalEarned, setTotalEarned] = useState(1500);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  
  // --- Rebirth System ---
  const [prestigePoints, setPrestigePoints] = useState(0);
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  // Prestige multiplier (1 + prestigePoints * 0.5)
  const prestigeMultiplier = 1 + (prestigePoints * 0.5);

  // --- Audio System (Placeholder) ---
  const [audioEnabled, setAudioEnabled] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
      // Setup placeholder Audio elements
      bgmRef.current = new Audio('/sounds/bgm.mp3');
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.3;
  }, []);
  const toggleAudio = () => {
      if (audioEnabled) { bgmRef.current?.pause(); setAudioEnabled(false); } 
      else { bgmRef.current?.play().catch(()=>console.log("Audio not found")); setAudioEnabled(true); }
  };
  const playSfx = useCallback((type: 'coin' | 'level' | 'fever') => {
      if (!audioEnabled) return;
      // In a real app, load actual mp3s. Here we just simulate logging or use a base64 tiny beep
      // For now, we will rely on visual feedback mostly, audio hooks are ready.
  }, [audioEnabled]);

  // --- Entities ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showStaffDrawer, setShowStaffDrawer] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // --- Upgrades / Stats ---
  const [serveRange] = useState(5.0);
  const [baseDonutPrice, setBaseDonutPrice] = useState(45);
  const [spawnInterval, setSpawnInterval] = useState(2500);
  const [playerSpeed, setPlayerSpeed] = useState(1.8);
  const [maxCustomers, setMaxCustomers] = useState(6);
  const [hasVipLounge, setHasVipLounge] = useState(false);
  const [hasDriveThru, setHasDriveThru] = useState(false);
  
  // --- Special Abilities ---
  const [feverMeter, setFeverMeter] = useState(0);
  const [isFever, setIsFever] = useState(false);
  const FEVER_MAX = 100;

  // --- Refs for loops ---
  const nextSpawnRef = useRef(0);
  useEffect(() => { nextSpawnRef.current = Date.now() + 1000; }, []);
  const idCounterRef = useRef(1000);
  const lastUpdateRef = useRef(0);
  useEffect(() => { lastUpdateRef.current = Date.now(); }, []);

  // --- Upgrade Costs ---
  const costs = {
    quality: Math.floor(baseDonutPrice * 8),
    speed: Math.floor(playerSpeed * 150),
    marketing: Math.floor(20000 / spawnInterval),
    capacity: Math.floor(maxCustomers * 120),
    employee: (employees.length + 1) * 800,
    empUpgrade: (level: number) => level * 500,
    vipLounge: 25000,
    driveThru: 50000
  };

  const spawnCustomer = useCallback(() => {
    setCustomers(prev => {
      if (prev.length >= maxCustomers) return prev;
      return [...prev, {
        id: idCounterRef.current++,
        position: new THREE.Vector3((Math.random() - 0.5) * 20, 0, 10), // Spawn at bottom
        target: (() => {
          const r = Math.random();
          if (hasVipLounge && r > 0.8) return new THREE.Vector3(12 + (Math.random() - 0.5)*6, 0, -4 + (Math.random() - 0.5)*4); // VIP
          if (hasDriveThru && r > 0.6 && r <= 0.8) return new THREE.Vector3(-12, 0, -5 + (Math.random() - 0.5)*2); // Drive Thru
          return new THREE.Vector3((Math.random() - 0.5) * 16, 0, (Math.random() - 0.5) * 6 - 2); // Normal
        })(),
        state: 'walking',
        speed: 1.5 + Math.random() * 1.0,
        waitTime: 0,
        moodTimer: Date.now()
      }];
    });
  }, [maxCustomers, hasVipLounge, hasDriveThru]);

  const handleServe = useCallback((id: number, pos: THREE.Vector3) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id && c.state === 'waiting') {
        return { 
          ...c, 
          state: 'leaving', 
          target: new THREE.Vector3((Math.random() - 0.5) * 20, 0, 12) // Target outside
        };
      }
      return c;
    }));

    const multiplier = isFever ? 3 : 1;
    // Check mood of customer based on how long they waited
    let moodMultiplier = 1;
    const servedCustomer = customers.find(c => c.id === id);
    if (servedCustomer && servedCustomer.moodTimer) {
        const waited = Date.now() - servedCustomer.moodTimer;
        if (waited < 10000) moodMultiplier = 1.5; // Happy tip
        else if (waited > 20000) moodMultiplier = 0.5; // Bad tip
    }
    const earned = Math.floor(baseDonutPrice * multiplier * moodMultiplier * prestigeMultiplier);
    playSfx('coin');
    
    setMoney(m => m + earned);
    setTotalEarned(t => t + earned);
    setXp(x => {
      const newXp = x + 10 * multiplier;
      if (newXp >= level * 100) {
        setLevel(l => l + 1);
        setFloatingTexts(prev => [...prev, { id: Date.now() + 1, position: new THREE.Vector3(0, 5, 0), text: "LEVEL UP!", life: 80, color: "text-yellow-300" }]);
        return newXp - level * 100;
      }
      return newXp;
    });

    if (!isFever) {
      setFeverMeter(f => Math.min(f + 5, FEVER_MAX));
    }

    setFloatingTexts(prev => [...prev, { 
      id: Date.now(), 
      position: pos.clone(), 
      text: "+$" + earned, 
      life: 50,
      color: isFever ? "text-fuchsia-400" : "text-emerald-400" 
    }]);

  }, [baseDonutPrice, isFever, level, customers, prestigeMultiplier, playSfx]);

  const buyUpgrade = (type: string) => {
    switch (type) {
      case 'quality':
        if (money >= costs.quality) { setMoney(m => m - costs.quality); setBaseDonutPrice(p => Math.floor(p * 1.4)); }
        break;
      case 'speed':
        if (money >= costs.speed) { setMoney(m => m - costs.speed); setPlayerSpeed(s => s + 0.5); }
        break;
      case 'marketing':
        if (money >= costs.marketing) { setMoney(m => m - costs.marketing); setSpawnInterval(s => Math.max(800, s - 300)); }
        break;
      case 'capacity':
        if (money >= costs.capacity) { setMoney(m => m - costs.capacity); setMaxCustomers(c => c + 2); }
        break;
      case 'vipLounge':
        if (money >= costs.vipLounge && !hasVipLounge) { setMoney(m => m - costs.vipLounge); setHasVipLounge(true); }
        break;
      case 'driveThru':
        if (money >= costs.driveThru && !hasDriveThru) { setMoney(m => m - costs.driveThru); setHasDriveThru(true); }
        break;
      case 'employee_cashier':
      case 'employee_waiter':
      case 'employee_baker':
        if (money >= costs.employee) {
          setMoney(m => m - costs.employee);
          const role = type.split('_')[1] as 'cashier' | 'waiter' | 'baker';
          setEmployees(prev => [...prev, {
            id: idCounterRef.current++,
            type: role,
            level: 1,
            position: new THREE.Vector3(role === 'baker' ? -5 : 0, 0, role === 'waiter' ? 2 : -6), 
            target: new THREE.Vector3(role === 'baker' ? -5 : 0, 0, role === 'waiter' ? 2 : -6),
            state: role === 'baker' ? 'working' : 'idle'
          }]);
        }
        break;
    }
  };


  const upgradeEmployee = (id: number) => {
    setEmployees(prev => {
      const emp = prev.find(e => e.id === id);
      if (emp && money >= costs.empUpgrade(emp.level)) {
        setMoney(m => m - costs.empUpgrade(emp.level));
        return prev.map(e => e.id === id ? { ...e, level: e.level + 1 } : e);
      }
      return prev;
    });
  };


  const performPrestige = () => {
      const pointsToEarn = Math.floor(totalEarned / 50000);
      if (pointsToEarn > 0) {
          setPrestigePoints(prev => prev + pointsToEarn);
          setMoney(1500);
          setTotalEarned(1500);
          setLevel(1);
          setXp(0);
          setCustomers([]);
          setEmployees([]);
          setBaseDonutPrice(45);
          setSpawnInterval(2500);
          setPlayerSpeed(1.8);
          setMaxCustomers(6);
          setFeverMeter(0);
          setIsFever(false);
          setShowPrestigeModal(false);
          setFloatingTexts([{ id: Date.now(), position: new THREE.Vector3(0,5,0), text: "FRANCHISE REBORN!", life: 100, color: "text-amber-300" }]);
          playSfx('level');
      }
  };

  const triggerFever = () => {
    if (feverMeter >= FEVER_MAX && !isFever) {
      setIsFever(true); playSfx('fever');
      setFeverMeter(0);
      setTimeout(() => setIsFever(false), 10000); // 10 seconds of fever
    }
  };

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      // Spawning
      if (now > nextSpawnRef.current) {
        spawnCustomer();
        nextSpawnRef.current = now + spawnInterval;
      }

      // Update Customers
      setCustomers(prev => {
        // let activeCount = 0;
        const updated = prev.map(c => {
          // if (c.state !== 'leaving') activeCount++;
          
          if (c.state === 'leaving') {
            if (c.position.z > 11) return null; // Remove customer
          }

          const dist = c.position.distanceTo(c.target);
          
          // Using a looser distance check to prevent them from getting stuck spinning around target
          if (c.state === 'walking' && dist < 1.0) {
            return { ...c, state: 'waiting', waitTime: now + 5000 + Math.random() * 5000, moodTimer: now };
          }
          
          if (c.state === 'waiting' && c.moodTimer) {
            const waited = now - c.moodTimer;
            if (waited > 25000) { // Waited too long, leave angry
                 // Penalty
                 setMoney(m => Math.max(0, m - Math.floor(baseDonutPrice * 0.5)));
                 setFloatingTexts(prevFt => [...prevFt, { id: Date.now() + Math.random(), position: c.position.clone().add(new THREE.Vector3(0,3,0)), text: "TOO SLOW!", life: 50, color: "text-red-500" }]);
                 return { ...c, state: 'angry', target: new THREE.Vector3((Math.random() - 0.5) * 20, 0, 12) };
            }
          }

          if (c.state === 'walking' || c.state === 'leaving' || c.state === 'angry') {
            const dir = c.target.clone().sub(c.position).normalize();
            // Move towards target
            const newPos = c.position.clone().add(dir.multiplyScalar(c.speed * delta * 2));
            
            // Calculate rotation towards target
            const angle = Math.atan2(dir.x, dir.z);
            
            return { ...c, position: newPos, rotationY: angle };
          }
          return c;
        }).filter(Boolean) as Customer[];
        
        return updated;
      });

      // Update Employees (Complex AI)
      setEmployees(prev => prev.map(emp => {
        let newState = emp.state;
        let newTarget = emp.target;
        let newPos = emp.position;
        const empSpeed = (isFever ? 6 : 3) + (emp.level * 0.5);

        if (emp.type === 'baker') {
            // Bakers stay in back and generate money periodically
            if (emp.state !== 'working') newState = 'working';
            if (Math.random() < 0.01) {
                // Generate passive income based on level
                const passive = Math.floor(baseDonutPrice * 0.5 * emp.level * prestigeMultiplier);
                setMoney(m => m + passive);
                setTotalEarned(t => t + passive);
                setFloatingTexts(prevFt => [...prevFt, { id: Date.now() + Math.random(), position: emp.position.clone().add(new THREE.Vector3(0,2,0)), text: "+$" + passive, life: 30, color: "text-amber-300" }]);
            }
            // Wander slightly in the kitchen
            if (Math.random() < 0.05 && emp.position.distanceTo(emp.target) < 0.5) {
                newTarget = new THREE.Vector3(-8 + Math.random() * 6, 0, -10 + Math.random() * 2);
            }
            const dir = newTarget.clone().sub(emp.position).normalize();
            if (emp.position.distanceTo(newTarget) > 0.1) {
                newPos = emp.position.clone().add(dir.multiplyScalar((empSpeed/2) * delta));
            }
            const angle = newTarget.clone().sub(emp.position).lengthSq() > 0.01 ? Math.atan2(newTarget.x - emp.position.x, newTarget.z - emp.position.z) : (emp.rotationY || 0);
        return { ...emp, state: newState, target: newTarget, position: newPos, rotationY: angle };
        }

        if (emp.state === 'idle') {
          // Cashiers look for waiters near counter, Waiters look for anyone
          setCustomers(currCust => {
            const waiting = currCust.find(c => c.state === 'waiting' && 
                (emp.type === 'waiter' || (emp.type === 'cashier' && c.position.z < -2)) // Cashier only serves near counter
            );
            if (waiting) {
              newState = 'walking_to_customer';
              newTarget = waiting.position.clone();
              emp.targetCustomerId = waiting.id;
            } else {
               // Wander a bit
               if (Math.random() < 0.02) {
                 if (emp.type === 'cashier') {
                     newTarget = new THREE.Vector3((Math.random() - 0.5) * 10, 0, -6 + (Math.random() * 2));
                 } else {
                     newTarget = new THREE.Vector3((Math.random() - 0.5) * 16, 0, 2 + (Math.random() * 6));
                 }
               }
            }
            return currCust;
          });
        } else if (emp.state === 'walking_to_customer') {
          const dist = emp.position.distanceTo(emp.target);
          if (dist < (1.5 + emp.level * 0.2)) { // Higher level = better reach
            // Serve
            if (emp.targetCustomerId) {
               newState = 'idle';
            }
          } else {
             const dir = emp.target.clone().sub(emp.position).normalize();
             newPos = emp.position.clone().add(dir.multiplyScalar(empSpeed * delta));
          }
        }

        // Employee auto-serve logic
        setCustomers(currCust => {
            currCust.forEach(c => {
                if(c.state === 'waiting' && emp.position.distanceTo(c.position) < (2.0 + emp.level * 0.3)) {
                    setTimeout(() => handleServe(c.id, c.position.clone()), 0);
                    newState = 'idle';
                }
            });
            return currCust;
        });

        const angle = newTarget.clone().sub(emp.position).lengthSq() > 0.01 ? Math.atan2(newTarget.x - emp.position.x, newTarget.z - emp.position.z) : (emp.rotationY || 0);
        return { ...emp, state: newState, target: newTarget, position: newPos, rotationY: angle };
      }));

      // Cleanup Floating Texts
      setFloatingTexts(prev => prev.map(t => ({ ...t, life: t.life - 1 })).filter(t => t.life > 0));

    }, 1000 / 30); // 30fps logic loop

    return () => clearInterval(interval);
  }, [spawnInterval, handleServe, isFever, spawnCustomer, baseDonutPrice, currentTime, prestigeMultiplier]);

  // Initial load
  useEffect(() => {
    // Pre-load a human.glb if needed
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-amber-500/30">
      
      {/* --- TOP BAR --- */}
      <div className="fixed top-0 left-0 right-0 z-10 p-6 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex justify-between items-start pointer-events-auto">
          
          {/* Logo & Level */}
          <div className="flex gap-6 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex items-center gap-4">
                <div className="text-5xl drop-shadow-lg filter hover:brightness-125 transition-all cursor-pointer">🍩</div>
                <div>
                  <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-amber-300 to-orange-500 bg-clip-text text-transparent">
                    DONUT TYCOON
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">LVL {level}</span>
                    <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: (xp / (level * 100)) * 100 + "%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fever Meter */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl w-48 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-fuchsia-400 flex items-center gap-1"><Zap size={12}/> SUGAR RUSH</span>
                <span>{feverMeter}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-fuchsia-600 to-pink-500 transition-all duration-300" style={{ width: feverMeter + "%" }}></div>
              </div>
              {feverMeter >= FEVER_MAX && (
                <button onClick={triggerFever} className="w-full py-1 text-[10px] font-black bg-fuchsia-500 text-black rounded-lg animate-pulse">
                  ACTIVATE!
                </button>
              )}
            </div>
          </div>

          {/* Stats Right */}
          <div className="flex gap-3">
            <button onClick={() => setShowPrestigeModal(true)} className="bg-amber-900/50 hover:bg-amber-800/80 border border-amber-500/50 text-amber-300 px-4 py-2 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
                FRANCHISE ({prestigePoints} PT)
            </button>
            <button onClick={toggleAudio} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-2 rounded-xl text-xs font-black transition-all">
                {audioEnabled ? "🔈 ON" : "🔇 OFF"}
            </button>
            <StatCard icon={Coins} label="Funds" value={"$" + money} colorClass="text-emerald-400 border-emerald-500/30" />
            <StatCard icon={TrendingUp} label="Total Earned" value={"$" + totalEarned} colorClass="text-amber-400" />
            <StatCard icon={Users} label="Staff" value={employees.length} colorClass="text-blue-400" />
          </div>
        </div>
      </div>

      {/* --- 3D CANVAS --- */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 10, 15], fov: 45 }} gl={{ antialias: true }}>
          <Scene 
            customers={customers} 
            employees={employees}
            floatingTexts={floatingTexts} 
            serveRange={serveRange} 
            onServe={handleServe} 
            isFever={isFever}
            playerSpeed={playerSpeed}
            currentTime={currentTime}
            hasVipLounge={hasVipLounge}
            hasDriveThru={hasDriveThru}
          />
        </Canvas>
      </div>

      
      {/* --- PRESTIGE MODAL --- */}
      <AnimatePresence>
        {showPrestigeModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto"
          >
            <div className="bg-gradient-to-br from-amber-900 to-black border-2 border-amber-500/50 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                <div className="text-6xl mb-4">🌟</div>
                <h2 className="text-3xl font-black text-amber-400 mb-2">OPEN NEW FRANCHISE</h2>
                <p className="text-white/70 text-sm mb-6">Reset your entire progress to open a new, more profitable franchise. You will lose all money, staff, and upgrades.</p>
                
                <div className="bg-black/50 rounded-xl p-4 mb-6 border border-white/10">
                    <div className="text-xs text-white/50 mb-1">Potential Franchise Points from current earnings:</div>
                    <div className="text-4xl font-mono font-black text-amber-300">+{Math.floor(totalEarned / 50000)}</div>
                    <div className="text-xs text-amber-500/60 mt-1">(1 Point = +50% Global Profit Multiplier)</div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setShowPrestigeModal(false)} className="flex-1 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 transition-colors">CANCEL</button>
                    <button onClick={performPrestige} disabled={Math.floor(totalEarned / 50000) <= 0} className="flex-1 py-3 rounded-xl font-black bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:bg-gray-600 disabled:text-gray-400 transition-colors">
                        REBIRTH
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FEVER OVERLAY --- */}
      <AnimatePresence>
        {isFever && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-0 border-[8px] border-fuchsia-500/50 shadow-[inset_0_0_100px_rgba(217,70,239,0.5)]"
          >
            <div className="absolute top-32 left-1/2 -translate-x-1/2 text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-fuchsia-500 animate-pulse drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] italic tracking-widest">
              SUGAR RUSH!!!
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xl font-bold text-fuchsia-300 bg-black/50 px-6 py-2 rounded-full backdrop-blur">
              3X EARNINGS & SPEED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- UI OVERLAYS (Bottom / Sides) --- */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end pointer-events-auto">
          
          {/* Controls Hint */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-4 text-sm text-white/50">
            <div className="flex gap-1">
              {['W','A','S','D'].map(k => <kbd key={k} className="bg-white/10 px-2 py-1 rounded font-mono font-bold text-white/80">{k}</kbd>)}
            </div>
            <span>to move</span>
            <span className="w-px h-4 bg-white/20"></span>
            <span>Walk near customers to serve</span>
          </div>

          
          {/* Staff Drawer */}
          {showStaffDrawer && (
            <div className="absolute right-0 bottom-full mb-4 bg-black/80 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl w-[350px] shadow-2xl z-20 pointer-events-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-lg">STAFF MANAGEMENT</h3>
                    <button onClick={() => setShowStaffDrawer(false)} className="text-white/50 hover:text-white">✕</button>
                </div>
                <div className="flex flex-col gap-2 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {employees.map(emp => (
                        <div key={emp.id} className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
                            <div>
                                <div className="font-bold capitalize">{emp.type} <span className="text-xs text-amber-400">Lv.{emp.level}</span></div>
                                <div className="text-[10px] opacity-60">Status: {emp.state.replace('_', ' ')}</div>
                            </div>
                            <button 
                                onClick={() => upgradeEmployee(emp.id)}
                                disabled={money < costs.empUpgrade(emp.level)}
                                className={"text-xs px-3 py-1.5 rounded-lg font-bold " + (money >= costs.empUpgrade(emp.level) ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-white/10 text-white/30")}
                            >
                                Upgrade (${costs.empUpgrade(emp.level)})
                            </button>
                        </div>
                    ))}
                    {employees.length === 0 && <div className="text-sm opacity-50 text-center py-4">No staff hired yet.</div>}
                </div>
                <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                    <UpgradeBtn icon={Users} title="Hire Cashier" desc="Serves near counter" cost={costs.employee} onClick={() => buyUpgrade('employee_cashier')} disabled={money < costs.employee} />
                    <UpgradeBtn icon={Users} title="Hire Waiter" desc="Serves tables" cost={costs.employee} onClick={() => buyUpgrade('employee_waiter')} disabled={money < costs.employee} />
                    <UpgradeBtn icon={Users} title="Hire Baker" desc="Generates passive income" cost={costs.employee} onClick={() => buyUpgrade('employee_baker')} disabled={money < costs.employee} />
                </div>
            </div>
          )}


          {/* Upgrades Panel */}
          <div className="bg-black/70 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl w-[400px] flex flex-col gap-3 shadow-2xl max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-2 px-2">
              <Briefcase className="text-amber-400" />
              <h2 className="text-xl font-black tracking-tight">MANAGEMENT</h2>
            </div>

            <UpgradeBtn 
              icon={Star} title="Premium Ingredients" desc={"Increase donut base price to $" + Math.floor(baseDonutPrice * 1.4)} 
              cost={costs.quality} onClick={() => buyUpgrade('quality')} disabled={money < costs.quality} 
            />
            <UpgradeBtn 
              icon={Zap} title="Roller Skates" desc="Move faster around the shop" 
              cost={costs.speed} onClick={() => buyUpgrade('speed')} disabled={money < costs.speed} 
            />
            <button onClick={() => setShowStaffDrawer(!showStaffDrawer)} className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Users size={20} /></div>
                  <div className="font-bold text-left">Staff Management <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full ml-2">{employees.length}</span></div>
              </div>
              <div className="text-white/50 text-sm">Open &rarr;</div>
            </button>
            <UpgradeBtn 
              icon={ArrowUpCircle} title="Marketing Campaign" desc="Customers arrive faster" 
              cost={costs.marketing} onClick={() => buyUpgrade('marketing')} disabled={money < costs.marketing} 
            />
            <UpgradeBtn 
              icon={Shield} title="Expand Shop" desc="Allow more customers inside at once" 
              cost={costs.capacity} onClick={() => buyUpgrade('capacity')} disabled={money < costs.capacity} 
            />

            <UpgradeBtn 
              icon={Star} title="VIP Lounge" desc="Exclusive seating area for high rollers" 
              cost={costs.vipLounge} onClick={() => buyUpgrade('vipLounge')} disabled={money < costs.vipLounge || hasVipLounge} active={hasVipLounge}
            />
            <UpgradeBtn 
              icon={Zap} title="Drive-Thru Window" desc="Serve customers on the go" 
              cost={costs.driveThru} onClick={() => buyUpgrade('driveThru')} disabled={money < costs.driveThru || hasDriveThru} active={hasDriveThru}
            />

          </div>

        </div>
      </div>

    </div>
  );
}
