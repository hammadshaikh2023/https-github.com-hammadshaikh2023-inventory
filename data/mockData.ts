import { Product, SalesOrder, PurchaseOrder, Warehouse, User, AuditLog } from '../types';

export const mockProducts: Product[] = [
    { id: 'P001', name: 'Type A Gravel (1.5")', sku: 'GR-A-150', category: 'Aggregates', stock: 5500, unitOfMeasure: 'Ton', price: 25.50, status: 'In Stock', warehouse: 'Quarry Site A', dateAdded: '2023-10-01', supplier: 'Internal', batchNumber: 'BN-20231001-A', qualityTestStatus: 'Passed' },
    { id: 'P002', name: 'Asphalt Mix (Fine Grade)', sku: 'AM-FG-001', category: 'Binders', stock: 1200, unitOfMeasure: 'Ton', price: 150.00, status: 'In Stock', warehouse: 'Main Plant', dateAdded: '2023-10-02', supplier: 'Internal', batchNumber: 'BN-20231002-B', qualityTestStatus: 'Passed' },
    { id: 'P003', name: 'Washed Concrete Sand', sku: 'SND-C-W01', category: 'Aggregates', stock: 850, unitOfMeasure: 'Cubic Meter', price: 45.00, status: 'Low Stock', warehouse: 'Quarry Site B', dateAdded: '2023-09-15', supplier: 'SandMasters Inc.', batchNumber: 'BN-20230915-S', qualityTestStatus: 'Pending' },
    { id: 'P004', name: 'Crushed Stone #57', sku: 'CS-57-001', category: 'Aggregates', stock: 0, unitOfMeasure: 'Ton', price: 32.75, status: 'Out of Stock', warehouse: 'Quarry Site A', dateAdded: '2023-08-20', supplier: 'Internal', batchNumber: 'BN-20230820-C', qualityTestStatus: 'Passed' },
    { id: 'P005', name: 'Liquid Asphalt Binder', sku: 'LAB-PG64', category: 'Binders', stock: 200, unitOfMeasure: 'Drum', price: 890.00, status: 'In Stock', warehouse: 'Main Plant', dateAdded: '2023-10-05', supplier: 'PetroChem', batchNumber: 'BN-20231005-L', qualityTestStatus: 'Passed' },
    { id: 'P006', name: 'Soil Compaction Agent', sku: 'SCA-X1', category: 'Additives', stock: 50, unitOfMeasure: 'Bag', price: 75.00, status: 'In Stock', warehouse: 'Testing Lab', dateAdded: '2023-09-28', supplier: 'ChemAdditives Co.', batchNumber: 'BN-20230928-X', qualityTestStatus: 'Passed' },
    { id: 'P007', name: 'Soil Test Kit', sku: 'STK-001', category: 'Lab Supplies', stock: 150, unitOfMeasure: 'Bag', price: 125.00, status: 'In Stock', warehouse: 'Testing Lab', dateAdded: '2023-09-25', supplier: 'LabEquip', batchNumber: 'N/A', qualityTestStatus: 'Passed' },
];

export const mockSalesOrders: SalesOrder[] = [
    { 
        id: 'SO-101', 
        customer: { name: 'Pioneer Construction', email: 'purchasing@pioneer.com', shippingAddress: '123 Highway Project, Anytown' }, 
        date: '2023-10-26', 
        total: 267750, 
        status: 'Fulfilled',
        items: [
            { productId: 'P001', productName: 'Type A Gravel (1.5")', quantity: 1500, price: 25.50 },
            { productId: 'P002', productName: 'Asphalt Mix (Fine Grade)', quantity: 1500, price: 150.00 },
        ]
    },
    { 
        id: 'SO-102', 
        customer: { name: 'Metro Roadworks', email: 'supplies@metroroads.com', shippingAddress: '456 County Rd 5, Sometown' }, 
        date: '2023-10-27', 
        total: 112500, 
        status: 'Pending',
        items: [
            { productId: 'P002', productName: 'Asphalt Mix (Fine Grade)', quantity: 750, price: 150.00 },
        ]
    },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
    { 
        id: 'PO-201', 
        vendor: { name: 'PetroChem', contactPerson: 'Bob Vance' },
        date: '2023-10-20', 
        total: 178000.00, 
        status: 'Received',
        items: [
            { productId: 'P005', productName: 'Liquid Asphalt Binder', quantity: 200, price: 890.00 },
        ]
    },
    { 
        id: 'PO-202', 
        vendor: { name: 'SandMasters Inc.', contactPerson: 'Phyllis Lapin' },
        date: '2023-10-22', 
        total: 45000.00, 
        status: 'Pending',
        items: [
            { productId: 'P003', productName: 'Washed Concrete Sand', quantity: 1000, price: 45.00 },
        ]
    },
];

