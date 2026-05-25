import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Emirhan Doygun | Game Developer & AI Creative Technologist',
  description: 'Portfolio of Emirhan Doygun — Game Developer, AI Creative Technologist, and Computer Engineering Student based in Istanbul. Building playful digital experiences with Unity, C#, motion design and AI-assisted visuals.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#050505] text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}