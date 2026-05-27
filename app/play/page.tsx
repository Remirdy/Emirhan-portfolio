export default function PlayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 to-orange-950 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 text-amber-100">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🍩</span>
            <h1 className="text-5xl font-bold tracking-tighter">DONUT PLACE</h1>
          </div>
          <div className="flex gap-8 text-xl">
            <div>
              💰 <span id="money" className="font-mono">$0</span>
            </div>
            <div>
              ⭐ <span id="score" className="font-mono">0</span>
            </div>
          </div>
        </div>

        <div className="relative bg-amber-900 border-8 border-amber-800 rounded-3xl shadow-2xl overflow-hidden" style={{height: '560px'}}>
          <canvas id="game" width="1000" height="560" className="block bg-[#f5d8b0]"></canvas>
        </div>

        {/* Controls info */}
        <div className="mt-4 text-center text-amber-200 text-sm flex justify-center gap-6">
          <div>👇 WASD veya Ok tuşları ile hareket et</div>
          <div>🧑‍🍳 Müşterilere yaklaşınca otomatik servis!</div>
        </div>

        {/* Upgrades */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <button onclick="upgradeSpeed()" className="bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-2xl text-left px-6">
            <div className="font-bold">⚡ Hızlı Fırın</div>
            <div className="text-sm opacity-75">Müşteriler daha hızlı servis alır</div>
            <div className="text-xl font-mono mt-2">$150</div>
          </button>
          <button onclick="upgradeSpawn()" className="bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-2xl text-left px-6">
            <div className="font-bold">👥 Daha Fazla Müşteri</div>
            <div className="text-sm opacity-75">Daha çok müşteri gelir</div>
            <div className="text-xl font-mono mt-2">$250</div>
          </button>
          <button onclick="upgradeMultiplier()" className="bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-2xl text-left px-6">
            <div className="font-bold">🔥 Combo Bonus</div>
            <div className="text-sm opacity-75">Çok hızlı servis = x2 para</div>
            <div className="text-xl font-mono mt-2">$400</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Note: Tam canvas oyunu için script kısmı eklenecek (aşağıda).