export const mockWarehouses: Warehouse[] = [
    { id: 'WH-01', name: 'Quarry Site A', location: '1 Quarry Rd, Bedrock', capacity: 50000, stockCount: 35200, manager: 'John Flint', contact: '555-0101' },
    { id: 'WH-02', name: 'Main Plant', location: '2 Industrial Ave, Gravelton', capacity: 10000, stockCount: 7800, manager: 'Jane Slate', contact: '555-0102' },
    { id: 'WH-03', name: 'Quarry Site B', location: '3 Rockface Wy, Stoneburg', capacity: 30000, stockCount: 18500, manager: 'Fred Granite', contact: '555-0103' },
    { id: 'WH-04', name: 'Testing Lab', location: '2 Industrial Ave, Gravelton', capacity: 1000, stockCount: 350, manager: 'Dr. Sandy Rhodes', contact: '555-0104' },
];

export const mockUsers: User[] = [
    { id: 'U001', name: 'Admin User', email: 'admin@bws.com', username: 'admin', password: 'password123', roles: ['Admin'], designation: 'System Administrator', status: 'Active' },
    { id: 'U002', name: 'Sarah Connor', email: 's.connor@bws.com', username: 'sconnor', password: 'password123', roles: ['User', 'Inventory Manager'], designation: 'Plant Manager', status: 'Active' },
    { id: 'U003', name: 'Kyle Reese', email: 'k.reese@bws.com', username: 'kreese', password: 'password123', roles: ['User', 'Logistics'], designation: 'Logistics Coordinator', status: 'Blocked' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'AL-001', timestamp: '2023-10-28 09:15:23', user: 'Admin User', type: 'Inventory', action: 'CREATE', details: 'Added new product "Type A Gravel" (SKU: GR-A-150)' },
    { id: 'AL-002', timestamp: '2023-10-28 10:05:00', user: 'Kyle Reese', type: 'Sales', action: 'UPDATE', details: 'Order SO-101 status changed to Fulfilled' },
    { id: 'AL-003', timestamp: '2023-10-27 14:30:10', user: 'Sarah Connor', type: 'Purchase', action: 'CREATE', details: 'Created Purchase Order PO-202 for 1000 Cubic Meters of sand' },
    { id: 'AL-004', timestamp: '2023-10-27 16:45:00', user: 'Admin User', type: 'User Management', action: 'CREATE', details: 'Added new user "Kyle Reese"' },
    { id: 'AL-005', timestamp: '2023-10-26 11:00:00', user: 'Sarah Connor', type: 'Inventory', action: 'UPDATE', details: 'Stock for "Asphalt Mix" adjusted by -750 Tons for Order SO-102' },
];

// Fix: Add mockRecentActivity export for the Dashboard page.
// This data is a summary of audit logs for a more concise display.
export const mockRecentActivity = [
    { id: 'AL-001', user: 'Admin User', action: 'Added product: "Type A Gravel"', timestamp: '2023-10-28 09:15' },
    { id: 'AL-002', user: 'Kyle Reese', action: 'Order SO-101 Fulfilled', timestamp: '2023-10-28 10:05' },
    { id: 'AL-003', user: 'Sarah Connor', action: 'Created PO-202', timestamp: '2023-10-27 14:30' },
    { id: 'AL-004', user: 'Admin User', action: 'Added user: "Kyle Reese"', timestamp: '2023-10-27 16:45' },
    { id: 'AL-005', user: 'Sarah Connor', action: 'Adjusted stock for "Asphalt Mix"', timestamp: '2023-10-26 11:00' },
];

export const mockSalesDataForChart = [
    { name: 'Jan', sales: 4000, profit: 2400 },
    { name: 'Feb', sales: 3000, profit: 1398 },
    { name: 'Mar', sales: 5000, profit: 9800 },
    { name: 'Apr', sales: 4500, profit: 3908 },
    { name: 'May', sales: 6000, profit: 4800 },
    { name: 'Jun', sales: 5500, profit: 3800 },
    { name: 'Jul', sales: 7000, profit: 4300 },
];

export const mockStockVsSold = mockProducts.map(p => ({
    name: p.name,
    stock: p.stock,
    sold: Math.floor(Math.random() * (p.stock + 50)) + 10 // Mock sold data
}));