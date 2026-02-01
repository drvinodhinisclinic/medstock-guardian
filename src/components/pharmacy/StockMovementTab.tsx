import { useState } from 'react';
import { ArrowRightLeft, MapPin, Package, Calendar, FileText, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getLocations, submitStockMovement } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { Product, StockMovementFormData } from '@/types/pharmacy';

interface StockMovementTabProps {
  product: Product;
}

export function StockMovementTab({ product }: StockMovementTabProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fromLocationId: '',
    toLocationId: '',
    batch: product.Batch ?? '',
    expiry: product.Exp ? product.Exp.split('T')[0] : '',
    quantity: '',
    remarks: '',
  });

  // Fetch locations
  const { data: locations = [], isLoading: locationsLoading, isError: locationsError } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    staleTime: 5 * 60 * 1000,
  });

  // Submit mutation
  const { mutate: moveStock, isPending: isSubmitting } = useMutation({
    mutationFn: submitStockMovement,
    onSuccess: () => {
      toast({
        title: 'Stock Moved Successfully',
        description: `${formData.quantity} units moved between locations.`,
      });
      // Invalidate stock queries
      queryClient.invalidateQueries({ queryKey: ['stock', product.ProductID] });
      queryClient.invalidateQueries({ queryKey: ['audits', product.ProductID] });
      // Reset form
      setFormData(prev => ({
        ...prev,
        fromLocationId: '',
        toLocationId: '',
        quantity: '',
        remarks: '',
      }));
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Move Stock',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: StockMovementFormData = {
      ProductID: product.ProductID,
      FromLocationID: parseInt(formData.fromLocationId, 10),
      ToLocationID: parseInt(formData.toLocationId, 10),
      Batch: formData.batch,
      Exp: formData.expiry,
      Quantity: parseInt(formData.quantity, 10),
      Remarks: formData.remarks || undefined,
    };

    moveStock(payload);
  };

  // Validation
  const isSameLocation = formData.fromLocationId && formData.toLocationId && formData.fromLocationId === formData.toLocationId;
  const isQuantityValid = formData.quantity && parseInt(formData.quantity) > 0;
  const isFormValid = 
    formData.fromLocationId && 
    formData.toLocationId && 
    formData.batch &&
    formData.expiry &&
    !isSameLocation &&
    isQuantityValid;

  // Get location names for summary
  const fromLocation = locations.find(l => l.LocationID.toString() === formData.fromLocationId);
  const toLocation = locations.find(l => l.LocationID.toString() === formData.toLocationId);

  return (
    <div className="animate-fade-in">
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/15">
              <ArrowRightLeft className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Move Stock</CardTitle>
              <CardDescription>Transfer {product.ProductName} between locations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* From Location */}
            <div className="space-y-2">
              <Label htmlFor="fromLocation" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                From Location <span className="text-destructive">*</span>
              </Label>
              {locationsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : locationsError ? (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Failed to load locations. Please refresh to try again.</span>
                </div>
              ) : (
                <Select
                  value={formData.fromLocationId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fromLocationId: value }))}
                >
                  <SelectTrigger id="fromLocation" className="w-full">
                    <SelectValue placeholder="Select source location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem 
                        key={location.LocationID} 
                        value={location.LocationID.toString()}
                      >
                        {location.LocationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Direction Indicator */}
            {formData.fromLocationId && (
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground">
                  <span className="text-sm font-medium">Move to</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            )}

            {/* To Location */}
            <div className="space-y-2">
              <Label htmlFor="toLocation" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                To Location <span className="text-destructive">*</span>
              </Label>
              {locationsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : locationsError ? (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Failed to load locations. Please refresh to try again.</span>
                </div>
              ) : (
                <Select
                  value={formData.toLocationId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, toLocationId: value }))}
                >
                  <SelectTrigger id="toLocation" className="w-full">
                    <SelectValue placeholder="Select destination location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem 
                        key={location.LocationID} 
                        value={location.LocationID.toString()}
                        disabled={location.LocationID.toString() === formData.fromLocationId}
                      >
                        {location.LocationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {isSameLocation && (
                <p className="text-xs text-destructive">Source and destination locations must be different</p>
              )}
            </div>

            {/* Batch & Expiry */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch" className="flex items-center gap-2">
                  Batch Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="batch"
                  type="text"
                  placeholder="Enter batch no."
                  value={formData.batch}
                  onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Expiry Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expiry"
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Quantity to Move <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="text-lg font-medium"
              />
              {formData.quantity && parseInt(formData.quantity) <= 0 && (
                <p className="text-xs text-destructive">Quantity must be greater than 0</p>
              )}
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Remarks <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="remarks"
                placeholder="Add any notes about this stock movement..."
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Confirmation Summary */}
            {isFormValid && fromLocation && toLocation && (
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Confirm Stock Movement</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Moving</span>
                  <span className="font-semibold text-blue-600">{formData.quantity} units</span>
                  <span>from</span>
                  <span className="font-medium text-foreground">{fromLocation.LocationName}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="font-medium text-foreground">{toLocation.LocationName}</span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!isFormValid || isSubmitting || locationsError}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Moving Stock...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Move Stock
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
