"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const ContactForm = dynamic(() => import("@/components/contact-form"), { ssr: false })

export default function ContactClient() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading contact form...</div>}>
      <ContactForm />
    </Suspense>
  )
}
