import { Package, MapPin, Calendar, Hash, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import type { Product, StockInfo } from '@/types/pharmacy';
import { cn } from '@/lib/utils';

interface OverviewTabProps {
  product: Product;
  stockInfo: StockInfo[];
  isLoading: boolean;
}

export function OverviewTab({ product, stockInfo, isLoading }: OverviewTabProps) {
  const getStockStatus = (qty: number) => {
    if (qty <= 0) return { 
      label: 'OUT OF STOCK', 
      className: 'status-mismatch', 
      icon: XCircle,
      description: 'Product is out of stock'
    };
    if (qty < 50) return { 
      label: 'LOW STOCK', 
      className: 'status-low', 
      icon: AlertTriangle,
      description: 'Stock running low, consider reordering'
    };
    return { 
      label: 'IN STOCK', 
      className: 'status-ok', 
      icon: CheckCircle2,
      description: 'Stock levels are healthy'
    };
  };

  const formatExpiry = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch {
      return 'N/A';
    }
  };

  const isExpiringSoon = (dateStr: string) => {
    try {
      const exp = new Date(dateStr);
      const now = new Date();
      const threeMonths = new Date();
      threeMonths.setMonth(now.getMonth() + 3);
      return exp <= threeMonths;
    } catch {
      return false;
    }
  };

  const status = getStockStatus(product.QtyInStock);
  const StatusIcon = status.icon;
  const expiringSoon = isExpiringSoon(product.Exp);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Product Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-1">{product.ProductName}</h3>
          <p className="text-sm text-muted-foreground">{product.Drug}</p>
        </div>
        <Badge className={cn('px-3 py-1.5 text-xs font-medium', status.className)}>
          <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
          {status.label}
        </Badge>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Hash className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Batch Number</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{product.Batch}</p>
          </CardContent>
        </Card>

        <Card className={cn(
          'border-border/50',
          expiringSoon ? 'bg-status-low/10 border-status-low/30' : 'bg-secondary/30'
        )}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Expiry Date</span>
            </div>
            <p className={cn(
              'text-lg font-semibold',
              expiringSoon ? 'text-status-low' : 'text-foreground'
            )}>
              {formatExpiry(product.Exp)}
              {expiringSoon && (
                <span className="ml-2 text-xs font-normal">(Soon)</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Package className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Current Stock</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{product.QtyInStock}</p>
            <p className="text-xs text-muted-foreground mt-1">units available</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Location</span>
            </div>
            <p className="text-sm font-medium text-foreground">{product.LocationName}</p>
          </CardContent>
        </Card>
      </div>

      {/* MRP Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Maximum Retail Price (MRP)</span>
          <span className="text-xl font-bold text-primary">₹{parseFloat(product.MRP).toFixed(2)}</span>
        </CardContent>
      </Card>

      {/* Status Message */}
      <div className={cn(
        'p-4 rounded-lg border flex items-start gap-3',
        status.label === 'IN STOCK' ? 'bg-status-ok/10 border-status-ok/30' :
        status.label === 'LOW STOCK' ? 'bg-status-low/10 border-status-low/30' :
        'bg-status-mismatch/10 border-status-mismatch/30'
      )}>
        <StatusIcon className={cn(
          'h-5 w-5 mt-0.5',
          status.label === 'IN STOCK' ? 'text-status-ok' :
          status.label === 'LOW STOCK' ? 'text-status-low' :
          'text-status-mismatch'
        )} />
        <div>
          <p className="font-medium text-foreground text-sm">{status.description}</p>
          {status.label === 'LOW STOCK' && (
            <p className="text-xs text-muted-foreground mt-1">
              Current stock: {product.QtyInStock} units. Consider restocking soon.
            </p>
          )}
        </div>
      </div>

      {/* Additional Stock Info */}
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stockInfo.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Stock at Other Batches</h4>
          {stockInfo.filter(s => s.Batch !== product.Batch).map((stock, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg text-sm">
              <div>
                <span className="font-medium">{stock.Batch}</span>
                <span className="text-muted-foreground ml-2">Exp: {formatExpiry(stock.Exp)}</span>
              </div>
              <span className="font-semibold">{stock.QtyInStock} units</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
