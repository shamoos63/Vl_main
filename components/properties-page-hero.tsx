"use client"

import ServerPageHero from "@/components/server-page-hero"
import { useI18n } from "@/lib/i18n"

export default function PropertiesPageHero() {
  const { t, isRTL, language } = useI18n()

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ServerPageHero
        title={
          <>
            {t("properties.page.title")}<br />
            {t("properties.page.title2")}
          </>
        }
        subtitle={
          <>
            {language !== "ru" && t("properties.page.subtitle2")}<br />
            {language === "ru" ? (
    <span className="-mt-8 block">{t("properties.page.subtitle")}</span>
  ) : (
    <span className="pt-4 block">{t("properties.page.subtitle")}</span>
  )}

          </>
        }
        backgroundImage="/hero.webp"
        className="font-sansumi"
      />
    </div>
  )
}