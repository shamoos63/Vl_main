"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function ContactForm() {
  const { t, isRTL } = useI18n()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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
      console.log('🚀 Submitting contact form...');
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        budget: formData.budget,
        message: formData.message,
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
      console.error('Error submitting contact form:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="p-8 glass" dir={isRTL ? "rtl" : "ltr"}>
        <CardContent className="p-0 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-vl-yellow mb-4">
            {t("contact.success.title") || "Message Sent Successfully!"}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t("contact.success.message") ||
              "Thank you for contacting me. I will review your message and get back to you within 24 hours."}
          </p>

          <div className="bg-transparent p-6 rounded-lg mb-6 border-0">
            <h3 className="font-semibold text-vl-yellow mb-4">
              {t("contact.success.contact.title") || "Contact Information"}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2 text-vl-yellow" />
                <span className="text-gray-700">victoria.lancaster@selectproperty.ae</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                budget: "",
                message: "",
              })
            }}
            className="bg-vl-yellow hover:bg-vl-yellow-dark text-vl-blue font-semibold border-0 shadow-lg"
          >
            {t("contact.success.new.message") || "Send New Message"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-8 glass" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="text-2xl font-bold text-vl-yellow dark:text-white mb-6">{t("contact.form.title")}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("contact.first.name")} *
            </label>
            <Input 
              placeholder={t("contact.first.name.placeholder")}
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("contact.last.name")} *
            </label>
            <Input 
              placeholder={t("contact.last.name.placeholder")}
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("contact.email")} *
          </label>
          <Input 
            type="email" 
            placeholder={t("contact.email.placeholder")}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("contact.phone")}
          </label>
          <Input 
            placeholder={t("contact.phone.placeholder")}
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("contact.budget")}
          </label>
          <Input 
            placeholder={t("contact.budget.placeholder")}
            value={formData.budget}
            onChange={(e) => handleInputChange("budget", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("contact.message")} *
          </label>
          <Textarea 
            placeholder={t("contact.message.placeholder")} 
            rows={4}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            required
          />
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        )}

        <Button 
          type="submit"
          className="w-full bg-transparent text-white border-2 border-vl-yellow hover:border-black font-semibold py-3"
          disabled={
            !formData.firstName || !formData.lastName || !formData.email || !formData.message || isSubmitting
          }
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              {t("common.loading") || "Loading..."}
            </>
          ) : (
            t("contact.send") || "Send Message"
          )}
        </Button>
      </form>
    </Card>
  )
}
