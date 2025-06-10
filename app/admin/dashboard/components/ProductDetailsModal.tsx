"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Package, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface ProductDetailsModalProps {
  product: any;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (product: any) => void;
  isLoading: boolean;
}

export function ProductDetailsModal({ 
  product, 
  onClose, 
  onApprove, 
  onReject,
  isLoading 
}: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Product Review</DialogTitle>
              <DialogDescription>
                Review product details for {product.name}
              </DialogDescription>
            </div>
            <div>
              <Badge variant={product.approvalStatus === 'pending' ? 'secondary' : product.approvalStatus === 'approved' ? 'success' : 'destructive'}>
                {product.approvalStatus}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6">
            {/* Product Images */}
            {product.images?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Product Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image: any, index: number) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <Image
                        src={image.url || '/placeholder-product.jpg'}
                        alt={image.alt || `Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Information */}
            <div>
              <h3 className="text-lg font-medium mb-2">Product Information</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><span className="font-medium">Name:</span> {product.name}</p>
                <p><span className="font-medium">Description:</span> {product.description || 'N/A'}</p>
                <p><span className="font-medium">Price:</span> ${product.price?.toFixed(2)}</p>
                <p><span className="font-medium">Category:</span> {product.category}</p>
                {product.subcategory && (
                  <p><span className="font-medium">Subcategory:</span> {product.subcategory}</p>
                )}
                <p><span className="font-medium">Stock:</span> {product.stock}</p>
                {product.sku && <p><span className="font-medium">SKU:</span> {product.sku}</p>}
                {product.brand && <p><span className="font-medium">Brand:</span> {product.brand}</p>}
                {product.barcode && <p><span className="font-medium">Barcode:</span> {product.barcode}</p>}
              </div>
            </div>

            {/* Store Information */}
            {product.store && (
              <div>
                <h3 className="text-lg font-medium mb-2">Store Information</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Store Name:</span> {product.store.storeName || 'N/A'}</p>
                  {product.store.owner && (
                    <p><span className="font-medium">Owner:</span> {product.store.owner.name || 'N/A'}</p>
                  )}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div>
              <h3 className="text-lg font-medium mb-2">Additional Details</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><span className="font-medium">Created At:</span> {format(new Date(product.createdAt), 'PPpp')}</p>
                {product.updatedAt && (
                  <p><span className="font-medium">Last Updated:</span> {format(new Date(product.updatedAt), 'PPpp')}</p>
                )}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason */}
            {product.approvalStatus === 'rejected' && product.rejectionReason && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-destructive mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Rejection Reason
                </h3>
                <p className="text-sm">{product.rejectionReason}</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          
          {product.approvalStatus === 'pending' && (
            <>
              <Button 
                variant="destructive"
                onClick={() => onReject(product)}
                disabled={isLoading}
              >
                Reject
              </Button>
              <Button 
                onClick={() => onApprove(product._id)}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
