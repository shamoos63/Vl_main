"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import "./ai-chat-assistant.css"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { t, isRTL, language } = useI18n()
  const router = useRouter()

  // Show chat button after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Stop pulse animation after first interaction
  useEffect(() => {
    if (isOpen && showPulse) {
      setShowPulse(false)
    }
  }, [isOpen, showPulse])

  // Handle input changes and auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px"
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }

    try {
      // Simulate API call to chat endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language: language || "en",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "I'm here to help you with Dubai real estate questions!",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Handle redirect actions from assistant (e.g., evaluation tool, properties page, about page)
      if (data.redirectUrl) {
        // Brief delay to let the message render, then navigate
        setTimeout(() => {
          router.push(data.redirectUrl)
          // Optionally close chat after navigation
          setIsOpen(false)
        }, 400)
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t("ai.chat.error") || "Sorry, I'm having trouble responding right now. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }

  return (
    <div className="ai-chat-container" dir={isRTL ? "rtl" : "ltr"}>
      {/* Chat Button */}
      {isVisible && (
        <button
          onClick={toggleChat}
          className={`ai-chat-button ${showPulse ? "pulse" : ""} ${showPulse ? "coin-reflect" : ""}`}
          aria-label={t("ai.chat.title")}
          title={t("ai.chat.title")}
        >
          <MessageCircle className="ai-chat-icon" />
        </button>
      )}

      {/* Chat Card */}
      {isOpen && (
        <div className={`ai-chat-card ${isOpen ? "open" : ""}`}>
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-content">
              <div className="ai-chat-avatar">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="ai-chat-title">{t("ai.chat.title") || "Ask Victoria"}</h3>
                <p className="ai-chat-subtitle">Dubai Real Estate Expert</p>
              </div>
            </div>
            <button onClick={toggleChat} className="ai-chat-close" aria-label={t("common.close") || "Close"}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div className="ai-chat-welcome">
                <h4 className="ai-chat-welcome-title">👋 Hello! I'm Victoria's AI Assistant</h4>
                <p className="ai-chat-welcome-text">
                  Ask me anything about Dubai real estate, property investments, market trends, or specific areas. I'm
                  here to help!
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-chat-message ${
                  message.role === "user" ? "ai-chat-message-user" : "ai-chat-message-assistant"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isLoading && (
              <div className="ai-chat-typing">
                <div className="ai-chat-typing-dots">
                  <div className="ai-chat-typing-dot"></div>
                  <div className="ai-chat-typing-dot"></div>
                  <div className="ai-chat-typing-dot"></div>
                </div>
                <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", marginLeft: "8px" }}>
                  {t("ai.chat.thinking") || "Victoria is thinking..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="ai-chat-input-area">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={t("ai.chat.placeholder") || "Ask me about Dubai real estate..."}
              className="ai-chat-input"
              disabled={isLoading}
              rows={1}
            />
            <Button type="submit" disabled={!input.trim() || isLoading} className="ai-chat-send" size="sm">
              <Send size={16} />
              <span className="sr-only">{t("ai.chat.send") || "Send"}</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
