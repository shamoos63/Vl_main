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
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")
  const [activeLanguage, setActiveLanguage] = useState("en")
  const [translations, setTranslations] = useState<Record<string, Translation>>({
    en: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
    ar: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] },
    ru: { title: "", description: "", locationDisplayName: "", featuresTranslated: [], amenitiesTranslated: [], highlightsTranslated: [] }
  })
  const searchParams = useSearchParams()
  const router = useRouter()

  // Load properties from database
  useEffect(() => {
    const fetchProperties = async () => {
    setIsLoading(true)
    try {
        const response = await fetch('/api/properties')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setProperties(result.data)
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

    fetchProperties()

    // Check if we should open the add dialog
    const action = searchParams.get("action")
    if (action === "new") {
      handleAddProperty()
      // Clear the URL parameter
      router.replace("/dashboard/properties")
    }
  }, [searchParams, router])

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
    const propertyData = {
      title: formData.get("title") as string,
      location: formData.get("location") as string,
      price: formData.get("price") as string,
      bedrooms: formData.get("bedrooms") as string,
      bathrooms: formData.get("bathrooms") as string,
      area: formData.get("area") as string,
      image: (formData.get("image") as string) || "/placeholder.svg?height=300&width=400&text=Property%20Image",
      status: formData.get("status") as string,
      featured: formData.get("featured") === "on",
      homeDisplay: formData.get("homeDisplay") === "on",
      description: formData.get("description") as string,
      videoId: formData.get("videoId") as string,
      type: formData.get("type") as string,
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

    try {
      const isEditing = currentProperty && properties.some((p) => p.id === currentProperty.id)
      const url = isEditing ? `/api/properties/${currentProperty.id}` : '/api/properties'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
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

          // Save translations
          if (result.data.id) {
            try {
              const translationsResponse = await fetch(`/api/properties/${result.data.id}/translations`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ translations }),
              })
              
              if (!translationsResponse.ok) {
                console.error('Failed to save translations')
              }
            } catch (error) {
              console.error('Error saving translations:', error)
            }
          }

          toast({
            title: "Success",
            description: `Property ${isEditing ? 'updated' : 'created'} successfully`,
          })

    setIsDialogOpen(false)
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
                        <span className="px-2 py-1 bg-transparent text-blue-800 rounded-full text-xs">
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
                              ? "bg-blue text-blue-800"
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
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="translations" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Translations
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

              <form
                action={(formData) => {
                  handleSaveProperty(formData)
                }}
                className="space-y-6"
              >
                {/* Hidden ID field */}
                {currentProperty?.id && <input type="hidden" name="id" value={currentProperty.id} />}

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    <div className="bg-transparent rounded-lg p-6 shadow-sm border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Home className="w-5 h-5 text-blue-600" />
                        Property Information
                      </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Property Title *
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={currentProperty?.title}
                        required
                        placeholder="e.g. Luxury Villa in Dubai Marina"
                              className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                        Location *
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        defaultValue={currentProperty?.location}
                        required
                        placeholder="e.g. Dubai Marina"
                              className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                                Property Type *
                              </Label>
                              <Select name="type" defaultValue={currentProperty?.type || "Villa"}>
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
                            </div>

                            <div>
                              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status *
                              </Label>
                              <Select name="status" defaultValue={currentProperty?.status || "For Sale"}>
                                <SelectTrigger className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-transparent border border-gray-300 shadow-lg">
                                  <SelectItem value="For Sale">For Sale</SelectItem>
                                  <SelectItem value="For Rent">For Rent</SelectItem>
                                  <SelectItem value="Sold">Sold</SelectItem>
                                </SelectContent>
                              </Select>
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
                        <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">
                          Bedrooms *
                        </Label>
                        <Input
                          id="bedrooms"
                          name="bedrooms"
                          type="number"
                          defaultValue={currentProperty?.bedrooms}
                          required
                          min="0"
                                className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
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
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                              Main Image URL
                      </Label>
                      <Input
                        id="image"
                        name="image"
                        defaultValue={currentProperty?.image}
                        placeholder="Enter image URL or leave blank for placeholder"
                              className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="images" className="text-sm font-medium text-gray-700">
                        Gallery Image URLs (comma-separated)
                      </Label>
                      <Input
                        id="images"
                        name="images"
                        defaultValue={(currentProperty?.images || []).join(", ")}
                        placeholder="https://.../1.jpg, https://.../2.jpg"
                        className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

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

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={currentProperty?.description}
                        required
                        placeholder="Describe the property..."
                              rows={4}
                              className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex items-center space-x-3 p-3 bg-transparent border border-yellow-200 rounded-lg">
                            <Checkbox id="featured" name="featured" defaultChecked={currentProperty?.featured} />
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
                  <TabsContent value="translations" className="space-y-6">
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
                            Title ({activeLanguage.toUpperCase()})
                          </Label>
                          <Input
                            value={translations[activeLanguage]?.title || ""}
                            onChange={(e) => setTranslations(prev => ({
                              ...prev,
                              [activeLanguage]: { ...prev[activeLanguage], title: e.target.value }
                            }))}
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
                            placeholder={`Location name in ${activeLanguage.toUpperCase()}`}
                            className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Description ({activeLanguage.toUpperCase()})
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
                            Amenities ({activeLanguage.toUpperCase()}) – comma-separated
                          </Label>
                          <Input
                            value={(translations[activeLanguage]?.amenitiesTranslated || []).join(", ")}
                            onChange={(e) => {
                              const values = e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s.length > 0)
                              setTranslations(prev => ({
                                ...prev,
                                [activeLanguage]: { ...prev[activeLanguage], amenitiesTranslated: values }
                              }))
                            }}
                            placeholder={`e.g. Pool, Gym, Parking in ${activeLanguage.toUpperCase()}`}
                            className="mt-1 bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Preview Tab */}
                  <TabsContent value="preview" className="space-y-6">
                    <div className="bg-transparent rounded-lg p-6 shadow-sm border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        Property Preview
                      </h3>
                      
                      <div className="max-w-md mx-auto bg-transparent border border-gray-200 rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-48 w-full">
                          <Image
                            src={currentProperty?.image || "/placeholder.svg"}
                            alt="Property Preview"
                            fill
                            className="object-cover"
                          />
                          {currentProperty?.featured && (
                            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md text-xs font-medium">
                              Featured
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {currentProperty?.type || "Villa"}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              currentProperty?.status === "For Sale" 
                                ? "bg-green-100 text-green-800" 
                                : currentProperty?.status === "For Rent"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {currentProperty?.status || "For Sale"}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {currentProperty?.title || "Property Title"}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {currentProperty?.location || "Location"}
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {typeof currentProperty?.price === 'string' 
                              ? currentProperty.price 
                              : currentProperty?.price 
                              ? `AED ${currentProperty.price.toLocaleString()}`
                              : "AED 0"
                            }
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span>{currentProperty?.bedrooms || 0} beds</span>
                            <span>{currentProperty?.bathrooms || 0} baths</span>
                            <span>{currentProperty?.area || "0 sq ft"}</span>
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
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                      >
                        {currentProperty?.id ? "Update Property" : "Create Property"}
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
