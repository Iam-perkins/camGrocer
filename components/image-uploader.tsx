"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Save, X, Check } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void
  defaultImage?: string
  title?: string
  description?: string
  label?: React.ReactNode
}

export function ImageUploader({
  onImageSelected,
  defaultImage = "/placeholder.svg",
  title = "Upload Image",
  description = "Upload an image for your product",
  label,
}: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isSaved, setIsSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        setImageName(file.name)
        setIsSaved(false) // Reset saved state when new image is selected
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value)
    setIsSaved(false) // Reset saved state when URL changes
  }

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setSelectedImage(imageUrl)
      // Extract filename from URL
      const urlParts = imageUrl.split("/")
      const fileName = urlParts[urlParts.length - 1].split("?")[0]
      setImageName(fileName || "image")
      setIsSaved(false) // Reset saved state when new image is loaded
    }
  }

  const handleSave = () => {
    if (selectedImage) {
      // Call onImageSelected first to update parent state
      onImageSelected(selectedImage)
      // Then show success message
      setIsSaved(true)
      // Reset saved state after 2 seconds
      setTimeout(() => {
        setIsSaved(false)
      }, 2000)
    }
  }

  const handleClear = () => {
    setSelectedImage(null)
    setImageName("")
    setImageUrl("")
    setIsSaved(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="image">{label || "Image"}</Label>
              <Input id="image" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </TabsContent>
          <TabsContent value="url" className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="url">{label || "Image URL"}</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
                <Button type="button" size="sm" onClick={handleUrlSubmit}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <div className="relative h-48 w-full border rounded-md overflow-hidden bg-muted">
            {selectedImage ? (
              <Image src={selectedImage || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            ) : (
              <Image src={defaultImage || "/placeholder.svg"} alt="Default" fill className="object-contain" />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClear}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <AnimatePresence mode="wait">
          {isSaved ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-md"
            >
              <Check className="h-4 w-4" />
              <span>Saved!</span>
            </motion.div>
          ) : (
        <Button onClick={handleSave} disabled={!selectedImage}>
          <Save className="h-4 w-4 mr-2" />
          Save Image
        </Button>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  )
}
