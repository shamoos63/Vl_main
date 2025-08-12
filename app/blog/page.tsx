"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import ServerPageHero from "@/components/server-page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, User, ArrowRight, Eye, Clock, Search, Filter } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import BlogModal from "@/components/blog-modal"
import type { BlogPost, BlogPostSummary } from "@/lib/blog-service"

export default function BlogPage() {
  const { t, language, isRTL } = useI18n()
  const [blogPosts, setBlogPosts] = useState<BlogPostSummary[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPostSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isSearching, setIsSearching] = useState(false)

  const categories = [
    { key: "all", label: t("blog.categories.all") },
    { key: "Market Analysis", label: t("blog.categories.market.analysis") },
    { key: "Investment Guide", label: t("blog.categories.investment.guide") },
    { key: "Investment Tips", label: t("blog.categories.investment.tips") },
    { key: "Investment Strategy", label: t("blog.categories.investment.strategy") },
    { key: "Area Guide", label: t("blog.categories.area.guide") },
    { key: "Legal Guide", label: t("blog.categories.legal.guide") },
  ]

  useEffect(() => {
    fetchBlogPosts()
  }, [language])

  useEffect(() => {
    filterBlogPosts()
  }, [blogPosts, searchQuery, selectedCategory])

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/blog?language=${language}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      
      const data = await response.json()
      setBlogPosts(data.blogs || [])
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts')
    } finally {
      setIsLoading(false)
    }
  }

  const filterBlogPosts = () => {
    let filtered = [...blogPosts]

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.type === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.type.toLowerCase().includes(query)
      )
    }

    setFilteredPosts(filtered)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      setIsSearching(true)
      const response = await fetch(`/api/blog?search=${encodeURIComponent(searchQuery)}&language=${language}`)
      if (!response.ok) {
        throw new Error('Failed to search blog posts')
      }
      
      const data = await response.json()
      setFilteredPosts(data.blogs || [])
    } catch (err) {
      console.error('Error searching blog posts:', err)
      setError('Failed to search blog posts')
    } finally {
      setIsSearching(false)
    }
  }

  const handleReadMore = async (blog: BlogPostSummary) => {
    try {
      const response = await fetch(`/api/blog/${blog.slug}?language=${language}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog details')
      }
      
      const data = await response.json()
      setSelectedBlog(data.blog)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Error fetching blog details:', err)
      setError('Failed to load blog details')
    }
  }

  const formatDate = (date: Date | null | string | number) => {
    if (!date) return ''
    
    // Handle different date formats
    let dateObj: Date;
    try {
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      } else {
        return '';
      }

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return '';
      }

      return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 
                                    language === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      console.warn('Invalid date format:', date, error);
      return '';
    }
  }

  const getDefaultImage = (type: string) => {
    const typeImages = {
      'Market Analysis': '/placeholder.svg?height=200&width=400&text=Market+Analysis',
      'Investment Guide': '/placeholder.svg?height=200&width=400&text=Investment+Guide',
      'Investment Tips': '/placeholder.svg?height=200&width=400&text=Investment+Tips',
      'Investment Strategy': '/placeholder.svg?height=200&width=400&text=Investment+Strategy',
      'Area Guide': '/placeholder.svg?height=200&width=400&text=Area+Guide',
      'Legal Guide': '/placeholder.svg?height=200&width=400&text=Legal+Guide',
      'default': '/placeholder.svg?height=200&width=400&text=Blog+Post'
    }
    return typeImages[type as keyof typeof typeImages] || typeImages.default
  }
  
  return (
    <main className="min-h-screen pt-24 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <ServerPageHero
        title={t("blog.page.title")}
        subtitle={t("blog.page.subtitle")}
        backgroundImage="/hero.webp"
        className="font-sansumi"
      />

      {/* Description Section */}
      <section className="py-12 ">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-white mb-6 text-center">
            {t("blog.description.1")}
          </p>
          <p className="text-lg text-white mb-6 text-center">
            {t("blog.description.2")}
          </p>
          <p className="text-lg text-white mb-6 text-center">{t("blog.description.3")}</p>
          <ul className="flex flex-col gap-6 md:flex-row md:gap-8">

    <li className="flex flex-1 items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("blog.feature.1")}
      </h3>
    </li>

    <li className="flex flex-1 items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("blog.feature.2")}
      </h3>
    </li>

    <li className="flex flex-1 items-center justify-center rounded-xl glass p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-lg font-medium text-gray-800">
        {t("blog.feature.3")}
      </h3>
    </li>

  </ul>
          <p className="text-lg text-white text-center font-medium pt-5">{t("blog.description.4")}</p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t("blog.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-vl-yellow rounded-lg"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-vl-yellow hover:bg-vl-yellow/90 text-vl-blue px-6"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-vl-blue"></div>
                ) : (
                  t("blog.search.button")
                )}
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`${
                    selectedCategory === category.key
                      ? "bg-vl-yellow text-vl-blue border-vl-yellow"
                      : "bg-white text-gray-700 border-gray-300 hover:border-vl-yellow"
                  } transition-all duration-200`}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            {searchQuery.trim() && (
              <div className="text-center">
                <p className="text-gray-600">
                  {filteredPosts.length === 0 
                    ? t("blog.search.no.results")
                    : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'result' : 'results'} found`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="pt-2">
        <div className="w-full py-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vl-yellow mx-auto"></div>
              <p className="mt-4 text-gray-600">{t("common.loading")}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchBlogPosts} className="bg-vl-blue hover:bg-vl-blue/90">
                {t("common.try.again")}
              </Button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {searchQuery.trim() || selectedCategory !== "all" 
                  ? t("blog.search.no.results")
                  : t("blog.no.posts")
                }
              </p>
            </div>
          ) : (
            <section className="w-full flex justify-center py-8">
              <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 glass w-80 h-auto"
                >
                  <div className="relative h-48">
                    <Image 
                      src={post.featuredImageUrl || getDefaultImage(post.type)} 
                      alt={post.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>

                  <CardContent className="flex flex-col justify-between flex-1 p-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-vl-yellow text-vl-blue">{post.type}</Badge>
                        <span className="text-sm text-gray-500">{post.readingMinutes} min read</span>
                      </div>

                      <h3 className="text-xl font-bold text-vl-yellow dark:text-white mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-vl-yellow" />
                          <span>{post.authorName}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-vl-yellow" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-vl-yellow" />
                          <span>{post.viewCount} views</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="mt-auto w-full bg-transparent border-2 border-vl-yellow hover:border-black text-white"
                      onClick={() => handleReadMore(post)}
                    >
                      {t("blog.read.more")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Blog Modal */}
      <BlogModal
        blog={selectedBlog}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedBlog(null)
        }}
      />

      <Footer />
    </main>
  )
}
