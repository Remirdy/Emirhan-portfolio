'use client'

import { useState, useEffect } from 'react';

export default function CampusChaosCaseStudy() {
  const [cash, setCash] = useState(420);
  const [chaos, setChaos] = useState(65);
  const [buildings, setBuildings] = useState([
    {id:1, name:'Lecture Hall', count:1, cost:150, prod:12},
    {id:2, name:'Dormitory', count:2, cost:280, prod:25},
    {id:3, name:'Café', count:1, cost:420, prod:18},
    {id:4, name:'Library', count:0, cost:650, prod:35},
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCash(c => c + 18);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const buy = (id) => {
    setBuildings(b => b.map(item => {
      if (item.id === id && cash >= item.cost) {
        setCash(c => c - item.cost);
        return {...item, count: item.count + 1, cost: Math.round(item.cost * 1.4)};
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 tracking-tighter">CAMPUS CHAOS</h1>
        
        <div className="flex justify-between mb-8 text-xl">
          <div>💰 <span className="font-mono">${cash}</span></div>
          <div>🔥 Chaos: <span className="font-mono">{chaos}</span></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {buildings.map(b => (
            <div key={b.id} className="bg-zinc-900 p-6 rounded-3xl">
              <h3 className="font-semibold mb-2">{b.name}</h3>
              <p className="text-4xl font-bold text-emerald-400 mb-6">{b.count}</p>
              <button onClick={() => buy(b.id)} disabled={cash < b.cost} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold disabled:opacity-50">
                ${b.cost} BUY
              </button>
              <p className="text-xs text-zinc-400 mt-3">+{b.prod} per second</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-zinc-500">Idle Tycoon • Real-time progression • Save will be added soon</p>
      </div>
    </div>
  );
}
