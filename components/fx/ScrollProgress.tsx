'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <motion.div aria-hidden style={{ scaleX }} className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left">
      <div className="h-full w-full bg-[linear-gradient(90deg,#00eaff,#7c3cff,#00eaff)] shadow-[0_0_18px_rgba(0,234,255,0.7)]" />
    </motion.div>
  )
}
