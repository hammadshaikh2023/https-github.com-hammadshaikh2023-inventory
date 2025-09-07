export type Currency = string;

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Aggregates' | 'Binders' | 'Additives' | 'Lab Supplies';
  stock: number;
  unitOfMeasure: 'Ton' | 'Cubic Meter' | 'Bag' | 'Drum';
  price: number;
  currency: Currency;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  warehouse: string;
  dateAdded: string;
  supplier: string;
  batchNumber: string;
  qualityTestStatus: 'Pending' | 'Passed' | 'Failed';
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

export interface HistoryEntry {
  timestamp: string;
  action: string;
  user: string;
}

export interface SalesOrder {
  id: string;
  customer: {
    name: string;
    email: string;
    shippingAddress: string;
  };
  date: string;
  total: number;
  currency: Currency;
  status: 'Fulfilled' | 'Pending' | 'Cancelled';
  items: OrderItem[];
  history: HistoryEntry[];
}

export interface PurchaseOrder {
    id:string;
    vendor: {
        name: string;
        contactPerson: string;
    };
    date: string;
    total: number;
    currency: Currency;
    status: 'Received' | 'Pending' | 'Cancelled';
    items: OrderItem[];
    history: HistoryEntry[];
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
    capacity: number; // in Tons
    stockCount: number; // in Tons
    manager: string;
    contact: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    password?: string;
    roles: string[];
    designation: string;
    status: 'Active' | 'Blocked';
}

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    type: 'Sales' | 'Purchase' | 'Inventory' | 'User Management';
    action: string;
    details: string;
}

export interface GatePass {
    gatePassId: string;
    orderId: string; // Links to SalesOrder.id
    issueDate: string;
    driverName: string;
    driverContact: string;
    driverIdNumber: string;
    driverLicenseNumber: string;
    vehicleNumber: string;
}