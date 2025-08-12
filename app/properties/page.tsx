import Footer from "@/components/footer"
import Header from "@/components/header"
import PropertiesPageServer from "@/components/properties-page-server"
import PropertiesPageHero from "@/components/properties-page-hero"
import PropertiesPageWrapper from "@/components/properties-page-wrapper"

export default function PropertiesPage() {
  return (
    <PropertiesPageWrapper>
      <Header />
      <PropertiesPageHero />
      <PropertiesPageServer />
      <Footer />
    </PropertiesPageWrapper>
  )
}
