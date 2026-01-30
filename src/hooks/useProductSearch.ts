import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/lib/api';
import { useState, useDeferredValue } from 'react';

export function useProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', 'search', deferredQuery],
    queryFn: () => searchProducts(deferredQuery),
    enabled: deferredQuery.length >= 2,
    staleTime: 30000, // 30 seconds
  });

  return {
    searchQuery,
    setSearchQuery,
    products,
    isLoading: isLoading && deferredQuery.length >= 2,
    error,
  };
}
