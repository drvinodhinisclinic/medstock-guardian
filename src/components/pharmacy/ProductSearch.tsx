import { Search, Package, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/pharmacy';
import { format } from 'date-fns';

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products: Product[];
  isLoading: boolean;
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

export function ProductSearch({
  searchQuery,
  onSearchChange,
  products,
  isLoading,
  selectedProduct,
  onSelectProduct,
}: ProductSearchProps) {
  const getStockStatus = (qty: number) => {
    if (qty <= 0) return { label: 'OUT', className: 'status-mismatch' };
    if (qty < 50) return { label: 'LOW', className: 'status-low' };
    return { label: 'OK', className: 'status-ok' };
  };

  const formatExpiry = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM yyyy');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-sm min-h-0">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Product Search</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by product name or drug..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Product List - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-2">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && searchQuery.length < 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Enter at least 2 characters to search</p>
            </div>
          )}

          {!isLoading && searchQuery.length >= 2 && products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No products found</p>
            </div>
          )}

          {!isLoading && products.map((product) => {
            const status = getStockStatus(product.QtyInStock);
            const isSelected = selectedProduct?.ProductID === product.ProductID && 
                              selectedProduct?.Batch === product.Batch;

            return (
              <button
                key={`${product.ProductID}-${product.Batch}`}
                onClick={() => onSelectProduct(product)}
                className={cn(
                  'w-full text-left p-3 rounded-lg mb-2 transition-all duration-200',
                  'hover:bg-secondary/80 border border-transparent',
                  isSelected 
                    ? 'bg-primary/10 border-primary/30 shadow-sm' 
                    : 'bg-secondary/40'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-medium text-sm text-foreground leading-tight">
                    {product.ProductName}
                  </h3>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', status.className)}>
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {product.Drug}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      Batch: <span className="text-foreground font-medium">{product.Batch}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Exp: <span className="text-foreground">{formatExpiry(product.Exp)}</span>
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {product.QtyInStock} units
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
