import { Product, SalesOrder, PurchaseOrder, Warehouse, User, AuditLog } from '../types';

// Placeholder base64 images to ensure they always load
const gravelImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw8QEA8QDw8PDw8PDw8PDw8PDw8PFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAAUABgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlID/2Q==';
const asphaltImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw8QEA8QDw8PDw8PDw8PDw8PDw8PFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAAUABgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlID/2Q==';
const sandImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw8QEA8QDw8PDw8PDw8PDw8PDw8PFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//ABEIAAUABgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlID/2Q==';
const crushedStoneImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw8QEA8QDw8PDw8PDw8PDw8PDw8PFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//ABEIAAUABgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlID/2Q==';
const liquidAsphaltImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw8QEA8QDw8PDw8PDw8PDw8PDw8PFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//ABEIAAUABgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlID/2Q==';
const additiveBagImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw8QEA8QDw8PDw8PDw8PDw8PDw8PFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//ABEIAAUABgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlID/2Q==';
const labKitImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw8QEA8QDw8PDw8PDw8PDw8PDw8PFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//ABEIAAUABgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAAB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlID/2Q==';
const defaultUserImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAMJSURBVHja7JvNS1RRGMd/5+M8zYyWkKI8NGb8kDJbJdItSLAgoaEghajQ3YKKgv4XVEgQUaFCqIgoaBGS1CT6EwqljU8MKoPSJLO0Fmfeezpnbvcs5/2vOzPz+8Dbnc/7/s935t17d4/Q1lYXpYAnwD4wDkwA+8AKMAG0AAN4AywBG8CqAC/AK3AGfAf6D2in8CzwDbwGugE2gA3gGfAB3AnUgK/AMuBWgAfgCbgCtADtwCswDmwC+wAtwEvgGvAZmAA+AGuA2+AOsAXcBH4DXgGbgM/Ao+AQsAacBD4DG8D/wFdgUfTz/C3gVfD2uA/8A74DDwBPwWugE8BBYE/AsoA1wLz/AVgPzAHfAK+AF8DXwA3gNfAZ2A9cBH4BvwIvga/Az8Df4Q2gLhJ4DXwB/g2uAm8Bb4DPwF/gH/DXcBN4CjgE/AfuAmeA7wD/gb2A/8Ev4DXwBfgQvAXOA/uAY2A68I3gLfB98Ab4GXwHvge/Ab+Dv8I/wm8Bf4P/g9+D58B/g3/CX+Ef4R/hT/C/+CjA1vA/sB3YA2wCT8EfwR/hX+Fn4bXwP/B7cBzYDPwBvgf/B98B/wJ/hH+FL4F/wc/D/8L/wL/Bf+G/4b/hv+G/4T/hP+HP8M/wR/hj/D/8F/wh/hB+C/8EP4R/hB+AP8I/wD/AAzAAjAFjALTwAjwCkwAU8AI8Bo8B88Ac8AsMA+MAaPAFDAGjANDwCRwDhgDRoAxYBqYAkbADDAAjAFzwFRgCpgHpoBZYBaYBVbADDAEnAEjwCRwDBgDRoAxYAoYADaAWWAUmAJmgVlgFlgDToERoAc4AybALHAO+D+nADx+BLs2fA3MAxNADfADMAxMAzXAKDAFTAPTwBywDswBM8AsMAPMACPAHDAEjAOjwBQwBowAI8AUMAKMA0PABDAAjAFzwDRgCjgGTAPTwBwwC4wAU8AEMAKMACPAGDADPAPzX28At20lrf3oV3sAAAAASUVORK5CYII=';

