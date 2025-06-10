"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUploader } from "@/components/image-uploader"
import { Input } from "@/components/ui/input"
import { Trash2, Edit, Plus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { productImages, storeImages, categoryImages } from "@/lib/product-data"

// Define the image types
type ImageCategory = "products" | "stores" | "categories"

// Define the image item type
interface ImageItem {
  id: string
  name: string
  url: string
  category: ImageCategory
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>("products")
  const [isAddingImage, setIsAddingImage] = useState(false)
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Load images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem("customImages")
    if (savedImages) {
      setImages(JSON.parse(savedImages))
    } else {
      // Initialize with some default entries based on the product-data.ts file
      const initialImages: ImageItem[] = [
        // Add a few examples from each category
        { id: "plantains", name: "Plantains", url: productImages.plantains, category: "products" },
        { id: "cassava", name: "Cassava", url: productImages.cassava, category: "products" },
        { id: "redBeans", name: "Red Beans", url: productImages.redBeans, category: "products" },
        { id: "store1", name: "Store 1", url: storeImages.store1, category: "stores" },
        { id: "store2", name: "Store 2", url: storeImages.store2, category: "stores" },
        { id: "fruits", name: "Fruits", url: categoryImages.fruits, category: "categories" },
        { id: "vegetables", name: "Vegetables", url: categoryImages.vegetables, category: "categories" },
      ]
      setImages(initialImages)
      localStorage.setItem("customImages", JSON.stringify(initialImages))
    }
  }, [])

  // Save images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customImages", JSON.stringify(images))
  }, [images])

  // Handle image upload
  const handleImageUpload = (imageUrl: string, imageName: string) => {
    if (editingImage) {
      // Update existing image
      const updatedImages = images.map((img) =>
        img.id === editingImage.id ? { ...img, name: imageName, url: imageUrl } : img,
      )
      setImages(updatedImages)
      setEditingImage(null)
    } else {
      // Add new image
      const newImage: ImageItem = {
        id: Date.now().toString(),
        name: imageName,
        url: imageUrl,
        category: selectedCategory,
      }
      setImages([...images, newImage])
    }
    setIsAddingImage(false)
  }

  // Handle image deletion
  const handleDeleteImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id)
    setImages(updatedImages)
  }

  // Handle editing an image
  const handleEditImage = (image: ImageItem) => {
    setEditingImage(image)
    setIsAddingImage(true)
  }

  // Filter images by category and search query
  const filteredImages = images.filter(
    (img) =>
      img.category === selectedCategory &&
      (searchQuery === "" || img.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Image Management</h1>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          Upload and manage your custom images for products, stores, and categories. These images will be used
          throughout the application.
        </p>
      </div>

      {isAddingImage ? (
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => {
              setIsAddingImage(false)
              setEditingImage(null)
            }}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Images
          </Button>
          <ImageUploader
            onImageUpload={handleImageUpload}
            defaultImage={editingImage?.url || "/placeholder.svg"}
            title={editingImage ? "Edit Image" : "Add New Image"}
            description={
              editingImage ? `Edit image for ${editingImage.name}` : `Upload a new image for ${selectedCategory}`
            }
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <Tabs
              defaultValue="products"
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as ImageCategory)}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="stores">Stores</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-4">
              <div className="relative w-full md:w-64">
                <Input
                  type="search"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={() => setIsAddingImage(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground mb-4">No images found in this category</p>
              <Button onClick={() => setIsAddingImage(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative h-48 w-full bg-muted">
                    <Image src={image.url || "/placeholder.svg"} alt={image.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{image.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 truncate">{image.id}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEditImage(image)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(image.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
