'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const AuroraCanvas = dynamic(() => import('./AuroraCanvas'), { ssr: false })

export default function AuroraBackground() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 760px)').matches
    setShow(!reduce && !small)
  }, [])

  if (!show) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[3] opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]">
      <AuroraCanvas />
    </div>
  )
}
