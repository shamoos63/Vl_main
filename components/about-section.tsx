"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Award, Users, TrendingUp, Globe, DollarSign, Zap } from "lucide-react"

export default function AboutSection() {
  const { t, isRTL } = useI18n()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = ["/victoria-photo-1.jpg", "/victoria-photo-2.jpg", "/victoria-photo-3.jpg", "/victoria-photo-4.jpg"]

  const traits = [
    { icon: Award, key: "professional", color: "bg-blue-500" },
    { icon: TrendingUp, key: "experienced", color: "bg-green-500" },
    { icon: Users, key: "trustworthy", color: "bg-purple-500" },
    { icon: Globe, key: "multilingual", color: "bg-orange-500" },
    { icon: DollarSign, key: "best.deals", color: "bg-emerald-500" },
    { icon: Zap, key: "fast.service", color: "bg-red-500" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Interactive Image Carousel Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Carousel */}
            <div className="relative">
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={`Victoria Lancaster - Photo ${currentImageIndex + 1}`}
                  fill
                  className="object-cover transition-all duration-500"
                />

                {/* Carousel Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-sansumi"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-sansumi"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-vl-yellow" : "bg-white/50"
                      } font-sansumi`}
                    />
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-vl-yellow rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-vl-blue rounded-full opacity-10 animate-pulse" />
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-vl-blue dark:text-white mb-6 font-sansumi">
                  Meet Victoria Lancaster
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-sansumi">
                  {t("about.description.1")}
                </p>
              </div>

              <div>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-sansumi">
                  {t("about.description.2")}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center font-sansumi">
                  <div className="text-3xl font-bold text-vl-blue dark:text-white font-sansumi">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-sansumi">Properties Sold</div>
                </div>
                <div className="text-center font-sansumi">
                  <div className="text-3xl font-bold text-vl-blue dark:text-white font-sansumi">15+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-sansumi">Years Experience</div>
                </div>
                <div className="text-center font-sansumi">
                  <div className="text-3xl font-bold text-vl-blue dark:text-white font-sansumi">98%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-sansumi">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Traits Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-vl-blue dark:text-white mb-6 font-sansumi">
              Why Choose Victoria?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-sansumi">
              Experience excellence in every aspect of your real estate journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {traits.map((trait, index) => {
              const Icon = trait.icon
              return (
                <Card
                  key={trait.key}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 ${trait.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-vl-blue dark:text-white mb-3 font-sansumi">
                      {t(`about.trait.${trait.key}`)}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 font-sansumi">
                      Excellence in every detail of your real estate experience
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="py-20 bg-gradient-to-r from-vl-blue to-vl-blue-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 font-sansumi">
              {t("about.expertise.title")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-vl-yellow mb-4 font-sansumi">Investment Specialties</h4>
                <ul className="space-y-3 text-white font-sansumi">
                  <li className="flex items-center font-sansumi">
                    <div className="w-2 h-2 bg-vl-yellow rounded-full mr-3" />
                    {t("about.expertise.offplan")}
                  </li>
                  <li className="flex items-center font-sansumi">
                    <div className="w-2 h-2 bg-vl-yellow rounded-full mr-3" />
                    {t("about.expertise.luxury")}
                  </li>
                  <li className="flex items-center font-sansumi">
                    <div className="w-2 h-2 bg-vl-yellow rounded-full mr-3" />
                    {t("about.expertise.buytolet")}
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-vl-yellow mb-4 font-sansumi">Strategic Services</h4>
                <ul className="space-y-3 text-white font-sansumi">
                  <li className="flex items-center font-sansumi">
                    <div className="w-2 h-2 bg-vl-yellow rounded-full mr-3" />
                    {t("about.expertise.portfolio")}
                  </li>
                  <li className="flex items-center font-sansumi">
                    <div className="w-2 h-2 bg-vl-yellow rounded-full mr-3" />
                    {t("about.expertise.forecasting")}
                  </li>
                  <li className="flex items-center font-sansumi">
                    <div className="w-2 h-2 bg-vl-yellow rounded-full mr-3" />
                    Market Analysis & Insights
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12">
              <Button
                size="lg"
                className="bg-vl-yellow text-vl-blue hover:bg-vl-yellow/90 font-sansumi text-lg px-8 py-4"
              >
                Start Your Journey Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
