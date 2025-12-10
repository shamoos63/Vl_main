"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ModernDashboardLayout from "@/components/dashboard/modern-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, Calendar, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { BlogPost, BlogPostSummary } from "@/lib/blog-service"
import RichTextEditor from "@/components/rich-text-editor"

export default function BlogPage() {
  const { t, language } = useI18n()
  const [blogPosts, setBlogPosts] = useState<BlogPostSummary[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeLanguageTab, setActiveLanguageTab] = useState('en')
  const [translations, setTranslations] = useState<{
    en: { title: string; excerpt: string; content: string; metaTitle: string; metaDescription: string }
    ar: { title: string; excerpt: string; content: string; metaTitle: string; metaDescription: string }
    ru: { title: string; excerpt: string; content: string; metaTitle: string; metaDescription: string }
  }>({
    en: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
    ar: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
    ru: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' }
  })
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("")
  const [isUploadingFeatured, setIsUploadingFeatured] = useState<boolean>(false)

  useEffect(() => {
    setFeaturedImageUrl(currentPost?.featuredImageUrl || "")
  }, [currentPost, isDialogOpen])

  const uploadFeaturedToServer = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append('image', file)
    fd.append('name', file.name.replace(/\.[^.]+$/, ''))
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || 'Upload failed')
    }
    const data = await res.json()
    if (!data?.url) throw new Error('No URL returned')
    return data.url as string
  }
  const searchParams = useSearchParams()
  const router = useRouter()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  const categories = [
    { key: "Market Analysis", label: t("blog.categories.market.analysis") },
    { key: "Investment Guide", label: t("blog.categories.investment.guide") },
    { key: "Investment Tips", label: t("blog.categories.investment.tips") },
    { key: "Investment Strategy", label: t("blog.categories.investment.strategy") },
    { key: "Area Guide", label: t("blog.categories.area.guide") },
    { key: "Legal Guide", label: t("blog.categories.legal.guide") },
  ]

  // Load blog posts from API
  useEffect(() => {
    fetchBlogPosts()
    
    // Check if we should open the add dialog
    const action = searchParams.get("action")
    if (action === "new") {
      handleAddPost()
      // Clear the URL parameter
      router.replace("/dashboard/blog")
    }
  }, [searchParams, router, language])

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/blog?language=${language}&all=true`)
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

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updateTranslation = (lang: 'en' | 'ar' | 'ru', field: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }))
  }

  const handleAddPost = () => {
    const today = new Date().toISOString().split("T")[0]
    setCurrentPost({
      type: "Market Analysis",
      readingMinutes: 5,
      featuredImageUrl: "",
      isPublished: false,
    })
    // Reset translations
    setTranslations({
      en: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
      ar: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
      ru: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' }
    })
    setActiveLanguageTab('en')
    setIsDialogOpen(true)
  }

  const handleEditPost = async (post: BlogPostSummary) => {
    try {
      // Fetch blog with all translations for editing
      const response = await fetch(`/api/blog/${post.slug}?language=en&includeTranslations=true`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog details')
      }
      
      const data = await response.json()
      setCurrentPost(data.blog)
      // Populate all language translation fields for the form when available
      const tr = data.translations || {}
      setTranslations(prev => ({
        en: {
          title: (tr.en?.title ?? data.blog.title) || '',
          excerpt: (tr.en?.excerpt ?? data.blog.excerpt) || '',
          content: (tr.en?.content ?? data.blog.content) || '',
          metaTitle: (tr.en?.metaTitle ?? data.blog.metaTitle ?? tr.en?.title ?? data.blog.title) || '',
          metaDescription: (tr.en?.metaDescription ?? data.blog.metaDescription ?? tr.en?.excerpt ?? data.blog.excerpt) || ''
        },
        ar: {
          title: tr.ar?.title || '',
          excerpt: tr.ar?.excerpt || '',
          content: tr.ar?.content || '',
          metaTitle: tr.ar?.metaTitle || tr.ar?.title || '',
          metaDescription: tr.ar?.metaDescription || tr.ar?.excerpt || ''
        },
        ru: {
          title: tr.ru?.title || '',
          excerpt: tr.ru?.excerpt || '',
          content: tr.ru?.content || '',
          metaTitle: tr.ru?.metaTitle || tr.ru?.title || '',
          metaDescription: tr.ru?.metaDescription || tr.ru?.excerpt || ''
        }
      }))
      setActiveLanguageTab('en')
      setIsDialogOpen(true)
    } catch (err) {
      console.error('Error fetching blog details:', err)
      setError('Failed to load blog details')
    }
  }

  const handleDeletePost = (post: BlogPostSummary) => {
    setCurrentPost(post)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePost = async () => {
    if (!currentPost?.slug) return
    
    try {
      const response = await fetch(`/api/blog/${currentPost.slug}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchBlogPosts() // Refresh the list
        setIsDeleteDialogOpen(false)
        setCurrentPost(null)
      } else {
        throw new Error('Failed to delete blog post')
      }
    } catch (err) {
      console.error('Error deleting blog post:', err)
      setError('Failed to delete blog post')
    }
  }

  const togglePublished = async (post: BlogPostSummary) => {
    try {
      // Fetch full blog details to supply required fields to PATCH
      const detailsRes = await fetch(`/api/blog/${post.slug}?language=en`)
      if (!detailsRes.ok) throw new Error('Failed to load blog details')
      const details = await detailsRes.json()

      const payload = {
        title: details.blog.title,
        content: details.blog.content,
        excerpt: details.blog.excerpt || '',
        type: details.blog.type,
        readingMinutes: details.blog.readingMinutes,
        featuredImageUrl: details.blog.featuredImageUrl || '',
        isPublished: !post.isPublished,
      }

      const response = await fetch(`/api/blog/${post.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        await fetchBlogPosts() // Refresh the list
      } else {
        throw new Error('Failed to update blog post')
      }
    } catch (err) {
      console.error('Error updating blog post:', err)
      setError('Failed to update blog post')
    }
  }

  const handleSavePost = async (formData: FormData) => {
    if (!currentPost) return
    
    try {
      setIsSaving(true)
      setError(null)
      
      const postData = {
        type: formData.get("type") as string,
        readingMinutes: parseInt(formData.get("readingMinutes") as string) || 5,
        featuredImageUrl: formData.get("featuredImageUrl") as string || "",
        isPublished: formData.get("isPublished") === "on",
        translations: translations
      }

      let response: Response
      
      if (currentPost.id) {
        // Update existing post
        const updatePayload = {
          title: translations.en.title,
          content: translations.en.content,
          excerpt: translations.en.excerpt,
          type: postData.type,
          readingMinutes: postData.readingMinutes,
          featuredImageUrl: postData.featuredImageUrl,
          isPublished: postData.isPublished,
        }
        response = await fetch(`/api/blog/${currentPost.slug}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload)
        })
      } else {
        // Create new post
        response = await fetch('/api/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        })
      }

      if (response.ok) {
        await fetchBlogPosts() // Refresh the list
        setIsDialogOpen(false)
        setCurrentPost(null)
        // Reset translations
        setTranslations({
          en: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
          ar: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
          ru: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' }
        })
      } else {
        throw new Error('Failed to save blog post')
      }
    } catch (err) {
      console.error('Error saving blog post:', err)
      setError(err instanceof Error ? err.message : 'Failed to save blog post')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 
                                  language === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  return (
    <ModernDashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        <Button onClick={handleAddPost} className="bg-vl-blue hover:bg-vl-blue-dark">
          <Plus className="mr-2 h-4 w-4" /> Add Blog Post
        </Button>
      </div>

      {error && (
        <div className="bg-transparent text-red border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setError(null)}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className="bg-transparent rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search blog posts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <Loader2 className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-vl-blue"></Loader2>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No blog posts found matching your search' : 'No blog posts available'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="relative h-12 w-16 rounded overflow-hidden">
                        <Image 
                          src={post.featuredImageUrl || "/placeholder.svg?height=48&width=64&text=Blog"} 
                          alt={post.title} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-transparent text-blue-800">{post.type}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          post.isPublished ? "bg-transparent text-green" : "bg-transparent text-red"
                        }`}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublished(post)}
                          className={post.isPublished ? "text-green-500" : "text-gray-400"}
                          title={post.isPublished ? "Unpublish" : "Publish"}
                        >
                          {post.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPost(post)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePost(post)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Blog Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-transparent border-0 shadow-2xl">
          <div className="bg-vl-blue p-6 rounded-lg">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {currentPost?.id ? "Edit Blog Post" : "Add New Blog Post"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {currentPost?.id
                  ? "Update the details of this blog post"
                  : "Fill in the details to add a new blog post"}
              </DialogDescription>
            </DialogHeader>

            <form
              action={(formData) => {
                handleSavePost(formData)
              }}
              className="space-y-6"
            >
              {/* General Blog Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-transparent rounded-lg">
                <div>
                  <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                    Category *
                  </Label>
                  <Select name="type" defaultValue={currentPost?.type || "Market Analysis"}>
                    <SelectTrigger className="mt-1 bg-transparent border-gray-300 focus:border-vl-blue focus:ring-vl-blue">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-transparent border border-gray-300 shadow-lg">
                      {categories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="readingMinutes" className="text-sm font-medium text-gray-700">
                    Reading Time (minutes) *
                  </Label>
                  <Input
                    id="readingMinutes"
                    name="readingMinutes"
                    type="number"
                    min="1"
                    max="60"
                    defaultValue={currentPost?.readingMinutes || 5}
                    required
                    className="mt-1 bg-transparent border-gray-300 focus:border-vl-blue focus:ring-vl-blue"
                  />
                </div>

                <div>
                  <Label htmlFor="featuredImageUrl" className="text-sm font-medium text-gray-700">
                    Featured Image URL
                  </Label>
                  <Input
                    id="featuredImageUrl"
                    name="featuredImageUrl"
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                    placeholder="Enter image URL or upload below"
                    className="mt-1 bg-transparent border-gray-300 focus:border-vl-blue focus:ring-vl-blue"
                  />
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const inputEl = e.target as HTMLInputElement
                        const file = inputEl.files?.[0]
                        if (!file) return
                        setIsUploadingFeatured(true)
                        try {
                          const url = await uploadFeaturedToServer(file)
                          setFeaturedImageUrl(url)
                        } catch (err) {
                          console.error(err)
                        } finally {
                          setIsUploadingFeatured(false)
                          if (inputEl) inputEl.value = ''
                        }
                      }}
                    />
                    {isUploadingFeatured && (
                      <span className="text-sm text-gray-500">Uploading...</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isPublished" name="isPublished" defaultChecked={currentPost?.isPublished} />
                <Label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                  Publish Post
                </Label>
              </div>

              {/* Language Tabs */}
              <Tabs value={activeLanguageTab} onValueChange={setActiveLanguageTab} className="w-full text-white">
                <TabsList className="grid w-full grid-cols-3">
                  {languages.map((lang) => (
                    <TabsTrigger
                      key={lang.code}
                      value={lang.code}
                      className="flex items-center gap-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {languages.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor={`title-${lang.code}`} className="text-sm font-medium text-gray-700">
                          Post Title ({lang.name}) *
                        </Label>
                        <Input
                          id={`title-${lang.code}`}
                          value={translations[lang.code as 'en' | 'ar' | 'ru'].title}
                          onChange={(e) => updateTranslation(lang.code as 'en' | 'ar' | 'ru', 'title', e.target.value)}
                          required={lang.code === 'en'}
                          placeholder={`e.g. ${lang.code === 'ar' ? 'اتجاهات سوق العقارات في دبي' : 
                                           lang.code === 'ru' ? 'Тенденции рынка недвижимости Дубая' : 
                                           'Dubai Real Estate Market Trends'}`}
                          className="mt-1 bg-transparent border-gray-300 focus:border-vl-blue focus:ring-vl-blue"
                          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`excerpt-${lang.code}`} className="text-sm font-medium text-gray-700">
                          Excerpt ({lang.name}) *
                        </Label>
                        <Textarea
                          id={`excerpt-${lang.code}`}
                          value={translations[lang.code as 'en' | 'ar' | 'ru'].excerpt}
                          onChange={(e) => updateTranslation(lang.code as 'en' | 'ar' | 'ru', 'excerpt', e.target.value)}
                          required={lang.code === 'en'}
                          placeholder={`${lang.code === 'ar' ? 'ملخص موجز للمقال...' : 
                                        lang.code === 'ru' ? 'Краткое изложение статьи...' : 
                                        'A brief summary of the post...'}`}
                          rows={3}
                          className="mt-1 bg-transparent border-gray-300 focus:border-vl-blue focus:ring-vl-blue"
                          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`content-${lang.code}`} className="text-sm font-medium text-gray-700">
                          Content ({lang.name}) *
                        </Label>
                        <RichTextEditor
                          value={translations[lang.code as 'en' | 'ar' | 'ru'].content}
                          onChange={(html) => updateTranslation(lang.code as 'en' | 'ar' | 'ru', 'content', html)}
                          placeholder={`${lang.code === 'ar' ? 'اكتب محتوى مقالك هنا...' : 
                                        lang.code === 'ru' ? 'Напишите содержание вашей статьи...' : 
                                         'Write your blog post content...'}`}
                          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`metaTitle-${lang.code}`} className="text-sm font-medium text-gray-700">
                            Meta Title ({lang.name})
                          </Label>
                          <Input
                            id={`metaTitle-${lang.code}`}
                            value={translations[lang.code as 'en' | 'ar' | 'ru'].metaTitle}
                            onChange={(e) => updateTranslation(lang.code as 'en' | 'ar' | 'ru', 'metaTitle', e.target.value)}
                            placeholder={`SEO title (${lang.name})`}
                            className="mt-1 bg-transparent border-gray-300 focus:border-vl-blue focus:ring-vl-blue"
                            dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`metaDescription-${lang.code}`} className="text-sm font-medium text-gray-700">
                            Meta Description ({lang.name})
                          </Label>
                          <Input
                            id={`metaDescription-${lang.code}`}
                            value={translations[lang.code as 'en' | 'ar' | 'ru'].metaDescription}
                            onChange={(e) => updateTranslation(lang.code as 'en' | 'ar' | 'ru', 'metaDescription', e.target.value)}
                            placeholder={`SEO description (${lang.name})`}
                            className="mt-1 bg-transparent border-gray-300 focus:border-vl-blue focus:ring-vl-blue"
                            dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Preview */}
              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-700">Preview (English)</Label>
                <div className="mt-2 border rounded-md p-4 bg-transparent">
                  <div className="relative h-40 w-full rounded-md overflow-hidden mb-2">
                    <Image
                      src={featuredImageUrl || "/placeholder.svg?height=160&width=400&text=Blog+Post"}
                      alt="Blog Post Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900">{translations.en.title || "Blog Post Title"}</h3>
                  <p className="text-sm text-gray-500">
                    {currentPost?.type || "Category"} • {currentPost?.readingMinutes || 5} min read
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{translations.en.excerpt || "Post excerpt..."}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-vl-blue hover:bg-vl-blue-dark text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Blog Post'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-vl-blue border-0 shadow-2xl">
          <div className=" p-6 rounded-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-bold text-gray-900">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete "{currentPost?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeletePost}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModernDashboardLayout>
  )
}
