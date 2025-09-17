"use client"
import { useEffect, useRef, useState } from "react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import ServerPageHero from "@/components/server-page-hero"
import TimelineSection from "@/components/timeline-section"
import { Button } from "@/components/ui/button"
import { Award, Users, TrendingUp, Globe, MapPin, Mail, Briefcase, GraduationCap, Check } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"



export default function AboutPage() {
  const { t, isRTL } = useI18n()
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set())
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastScrollY = useRef(0)

  const achievements = [
    {
      icon: <Award className="h-8 w-8 text-vl-yellow" />,
      number: t("about.achievements.1.number"),
      title: t("about.achievements.1.title"),
      description: t("about.achievements.1.description"),
    },
    {
      icon: <Users className="h-8 w-8 text-vl-yellow" />,
      number: t("about.achievements.2.number"),
      title: t("about.achievements.2.title"),
      description: t("about.achievements.2.description"),
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-vl-yellow" />,
      number: t("about.achievements.3.number"),
      title: t("about.achievements.3.title"),
      description: t("about.achievements.3.description"),
    },
    {
      icon: <Globe className="h-8 w-8 text-vl-yellow" />,
      number: t("about.achievements.4.number"),
      title: t("about.achievements.4.title"),
      description: t("about.achievements.4.description"),
    },
  ]

  const expertise = [
    t("about.expertise.1"),
    t("about.expertise.2"),
    t("about.expertise.3"),
    t("about.expertise.4"),
    t("about.expertise.5"),
    t("about.expertise.6"),
  ]

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up")
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for picture-text sections
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number.parseInt(entry.target.getAttribute("data-section-index") || "0")

        if (entry.isIntersecting && scrollDirection === "down") {
          setVisibleSections((prev) => new Set([...prev, index]))
        } else if (!entry.isIntersecting && scrollDirection === "up") {
          setVisibleSections((prev) => {
            const newSet = new Set(prev)
            newSet.delete(index)
            return newSet
          })
        }
      })
    }, observerOptions)

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [scrollDirection])

  return (
     <main className="min-h-screen pt-24 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <ServerPageHero
        title={t("about.page.title")}
        subtitle={t("about.page.subtitle")}
        backgroundImage="/hero.webp"
        className="font-sansumi"
      />

      {/* Quote Section */}
      <section className="py-12 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            
            <p className="text-2xl md:text-3xl text-white font-light italic mb-2 leading-relaxed">
              "{t("about.quote")}
            </p>
            <p className="text-2xl md:text-3xl text-white font-light italic mb-6 leading-relaxed">
            {t("about.quote+")}"
                  </p>
            
            
            <p className="text-xl font-semibold text-vl-yellow">{t("about.name")}</p>
            <p className="text-white mt-2">{t("about.title")}</p>
          </div>
        </div>
      </section>

   

      {/* About Content Section with Reversed Animation Directions */}
      <section className="py-6 bg-transparent">
        <div className="container mx-auto px-4">
          {/* First Section - Photo Left, Text Right - Photo animates from LEFT, Text animates from RIGHT */}
          <div
            ref={(el) => {
              sectionRefs.current[0] = el
            }}
            data-section-index="0"
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20"
          >
            {/* Photo Left - Animates from LEFT */}
            <div
              className={`relative transition-all duration-700 ease-out ${
                visibleSections.has(0) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/victoria-photo-1.jpg"
                  alt="Victoria Lancaster - Professional Portrait"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Content Right - Animates from RIGHT */}
            <div
              className={`space-y-8 transition-all duration-700 ease-out ${
                visibleSections.has(0) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div>
                <h2 className="text-4xl font-bold text-vl-yellow mb-6 font-sansumi leading-tight">
                  {t("about.section1.title")}
                </h2>
                <p className="text-lg text-white leading-relaxed mb-6">
                  {t("about.section1.text1")}
                </p>
                <p className="text-lg text-white leading-relaxed mb-6">
                  {t("about.section1.text2")}
                </p>
                <p className="text-sm text-white opacity-70 italic">{t("about.section1.updated")}</p>
              </div>
            </div>
          </div>

          {/* Second Section - Text Left, Photo Right - Text animates from LEFT, Photo animates from RIGHT */}
          
          <div
            ref={(el) => {
              sectionRefs.current[1] = el
            }}
            data-section-index="1"
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20"
          >
              {/* Photo Right - Animates from RIGHT */}
            <div
              className={`relative transition-all duration-700 ease-out ${
                visibleSections.has(1) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/victoria-photo-2.jpg"
                  alt="Victoria Lancaster - Client Meeting"
                  fill
                  className="object-contain left-4 md:left-6 absolute"
                />
              </div>
            </div>
            {/* Content Left - Animates from LEFT */}
            <div
              className={`ml-6 space-y-8 transition-all duration-700 ease-out ${
                visibleSections.has(1) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div>
                <h2 className="text-4xl font-bold text-vl-yellow mb-1 font-sansumi leading-tight">
                  {t("about.section2.title")}
                </h2>
                <p className="text-xl font-bold text-vl-yellow mb-6 font-sansumi leading-tight">
                  {t("about.section2.Subtitle")}
                </p>
                <p className="text-lg text-white leading-relaxed mb-6">
                  {t("about.section2.text1")}
                </p>
                <p className="text-lg text-white leading-relaxed mb-6">
                  {t("about.section2.text2")}
                </p>
                <p className="text-lg text-white leading-relaxed">
                  {t("about.section2.text3")}
                </p>
              </div>
            </div>

          
          </div>

          {/* Third Section - Photo Left, Text Right - Photo animates from LEFT, Text animates from RIGHT */}
          <div
            ref={(el) => {
              sectionRefs.current[2] = el
            }}
            data-section-index="2"
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Photo Left - Animates from LEFT */}
            <div
              className={`relative transition-all duration-700 ease-out ${
                visibleSections.has(2) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="relative h-96 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/victoria-photo-3 - full.jpg"
                  alt="Victoria Lancaster - Property Showcase"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Content Right - Animates from RIGHT */}
            <div
              className={`space-y-8 transition-all duration-700 ease-out ${
                visibleSections.has(2) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div>
                <h2 className="text-4xl font-bold text-vl-yellow mb-6 font-sansumi leading-tight">
                  {t("about.section3.title")}
                </h2>
                <p className="text-lg text-white leading-relaxed mb-6">
                  {t("about.section3.text1")}
                </p>
                <p className="text-lg text-white leading-relaxed mb-6">
                  {t("about.section3.text2")}
                </p>
                <p className="text-lg text-white leading-relaxed">
                  {t("about.section3.text3")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
   {/* Timeline Section */}
      <TimelineSection />
  

   

      {/* Areas of Expertise */}
      <section className="py-4 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-vl-yellow mb-4 font-sansumi text-center mt-[-2rem]">{t("about.expertise.title")}</h2>
            <p className="text-xl text-center text-vl-yellow italic mb-8">
              "{t("about.expertise.quote")}"
            </p>
            <p className="text-lg text-white mb-8 text-center">
              {t("about.expertise.description")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {expertise.map((item, index) => (
                <div key={index} className="flex items-center bg-vl-blue border border-vl-yellow p-4 rounded-lg">
                  <Check className="h-5 w-5 ml-3 text-vl-yellow mr-3 flex-shrink-0" />
                  <span className="text-white">{item}</span>
                  
                </div>
                
              ))}
         
              
            </div>
              

            {/* Offices */}
            <h3 className="text-2xl font-bold text-vl-yellow mb-6 font-sansumi text-center">{t("about.offices.title")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center justify-center bg-vl-blue border border-vl-yellow p-6 rounded-lg">
                <MapPin className="h-6 w-6 ml-3 text-vl-yellow mr-3" />
                <span className="text-white">{t("about.office.dubai")}</span>
              </div>
              <div className="flex items-center justify-center bg-vl-blue border border-vl-yellow p-6 rounded-lg">
                <MapPin className="h-6 w-6 text-vl-yellow ml-3 mr-3" />
                <span className="text-white">{t("about.office.manchester")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

        <section className="mb-10 text-white bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">      
            <div className="mt-6 p-6 bg-transparent backdrop-blur-sm rounded-2xl border border-vl-yellow">
              <div className="mb-4">
                <Image src="/comma_sign.svg" alt="Quote" width={40} height={40} className="mx-auto" />
              </div>
              <p className="text-xl italic mb-4 text-white">
                {t("about.excellence.quote")}
              </p>
              <p className="font-semibold text-vl-yellow">{t("about.name")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-4 bg-transparent mb-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-vl-yellow mb-6 font-sansumi">{t("about.cta.title")}</h2>
            <p className="text-xl text-white mb-1 leading-relaxed">
              {t("about.cta.text")}
            </p>
            <p className="text-xl text-white mb-8 leading-relaxed">
              {t("about.cta.text2")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                className="border-vl-yellow text-vl-yellow hover:bg-vl-yellow hover:text-black px-8 py-4 bg-transparent"
              >
                <Mail className="mr-2 h-5 w-5" />
                {t("about.cta.button")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
