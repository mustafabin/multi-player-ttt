import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tic Tac Tactics',
  description: 'Multiplayer Tic Tac Toe with a twist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ! Dont forget to remove this prop when you are done with your project
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className={inter.className}>{children}</body>
    </html>
  )
}
