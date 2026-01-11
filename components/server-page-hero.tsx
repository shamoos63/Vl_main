import Image from "next/image"

interface PageHeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
  className?: string
}

export default function ServerPageHero({ title, subtitle, backgroundImage, className }: PageHeroProps) {
  return (
    <section className={`relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden -mt-24 ${className || ''}`}>
      <div className="absolute inset-0 z-0">
        <Image src={backgroundImage || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
      </div>
      {/* Dark overlay to match home page hero */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />
      <div className="container mx-auto px-4 pt-24 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-heading font-sansumi">{title}</h1>
        {subtitle && <p className="text-l text-white max-w-3xl mx-auto pt-2">{subtitle}</p>}
      </div>
    </section>
  )
}
