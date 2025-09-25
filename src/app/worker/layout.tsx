import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: " - Smart Waste Management",
  description:
    "Municipal waste management app with AI-powered segregation, community reporting, and green points system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  )
}
