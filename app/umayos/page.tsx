import type { Metadata } from 'next'
import UmayOSHero from '@/components/umayos/UmayOSHero'
import UmayArchitecture from '@/components/umayos/UmayArchitecture'

export const metadata: Metadata = {
  title: 'UmayOS — From Scratch RISC-V OS | Emirhan Doygun',
  description:
    'UmayOS: a RISC-V operating system built from zero — pure C, assembly, a custom GUI and window manager.',
}

export default function UmayOSPage() {
  return (
    <>
      <UmayOSHero />
      <UmayArchitecture />
    </>
  )
}
