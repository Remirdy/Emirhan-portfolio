import Image from 'next/image';

export default function EcoQuest() {
  return (
    <div className="min-h-screen bg-[#06130D] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-full text-sm mb-6">
            🌱 EcoQuest
          </div>
          <h1 className="text-6xl font-bold tracking-tight mb-4">
            EcoQuest
          </h1>
          <p className="text-2xl text-green-300">Small actions. Big impact.</p>
          <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
            Gamified sustainability app that turns daily eco habits into XP, streaks, rewards and a thriving virtual eco-world.
          </p>
        </div>

        {/* Mockups gelecek buraya */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Buraya 10 tane mockup eklenecek */}
          <div className="bg-black/40 border border-white/10 rounded-3xl p-4">
            <p className="text-center text-green-400">Mockup 1 - Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
