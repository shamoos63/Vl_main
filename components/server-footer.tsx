import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function ServerFooter() {
  return (
    <footer className="bg-vl-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/VL_logo.svg"
                alt="Victoria Lancaster Real Estate"
                width={150}
                height={50}
                className="invert"
              />
            </Link>
            <p className="text-gray-300 mb-4">
              Your trusted partner in Dubai real estate investment, offering personalized guidance and exclusive
              opportunities.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-white transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/areas" className="text-gray-300 hover:text-white transition-colors">
                  Areas
                </Link>
              </li>
              <li>
                <Link href="/evaluation" className="text-gray-300 hover:text-white transition-colors">
                  Property Evaluation
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-vl-yellow mr-2">Address:</span>
                <span className="text-gray-300">Dubai, United Arab Emirates</span>
              </li>
              <li className="flex items-start">
                <span className="text-vl-yellow mr-2">Phone:</span>
                <span className="text-gray-300">+971 4 2794 800 XX XXX XXXX</span>
              </li>
              <li className="flex items-start">
                <span className="text-vl-yellow mr-2">Email:</span>
                <span className="text-gray-300">victoria.lancaster@selectproperty.ae</span>
              </li>
              <li className="flex items-start">
                <span className="text-vl-yellow mr-2">Hours:</span>
                <span className="text-gray-300">Sun - Thu: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-vl-blue-dark text-white px-4 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-vl-yellow"
              />
              <button className="bg-vl-yellow hover:bg-vl-yellow-dark text-vl-blue px-4 py-2 rounded-r transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-vl-blue-dark mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} VL Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
