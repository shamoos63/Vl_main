"use client"

import { useI18n } from "@/lib/i18n"

export default function LoadingFallback() {
  const { t } = useI18n()
  
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vl-blue mx-auto mb-4"></div>
        <p className="text-gray-600">{t("properties.loading.details")}</p>
      </div>
    </div>
  )
}
