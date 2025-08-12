"use client"

import Footer from "@/components/footer"
import Header from "@/components/header"
import ServerPageHero from "@/components/server-page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, TrendingUp, Home } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"



export default function AreasPage() {
  const { t, isRTL } = useI18n()

  const areas = [
    {
      nameKey: "areas.dubai.marina.name",
      descriptionKey: "areas.dubai.marina.description",
      properties: "150+ " + t("areas.properties.label"),
      avgPrice: "$1.2M - $3.5M",
      growth: "+12% " + t("areas.growth.label"),
      image: "/placeholder.svg?height=256&width=400&text=Dubai+Marina",
    },
    {
      nameKey: "areas.downtown.dubai.name",
      descriptionKey: "areas.downtown.dubai.description",
      properties: "200+ " + t("areas.properties.label"),
      avgPrice: "$800K - $5M",
      growth: "+15% " + t("areas.growth.label"),
      image: "/placeholder.svg?height=256&width=400&text=Downtown+Dubai",
    },
    {
      nameKey: "areas.palm.jumeirah.name",
      descriptionKey: "areas.palm.jumeirah.description",
      properties: "80+ " + t("areas.properties.label"),
      avgPrice: "$2M - $15M",
      growth: "+18% " + t("areas.growth.label"),
      image: "/placeholder.svg?height=256&width=400&text=Palm+Jumeirah",
    },
    {
      nameKey: "areas.business.bay.name",
      descriptionKey: "areas.business.bay.description",
      properties: "120+ " + t("areas.properties.label"),
      avgPrice: "$600K - $2.5M",
      growth: "+10% " + t("areas.growth.label"),
      image: "/placeholder.svg?height=256&width=400&text=Business+Bay",
    },
  ]

  return (
    <main className="min-h-screen pt-24 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <ServerPageHero
        title={t("areas.page.title")}
        subtitle={t("areas.page.subtitle")}
        backgroundImage="/hero.webp"
        className="font-sansumi"
      />

      {/* Description Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-gray-700 mb-6 text-center">
            {t("areas.description.1")}
          </p>
          <p className="text-lg text-gray-700 mb-6 text-center">
            {t("areas.description.2")}
          </p>
       <ul className="flex flex-col gap-6 md:flex-row md:gap-8 py-2">

    <li className="flex flex-1 items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("areas.feature.1")}
      </h3>
    </li>

    <li className="flex flex-1 items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("areas.feature.2")}
      </h3>
    </li>

    <li className="flex flex-1 items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("areas.feature.3")}
      </h3>
    </li>

  </ul>
          <p className="text-lg text-gray-700 pt-4 font-medium text-center">
            {t("areas.description.3")}
          </p>
        </div>
      </section>

     <div className="p-6 bg-transparent">
  <div className="container mx-auto px-4 py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {areas.map((area, index) => (
        <Card
          key={index}
          className="glass bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
          <div className="relative h-64">
            <Image
              src={area.image || "/placeholder.svg"}
              alt={t(area.nameKey)}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-vl-yellow dark:text-white mb-3">
              {t(area.nameKey)}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t(area.descriptionKey)}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-100">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2 text-vl-yellow" />
                <span>{area.properties}</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                <span>{area.growth}</span>
              </div>
              <div className="flex items-center col-span-2">
                <MapPin className="h-4 w-4 mr-2 text-vl-yellow" />
                <span className="font-semibold">{area.avgPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</div>
      <Footer />
    </main>
  )
}
