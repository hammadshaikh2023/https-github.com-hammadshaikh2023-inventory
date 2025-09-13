import { Product, SalesOrder, PurchaseOrder, Warehouse, User, AuditLog } from '../types';

const defaultUserImg = 'data:image/png;base64,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';

export const mockProducts: Product[] = [
    { id: 'P001', name: 'Type A Gravel (1.5")', sku: 'GR-A-150', category: 'Aggregates', stock: 5500, unitOfMeasure: 'Ton', price: 25.50, unitCost: 18.00, currency: 'USD', status: 'In Stock', warehouse: 'Quarry Site A', dateAdded: '2023-10-01', supplier: 'Internal', batchNumber: 'BN-20231001-A', qualityTestStatus: 'Passed', imageUrl: 'https://picsum.photos/seed/gravel/400', history: [], description: 'Standard 1.5-inch Type A gravel, suitable for road base and general construction fill.', location: 'Silo 3, Bay 1', reorderLevel: 1000 },
    { id: 'P002', name: 'Asphalt Mix (Fine Grade)', sku: 'AM-FG-001', category: 'Binders', stock: 1200, unitOfMeasure: 'Ton', price: 150.00, unitCost: 110.50, currency: 'USD', status: 'In Stock', warehouse: 'Main Plant', dateAdded: '2023-10-02', supplier: 'Internal', batchNumber: 'BN-20231002-B', qualityTestStatus: 'Passed', imageUrl: 'https://picsum.photos/seed/asphalt/400', history: [], description: 'High-quality fine grade asphalt mix for surface layers and patchwork.', location: 'Heated Silo 2', reorderLevel: 250 },
    { id: 'P003', name: 'Washed Concrete Sand', sku: 'SND-C-W01', category: 'Aggregates', stock: 850, unitOfMeasure: 'Cubic Meter', price: 45.00, unitCost: 32.00, currency: 'USD', status: 'Low Stock', warehouse: 'Quarry Site B', dateAdded: '2023-09-15', supplier: 'SandMasters Inc.', batchNumber: 'BN-20230915-S', qualityTestStatus: 'Pending', imageUrl: 'https://picsum.photos/seed/sand/400', history: [], description: 'Clean, washed sand for concrete mixing and masonry work.', location: 'Pile 7', reorderLevel: 1000 },
    { id: 'P004', name: 'Crushed Stone #57', sku: 'CS-57-001', category: 'Aggregates', stock: 0, unitOfMeasure: 'Ton', price: 32.75, unitCost: 24.50, currency: 'USD', status: 'Out of Stock', warehouse: 'Quarry Site A', dateAdded: '2023-08-20', supplier: 'Internal', batchNumber: 'BN-20230820-C', qualityTestStatus: 'Passed', imageUrl: 'https://picsum.photos/seed/stone/400', history: [], location: 'Bin 12', reorderLevel: 1500 },
    { id: 'P005', name: 'Liquid Asphalt Binder', sku: 'LAB-PG64', category: 'Binders', stock: 200, unitOfMeasure: 'Drum', price: 890.00, unitCost: 750.00, currency: 'USD', status: 'In Stock', warehouse: 'Main Plant', dateAdded: '2023-10-05', supplier: 'PetroChem', batchNumber: 'BN-20231005-L', qualityTestStatus: 'Passed', expires: '2024-10-05', imageUrl: 'https://picsum.photos/seed/binder/400', history: [], location: 'Hazmat Storage, Rack 2', reorderLevel: 50 },
    { id: 'P006', name: 'Soil Compaction Agent', sku: 'SCA-X1', category: 'Additives', stock: 50, unitOfMeasure: 'Bag', price: 75.00, unitCost: 55.00, currency: 'USD', status: 'In Stock', warehouse: 'Testing Lab', dateAdded: '2023-09-28', supplier: 'ChemAdditives Co.', batchNumber: 'BN-20230928-X', qualityTestStatus: 'Passed', expires: '2025-09-28', imageUrl: 'https://picsum.photos/seed/additive/400', history: [], reorderLevel: 20 },
    { id: 'P007', name: 'Soil Test Kit', sku: 'STK-001', category: 'Lab Supplies', stock: 150, unitOfMeasure: 'Bag', price: 125.00, unitCost: 90.00, currency: 'USD', status: 'In Stock', warehouse: 'Testing Lab', dateAdded: '2023-09-25', supplier: 'LabEquip', batchNumber: 'N/A', qualityTestStatus: 'Passed', imageUrl: 'https://picsum.photos/seed/labtest/400', history: [], location: 'Lab Shelf C', reorderLevel: 25 },
];

