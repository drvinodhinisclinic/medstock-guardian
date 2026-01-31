import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createProduct } from '@/lib/api';
import type { NewProductFormData, Product } from '@/types/pharmacy';

interface AddProductDialogProps {
  onProductCreated?: (product: Product) => void;
}

export function AddProductDialog({ onProductCreated }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<NewProductFormData>({
    HSNCode: '',
    Manufacturer: '',
    ProductName: '',
    PackOf: '',
    MRP: '',
    UnitPrice: '',
    Size: '',
    Drug: '',
  });

  const resetForm = () => {
    setFormData({
      HSNCode: '',
      Manufacturer: '',
      ProductName: '',
      PackOf: '',
      MRP: '',
      UnitPrice: '',
      Size: '',
      Drug: '',
    });
    setError(null);
    setSuccess(false);
  };

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (response) => {
      if (response.success && response.data) {
        setSuccess(true);
        // Invalidate product search queries to refresh results
        queryClient.invalidateQueries({ queryKey: ['products', 'search'] });
        
        // Notify parent with newly created product
        if (onProductCreated) {
          onProductCreated(response.data);
        }
        
        // Close dialog after delay to show success message
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 1500);
      } else {
        setError(response.message || 'Failed to create product');
      }
    },
    onError: (err: Error) => {
      if (err.message.toLowerCase().includes('duplicate')) {
        setError('A product with this name already exists');
      } else {
        setError(err.message || 'Failed to create product');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.ProductName.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.MRP.trim() || isNaN(parseFloat(formData.MRP))) {
      setError('Valid MRP is required');
      return;
    }

    mutation.mutate(formData);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const updateField = (field: keyof NewProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const isFormValid = formData.ProductName.trim() && formData.MRP.trim();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Add New Product
          </DialogTitle>
          <DialogDescription>
            Enter product details to add to the inventory system.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="p-3 rounded-full bg-status-ok/15">
              <CheckCircle2 className="h-8 w-8 text-status-ok" />
            </div>
            <p className="text-lg font-medium text-foreground">Product Created!</p>
            <p className="text-sm text-muted-foreground">
              {formData.ProductName} has been added successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Product Name - Required */}
            <div className="space-y-2">
              <Label htmlFor="productName">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={formData.ProductName}
                onChange={(e) => updateField('ProductName', e.target.value)}
                disabled={mutation.isPending}
              />
            </div>

            {/* MRP - Required */}
            <div className="space-y-2">
              <Label htmlFor="mrp">
                MRP <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mrp"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter MRP"
                value={formData.MRP}
                onChange={(e) => updateField('MRP', e.target.value)}
                disabled={mutation.isPending}
              />
            </div>

            {/* HSN Code & Unit Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hsnCode">HSN Code</Label>
                <Input
                  id="hsnCode"
                  placeholder="HSN code"
                  value={formData.HSNCode}
                  onChange={(e) => updateField('HSNCode', e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Unit price"
                  value={formData.UnitPrice}
                  onChange={(e) => updateField('UnitPrice', e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>
            </div>

            {/* Manufacturer */}
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer (MFR)</Label>
              <Input
                id="manufacturer"
                placeholder="Enter manufacturer name"
                value={formData.Manufacturer}
                onChange={(e) => updateField('Manufacturer', e.target.value)}
                disabled={mutation.isPending}
              />
            </div>

            {/* Pack Of & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packOf">Pack Of</Label>
                <Input
                  id="packOf"
                  placeholder="e.g., 10, 30"
                  value={formData.PackOf}
                  onChange={(e) => updateField('PackOf', e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  placeholder="e.g., 500mg"
                  value={formData.Size}
                  onChange={(e) => updateField('Size', e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>
            </div>

            {/* Drug / Composition */}
            <div className="space-y-2">
              <Label htmlFor="drug">Drug / Composition</Label>
              <Textarea
                id="drug"
                placeholder="Enter drug composition"
                value={formData.Drug}
                onChange={(e) => updateField('Drug', e.target.value)}
                disabled={mutation.isPending}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isFormValid || mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Product...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
