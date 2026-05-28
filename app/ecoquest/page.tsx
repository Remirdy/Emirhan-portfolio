'use client'

import { motion } from 'framer-motion'
import { Leaf, Target, Users, Award, BarChart3, Smartphone, ArrowRight, ExternalLink } from 'lucide-react'

export default function EcoQuestPage() {
  const slides = [
    { num: '01', title: 'The Opportunity', desc: 'Why gamify sustainable habits? Living sustainably is important—but staying consistent is hard. EcoQuest turns everyday eco-actions into a game that inspires progress, rewards impact, and grows a better world together.' },
    { num: '02', title: 'Onboarding & Personal Setup', desc: 'A smooth, guided start to build meaningful, sustainable habits. Choose goals, pick your Eco-World (Forest Guardian, Ocean Keeper, Green Pioneer), set reminders & first daily goal.' },
    { num: '03', title: 'Home Dashboard', desc: 'Mission control: Eco Points, daily goal ring, streak, total XP, CO₂ saved, recent achievements, quick log/timer actions.' },
    { num: '04', title: 'Daily Missions & Challenges', desc: 'Bite-sized tasks (walk/bike, reusable bottle, recycle, plant-based, power shower). Weekly challenges & special events with XP + Eco Points.' },
    { num: '05', title: 'Habit Logging', desc: 'Quick Log, manual form with category/notes/optional photo, shower timer with countdown for frictionless check-ins.' },
    { num: '06', title: 'Rewards & Eco-World Growth', desc: 'Virtual floating island garden evolves with progress. Unlock plants, themes, animals, decor. Streaks, badges, multipliers.' },
    { num: '07', title: 'Leaderboard & Community', desc: 'Friends / Campus / Global leaderboards. Team challenges (e.g. Plastic-Free Week). Join groups, invite friends, track progress.' },
    { num: '08', title: 'Insights & Profile', desc: 'Weekly stats, CO₂ saved, missions, waste reduced, streak calendar, badges, joined challenges, personal milestones.' },
    { num: '09', title: 'Final MVP Showcase', desc: 'Polished, production-quality prototype. All core flows fully functional with local state & smooth animations.' },
    { num: '10', title: 'Tech Stack', desc: 'React Native + Expo + TypeScript + Zustand + AsyncStorage. Premium dark forest theme, glassmorphism, neon green accents.' }
  ]

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-20 pb-16">
      <section className="max-w-5xl mx-auto px-6 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-xs font-bold tracking-[0.2em] mb-6">
          <Leaf className="w-4 h-4" /> SUSTAINABILITY MEETS PLAY
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4">EcoQuest</h1>
        <p className="text-2xl text-emerald-300 font-semibold mb-6">Gamified Sustainability App</p>
        <p className="max-w-2xl mx-auto text-lg text-white/70 mb-8">Turn small green habits into daily progress. Complete missions, earn XP & Eco Points, grow your virtual eco-world.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#slides" className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-400 text-black font-bold hover:bg-emerald-300 transition">
            Explore the 10 Slides <ArrowRight className="w-4 h-4" />
          </a>
          <a href="https://github.com/Remirdy/Emirhan-portfolio/tree/main/ecoquest-demo" target="_blank" className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl border border-white/20 hover:bg-white/5 transition">
            View Demo Code <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Target, label: 'Daily Missions', value: 'Bite-sized' },
            { icon: Award, label: 'Rewards', value: 'XP + Points' },
            { icon: Users, label: 'Community', value: 'Leaderboards' },
            { icon: Leaf, label: 'Real Impact', value: 'CO₂ saved' }
          ].map((s, i) => (
            <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col items-center text-center">
              <s.icon className="w-8 h-8 text-emerald-400 mb-3" />
              <div className="font-bold text-xl">{s.value}</div>
              <div className="text-white/60 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="slides" className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="uppercase tracking-[0.3em] text-xs font-bold text-white/50">FULL 10-SLIDE CASE STUDY</div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/30 to-transparent" />
        </div>

        <div className="space-y-16">
          {slides.map((slide, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-10 items-center">
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <div className="text-emerald-400 text-sm font-mono mb-2">SLIDE {slide.num}</div>
                <h3 className="text-4xl font-black tracking-tight mb-4">{slide.title}</h3>
                <p className="text-lg text-white/80 leading-relaxed">{slide.desc}</p>
              </div>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 aspect-[16/10] flex items-center justify-center">
                <img 
                  src={`/ecoquest/ecoquest-slide-${String(index + 1).padStart(2, '0')}.png`} 
                  alt={slide.title}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    if (el.parentElement) {
                      el.parentElement.innerHTML = `<div class="text-center p-8"><div class="text-emerald-400/60 text-6xl mb-4">🌱</div><p class="text-white/60 text-sm">Upload your mockup here:<br/>public/ecoquest/ecoquest-slide-${String(index + 1).padStart(2, '0')}.png</p></div>`;
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-20 pt-16 border-t border-white/10">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold tracking-widest mb-3">PRODUCTION-QUALITY PROTOTYPE</div>
          <h2 className="text-4xl font-black tracking-tight">Built with modern tools.<br/>Ready to scale.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h4 className="font-bold text-xl mb-4 flex items-center gap-2"><Smartphone className="text-emerald-400" /> Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['React Native', 'Expo', 'TypeScript', 'Zustand', 'AsyncStorage', 'Expo Router'].map(t => (
                <span key={t} className="px-4 py-1.5 rounded-xl bg-white/5 text-sm border border-white/10">{t}</span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h4 className="font-bold text-xl mb-4 flex items-center gap-2"><BarChart3 className="text-emerald-400" /> Highlights</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• Local persistence (AsyncStorage) — no backend needed for MVP</li>
              <li>• Smooth micro-interactions & spring animations</li>
              <li>• Virtual garden that visually evolves with progress</li>
              <li>• Realistic impact tracking (CO₂, waste, water saved)</li>
              <li>• Timer-based habit confirmation + optional photo proof</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-white/60 text-sm max-w-md mx-auto">
          All core flows are fully functional. This is a polished, production-quality mobile app prototype ready for further development.
        </div>
      </div>
    </main>
  )
}
