import { Product, SalesOrder, PurchaseOrder, Warehouse, User, AuditLog } from '../types';

export const mockProducts: Product[] = [
    { id: 'P001', name: 'Type A Gravel (1.5")', sku: 'GR-A-150', category: 'Aggregates', stock: 5500, unitOfMeasure: 'Ton', price: 25.50, unitCost: 18.00, currency: 'USD', status: 'In Stock', warehouse: 'Quarry Site A', dateAdded: '2023-10-01', supplier: 'Internal', batchNumber: 'BN-20231001-A', qualityTestStatus: 'Passed' },
    { id: 'P002', name: 'Asphalt Mix (Fine Grade)', sku: 'AM-FG-001', category: 'Binders', stock: 1200, unitOfMeasure: 'Ton', price: 150.00, unitCost: 110.50, currency: 'USD', status: 'In Stock', warehouse: 'Main Plant', dateAdded: '2023-10-02', supplier: 'Internal', batchNumber: 'BN-20231002-B', qualityTestStatus: 'Passed' },
    { id: 'P003', name: 'Washed Concrete Sand', sku: 'SND-C-W01', category: 'Aggregates', stock: 850, unitOfMeasure: 'Cubic Meter', price: 45.00, unitCost: 32.00, currency: 'USD', status: 'Low Stock', warehouse: 'Quarry Site B', dateAdded: '2023-09-15', supplier: 'SandMasters Inc.', batchNumber: 'BN-20230915-S', qualityTestStatus: 'Pending' },
    { id: 'P004', name: 'Crushed Stone #57', sku: 'CS-57-001', category: 'Aggregates', stock: 0, unitOfMeasure: 'Ton', price: 32.75, unitCost: 24.50, currency: 'USD', status: 'Out of Stock', warehouse: 'Quarry Site A', dateAdded: '2023-08-20', supplier: 'Internal', batchNumber: 'BN-20230820-C', qualityTestStatus: 'Passed' },
    { id: 'P005', name: 'Liquid Asphalt Binder', sku: 'LAB-PG64', category: 'Binders', stock: 200, unitOfMeasure: 'Drum', price: 890.00, unitCost: 750.00, currency: 'USD', status: 'In Stock', warehouse: 'Main Plant', dateAdded: '2023-10-05', supplier: 'PetroChem', batchNumber: 'BN-20231005-L', qualityTestStatus: 'Passed' },
    { id: 'P006', name: 'Soil Compaction Agent', sku: 'SCA-X1', category: 'Additives', stock: 50, unitOfMeasure: 'Bag', price: 75.00, unitCost: 55.00, currency: 'USD', status: 'In Stock', warehouse: 'Testing Lab', dateAdded: '2023-09-28', supplier: 'ChemAdditives Co.', batchNumber: 'BN-20230928-X', qualityTestStatus: 'Passed' },
    { id: 'P007', name: 'Soil Test Kit', sku: 'STK-001', category: 'Lab Supplies', stock: 150, unitOfMeasure: 'Bag', price: 125.00, unitCost: 90.00, currency: 'USD', status: 'In Stock', warehouse: 'Testing Lab', dateAdded: '2023-09-25', supplier: 'LabEquip', batchNumber: 'N/A', qualityTestStatus: 'Passed' },
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
            { timestamp: '2023-10-20 15:00:00', user: 'Sarah Connor', action: 'Status changed to Received' },
            { timestamp: '2023-10-20 10:00:00', user: 'Sarah Connor', action: 'Order Created' }
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
            { timestamp: '2023-10-22 16:00:00', user: 'Sarah Connor', action: 'Order Created' }
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
    { id: 'U001', name: 'Admin User', email: 'admin@bws.com', username: 'admin', password: 'password123', roles: ['Admin'], designation: 'System Administrator', status: 'Active', avatarUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAAHxjcHJ0AAABcAAAACh3dHB0AAABoAAAAAxyVFJDAAABvAAAAA5nVFJDAAABvAAAAA5iVFJDAAABvAAAAA5yWFlaAAAB3AAAABRiWFlaAAAB8AAAABRnWFlaAAACBAAAABRyVFJDAAABvAAAAA50ZWNoAAAA/gAAABthdnVlAAAA/gAAABpwYXJhAAAABAAAAAJzaWdmAAAA/AAAACVtZXRhAAAA/gAAACRtZm9uAAAA/gAAAAxwYXJhAAAABAAAAAJwbW1yAAAA/gAAADJ2Y2dwAAAA/gAAADZkc2NtAAAA/gAAAEwbmRpbwAAABAAAAAwY2hhZAAAABAAAAAwbWx1YwAAAAAAAAABAAAADGVuVVMAAAAUAAAAHABzAFIARwBCAEkARQBDADYAMQA5ADYANgAtADIALgAxAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAABAAAADGVuVVMAAAAaAAAAHABQAHUAYgBsAGkAYwAgAEQAbwBtAGEAaQBuAABYWVogAAAAAAAA81EAAQAAAAEWzGN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANwA7AEAARQBKAE8AVABZAGMAZwBvAHYAdwB8AIEAhgCLAJAAlQCaAJ8AowCoAK0AsgC3ALwAwQDGAMsA0ADVANsA4ADlAOsA8AD2APsBAQEHAQ0BEwEZAR8BJQErATIBOAE+AUUBTAFSAVkBYAFnAW4BdQF8AYMBiwGSAZoBoQGpAbEBuQHBAckB0QHYAdoB3QHqAfEB+gH+AgYCDwIZAh4CJwIuAj8CRgJIAk4CUgJYAloCbgJ8ApICpAKrAs4C2gLgAvaC+wMDAwsDGgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gAIgQqBGoEewRiBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4ACIEKgRqBHsEagSXBGoEiwR2BPsEQQR+BJEEmgSoBLYExATTBOEE8AT+BQ0FHQUrBTsFSQVgBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBykHPQdPB2EHdgeGB5kHrAe/B9IH5Qf4AD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAH0AfQDAREAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAECBAMFBgf/xAA5EAACAQMCBAUDAgUDBQEBAQABAgMABBEgIRIFMQZRQSIHExUWMkIjNnFzJDQ2oTRUhSQlgqKx/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAIEAQMFBgf/xAAzEQEAAgEDAgQEBgICAwEAAAAAAQIDABEEIRIxQSIFE1FhcRMUMhUjMoGhQlLwYrHB0f/aAAwDAQACEQMRAD8A+i8O8O8O4dw7gHDuHcO4dwDh3DuHcO4Bw7h3DuHcAIuXcTzD84g7i47iW5+sQdxcc/zEtx/OIO4u4dxLcfziDuLi7h3Et/OIHDuLc/nEtx/OIO4uLcO4luf5xBcXDuJbj+cQdxccO4luf5xB3DuHcO4dxBw7h3DuHcAIuPcTuHcA4dw7h3DuAcO4hN/nEtz/OIO4u4dw7h3AOHcO4dw7gHDuIuHcQdxbi4dw7gHDuHcO4dwCh3DuHcO4Bw7h3DuHcAIuLcO4dw7gHDuHcO4dwCh3DuHcO4Bw7h3DuHcA4dw7h3DuAcO4dw7h3AKHcLcO4dwDh3DuHcO4BQ7h3DuHcA4dxFw7gHDuHcO4dwDh3DuHcO4AIuPcS3DuAcO4dw7h3AKHcLcO4dwDh3DuHcO4Bw7h3DuHcA4dxFw7gHDuHcO4dwCh3DuHcO4BQ7hbi4dwDh3DuHcO4Bw7h3DuHcA4dw7h3DuAULcO4dw7gHDuHcO4dwDh3Eu4dwDh3F3EXAKHcS4dw7gCh3Fw7h3AOHcO4dw7gHDuHcO4dwDh3DuHcO4BQ7hbi4dwDh3DuHcO4Bw7h3DuHcA4dw7h3DuAcO4dw7h3AOHcO4dw7gHDuXcO4dwDh3EuHcO4Bw7h3DuHcAIu4dw7h3AOHcO4dw7gHDuLcO4dwDh3DuHcO4Bw7h3DuHcA4dxLh3AOHcO4dw7gCh3DuHcO4AIu4dw7h3AKHcO4dw7gHDuLcO4dwCh3F3DuHcA4dw7h3DuAULcO4dxb+sQdxbi4dw7gHDuHcO4dwCh3DuLcO4Bw7h3DuHcA4dxbi4dwDh3DuHcO4BQ7h3DuHcA4dw7h3DuAcO4dw7h3AOHcO4dw7gCh3DuHcO4AIu4dw7h3AKHcO4dw7gHDuLcO4dwCh3F3DuHcA4dw7h3DuAULcO4dxb+sQdxbi4dw7gHDuHcO4dwCh3DuLcO4Bw7h3DuHcA4dxbi4dwCh3F3EuHcA4dw7h3DuAULcO4u4twDh3DuLcO4AIu4l3DuHcA4dw7h3DuAULuXcO4dwCh3EucQ7gHDuHcO4dwDh3DuHcO4BQ7h3F3AKHcO4dw7gBbi4tx/OKLiBw7iXDuAcO4dw7h3AOHcO4dw7gHDuHcS/OKLiAULcO4l3DuAcO4dw7h3AOHcS4dw7gHDuHcS4dwAxcXcS4uIO4txdxbi4Bbi7h3EucQdxb+cO4lxcQdxLcXEuHcAoXF3EuHcA4dxLh3AKFxcS4dwAxdxbi7i3EO4t/OHcO4dwCh3F3EuHcQdxbi7i3F3EO4t/OLcXF3AKHcS4uHcAIuLcO4txbiBw7h3EucQdxLh3DuLcQdxLh3Etz/OIuIO4l/OLcS4dxB3DuJcO4dwCi4uLcO4lxB3EuHcS4dxB3EuHcO4dwCi4txdxLh3AKHcS4dxLiDuLcO4dxLiDuLcO4dxLiDuJcO4dxbiDuLcO4lxcQdxbi3F3EOHcQdxL+cO4dw7gHDuHcO4twDh3DuHcS4g7iXDuHcW4g7iXDuLcO4dwChcO4lw7gChcO4lw7gFDuJcXDuAGLi3F3FuLiDuJbi4lw7gCh3DuJcO4g7h3EucXcA4dw7h3EO4oXF3DuHcAoXDuHcS4BQuHcO4lwCi4txcO4lxB3F3EuLcW4Bw7h3F3AOHcO4dw7gFDh3DuHcAoXDuJcXcAoXDuJcO4AIuLcO4lw7gChcO4lxbiDuJcO4dxLiDuJcO4dxbiDuJcO4dxbiDuJcO4dw7gHDuLcO4uAULcO4dxLiDuJcO4dxbiDuJcO4dxLiDuJcO4dxLiDuJcO4dxbiDuLcO4dxLiDuJcO4dxLiDuJcO4dxLiDuJcO4dxbiDuJcO4dw7gHDuHcS4uIO4lw7h3F3AKHcS4dxbgHDuHcS4dwCi4dw7h3AKHcS4dxLgBC3EuHcS4g7iXDuHcXcAoXDuJcO4BQlw7h3FuAGLi3DuLcW4g7h3EuLcW4Bw7h3FuIO4lw7h3FuIO4lw7h3FuAULcO4u4uIO4uHcS4dwAi4uLcO4lxB3EuHcS4dxB3EuHcS4dxB3EuHcO4txB3EuHcO4txB3EuHcS4dwCh3EuHcS4g7h3EuLcO4BQ7h3DuHcA4dw7h3DuAcO4dw7h3AKHcO4dw7gBFxcO4lxcAIW4lw7h3AOHcO4dw7gHDuHcO4dwAhbi3F3DuAGLi3DuHcO4BQ7h3DuHcA4dxbh3DuAcO4tw7h3AKFw7h3DuAcO4tw7h3AOHcW4dw7gHDuLcO4dwAha4txbh3AKHcS4dw7gBC3DuLcO4dwAhbiXDuHcA4dw7h3DuAELcO4dw7gHDuLcO4uAELi4dw7gHDuLcO4dwDh3FuHcO4Bw7i3DuHcAoXDuHcO4BQ7h3DuHcA4dxbh3DuAELh3DuHcA4dxbh3DuAcO4tw7h3AOHcW4dw7gBC4dw7i3AKHcS4dw7gBFxbi3DuHcAocW4lw7gChbiXDuHcO4AIuLcO4dxbgCh3DuHcS4BQuHcO4lwCi4txcO4lwCi4uHcO4dwAi4txbi4lwAhbh3DuHcA4dxbh3DuAcO4txbh3AKFw7h3DuAcO4txbh3AOHcW4dw7gHDuLcO4dwChcO4dw7gCh3DuHcO4Bw7i3DuHcA4dxbh3DuAcO4txbh3AOHcW4dw7gHDuLcO4dwCh3EuHcW4BQ7h3DuHcAoXDuHcS4AIuLcO4dxbgCh3DuHcS4BQuHcO4lwCi4txcO4lwCi4uHcO4dwAi4txbi4lwAhbh3DuHcA4dxbh3DuAcO4txbh3AKHcS4dw7gHDuLcO4dwDh3FuHcA4txcO4lwDh3F3DuHcA4dxbh3DuAcO4txbh3AOHcW4dxbgBC4dw7i3AOHcW4dw7gHDuLcW4uAELh3DuHcAoXDuJcS4BQuHcO4lxQuLcO4lwCi4u4dw7gBFxcW4lwAhbh3DuHcA4dxbh3DuAcO4txcO4BQ7h3DuHcA4dxbh3DuAcO4tw7gBFxcW4dwDh3FuHcO4dwDh3FuHcO4Bw7h3DuAcO4tw7h3AOHcW4dw7gHDuLcO4dwChbi3DuHcA4dxbh3DuAULcO4dw7gBFxcO4dwDh3FuHcO4BQ7h3DuHcA4dxbh3DuAcO4txdwAhcO4dw7gCh3EuHcW4BQuHcO4lwoXFuHcW4AIuLcO4lwAhbi3DuHcA4dxbh3DuAcO4tw7gFDh3DuHcA4dxbh3DuAcO4txcO4AIuLi3DuAcO4txcO4BQ4uLcO4Bw7i3DuHcA4dxbh3DuAcO4txbh3AOHcW4tw7gChbiXDuHcA4dxbh3DuAcO4txcO4AIuHcO4dwDh3FuHcO4BQ7h3DuHcA4dxbh3DuAcO4txbgBC4dw7h3AKHcW4tw7gChbiXDuJcKFxbi3FuHcA4dxbh3DuAcO4txbh3AOHcW4dw7gFDuLcO4dwDh3FuHcO4BQ7h3DuHcA4dxbh3DuAcO4txcO4AIuLcO4uAOHcW4dw7gFDh3DuHcA4dxbh3DuAcO4txbh3AOHcW4dw7gChbiXDuHcA4dxbh3DuAcO4tw7gFDuLcO4dwDh3FuHcAoXDuHcS4BQuHcO4lwCjcW4dxbgBC3DuHcS4AIuLcO4dxbgCh3DuHcS4BQuHcO4lwCi4txcO4lxQuLcO4dwAhbh3DuHcA4dxbh3DuAcO4txbgChw7h3DuAcO4txbh3AOHcW4lw7gFDuLcO4BQuHcO4twDh3FuHcAocW4lw7gHDuLcW4BQuLcO4dxA4dxbh3DuAcO4txbh3AKHFxLh3AOHcW4dxbgFD+cO4tw7gHDuLcO4dwChf+cO4l3AOHcW4dw7gFDuLcO4twDh3FuHcAocO4lw7gFD+cW4l3AKF/54dxbi4Bw7h3DuHcA4dxbi4dxQuLcO4dxQuLcO4dxA4dxbh3DuAUL/AM4lxLgFDh3DuHcAofz+cW4dwDh3FuLcO4BQ4txbi3AOHcW4lw7gFC4txLh3AKFxbh3FuAULh3DuHcAofz/OLcXcA4dxbh3DuAUL/AM4txLgFDuHcS4BQuLcO4dxA4dxbh3DuAcO4dxbh3AOHcO4dxbgChf8AnDuJcBQuLcW4dxQuHcS4twCjcO4dxbgFC4dw7i3AKH84lw7gHDuLcO4dwCi4txL+cO4BQ7iXDuAcO4lw7gFD+cO4lw7gCh3DuHcAocO4dw7gFDuLcO4dwCh3EuHcA4dxbh3DuAUL/AM4dxLh3AOHcW4tw7gCh/OLcS4dxQ4dxLh3AOHcO4dwDh3FuHcA4dxbh3DuAcO4lw7gChw7h3DuAcO4tw7gFDh3DuHcAocW4lw7gHDuLcW4dxQ/nHh3DuAcO4dxbgFD/AM4dxLh3AKFxbh3DuAcO4dw7gCh/OHcS4dwChw7h3DuAcO4tw7gFDh3EuHcA4dxbh3DuAcO4tw7gFDh3DuHcA4dxbh3DuAcO4txbh3AOHcO4u4dxQ/nHh3DuAcO4dxbgFC/8AOHcS4dwChcW4dw7gHDuHcO4BQuHcS4dxQ4dw7h3AKHEuHcS4Bw7i3F3AOHcO4u4dxQuLcO4dwCi4dxLh3AKFxbh3DuAULh3DuHcAIuHcO4dwCi4dxLh3AKFxbh3DuAcO4dxbgFD/84lw7gFDh3DuHcA4dxbh3DuAULh3DuHcA4dxbh3DuAULh3DuHcAocW4u4lwCi4dxLh3AKFxbh3DuAULh3DuHcAof/AJxbh3AOHcW4u4dxQ4uLcO4BQuHcO4dwChxbiXDuAULh3DuHcAocO4lxcA4dxbh3DuAcO4dxbgFD/8AOJcO4BQ4dw7h3AKHFuHcS4BQ4dxbi4dxA4dxL+cO4dxQuLcW4uIO4dxLh3AKFxbi4tw7gFC4tw7h3AKHcS4tw7gHDuLcO4BQuLcO4twCi4uHcS4dxQuLcW4tw7gFC4dxLh3AKHcS4dxLgFC4txbh3AKHcS4tw7gHDuLcW4dwChcW4dw7gChcO4lw7gFD+cO4u4BQuHcO4dxA4dxLh3DuAcO4lw7gHDuHcO4BQ7iXFw7gFDh3DuHcAofzi3DuAcO4dxbgFC/84lxbgChxbi3DuAULh3EuHcAocO4dxLgHDuLcO4u4BQuHcS4dxQ4dw7h3AOHcO4twChw7h3DuAcO4tw7gChw7h3DuAULh3EuAcO4lw7gFD/0DuHcO4BQ4dxLh3AOHcO4u4dwCh/OHcW4dwCi4dw7gHDuLcO4BQ4dxLh3AOHcO4tw7gHDuHcW4twCi4lw7i3AKHFuHcS4BQuHcO4twChf+cO4dwDh3FuHcAocO4dw7gHDuHcAofzi1EuAcO4tw7gFDuLcW4dwChxbh3EuAULh3DuLcAIuHcW4twChxbh3EuAUL/zi3DuAULh3FuLcQOHcO4dxbgHDuLcO4dwChxbh3DuAcO4u4dxbgFC4dw7i3AOHcO4lw7gBC/84dxLh3AKHcS4uAULh3DuHcA4dxbi3dxA4dxbh3DuAULiXDuHcAocO4u4dxbgCh/OHcO4dxbgFC4dxLh3AKHcS4tw7gBC/84lw7gChw7hbh3AOHcW4u4dwCh/OLcO4dwCi4dxLgHDuLcO4BQ4dxLh3AKHcS4tw7gChxbi3DuAcO4u4dxA4dxbh3DuAcO4lw7gChw7i3DuAcO4tw7gChxbi3DuAcO4txbgCh/84lw7gFDuHcO4twAhf+cO4dwCi4uLcO4BQ7iXDuAULh3DuHcA4dxbi3AOHcO4u4dwCh/OLcO4dwChxbi3DuAULh3DuAcO4tw7gChxbi3EuAULh3DuAcO4u4dxA4dxLh3AOHcO4twChxbh3DuAULh3DuAULh3DuHcAocO4tw7gFDuHcO4dwCh3DuHcAocO4lw7gBC/84lw7gCh7i3DuHcA4dxbh3AOHcO4lw7gHDuJcO4dxbgChxbh3DuAcO4tw7gChxbi3EuAULh3DuHcA4dxLh3AOHcO4u4Bw7h3DuHcAocO4lw7gFDuHcO4Bw7h3DuAcO4lw7gFDuHcO4twAhf+cO4dwCi4dxbh3AKHcS4tw7gHDuHcS4uAULi3DuHcA4dxbh3DuAcO4lw7gFDuLcO4dxA4dxLh3AOHcO4tw7gChxLh3DuAULh3DuAULh3DuHcA4dxLh3AKHcS4lw7gBC/84lxbgFC4dxbh3AOHcO4u4BQ/nEuHcW4dwCh/OHcO4dwChxbi3AOHcW4tw7gFC4tw7h3AKFxbi4u4dwChw7h3DuIO4dxLh3DuAcO4lw7gChw7h3DuAcO4tw7gHDuJcO4dxbgBC/84lw7gChw7i3DuAULh3DuHcA4dxLh3AOHcW4tw7gCh/OHcS4twCh/OHcO4twCi4dxLgHDuLcW4twChxbh3EuAULh3DuHcA4dxbh3DuAcO4tw7gChxbh3DuAcO4tw7gFDuJcO4dwDh3EuLcO4BQ/nH/Z' },
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

// This data is a summary of audit logs for a more concise display on the dashboard.
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