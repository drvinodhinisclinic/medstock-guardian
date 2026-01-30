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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Search */}
          <div className="lg:col-span-4 xl:col-span-3 h-full min-h-[400px] lg:min-h-0">
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
          <div className="lg:col-span-8 xl:col-span-9 h-full min-h-[500px] lg:min-h-0">
            <ProductDashboard product={selectedProduct} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
