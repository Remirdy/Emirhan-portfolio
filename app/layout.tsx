import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = localFont({ src: './fonts/DMSans.ttf', variable: '--font-inter', display: 'swap', weight: '100 1000' })
const spaceGrotesk = localFont({ src: './fonts/Syne.ttf', variable: '--font-display', display: 'swap', weight: '400 800' })
const serif = localFont({ src: [
  { path: './fonts/InstrumentSerif-Regular.ttf', weight: '400', style: 'normal' },
  { path: './fonts/InstrumentSerif-Italic.ttf', weight: '400', style: 'italic' },
], variable: '--font-serif', display: 'swap' })

export const metadata: Metadata = {
  title: 'Emirhan Doygun — Games, Motion & Creative Tools',
  description: 'I’m Emirhan, a developer and Computer Engineering student in Istanbul. Explore my Unity games, motion work, creative tools and experiments.',
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${serif.variable}`}>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
