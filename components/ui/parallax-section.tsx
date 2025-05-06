"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down"
}

export function ParallaxSection({ children, className, speed = 0.2, direction = "up" }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [elementTop, setElementTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  const { scrollY } = useScroll()

  // Calculate the element's position relative to the viewport
  useEffect(() => {
    if (!ref.current) return

    const setValues = () => {
      setElementTop(ref.current?.offsetTop || 0)
      setClientHeight(window.innerHeight)
    }

    setValues()
    window.addEventListener("resize", setValues)

    return () => {
      window.removeEventListener("resize", setValues)
    }
  }, [ref])

  const baseY = elementTop - clientHeight
  const speedFactor = direction === "up" ? -speed : speed

  const y = useTransform(scrollY, [baseY, elementTop + clientHeight], [speedFactor * 100, -speedFactor * 100])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}
