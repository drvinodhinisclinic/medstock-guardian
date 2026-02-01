import { useState } from 'react';
import { Truck, Package, FileText, Calendar, Loader2, Building2, AlertCircle, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getSuppliers, getLocations } from '@/lib/api';
import type { Product, DeliveryFormData } from '@/types/pharmacy';
import { format } from 'date-fns';

interface DeliveryTabProps {
  product: Product;
  onSubmit: (data: DeliveryFormData) => void;
  isSubmitting: boolean;
}

export function DeliveryTab({ product, onSubmit, isSubmitting }: DeliveryTabProps) {
  const [formData, setFormData] = useState({
    quantity: '',
    supplierId: '',
    locationId: '',
    invoiceNo: '',
    receivedDate: format(new Date(), 'yyyy-MM-dd'),
    batch: product.Batch ?? '',
    expiry: product.Exp ? product.Exp.split('T')[0] : '',
  });

  // Fetch suppliers
  const { data: suppliers = [], isLoading: suppliersLoading, isError: suppliersError } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch locations
  const { data: locations = [], isLoading: locationsLoading, isError: locationsError } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    staleTime: 5 * 60 * 1000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ProductID: product.ProductID,
      LocationID: parseInt(formData.locationId, 10),
      Batch: formData.batch,
      Exp: formData.expiry,
      QuantityReceived: parseInt(formData.quantity, 10),
      InvoiceNo: formData.invoiceNo,
      SupplierID: parseInt(formData.supplierId, 10),
    });

    // Reset form after submission
    setFormData(prev => ({
      ...prev,
      quantity: '',
      supplierId: '',
      locationId: '',
      invoiceNo: '',
    }));
  };

  const isFormValid = 
    formData.quantity && 
    formData.invoiceNo && 
    formData.supplierId &&
    formData.locationId &&
    parseInt(formData.quantity) > 0;

  return (
    <div className="animate-fade-in">
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-audit-delivery/15">
              <Truck className="h-5 w-5 text-audit-delivery" />
            </div>
            <div>
              <CardTitle className="text-lg">Record Delivery</CardTitle>
              <CardDescription>Add new stock for {product.ProductName}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Supplier */}
            <div className="space-y-2">
              <Label htmlFor="supplier" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Supplier <span className="text-destructive">*</span>
              </Label>
              {suppliersLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : suppliersError ? (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Failed to load suppliers. Please refresh to try again.</span>
                </div>
              ) : (
                <Select
                  value={formData.supplierId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
                >
                  <SelectTrigger id="supplier" className="w-full">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem 
                        key={supplier.SupplierID} 
                        value={supplier.SupplierID.toString()}
                      >
                        {supplier.SupplierName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {!formData.supplierId && !suppliersLoading && !suppliersError && (
                <p className="text-xs text-muted-foreground">Please select a supplier to continue</p>
              )}
            </div>

            {/* Receiving Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Receiving Location <span className="text-destructive">*</span>
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
                  value={formData.locationId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}
                >
                  <SelectTrigger id="location" className="w-full">
                    <SelectValue placeholder="Select receiving location" />
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
              {!formData.locationId && !locationsLoading && !locationsError && (
                <p className="text-xs text-muted-foreground">Please select a location to continue</p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Quantity Received <span className="text-destructive">*</span>
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
            </div>

            {/* Batch & Expiry */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch">Batch Number</Label>
                <Input
                  id="batch"
                  type="text"
                  placeholder="Batch no."
                  value={formData.batch}
                  onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
                />
              </div>
            </div>

            {/* Invoice Number */}
            <div className="space-y-2">
              <Label htmlFor="invoiceNo" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Invoice Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="invoiceNo"
                type="text"
                placeholder="Enter invoice number"
                value={formData.invoiceNo}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNo: e.target.value }))}
              />
            </div>

            {/* Received Date */}
            <div className="space-y-2">
              <Label htmlFor="receivedDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Received Date
              </Label>
              <Input
                id="receivedDate"
                type="date"
                value={formData.receivedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, receivedDate: e.target.value }))}
              />
            </div>

            {/* Summary */}
            {formData.quantity && parseInt(formData.quantity) > 0 && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Adding <span className="font-semibold text-primary">{formData.quantity} units</span> to stock
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  New total will be: <span className="font-semibold text-foreground">{product.QtyInStock + parseInt(formData.quantity)} units</span>
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!isFormValid || isSubmitting || suppliersError || locationsError}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Record Delivery
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
