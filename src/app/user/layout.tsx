import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "../globals.css"

export const metadata: Metadata = {
  title: "GreenHome - Smart Waste Management",
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
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
