"use client"

import { useState, useEffect } from "react"
import ModernDashboardLayout from "@/components/dashboard/modern-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Trash2, Calendar, Mail, Phone, MessageSquare, User, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Contact request interface
interface ContactRequest {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  type: "general" | "evaluation" | "welcome"
  date: string | number | Date
  status: "new" | "read" | "replied"
  _source: 'contact' | 'welcome'
}

// No mock contact requests; data will be fetched from API

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Load contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== 'all') params.set('status', statusFilter)
        if (typeFilter !== 'all') params.set('type', typeFilter)
        if (searchTerm) params.set('search', searchTerm)
        const res = await fetch(`/api/contacts?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch contacts')
        const data = await res.json()
        setContacts(data.contacts || [])
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContacts()
  }, [statusFilter, typeFilter, searchTerm])

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    const matchesType = typeFilter === "all" || contact.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewContact = (contact: ContactRequest) => {
    setSelectedContact(contact)
    setIsViewDialogOpen(true)

    // Mark as read if it's new
    if (contact.status === "new") {
      updateContactStatus(contact.id, "read", contact._source)
    }
  }

  const handleDeleteContact = (contact: ContactRequest) => {
    setSelectedContact(contact)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteContact = async () => {
    if (!selectedContact) return
    try {
      const res = await fetch(`/api/contacts/${selectedContact.id}?source=${selectedContact._source}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete contact')
      setContacts(prev => prev.filter(c => c.id !== selectedContact.id))
      setIsDeleteDialogOpen(false)
      setSelectedContact(null)
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const updateContactStatus = async (id: number, status: "new" | "read" | "replied", source: 'contact' | 'welcome') => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, source })
      })
      if (!res.ok) throw new Error('Failed to update status')
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c))
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, status })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-red text-red-800">New</Badge>
      case "read":
        return <Badge className="bg-yellow text-yellow-800">Read</Badge>
      case "replied":
        return <Badge className="bg-green text-green-800">Replied</Badge>
      default:
        return <Badge className="bg-gray text-gray-800">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "general":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            General
          </Badge>
        )
      case "property":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            Property
          </Badge>
        )
      case "evaluation":
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            Evaluation
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const formatDate = (dateVal: string | number | Date) => {
    const d = dateVal instanceof Date ? dateVal : new Date(dateVal)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const newContactsCount = contacts.filter((c) => c.status === "new").length

  return (
    <ModernDashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Requests</h1>
          <p className="text-gray-600">
            Manage customer inquiries and messages
            {newContactsCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red text-vl-yellow text-xs rounded-full">
                {newContactsCount} new
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
                placeholder="Search contacts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="evaluation">Evaluation</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message Preview</TableHead>
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
                      <Loader2 className="h-6 w-6 animate-spin text-vl-blue" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No contact requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getTypeBadge(contact.type)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">
                        <MessageSquare className="h-3 w-3 inline mr-1 text-gray-500" />
                        {contact.message}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(contact.date)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewContact(contact)}
                          className="text-blue-500 hover:text-blue-700 bg-vl-blue-dark"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteContact(contact)}
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

      {/* View Contact Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Contact Request Details</DialogTitle>
            <DialogDescription>View and manage this contact request</DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{selectedContact.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 ml-3 mr-2 text-gray-500" />
                      <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Request Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Type:</span>
                      {getTypeBadge(selectedContact.type)}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Status:</span>
                      {getStatusBadge(selectedContact.status)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{formatDate(selectedContact.date)}</span>
                    </div>
                    {/* No linked property field in normalized contacts */}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                <div className="bg-transparent p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{selectedContact.message}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-black"
                    onClick={() => updateContactStatus(selectedContact.id, "read", selectedContact._source)}
                    disabled={selectedContact.status === "read"}
                  >
                    Mark as Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-black"
                    onClick={() => updateContactStatus(selectedContact.id, "replied", selectedContact._source)}
                    disabled={selectedContact.status === "replied"}
                  >
                    Mark as Replied
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button
                    className="bg-vl-blue hover:bg-vl-blue-dark"
                    onClick={() => window.open(`mailto:${selectedContact.email}`, "_blank")}
                  >
                    Reply via Email
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
              Are you sure you want to delete this contact request from "{selectedContact?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteContact}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ModernDashboardLayout>
  )
}
