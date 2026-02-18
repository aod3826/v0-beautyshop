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
  title: 'Beautyshop | เมนูอาหารไทย',
  description: 'เมนูสตรีทฟู้ดไทย ทั้งก๋วยเตี๋ยว อาหารจานเดียว ของทานเล่น และเครื่องดื่ม สั่งอาหารได้จากโต๊ะทันที',
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
