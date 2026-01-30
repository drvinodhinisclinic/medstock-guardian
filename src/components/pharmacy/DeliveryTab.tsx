import { useState } from 'react';
import { Truck, Package, FileText, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    supplier: '',
    invoiceNo: '',
    receivedDate: format(new Date(), 'yyyy-MM-dd'),
    batch: product.Batch,
    expiry: product.Exp.split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ProductID: product.ProductID,
      LocationID: product.LocationID,
      Batch: formData.batch,
      Exp: formData.expiry,
      QuantityReceived: parseInt(formData.quantity, 10),
      InvoiceNo: formData.invoiceNo,
    });

    // Reset form after submission
    setFormData(prev => ({
      ...prev,
      quantity: '',
      supplier: '',
      invoiceNo: '',
    }));
  };

  const isFormValid = formData.quantity && formData.invoiceNo && parseInt(formData.quantity) > 0;

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
            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Quantity Received
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

            {/* Supplier */}
            <div className="space-y-2">
              <Label htmlFor="supplier" className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Supplier (Optional)
              </Label>
              <Input
                id="supplier"
                type="text"
                placeholder="Enter supplier name"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              />
            </div>

            {/* Invoice Number */}
            <div className="space-y-2">
              <Label htmlFor="invoiceNo" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Invoice Number
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
              disabled={!isFormValid || isSubmitting}
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
