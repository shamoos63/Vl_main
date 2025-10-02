"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import Image from "next/image"
import AnimatedCounter from "@/components/animated-counter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WelcomePopupProps {
  onClose: () => void
}

export default function WelcomePopup({ onClose }: WelcomePopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const { t, isRTL, language } = useI18n()
  const popupRef = useRef<HTMLDivElement>(null)

  
  // Ternary translation for welcome popup content
  const welcomeTitle = t("welcome.title")
  const welcomeTitle2 = t("welcome.title2")
  const welcomeSubtitle = t("welcome.subtitle")
  const welcomeSubtitle2 = t("welcome.subtitle2")
  const welcomeExperience = t("welcome.experience")
  const welcomeExperience1 = t("welcome.subtitle1")
  const welcomeExperience22 = t("welcome.subtitle2+")
  const welcomeExperience3 = t("welcome.subtitle3")
  const welcomeStrategic = t("welcome.strategic")
  const welcomeStrategicDetail = t("welcome.strategic.detail")
  const welcomeGetInTouch = t("welcome.get.in.touch")
  const welcomeFullName = t("welcome.full.name")
  const welcomeFullNamePlaceholder = t("welcome.full.name.placeholder")
  const welcomePhoneNumber = t("welcome.phone.number")
  const welcomePhonePlaceholder = t("welcome.phone.placeholder")
  const welcomeEmailAddress = t("welcome.email.address")
  const welcomeEmailPlaceholder = t("welcome.email.placeholder")
  const welcomeDetails = t("welcome.details")
  const welcomeDetailsPlaceholder = t("welcome.details.placeholder")
  const welcomeSkip = t("welcome.skip")
  const welcomeSend = t("welcome.send")

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleSkip()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/welcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          details: formData.details,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit form")
      }

      console.log("Welcome form submitted successfully:", result)

      // Store in localStorage to prevent showing again
      localStorage.setItem("vl-welcome-shown", "true")

      setIsSubmitted(true)

      // Close popup after 8 seconds
      setTimeout(() => {
        onClose()
      }, 8000)

    } catch (error) {
      console.error("Error submitting welcome form:", error)
      setSubmitError(error instanceof Error ? error.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("vl-welcome-shown", "true")
    onClose()
  }

  if (isSubmitted) {
    // Ternary translation for welcome popup messages
    const thankYouTitle = t("welcome.thank.you")
    const thankYouMessage = t("welcome.thank.you.message")
    const expectContactMessage = t("welcome.expect.contact")
    
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
        <Card className="w-full max-w-md bg-vl-blue border border-vl-yellow shadow-2xl border-0" ref={popupRef}>
          <CardContent className="p-8 text-center bg-vl-blue">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-vl-yellow mb-2">{thankYouTitle}</h3>
            <p className="text-white mb-4">
              {thankYouMessage}
            </p>
            <p className="text-white/80 text-sm">
              {expectContactMessage}
            </p>
      
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-vl-blue border border-vl-yellow shadow-2xl border-0 relative"
        ref={popupRef}
      >
        {/* Modern Blue Header with Laptop-Centered Layout */}
        <CardHeader className="relative bg-gradient-to-br from-vl-blue via-vl-blue-light to-vl-blue-dark text-white rounded-t-2xl rounded-b-2xl shadow-lg mb-4 overflow-hidden border-b border-vl-yellow">
          {/* Background Pattern */}
         <div className="absolute inset-0">
  <img src="/background.webp" alt="background" className="w-full h-full object-cover" />
</div>

      <Select
  value={language}
  onValueChange={(nextLang) => {
    window.localStorage.setItem("vl-language", nextLang);
    window.location.reload();
  }}
>
  <SelectTrigger className="absolute top-3 glass text-xs text-vl-blue font-bold px-4 py-1 rounded-full shadow-lg z-[210] w-[100px] transition-transform duration-300 hover:scale-105">
    <SelectValue placeholder="Language" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="en" className="select-item w-full px-4 py-2 cursor-pointer flex items-center justify-start">
      English
    </SelectItem>
    <SelectItem value="ar" className="w-full px-4 py-2 cursor-pointer flex items-center justify-start">
      العربية
    </SelectItem>
    <SelectItem value="ru" className="w-full px-4 py-2 cursor-pointer flex items-center justify-start">
      Русский
    </SelectItem>
  </SelectContent>
</Select>

<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            {/* Mobile Layout (unchanged) - Responsive Layout for mobile */}
            <div className="flex flex-col items-center md:hidden gap-7 mb-6">
              {/* Centered Photo for Mobile */}
              <div className="flex justify-center w-full">
                <Image
                  src="/victoria-photo-3.jpg"
                  alt="Victoria Lancaster"
                  width={128}
                  height={128}
                  className="rounded-full object-cover object-top border-4 border-vl-yellow shadow-lg w-32 h-32"
                />
              </div>

              {/* Text Content for Mobile */}
              <div className="flex-1 text-center">
                <CardTitle className="text-xl font-bold text-vl-yellow mb-3 leading-tight">
                  {welcomeTitle}
                  <p className="text-white text-base leading-relaxed mb-1 font-medium">
                  {welcomeTitle2}
                </p>
                </CardTitle>
                <p className="text-white text-base leading-relaxed mb-4 pt-[-2rem] font-medium">
                  
                {language == "ar" && (  <>  <br />  {welcomeSubtitle}  </>  )}
                 {language !== "ar" && (  <>  <br />  {welcomeExperience1}  </>  )}
                 {language !== "ar" && (  <>  <br />  {welcomeExperience22}  </>  )}
                 {language !== "ar" && (  <>  <br />  {welcomeExperience3}  </>  )}
                </p>

                {/* Two Column Stats for Mobile */}
                <div className="grid grid-cols-2 gap-4 w-full">

                  {/* Experience */}
                  <div className="text-center">
                    <div className="text-white whitespace-nowrap font-semibold font-medium mb-1">
                      {welcomeExperience}
                    </div>
                      <AnimatedCounter
                                      end={585}
                                      suffix="+"
                                      decimals={0}
                                      delay={400}
                                      duration={3000}
                                      className="text-lg font-poppins font-bold text-vl-yellow mb-2 transition-all duration-300 group-hover:scale-110"
                                      glowEffect={true}
                                      pulseOnComplete={true}
                                    />
                  </div>

                  {/* Strategic */}
                  <div className="text-center whitespace-nowrap">
                    <div className="text-white font-semibold font-medium mb-1">{welcomeStrategic}</div>
                     <AnimatedCounter
  prefix={isRTL ? '+' : 'AED '}
  end={1.7}
  suffix={isRTL ? 'مليار' : 'B+'}
  something={isRTL ? 'درهم إماراتي' : ''}
  decimals={1}
  delay={400}
  duration={3000}
  className={'whitespace-nowrap font-poppins font-bold text-vl-yellow mb-2 transition-all duration-300 group-hover:scale-110 ${ isRTL ? "text-sm" : "text-lg"}'}
  glowEffect={true}
  pulseOnComplete={true}
/>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop/Desktop Layout (md and above) - Centered Image at Top */}
            <div className="hidden md:flex md:flex-col md:items-center mb-6">
              {/* Centered Photo at Top for Laptop */}
              <div className="flex justify-center w-full mb-6">
                <Image
                  src="/victoria-photo-3.jpg"
                  alt="Victoria Lancaster"
                  width={128}
                  height={128}
                  className="rounded-full object-cover object-top border-4 border-vl-yellow shadow-lg w-32 h-32"
                />
              </div>

              {/* Centered Text Content Below Image for Laptop */}
              <div className="text-center w-full">
                <CardTitle className="text-2xl font-bold text-vl-yellow mb-4 leading-tight">
                  {welcomeTitle}
                    <p className="text-white text-lg leading-relaxed mb-6 font-medium max-w-2xl mx-auto">
                  {welcomeTitle2}
                </p>
                </CardTitle>
                <p className="text-white text-lg leading-relaxed mb-6 font-medium max-w-2xl mx-auto">
                  {welcomeSubtitle}
                 {language !== "ar" && (
    <>
      <br />
      {welcomeSubtitle2}
    </>
  )}
                </p>

                {/* Two Column Stats for Laptop - Centered */}
                <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
                  {/* Experience */}
                  <div className="text-center">
                    <div className="text-white font-semibold whitespace-nowrap text-lg mb-1">
                      {welcomeExperience}
                    
                    </div>
                      <AnimatedCounter
                                      end={585}
                                      suffix="+"
                                      decimals={0}
                                      delay={400}
                                      duration={3000}
                                      className="text-lg font-poppins font-bold text-vl-yellow mb-2 transition-all duration-300 group-hover:scale-110"
                                      glowEffect={true}
                                      pulseOnComplete={true}
                                    />
                  </div>

                  {/* Strategic */}
                  <div className="text-center">
                    <div className="text-white font-semibold text-lg mb-1">{welcomeStrategic}</div>
                      <AnimatedCounter
  prefix={isRTL ? '+' : 'AED '}
  end={1.7}
  suffix={isRTL ? 'مليار درهم إماراتي' : 'B+'}
  decimals={1}
  delay={400}
  duration={3000}
  className={'font-poppins font-bold text-vl-yellow mb-2 transition-all duration-300 group-hover:scale-110 ${ isRTL ? "text-sm" : "text-lg"}'}
  glowEffect={true}
  pulseOnComplete={true}
/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Form Content - Tucked under header */}
        <CardContent className="bg-vl-blue p-4 md:p-6 -mt-4 relative z-10 rounded-t-xl">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-vl-yellow mb-2">{welcomeGetInTouch}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{submitError}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-vl-yellow font-medium">
                  {welcomeFullName} *
                </Label>
                <Input
                  id="name"
                  placeholder={welcomeFullNamePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1 bg-transparent text-white border-vl-yellow focus:border-vl-yellow"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-vl-yellow font-medium">
                  {welcomePhoneNumber}
                </Label>
                <Input
                  id="phone"
                  placeholder={welcomePhonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 bg-transparent border-vl-yellow focus:border-vl-yellow text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-vl-yellow font-medium">
                {welcomeEmailAddress} *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={welcomeEmailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1 bg-transparent border-vl-yellow focus:border-vl-yellow text-white"
              />
            </div>

            <div>
              <Label htmlFor="details" className="text-vl-yellow font-medium">
                {welcomeDetails}
              </Label>
              <Textarea
                id="details"
                placeholder={welcomeDetailsPlaceholder}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="mt-1 bg-transparent border-vl-yellow focus:border-vl-yellow min-h-[80px] md:min-h-[100px] resize-none text-white"
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-vl-yellow">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="text-transparent hover:text-black order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
{welcomeSkip}
              </Button>

              <Button
                type="submit"
                disabled={!formData.name || !formData.email || isSubmitting}
                className="w-full md:w-auto text-white bg-transparent hover:text-vl-yellow font-semibold px-12 py-4 text-lg  transition-all duration-300 hover:scale-105 border-2 border-vl-yellow hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
{isSubmitting ? "Sending..." : welcomeSend}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
