

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, SalesOrder, PurchaseOrder, OrderItem, User, Currency, GatePass, HistoryEntry, PackingSlip, ShippingLabel, Reminder } from '../types';
import { mockProducts, mockSalesOrders, mockPurchaseOrders, mockUsers } from '../data/mockData';
import { useSettings } from './SettingsContext';
import * as idb from '../utils/idb';
import { 
    PRODUCTS_STORE_NAME, 
    SALES_ORDERS_STORE_NAME, 
    PURCHASE_ORDERS_STORE_NAME, 
    USERS_STORE_NAME,
    REMINDERS_STORE_NAME
} from '../utils/idb';

interface DataContextType {
    products: Product[];
    salesOrders: SalesOrder[];
    purchaseOrders: PurchaseOrder[];
    users: User[];
    gatePasses: GatePass[];
    packingSlips: PackingSlip[];
    shippingLabels: ShippingLabel[];
    reminders: Reminder[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProducts: (productIds: string[]) => void;
    updateProductStatus: (productIds: string[], status: Product['status']) => void;
    addSalesOrder: (order: Omit<SalesOrder, 'id' | 'total' | 'status' | 'history'>, userName: string) => void;
    addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'total' | 'status' | 'history'>, userName: string) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    addGatePass: (gatePass: Omit<GatePass, 'gatePassId' | 'issueDate'>) => void;
    addPackingSlip: (packingSlip: { orderId: string }) => void;
    addShippingLabel: (shippingLabel: { orderId: string }) => void;
    addReminder: (reminderData: Omit<Reminder, 'id' | 'status'>) => void;
    updateReminderStatus: (reminderId: string, status: Reminder['status']) => void;
    updateSalesOrderStatus: (orderId: string, status: SalesOrder['status'], userName: string) => void;
    updatePurchaseOrderStatus: (orderId: string, status: PurchaseOrder['status'], userName: string) => void;
    updatePurchaseOrderTrackingNumber: (orderId: string, trackingNumber: string, userName: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const performOrQueueUpdate = async (action: { type: string; payload: any }) => {
    if ('serviceWorker' in navigator && 'SyncManager' in window && !navigator.onLine) {
        try {
            await idb.addToQueue(action);
            const registration = await navigator.serviceWorker.ready;
            // FIX: Cast registration to 'any' to access the 'sync' property.
            // The 'sync' property is part of the Background Sync API, which may not be in the default ServiceWorkerRegistration type.
            // The runtime check for 'SyncManager' in window ensures this is safe.
            await (registration as any).sync.register('bws-sync');
            console.log('Offline action queued for sync:', action);
        } catch (error) {
            console.error('Failed to queue action for sync:', error);
        }
    } else {
        // In a real app, this is where you would make the API call.
        console.log('Online action performed (simulated API call):', action);
    }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { lowStockThreshold } = useSettings();
    const [products, setProducts] = useState<Product[]>([]);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
    const [packingSlips, setPackingSlips] = useState<PackingSlip[]>([]);
    const [shippingLabels, setShippingLabels] = useState<ShippingLabel[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    
    useEffect(() => {
        const loadAndCacheData = async () => {
            try {
                // 1. Initialize DB
                await idb.initDB();
                
                // 2. Load from IndexedDB first for fast initial load and offline support
                const cachedProducts = await idb.loadData<Product>(PRODUCTS_STORE_NAME);
                const cachedSalesOrders = await idb.loadData<SalesOrder>(SALES_ORDERS_STORE_NAME);
                const cachedPurchaseOrders = await idb.loadData<PurchaseOrder>(PURCHASE_ORDERS_STORE_NAME);
                const cachedUsers = await idb.loadData<User>(USERS_STORE_NAME);
                const cachedReminders = await idb.loadData<Reminder>(REMINDERS_STORE_NAME);


                if (cachedProducts.length > 0) setProducts(cachedProducts);
                if (cachedSalesOrders.length > 0) setSalesOrders(cachedSalesOrders);
                if (cachedPurchaseOrders.length > 0) setPurchaseOrders(cachedPurchaseOrders);
                if (cachedUsers.length > 0) setUsers(cachedUsers);
                if (cachedReminders.length > 0) setReminders(cachedReminders);

                console.log('Loaded data from IndexedDB cache.');

                // 3. If online, fetch fresh data and update cache
                if (navigator.onLine) {
                    console.log('Online. Fetching fresh data...');
                    // Simulate API fetch with mock data
                    const freshProducts = mockProducts;
                    const freshSalesOrders = mockSalesOrders;
                    const freshPurchaseOrders = mockPurchaseOrders;
                    const freshUsers = mockUsers;
                    const freshReminders: Reminder[] = []; // No mock reminders, user-created only
                    
                    // Update state
                    setProducts(freshProducts);
                    setSalesOrders(freshSalesOrders);
                    setPurchaseOrders(freshPurchaseOrders);
                    setUsers(freshUsers);
                    // Only overwrite reminders if cache is empty, to persist user-created ones across sessions
                    if (cachedReminders.length === 0) {
                        setReminders(freshReminders);
                    }
                    
                    // Update cache
                    await idb.saveData(PRODUCTS_STORE_NAME, freshProducts);
                    await idb.saveData(SALES_ORDERS_STORE_NAME, freshSalesOrders);
                    await idb.saveData(PURCHASE_ORDERS_STORE_NAME, freshPurchaseOrders);
                    await idb.saveData(USERS_STORE_NAME, freshUsers);
                    if (cachedReminders.length === 0) {
                         await idb.saveData(REMINDERS_STORE_NAME, freshReminders);
                    }


                    console.log('Updated state and IndexedDB with fresh data.');
                } else {
                     console.log('Offline. Using cached data.');
                     // If we are offline and cache was empty, populate with mock data for demo purposes.
                     if(cachedProducts.length === 0) setProducts(mockProducts);
                     if(cachedSalesOrders.length === 0) setSalesOrders(mockSalesOrders);
                     if(cachedPurchaseOrders.length === 0) setPurchaseOrders(mockPurchaseOrders);
                     if(cachedUsers.length === 0) setUsers(mockUsers);
                }

            } catch (error) {
                console.error("Failed to load or cache data:", error);
                // Fallback to mock data if IDB fails completely
                setProducts(mockProducts);
                setSalesOrders(mockSalesOrders);
                setPurchaseOrders(mockPurchaseOrders);
                setUsers(mockUsers);
            }
        };

        loadAndCacheData();
    }, []);

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
            id: `P-${String(Date.now()).slice(-4)}`, // Use timestamp for more unique ID in demo
            status: getProductStatus(product.stock || 0),
        };
        setProducts(prev => [newProduct, ...prev]);
        performOrQueueUpdate({ type: 'ADD_PRODUCT', payload: newProduct });
    };
    
    const updateProduct = (updatedProduct: Product) => {
        const productWithStatus = {
            ...updatedProduct,
            status: getProductStatus(updatedProduct.stock || 0)
        };
        setProducts(prevProducts => prevProducts.map(p => p.id === productWithStatus.id ? productWithStatus : p));
        performOrQueueUpdate({ type: 'UPDATE_PRODUCT', payload: productWithStatus });
    }

    const deleteProducts = (productIds: string[]) => {
        setProducts(prev => prev.filter(p => !productIds.includes(p.id)));
        performOrQueueUpdate({ type: 'DELETE_PRODUCTS', payload: { productIds } });
    };

    const updateProductStatus = (productIds: string[], status: Product['status']) => {
        setProducts(prev =>
            prev.map(p =>
                productIds.includes(p.id) ? { ...p, status: status } : p
            )
        );
        performOrQueueUpdate({ type: 'UPDATE_PRODUCT_STATUS', payload: { productIds, status } });
    };

    const addSalesOrder = (order: Omit<SalesOrder, 'id' | 'total' | 'status' | 'history'>, userName: string) => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder: SalesOrder = {
            ...order,
            id: `SO-${Date.now().toString().slice(-4)}`,
            total,
            status: 'Pending',
            history: [{
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                action: 'Order Created',
                user: userName
            }]
        };

        setSalesOrders(prev => [newOrder, ...prev]);
        performOrQueueUpdate({ type: 'ADD_SALES_ORDER', payload: newOrder });

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
            id: `PO-${Date.now().toString().slice(-4)}`,
            total,
            status: 'Pending',
            history: [{
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                action: 'Order Created',
                user: userName
            }]
        };

