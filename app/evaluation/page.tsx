"use client"

import Footer from "@/components/footer"
import Header from "@/components/header"
import ServerPageHero from "@/components/server-page-hero"
import EvaluationClient from "./evaluation-client"
import { useI18n } from "@/lib/i18n"

export default function EvaluationPage() {
  const { t, isRTL, language } = useI18n()
  
  return (
    <main className="min-h-screen pt-24 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <ServerPageHero
        title={t("evaluation.page.title")}
        subtitle={t("evaluation.page.subtitle")}
        backgroundImage="/hero.webp"
        className="font-sansumi"
        subtitleClassName="pt-4"

      />

      {/* Description Section */}
      <section className="py-12 bg-transparent">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-white text-center py-1">
            {t("evaluation.description.1")}
            </p>
            <p
  className={`text-lg text-white text-center py-1 
    ${language === "ar" ? "mb-6" : "mb-0"} 
    ${language === "ru" ? "hidden" : "visible"}`}
>
  {t("evaluation.description.1+")}
</p>
            <p className={`text-lg text-white text-center py-1 mb-6 ${ language === "ar" ? "hidden" : "visible" }`}>     {t("evaluation.description.2")}</p>
         <div className="w-full">
  <ul className="flex flex-col gap-6 md:flex-row md:gap-8">

    <li className="flex flex-1 items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("evaluation.feature.1")}
      </h3>
    </li>

    <li className="flex flex-1 items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("evaluation.feature.2")}
      </h3>
    </li>

    <li className="flex flex-1 flex-col items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("evaluation.feature.3")}
      </h3>
      <p className="text-sm text-gray-600 mt-2">
      {t("evaluation.feature.3+")}
    </p>
    </li>
  </ul>
</div>
        <p className="text-lg text-white text-center pt-10 mt-4 font-medium">
  {t("evaluation.description.4")}
</p>
        </div>
      </section>
   <EvaluationClient />
      {/* Stats Section */}
      <section className="py-8 mt-[-5rem]">
  <div className="container mx-auto px-4">
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
      {[
        { value: "15+", label: t("evaluation.stats.3") },
        { value: "585+", label: t("evaluation.stats.1") },
        {
    value: language === "ru" ? "1.7+ млрд AED" : "AED 1.7B+",
    label: t("evaluation.stats.2"),
  },

      ].map((stat, index) => (
        <div
          key={index}
          className="glass rounded-lg p-6 text-center shadow-md flex flex-col justify-center items-center w-[200px] h-[100px]"
        >
          <div className={` font-bold text-v-yellow  ${language !== "ar" ? "text-xl" : "text-3xl" }`}>{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>

   
        <Footer />
    </main>
  )
}
