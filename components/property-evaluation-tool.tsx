"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calculator, CheckCircle, Phone, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function PropertyEvaluationTool() {
  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    condition: "",
    amenities: "",
    yearBuilt: "",
    description: "",
    name: "",
    email: "",
    phone: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { t, isRTL } = useI18n()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.propertyType || !formData.location || !formData.area || !formData.name || !formData.email) {
      setSubmitError(t("evaluation.validation.required") || "Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      console.log('🚀 Submitting evaluation form...');
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        propertyType: formData.propertyType,
        location: formData.location,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        condition: formData.condition,
        yearBuilt: formData.yearBuilt,
        amenities: formData.amenities,
        description: formData.description,
      };
      console.log('📝 Request data:', { ...requestData, email: '[REDACTED]' });

      const response = await fetch('/api/evaluation', {
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
        setSubmitError(result.error || 'Failed to submit evaluation request')
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto px-1 pb-4 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-2xl mx-auto text-center pt-8">
          <Card className="p-8 glass border-0 shadow-2xl">
            <CardContent className="p-0">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-vl-yellow mb-4">
                {t("evaluation.success.title") || "Evaluation Submitted Successfully!"}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t("evaluation.success.message") ||
                  "Thank you for submitting your property evaluation request. Our expert team will review your property details and contact you within 24 hours with a comprehensive market analysis."}
              </p>

              <div className="bg-transparent p-6 rounded-lg mb-6 border-0">
                <h3 className="font-semibold text-vl-yellow !important mb-4">
                  {t("evaluation.success.contact.title") || "Contact Information"}
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
                    propertyType: "",
                    location: "",
                    bedrooms: "",
                    bathrooms: "",
                    area: "",
                    condition: "",
                    amenities: "",
                    yearBuilt: "",
                    description: "",
                    name: "",
                    email: "",
                    phone: "",
                  })

                }}
                className="bg-vl-yellow hover:bg-vl-yellow-dark text-vl-blue font-semibold border-0 shadow-lg"
              >
                {t("evaluation.success.new.evaluation") || "Submit New Evaluation"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 pb-20 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto pt-8">
        <Card className="glass border-0 shadow-2xl">
          <CardHeader className="bg-transparent text-white rounded-t-lg">
            <CardTitle className="flex items-center mt-4 text-white">
              <Calculator className="h-6 w-6 mr-2 ml-2 text-vl-yellow" />
              {t("evaluation.form.title") || "Property Evaluation Tool"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8 bg-transparent">
            {/* Contact Information */}
            <div className="bg-vl-yellow/10 p-6 rounded-lg border-0">
              <h3 className="font-semibold text-vl-yellow mb-4">
                {t("evaluation.contact.info") || "Contact Information"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    {t("evaluation.name") || "Full Name"} *
                  </Label>
                  <Input
                    placeholder={t("evaluation.name.placeholder") || "Enter your full name"}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-white border-gray-300 text-gray-900 mt-2 placeholder-gray-500 focus:border-vl-yellow focus:ring-vl-yellow"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    {t("evaluation.email") || "Email Address"} *
                  </Label>
                  <Input
                    type="email"
                    placeholder={t("evaluation.email.placeholder") || "Enter your email"}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-white border-gray-300 mt-2 text-gray-900 placeholder-gray-500 focus:border-vl-yellow focus:ring-vl-yellow"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    {t("evaluation.phone") || "Phone Number"}
                  </Label>
                  <Input
                    placeholder={t("evaluation.phone.placeholder") || "Enter your phone number"}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-white border-gray-300 mt-2 text-gray-900 placeholder-gray-500 focus:border-vl-yellow focus:ring-vl-yellow"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType" className="text-gray-700 font-medium">
                  {t("evaluation.property.type") || "Property Type"} *
                </Label>
                <Select onValueChange={(value) => handleInputChange("propertyType", value)}>
                  <SelectTrigger className="bg-white border-gray-300 mt-2 text-gray-900 focus:border-vl-yellow focus:ring-vl-yellow">
                    <SelectValue placeholder={t("evaluation.select.type") || "Select property type"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="apartment" className="text-gray-900">
                      {t("search.apartment") || "Apartment"}
                    </SelectItem>
                    <SelectItem value="villa" className="text-gray-900">
                      {t("search.villa") || "Villa"}
                    </SelectItem>
                    <SelectItem value="townhouse" className="text-gray-900">
                      {t("search.townhouse") || "Townhouse"}
                    </SelectItem>
                    <SelectItem value="penthouse" className="text-gray-900">
                      {t("search.penthouse") || "Penthouse"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  {t("evaluation.location") || "Location"} *
                </Label>
                <Select onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger className="bg-white border-gray-300 mt-2 text-gray-900 focus:border-vl-yellow focus:ring-vl-yellow">
                    <SelectValue placeholder={t("evaluation.select.location") || "Select location"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="dubai-marina" className="text-gray-900">
                      {t("location.dubai.marina") || "Dubai Marina"}
                    </SelectItem>
                    <SelectItem value="downtown" className="text-gray-900">
                      {t("location.downtown") || "Downtown Dubai"}
                    </SelectItem>
                    <SelectItem value="palm-jumeirah" className="text-gray-900">
                      {t("location.palm.jumeirah") || "Palm Jumeirah"}
                    </SelectItem>
                    <SelectItem value="business-bay" className="text-gray-900">
                      {t("location.business.bay") || "Business Bay"}
                    </SelectItem>
                    <SelectItem value="jvc" className="text-gray-900">
                      {t("location.jvc") || "Jumeirah Village Circle"}
                    </SelectItem>
                    <SelectItem value="dubai-maritime" className="text-gray-900">
                      {t("location.dubai.maritime") || "Dubai Maritime City"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms" className="text-gray-700 font-medium">
                  {t("evaluation.bedrooms") || "Bedrooms"}
                </Label>
                <Select onValueChange={(value) => handleInputChange("bedrooms", value)}>
                  <SelectTrigger className="bg-white border-gray-300 mt-2 text-gray-900 focus:border-vl-yellow focus:ring-vl-yellow">
                    <SelectValue placeholder={t("evaluation.select.beds") || "Select bedrooms"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="1" className="text-gray-900">
                      1
                    </SelectItem>
                    <SelectItem value="2" className="text-gray-900">
                      2
                    </SelectItem>
                    <SelectItem value="3" className="text-gray-900">
                      3
                    </SelectItem>
                    <SelectItem value="4" className="text-gray-900">
                      4
                    </SelectItem>
                    <SelectItem value="5+" className="text-gray-900">
                      5+
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bathrooms" className="text-gray-700 font-medium">
                  {t("evaluation.bathrooms") || "Bathrooms"}
                </Label>
                <Select onValueChange={(value) => handleInputChange("bathrooms", value)}>
                  <SelectTrigger className="bg-white border-gray-300 mt-2 text-gray-900 focus:border-vl-yellow focus:ring-vl-yellow">
                    <SelectValue placeholder={t("evaluation.select.baths") || "Select bathrooms"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="1" className="text-gray-900">
                      1
                    </SelectItem>
                    <SelectItem value="2" className="text-gray-900">
                      2
                    </SelectItem>
                    <SelectItem value="3" className="text-gray-900">
                      3
                    </SelectItem>
                    <SelectItem value="4" className="text-gray-900">
                      4
                    </SelectItem>
                    <SelectItem value="5+" className="text-gray-900">
                      5+
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="area" className="text-gray-700 font-medium">
                  {t("evaluation.area") || "Area (sq ft)"} *
                </Label>
                <Input
                  placeholder={t("evaluation.area.placeholder") || "e.g., 1200"}
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  required
                  className="bg-white border-gray-300 mt-2 text-gray-900 placeholder-gray-500 focus:border-vl-yellow focus:ring-vl-yellow"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="condition" className="text-gray-700 font-medium">
                  {t("evaluation.condition") || "Property Condition"}
                </Label>
                <Select onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger className="bg-white border-gray-300 mt-2 text-gray-900 focus:border-vl-yellow focus:ring-vl-yellow">
                    <SelectValue placeholder={t("evaluation.select.condition") || "Select condition"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="excellent" className="text-gray-900">
                      {t("evaluation.condition.excellent") || "Excellent"}
                    </SelectItem>
                    <SelectItem value="good" className="text-gray-900">
                      {t("evaluation.condition.good") || "Good"}
                    </SelectItem>
                    <SelectItem value="fair" className="text-gray-900">
                      {t("evaluation.condition.fair") || "Fair"}
                    </SelectItem>
                    <SelectItem value="needs-renovation" className="text-gray-900">
                      {t("evaluation.condition.renovation") || "Needs Renovation"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yearBuilt" className="text-gray-700 font-medium">
                  {t("evaluation.year.built") || "Year Built"}
                </Label>
                <Input
                  placeholder={t("evaluation.year.placeholder") || "e.g., 2020"}
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                  className="bg-white border-gray-300 mt-2 text-gray-900 placeholder-gray-500 focus:border-vl-yellow focus:ring-vl-yellow"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="amenities" className="text-gray-700 font-medium">
                {t("evaluation.amenities") || "Amenities"}
              </Label>
              <Input
                placeholder={t("evaluation.amenities.placeholder") || "e.g., Pool, Gym, Parking"}
                value={formData.amenities}
                onChange={(e) => handleInputChange("amenities", e.target.value)}
                className="bg-white border-gray-300 mt-2 text-gray-900 placeholder-gray-500 focus:border-vl-yellow focus:ring-vl-yellow"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700 font-medium">
                {t("evaluation.description") || "Additional Description"}
              </Label>
              <Textarea
                placeholder={t("evaluation.description.placeholder") || "Any additional details about your property..."}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="bg-white border-gray-300 mt-2 text-gray-900 placeholder-gray-500 focus:border-vl-yellow focus:ring-vl-yellow resize-none"
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full bg-transparent hover:border-black text-white font-semibold py-3 border-2 border-vl-yellow shadow-lg transition-all duration-200"
              disabled={
                !formData.propertyType || !formData.location || !formData.area || !formData.name || !formData.email || isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  {t("common.loading") || "Loading..."}
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  {t("evaluation.button") || "Get Property Evaluation"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
