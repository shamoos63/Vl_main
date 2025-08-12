"use client"

import { useEffect, useState } from "react"
import AIChatAssistant from "./ai-chat-assistant"

export default function ChatWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <AIChatAssistant />
}
