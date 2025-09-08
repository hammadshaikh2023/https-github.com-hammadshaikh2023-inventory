import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { SalesOrder, OrderItem, Currency } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { PlusIcon } from '../components/IconComponents';
import ExportDropdown from '../components/ExportDropdown';
import CurrencySelector from '../components/CurrencySelector';

const CreateSalesOrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { products, addSalesOrder } = useData();
    const { currentUser } = useAuth();
    const { defaultCurrency } = useSettings();
    const [customerName, setCustomerName] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [currency, setCurrency] = useState<Currency>(defaultCurrency);
    // FIX: The 'items' state was incorrectly typed as a single object instead of an array of objects.
    const [items, setItems] = useState<Partial<OrderItem & { productNameSearch?: string }>[]>([{ productId: '', quantity: 1, price: 0 }]);
    const [itemErrors, setItemErrors] = useState<Record<number, string | null>>({});

    useEffect(() => {
        if (isOpen) {
            setCurrency(defaultCurrency);
            setCustomerName('');
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
                currentItem.price = product.price;
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
        
        addSalesOrder({
            customer: {
                name: customerName,
                email: 'demo@email.com',
                shippingAddress: '123 Demo St',
            },
            date: orderDate,
            currency: currency,
            items: finalItems,
        }, currentUser.name);
        onClose();
    };

    const hasErrors = Object.values(itemErrors).some(error => error !== null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Sales Order">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
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


const ViewSalesOrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: SalesOrder | null;
}> = ({ isOpen, onClose, order }) => {
    const { updateSalesOrderStatus } = useData();
    const { currentUser } = useAuth();

    if (!order) return null;

    const handleStatusChange = (newStatus: SalesOrder['status']) => {
        if (order && currentUser) {
            updateSalesOrderStatus(order.id, newStatus, currentUser.name);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Order Details: ${order.id}`}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Customer Information</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.customer.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.customer.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.customer.shippingAddress}</p>
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
                 <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mt-4 pt-4 border-t dark:border-gray-700">Order History</h4>
                    <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {order.history.map((entry, index) => (
                            <li key={index} className="flex items-center text-sm">
                                <div className="flex-shrink-0 w-32 text-gray-500 dark:text-gray-400 text-xs">
                                    {new Date(entry.timestamp).toLocaleString()}
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-200">{entry.action}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">by {entry.user}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">Total: {order.currency} {order.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                     { currentUser?.roles.includes('Admin') && order.status === 'Pending' && (
                        <div className="flex space-x-2">
                            <button onClick={() => handleStatusChange('Cancelled')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancel Order</button>
                            <button onClick={() => handleStatusChange('Fulfilled')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Mark as Fulfilled</button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

const SalesPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { salesOrders } = useData();
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

    const handleViewOrder = (order: SalesOrder) => {
        setSelectedOrder(order);
        setViewModalOpen(true);
    }

    const columns = [
        { header: 'Order ID', accessor: 'id' as keyof SalesOrder, sortable: true },
        { header: 'Customer', accessor: 'customer' as keyof SalesOrder, sortable: true, render: (item: SalesOrder) => item.customer.name },
        { header: 'Date', accessor: 'date' as keyof SalesOrder, sortable: true },
        { header: 'Total', accessor: 'total' as keyof SalesOrder, sortable: true, render: (item: SalesOrder) => `${item.currency} ${item.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
        { header: 'Status', accessor: 'status' as keyof SalesOrder, sortable: true, render: (item: SalesOrder) => {
            const color = item.status === 'Fulfilled' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                        : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{item.status}</span>;
        }},
    ];

    const exportableData = salesOrders.map(order => ({
        ...order,
        customer: order.customer.name, // Flatten customer object for export
    }));
    const exportColumns = columns.map(c => ({ header: c.header, accessor: c.accessor }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Orders</h2>
                <div className="flex items-center space-x-2">
                    <ExportDropdown data={exportableData} columns={exportColumns} fileName="Sales_Orders" />
                    {currentUser?.roles.includes('Admin') && (
                        <button onClick={() => setCreateModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 no-print">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create Sales Order
                        </button>
                    )}
                </div>
            </div>
            <DataTable columns={columns} data={salesOrders} renderActions={(order) => (
                 <div className="space-x-2 no-print">
                    <button onClick={() => handleViewOrder(order)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">View Details</button>
                </div>
            )} />
            <CreateSalesOrderModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
            <ViewSalesOrderModal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} order={selectedOrder} />
        </div>
    );
};

export default SalesPage;