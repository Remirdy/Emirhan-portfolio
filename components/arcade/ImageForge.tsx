'use client'

import { useRef, useState } from 'react'
import { Download, Image as ImageIcon, Layers3, Shuffle, Wand2 } from 'lucide-react'
import s from './Arcade.module.css'

type Preset = { name: string; w: number; h: number }

const presets: Preset[] = [
  { name: 'Instagram Post', w: 1080, h: 1080 },
  { name: 'Story / Reels', w: 1080, h: 1920 },
  { name: 'YouTube Thumb', w: 1280, h: 720 },
  { name: 'App Store Shot', w: 1290, h: 2796 },
]

export default function ImageForge() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState('')
  const [preset, setPreset] = useState<Preset>(presets[0])
  const [mode, setMode] = useState<'cover' | 'contain'>('cover')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = (img: HTMLImageElement, p = preset, fit = mode) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = p.w
    canvas.height = p.h
    ctx.fillStyle = '#050912'
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

  const applyPreset = (p: Preset) => {
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
    <div className={s.imageForgeApp}>
      <div className={s.forgeDrop} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}>
        {preview ? <img src={preview} alt="ImageForge preview" /> : <><ImageIcon /><b>Drop an image</b><span>or choose a file to forge presets</span></>}
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      <div className={s.forgeControls}>
        <div className={s.forgeBrand}><Layers3 /><div><b>ImageForge</b><span>working browser-based export lab</span></div></div>
        {presets.map((p) => <button key={p.name} onClick={() => applyPreset(p)} className={preset.name === p.name ? s.activePreset : ''}>{p.name}<small>{p.w}×{p.h}</small></button>)}
        <button onClick={toggleMode}><Shuffle /> Fit mode: {mode}</button>
        <button onClick={download} disabled={!preview}><Download /> Download PNG</button>
        <div className={s.forgeNote}><Wand2 /> Drag-drop, resize, crop-fit and export now works directly inside the portfolio.</div>
      </div>
      <canvas ref={canvasRef} hidden />
    </div>
  )
}
