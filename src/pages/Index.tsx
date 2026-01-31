import { useState } from 'react';
import { Pill, Activity } from 'lucide-react';
import { ProductSearch } from '@/components/pharmacy/ProductSearch';
import { ProductDashboard } from '@/components/pharmacy/ProductDashboard';
import { useProductSearch } from '@/hooks/useProductSearch';
import type { Product } from '@/types/pharmacy';

const Index = () => {
  const { searchQuery, setSearchQuery, products, isLoading } = useProductSearch();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 bg-card border-b border-border shadow-sm z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">PharmAudit</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Inventory & Audit Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-ok/10 border border-status-ok/30">
                <Activity className="h-4 w-4 text-status-ok animate-pulse-soft" />
                <span className="text-xs font-medium text-status-ok">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Flex grow with min-height: 0 for proper scrolling */}
      <main className="flex-1 min-h-0 w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel - Search */}
          <div className="lg:col-span-4 xl:col-span-3 min-h-0 flex flex-col">
            <ProductSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              products={products}
              isLoading={isLoading}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
            />
          </div>

          {/* Right Panel - Dashboard */}
          <div className="lg:col-span-8 xl:col-span-9 min-h-0 flex flex-col">
            <ProductDashboard product={selectedProduct} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
