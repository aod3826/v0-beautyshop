import type { Metadata, Viewport } from 'next'
import { Kanit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
})

export const metadata: Metadata = {
  title: 'Beautyshop | Thai Street Food Menu',
  description: 'Delicious Thai street food - Noodles, Rice Dishes, Sides & Drinks. Order from your table!',
}

export const viewport: Viewport = {
  themeColor: '#1a0e08',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
