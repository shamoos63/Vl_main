import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Cairo } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n"
import { AuthProvider } from "@/lib/auth-context"
import WelcomePopupWrapper from "@/components/welcome-popup-wrapper"
import ChatWrapper from "@/components/chat-wrapper"

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
})

// Sansumi font variants
const sansumiUltraLight = localFont({
  src: "../public/fonts/Sansumi-UltraLight.ttf",
  variable: "--font-sansumi-ultralight",
  weight: "200",
})

const sansumiRegular = localFont({
  src: "../public/fonts/Sansumi-Regular.ttf",
  variable: "--font-sansumi-regular",
  weight: "400",
})

const sansumiDemiBold = localFont({
  src: "../public/fonts/Sansumi-DemiBold.ttf",
  variable: "--font-sansumi-demibold",
  weight: "600",
})

const sansumiBold = localFont({
  src: "../public/fonts/Sansumi-Bold.ttf",
  variable: "--font-sansumi-bold",
  weight: "700",
})

// Noto Sans Mono font variants for Russian text
const notoSansMonoRegular = localFont({
  src: "../public/fonts/NotoSansMono-Regular.ttf",
  variable: "--font-noto-sans-mono-regular",
  weight: "400",
})

const notoSansMonoBold = localFont({
  src: "../public/fonts/NotoSansMono-Bold.ttf",
  variable: "--font-noto-sans-mono-bold",
  weight: "700",
})

const notoSansMonoSemiBold = localFont({
  src: "../public/fonts/NotoSansMono-SemiBold.ttf",
  variable: "--font-noto-sans-mono-semibold",
  weight: "600",
})

export const metadata: Metadata = {
  title: "VL Real Estate - Luxury Properties in UAE",
  description:
    "Discover premium real estate opportunities in Dubai and UAE with VL Real Estate. Expert guidance for luxury properties, investments, and dream homes.",
  keywords: "real estate, Dubai, UAE, luxury properties, property investment, homes for sale",
  authors: [{ name: "VL Real Estate" }],
  openGraph: {
    title: "VL Real Estate - Luxury Properties in UAE",
    description: "Discover premium real estate opportunities in Dubai and UAE with VL Real Estate.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_AE", "ru_RU"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VL Real Estate - Luxury Properties in UAE",
    description: "Discover premium real estate opportunities in Dubai and UAE with VL Real Estate.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${cairo.variable} ${sansumiUltraLight.variable} ${sansumiRegular.variable} ${sansumiDemiBold.variable} ${sansumiBold.variable} ${notoSansMonoRegular.variable} ${notoSansMonoBold.variable} ${notoSansMonoSemiBold.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <I18nProvider>
            <WelcomePopupWrapper />
            <ChatWrapper />
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
