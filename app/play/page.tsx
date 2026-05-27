'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function PlayPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [money, setMoney] = useState(500);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  // Game parameters (mutable via refs for performance)
  const gameParams = useRef({
    playerSpeed: 5,
    spawnInterval: 1200, // ms
    moneyMultiplier: 1,
    serveRange: 55,
    customerSpeed: 1.8,
    nextSpawnTime: 0,
  });

  const moneyRef = useRef(500);
  const scoreRef = useRef(0);

  // Game objects
  const playerRef = useRef({ x: 450, y: 320, size: 28 });
  const customersRef = useRef<any[]>([]);
  const floatingTextsRef = useRef<any[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Update displayed money/score from refs (throttled)
  const syncUI = useCallback(() => {
    setMoney(Math.floor(moneyRef.current));
    setScore(Math.floor(scoreRef.current));
  }, []);

  // Spawn a new customer
  const spawnCustomer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = 120 + Math.random() * (canvas.width - 240);
    customersRef.current.push({
      x,
      y: 80,
      size: 22,
      speed: gameParams.current.customerSpeed + (Math.random() - 0.5) * 0.4,
      served: false,
    });
  }, []);

  // Main game update logic
  const updateGame = useCallback((delta: number) => {
    const player = playerRef.current;
    const customers = customersRef.current;
    const params = gameParams.current;
    const keys = keysRef.current;

    // Player movement
    let moved = false;
    if (keys['w'] || keys['ArrowUp']) { player.y -= params.playerSpeed; moved = true; }
    if (keys['s'] || keys['ArrowDown']) { player.y += params.playerSpeed; moved = true; }
    if (keys['a'] || keys['ArrowLeft']) { player.x -= params.playerSpeed; moved = true; }
    if (keys['d'] || keys['ArrowRight']) { player.x += params.playerSpeed; moved = true; }

    // Clamp player to bounds (play area)
    const margin = 40;
    player.x = Math.max(margin, Math.min(960 - margin, player.x));
    player.y = Math.max(140, Math.min(520, player.y));

    // Update customers
    for (let i = customers.length - 1; i >= 0; i--) {
      const c = customers[i];
      if (c.served) {
        customers.splice(i, 1);
        continue;
      }

      // Move towards counter (bottom area)
      const targetY = 420;
      if (c.y < targetY) {
        c.y += c.speed;
      }

      // Check if player can serve this customer
      const dx = player.x - c.x;
      const dy = player.y - c.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < params.serveRange && c.y > 280) {
        // SERVE!
        const earn = Math.floor(25 * params.moneyMultiplier);
        moneyRef.current += earn;
        scoreRef.current += earn * 2;

        // Floating text
        floatingTextsRef.current.push({
          x: c.x,
          y: c.y - 10,
          text: `+${earn}$`,
          life: 45,
          vy: -1.2,
        });

        c.served = true;

        // Occasional level up
        if (scoreRef.current > level * 800) {
          setLevel(l => l + 1);
          params.playerSpeed += 0.4;
          params.customerSpeed += 0.15;
        }
      }

      // Remove if went past counter without service
      if (c.y > 520) {
        customers.splice(i, 1);
      }
    }

    // Spawn new customers
    const now = Date.now();
    if (now > params.nextSpawnTime) {
      spawnCustomer();
      params.nextSpawnTime = now + params.spawnInterval;
    }

    // Update floating texts
    for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
      const t = floatingTextsRef.current[i];
      t.y += t.vy;
      t.life--;
      if (t.life <= 0) floatingTextsRef.current.splice(i, 1);
    }

    // Occasional UI sync
    if (moved || Math.random() < 0.08) {
      syncUI();
    }
  }, [level, spawnCustomer, syncUI]);

  // Draw everything on canvas
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const player = playerRef.current;
    const customers = customersRef.current;
    const texts = floatingTextsRef.current;

    // Background - warm donut shop floor
    ctx.fillStyle = '#f5d8b0';
    ctx.fillRect(0, 0, w, h);

    // Subtle floor pattern
    ctx.strokeStyle = '#e8c48a';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Counter (bottom area)
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(60, 400, w - 120, 140);
    ctx.fillStyle = '#6b4420';
    ctx.fillRect(60, 400, w - 120, 12);

    // Counter highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(60, 400, w - 120, 6);

    // Player (Donut Chef)
    ctx.save();
    ctx.translate(player.x, player.y);
    // Body
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, player.size, 0, Math.PI * 2);
    ctx.fill();
    // Chef hat
    ctx.fillStyle = '#fff';
    ctx.fillRect(-player.size + 4, -player.size - 8, player.size * 2 - 8, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-player.size + 8, -player.size - 14, player.size * 2 - 16, 8);
    // Face / emoji overlay
    ctx.fillStyle = '#111';
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👨‍🍳', 0, 4);
    ctx.restore();

    // Customers
    customers.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(0, 0, c.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#166534';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧑‍🍳', 0, 3);
      ctx.restore();
    });

    // Floating +money texts
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    texts.forEach(t => {
      const alpha = Math.max(0.2, t.life / 45);
      ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
      ctx.fillText(t.text, t.x, t.y);
    });

    // Subtle serve zone indicator near counter
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(player.x, player.y, gameParams.current.serveRange, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  // Main game loop
  const gameLoop = useCallback((timestamp: number) => {
    const ctx = canvasRef.current?.getContext('2d', { alpha: true });
    if (!ctx) return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    updateGame(delta);
    draw(ctx);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Initialize canvas and start game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial size (matches the visual container)
    canvas.width = 1000;
    canvas.height = 560;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) {
      // Initial draw
      draw(ctx);
    }

    // Seed a few starting customers
    customersRef.current = [
      { x: 220, y: 140, size: 22, speed: 1.6, served: false },
      { x: 480, y: 110, size: 22, speed: 1.9, served: false },
      { x: 720, y: 155, size: 22, speed: 1.5, served: false },
    ];

    // Start the loop
    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Initial money sync
    moneyRef.current = money;
    scoreRef.current = score;

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [draw, gameLoop, money, score]);

  // Upgrade handlers
  const buyUpgrade = (type: 'speed' | 'spawn' | 'multi') => {
    const params = gameParams.current;
    let cost = 0;

    if (type === 'speed') {
      cost = 150;
      if (moneyRef.current >= cost) {
        moneyRef.current -= cost;
        params.playerSpeed = Math.min(params.playerSpeed + 1.2, 12);
        params.serveRange = Math.min(params.serveRange + 6, 90);
      }
    } else if (type === 'spawn') {
      cost = 250;
      if (moneyRef.current >= cost) {
        moneyRef.current -= cost;
        params.spawnInterval = Math.max(params.spawnInterval - 280, 420);
        params.customerSpeed = Math.min(params.customerSpeed + 0.35, 4);
      }
    } else if (type === 'multi') {
      cost = 400;
      if (moneyRef.current >= cost) {
        moneyRef.current -= cost;
        params.moneyMultiplier = Math.min(params.moneyMultiplier + 0.6, 4.5);
      }
    }

    if (cost > 0 && moneyRef.current >= 0) {
      syncUI();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 to-orange-950 flex flex-col items-center justify-center p-4 text-amber-100">
      <div className="w-full max-w-[1100px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-3">
            <span className="text-6xl drop-shadow">🍩</span>
            <h1 className="text-5xl font-bold tracking-[-2px] text-amber-300">DONUT PLACE</h1>
          </div>
          <div className="flex items-center gap-8 text-2xl">
            <div className="flex items-center gap-2 bg-black/30 px-5 py-1.5 rounded-2xl border border-amber-800/60">
              <span>💰</span>
              <span className="font-mono tabular-nums tracking-wider">{money}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-5 py-1.5 rounded-2xl border border-amber-800/60">
              <span>⭐</span>
              <span className="font-mono tabular-nums tracking-wider">{score}</span>
            </div>
            <div className="px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-lg font-medium">
              Lv. {level}
            </div>
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative mx-auto border-[14px] border-[#3a2a1f] rounded-[28px] shadow-2xl overflow-hidden bg-[#3a2a1f]" style={{ width: '1000px', height: '560px' }}>
          <canvas
            ref={canvasRef}
            className="block"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Instructions */}
        <div className="flex justify-center gap-8 mt-5 text-sm text-amber-300/90">
          <div className="flex items-center gap-2">
            <span className="text-lg">👇</span>
            <span>WASD veya Ok tuşları ile hareket et</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🧑‍🍳</span>
            <span>Müşterilere yaklaşınca otomatik servis!</span>
          </div>
        </div>

        {/* Upgrade Shop */}
        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1000px] mx-auto">
          <button
            onClick={() => buyUpgrade('speed')}
            className="group flex flex-col items-start bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.985] transition-all text-white rounded-3xl px-6 py-5 text-left shadow-lg border border-amber-900/40"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <div>
                <div className="font-bold text-xl tracking-tight">Hızlı Fırın</div>
                <div className="text-amber-200 text-sm">Müşteriler daha hızlı servis alır</div>
              </div>
            </div>
            <div className="mt-auto pt-3 text-3xl font-mono font-semibold tabular-nums tracking-tighter">$150</div>
          </button>

          <button
            onClick={() => buyUpgrade('spawn')}
            className="group flex flex-col items-start bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 active:scale-[0.985] transition-all text-white rounded-3xl px-6 py-5 text-left shadow-lg border border-orange-900/40"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">👥</span>
              <div>
                <div className="font-bold text-xl tracking-tight">Daha Fazla Müşteri</div>
                <div className="text-orange-200 text-sm">Daha çok müşteri gelir</div>
              </div>
            </div>
            <div className="mt-auto pt-3 text-3xl font-mono font-semibold tabular-nums tracking-tighter">$250</div>
          </button>

          <button
            onClick={() => buyUpgrade('multi')}
            className="group flex flex-col items-start bg-gradient-to-br from-red-600 to-orange-700 hover:from-red-500 hover:to-orange-600 active:scale-[0.985] transition-all text-white rounded-3xl px-6 py-5 text-left shadow-lg border border-red-900/40"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <div className="font-bold text-xl tracking-tight">Combo Bonus</div>
                <div className="text-red-200 text-sm">Çok hızlı servis = x2 para</div>
              </div>
            </div>
            <div className="mt-auto pt-3 text-3xl font-mono font-semibold tabular-nums tracking-tighter">$400</div>
          </button>
        </div>

        <p className="text-center text-[10px] text-amber-400/60 mt-6 tracking-[1px]">DONUT PLACE v1.0 — Her servis = 25$ • Combo ve upgrade'lerle para kazan!</p>
      </div>
    </div>
  );
}
