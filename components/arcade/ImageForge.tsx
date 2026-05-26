'use client'

import { useRef, useState } from 'react'
import { Download, Image as ImageIcon, Layers3, Shuffle } from 'lucide-react'
import s from './ImageForge.module.css'

type Preset = { name: string; w: number; h: number; note: string }

const presets: Preset[] = [
  { name: 'Square', w: 1080, h: 1080, note: 'Instagram post' },
  { name: 'Vertical', w: 1080, h: 1920, note: 'Story / Reels' },
  { name: 'Wide', w: 1280, h: 720, note: 'YouTube thumb' },
  { name: 'Store', w: 1290, h: 2796, note: 'App screenshot' },
]

export default function ImageForge() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [preset, setPreset] = useState<Preset>(presets[0])
  const [mode, setMode] = useState<'cover' | 'contain'>('cover')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = (img: HTMLImageElement, p = preset, fit = mode) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    canvas.width = p.w
    canvas.height = p.h
    ctx.fillStyle = '#071019'
    ctx.fillRect(0, 0, p.w, p.h)
    const scale = fit === 'cover' ? Math.max(p.w / img.width, p.h / img.height) : Math.min(p.w / img.width, p.h / img.height)
    const dw = img.width * scale
    const dh = img.height * scale
    ctx.drawImage(img, (p.w - dw) / 2, (p.h - dh) / 2, dw, dh)
    setPreview(canvas.toDataURL('image/png'))
  }

  const onFile = (file?: File) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setImage(img)
      draw(img)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  const choosePreset = (p: Preset) => {
    setPreset(p)
    if (image) draw(image, p, mode)
  }

  const toggleMode = () => {
    const next = mode === 'cover' ? 'contain' : 'cover'
    setMode(next)
    if (image) draw(image, preset, next)
  }

  const download = () => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = `imageforge-${preset.w}x${preset.h}.png`
    a.click()
  }

  return (
    <div className={s.shell}>
      <div className={s.preview} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}>
        {preview ? <img src={preview} alt="ImageForge preview" /> : <div className={s.empty}><ImageIcon /><strong>Drop image here</strong><span>Resize, crop and export in one clean panel.</span></div>}
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>

      <aside className={s.controls}>
        <div className={s.brand}><Layers3 /><div><b>ImageForge</b><span>Working browser export tool</span></div></div>
        <div className={s.status}><span>Output</span><b>{preset.w} × {preset.h}</b></div>
        <div className={s.presets}>{presets.map((p) => <button key={p.name} onClick={() => choosePreset(p)} className={preset.name === p.name ? s.active : ''}><b>{p.name}</b><span>{p.note}</span></button>)}</div>
        <button className={s.secondary} onClick={toggleMode}><Shuffle /> Fit mode: {mode}</button>
        <button className={s.primary} onClick={download} disabled={!preview}><Download /> Download PNG</button>
      </aside>
      <canvas ref={canvasRef} hidden />
    </div>
  )
}
