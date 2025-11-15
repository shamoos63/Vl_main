"use client"

import { useState, useEffect, useRef } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Search, Eye, Star, StarOff, Home, Globe } from "lucide-react"
// Note: Static properties import removed - dashboard now manages properties independently
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Extended property type with image file handling
interface Property {
  id: number
  title: string
  location: string
  price: string | number
  bedrooms: number
  bathrooms: number
  area: string
  image: string
  status: string
  featured: boolean
  homeDisplay?: boolean
  description: string
  videoId?: string
  images?: string[]
  type: string
  features?: string[]
  amenities?: string[]
  yearBuilt?: number
  parkingSpaces?: number
  dldUrl?: string
}

// Translation interface
interface Translation {
  title: string
  description: string
  locationDisplayName: string
  featuresTranslated: string[]
  amenitiesTranslated: string[]
  highlightsTranslated: string[]
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")
  const [activeLanguage, setActiveLanguage] = useState("en")
  const [translations, setTranslations] = useState<Record<string, Translation>>({
    en: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
    ar: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
    ru: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] }
  })
  const [baseFeatures, setBaseFeatures] = useState<string[]>([])
  // Removed base amenities; use translated amenities per language in the Translations tab
  const searchParams = useSearchParams()
  const router = useRouter()

  // Image upload states (cover + gallery)
  const [coverImageUrl, setCoverImageUrl] = useState<string>("")
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const coverFileInputRef = useRef<HTMLInputElement | null>(null)
  const [isStudio, setIsStudio] = useState(false)

  const uploadImageToServer = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append('image', file)
    // Optional: pass a name for readability in imgbb dashboard
    fd.append('name', file.name.replace(/\.[^.]+$/, ''))
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || 'Upload failed')
    }
    const data = await res.json()
    if (!data?.url) {
      throw new Error('Upload did not return a URL')
    }
    return data.url as string
  }

  useEffect(() => {
    // Initialize image states when opening dialog/editing
    if (currentProperty) {
      setCoverImageUrl(currentProperty.image || "")
      setGalleryUrls(Array.isArray(currentProperty.images) ? currentProperty.images : [])
    } else {
      setCoverImageUrl("")
      setGalleryUrls([])
    }
  }, [currentProperty])

  const onCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.target as HTMLInputElement
    const file = inputEl.files?.[0]
    if (!file) return
    setIsUploadingCover(true)
    try {
      const url = await uploadImageToServer(file)
      setCoverImageUrl(url)
      toast({ title: 'Image uploaded', description: 'Cover image is set.' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Upload failed', description: 'Could not upload cover image.', variant: 'destructive' })
    } finally {
      setIsUploadingCover(false)
      if (inputEl) inputEl.value = ''
    }
  }

  const onGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.target as HTMLInputElement
    const files = inputEl.files
    if (!files || files.length === 0) return
    setIsUploadingGallery(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadImageToServer(file)
        uploaded.push(url)
      }
      setGalleryUrls(prev => [...prev, ...uploaded])
      toast({ title: 'Images uploaded', description: `${uploaded.length} image(s) added to gallery.` })
    } catch (err) {
      console.error(err)
      toast({ title: 'Upload failed', description: 'One or more gallery images failed to upload.', variant: 'destructive' })
    } finally {
      setIsUploadingGallery(false)
      if (inputEl) inputEl.value = ''
    }
  }

  const removeGalleryAt = (index: number) => {
    setGalleryUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Load properties from database
  useEffect(() => {
    const fetchProperties = async (page = 1) => {
    setIsLoading(true)
    try {
        const response = await fetch(`/api/properties?page=${page}&limit=10`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setProperties(result.data)
            setTotalPages(result.pagination?.totalPages || 1)
            setTotalCount(result.pagination?.total || result.data?.length || 0)
          } else {
            console.error('Failed to fetch properties:', result.error)
            toast({
              title: "Error",
              description: "Failed to load properties from database",
              variant: "destructive",
            })
          }
      } else {
          console.error('HTTP error:', response.status)
          toast({
            title: "Error",
            description: "Failed to connect to server",
            variant: "destructive",
          })
      }
    } catch (error) {
      console.error("Error loading properties:", error)
        toast({
          title: "Error", 
          description: "Network error while loading properties",
          variant: "destructive",
        })
    }
    setIsLoading(false)
    }

    fetchProperties(currentPage)

    // Check if we should open the add dialog
    const action = searchParams.get("action")
    if (action === "new") {
      handleAddProperty()
      // Clear the URL parameter
      router.replace("/dashboard/properties")
    }
  }, [searchParams, router, currentPage])

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProperty = () => {
    setCurrentProperty({
      id: Date.now(),
      title: "",
      location: "",
      price: "",
      bedrooms: 1,
      bathrooms: 1,
      area: "",
      image: "/placeholder.svg?height=300&width=400&text=Property%20Image",
      status: "For Sale",
      featured: false,
      homeDisplay: false,
      description: "",
      videoId: "",
      images: [],
      type: "Villa",
    })
    setIsStudio(false)
    setBaseFeatures([])
    // amenities handled per language in translations
    
    // Reset translations
    setTranslations({
      en: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
      ar: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
      ru: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] }
    })
    
    setActiveTab("basic")
    setActiveLanguage("en")
    setIsDialogOpen(true)
  }

  const handleEditProperty = async (property: Property) => {
    setCurrentProperty({ ...property })
    setActiveTab("basic")
    setActiveLanguage("en")
    setBaseFeatures(Array.isArray(property.features) ? property.features : [])
    setIsStudio((property.bedrooms ?? 0) === 0)
    // amenities handled per language in translations
    
    // Fetch translations for existing property
    if (property.id) {
      try {
        const response = await fetch(`/api/properties/${property.id}/translations`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setTranslations({
              en: result.data.en || { title: property.title, description: property.description, locationDisplayName: property.location, featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
              ar: result.data.ar || { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
              ru: result.data.ru || { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] }
            })
          }
        }
      } catch (error) {
        console.error("Error fetching translations:", error)
        // Fallback to basic property data
        setTranslations({
          en: { title: property.title, description: property.description, locationDisplayName: property.location, featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
          ar: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
          ru: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] }
        })
      }
    }
    
    setIsDialogOpen(true)
  }

  const handleDeleteProperty = (property: Property) => {
    setCurrentProperty(property)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProperty = async () => {
    if (currentProperty) {
      try {
        const response = await fetch(`/api/properties/${currentProperty.id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
      const updatedProperties = properties.filter((p) => p.id !== currentProperty.id)
      setProperties(updatedProperties)
            toast({
              title: "Success",
              description: "Property deleted successfully",
            })
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to delete property",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to connect to server",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting property:", error)
        toast({
          title: "Error",
          description: "Network error while deleting property",
          variant: "destructive",
        })
      }
      
      setIsDeleteDialogOpen(false)
      setCurrentProperty(null)
    }
  }

  const toggleFeatured = async (id: number) => {
    const property = properties.find((p) => p.id === id)
    if (!property) return

    const newFeaturedStatus = !property.featured

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: newFeaturedStatus
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const updatedProperties = properties.map((prop) =>
            prop.id === id ? { ...prop, featured: newFeaturedStatus } : prop,
          )
          setProperties(updatedProperties)

    // Show toast notification
    toast({
            title: newFeaturedStatus ? "Added to Homepage" : "Removed from Homepage",
            description: newFeaturedStatus
              ? `${property.title} will now appear on the homepage`
              : `${property.title} has been removed from homepage display`,
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update featured status",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating featured status:", error)
      toast({
        title: "Error",
        description: "Network error while updating featured status",
        variant: "destructive",
      })
    }
  }

  const handleSaveProperty = async (formData: FormData) => {
    setIsSaving(true)
    // Enforce English translation required
    const en = translations['en'] || {}
    if (!en.title || !en.description) {
      setIsSaving(false)
      setActiveTab("translations")
      setActiveLanguage("en")
      toast({
        title: "Missing English content",
        description: "English title and description are required.",
        variant: "destructive",
      })
      return
    }
    const propertyData: any = {
      location: formData.get("location") as string,
      price: formData.get("price") as string,
      bedrooms: formData.get("bedrooms") as string,
      bathrooms: formData.get("bathrooms") as string,
      area: formData.get("area") as string,
      image: (formData.get("image") as string) || "/placeholder.svg?height=300&width=400&text=Property%20Image",
      status: formData.get("status") as string,
      featured: formData.get("featured") === "on",
      homeDisplay: formData.get("homeDisplay") === "on",
      videoId: formData.get("videoId") as string,
      type: formData.get("type") as string,
      parkingSpaces: formData.get("parkingSpaces") as string,
      dldUrl: formData.get("dldUrl") as string,
      // base features edited in chips input (amenities managed per-language in translations)
      features: baseFeatures,
      // store raw amenities on properties table using English translation list
      amenities: (translations?.en?.amenitiesTranslated || []),
      // Parse optional comma-separated gallery images to array for API
      ...(formData.get("images")
        ? {
            images: (formData.get("images") as string)
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0),
          }
        : {}),
    }

    // Apply Studio logic (no bedrooms when studio)
    if (isStudio) {
      propertyData.bedrooms = '0'
    }

    // Year of completion -> yearBuilt (preferred if provided)
    const yearBuiltInput = (formData.get("yearBuilt") as string) || ""
    if (yearBuiltInput) {
      const y = parseInt(yearBuiltInput, 10)
      if (!isNaN(y)) {
        propertyData.yearBuilt = String(y)
      }
    } else {
      // Building finished date -> yearBuilt (fallback)
      const buildingFinishedDate = (formData.get("buildingFinishedDate") as string) || ""
      if (buildingFinishedDate) {
        const year = new Date(buildingFinishedDate).getFullYear()
        if (!isNaN(year)) {
          propertyData.yearBuilt = String(year)
        }
      }
    }

    // Ensure uploaded state wins over raw form values
    if (coverImageUrl && typeof coverImageUrl === 'string') {
      propertyData.image = coverImageUrl
    }
    if (Array.isArray(galleryUrls) && galleryUrls.length > 0) {
      propertyData.images = galleryUrls
    }

    try {
      const isEditing = currentProperty && properties.some((p) => p.id === currentProperty.id)
      const url = isEditing ? `/api/properties/${currentProperty.id}` : '/api/properties'
      const method = isEditing ? 'PUT' : 'POST'

      // Include translations in initial create so backend can persist translated amenities/features
      const initialPayload = isEditing ? propertyData : { ...propertyData, translations }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialPayload),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          if (isEditing) {
            // Update existing property in list
            const updatedProperties = properties.map((p) => 
              p.id === currentProperty.id ? result.data : p
            )
            setProperties(updatedProperties)
    } else {
            // Add new property to list
            setProperties([...properties, result.data])
          }

          // Close the dialog ASAP for faster UX
          setIsDialogOpen(false)

          // Save translations in the background (do not block dialog closing)
          if (result.data.id) {
            ;(async () => {
              try {
                const translationsResponse = await fetch(`/api/properties/${result.data.id}/translations`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ translations }),
                })
                if (!translationsResponse.ok) {
                  const t = await translationsResponse.text().catch(() => '')
                  console.error('Failed to save translations', t)
                }
              } catch (error) {
                console.error('Error saving translations:', error)
              }
            })()
          }

          toast({
            title: "Success",
            description: isEditing ? "Property is updating..." : "Property is being created...",
          })

    setCurrentProperty(null)
        } else {
          toast({
            title: "Error",
            description: result.error || `Failed to ${isEditing ? 'update' : 'create'} property`,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving property:", error)
      toast({
        title: "Error",
        description: "Network error while saving property",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <TooltipProvider>
      <ModernDashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Properties Management</h1>
            <p className="text-gray-600">Manage your property listings</p>
          </div>
          <Button onClick={handleAddProperty} className="bg-vl-blue hover:bg-vl-blue-dark">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        </div>

        <div className="bg-transparent rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search properties..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Homepage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-vl-blue"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="relative h-12 w-16 rounded overflow-hidden">
                          <Image
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-transparent text-white rounded-full text-xs">
                          {property.type}
                        </span>
                      </TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{typeof property.price === 'string' ? property.price : `AED ${property.price.toLocaleString()}`}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            property.status === "For Sale" 
                              ? "bg-green text-green-800" 
                              : property.status === "For Rent"
                              ? "bg-blue text-vl-blue-400"
                              : "bg-gray text-gray-800"
                          }`}
                        >
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFeatured(property.id)}
                                className={property.featured ? "text-yellow-500" : "text-gray-400"}
                              >
                                {property.featured ? (
                                  <Star className="h-5 w-5 fill-yellow-500" />
                                ) : (
                                  <StarOff className="h-5 w-5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {property.featured ? "Remove from Homepage" : "Add to Homepage"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/properties/${property.id}`)}
                            className="text-gray-500 hover:text-vl-blue"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProperty(property)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProperty(property)}
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
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} {totalCount ? `(${totalCount} total)` : ''}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Add/Edit Property Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-transparent border-0 shadow-2xl rounded-xl">
            <div className="bg-vl-blue p-6 rounded-xl">
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                  {currentProperty?.id ? "Edit Property" : "Add New Property"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {currentProperty?.id
                        ? "Update property details and translations"
                        : "Create a new property listing with multilingual support"}
                </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
             

              <form
                action={(formData) => {
                  handleSaveProperty(formData)
                }}
                className="space-y-6"
              >
                {/* Hidden ID field */}
                {currentProperty?.id && <input type="hidden" name="id" value={currentProperty.id} />}

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" forceMount className="space-y-6">
                    <div className="bg-transparent rounded-lg p-6 shadow-sm border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Home className="w-5 h-5 text-blue-600" />
                        Property Information
                      </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div></div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                                Property Type *
                              </Label>
                              <Select name="type" defaultValue={currentProperty?.type || "Villa"} onValueChange={(value) => setCurrentProperty(prev => prev ? { ...prev, type: value } : prev)}>
                                <SelectTrigger className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                                <SelectContent className="bg-transparent border border-gray-300 shadow-lg">
                                  <SelectItem value="Villa">Villa</SelectItem>
                                  <SelectItem value="Apartment">Apartment</SelectItem>
                                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                                  
                                </SelectContent>
                              </Select>
                              {/* Ensure type is submitted with the form */}
                              <input type="hidden" name="type" value={currentProperty?.type || "Villa"} />
                            </div>

                            <div>
                              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status *
                              </Label>
                              <Select name="status" defaultValue={currentProperty?.status || "For Sale"} onValueChange={(value) => setCurrentProperty(prev => prev ? { ...prev, status: value } : prev)}>
                                <SelectTrigger className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-transparent border border-gray-300 shadow-lg">
                                  <SelectItem value="For Sale">For Sale</SelectItem>
                                  <SelectItem value="For Rent">For Rent</SelectItem>
                                  <SelectItem value="Sold">Sold</SelectItem>
                                </SelectContent>
                              </Select>
                              {/* Ensure status is submitted with the form */}
                              <input type="hidden" name="status" value={currentProperty?.status || "For Sale"} />
                            </div>
                          </div>

                    <div>
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                        Price *
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        defaultValue={currentProperty?.price}
                        required
                              placeholder="e.g. 1500000"
                              className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                          <div className="grid grid-cols-3 gap-4">
  <div>
    {/* Bedrooms + Studio toggle */}
    <div className="flex items-center justify-between">
      <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">
        Bedrooms *
      </Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="studio"
          checked={isStudio}
          onCheckedChange={(checked) => {
            const val = !!checked
            setIsStudio(val)
            setCurrentProperty(prev =>
              prev ? { ...prev, bedrooms: val ? 0 : (prev.bedrooms || 1) } : prev
            )
          }}
        />
        <Label htmlFor="studio" className="text-sm text-gray-700 cursor-pointer">
          Studio
        </Label>
      </div>
    </div>
    {!isStudio ? (
      <Input
        id="bedrooms"
        name="bedrooms"
        type="number"
        defaultValue={currentProperty?.bedrooms}
        required
        min="0"
        className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
    ) : (
      <>
        <input type="hidden" name="bedrooms" value="0" />
        <div className="mt-1 text-sm text-gray-600">Studio selected (no bedrooms)</div>
      </>
    )}
  </div>
  <div>
                        <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700">
                          Bathrooms *
                        </Label>
                        <Input
                          id="bathrooms"
                          name="bathrooms"
                          type="number"
                          defaultValue={currentProperty?.bathrooms}
                          required
                          min="0"
                                className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    <div>
                      <Label htmlFor="area" className="text-sm font-medium text-gray-700">
                                Area (sq ft) *
                      </Label>
                      <Input
                        id="area"
                        name="area"
                        defaultValue={currentProperty?.area}
                        required
                                placeholder="e.g. 1,200"
                                className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

  {/* Year + Parking — span full width */}
  <div className="col-span-3">
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <Label htmlFor="yearBuilt" className="text-sm font-medium text-gray-700">
          Year of Completion
        </Label>
        <Input
          id="yearBuilt"
          name="yearBuilt"
          type="number"
          defaultValue={currentProperty?.yearBuilt}
          placeholder="e.g. 2021"
          className="mt-1 w-full bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="parkingSpaces" className="text-sm font-medium text-gray-700">
          Parking Slots
        </Label>
        <Input
          id="parkingSpaces"
          name="parkingSpaces"
          type="number"
          defaultValue={currentProperty?.parkingSpaces ?? 0}
          min="0"
          className="mt-1 w-full bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
               
                    </div>                    
                     {/* DLD URL */}
  <div>
                      <Label htmlFor="dldUrl" className="text-sm font-medium text-gray-700">
                        DLD URL
                      </Label>
                      <Input
                        id="dldUrl"
                        name="dldUrl"
                        type="url"
                        defaultValue={currentProperty?.dldUrl}
                        placeholder="https://example.com/dld"
                        className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Will be shown as a QR code on the property page.</p>
                    </div>

  {/* Video ID */}
  <div>
                      <Label htmlFor="videoId" className="text-sm font-medium text-gray-700">
                        YouTube Video ID
                      </Label>
                      <Input
                        id="videoId"
                        name="videoId"
                        defaultValue={currentProperty?.videoId}
                        placeholder="e.g. dQw4w9WgXcQ"
                              className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>    
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                        Main Image
                      </Label>
                     
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          ref={coverFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={onCoverFileChange}
                          className="hidden"
                        />
                        <Button type="button" variant="outline" onClick={() => coverFileInputRef.current?.click()}>
                          {coverImageUrl ? "Change cover" : "Upload cover"}
                        </Button>
                        {isUploadingCover && (
                          <span className="text-sm text-gray-500">Uploading...</span>
                        )}
                      </div>
                      {coverImageUrl && (
                        <div className="mt-2 border rounded-md overflow-hidden h-28 bg-white flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={coverImageUrl} alt="cover preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="images" className="text-sm font-medium text-gray-700">
                        Gallery Images (Upload multiple)
                      </Label>
                    
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={onGalleryFilesChange}
                        />
                        {isUploadingGallery && (
                          <span className="text-sm text-gray-500">Uploading...</span>
                        )}
                      </div>
                      {galleryUrls.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {galleryUrls.map((url, idx) => (
                            <div key={`${url}-${idx}`} className="relative group border rounded-md overflow-hidden h-24 bg-white">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`gallery-${idx}`} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeGalleryAt(idx)}
                                className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full w-6 h-6 flex items-center justify-center opacity-90 group-hover:opacity-100"
                                aria-label="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                   

                   

                    <div></div>

                          {/* Amenities managed per language in the Translations tab */}

                          <div className="flex items-center space-x-3 p-3 bg-transparent border border-yellow-200 rounded-lg">
                            <Checkbox id="featured" name="featured" defaultChecked={currentProperty?.featured} onCheckedChange={(checked) => setCurrentProperty(prev => prev ? { ...prev, featured: !!checked } : prev)} />
                            {/* Ensure featured is submitted with the form */}
                            <input type="hidden" name="featured" value={currentProperty?.featured ? 'on' : ''} />
                            <div>
                              <Label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Featured Property
                              </Label>
                              <p className="text-xs text-gray-500">Display prominently on the homepage</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Translations Tab */}
                  <TabsContent value="translations" forceMount className="space-y-6">
                    {isSaving && (
                      <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm mb-2">
                        Property is updating... This may take a few seconds.
                      </div>
                    )}
                    <div className="bg-transparent rounded-lg p-6 shadow-sm border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          Multilingual Content
                        </h3>
                        <div className="flex gap-2">
                          {["en", "ar", "ru"].map((lang) => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => setActiveLanguage(lang)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                activeLanguage === lang
                                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {lang.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            * Title ({activeLanguage.toUpperCase()})
                          </Label>
                          <Input
                            value={translations[activeLanguage]?.title || ""}
                            onChange={(e) => setTranslations(prev => ({
                              ...prev,
                              [activeLanguage]: { ...prev[activeLanguage], title: e.target.value }
                            }))}
                            onKeyDown={(e) => {
                              if (e.key === ',') {
                                // Prevent accidental comma insertion
                                e.preventDefault()
                              }
                            }}
                            placeholder={`Property title in ${activeLanguage.toUpperCase()}`}
                            className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Location Display Name ({activeLanguage.toUpperCase()})
                          </Label>
                          <Input
                            value={translations[activeLanguage]?.locationDisplayName || ""}
                            onChange={(e) => setTranslations(prev => ({
                              ...prev,
                              [activeLanguage]: { ...prev[activeLanguage], locationDisplayName: e.target.value }
                            }))}
                            onKeyDown={(e) => {
                              if (e.key === ',') {
                                e.preventDefault()
                              }
                            }}
                            placeholder={`Location name in ${activeLanguage.toUpperCase()}`}
                            className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                         *   Description ({activeLanguage.toUpperCase()})
                          </Label>
                          <Textarea
                            value={translations[activeLanguage]?.description || ""}
                            onChange={(e) => setTranslations(prev => ({
                              ...prev,
                              [activeLanguage]: { ...prev[activeLanguage], description: e.target.value }
                            }))}
                            placeholder={`Property description in ${activeLanguage.toUpperCase()}`}
                            rows={4}
                            className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Amenities ({activeLanguage.toUpperCase()})
                          </Label>
                          <div className="mt-1 flex flex-wrap gap-2 p-2 border rounded-md bg-transparent">
                            {(translations[activeLanguage]?.amenitiesTranslated || []).map((amenity, idx) => (
                              <span key={`${amenity}-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {amenity}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTranslations(prev => {
                                      const next = { ...prev }
                                      const list = (next[activeLanguage]?.amenitiesTranslated || []).slice()
                                      list.splice(idx, 1)
                                      next[activeLanguage] = { ...next[activeLanguage], amenitiesTranslated: list }
                                      return next
                                    })
                                  }}
                                  className="ml-1 text-blue-700 hover:text-blue-900"
                                  aria-label="Remove amenity"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                  e.preventDefault()
                                  const target = e.target as HTMLInputElement
                                  const raw = target.value
                                  const candidates = raw
                                    .split(',')
                                    .map(s => s.trim())
                                    .filter(Boolean)
                                  if (candidates.length > 0) {
                                    setTranslations(prev => ({
                                      ...prev,
                                      [activeLanguage]: {
                                        ...prev[activeLanguage],
                                        amenitiesTranslated: [
                                          ...(prev[activeLanguage]?.amenitiesTranslated || []),
                                          ...candidates
                                        ]
                                      }
                                    }))
                                    target.value = ''
                                  }
                                }
                              }}
                              placeholder={`Type an amenity and press Enter`}
                              className="flex-1 min-w-[150px] bg-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200 bg-transparent  p-4 rounded-lg">
                    <div className="text-sm text-gray-500">
                      * Required fields
                  </div>
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className="bg-transparent hover:bg-gray-50"
                      >
                    Cancel
                  </Button>
                      <Button 
                        type="submit" 
                        disabled={isSaving}
                        className={`text-white shadow-lg ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'}`}
                      >
                        {isSaving ? "Updating..." : currentProperty?.id ? "Update Property" : "Create Property"}
                  </Button>
                    </div>
                </div>
              </form>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog - Fixed Styling */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-transparent border-0 shadow-2xl">
            <div className="bg-transparent p-6 rounded-lg">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg font-bold text-gray-900">Confirm Deletion</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Are you sure you want to delete "{currentProperty?.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteProperty}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </ModernDashboardLayout>
    </TooltipProvider>
  )
}
