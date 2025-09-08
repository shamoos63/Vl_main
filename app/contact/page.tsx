"use client"

import Footer from "@/components/footer"
import Header from "@/components/header"
import ServerPageHero from "@/components/server-page-hero"
import { Card } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import ContactForm from "@/components/contact-form"
import { useI18n } from "@/lib/i18n"

export default function ContactPage() {
  const { t, isRTL } = useI18n()

  return (
    <main className="min-h-screen pt-24 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <ServerPageHero
        title={t("contact.page.title")}
        subtitle={t("contact.page.subtitle")}
        backgroundImage="/hero.webp"
        className="font-sansumi"
      />

      <div className="pt-8">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <div className="space-y-8 ">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold text-vl-yellow dark:text-white mb-4">{t("contact.info.title")}</h3>

                <div className="space-y-4">
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-vl-yellow mr-3 ml-3" />
                    <div>
                      <p className="font-medium text-vl-yellow dark:text-white">{t("contact.info.email")}</p>
                      <p className="text-gray-600 dark:text-gray-300">victoria.lancaster@selectproperty.ae</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-vl-yellow mr-3 ml-3" />
                    <div>
                      <p className="font-medium text-vl-yellow dark:text-white">{t("contact.info.office")}</p>
                      <p className="text-gray-600 dark:text-gray-300">{t("contact.info.office.location")}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-vl-yellow mr-3 ml-3" />
                    <div>
                      <p className="font-medium text-vl-yellow dark:text-white">{t("contact.info.hours")}</p>
                      <p className="text-gray-600 dark:text-gray-300">{t("contact.info.hours.time")}</p>
                    </div>
                  </div>

                      <div className="flex items-center">
                    <Phone className="h-5 w-5 text-vl-yellow mr-3 ml-3" />
                    <div>
                      <p className="font-medium text-vl-yellow dark:text-white">{t("contact.info.phone")}</p>
                      <p className="text-gray-600 dark:text-gray-300">{t("footer.contact.phone")}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Map Integration */}
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold text-vl-yellow dark:text-white mb-4">{t("contact.location.title")}</h3>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28909.339100727015!2d55.1109958!3d25.0792602!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6caafde5834f%3A0x17d88c5f75357c40!2sSelect%20Property!5e0!3m2!1sen!2s!4v1756787851093!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Dubai Location"
                  ></iframe>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
