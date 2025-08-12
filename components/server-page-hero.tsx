import Image from "next/image"

interface PageHeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
  className?: string
}

export default function ServerPageHero({ title, subtitle, backgroundImage, className }: PageHeroProps) {
  return (
    <section className={`relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden ${className || ''}`}>
      <div className="absolute inset-0 z-0">
        <Image src={backgroundImage || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-heading font-sansumi">{title}</h1>
        {subtitle && <p className="text-xl text-white max-w-3xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  )
}
