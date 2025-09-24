import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "../globals.css"

export const metadata: Metadata = {
  title: "GreenAuthority - Waste Management Portal",
  description: "Admin portal for waste management authorities, ULBs, and Green Champions",
  generator: "v0.app",
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