        setPurchaseOrders(prev => [newOrder, ...prev]);
        performOrQueueUpdate({ type: 'ADD_PURCHASE_ORDER', payload: newOrder });
    };
    
    const updateSalesOrderStatus = (orderId: string, status: SalesOrder['status'], userName: string) => {
        let updatedOrder: SalesOrder | undefined;
        setSalesOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const newHistoryEntry: HistoryEntry = {
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    action: `Status changed to ${status}`,
                    user: userName
                };
                updatedOrder = { ...order, status, history: [newHistoryEntry, ...order.history] };
                return updatedOrder;
            }
            return order;
        }));
        if (updatedOrder) {
             performOrQueueUpdate({ type: 'UPDATE_SALES_ORDER_STATUS', payload: { orderId, status, userName } });
        }
    };

    const updatePurchaseOrderStatus = (orderId: string, status: PurchaseOrder['status'], userName: string) => {
        let updatedOrder: PurchaseOrder | undefined;
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
                updatedOrder = { ...order, status, history: [newHistoryEntry, ...order.history] };
                return updatedOrder;
            }
            return order;
        }));
        if (updatedOrder) {
            performOrQueueUpdate({ type: 'UPDATE_PURCHASE_ORDER_STATUS', payload: { orderId, status, userName } });
        }
    };

    const updatePurchaseOrderTrackingNumber = (orderId: string, trackingNumber: string, userName: string) => {
        let updatedOrder: PurchaseOrder | undefined;
        setPurchaseOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                const newHistoryEntry: HistoryEntry = {
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    action: `Tracking number updated`,
                    user: userName
                };
                updatedOrder = { ...order, trackingNumber, history: [newHistoryEntry, ...order.history] };
                return updatedOrder;
            }
            return order;
        }));
        if (updatedOrder) {
            performOrQueueUpdate({ type: 'UPDATE_PO_TRACKING', payload: { orderId, trackingNumber, userName } });
        }
    };


    const addUser = (user: Omit<User, 'id'>) => {
        const newUser: User = {
            ...user,
            id: `U-${String(Date.now()).slice(-4)}`,
        };
        setUsers(prev => [newUser, ...prev]);
        performOrQueueUpdate({ type: 'ADD_USER', payload: newUser });
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
        performOrQueueUpdate({ type: 'UPDATE_USER', payload: updatedUser });
    };

    const addGatePass = (gatePassData: Omit<GatePass, 'gatePassId' | 'issueDate'>) => {
        const newGatePass: GatePass = {
            ...gatePassData,
            gatePassId: `GP-${String(Date.now()).slice(-4)}`,
            issueDate: new Date().toISOString(),
        };
        setGatePasses(prev => [newGatePass, ...prev]);
        performOrQueueUpdate({ type: 'ADD_GATE_PASS', payload: newGatePass });
    };

    const addPackingSlip = (packingSlipData: { orderId: string }) => {
        const newPackingSlip: PackingSlip = {
            ...packingSlipData,
            packingSlipId: `PS-${String(Date.now()).slice(-4)}`,
            issueDate: new Date().toISOString(),
        };
        setPackingSlips(prev => [newPackingSlip, ...prev]);
        performOrQueueUpdate({ type: 'ADD_PACKING_SLIP', payload: newPackingSlip });
    };

    const addShippingLabel = (shippingLabelData: { orderId: string }) => {
        const newShippingLabel: ShippingLabel = {
            ...shippingLabelData,
            shippingLabelId: `SL-${String(Date.now()).slice(-4)}`,
            issueDate: new Date().toISOString(),
        };
        setShippingLabels(prev => [newShippingLabel, ...prev]);
        performOrQueueUpdate({ type: 'ADD_SHIPPING_LABEL', payload: newShippingLabel });
    };

    const addReminder = (reminderData: Omit<Reminder, 'id' | 'status'>) => {
        const newReminder: Reminder = {
            ...reminderData,
            id: `REM-${String(Date.now()).slice(-6)}`,
            status: 'Pending',
        };
        const updatedReminders = [newReminder, ...reminders].sort((a, b) => new Date(a.reminderDateTime).getTime() - new Date(b.reminderDateTime).getTime());
        setReminders(updatedReminders);
        idb.saveData(REMINDERS_STORE_NAME, updatedReminders); // Persist to IDB
        performOrQueueUpdate({ type: 'ADD_REMINDER', payload: newReminder });
    };

    const updateReminderStatus = (reminderId: string, status: Reminder['status']) => {
        const updatedReminders = reminders.map(r => (r.id === reminderId ? { ...r, status } : r));
        setReminders(updatedReminders);
        idb.saveData(REMINDERS_STORE_NAME, updatedReminders); // Persist to IDB
        performOrQueueUpdate({ type: 'UPDATE_REMINDER_STATUS', payload: { reminderId, status } });
    };


    return (
        <DataContext.Provider value={{ products, salesOrders, purchaseOrders, users, gatePasses, packingSlips, shippingLabels, reminders, addProduct, updateProduct, deleteProducts, updateProductStatus, addSalesOrder, addPurchaseOrder, addUser, updateUser, addGatePass, addPackingSlip, addShippingLabel, addReminder, updateReminderStatus, updateSalesOrderStatus, updatePurchaseOrderStatus, updatePurchaseOrderTrackingNumber }}>
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