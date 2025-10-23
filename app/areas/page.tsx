"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import ServerPageHero from "@/components/server-page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import BlogModal from "@/components/blog-modal"
import type { BlogPost, BlogPostSummary } from "@/lib/blog-service"



export default function AreasPage() {
  const { t, isRTL, language } = useI18n()
  const [areaPosts, setAreaPosts] = useState<BlogPostSummary[]>([])
  const [selectedArea, setSelectedArea] = useState<BlogPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/blog?language=${language}&type=Area`)
        if (!res.ok) throw new Error('Failed to fetch area articles')
        const data = await res.json()
        setAreaPosts(data.blogs || [])
      } catch (e) {
        console.error('Failed to fetch area articles', e)
        setError('Failed to load area articles')
      } finally {
        setIsLoading(false)
      }
    }
    fetchAreas()
  }, [language])

  // Static mock cards removed; we now rely on database-backed Area posts below.

  return (
    <main className="min-h-screen pt-24 bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <ServerPageHero
        title={t("areas.page.title")}
        subtitle={t("areas.page.subtitle")}
        backgroundImage="/hero.webp"
        className="font-sansumi"
      />

      {/* Description Section */}
      <section className="py-12 bg-transparent">
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

      {/* Database-backed Area articles below */}

      {/* Dynamic Area Articles */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-vl-blue"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : areaPosts.length === 0 ? (
            <div className="text-center text-gray-500">{t("areas.articles.empty")}</div>
          ) : (
            <div className={`grid gap-6 ${areaPosts.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
              {areaPosts.map((post) => (
                <Card key={post.id} className="rounded-2xl overflow-hidden shadow-md glass">
                  <div className="relative h-40 w-full">
                    <Image src={post.featuredImageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-vl-yellow text-vl-blue">{post.type}</Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Eye className="h-3 w-3" />{post.viewCount}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const res = await fetch(`/api/blog/${post.slug}?language=${language}`)
                        const data = await res.json()
                        setSelectedArea(data.blog)
                        setIsModalOpen(true)
                      }}
                      className="w-full"
                    >
                      {t("blog.read.more")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <BlogModal blog={selectedArea} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </main>
  )
}
