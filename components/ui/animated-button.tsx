"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button" // Ensure this path is correct

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  hoverScale?: number
}

export function AnimatedButton({ children, className, hoverScale = 1.05, ...props }: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { asChild } = props

  if (asChild) {
    return (
      <motion.div
        whileHover={{ scale: hoverScale }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <span className="relative overflow-hidden">
          <motion.span
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%", opacity: 0 }}
            animate={isHovered ? { x: "100%", opacity: 0.3 } : { x: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ pointerEvents: 'none' }}
          />
          {children}
        </span>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Button className={`relative overflow-hidden ${className}`}>
        <motion.span
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%", opacity: 0 }}
          animate={isHovered ? { x: "100%", opacity: 0.3 } : { x: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ pointerEvents: 'none' }}
        />
        {children}
      </Button>
    </motion.div>
  )
}