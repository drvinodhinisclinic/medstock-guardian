import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductStock, getProductAudits, submitDelivery, submitPhysicalAudit, getMonthlySalesSummary } from '@/lib/api';
import type { DeliveryFormData, PhysicalAuditFormData, Product } from '@/types/pharmacy';
import { toast } from 'sonner';

export function useProductData(product: Product | null) {
  const queryClient = useQueryClient();
  const productId = product?.ProductID;

  // Fetch stock info
  const stockQuery = useQuery({
    queryKey: ['product', productId, 'stock'],
    queryFn: () => getProductStock(productId!),
    enabled: !!productId,
    staleTime: 10000,
  });

  // Fetch audits
  const auditsQuery = useQuery({
    queryKey: ['product', productId, 'audits'],
    queryFn: () => getProductAudits(productId!),
    enabled: !!productId,
    staleTime: 10000,
  });

  // Fetch sales summary
  const salesQuery = useQuery({
    queryKey: ['product', productId, 'sales'],
    queryFn: () => getMonthlySalesSummary(productId!),
    enabled: !!productId,
    staleTime: 60000,
  });

  // Delivery mutation
  const deliveryMutation = useMutation({
    mutationFn: submitDelivery,
    onSuccess: () => {
      toast.success('Delivery recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', 'search'] });
    },
    onError: (error) => {
      toast.error(`Failed to record delivery: ${error.message}`);
    },
  });

  // Physical audit mutation
  const physicalAuditMutation = useMutation({
    mutationFn: submitPhysicalAudit,
    onSuccess: () => {
      toast.success('Physical audit recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', 'search'] });
    },
    onError: (error) => {
      toast.error(`Failed to record audit: ${error.message}`);
    },
  });

  const handleDeliverySubmit = (data: DeliveryFormData) => {
    deliveryMutation.mutate(data);
  };

  const handlePhysicalAuditSubmit = (data: PhysicalAuditFormData) => {
    physicalAuditMutation.mutate(data);
  };

  return {
    stock: stockQuery.data ?? [],
    stockLoading: stockQuery.isLoading,
    audits: auditsQuery.data ?? [],
    auditsLoading: auditsQuery.isLoading,
    sales: salesQuery.data ?? [],
    salesLoading: salesQuery.isLoading,
    handleDeliverySubmit,
    handlePhysicalAuditSubmit,
    isDeliverySubmitting: deliveryMutation.isPending,
    isAuditSubmitting: physicalAuditMutation.isPending,
  };
}
