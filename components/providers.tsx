"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { SearchProvider } from "@/lib/contexts/search-context"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SearchProvider>
        {children}
      </SearchProvider>
    </SessionProvider>
  )
} 