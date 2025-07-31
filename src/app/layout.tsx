'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/header'
import { QueryProvider } from '@/lib/providers/query-provider'
import { usePathname } from 'next/navigation'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

export default function RootLayout({ 
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const noHeaderRoutes = ['/dashboard', '/dashboard/perfil', '/dashboard/contratos', '/dashboard/suporte']

  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
      <body>
        <QueryProvider>
          {!noHeaderRoutes.includes(pathname) && <Header />}
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
