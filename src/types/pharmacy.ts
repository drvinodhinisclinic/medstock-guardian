// Product types
export interface Product {
  ProductID: number;
  ProductName: string;
  Drug: string;
  MRP: string;
  LocationID: number;
  LocationName: string;
  Batch: string;
  Exp: string;
  QtyInStock: number;
}

// Supplier types
export interface Supplier {
  SupplierID: number;
  SupplierName: string;
}

export interface SupplierApiResponse {
  success: boolean;
  data: Supplier[];
}

// Stock information
export interface StockInfo {
  LocationID: number;
  LocationName: string;
  Batch: string;
  Exp: string;
  QtyInStock: number;
}

// Audit types
export type AuditType = 'DELIVERY' | 'SALE' | 'PHYSICAL_COUNT' | 'ADJUSTMENT';

export interface Audit {
  StockAuditID: number;
  ProductID: number;
  ProductName: string;
  LocationID: number;
  LocationName: string;
  Batch: string;
  Exp: string;
  AuditType: AuditType;
  QtyChange: number;
  StockBefore: number;
  StockAfter: number;
  ReferenceType: string | null;
  ReferenceNo: string | null;
  Remarks: string | null;
  CreatedByUserID: number;
  CreatedByUserName: string;
  CreatedAt: string;
}

// Form data types
export interface DeliveryFormData {
  ProductID: number;
  LocationID: number;
  Batch: string;
  Exp: string;
  QuantityReceived: number;
  InvoiceNo: string;
  SupplierID: number;
}

export interface PhysicalAuditFormData {
  ProductID: number;
  LocationID: number;
  Batch: string;
  Exp: string;
  CountedQuantity: number;
  Remarks: string;
}

// API response types
export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  data?: Product;
}

// Stock status type
export type StockStatus = 'OK' | 'LOW' | 'MISMATCH';

// Monthly sales summary
export interface MonthlySalesSummary {
  month: string;
  qtySold: number;
  value: number;
}

// New product form data
export interface NewProductFormData {
  HSNCode?: string;
  Manufacturer?: string;
  ProductName: string;
  PackOf?: string;
  MRP: string;
  UnitPrice?: string;
  Size?: string;
  Drug?: string;
}

// Location types
export interface Location {
  LocationID: number;
  LocationName: string;
}

export interface LocationApiResponse {
  success: boolean;
  data: Location[];
}

// Stock movement types
export interface StockMovementFormData {
  ProductID: number;
  FromLocationID: number;
  ToLocationID: number;
  Batch: string;
  Exp: string;
  Quantity: number;
  Remarks?: string;
}
