'use client'

import {
  LayoutDashboard, Image as ImageIcon, SlidersHorizontal, Download, Settings,
  Plus, Bell, ChevronRight, Lock, Zap, Shield, Users, Sparkles, UploadCloud,
  Clock, Database, BarChart3, TrendingUp, Instagram, Facebook, Twitter, ShoppingBag,
} from 'lucide-react'
import d from './ImageForgeDashboard.module.css'

const stats = [
  { icon: BarChart3, label: 'Total Images', value: '1,248', trend: '+12.5% this week' },
  { icon: Download, label: 'Exported', value: '3,560', trend: '+18.3% this week' },
  { icon: Database, label: 'Storage Used', value: '23.4 GB', trend: 'of 100 GB', bar: 23 },
  { icon: Clock, label: 'Time Saved', value: '14.5 h', trend: 'this week' },
]

const projects = [
  { name: 'Summer Campaign', count: '24 images', g: 'linear-gradient(135deg,#f59e0b,#ec4899)' },
  { name: 'Product Shoot', count: '56 images', g: 'linear-gradient(135deg,#8b5cf6,#22d3ee)' },
  { name: 'Lookbook', count: '18 images', g: 'linear-gradient(135deg,#64748b,#0f172a)' },
  { name: 'Banner Set', count: '32 images', g: 'linear-gradient(135deg,#f43f5e,#a855f7)' },
  { name: 'Social Pack', count: '42 images', g: 'linear-gradient(135deg,#10b981,#3b82f6)' },
]

const presets = [
  { icon: Instagram, name: 'Instagram Post', size: '1080 × 1080 px', c: '#ec4899' },
  { icon: Instagram, name: 'Instagram Story', size: '1080 × 1920 px', c: '#a855f7' },
  { icon: Facebook, name: 'Facebook Post', size: '1200 × 630 px', c: '#3b82f6' },
  { icon: Twitter, name: 'Twitter Header', size: '1500 × 500 px', c: '#38bdf8' },
  { icon: ShoppingBag, name: 'E-commerce (Square)', size: '2048 × 2048 px', c: '#10b981' },
]

const features = [
  { icon: Zap, title: 'Fast', text: 'Lightning fast processing' },
  { icon: Shield, title: 'Secure', text: 'Your data is safe and private' },
  { icon: Users, title: 'Collaborative', text: 'Built for teams and workflows' },
  { icon: Sparkles, title: 'Beautiful', text: 'Clean, modern and intuitive interface' },
]

export default function ImageForgeDashboard() {
  return (
    <div className={d.frame}>
      {/* window chrome */}
      <div className={d.chrome}>
        <span className={d.dotR} /><span className={d.dotY} /><span className={d.dotG} />
      </div>

      <div className={d.body}>
        {/* sidebar */}
        <aside className={d.sidebar}>
          <div className={d.logo}><span className={d.logoMark}><ImageIcon size={16} /></span><b>Image<span>Forge</span></b></div>
          <nav className={d.nav}>
            <a className={d.navActive}><LayoutDashboard size={16} /> Dashboard</a>
            <a><ImageIcon size={16} /> Images</a>
            <a><SlidersHorizontal size={16} /> Presets</a>
            <a><Download size={16} /> Exports</a>
            <a><Settings size={16} /> Settings</a>
          </nav>
          <div className={d.proCard}>
            <b>Pro Plan</b>
            <span>Upgrade for more power and storage.</span>
            <button>Upgrade Now</button>
          </div>
        </aside>

        {/* main */}
        <main className={d.main}>
          <header className={d.topbar}>
            <div><h3>Dashboard</h3><p>Overview of your projects and exports</p></div>
            <div className={d.topActions}>
              <button className={d.newBtn}><Plus size={14} /> New Project</button>
              <span className={d.iconBtn}><Bell size={16} /></span>
              <span className={d.avatar}>ED</span>
            </div>
          </header>

          {/* stat cards */}
          <section className={d.statGrid}>
            {stats.map((st) => (
              <div className={d.statCard} key={st.label}>
                <div className={d.statTop}><st.icon size={15} /><span>{st.label}</span></div>
                <strong>{st.value}</strong>
                {st.bar != null
                  ? <div className={d.miniBar}><i style={{ width: `${st.bar}%` }} /></div>
                  : null}
                <em className={d.trend}><TrendingUp size={11} /> {st.trend}</em>
              </div>
            ))}
          </section>

          {/* recent projects */}
          <section className={d.panel}>
            <div className={d.panelHead}><h4>Recent Project</h4><a className={d.viewAll}>View All</a></div>
            <div className={d.projectRow}>
              {projects.map((p) => (
                <div className={d.project} key={p.name}>
                  <div className={d.thumb} style={{ background: p.g }} />
                  <b>{p.name}</b><span>{p.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* controls + presets */}
          <section className={d.lower}>
            <div className={d.panel}>
              <div className={d.panelHead}><h4>Resize Controls</h4></div>
              <label className={d.fieldLabel}>Custom Size</label>
              <div className={d.sizeRow}>
                <input defaultValue="1200" /><span className={d.x}>×</span><input defaultValue="800" />
                <button className={d.unit}>px ▾</button>
                <span className={d.lockBtn}><Lock size={14} /></span>
              </div>
              <label className={d.fieldLabel}>Scale</label>
              <div className={d.inlineField}><input defaultValue="100" /><span className={d.suffix}>%</span></div>
              <label className={d.fieldLabel}>Fit</label>
              <button className={d.select}>Contain <ChevronRight size={14} className={d.down} /></button>
              <div className={d.toggleRow}><span>Maintain aspect ratio</span><span className={d.toggle}><i /></span></div>
            </div>

            <div className={d.panel}>
              <div className={d.panelHead}><h4>Export Presets</h4><a className={d.viewAll}>View All</a></div>
              <div className={d.presetList}>
                {presets.map((p) => (
                  <button className={d.preset} key={p.name}>
                    <span className={d.presetIcon} style={{ background: `${p.c}22`, color: p.c }}><p.icon size={16} /></span>
                    <span className={d.presetText}><b>{p.name}</b><em>{p.size}</em></span>
                    <ChevronRight size={15} className={d.presetArrow} />
                  </button>
                ))}
              </div>
            </div>

            <div className={`${d.panel} ${d.dropzone}`}>
              <UploadCloud size={28} />
              <b>Add Images</b>
              <span>Drag &amp; drop your images here<br />or <em>browse</em></span>
            </div>
          </section>

          {/* feature row */}
          <section className={d.featureRow}>
            {features.map((f) => (
              <div className={d.feature} key={f.title}>
                <span className={d.featureIcon}><f.icon size={20} /></span>
                <b>{f.title}</b><span>{f.text}</span>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}
