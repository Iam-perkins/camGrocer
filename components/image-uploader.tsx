"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void
  defaultImage?: string
  label?: string
}

export function ImageUploader({ onImageSelected, defaultImage, label = "Upload Image" }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Create a local preview URL
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    // In a real app, you would upload the file to a server or cloud storage here
    // For now, we'll just simulate an upload delay and use the local URL
    setTimeout(() => {
      setIsUploading(false)
      onImageSelected(localUrl)
    }, 1000)

    // In a production app, you would do something like this:
    // const formData = new FormData()
    // formData.append('image', file)
    // fetch('/api/upload', { method: 'POST', body: formData })
    //   .then(response => response.json())
    //   .then(data => {
    //     setIsUploading(false)
    //     onImageSelected(data.url)
    //   })
    //   .catch(error => {
    //     console.error('Upload failed:', error)
    //     setIsUploading(false)
    //   })
  }

  const handleClearImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageSelected("")
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>

      {previewUrl ? (
        <div className="relative w-full aspect-square max-w-[300px] rounded-md overflow-hidden border">
          <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          <button
            onClick={handleClearImage}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload an image</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {isUploading && <div className="text-sm text-blue-600">Uploading...</div>}
    </div>
  )
}
