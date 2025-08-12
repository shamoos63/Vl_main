"use client"

import ServerPageHero from "@/components/server-page-hero"
import { useI18n } from "@/lib/i18n"

export default function PropertiesPageHero() {
  const { t, isRTL } = useI18n()
  
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ServerPageHero
        title={t("properties.page.title")}
        subtitle={t("properties.page.subtitle")}
        backgroundImage="/hero.webp"
        className="font-sansumi"
      />
    </div>
  )
}