export const mockSalesOrders: SalesOrder[] = [
    { 
        id: 'SO-101', 
        customer: { name: 'Pioneer Construction', email: 'purchasing@pioneer.com', shippingAddress: '123 Highway Project, Anytown' }, 
        date: '2023-10-26', 
        total: 267750, 
        currency: 'USD',
        status: 'Fulfilled',
        items: [
            { productId: 'P001', productName: 'Type A Gravel (1.5")', quantity: 1500, price: 25.50 },
            { productId: 'P002', productName: 'Asphalt Mix (Fine Grade)', quantity: 1500, price: 150.00 },
        ],
        history: [
            { timestamp: '2023-10-28 10:05:00', user: 'Kyle Reese', action: 'Status changed to Fulfilled' },
            { timestamp: '2023-10-26 09:00:00', user: 'Admin User', action: 'Order Created' }
        ]
    },
    { 
        id: 'SO-102', 
        customer: { name: 'Metro Roadworks', email: 'supplies@metroroads.com', shippingAddress: '456 County Rd 5, Sometown' }, 
        date: '2023-10-27', 
        total: 112500, 
        currency: 'USD',
        status: 'Pending',
        items: [
            { productId: 'P002', productName: 'Asphalt Mix (Fine Grade)', quantity: 750, price: 150.00 },
        ],
        history: [
            { timestamp: '2023-10-27 11:30:00', user: 'Sarah Connor', action: 'Order Created' }
        ]
    },
    { 
        id: 'SO-103', 
        customer: { name: 'Urban Developers', email: 'contact@urbandev.com', shippingAddress: '789 City Plaza, Newtown' }, 
        date: '2023-11-01', 
        total: 36750, 
        currency: 'USD',
        status: 'Pending',
        items: [
            { productId: 'P003', productName: 'Washed Concrete Sand', quantity: 800, price: 45.00 },
            { productId: 'P006', productName: 'Soil Compaction Agent', quantity: 10, price: 75.00 },
        ],
        history: [{ timestamp: '2023-11-01 14:00:00', user: 'Sarah Connor', action: 'Order Created' }]
    },
    { 
        id: 'SO-104', 
        customer: { name: 'Pioneer Construction', email: 'purchasing@pioneer.com', shippingAddress: '123 Highway Project, Anytown' }, 
        date: '2023-11-02', 
        total: 75000, 
        currency: 'USD',
        status: 'Fulfilled',
        items: [{ productId: 'P002', productName: 'Asphalt Mix (Fine Grade)', quantity: 500, price: 150.00 }],
        history: [
            { timestamp: '2023-11-03 16:00:00', user: 'Kyle Reese', action: 'Status changed to Fulfilled' },
            { timestamp: '2023-11-02 09:30:00', user: 'Admin User', action: 'Order Created' }
        ]
    },
    { 
        id: 'SO-105', 
        customer: { name: 'State Infrastructure', email: 'procurement@stateinfra.gov', shippingAddress: '1 Gov Complex, Capitol City' }, 
        date: '2023-11-05', 
        total: 445000, 
        currency: 'USD',
        status: 'Fulfilled',
        items: [{ productId: 'P005', productName: 'Liquid Asphalt Binder', quantity: 500, price: 890.00 }],
        history: [
            { timestamp: '2023-11-07 10:00:00', user: 'Kyle Reese', action: 'Status changed to Fulfilled' },
            { timestamp: '2023-11-05 11:00:00', user: 'Sarah Connor', action: 'Order Created' }
        ]
    },
    { 
        id: 'SO-106', 
        customer: { name: 'Metro Roadworks', email: 'supplies@metroroads.com', shippingAddress: '456 County Rd 5, Sometown' }, 
        date: '2023-11-06', 
        total: 12750, 
        currency: 'USD',
        status: 'Cancelled',
        items: [{ productId: 'P001', productName: 'Type A Gravel (1.5")', quantity: 500, price: 25.50 }],
        history: [
            { timestamp: '2023-11-06 13:00:00', user: 'Admin User', action: 'Status changed to Cancelled' },
            { timestamp: '2023-11-06 10:00:00', user: 'Sarah Connor', action: 'Order Created' }
        ]
    },
    { 
        id: 'SO-107', 
        customer: { name: 'Pioneer Construction', email: 'purchasing@pioneer.com', shippingAddress: '123 Highway Project, Anytown' }, 
        date: '2023-11-08', 
        total: 51000, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P001', productName: 'Type A Gravel (1.5")', quantity: 2000, price: 25.50 }],
        history: [{ timestamp: '2023-11-08 15:20:00', user: 'Sarah Connor', action: 'Order Created' }]
    },
    { 
        id: 'SO-108', 
        customer: { name: 'Urban Developers', email: 'contact@urbandev.com', shippingAddress: '789 City Plaza, Newtown' }, 
        date: '2023-11-10', 
        total: 25000, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P007', productName: 'Soil Test Kit', quantity: 200, price: 125.00 }],
        history: [{ timestamp: '2023-11-10 12:00:00', user: 'Admin User', action: 'Order Created' }]
    },
    { 
        id: 'SO-109', 
        customer: { name: 'Metro Roadworks', email: 'supplies@metroroads.com', shippingAddress: '456 County Rd 5, Sometown' }, 
        date: '2023-11-11', 
        total: 450000, 
        currency: 'USD',
        status: 'Fulfilled',
        items: [{ productId: 'P002', productName: 'Asphalt Mix (Fine Grade)', quantity: 3000, price: 150.00 }],
        history: [
            { timestamp: '2023-11-14 11:00:00', user: 'Kyle Reese', action: 'Status changed to Fulfilled' },
            { timestamp: '2023-11-11 16:00:00', user: 'Sarah Connor', action: 'Order Created' }
        ]
    },
    { 
        id: 'SO-110', 
        customer: { name: 'State Infrastructure', email: 'procurement@stateinfra.gov', shippingAddress: '1 Gov Complex, Capitol City' }, 
        date: '2023-11-12', 
        total: 22500, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P003', productName: 'Washed Concrete Sand', quantity: 500, price: 45.00 }],
        history: [{ timestamp: '2023-11-12 10:45:00', user: 'Admin User', action: 'Order Created' }]
    },
    { 
        id: 'SO-111', 
        customer: { name: 'Pioneer Construction', email: 'purchasing@pioneer.com', shippingAddress: '123 Highway Project, Anytown' }, 
        date: '2023-11-15', 
        total: 2250, 
        currency: 'USD',
        status: 'Fulfilled',
        items: [{ productId: 'P006', productName: 'Soil Compaction Agent', quantity: 30, price: 75.00 }],
        history: [
            { timestamp: '2023-11-16 14:00:00', user: 'Kyle Reese', action: 'Status changed to Fulfilled' },
            { timestamp: '2023-11-15 09:00:00', user: 'Sarah Connor', action: 'Order Created' }
        ]
    },
    { 
        id: 'SO-112', 
        customer: { name: 'Urban Developers', email: 'contact@urbandev.com', shippingAddress: '789 City Plaza, Newtown' }, 
        date: '2023-11-18', 
        total: 78750, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P002', productName: 'Asphalt Mix (Fine Grade)', quantity: 525, price: 150.00 }],
        history: [{ timestamp: '2023-11-18 11:10:00', user: 'Sarah Connor', action: 'Order Created' }]
    },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
    { 
        id: 'PO-201', 
        vendor: { name: 'PetroChem', contactPerson: 'Bob Vance' },
        date: '2023-10-20', 
        total: 178000.00, 
        currency: 'USD',
        status: 'Received',
        items: [
            { productId: 'P005', productName: 'Liquid Asphalt Binder', quantity: 200, price: 890.00 },
        ],
        history: [
            { timestamp: '2023-10-20 15:00:00', user: 'Jane Slate', action: 'Status changed to Received' },
            { timestamp: '2023-10-20 10:00:00', user: 'Jane Slate', action: 'Order Created' }
        ],
        trackingNumber: '1Z999AA10123456784',
    },
    { 
        id: 'PO-202', 
        vendor: { name: 'SandMasters Inc.', contactPerson: 'Phyllis Lapin' },
        date: '2023-10-22', 
        total: 45000.00, 
        currency: 'USD',
        status: 'Pending',
        items: [
            { productId: 'P003', productName: 'Washed Concrete Sand', quantity: 1000, price: 45.00 },
        ],
        history: [
            { timestamp: '2023-10-22 16:00:00', user: 'Jane Slate', action: 'Order Created' }
        ]
    },
    { 
        id: 'PO-203', 
        vendor: { name: 'ChemAdditives Co.', contactPerson: 'Angela Martin' },
        date: '2023-11-01', 
        total: 3750, 
        currency: 'USD',
        status: 'Received',
        items: [{ productId: 'P006', productName: 'Soil Compaction Agent', quantity: 50, price: 75.00 }],
        history: [
            { timestamp: '2023-11-04 10:00:00', user: 'John Flint', action: 'Status changed to Received' },
            { timestamp: '2023-11-01 11:00:00', user: 'Jane Slate', action: 'Order Created' }
        ],
        trackingNumber: 'TRK-555-4321',
    },
    { 
        id: 'PO-204', 
        vendor: { name: 'LabEquip', contactPerson: 'Oscar Martinez' },
        date: '2023-11-03', 
        total: 13750, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P007', productName: 'Soil Test Kit', quantity: 110, price: 125.00 }],
        history: [{ timestamp: '2023-11-03 16:30:00', user: 'Jane Slate', action: 'Order Created' }]
    },
    { 
        id: 'PO-205', 
        vendor: { name: 'PetroChem', contactPerson: 'Bob Vance' },
        date: '2023-11-05', 
        total: 44500, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P005', productName: 'Liquid Asphalt Binder', quantity: 50, price: 890.00 }],
        history: [{ timestamp: '2023-11-05 09:00:00', user: 'Jane Slate', action: 'Order Created' }]
    },
    { 
        id: 'PO-206', 
        vendor: { name: 'SandMasters Inc.', contactPerson: 'Phyllis Lapin' },
        date: '2023-11-07', 
        total: 90000, 
        currency: 'USD',
        status: 'Received',
        items: [{ productId: 'P003', productName: 'Washed Concrete Sand', quantity: 2000, price: 45.00 }],
        history: [
            { timestamp: '2023-11-10 14:00:00', user: 'John Flint', action: 'Status changed to Received' },
            { timestamp: '2023-11-07 14:20:00', user: 'Jane Slate', action: 'Order Created' }
        ],
        trackingNumber: 'TRK-555-5678',
    },
    { 
        id: 'PO-207', 
        vendor: { name: 'Internal', contactPerson: 'Admin User' },
        date: '2023-11-09', 
        total: 81875, 
        currency: 'USD',
        status: 'Received',
        items: [{ productId: 'P004', productName: 'Crushed Stone #57', quantity: 2500, price: 32.75 }],
        history: [
            { timestamp: '2023-11-11 11:30:00', user: 'John Flint', action: 'Status changed to Received' },
            { timestamp: '2023-11-09 10:00:00', user: 'Jane Slate', action: 'Order Created' }
        ]
    },
    { 
        id: 'PO-208', 
        vendor: { name: 'ChemAdditives Co.', contactPerson: 'Angela Martin' },
        date: '2023-11-11', 
        total: 7500, 
        currency: 'USD',
        status: 'Cancelled',
        items: [{ productId: 'P006', productName: 'Soil Compaction Agent', quantity: 100, price: 75.00 }],
        history: [
            { timestamp: '2023-11-12 09:00:00', user: 'Admin User', action: 'Status changed to Cancelled' },
            { timestamp: '2023-11-11 13:00:00', user: 'Jane Slate', action: 'Order Created' }
        ]
    },
    { 
        id: 'PO-209', 
        vendor: { name: 'PetroChem', contactPerson: 'Bob Vance' },
        date: '2023-11-14', 
        total: 89000, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P005', productName: 'Liquid Asphalt Binder', quantity: 100, price: 890.00 }],
        history: [{ timestamp: '2023-11-14 15:00:00', user: 'Jane Slate', action: 'Order Created' }]
    },
    { 
        id: 'PO-210', 
        vendor: { name: 'SandMasters Inc.', contactPerson: 'Phyllis Lapin' },
        date: '2023-11-16', 
        total: 22500, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P003', productName: 'Washed Concrete Sand', quantity: 500, price: 45.00 }],
        history: [{ timestamp: '2023-11-16 11:00:00', user: 'Jane Slate', action: 'Order Created' }]
    },
    { 
        id: 'PO-211', 
        vendor: { name: 'LabEquip', contactPerson: 'Oscar Martinez' },
        date: '2023-11-18', 
        total: 6250, 
        currency: 'USD',
        status: 'Received',
        items: [{ productId: 'P007', productName: 'Soil Test Kit', quantity: 50, price: 125.00 }],
        history: [
            { timestamp: '2023-11-20 10:00:00', user: 'John Flint', action: 'Status changed to Received' },
            { timestamp: '2023-11-18 10:30:00', user: 'Jane Slate', action: 'Order Created' }
        ],
        trackingNumber: 'TRK-555-9876',
    },
    { 
        id: 'PO-212', 
        vendor: { name: 'Internal', contactPerson: 'Admin User' },
        date: '2023-11-20', 
        total: 127500, 
        currency: 'USD',
        status: 'Pending',
        items: [{ productId: 'P001', productName: 'Type A Gravel (1.5")', quantity: 5000, price: 25.50 }],
        history: [{ timestamp: '2023-11-20 14:00:00', user: 'Jane Slate', action: 'Order Created' }]
    },
];

export const mockWarehouses: Warehouse[] = [
    { id: 'WH-01', name: 'Quarry Site A', location: '1 Quarry Rd, Bedrock', capacity: 50000, stockCount: 35200, manager: 'John Flint', contact: '555-0101' },
    { id: 'WH-02', name: 'Main Plant', location: '2 Industrial Ave, Gravelton', capacity: 10000, stockCount: 7800, manager: 'Jane Slate', contact: '555-0102' },
    { id: 'WH-03', name: 'Quarry Site B', location: '3 Rockface Wy, Stoneburg', capacity: 30000, stockCount: 18500, manager: 'Fred Granite', contact: '555-0103' },
    { id: 'WH-04', name: 'Testing Lab', location: '2 Industrial Ave, Gravelton', capacity: 1000, stockCount: 350, manager: 'Dr. Sandy Rhodes', contact: '555-0104' },
];

export const mockUsers: User[] = [
    { id: 'U001', name: 'Admin User', email: 'admin@bws.com', username: 'admin', password: 'bws123', roles: ['Admin'], designation: 'System Administrator', status: 'Active', avatarUrl: 'https://picsum.photos/seed/adminuser/200' },
    { id: 'U002', name: 'Sarah Connor', email: 'sconnor@bws.com', username: 'sconnor', password: 'bws123', roles: ['Sales Representative'], designation: 'Sales Manager', status: 'Active', avatarUrl: defaultUserImg },
    { id: 'U003', name: 'John Flint', email: 'jflint@bws.com', username: 'jflint', password: 'bws123', roles: ['Inventory Manager', 'Warehouse Staff'], designation: 'Quarry Supervisor', status: 'Active', avatarUrl: defaultUserImg },
    { id: 'U004', name: 'Kyle Reese', email: 'kreese@bws.com', username: 'kreese', password: 'bws123', roles: ['Logistics'], designation: 'Logistics Coordinator', status: 'Active', avatarUrl: defaultUserImg },
    { id: 'U005', name: 'Jane Slate', email: 'jslate@bws.com', username: 'jslate', password: 'bws123', roles: ['Inventory Manager'], designation: 'Plant Manager', status: 'Blocked', avatarUrl: defaultUserImg },
    { id: 'U006', name: 'Security Guard', email: 'guard@bws.com', username: 'guard', password: 'bws123', roles: ['Security Guard'], designation: 'Gate Security', status: 'Active', avatarUrl: defaultUserImg },
];
// FIX: Added mock data for sales charts, recent activity, and audit logs to resolve import errors.
export const mockSalesDataForChart = [
    { name: 'Jan', sales: 4000, profit: 2400 },
    { name: 'Feb', sales: 3000, profit: 1398 },
    { name: 'Mar', sales: 2000, profit: 9800 },
    { name: 'Apr', sales: 2780, profit: 3908 },
    { name: 'May', sales: 1890, profit: 4800 },
    { name: 'Jun', sales: 2390, profit: 3800 },
    { name: 'Jul', sales: 3490, profit: 4300 },
];

export const mockRecentActivity = [
    { id: 1, user: 'Admin User', action: 'Fulfilled Sales Order #SO-104', timestamp: '2 hours ago' },
    { id: 2, user: 'John Flint', action: 'Received Purchase Order #PO-206', timestamp: '5 hours ago' },
    { id: 3, user: 'Sarah Connor', action: 'Added new customer: Metro Roadworks', timestamp: '1 day ago' },
    { id: 4, user: 'Jane Slate', action: 'Updated stock for "Type A Gravel"', timestamp: '1 day ago' },
    { id: 5, user: 'Admin User', action: 'Blocked user account: Jane Slate', timestamp: '2 days ago' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'A001', timestamp: '2023-11-20 14:00:00', user: 'Jane Slate', type: 'Purchase', action: 'Created Purchase Order', details: 'Order PO-212 created for 5000 units of Type A Gravel (1.5")' },
    { id: 'A002', timestamp: '2023-11-20 10:00:00', user: 'John Flint', type: 'Purchase', action: 'Received Purchase Order', details: 'Order PO-211 marked as received.' },
    { id: 'A003', timestamp: '2023-11-18 11:10:00', user: 'Sarah Connor', type: 'Sales', action: 'Created Sales Order', details: 'Order SO-112 created for Urban Developers.' },
    { id: 'A004', timestamp: '2023-11-18 10:30:00', user: 'Jane Slate', type: 'Purchase', action: 'Created Purchase Order', details: 'Order PO-211 created for LabEquip.' },
    { id: 'A005', timestamp: '2023-11-17 09:00:00', user: 'Admin User', type: 'User Management', action: 'Updated User Role', details: 'Role for user "John Flint" changed to "Warehouse Manager".' },
    { id: 'A006', timestamp: '2023-11-16 14:00:00', user: 'Kyle Reese', type: 'Sales', action: 'Fulfilled Sales Order', details: 'Order SO-111 marked as fulfilled.' },
    { id: 'A007', timestamp: '2023-11-16 10:00:00', user: 'Admin User', type: 'Inventory', action: 'Stock Adjustment', details: 'Adjusted stock for "Washed Concrete Sand" by -50 units. Reason: Damage.' },
];