"use client"

import { useState, useEffect } from "react"
import WelcomePopup from "./welcome-popup"

export default function WelcomePopupWrapper() {
  const [showPopup, setShowPopup] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Show popup after a short delay every time
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted || !showPopup) {
    return null
  }

  return <WelcomePopup onClose={() => setShowPopup(false)} />
}
