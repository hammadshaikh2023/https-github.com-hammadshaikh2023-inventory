import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, SalesOrder, PurchaseOrder, OrderItem, User, Currency, GatePass, HistoryEntry } from '../types';
import { mockProducts, mockSalesOrders, mockPurchaseOrders, mockUsers } from '../data/mockData';
import { useSettings } from './SettingsContext';

interface DataContextType {
    products: Product[];
    salesOrders: SalesOrder[];
    purchaseOrders: PurchaseOrder[];
    users: User[];
    gatePasses: GatePass[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    addSalesOrder: (order: Omit<SalesOrder, 'id' | 'total' | 'status' | 'history'>, userName: string) => void;
    addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'total' | 'status' | 'history'>, userName: string) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    addGatePass: (gatePass: Omit<GatePass, 'gatePassId' | 'issueDate'>) => void;
    updateSalesOrderStatus: (orderId: string, status: SalesOrder['status'], userName: string) => void;
    updatePurchaseOrderStatus: (orderId: string, status: PurchaseOrder['status'], userName: string) => void;
    bulkUpdateProductStatus: (productIds: string[], status: Product['status']) => void;
    bulkAdjustProductStock: (productIds: string[], adjustment: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { lowStockThreshold } = useSettings();
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [gatePasses, setGatePasses] = useState<GatePass[]>([]);


    const getProductStatus = (stock: number): Product['status'] => {
        if (stock <= 0) {
            return 'Out of Stock';
        }
        if (stock < lowStockThreshold) {
            return 'Low Stock';
        }
        return 'In Stock';
    };

    const updateProductStock = (productId: string, quantityChange: number) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.id === productId) {
                    const newStock = p.stock + quantityChange;
                    const newStatus = getProductStatus(newStock);
                    return { ...p, stock: newStock < 0 ? 0 : newStock, status: newStatus };
                }
                return p;
            })
        );
    };

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...product,
            id: `P-${String(products.length + 1).padStart(3, '0')}`,
            status: getProductStatus(product.stock || 0),
        };
        setProducts(prev => [newProduct, ...prev]);
    };
    
    const updateProduct = (updatedProduct: Product) => {
        const productWithStatus = {
            ...updatedProduct,
            status: getProductStatus(updatedProduct.stock || 0)
        };
        setProducts(prevProducts => prevProducts.map(p => p.id === productWithStatus.id ? productWithStatus : p));
    }

    const addSalesOrder = (order: Omit<SalesOrder, 'id' | 'total' | 'status' | 'history'>, userName: string) => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder: SalesOrder = {
            ...order,
            id: `SO-${salesOrders.length + 103}`,
            total,
            status: 'Pending',
            history: [{
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                action: 'Order Created',
                user: userName
            }]
        };

        setSalesOrders(prev => [newOrder, ...prev]);

        order.items.forEach(item => {
            if(item.productId){
                updateProductStock(item.productId, -item.quantity);
            }
        });
    };

    const addPurchaseOrder = (order: Omit<PurchaseOrder, 'id' | 'total' | 'status' | 'history'>, userName: string) => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder: PurchaseOrder = {
            ...order,
            id: `PO-${purchaseOrders.length + 203}`,
            total,
            status: 'Pending',
            history: [{
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                action: 'Order Created',
                user: userName
            }]
        };

        setPurchaseOrders(prev => [newOrder, ...prev]);
    };
    
    const updateSalesOrderStatus = (orderId: string, status: SalesOrder['status'], userName: string) => {
        setSalesOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const newHistoryEntry: HistoryEntry = {
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    action: `Status changed to ${status}`,
                    user: userName
                };
                return { ...order, status, history: [newHistoryEntry, ...order.history] };
            }
            return order;
        }));
    };

    const updatePurchaseOrderStatus = (orderId: string, status: PurchaseOrder['status'], userName: string) => {
        setPurchaseOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const newHistoryEntry: HistoryEntry = {
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    action: `Status changed to ${status}`,
                    user: userName
                };
                
                if (status === 'Received' && order.status !== 'Received') {
                    order.items.forEach(item => {
                        if(item.productId) {
                            updateProductStock(item.productId, item.quantity);
                        }
                    });
                }
                
                return { ...order, status, history: [newHistoryEntry, ...order.history] };
            }
            return order;
        }));
    };


    const addUser = (user: Omit<User, 'id'>) => {
        const newUser: User = {
            ...user,
            id: `U-${String(users.length + 1).padStart(3, '0')}`,
        };
        setUsers(prev => [newUser, ...prev]);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    };

    const addGatePass = (gatePassData: Omit<GatePass, 'gatePassId' | 'issueDate'>) => {
        const newGatePass: GatePass = {
            ...gatePassData,
            gatePassId: `GP-${String(gatePasses.length + 1).padStart(4, '0')}`,
            issueDate: new Date().toISOString(),
        };
        setGatePasses(prev => [newGatePass, ...prev]);
    };

    const bulkUpdateProductStatus = (productIds: string[], newStatus: Product['status']) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (productIds.includes(p.id)) {
                    // When manually setting status, it overrides the automatic stock check logic.
                    // This is intentional for a direct status update.
                    return { ...p, status: newStatus };
                }
                return p;
            })
        );
    };

    const bulkAdjustProductStock = (productIds: string[], adjustment: number) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (productIds.includes(p.id)) {
                    const newStock = p.stock + adjustment;
                    // Automatically update the status based on the new stock level.
                    const newStatus = getProductStatus(newStock);
                    return { ...p, stock: newStock < 0 ? 0 : newStock, status: newStatus };
                }
                return p;
            })
        );
    };


    return (
        <DataContext.Provider value={{ products, salesOrders, purchaseOrders, users, gatePasses, addProduct, updateProduct, addSalesOrder, addPurchaseOrder, addUser, updateUser, addGatePass, updateSalesOrderStatus, updatePurchaseOrderStatus, bulkUpdateProductStatus, bulkAdjustProductStock }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};