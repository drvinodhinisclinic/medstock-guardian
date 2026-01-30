import { Package2, LayoutDashboard, Truck, ClipboardCheck, History, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { OverviewTab } from './OverviewTab';
import { DeliveryTab } from './DeliveryTab';
import { PhysicalAuditTab } from './PhysicalAuditTab';
import { AuditTimelineTab } from './AuditTimelineTab';
import { SalesSummaryTab } from './SalesSummaryTab';
import type { Product } from '@/types/pharmacy';
import { useProductData } from '@/hooks/useProductData';

interface ProductDashboardProps {
  product: Product | null;
}

export function ProductDashboard({ product }: ProductDashboardProps) {
  const {
    stock,
    stockLoading,
    audits,
    auditsLoading,
    sales,
    salesLoading,
    handleDeliverySubmit,
    handlePhysicalAuditSubmit,
    isDeliverySubmitting,
    isAuditSubmitting,
  } = useProductData(product);

  if (!product) {
    return (
      <Card className="h-full flex items-center justify-center bg-card border-border">
        <CardContent className="text-center py-12">
          <Package2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Product Selected</h3>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            Search and select a product from the left panel to view its inventory details and audit history.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tabItems = [
    { value: 'overview', label: 'Overview', icon: LayoutDashboard },
    { value: 'delivery', label: 'Add Delivery', icon: Truck },
    { value: 'physical-count', label: 'Physical Count', icon: ClipboardCheck },
    { value: 'timeline', label: 'Audit Timeline', icon: History },
    { value: 'sales', label: 'Sales Summary', icon: TrendingUp },
  ];

  return (
    <Card className="h-full flex flex-col bg-card border-border shadow-sm overflow-hidden">
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        {/* Tab Header */}
        <div className="px-4 pt-4 border-b border-border bg-secondary/30">
          <TabsList className="w-full h-auto p-1 bg-secondary/50 grid grid-cols-5 gap-1">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 py-2.5 px-3 text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="overview" className="m-0 h-full">
            <OverviewTab 
              product={product} 
              stockInfo={stock} 
              isLoading={stockLoading} 
            />
          </TabsContent>

          <TabsContent value="delivery" className="m-0">
            <DeliveryTab 
              product={product} 
              onSubmit={handleDeliverySubmit}
              isSubmitting={isDeliverySubmitting}
            />
          </TabsContent>

          <TabsContent value="physical-count" className="m-0">
            <PhysicalAuditTab 
              product={product}
              onSubmit={handlePhysicalAuditSubmit}
              isSubmitting={isAuditSubmitting}
            />
          </TabsContent>

          <TabsContent value="timeline" className="m-0">
            <AuditTimelineTab 
              audits={audits}
              isLoading={auditsLoading}
            />
          </TabsContent>

          <TabsContent value="sales" className="m-0">
            <SalesSummaryTab 
              sales={sales}
              isLoading={salesLoading}
              productName={product.ProductName}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
