"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedGradientProps {
  className?: string
  children: React.ReactNode
}

export function AnimatedGradient({ className, children }: AnimatedGradientProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-100 via-green-50 to-green-200 opacity-70"
        animate={{
          background: [
            "linear-gradient(to right, rgba(220, 252, 231, 0.7), rgba(240, 253, 244, 0.7), rgba(220, 252, 231, 0.7))",
            "linear-gradient(to right, rgba(240, 253, 244, 0.7), rgba(220, 252, 231, 0.7), rgba(240, 253, 244, 0.7))",
            "linear-gradient(to right, rgba(220, 252, 231, 0.7), rgba(240, 253, 244, 0.7), rgba(220, 252, 231, 0.7))",
          ],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(74, 222, 128, 0.4) 0%, rgba(74, 222, 128, 0) 50%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
