"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function Footer() {
  const { t, isRTL } = useI18n()

  return (
    <footer className="bg-vl-blue text-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="space-y-6 p-8 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 flex flex-col items-center">
  <div className="mb-6">
    <Image
      src="/VL1_w.svg"
      alt="Victoria Lancaster Real Estate"
      width={200}
      height={120}
      className="h-24 w-auto brightness-0 invert"
      priority
    />
  </div>
  <p className="text-gray-300 mb-6 leading-relaxed text-center">
    {t("footer.description")}
  </p>
  <div className="flex space-x-4">
    <Button variant="ghost" size="sm" className="text-white hover:text-vl-yellow">
      <Facebook className="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="sm" className="text-white hover:text-vl-yellow">
      <Instagram className="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="sm" className="text-white hover:text-vl-yellow">
      <Linkedin className="h-5 w-5" />
    </Button>
  </div>
</div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex flex-col items-center">{t("footer.quick.links")}</h3>
            <ul className="space-y-3 flex flex-col items-center">
              <li>
                <Link href="/" className="text-gray-300 hover:text-vl-yellow transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-vl-yellow transition-colors">
                  {t("nav.properties")}
                </Link>
              </li>
              <li>
                <Link href="/areas" className="text-gray-300 hover:text-vl-yellow transition-colors">
                  {t("nav.areas")}
                </Link>
              </li>
                <li>
                <Link href="/evaluation" className="text-gray-300 hover:text-vl-yellow transition-colors">
                  {t("nav.evaluation")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-vl-yellow transition-colors">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-vl-yellow transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-vl-yellow transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex flex-col items-center">{t("footer.contact.info")}</h3>
            <ul className="space-y-4 flex flex-col">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-vl-yellow" />
                <span className="text-gray-300">Dubai, UAE</span>
              </li>
      <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-vl-yellow" />
                <span className="text-gray-300">victoria.lancaster@selectproperty.ae</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6" >{t("footer.newsletter")}</h3>
            <p className="text-gray-300 mb-4">{t("footer.newsletter.description")}</p>
            <div className="flex flex-col space-y-3">
              <Input
                type="email"
                placeholder={t("footer.email.placeholder")}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="w-full md:w-auto text-white bg-transparent hover:text-vl-yellow font-semibold px-12 py-4 text-lg  transition-all duration-300 hover:scale-105 border-2 border-vl-yellow hover:border-black">
                {t("footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 items-center">
          <div className="flex justify-center items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0 text-center">{t("footer.copyright")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