export const mockProducts: Product[] = [
    { id: 'P001', name: 'Type A Gravel (1.5")', sku: 'GR-A-150', category: 'Aggregates', stock: 5500, unitOfMeasure: 'Ton', price: 25.50, unitCost: 18.00, currency: 'USD', status: 'In Stock', warehouse: 'Quarry Site A', dateAdded: '2023-10-01', supplier: 'Internal', batchNumber: 'BN-20231001-A', qualityTestStatus: 'Passed', imageUrl: gravelImg, history: [] },
    { id: 'P002', name: 'Asphalt Mix (Fine Grade)', sku: 'AM-FG-001', category: 'Binders', stock: 1200, unitOfMeasure: 'Ton', price: 150.00, unitCost: 110.50, currency: 'USD', status: 'In Stock', warehouse: 'Main Plant', dateAdded: '2023-10-02', supplier: 'Internal', batchNumber: 'BN-20231002-B', qualityTestStatus: 'Passed', imageUrl: asphaltImg, history: [] },
    { id: 'P003', name: 'Washed Concrete Sand', sku: 'SND-C-W01', category: 'Aggregates', stock: 850, unitOfMeasure: 'Cubic Meter', price: 45.00, unitCost: 32.00, currency: 'USD', status: 'Low Stock', warehouse: 'Quarry Site B', dateAdded: '2023-09-15', supplier: 'SandMasters Inc.', batchNumber: 'BN-20230915-S', qualityTestStatus: 'Pending', imageUrl: sandImg, history: [] },
    { id: 'P004', name: 'Crushed Stone #57', sku: 'CS-57-001', category: 'Aggregates', stock: 0, unitOfMeasure: 'Ton', price: 32.75, unitCost: 24.50, currency: 'USD', status: 'Out of Stock', warehouse: 'Quarry Site A', dateAdded: '2023-08-20', supplier: 'Internal', batchNumber: 'BN-20230820-C', qualityTestStatus: 'Passed', imageUrl: crushedStoneImg, history: [] },
    { id: 'P005', name: 'Liquid Asphalt Binder', sku: 'LAB-PG64', category: 'Binders', stock: 200, unitOfMeasure: 'Drum', price: 890.00, unitCost: 750.00, currency: 'USD', status: 'In Stock', warehouse: 'Main Plant', dateAdded: '2023-10-05', supplier: 'PetroChem', batchNumber: 'BN-20231005-L', qualityTestStatus: 'Passed', expires: '2024-10-05', imageUrl: liquidAsphaltImg, history: [] },
    { id: 'P006', name: 'Soil Compaction Agent', sku: 'SCA-X1', category: 'Additives', stock: 50, unitOfMeasure: 'Bag', price: 75.00, unitCost: 55.00, currency: 'USD', status: 'In Stock', warehouse: 'Testing Lab', dateAdded: '2023-09-28', supplier: 'ChemAdditives Co.', batchNumber: 'BN-20230928-X', qualityTestStatus: 'Passed', expires: '2025-09-28', imageUrl: additiveBagImg, history: [] },
    { id: 'P007', name: 'Soil Test Kit', sku: 'STK-001', category: 'Lab Supplies', stock: 150, unitOfMeasure: 'Bag', price: 125.00, unitCost: 90.00, currency: 'USD', status: 'In Stock', warehouse: 'Testing Lab', dateAdded: '2023-09-25', supplier: 'LabEquip', batchNumber: 'N/A', qualityTestStatus: 'Passed', imageUrl: labKitImg, history: [] },
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
    { id: 'U001', name: 'Admin User', email: 'admin@bws.com', username: 'admin', password: 'bws123', roles: ['Admin'], designation: 'System Administrator', status: 'Active', avatarUrl: defaultUserImg },
    { id: 'U002', name: 'Sarah Connor', email: 'sconnor@bws.com', username: 'sconnor', password: 'bws123', roles: ['Sales Representative'], designation: 'Sales Manager', status: 'Active', avatarUrl: defaultUserImg },
    { id: 'U003', name: 'John Flint', email: 'jflint@bws.com', username: 'jflint', password: 'bws123', roles: ['Inventory Manager', 'Warehouse Staff'], designation: 'Quarry Supervisor', status: 'Active', avatarUrl: defaultUserImg },
    { id: 'U004', name: 'Kyle Reese', email: 'kreese@bws.com', username: 'kreese', password: 'bws123', roles: ['Logistics'], designation: 'Logistics Coordinator', status: 'Active', avatarUrl: defaultUserImg },
    { id: 'U005', name: 'Jane Slate', email: 'jslate@bws.com', username: 'jslate', password: 'bws123', roles: ['Inventory Manager'], designation: 'Plant Manager', status: 'Blocked', avatarUrl: defaultUserImg },
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