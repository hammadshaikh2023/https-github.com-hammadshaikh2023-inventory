import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, SalesOrder, PurchaseOrder, OrderItem, User, Currency } from '../types';
import { mockProducts, mockSalesOrders, mockPurchaseOrders, mockUsers } from '../data/mockData';

interface DataContextType {
    products: Product[];
    salesOrders: SalesOrder[];
    purchaseOrders: PurchaseOrder[];
    users: User[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    addSalesOrder: (order: Omit<SalesOrder, 'id' | 'total' | 'status'> & { items: OrderItem[], currency: Currency }) => void;
    addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'total' | 'status'> & { items: OrderItem[], currency: Currency }) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
    const [users, setUsers] = useState<User[]>(mockUsers);

    const updateProductStock = (productId: string, quantityChange: number) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.id === productId) {
                    const newStock = p.stock + quantityChange;
                    let newStatus: Product['status'] = 'In Stock';
                    if (newStock <= 0) {
                        newStatus = 'Out of Stock';
                    } else if (newStock < 1000) { // Assuming 1000 is the low stock threshold
                        newStatus = 'Low Stock';
                    }
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
        };
        setProducts(prev => [newProduct, ...prev]);
    };
    
    const updateProduct = (updatedProduct: Product) => {
        setProducts(prevProducts => prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }

    const addSalesOrder = (order: Omit<SalesOrder, 'id' | 'total' | 'status'> & { items: OrderItem[], currency: Currency }) => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder: SalesOrder = {
            ...order,
            id: `SO-${salesOrders.length + 103}`,
            total,
            status: 'Pending', // All new orders are pending
        };

        setSalesOrders(prev => [newOrder, ...prev]);

        // Decrease stock for each item in the order
        order.items.forEach(item => {
            if(item.productId){
                updateProductStock(item.productId, -item.quantity);
            }
        });
    };

    const addPurchaseOrder = (order: Omit<PurchaseOrder, 'id' | 'total' | 'status'> & { items: OrderItem[], currency: Currency }) => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder: PurchaseOrder = {
            ...order,
            id: `PO-${purchaseOrders.length + 203}`,
            total,
            status: 'Received', // Assume new POs are received to update stock
        };

        setPurchaseOrders(prev => [newOrder, ...prev]);

        // Increase stock for each item in the order
        // This simulates the order being immediately received
        order.items.forEach(item => {
             if(item.productId){
                updateProductStock(item.productId, item.quantity);
            }
        });
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


    return (
        <DataContext.Provider value={{ products, salesOrders, purchaseOrders, users, addProduct, updateProduct, addSalesOrder, addPurchaseOrder, addUser, updateUser }}>
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