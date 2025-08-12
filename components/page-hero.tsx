"use client"
import { useI18n } from "@/lib/i18n"

interface PageHeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
  className?: string
}

export default function PageHero({ title, subtitle, backgroundImage, className = "" }: PageHeroProps) {
  const { isRTL } = useI18n()

  return (
    <section
      className={`relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 vl-hero-gradient opacity-90"></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-heading">{title}</h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  )
}
