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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Search, Calendar, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import type { BlogPost, BlogPostSummary } from "@/lib/blog-service"
import RichTextEditor from "@/components/rich-text-editor"

export default function AreasDashboardPage() {
  const { t, language } = useI18n()
  const [areaPosts, setAreaPosts] = useState<BlogPostSummary[]>([])
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
    setFeaturedImageUrl(((currentPost as any)?.featuredImageUrl as string) || "")
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

  // Load area posts from API
  useEffect(() => {
    fetchAreaPosts()
    const action = searchParams.get("action")
    if (action === "new") {
      handleAddPost()
      router.replace("/dashboard/areas")
    }
  }, [searchParams, router, language])

  const fetchAreaPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/blog?language=${language}&type=Area&all=true`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      const allPosts: BlogPostSummary[] = data.blogs || []
      setAreaPosts(allPosts)
    } catch (err) {
      console.error('Error fetching area posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPosts = areaPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    setCurrentPost({
      id: 0,
      slug: '',
      type: 'Area',
      readingMinutes: 5,
      authorName: '',
      featuredImageUrl: '',
      isPublished: false,
      publishedAt: null,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '',
      content: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
    } as any)

    setTranslations({
      en: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
      ar: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
      ru: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' }
    })
    setIsDialogOpen(true)
    setActiveLanguageTab('en')
  }

  const handleEditPost = async (post: BlogPostSummary) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/blog/${post.slug}?language=${language}&includeTranslations=true`)
      if (!res.ok) throw new Error('Failed to load post')
      const data = await res.json()
      setCurrentPost({ ...data.blog })
      setTranslations({
        en: data.translations?.en || { title: data.blog.title, excerpt: data.blog.excerpt || '', content: data.blog.content, metaTitle: data.blog.title, metaDescription: data.blog.excerpt || '' },
        ar: data.translations?.ar || { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
        ru: data.translations?.ru || { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
      })
      setIsDialogOpen(true)
      setActiveLanguageTab('en')
    } catch (err) {
      console.error('Error editing post:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePublish = async (post: BlogPostSummary) => {
    try {
      // Fetch details first to preserve content
      const detailsRes = await fetch(`/api/blog/${post.slug}?language=${language}`)
      const details = await detailsRes.json()

      const payload = {
        title: details.blog.title,
        content: details.blog.content,
        excerpt: details.blog.excerpt || '',
        type: 'Area',
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
      if (!response.ok) throw new Error('Failed to update post')
      await fetchAreaPosts()
    } catch (err) {
      console.error('Error updating post:', err)
      setError('Failed to update post')
    }
  }

  const handleDeletePost = async (post: BlogPostSummary) => {
    try {
      const res = await fetch(`/api/blog/${post.slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchAreaPosts()
    } catch (err) {
      console.error('Error deleting post:', err)
      setError('Failed to delete post')
    } finally {
      setIsDeleteDialogOpen(false)
      setCurrentPost(null)
    }
  }

  const handleSavePost = async (formData: FormData) => {
    if (!currentPost) return
    try {
      setIsSaving(true)
      setError(null)

      const postData = {
        type: 'Area',
        readingMinutes: parseInt(formData.get("readingMinutes") as string) || 5,
        featuredImageUrl: formData.get("featuredImageUrl") as string || "",
        isPublished: formData.get("isPublished") === "on",
        translations: translations
      }

      let response: Response
      if ((currentPost as any).id) {
        const updatePayload = {
          title: translations.en.title,
          content: translations.en.content,
          excerpt: translations.en.excerpt,
          type: 'Area',
          readingMinutes: postData.readingMinutes,
          featuredImageUrl: postData.featuredImageUrl,
          isPublished: postData.isPublished,
        }
        response = await fetch(`/api/blog/${(currentPost as any).slug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        })
      } else {
        response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      }

      if (!response.ok) throw new Error('Failed to save post')
      await fetchAreaPosts()
      setIsDialogOpen(false)
      setCurrentPost(null)
      setTranslations({
        en: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
        ar: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
        ru: { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' }
      })
    } catch (err) {
      console.error('Error saving post:', err)
      setError(err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ModernDashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Areas Articles</h1>
          <p className="text-gray-600">Create and manage Area guides</p>
        </div>
        <Button onClick={handleAddPost} className="bg-vl-blue hover:bg-vl-blue-dark">
          <Plus className="mr-2 h-4 w-4" /> Add Area Article
        </Button>
      </div>

      <div className="bg-transparent rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search area articles..."
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
                <TableHead>Published</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-vl-blue"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No area articles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="relative h-12 w-16 rounded overflow-hidden">
                        <Image
                          src={post.featuredImageUrl || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`inline-flex items-center gap-1 text-sm ${post.isPublished ? 'text-green-600' : 'text-gray-500'}`}
                      >
                        {post.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} {post.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </TableCell>
                    <TableCell>{post.viewCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPost(post)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setCurrentPost(post as any); setIsDeleteDialogOpen(true) }}
                          className="text-red-500 hover:text-red-700"
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

      {/* Add/Edit Area Article Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-transparent border-0 shadow-2xl">
          <div className="bg-vl-blue p-6 rounded-lg">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {(currentPost as any)?.id ? "Edit Area Article" : "Add Area Article"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {(currentPost as any)?.id ? "Update this area guide" : "Create a new area guide with multilingual support"}
              </DialogDescription>
            </DialogHeader>

            <form
              action={(formData) => { handleSavePost(formData) }}
              className="space-y-6"
            >
              {/* General Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-transparent rounded-lg">
                <div className="space-y-4 md:col-span-2">
                  <div>
                    <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
                   
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setIsUploadingFeatured(true)
                          try {
                            const url = await uploadFeaturedToServer(file)
                            setFeaturedImageUrl(url)
                          } catch (err) {
                            console.error(err)
                          } finally {
                            setIsUploadingFeatured(false)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      {isUploadingFeatured && (
                        <span className="text-sm text-gray-500">Uploading...</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="readingMinutes">Reading Minutes</Label>
                    <Input id="readingMinutes" name="readingMinutes" type="number" defaultValue={(currentPost as any)?.readingMinutes || 5} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="isPublished" name="isPublished" defaultChecked={(currentPost as any)?.isPublished} />
                    <Label htmlFor="isPublished">Published</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-md overflow-hidden h-32 bg-white flex items-center justify-center text-sm text-gray-500">
                    {featuredImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featuredImageUrl} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Translations */}
              <div className="p-4 border rounded-lg">
                <Tabs value={activeLanguageTab} onValueChange={setActiveLanguageTab}>
                  <TabsList>
                    <TabsTrigger value="en">EN</TabsTrigger>
                    <TabsTrigger value="ar">AR</TabsTrigger>
                    <TabsTrigger value="ru">RU</TabsTrigger>
                  </TabsList>
                  {(['en','ar','ru'] as const).map((code) => (
                    <TabsContent key={code} value={code} className="space-y-4">
                      <div>
                        <Label>Title ({code.toUpperCase()})</Label>
                        <Input value={translations[code].title} onChange={(e) => updateTranslation(code, 'title', e.target.value)} />
                      </div>
                      <div>
                        <Label>Excerpt ({code.toUpperCase()})</Label>
                        <Input value={translations[code].excerpt} onChange={(e) => updateTranslation(code, 'excerpt', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Meta Title ({code.toUpperCase()})</Label>
                          <Input value={translations[code].metaTitle} onChange={(e) => updateTranslation(code, 'metaTitle', e.target.value)} />
                        </div>
                        <div>
                          <Label>Meta Description ({code.toUpperCase()})</Label>
                          <Input value={translations[code].metaDescription} onChange={(e) => updateTranslation(code, 'metaDescription', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <Label>Content ({code.toUpperCase()})</Label>
                        <RichTextEditor
                          value={translations[code].content}
                          onChange={(html) => updateTranslation(code, 'content', html)}
                          dir={code === 'ar' ? 'rtl' : 'ltr'}
                          className="mt-1"
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-vl-blue hover:bg-vl-blue-dark" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Article
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-transparent border-0 shadow-2xl">
          <div className="bg-transparent p-6 rounded-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-bold text-gray-900">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete "{(currentPost as any)?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => currentPost && handleDeletePost(currentPost as any as BlogPostSummary)}
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


