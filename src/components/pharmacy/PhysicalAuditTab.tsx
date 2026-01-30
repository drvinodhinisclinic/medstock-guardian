import { useState } from 'react';
import { ClipboardCheck, Package, ArrowRightLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Product, PhysicalAuditFormData } from '@/types/pharmacy';
import { cn } from '@/lib/utils';

interface PhysicalAuditTabProps {
  product: Product;
  onSubmit: (data: PhysicalAuditFormData) => void;
  isSubmitting: boolean;
}

export function PhysicalAuditTab({ product, onSubmit, isSubmitting }: PhysicalAuditTabProps) {
  const [countedQty, setCountedQty] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const systemStock = product.QtyInStock;
  const counted = parseInt(countedQty) || 0;
  const variance = counted - systemStock;
  const hasMismatch = countedQty !== '' && variance !== 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasMismatch) {
      setShowConfirmDialog(true);
    } else {
      submitAudit();
    }
  };

  const submitAudit = () => {
    onSubmit({
      ProductID: product.ProductID,
      LocationID: product.LocationID,
      Batch: product.Batch,
      Exp: product.Exp.split('T')[0],
      CountedQuantity: counted,
      Remarks: remarks || 'Physical stock count',
    });

    setCountedQty('');
    setRemarks('');
    setShowConfirmDialog(false);
  };

  const getVarianceDisplay = () => {
    if (countedQty === '') return null;
    
    if (variance === 0) {
      return (
        <div className="flex items-center gap-2 text-status-ok">
          <ClipboardCheck className="h-4 w-4" />
          <span className="font-medium">Stock matches</span>
        </div>
      );
    }

    return (
      <div className={cn(
        'flex items-center gap-2 font-medium',
        variance > 0 ? 'variance-positive' : 'variance-negative'
      )}>
        <ArrowRightLeft className="h-4 w-4" />
        <span>
          {variance > 0 ? '+' : ''}{variance} units ({variance > 0 ? 'Surplus' : 'Shortage'})
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="animate-fade-in">
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg audit-physical">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Physical Stock Count</CardTitle>
                <CardDescription>Record actual counted stock for {product.ProductName}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* System Stock Display */}
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="text-sm font-medium">System Stock</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{systemStock}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Batch: {product.Batch} | Location: {product.LocationName}
                </p>
              </div>

              {/* Counted Stock Input */}
              <div className="space-y-2">
                <Label htmlFor="countedQty" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  Counted Stock
                </Label>
                <Input
                  id="countedQty"
                  type="number"
                  min="0"
                  placeholder="Enter counted quantity"
                  value={countedQty}
                  onChange={(e) => setCountedQty(e.target.value)}
                  className={cn(
                    'text-lg font-medium',
                    hasMismatch && 'border-status-mismatch focus-visible:ring-status-mismatch'
                  )}
                />
              </div>

              {/* Variance Display */}
              {countedQty !== '' && (
                <div className={cn(
                  'p-4 rounded-lg border',
                  variance === 0 
                    ? 'bg-status-ok/10 border-status-ok/30' 
                    : variance > 0 
                      ? 'bg-status-ok/10 border-status-ok/30'
                      : 'bg-status-mismatch/10 border-status-mismatch/30'
                )}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Variance</span>
                    {getVarianceDisplay()}
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  placeholder="Add notes about this count..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={countedQty === '' || isSubmitting}
                variant={hasMismatch ? 'destructive' : 'default'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    {hasMismatch ? 'Submit with Variance' : 'Submit Count'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mismatch Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-status-mismatch/20">
                <AlertTriangle className="h-5 w-5 text-status-mismatch" />
              </div>
              <AlertDialogTitle>Confirm Stock Mismatch</AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>You are about to record a stock variance:</p>
                <div className="p-3 bg-secondary rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">System Stock:</span>
                    <span className="font-medium text-foreground">{systemStock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Counted Stock:</span>
                    <span className="font-medium text-foreground">{counted} units</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Variance:</span>
                    <span className={cn(
                      'font-semibold',
                      variance > 0 ? 'text-status-ok' : 'text-status-mismatch'
                    )}>
                      {variance > 0 ? '+' : ''}{variance} units
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will update the system stock to match your counted quantity.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={submitAudit}
              className="bg-status-mismatch hover:bg-status-mismatch/90"
            >
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
