import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Studio Clone - Build Apps with AI',
  description: 'Build AI-powered applications using natural language. Powered by MiniMax M2.5.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
