"use client";

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Upload, Image as ImageIcon, Clock, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Loader2 } from 'lucide-react';

interface StoreProfileFormProps {
  initialData?: any; // Replace with your store type
  onSuccess?: () => void;
}

type BusinessDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export function StoreProfileForm({ initialData, onSuccess }: StoreProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { open: '09:00', close: '18:00', isOpen: true },
    tuesday: { open: '09:00', close: '18:00', isOpen: true },
    wednesday: { open: '09:00', close: '18:00', isOpen: true },
    thursday: { open: '09:00', close: '18:00', isOpen: true },
    friday: { open: '09:00', close: '18:00', isOpen: true },
    saturday: { open: '10:00', close: '16:00', isOpen: false },
    sunday: { open: '10:00', close: '16:00', isOpen: false },
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    banner: '',
    contact: {
      email: '',
      phone: '',
      address: '',
      city: '',
      region: '',
      country: 'Cameroon',
      postalCode: '',
    },
    socialMedia: {
      website: '',
      facebook: '',
      instagram: '',
      twitter: '',
    },
  });

  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        logo: initialData.logo || '',
        banner: initialData.banner || '',
        contact: {
          email: initialData.contact?.email || '',
          phone: initialData.contact?.phone || '',
          address: initialData.contact?.address || '',
          city: initialData.contact?.city || '',
          region: initialData.contact?.region || '',
          country: initialData.contact?.country || 'Cameroon',
          postalCode: initialData.contact?.postalCode || '',
        },
        socialMedia: {
          website: initialData.socialMedia?.website || '',
          facebook: initialData.socialMedia?.facebook || '',
          instagram: initialData.socialMedia?.instagram || '',
          twitter: initialData.socialMedia?.twitter || '',
        },
      });

      if (initialData.businessHours) setBusinessHours(initialData.businessHours);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects (contact and socialMedia)
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value
        }
      }));
    } else if (name.startsWith('socialMedia.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBusinessHoursChange = (day: BusinessDay, field: 'open' | 'close', value: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const toggleDayOpen = (day: BusinessDay, isOpen: boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen
      }
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validate file type
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WebP, or AVIF image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Set loading state
      if (type === 'logo') {
        setIsUploadingLogo(true);
      } else {
        setIsUploadingBanner(true);
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Update form data with the uploaded image URL
      setFormData(prev => ({
        ...prev,
        [type]: data.url
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      // Reset loading state
    if (type === 'logo') {
        setIsUploadingLogo(false);
    } else {
        setIsUploadingBanner(false);
      }
      // Reset file input
      if (type === 'logo' && logoInputRef.current) {
        logoInputRef.current.value = '';
      } else if (type === 'banner' && bannerInputRef.current) {
        bannerInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const storeData = {
        ...formData,
        businessHours,
      };

      // Determine if this is a new store or an update
      const method = initialData ? 'PUT' : 'POST';
      const response = await fetch('/api/store', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save store profile');
      }

      const data = await response.json();
      
      toast({
        title: "Success",
        description: initialData ? "Store profile updated successfully!" : "Store profile created successfully!",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving store profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save store profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderBusinessHours = () => {
    return Object.entries(businessHours).map(([day, hours]) => (
      <div key={day} className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-2 font-medium capitalize">{day}</div>
        <div className="col-span-2">
          <Switch
            checked={hours.isOpen}
            onCheckedChange={(checked) => toggleDayOpen(day as BusinessDay, checked)}
          />
        </div>
        <div className="col-span-8 grid grid-cols-2 gap-2">
          <Input
            type="time"
            value={hours.open}
            onChange={(e) => handleBusinessHoursChange(day as BusinessDay, 'open', e.target.value)}
            disabled={!hours.isOpen}
          />
          <Input
            type="time"
            value={hours.close}
            onChange={(e) => handleBusinessHoursChange(day as BusinessDay, 'close', e.target.value)}
            disabled={!hours.isOpen}
          />
        </div>
      </div>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Store Images */}
      <Card>
        <CardHeader>
          <CardTitle>Store Images</CardTitle>
          <CardDescription>Add your store logo and banner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
            <Label>Store Logo</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="Store logo"
                      className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="logo-upload"
                    ref={logoInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                    disabled={isUploadingLogo}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isUploadingLogo}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                    <Upload className="h-4 w-4 mr-2" />
                        {formData.logo ? 'Change Logo' : 'Upload Logo'}
                      </>
                    )}
                  </Button>
              </div>
            </div>
          </div>

            <div>
            <Label>Store Banner</Label>
              <div className="mt-2">
                <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg border bg-muted">
                  {formData.banner ? (
                    <img
                      src={formData.banner}
                      alt="Store banner"
                      className="h-full w-full object-cover"
                    />
              ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                type="file"
                id="banner-upload"
                    ref={bannerInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'banner')}
                    disabled={isUploadingBanner}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    disabled={isUploadingBanner}
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    {isUploadingBanner ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                  <Upload className="h-4 w-4 mr-2" />
                        {formData.banner ? 'Change Banner' : 'Upload Banner'}
                      </>
                    )}
                </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your store's basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter store name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Store Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about your store"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How can customers reach you?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact.email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="contact.email"
                  name="contact.email"
                  type="email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  placeholder="contact@yourstore.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact.phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="contact.phone"
                  name="contact.phone"
                  type="tel"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  placeholder="+237 6XX XXX XXX"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact.address">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="contact.address"
                name="contact.address"
                value={formData.contact.address}
                onChange={handleInputChange}
                placeholder="123 Store Street"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact.city">City *</Label>
              <Input
                id="contact.city"
                name="contact.city"
                value={formData.contact.city}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact.region">Region *</Label>
              <Input
                id="contact.region"
                name="contact.region"
                value={formData.contact.region}
                onChange={handleInputChange}
                placeholder="Region"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact.postalCode">Postal Code</Label>
              <Input
                id="contact.postalCode"
                name="contact.postalCode"
                value={formData.contact.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Business Hours</CardTitle>
          </div>
          <CardDescription>Set your store's operating hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderBusinessHours()}
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Social Media (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Add your social media profiles to help customers connect with your store.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
                  <Label htmlFor="socialMedia.website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
              <Input
                id="socialMedia.website"
                name="socialMedia.website"
                value={formData.socialMedia.website}
                onChange={handleInputChange}
                    placeholder="https://your-store.com"
              />
            </div>
            <div className="space-y-2">
                  <Label htmlFor="socialMedia.facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                <Input
                  id="socialMedia.facebook"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleInputChange}
                    placeholder="facebook.com/your-store"
                />
            </div>
            <div className="space-y-2">
                  <Label htmlFor="socialMedia.instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                <Input
                  id="socialMedia.instagram"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleInputChange}
                    placeholder="@your-store"
                />
          </div>
          <div className="space-y-2">
                  <Label htmlFor="socialMedia.twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
              <Input
                id="socialMedia.twitter"
                name="socialMedia.twitter"
                value={formData.socialMedia.twitter}
                onChange={handleInputChange}
                    placeholder="@your-store"
              />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
