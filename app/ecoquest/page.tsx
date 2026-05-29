'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, Cpu, Heart, CheckCircle2, ChevronRight } from 'lucide-react'
import PhoneSimulator from '@/components/arcade/PhoneSimulator'

export default function EcoQuestShowcase() {
  return (
    <main className="min-h-screen bg-[#030704] text-white pt-28 pb-20 relative overflow-hidden font-sans">
      {/* Decorative background radial gradients */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Back navigation */}
        <div className="mb-10">
          <Link 
            href="/#ecoquest" 
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold text-sm tracking-wide group transition"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BAŞLANGICA DÖN / BACK TO PORTFOLIO
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Product Info & Tech Specs */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-xs font-black tracking-[0.2em]">
                🌱 NATIVE ANDROID APPLICATON
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none">
                EcoQuest
              </h1>
              <p className="text-2xl text-emerald-300 font-semibold tracking-tight">
                Habit Tracking Gamified
              </p>
              <p className="text-base text-white/70 leading-relaxed max-w-xl">
                EcoQuest, sürdürülebilir yaşam alışkanlıklarını eğlenceli ve rekabetçi bir oyuna dönüştürür.
                Günlük görevlerinizi yapın, puan kazanın, seviye atlayın ve puanlarınızla yaşam alanınızı (bahçenizi) güzelleştirin!
              </p>
            </div>

            {/* Simulated app features tutorial cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                <div className="text-2xl mt-0.5 shrink-0">📱</div>
                <div>
                  <h4 className="font-bold text-base text-white">Full Interactive Simulator</h4>
                  <p className="text-xs text-white/60 mt-1">
                    Try the active phone simulator on the right: complete missions, buy companion animals (like a fox or bird) in the shop, and watch your garden grow instantly!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                <div className="text-2xl mt-0.5 shrink-0">⚡</div>
                <div>
                  <h4 className="font-bold text-base text-white">Dynamic Island & Stopwatch</h4>
                  <p className="text-xs text-white/60 mt-1">
                    Start the Shower Timer from the missions tab. The Dynamic Island at the top of the phone will collapse and display a running mini-status indicator!
                  </p>
                </div>
              </div>
            </div>

            {/* Native Android Tech Stack Details */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-black tracking-wide uppercase text-white/40">
                TECHNICAL HIGHLIGHTS (ANDROID SDK)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-emerald-500/20 transition">
                  <Cpu className="w-6 h-6 text-emerald-400 mb-3" />
                  <h5 className="font-bold text-sm text-white">MVVM Architecture</h5>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                    Clean separation using Jetpack ViewModel, StateFlow reactivity and clean Kotlin coroutine handling.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-emerald-500/20 transition">
                  <div className="text-emerald-400 font-bold mb-3">🎨</div>
                  <h5 className="font-bold text-sm text-white">Jetpack Compose</h5>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                    Modern declarative UI using Google Material 3 design systems, customized glassmorphic cards and states.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-emerald-500/20 transition">
                  <div className="text-emerald-400 font-bold mb-3">💾</div>
                  <h5 className="font-bold text-sm text-white">Jetpack DataStore</h5>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                    On-device persistent storage key-value configuration manager tracking user streaks and eco points safely.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-emerald-500/20 transition">
                  <div className="text-emerald-400 font-bold mb-3">🌐</div>
                  <h5 className="font-bold text-sm text-white">Dual Localization</h5>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                    Bilingual package with dynamic Turkish/English runtime locale switching capabilities.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="https://github.com/Remirdy/EcoQuest" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black hover:bg-emerald-400 font-bold text-sm transition active:scale-[0.98]"
              >
                <Github className="w-4 h-4" /> Android Source Code
              </a>
              <div className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-white/60 font-mono text-xs flex items-center">
                Kotlin • Material 3 • Compose • MVVM
              </div>
            </div>
          </div>

          {/* Right Column: Center-Staged Phone Simulator */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative">
              {/* Subtle back glowing ring */}
              <div className="absolute inset-0 rounded-[48px] bg-emerald-500/20 blur-3xl pointer-events-none transform -translate-y-4" />
              
              <PhoneSimulator />
            </div>
          </div>

        </div>

        {/* Footer info badge */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <div>EcoQuest is licensed under Remirdy template copyright permissions.</div>
          <div className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> &amp; 🌿 by remirdy
          </div>
        </div>

      </div>
    </main>
  )
}
