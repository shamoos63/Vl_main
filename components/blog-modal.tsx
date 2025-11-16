"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, User, Eye, Clock, X, Share2, Facebook, Twitter, Link, ArrowRight, Copy } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import type { BlogPost, BlogPostSummary } from '@/lib/blog-service'

interface BlogModalProps {
  blog: BlogPost | null
  isOpen: boolean
  onClose: () => void
}

export default function BlogModal({ blog, isOpen, onClose }: BlogModalProps) {
  const { t, language, isRTL } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [viewCount, setViewCount] = useState<number>(0)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPostSummary[]>([])
  const [isLoadingRelated, setIsLoadingRelated] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)

  // Auto-detect language from the current website language
  const currentLanguage = language

  useEffect(() => {
    if (isOpen && blog) {
      // Set initial view count
      setViewCount(blog.viewCount)
      
      // Increment view count when modal opens
      incrementViewCount(blog.id)
      
      // Fetch related blogs
      fetchRelatedBlogs(blog.slug)
    }
  }, [isOpen, blog])

  // Close share options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareOptions) {
        setShowShareOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareOptions])

  const incrementViewCount = async (blogId: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/blog/${blog?.slug}?increment=true&language=${currentLanguage}`, {
        method: 'GET',
      })
      
      if (response.ok) {
        // Update local view count
        setViewCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error incrementing view count:', error)
      // Don't show error to user, just log it
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedBlogs = async (slug: string) => {
    try {
      setIsLoadingRelated(true)
      const response = await fetch(`/api/blog/${slug}?related=true&language=${currentLanguage}`)
      if (response.ok) {
        const data = await response.json()
        setRelatedBlogs(data.relatedBlogs || [])
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error)
    } finally {
      setIsLoadingRelated(false)
    }
  }

  const handleReadRelated = (relatedBlog: BlogPostSummary) => {
    // Close current modal and open new one with related blog
    onClose()
    // You could implement a callback to open the related blog
    // For now, we'll just close the modal
  }

  const handleShare = (platform: string) => {
    if (!blog) return

    const url = window.location.origin + `/blog/${blog.slug}`
    const title = blog.title
    const text = blog.excerpt || ''

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setShareSuccess(true)
          setTimeout(() => setShareSuccess(false), 2000)
        })
        break
    }
    
    setShowShareOptions(false)
  }

  if (!blog) return null

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

      return new Intl.DateTimeFormat(currentLanguage === 'ar' ? 'ar-SA' : 
                                    currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      console.warn('Invalid date format:', date, error);
      return '';
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-vl-blue overflow-y-auto animate-in zoom-in-95 duration-300 z-[9999]"  dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-vl-yellow">
              {blog.title}
            </DialogTitle>
                          <div className="flex items-center gap-2">
                {/* Share Button */}
                <div className="relative">
               
                  {/* Share Options Dropdown */}
                  {showShareOptions && (
                    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] min-w-[200px] animate-in slide-in-from-top-2 duration-200 transform translate-y-0">
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare('facebook')}
                          className="w-full justify-start text-left hover:bg-blue-50 transition-colors"
                        >
                          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                          {t('blog.modal.share.facebook')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare('twitter')}
                          className="w-full justify-start text-left hover:bg-blue-50 transition-colors"
                        >
                          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                          {t('blog.modal.share.twitter')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare('linkedin')}
                          className="w-full justify-start text-left hover:bg-blue-50 transition-colors"
                        >
                          <Link className="h-4 w-4 mr-2 text-blue-700" />
                          {t('blog.modal.share.linkedin')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare('copy')}
                          className="w-full justify-start text-left hover:bg-blue-50 transition-colors"
                        >
                          <Copy className="h-4 w-4 mr-2 text-gray-600" />
                          {t('blog.modal.share.copy')}
                        </Button>
                        {shareSuccess && (
                          <div className="text-green-600 text-xs p-2 animate-in fade-in duration-200">
                            {t('blog.modal.share.success')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
             
              </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured Image */}
          {blog.featuredImageUrl && (
            <div className="w-full rounded-lg">
              <img
                src={blog.featuredImageUrl}
                alt={blog.title}
                className="max-w-full h-auto mx-auto"
              />
            </div>
          )}

          {/* Blog Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-vl-yellow" />
              <span>{t('blog.modal.author')} {blog.authorName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-vl-yellow" />
              <span>{t('blog.modal.published')} {formatDate(blog.publishedAt)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-vl-yellow" />
              <span>{blog.readingMinutes} {t('blog.modal.reading.time')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-vl-yellow" />
              <span>{viewCount} {t('blog.modal.views')}</span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge className="bg-vl-yellow text-vl-blue">
              {blog.type}
            </Badge>
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none animate-in fade-in duration-500">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vl-yellow"></div>
                <span className="ml-3 text-gray-300">{t('blog.modal.loading')}</span>
              </div>
            ) : (
              <>
                <div 
                  className="text-gray-200 leading-relaxed content-html"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                <style jsx>{`
                  .content-html img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 1rem auto;
                  }
                  .content-html p { margin: 0.75rem 0; }
                `}</style>
              </>
            )}
          </div>

          {/* Related Blog Posts */}
          {relatedBlogs.length > 0 && (
            <div className="border-t border-gray-600 pt-6 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-vl-yellow mb-4">{t('blog.related.posts')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedBlogs.map((relatedBlog, index) => (
                  <Card 
                    key={relatedBlog.id} 
                    className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer animate-in fade-in-50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Badge className="bg-vl-yellow text-vl-blue text-xs">
                          {relatedBlog.type}
                        </Badge>
                        <h4 className="font-semibold text-gray-800 line-clamp-2">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{relatedBlog.readingMinutes} {t('blog.modal.reading.time')}</span>
                          <span>{formatDate(relatedBlog.publishedAt)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReadRelated(relatedBlog)}
                          className="w-full text-vl-yellow hover:text-vl-blue hover:bg-vl-yellow/10"
                        >
                          {t("blog.read.more")}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-600">
            <div className="text-sm text-gray-300">
              {t('blog.last.updated')}: {formatDate(blog.updatedAt)}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="border-vl-yellow text-vl-yellow hover:bg-vl-yellow hover:text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t('blog.share')}
              </Button>
              
              <Button
                onClick={onClose}
                className="bg-vl-yellow hover:bg-vl-yellow/90 text-vl-blue font-semibold"
              >
                {t('common.close')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
