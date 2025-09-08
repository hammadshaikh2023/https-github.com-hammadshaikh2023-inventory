import React, { useState, useEffect, useMemo } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { PurchaseOrder, OrderItem, Currency } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { PlusIcon } from '../components/IconComponents';
import ExportDropdown from '../components/ExportDropdown';
import CurrencySelector from '../components/CurrencySelector';


export const CreatePurchaseOrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { products, addPurchaseOrder } = useData();
    const { currentUser } = useAuth();
    const { defaultCurrency } = useSettings();
    const [vendorName, setVendorName] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [currency, setCurrency] = useState<Currency>(defaultCurrency);
    // FIX: The state `items` should be an array of objects, not a single object.
    const [items, setItems] = useState<Partial<OrderItem & { productNameSearch?: string }>[]>([{ productId: '', quantity: 1, price: 0 }]);
    const [itemErrors, setItemErrors] = useState<Record<number, string | null>>({});

    useEffect(() => {
        if (isOpen) {
            setCurrency(defaultCurrency);
            setVendorName('');
            setItems([{ productId: '', quantity: 1, price: 0 }]);
            setOrderDate(new Date().toISOString().split('T')[0]);
            setItemErrors({});
        }
    }, [isOpen, defaultCurrency]);

    const handleItemChange = (index: number, field: keyof OrderItem | 'productNameSearch', value: any) => {
        const newItems = [...items];
        const currentItem = { ...newItems[index] };

        if (field === 'productNameSearch') {
            currentItem.productNameSearch = value;
            const product = products.find(p => p.name.toLowerCase() === value.toLowerCase());
            if (product) {
                currentItem.productId = product.id;
                currentItem.productName = product.name;
                currentItem.price = product.price; // Auto-populate price
            } else {
                currentItem.productId = '';
                currentItem.productName = '';
                currentItem.price = 0;
            }
        } else if (field === 'quantity') {
            const numValue = Number(value);
            if (value !== '' && (!Number.isInteger(numValue) || numValue <= 0)) {
                setItemErrors(prev => ({...prev, [index]: 'Must be a positive number.'}));
            } else {
                const newErrors = {...itemErrors};
                delete newErrors[index];
                setItemErrors(newErrors);
            }
            currentItem.quantity = value === '' ? undefined : parseInt(value, 10);
            
        } else if (field === 'price') {
            currentItem.price = parseFloat(value) || 0;
        }
        
        newItems[index] = currentItem;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { productId: '', quantity: 1, price: 0 }]);
    };
    
    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let hasErrors = false;
        const newErrors: Record<number, string | null> = {};
        items.forEach((item, index) => {
            if (item.productId && (!item.quantity || item.quantity <= 0)) {
                newErrors[index] = 'Must be a positive number.';
                hasErrors = true;
            }
        });

        if (hasErrors) {
            setItemErrors(newErrors);
            alert("Please fix invalid quantities before submitting.");
            return;
        }

        const finalItems = items
            .filter(i => i.productId && i.quantity && typeof i.price !== 'undefined')
            .map(i => i as OrderItem);

        if (finalItems.length === 0) {
            alert("Please add at least one valid item to the order.");
            return;
        }
        
        if (!currentUser) {
            alert("No user logged in.");
            return;
        }

        addPurchaseOrder({
            vendor: {
                name: vendorName,
                contactPerson: 'Demo Contact',
            },
            date: orderDate,
            currency: currency,
            items: finalItems,
        }, currentUser.name);

        onClose();
    };

    const hasErrors = Object.values(itemErrors).some(error => error !== null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Purchase Order">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor Name</label>
                        <input type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</label>
                        <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                        <CurrencySelector value={currency} onChange={setCurrency} />
                    </div>
                </div>

                <h4 className="font-semibold text-gray-800 dark:text-white pt-2">Order Items</h4>
                <div className="grid grid-cols-12 gap-2 px-2 pb-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-right">Total</div>
                    <div className="col-span-1"></div>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 pt-2">
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 items-start gap-2">
                            <div className="col-span-5">
                                <input
                                    list="product-list"
                                    value={item.productNameSearch || item.productName || ''}
                                    onChange={e => handleItemChange(index, 'productNameSearch', e.target.value)}
                                    placeholder="Search product..."
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    min="1"
                                    step="1"
                                    value={item.quantity ?? ''}
                                    onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                />
                                {itemErrors[index] && <p className="text-red-500 text-xs mt-1">{itemErrors[index]}</p>}
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    step="0.01"
                                    min="0"
                                    value={item.price ?? ''}
                                    onChange={e => handleItemChange(index, 'price', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2 text-sm text-right pr-2 text-gray-800 dark:text-gray-200">
                                <span className="font-medium">
                                    {(item.quantity && typeof item.price !== 'undefined' ? (item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00')}
                                </span>
                            </div>
                             <button type="button" onClick={() => removeItem(index)} className="col-span-1 text-red-500 hover:text-red-700 text-2xl flex justify-center items-center">&times;</button>
                        </div>
                    ))}
                    <datalist id="product-list">
                        {products.map(p => <option key={p.id} value={p.name} />)}
                    </datalist>
                </div>
                 <button type="button" onClick={addItem} className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium"><PlusIcon className="w-4 h-4 mr-1"/>Add Item</button>

                <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                    <button type="submit" disabled={hasErrors} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">Create Order</button>
                </div>
            </form>
        </Modal>
    )
};

const ViewPurchaseOrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: PurchaseOrder | null;
}> = ({ isOpen, onClose, order }) => {
    const { updatePurchaseOrderStatus, updatePurchaseOrderTrackingNumber } = useData();
    const { currentUser } = useAuth();
    const [trackingInput, setTrackingInput] = useState('');
    const [historyDateFrom, setHistoryDateFrom] = useState('');
    const [historyDateTo, setHistoryDateTo] = useState('');
    const [historyUser, setHistoryUser] = useState('All');

    useEffect(() => {
        if(order) {
            setTrackingInput(order.trackingNumber || '');
        }
        if (isOpen) {
            setHistoryDateFrom('');
            setHistoryDateTo('');
            setHistoryUser('All');
        }
    }, [order, isOpen]);
    
    const historyUsers = useMemo(() => {
        if (!order) return [];
        return ['All', ...Array.from(new Set(order.history.map(h => h.user)))];
    }, [order]);

    const filteredHistory = useMemo(() => {
        if (!order) return [];
        return order.history.filter(entry => {
            const entryDate = new Date(entry.timestamp.split(' ')[0]);
            if (historyDateFrom && new Date(historyDateFrom) > entryDate) return false;
            if (historyDateTo && new Date(historyDateTo) < entryDate) return false;
            if (historyUser !== 'All' && entry.user !== historyUser) return false;
            return true;
        });
    }, [order, historyDateFrom, historyDateTo, historyUser]);


    if (!order) return null;

    const handleStatusChange = (newStatus: PurchaseOrder['status']) => {
        if (order && currentUser) {
            updatePurchaseOrderStatus(order.id, newStatus, currentUser.name);
        }
        onClose();
    };
    
    const handleTrackingUpdate = () => {
        if (order && currentUser && trackingInput.trim() !== (order.trackingNumber || '')) {
            updatePurchaseOrderTrackingNumber(order.id, trackingInput.trim(), currentUser.name);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Purchase Order: ${order.id}`}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Vendor Information</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.vendor.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.vendor.contactPerson}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Order Items</h4>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 mt-2">
                        {order.items.map(item => (
                            <li key={item.productId} className="py-2 flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{item.productName} (x{item.quantity})</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-white">{order.currency} {(item.quantity * item.price).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-t dark:border-gray-700 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white">Shipping Information</h4>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {currentUser?.roles.includes('Admin') ? (
                            <div className="flex items-center space-x-2">
                                <label htmlFor="trackingNumber" className="font-medium">Tracking Number:</label>
                                <input
                                    id="trackingNumber"
                                    type="text"
                                    value={trackingInput}
                                    onChange={(e) => setTrackingInput(e.target.value)}
                                    placeholder="Enter tracking number"
                                    className="flex-grow"
                                />
                                <button
                                    onClick={handleTrackingUpdate}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <p>
                                <span className="font-medium">Tracking Number:</span> {order.trackingNumber || 'Not available'}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mt-4 pt-4 border-t dark:border-gray-700">Order History</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center p-2 my-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                        <div className="sm:col-span-2 flex items-center gap-2">
                            <input type="date" value={historyDateFrom} onChange={e => setHistoryDateFrom(e.target.value)} className="w-full text-xs p-1.5" />
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                            <input type="date" value={historyDateTo} onChange={e => setHistoryDateTo(e.target.value)} className="w-full text-xs p-1.5" />
                        </div>
                        <div className="sm:col-span-1">
                            <select value={historyUser} onChange={e => setHistoryUser(e.target.value)} className="w-full text-xs p-1.5">
                                {historyUsers.map(user => <option key={user} value={user}>{user}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <button onClick={() => { setHistoryDateFrom(''); setHistoryDateTo(''); setHistoryUser('All'); }} className="w-full text-xs p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Reset</button>
                        </div>
                    </div>
                    <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {filteredHistory.length > 0 ? filteredHistory.map((entry, index) => (
                            <li key={index} className="flex items-center text-sm">
                                <div className="flex-shrink-0 w-32 text-gray-500 dark:text-gray-400 text-xs">
                                    {new Date(entry.timestamp).toLocaleString()}
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-200">{entry.action}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">by {entry.user}</p>
                                </div>
                            </li>
                        )) : <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No history entries match the current filters.</p>}
                    </ul>
                </div>
                <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">Total: {order.currency} {order.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    { currentUser?.roles.includes('Admin') && order.status === 'Pending' && (
                        <div className="flex space-x-2">
                            <button onClick={() => handleStatusChange('Cancelled')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancel Order</button>
                            <button onClick={() => handleStatusChange('Received')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Mark as Received</button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};


const PurchasesPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { purchaseOrders } = useData();
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

    const handleViewOrder = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        setViewModalOpen(true);
    };

    const columns = [
        { header: 'Order ID', accessor: 'id' as keyof PurchaseOrder, sortable: true },
        { header: 'Vendor', accessor: 'vendor' as keyof PurchaseOrder, sortable: true, render: (item: PurchaseOrder) => item.vendor.name },
        { header: 'Date', accessor: 'date' as keyof PurchaseOrder, sortable: true },
        { header: 'Tracking #', accessor: 'trackingNumber' as keyof PurchaseOrder, sortable: true, render: (item: PurchaseOrder) => item.trackingNumber || 'N/A' },
        { header: 'Total', accessor: 'total' as keyof PurchaseOrder, sortable: true, render: (item: PurchaseOrder) => `${item.currency} ${item.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
        { header: 'Status', accessor: 'status' as keyof PurchaseOrder, sortable: true, render: (item: PurchaseOrder) => {
            const color = item.status === 'Received' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                        : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{item.status}</span>;
        }},
    ];

    const exportableData = purchaseOrders.map(order => ({
        ...order,
        vendor: order.vendor.name, // Flatten vendor object for export
    }));
    const exportColumns = columns.map(c => ({ header: c.header, accessor: c.accessor }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Purchase Orders</h2>
                <div className="flex items-center space-x-2">
                    <ExportDropdown data={exportableData} columns={exportColumns} fileName="Purchase_Orders" />
                    {currentUser?.roles.includes('Admin') && (
                        <button onClick={() => setCreateModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 no-print">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create Purchase Order
                        </button>
                    )}
                </div>
            </div>
            <DataTable columns={columns} data={purchaseOrders} renderActions={(order) => (
                <div className="space-x-2 no-print">
                    <button onClick={() => handleViewOrder(order)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">View Details</button>
                </div>
            )} />
            <CreatePurchaseOrderModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
            <ViewPurchaseOrderModal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} order={selectedOrder} />
        </div>
    );
};

export default PurchasesPage;