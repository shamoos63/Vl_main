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

// Navigation items in the specified order
const navItems = [
  { key: "home", path: "/" },
  { key: "properties", path: "/properties" },
  { key: "areas", path: "/areas" },
  { key: "evaluation", path: "/evaluation" },
  { key: "about", path: "/about" },
  { key: "blog", path: "/blog" },
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
        <div className="container mx-auto px-4">
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
                  <Link href="/about" className="text-vl-blue !important hover:text-vl-blue transition-colors font-medium">
                About
              </Link>
              <Link href="/" className="text-vl-blue !important hover:text-vl-blue transition-colors font-medium">
                Home
              </Link>
              <Link
                href="/properties"
                className="text-vl-blue !important hover:text-vl-blue transition-colors font-medium"
              >
                Properties
              </Link>
              <Link href="/areas" className="text-vl-blue !important hover:text-vl-blue transition-colors font-medium">
                Areas
              </Link>
              <Link
                href="/evaluation"
                className="text-vl-blue !important hover:text-vl-blue transition-colors font-medium"
              >
                Property Evaluation
              </Link>
        
              <Link href="/blog" className="text-vl-blue !important hover:text-vl-blue transition-colors font-medium">
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-vl-blue !important hover:text-vl-blue transition-colors font-medium"
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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            {/* Updated Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0 text-white">
              <Image
                src="/VL1_w.svg"
                alt="Victoria Lancaster Real Estate"
                width={240}
                height={90}
                className="h-20 w-auto transition-all duration-300 hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden lg:flex items-center ${isRTL ? "space-x-reverse space-x-6" : "space-x-8"}`}>
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.path}
                  className={`nav-item text-sm xl:text-base font-medium transition-colors text-vl-blue ${
                    isActiveNavItem(item.path) ? "nav-active" : "text-vl-blue hover:text-vl-yellow"
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              {/* Expandable Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex text-vl-blue items-center bg-gray-100 rounded-full px-4 py-2">
                    <Input
                      type="text"
                      placeholder={t("nav.search.placeholder") || "Search properties..."}
                      className="border-0 bg-transparent focus:ring-0 w-48"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyPress}
                      autoFocus
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-vl-blue ml-1"
                      disabled={!searchQuery.trim()}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsSearchOpen(false)
                        setSearchQuery("")
                      }}
                      className="text-vl-blue ml-1"
                    >
                      <X className="h-4 w-4 text-black!" />
                    </Button>
                  </form>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)} className="text-vl-blue">
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Enhanced Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="language-trigger text-vl-blue hover:text-vl-yellow transition-all duration-300 px-3 py-2 rounded-xl border border-transparent hover:border-vl-yellow/30 hover:bg-vl-yellow/10 backdrop-blur-sm"
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-vl-blue"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-24 left-0 right-0 mobile-menu-container shadow-lg border-t rounded-b-2xl z-[110] transform translate-y-0">
              <nav className="flex flex-col p-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.path}
                    className={`font-medium py-2 transition-colors ${
                      isActiveNavItem(item.path) ? "nav-mobile-active" : "text-vl-blue hover:text-vl-yellow"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}

                {/* Mobile Language Selector */}
                <div className="flex items-center justify-center pt-4 border-t border-vl-yellow/20">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mobile-language-trigger text-vl-blue hover:text-vl-yellow transition-all duration-300 px-4 py-3 rounded-xl border border-vl-yellow/30 hover:border-vl-yellow hover:bg-vl-yellow/10 backdrop-blur-sm"
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
