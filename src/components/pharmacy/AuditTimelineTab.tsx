import { Truck, ShoppingCart, ClipboardCheck, Settings, Calendar, Package, FileText, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Audit, AuditType } from '@/types/pharmacy';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AuditTimelineTabProps {
  audits: Audit[];
  isLoading: boolean;
}

const auditTypeConfig: Record<AuditType, { 
  icon: typeof Truck; 
  label: string; 
  className: string;
  color: string;
}> = {
  DELIVERY: { 
    icon: Truck, 
    label: 'Delivery', 
    className: 'audit-delivery',
    color: 'bg-audit-delivery'
  },
  SALE: { 
    icon: ShoppingCart, 
    label: 'Sale', 
    className: 'audit-sale',
    color: 'bg-audit-sale'
  },
  PHYSICAL_COUNT: { 
    icon: ClipboardCheck, 
    label: 'Physical Count', 
    className: 'audit-physical',
    color: 'bg-audit-physical'
  },
  ADJUSTMENT: { 
    icon: Settings, 
    label: 'Adjustment', 
    className: 'audit-adjustment',
    color: 'bg-audit-adjustment'
  },
};

export function AuditTimelineTab({ audits, isLoading }: AuditTimelineTabProps) {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy, HH:mm');
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ClipboardCheck className="h-12 w-12 mb-3 opacity-40" />
        <p className="text-sm">No audit records found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] animate-fade-in">
      <div className="relative pl-6">
        {/* Timeline line */}
        <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-border" />

        {audits.map((audit, index) => {
          const config = auditTypeConfig[audit.AuditType] || auditTypeConfig.ADJUSTMENT;
          const Icon = config.icon;
          const isSale = audit.AuditType === 'SALE';

          return (
            <div key={audit.StockAuditID} className="relative pb-6 last:pb-0">
              {/* Timeline dot */}
              <div className={cn(
                'absolute -left-4 w-4 h-4 rounded-full border-2 border-background',
                config.color
              )} />

              {/* Content card */}
              <div className={cn(
                'ml-4 p-4 rounded-lg border transition-all',
                'hover:shadow-sm',
                isSale ? 'bg-audit-sale/5 border-audit-sale/20' : 'bg-card border-border'
              )}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-xs px-2 py-0.5', config.className)}>
                      <Icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                    {isSale && (
                      <span className="text-xs text-muted-foreground italic">(Read-only)</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(audit.CreatedAt)}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className={cn(
                      'font-medium',
                      audit.QtyChange > 0 ? 'text-status-ok' : 'text-status-mismatch'
                    )}>
                      {audit.QtyChange > 0 ? '+' : ''}{audit.QtyChange}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">By:</span>
                    <span className="font-medium text-foreground">{audit.CreatedByUserName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground ml-5">Before:</span>
                    <span className="text-foreground">{audit.StockBefore}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground ml-5">After:</span>
                    <span className="font-medium text-foreground">{audit.StockAfter}</span>
                  </div>
                </div>

                {/* Reference & Remarks */}
                {(audit.ReferenceNo || audit.Remarks) && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                    {audit.ReferenceNo && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{audit.ReferenceType}:</span>
                        <span className="font-medium text-foreground">{audit.ReferenceNo}</span>
                      </div>
                    )}
                    {audit.Remarks && (
                      <p className="text-sm text-muted-foreground italic pl-5">
                        "{audit.Remarks}"
                      </p>
                    )}
                  </div>
                )}

                {/* Batch info */}
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Batch: {audit.Batch}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
