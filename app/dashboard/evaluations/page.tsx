"use client"

import { useState, useEffect } from "react"
import ModernDashboardLayout from "@/components/dashboard/modern-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Trash2, Calendar, Mail, Phone, Home, MapPin, User, Loader2 } from "lucide-react"

// Property evaluation interface
interface PropertyEvaluation {
  id: number
  contactName: string
  contactEmail: string
  contactPhoneNumber?: string
  propertyType: string
  propertyLocation: string
  bedrooms: number
  bathrooms: number
  squareArea: number
  condition: string
  yearBuilt?: number
  amenities?: string
  additionalDetails?: string
  status: "pending" | "in_review" | "completed"
  createdAt: string | number | Date
}

// No mock data; fetched from API

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<PropertyEvaluation[]>([])
  const [selectedEvaluation, setSelectedEvaluation] = useState<PropertyEvaluation | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Load evaluations from API
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== 'all') params.set('status', statusFilter)
        if (searchTerm) params.set('search', searchTerm)
        const res = await fetch(`/api/evaluation?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch evaluations')
        const data = await res.json()
        setEvaluations(data.evaluations || [])
      } catch (error) {
        console.error('Error loading evaluations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvaluations()
  }, [statusFilter, searchTerm])

  const filteredEvaluations = evaluations

  const handleViewEvaluation = (evaluation: PropertyEvaluation) => {
    setSelectedEvaluation(evaluation)
    setIsViewDialogOpen(true)

    // Mark as in_review if it's pending
    if (evaluation.status === "pending") {
      updateEvaluationStatus(evaluation.id, "in_review")
    }
  }

  const handleDeleteEvaluation = (evaluation: PropertyEvaluation) => {
    setSelectedEvaluation(evaluation)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteEvaluation = async () => {
    if (!selectedEvaluation) return
    try {
      const res = await fetch(`/api/evaluation/${selectedEvaluation.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete evaluation')
      setEvaluations(prev => prev.filter(e => e.id !== selectedEvaluation.id))
      setIsDeleteDialogOpen(false)
      setSelectedEvaluation(null)
    } catch (error) {
      console.error('Error deleting evaluation:', error)
    }
  }

  const updateEvaluationStatus = async (id: number, status: "pending" | "in_review" | "completed") => {
    try {
      const res = await fetch(`/api/evaluation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Failed to update status')
      setEvaluations(prev => prev.map(ev => ev.id === id ? { ...ev, status } : ev))
      if (selectedEvaluation && selectedEvaluation.id === id) {
        setSelectedEvaluation({ ...selectedEvaluation, status })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-red-100 text-red-800">New</Badge>
      case "in_review":
        return <Badge className="bg-yellow-100 text-yellow-800">In Review</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getPropertyTypeBadge = (type: string) => {
    const typeMap: { [key: string]: string } = {
      apartment: "Apartment",
      villa: "Villa",
      townhouse: "Townhouse",
      penthouse: "Penthouse",
    }
    return (
      <Badge variant="outline" className="text-blue-600 border-blue-200">
        {typeMap[type] || type}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const newEvaluationsCount = evaluations.filter((e) => e.status === "pending").length

  return (
    <ModernDashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Property Evaluations</h1>
          <p className="text-gray-600">
            Manage property evaluation requests
            {newEvaluationsCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red text-red text-xs rounded-full">
                {newEvaluationsCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search evaluations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 bg-transparent">
              <select
                className="px-3 py-2 border bg-transparent rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Property Details</TableHead>
                <TableHead>Location</TableHead>
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
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-vl-blue"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No property evaluations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id} className={evaluation.status === "pending" ? "bg-transparent text-blue" : ""}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          {evaluation.contactName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {evaluation.contactEmail}
                        </div>
                        {evaluation.contactPhoneNumber && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {evaluation.contactPhoneNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getPropertyTypeBadge(evaluation.propertyType)}
                        <div className="text-sm text-gray-500 flex items-center">
                          <Home className="h-3 w-3 mr-1" />
                          {evaluation.bedrooms} bed • {evaluation.bathrooms} bath • {evaluation.squareArea} sq ft
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                        {evaluation.propertyLocation}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(evaluation.createdAt as any)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewEvaluation(evaluation)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvaluation(evaluation)}
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

      {/* View Evaluation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Property Evaluation Details</DialogTitle>
            <DialogDescription>View and manage this property evaluation request</DialogDescription>
          </DialogHeader>

          {selectedEvaluation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{selectedEvaluation.contactName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`mailto:${selectedEvaluation.contactEmail}`} className="text-blue-600 hover:underline">
                        {selectedEvaluation.contactEmail}
                      </a>
                    </div>
                    {selectedEvaluation.contactPhoneNumber && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={`tel:${selectedEvaluation.contactPhoneNumber}`} className="text-blue-600 hover:underline">
                          {selectedEvaluation.contactPhoneNumber}
                        </a>
                      </div>
                    )}
                  </div>

                  <h3 className="font-medium text-gray-900 mb-3 mt-6">Request Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Status:</span>
                      {getStatusBadge(selectedEvaluation.status)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{formatDate(selectedEvaluation.createdAt as any)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Property Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="mt-1">{getPropertyTypeBadge(selectedEvaluation.propertyType)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Condition:</span>
                        <div className="mt-1 capitalize">{selectedEvaluation.condition}</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Location:</span>
                      <div className="mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                        {selectedEvaluation.propertyLocation}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-500">Bedrooms:</span>
                        <div className="mt-1 font-medium">{selectedEvaluation.bedrooms}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Bathrooms:</span>
                        <div className="mt-1 font-medium">{selectedEvaluation.bathrooms}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Area:</span>
                        <div className="mt-1 font-medium">{selectedEvaluation.squareArea} sq ft</div>
                      </div>
                    </div>

                    {selectedEvaluation.yearBuilt && (
                      <div>
                        <span className="text-gray-500">Year Built:</span>
                        <div className="mt-1">{selectedEvaluation.yearBuilt}</div>
                      </div>
                    )}

                    {selectedEvaluation.amenities && (
                      <div>
                        <span className="text-gray-500">Amenities:</span>
                        <div className="mt-1">{selectedEvaluation.amenities}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvaluation.additionalDetails && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Additional Details</h3>
                  <div className="bg-transparent p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{selectedEvaluation.additionalDetails}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateEvaluationStatus(selectedEvaluation.id, "in_review")}
                    disabled={selectedEvaluation.status === "in_review" || selectedEvaluation.status === "completed"}
                  >
                    Mark as Reviewed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateEvaluationStatus(selectedEvaluation.id, "completed")}
                    disabled={selectedEvaluation.status === "completed"}
                  >
                    Mark as Completed
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button
                    className="bg-vl-blue hover:bg-vl-blue-dark"
                    onClick={() => window.open(`mailto:${selectedEvaluation.contactEmail}`, "_blank")}
                  >
                    Send Evaluation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property evaluation request from "{selectedEvaluation?.contactName}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEvaluation}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ModernDashboardLayout>
  )
}
