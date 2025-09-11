"use client"

import { useI18n } from "@/lib/i18n"

interface PropertiesPageWrapperProps {
  children: React.ReactNode
}

export default function PropertiesPageWrapper({ children }: PropertiesPageWrapperProps) {
  const { isRTL } = useI18n()
  
  return (
    <main className="min-h-screen pt-24 bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
      {children}
    </main>
  )
}
