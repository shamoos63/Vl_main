import Image from "next/image"
import Link from "next/link"

export default function ServerHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center">
            <Image src="/VL_logo.svg" alt="Victoria Lancaster Real Estate" width={150} height={50} priority />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-vl-blue hover:text-vl-yellow transition-colors">
              Home
            </Link>
            <Link href="/properties" className="text-vl-blue hover:text-vl-yellow transition-colors">
              Properties
            </Link>
            <Link href="/areas" className="text-vl-blue hover:text-vl-yellow transition-colors">
              Areas
            </Link>
            <Link href="/evaluation" className="text-vl-blue hover:text-vl-yellow transition-colors">
              Evaluation
            </Link>
            <Link href="/about" className="text-vl-blue hover:text-vl-yellow transition-colors">
              About
            </Link>
            <Link href="/blog" className="text-vl-blue hover:text-vl-yellow transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-vl-blue hover:text-vl-yellow transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex bg-vl-yellow hover:bg-vl-yellow-dark text-vl-blue font-semibold py-2 px-4 rounded transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
