import type { Product, Audit, StockInfo, DeliveryFormData, PhysicalAuditFormData, ApiResponse, MonthlySalesSummary, SupplierApiResponse, Supplier, NewProductFormData, CreateProductResponse, Location, LocationApiResponse, StockMovementFormData } from '@/types/pharmacy';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Helper for API calls
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Product search
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  return apiCall<Product[]>(`/api/productmgmt/search?q=${encodeURIComponent(query)}`);
}

// Get product stock
export async function getProductStock(productId: number): Promise<StockInfo[]> {
  return apiCall<StockInfo[]>(`/api/productmgmt/product/${productId}/stock`);
}

// Get product audits
export async function getProductAudits(productId: number): Promise<Audit[]> {
  return apiCall<Audit[]>(`/api/productmgmt/product/${productId}/audits`);
}

// Fetch suppliers
export async function getSuppliers(): Promise<Supplier[]> {
  const response = await apiCall<SupplierApiResponse>('/api/productmgmt/supplier');
  return response.data;
}

// Fetch locations
export async function getLocations(): Promise<Location[]> {
  const response = await apiCall<LocationApiResponse>('/api/productmgmt/locations');
  return response.data;
}

// Submit stock movement
export async function submitStockMovement(data: StockMovementFormData): Promise<ApiResponse> {
  return apiCall<ApiResponse>('/api/productmgmt/movestock', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Create new product
export async function createProduct(data: NewProductFormData): Promise<CreateProductResponse> {
  return apiCall<CreateProductResponse>('/api/productmgmt/newproduct', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Submit delivery
export async function submitDelivery(data: DeliveryFormData): Promise<ApiResponse> {
  return apiCall<ApiResponse>('/api/productmgmt/stock/delivery', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Submit physical audit
export async function submitPhysicalAudit(data: PhysicalAuditFormData): Promise<ApiResponse> {
  return apiCall<ApiResponse>('/api/productmgmt/stock/physical-audit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get monthly sales summary (mock for now as no API provided)
export async function getMonthlySalesSummary(productId: number): Promise<MonthlySalesSummary[]> {
  // This would be: return apiCall<MonthlySalesSummary[]>(`/api/products/${productId}/sales-summary`);
  // Mock data for demonstration
  return Promise.resolve([
    { month: 'Aug 2025', qtySold: 145, value: 4650.40 },
    { month: 'Sep 2025', qtySold: 178, value: 5715.36 },
    { month: 'Oct 2025', qtySold: 132, value: 4239.84 },
    { month: 'Nov 2025', qtySold: 198, value: 6359.76 },
    { month: 'Dec 2025', qtySold: 165, value: 5299.80 },
    { month: 'Jan 2026', qtySold: 89, value: 2858.68 },
  ]);
}
