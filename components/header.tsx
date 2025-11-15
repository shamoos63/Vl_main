"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, X, Search, Globe, ChevronDown, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n, type Language } from "@/lib/i18n"

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "ar" as Language, name: "العربية", flag: "🇦🇪", nativeName: "العربية" },
  { code: "ru" as Language, name: "Русский", flag: "🇷🇺", nativeName: "Русский" },
]

// Base navigation items
const baseNavItems = [
  { key: "home", path: "/" },
  { key: "properties", path: "/properties" },
  { key: "evaluation", path: "/evaluation" },
  { key: "about", path: "/about" },
  // Note: blog and areas are combined into one dropdown in the UI
  { key: "contact", path: "/contact" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage, t, isRTL } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Function to check if a navigation item is active
  const isActiveNavItem = (path: string) => {
    if (path === "/" && pathname === "/") {
      return true
    }
    if (path !== "/" && pathname?.startsWith(path)) {
      return true
    }
    return false
  }

  // Handle search functionality
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to homepage with search query
      const searchParams = new URLSearchParams({ query: searchQuery.trim() })
      router.push(`/?${searchParams.toString()}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // Handle search input key press
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // Don't render full content until client-side hydration is complete
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 shadow-lg">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/VL1_w.svg"
                alt="Victoria Lancaster Real Estate"
                width={240}
                height={90}
                className="h-20 w-auto brightness-0 invert"
                priority
              />
            </Link>
            <div className="hidden lg:flex items-center space-x-8">
                  <Link href="/about" className="text-white !important hover:text-white transition-colors font-medium">
                About
              </Link>
              <Link href="/" className="text-white !important hover:text-white transition-colors font-medium">
                Home
              </Link>
              <Link
                href="/properties"
                className="text-white !important hover:text-white transition-colors font-medium"
              >
                Properties
              </Link>
              <Link href="/areas" className="text-white !important hover:text-white transition-colors font-medium">
                Areas
              </Link>
              <Link
                href="/evaluation"
                className="text-white !important hover:text-white transition-colors font-medium"
              >
                Property Evaluation
              </Link>
        
              <Link href="/blog" className="text-white !important hover:text-white transition-colors font-medium">
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-white !important hover:text-white transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
            <div></div>
          </div>
        </div>
      </header>
    )
  }

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? "mt-2 mx-4 bg-transparent backdrop-blur-md shadow-xl rounded-2xl"
            : "bg-white/60 backdrop-blur-md shadow-lg"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-20">
            {/* Left: Home, Properties, Evaluation */}
            <div className="hidden lg:flex items-center gap-3 justify-end">
              <Link href="/" className="group">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm xl:text-base transition-colors ${
                    isActiveNavItem("/") ? " text-vl-yellow" : "text-white group-hover:bg-vl-yellow/10 group-hover:text-vl-yellow"
                  }`}
                >
                  {t("nav.home")}
                </span>
                {isActiveNavItem("/") && <span className="block h-0.5 bg-vl-yellow rounded-full mt-1" />}
              </Link>
              <Link href="/properties" className="group">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm xl:text-base transition-colors ${
                    isActiveNavItem("/properties") ? " text-vl-yellow" : "text-white group-hover:bg-vl-yellow/10 group-hover:text-vl-yellow"
                  }`}
                >
                  {t("nav.properties")}
                </span>
                {isActiveNavItem("/properties") && <span className="block h-0.5 bg-vl-yellow rounded-full mt-1" />}
              </Link>
              <Link href="/evaluation" className="group">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm xl:text-base transition-colors ${
                    isActiveNavItem("/evaluation") ? " text-vl-yellow" : "text-white group-hover:bg-vl-yellow/10 group-hover:text-vl-yellow"
                  }`}
                >
                  {t("nav.evaluation")}
                </span>
                {isActiveNavItem("/evaluation") && <span className="block h-0.5 bg-vl-yellow rounded-full mt-1" />}
              </Link>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link href="/" className="flex items-center space-x-2 flex-shrink-0 text-white">
                <Image
                  src="/VL1_w.svg"
                  alt="Victoria Lancaster Real Estate"
                  width={170}
                  height={68}
                  className="h-14 w-auto transition-all duration-300 hover:scale-105"
                  priority
                />
              </Link>
            </div>

            {/* Right: About, Articles, Contact + Actions */}
            <div className="hidden lg:flex items-center gap-1 w-full pl-3  md:pl-6">
              <nav className="flex items-center gap-3 flex-1">
                <Link href="/about" className="group">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm xl:text-base transition-colors ${
                      isActiveNavItem("/about") ? " text-vl-yellow" : "text-white group-hover:bg-vl-yellow/10 group-hover:text-vl-yellow"
                    }`}
                  >
                    {t("nav.about")}
                  </span>
                  {isActiveNavItem("/about") && <span className="block h-0.5 bg-vl-yellow rounded-full mt-1" />}
                </Link>
              
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`px-0 h-auto text-sm xl:text-base font-medium relative group ${
                        pathname?.startsWith("/blog") || pathname?.startsWith("/areas")
                          ? "text-vl-yellow"
                          : "text-white hover:text-vl-yellow"
                      }`}
                    >
                      <span
                        className={`mr-1 inline-flex items-center px-3 py-1.5 rounded-full transition-colors ${
                          pathname?.startsWith("/blog") || pathname?.startsWith("/areas")
                            ? " text-vl-yellow"
                            : "group-hover:bg-vl-yellow/10"
                        }`}
                      >
                        {t("nav.articles") || "Articles"}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                      {(pathname?.startsWith("/blog") || pathname?.startsWith("/areas")) && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-vl-yellow rounded-full" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="min-w-[220px] p-2 rounded-xl border border-vl-yellow/30  bg-white/80 backdrop-blur-md shadow-2xl"
                  >
                    
                    <DropdownMenuItem asChild className="rounded-lg group">
  <Link
    href="/blog"
    className={`w-full flex items-center px-2 py-2 rounded-lg transition-colors group-hover:bg-vl-yellow/10 ${
      language === "ar" ? "flex-row-reverse gap-2" : "gap-2"
    }`}
  >
    <span
      className={`h-2 w-2 rounded-full ${
        pathname?.startsWith("/blog") ? "bg-vl-yellow" : "bg-gray-300"
      }`}
    />
    <span
      className={`flex-1  group-hover:bg-vl-yellow/10 group-hover:rounded-full group-hover:text-vl-yellow ${language === "ar" ? "text-right" : "text-left"}`}
    >
      {t("nav.blog")}
    </span>
    {pathname?.startsWith("/blog") && (
      <Check className="h-4 w-4 text-vl-yellow" />
    )}
  </Link>
</DropdownMenuItem>
<DropdownMenuItem asChild className="rounded-lg group">
  <Link
    href="/areas"
    className={`w-full flex items-center px-2 py-2 rounded-lg transition-colors group-hover:bg-vl-yellow/10 ${
      language === "ar" ? "flex-row-reverse gap-2" : "gap-2"
    }`}
  >
    <span
      className={`h-2 w-2 rounded-full ${
        pathname?.startsWith("/areas") ? "bg-vl-yellow" : "bg-gray-300"
      }`}
    />
    <span
      className={`flex-1  group-hover:bg-vl-yellow/10 group-hover:rounded-full group-hover:text-vl-yellow ${language === "ar" ? "text-right" : "text-left"}`}
    >
      {t("nav.areas")}
    </span>
    {pathname?.startsWith("/areas") && (
      <Check className="h-4 w-4 text-vl-yellow" />
    )}
  </Link>
</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                 <Link href="/contact" className="group">
                   <span
                     className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm xl:text-base transition-colors ${
                       isActiveNavItem("/contact") ? " text-vl-yellow" : "text-white group-hover:bg-vl-yellow/10 group-hover:text-vl-yellow"
                     }`}
                   >
                     {t("nav.contact")}
                   </span>
                   {isActiveNavItem("/contact") && <span className="block h-0.5 bg-vl-yellow rounded-full mt-1" />}
                 </Link>
              </nav>

              {/* Actions: Search + Language */}
              <div className="flex items-center space-x-4 ml-auto">       
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="language-trigger text-white hover:text-vl-yellow transition-all duration-300 px-3 py-2 rounded-xl border border-transparent hover:border-vl-yellow/30 hover:bg-vl-yellow/10 backdrop-blur-sm"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      <span className="text-lg mr-1">{currentLanguage?.flag}</span>
                      <span className="font-medium text-sm">{currentLanguage?.code.toUpperCase()}</span>
                      <ChevronDown className="h-3 w-3 ml-1 transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="language-dropdown-content z-[150] min-w-[200px] p-2"
                    align="end"
                    sideOffset={8}
                  >
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`language-dropdown-item cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
                          language === lang.code ? "language-dropdown-item-active" : "language-dropdown-item-inactive"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{lang.flag}</span>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{lang.nativeName}</span>
                              <span className="text-xs opacity-70">{lang.name}</span>
                            </div>
                          </div>
                          {language === lang.code && <Check className="h-4 w-4 text-vl-yellow" />}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-24 left-0 right-0 mobile-menu-container shadow-lg border-t rounded-b-2xl z-[110] transform translate-y-0">
              <nav className="flex flex-col p-4 space-y-4">
                {[
                  { key: "home", path: "/" },
                  { key: "properties", path: "/properties" },
                  { key: "evaluation", path: "/evaluation" },
                  { key: "about", path: "/about" },
                  { key: "blog", path: "/blog" },
                  { key: "areas", path: "/areas" },
                  { key: "contact", path: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.key}
                    href={item.path}
                    className={`font-medium py-2 transition-colors ${
                      isActiveNavItem(item.path) ? "nav-mobile-active" : "text-white hover:text-vl-yellow"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(`nav.${item.key}`) || (item.key === "blog" ? "Blog" : item.key === "areas" ? "Areas" : item.key)}
                  </Link>
                ))}

                {/* Mobile Language Selector */}
                <div className="flex items-center justify-center pt-4 border-t border-vl-yellow/20">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mobile-language-trigger text-white hover:text-vl-yellow transition-all duration-300 px-4 py-3 rounded-xl border border-vl-yellow/30 hover:border-vl-yellow hover:bg-vl-yellow/10 backdrop-blur-sm"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        <span className="text-lg mr-2">{currentLanguage?.flag}</span>
                        <span className="font-medium">{currentLanguage?.nativeName}</span>
                        <ChevronDown className="h-3 w-3 ml-2 transition-transform duration-200" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="mobile-language-dropdown-content z-[200] min-w-[180px] p-2"
                      align="center"
                      sideOffset={8}
                    >
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code)
                            setIsMenuOpen(false)
                          }}
                          className={`mobile-language-dropdown-item cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                            language === lang.code
                              ? "mobile-language-dropdown-item-active"
                              : "mobile-language-dropdown-item-inactive"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{lang.flag}</span>
                              <span className="font-medium text-sm">{lang.nativeName}</span>
                            </div>
                            {language === lang.code && <Check className="h-3 w-3 text-vl-yellow" />}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
