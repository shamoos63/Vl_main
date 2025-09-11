"use client"

import { useEffect, useState, useRef } from "react"

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  something?: string
  prefix?: string
  className?: string
  decimals?: number
  delay?: number // New prop for staggered animations
  glowEffect?: boolean // New prop for glow effect
  pulseOnComplete?: boolean // New prop for completion pulse
}

export default function AnimatedCounter({
  end,
  duration = 2500, // Slightly longer for smoother animation
  something = "",
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0,
  delay = 0, // Default no delay
  glowEffect = true, // Enable glow by default
  pulseOnComplete = true, // Enable completion pulse by default
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }, // Trigger earlier for better UX
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    // Apply delay before starting animation
    const delayTimeout = setTimeout(() => {
      setIsAnimating(true)
      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)

        // Enhanced easing function for smoother animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const animatedValue = easeOutCubic * end

        // Round to the desired number of decimal places
        setCount(Number.parseFloat(animatedValue.toFixed(decimals)))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        } else {
          // Ensure the final count is exactly the 'end' value
          setCount(end)
          setIsAnimating(false)
          setIsComplete(true)

          // Trigger completion pulse
          if (pulseOnComplete) {
            setTimeout(() => setIsComplete(false), 600)
          }
        }
      }

      animationFrame = requestAnimationFrame(animate)

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    }, delay)

    return () => clearTimeout(delayTimeout)
  }, [isVisible, end, duration, decimals, delay, pulseOnComplete])

  return (
    <div
      ref={counterRef}
      className={`
        relative inline-block transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"}
        ${className}
      `}
    >
      {/* Background glow effect */}
      {glowEffect && (
        <div
          className={`
            absolute inset-0 rounded-lg transition-all duration-700 ease-out
            ${isAnimating ? "bg-vl-yellow/10 shadow-lg shadow-vl-yellow/20" : ""}
            ${isComplete ? "bg-vl-yellow/15 shadow-xl shadow-vl-yellow/30" : ""}
          `}
          style={{
            filter: isAnimating ? "blur(8px)" : "blur(0px)",
            transform: isAnimating ? "scale(1.1)" : "scale(1)",
          }}
        />
      )}

      {/* Main counter display */}
      <div
        className={`
          relative z-10 font-bold tabular-nums transition-all duration-300 ease-out
          ${isAnimating ? "text-shadow-glow" : ""}
          ${isComplete ? "animate-completion-pulse" : ""}
        `}
        style={{
          textShadow: isAnimating
            ? "0 0 20px rgba(255, 211, 150, 0.6), 0 0 40px rgba(255, 211, 150, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.5)",
          transform: isComplete ? "scale(1.05)" : "scale(1)",
        }}
      >
        
        {prefix}
        
        <span className="counter-digits">{count.toFixed(decimals)}</span>
        
        {suffix}
      </div>

      {/* Animated underline */}
      <div
        className={`
          absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-vl-yellow to-transparent
          transition-all duration-1000 ease-out transform -translate-x-1/2
          ${isAnimating ? "w-full opacity-80" : "w-0 opacity-0"}
          ${isComplete ? "w-full opacity-100 shadow-sm shadow-vl-yellow" : ""}
        `}
      />

      {/* Floating particles effect */}
      {glowEffect && isAnimating && (
        <>
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-vl-yellow rounded-full opacity-60 animate-float-particle-1" />
          <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-vl-yellow rounded-full opacity-40 animate-float-particle-2" />
          <div className="absolute -bottom-1 left-1/4 w-0.5 h-0.5 bg-vl-yellow rounded-full opacity-50 animate-float-particle-3" />
        </>
      )}
    </div>
  )
}
