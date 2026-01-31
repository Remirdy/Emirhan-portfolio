"use client";

import { motion } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ChevronRight, 
  Terminal, 
  Palette, 
  Cpu, 
  Sparkles,
  Gamepad2,
  Code2
} from "lucide-react";

export default function Portfolio() {
  
  const handleStoreRedirect = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      window.open("https://play.google.com/store/apps/details?id=com.moonlight.dirtybirdy&hl=tr", "_blank");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      window.open("https://apps.apple.com/tr/app/dirty-birdy/id6747272308?l=tr", "_blank");
    } else {
      window.open("https://play.google.com/store/apps/details?id=com.moonlight.dirtybirdy&hl=tr", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans leading-relaxed overflow-x-hidden">
      
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[140px] rounded-full" />
      </div>

      <nav className="max-w-6xl mx-auto p-8 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <motion.span className="text-2xl font-black tracking-tighter italic uppercase bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Emirhan Doygun
        </motion.span>
        <div className="flex gap-6 items-center text-gray-400">
          <a href="https://github.com/Remirdy" target="_blank" className="hover:text-cyan-400 transition-colors"><Github size={18} /></a>
          <a href="https://tr.linkedin.com/in/remirdy" target="_blank" className="hover:text-cyan-400 transition-colors"><Linkedin size={18} /></a>
          <a href="mailto:doygun_special@hotmail.com" className="hover:text-cyan-400 transition-colors"><Mail size={18} /></a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-24">
        
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-48">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-cyan-500/20 rounded-full mb-8 bg-cyan-500/5">
            <Sparkles size={12} className="text-cyan-400" />
            <span className="font-mono text-cyan-500 tracking-[0.2em] uppercase text-[10px] font-bold italic">
                Computer Engineering & Creative Producer
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85]">
            Vision Meets <br/> 
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent italic text-8xl md:text-9xl">Engineering.</span>
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl max-w-3xl leading-relaxed font-light italic">
            Mühendislik disipliniyle sanatsal vizyonu birleştirerek hibrit hikaye anlatıcılığı sistemleri ve düşük seviyeli yazılım çözümleri geliştiriyorum.
          </p>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-10">
          
          <motion.div whileHover={{ y: -10 }} className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 p-12 rounded-[3rem] transition-all hover:border-cyan-500/40">
            <motion.img 
              src="/dirty-birdy.png" 
              className="absolute z-20 pointer-events-none opacity-0 group-hover:opacity-100 w-32 h-32 object-contain"
              animate={{ x: [-150, 750], y: [120, 20, 120], rotate: [0, 10, -10, 0] }}
              transition={{ x: { duration: 4, repeat: Infinity, ease: "linear" }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            />
            <div className="flex justify-between items-start mb-12">
              <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em] font-bold px-4 py-1.5 border border-cyan-500/20 rounded-full">Game Concept</span>
              <Gamepad2 size={18} className="text-cyan-400" />
            </div>
            <h3 className="text-4xl font-bold mb-6 italic">Dirty Birdy!</h3>
            <p className="text-gray-500 leading-relaxed mb-10 text-lg font-light">MoonLight çatısı altında, sanatsal vizyonu teknik mühendislikle birleştirdiğimiz bir mobil oyun projesi. Karakter tasarımı, evren kurgusu ve animasyon rehberliği süreçlerinde ekiple birlikte dinamik bir dünya sunuyoruz.</p>
            <div className="flex flex-wrap gap-2 mb-12">
              {["Unity", "Character Design", "Prompt Engineering"].map(t => (
                <span key={t} className="text-[10px] bg-white/[0.03] px-4 py-1.5 rounded-lg text-gray-400 font-mono border border-white/5 italic">#{t}</span>
              ))}
            </div>
            <button onClick={handleStoreRedirect} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] italic text-white/30 group-hover:text-white transition-all">
              OYUNU İNCELE <ChevronRight size={16} />
            </button>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 p-12 rounded-[3rem] transition-all hover:border-blue-500/40">
            <div className="flex justify-between items-start mb-12">
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.3em] font-bold px-4 py-1.5 border border-blue-500/20 rounded-full">Systems Programming</span>
              <Cpu size={18} className="text-blue-400" />
            </div>
            <h3 className="text-4xl font-bold mb-6 italic">UmayOS</h3>
            <p className="text-gray-500 leading-relaxed mb-10 text-lg font-light">RISC-V mimarisi üzerinde çalışan, C ve Assembly dilleriyle geliştirilmiş mikro-kernel projem.</p>
            <div className="flex flex-wrap gap-2 mb-12">
              {["C", "Assembly", "RISC-V"].map(t => (
                <span key={t} className="text-[10px] bg-white/[0.03] px-4 py-1.5 rounded-lg text-gray-400 font-mono border border-white/5 italic">#{t}</span>
              ))}
            </div>
            <a href="https://github.com/Remirdy" target="_blank" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] italic text-white/30 group-hover:text-white transition-all hover:gap-4 transition-all">
              KODLARI İNCELE <ChevronRight size={16} />
            </a>
          </motion.div>

        </div>

        <section className="mt-60 grid md:grid-cols-3 gap-20 border-t border-white/5 pt-32 pb-20">
          <div className="space-y-10">
            <div className="flex items-center gap-4 text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px]">
              <Code2 size={18} /> <span>Yazılım & Eğitim</span>
            </div>
            <ul className="space-y-4 text-sm text-gray-400 italic font-light">
              <li>İstanbul Ticaret Üniversitesi [Bilgisayar Müh.]</li>
              <li>C, Assembly, Python, Kotlin</li>
              <li>İSMEK Android Programlama Sertifikası</li>
            </ul>
          </div>

          <div className="space-y-10">
            <div className="flex items-center gap-4 text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px]">
              <Palette size={18} /> <span>AI & Tasarım</span>
            </div>
            <ul className="space-y-4 text-sm text-gray-400 italic font-light">
              <li>Sora, Runway, Pika Prompt Mühendisliği</li>
              <li>Karakter ve Evren Tasarımı</li>
              <li>Sinematik Storyboarding</li>
            </ul>
          </div>

          <div className="space-y-10">
            <div className="flex items-center gap-4 text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px]">
              <Terminal size={18} /> <span>Diller</span>
            </div>
            <div className="space-y-4 text-sm italic font-light">
              <div className="flex justify-between border-b border-white/5 pb-2 text-gray-300">
                <span>İngilizce</span><span className="text-gray-600 font-mono text-xs">C1</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2 text-gray-300">
                <span>Almanca</span><span className="text-gray-600 font-mono text-xs">B1</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 text-center border-t border-white/5 bg-[#080808]/30 opacity-40 font-mono text-[10px] tracking-[0.5em] uppercase">
        © 2026 Emirhan Doygun — Professional Portfolio
      </footer>
    </div>
  );
}