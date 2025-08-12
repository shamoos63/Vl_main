"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Use dynamic import with SSR disabled for the client component
const PropertyEvaluationTool = dynamic(() => import("@/components/property-evaluation-tool"), { ssr: false })

export default function EvaluationClient() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading evaluation tool...</div>}>
      <PropertyEvaluationTool />
    </Suspense>
  )
}
