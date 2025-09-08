"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { Property } from "@/lib/properties-data"

// Add CSS override for Dialog z-index
const dialogOverrideStyles = `
  [data-radix-popper-content-wrapper] {
    z-index: 9999 !important;
  }
  
  [data-state="open"][data-radix-dialog-overlay] {
    z-index: 9998 !important;
  }
  
  [data-state="open"][data-radix-dialog-content] {
    z-index: 9999 !important;
  }
`

interface PropertyContactModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property
}

export default function PropertyContactModal({ isOpen, onClose, property }: PropertyContactModalProps) {
  const { t, isRTL } = useI18n()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    budget: "",
    message: `I'm interested in ${property.title}. Please provide more information.`,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Inject CSS styles to ensure modal appears above navbar
  useEffect(() => {
    if (isOpen) {
      const styleElement = document.createElement('style')
      styleElement.id = 'property-contact-modal-styles'
      styleElement.textContent = dialogOverrideStyles
      document.head.appendChild(styleElement)
      
      return () => {
        const existingStyle = document.getElementById('property-contact-modal-styles')
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setSubmitError(t("contact.validation.required") || "Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      console.log('🚀 Submitting property contact form...');
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        budget: formData.budget,
        message: formData.message,
        source: property.id.toString(), // Property ID as source
      };
      console.log('📝 Request data:', { ...requestData, email: '[REDACTED]' });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('📡 Response status:', response.status);
      const result = await response.json()
      console.log('📥 Response data:', result);

      if (result.success) {
        console.log('✅ Submission successful!');
        setIsSubmitted(true)
        setSubmitError(null)
      } else {
        console.log('❌ Submission failed:', result.error);
        setSubmitError(result.error || 'Failed to send contact message')
      }
    } catch (error) {
      console.error('Error submitting property contact form:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsSubmitted(false)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      budget: "",
      message: `I'm interested in ${property.title}. Please provide more information.`,
    })
    setSubmitError(null)
    onClose()
  }

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className="bg-vl-blue max-w-md rounded-lg z-[9999]" 
          dir={isRTL ? "rtl" : "ltr"}
          style={{ zIndex: 9999 }}
        >
          <div className="text-center p-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-vl-yellow mb-4">
              {t("contact.success.title") || "Message Sent Successfully!"}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t("contact.success.message") ||
                "Thank you for contacting me. I will review your message and get back to you within 24 hours."}
            </p>

            <div className="bg-transparent p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-vl-yellow mb-2">
                {t("contact.success.contact.title") || "Contact Information"}
              </h3>
              <div className="flex items-center justify-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-vl-yellow" />
                <span className="text-gray-700">victoria.lancaster@selectproperty.ae</span>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="bg-vl-yellow hover:bg-vl-yellow-dark text-vl-blue font-semibold"
            >
              {t("common.close") || "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="bg-vl-blue max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg z-[9999]" 
        dir={isRTL ? "rtl" : "ltr"}
        style={{ zIndex: 9999 }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-vl-yellow">
            {t("property.contact") || "Contact About Property"}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {property.title} - {typeof property.price === "number" ? `$${property.price.toLocaleString()}` : property.price}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm  font-medium">
                {t("contact.first.name")} *
              </Label>
              <Input
                id="firstName"
                placeholder={t("contact.first.name.placeholder")}
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="mt-3"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium">
                {t("contact.last.name")} *
              </Label>
              <Input
                id="lastName"
                placeholder={t("contact.last.name.placeholder")}
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                className="mt-3"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              {t("contact.email")} *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("contact.email.placeholder")}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="mt-3"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              {t("contact.phone")}
            </Label>
            <Input
              id="phone"
              placeholder={t("contact.phone.placeholder")}
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-3"
            />
          </div>

          <div>
            <Label htmlFor="budget" className="text-sm font-medium">
              {t("contact.budget")}
            </Label>
            <Input
              id="budget"
              placeholder={t("contact.budget.placeholder")}
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              className="mt-3"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              {t("contact.message")} *
            </Label>
            <Textarea
              id="message"
              placeholder={t("contact.message.placeholder")}
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
              className="mt-3"
            />
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-vl-yellow hover:bg-vl-yellow-dark text-vl-blue font-semibold"
              disabled={
                !formData.firstName || !formData.lastName || !formData.email || !formData.message || isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-vl-blue border-t-transparent mr-2" />
                  {t("common.loading") || "Loading..."}
                </>
              ) : (
                t("contact.send") || "Send Message"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
