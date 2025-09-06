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
    const { defaultCurrency } = useSettings();
    const [customerName, setCustomerName] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [currency, setCurrency] = useState<Currency>(defaultCurrency);
    const [items, setItems] = useState<Partial<OrderItem & { productNameSearch?: string }>>([{ productId: '', quantity: 1 }]);

    useEffect(() => {
        if (isOpen) {
            setCurrency(defaultCurrency);
            setCustomerName('');
            setItems([{ productId: '', quantity: 1 }]);
            setOrderDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, defaultCurrency]);


    const handleItemChange = (index: number, field: keyof OrderItem | 'productNameSearch', value: any) => {
        const newItems = [...items];
        const currentItem = { ...newItems[index] };

        if (field === 'productNameSearch') {
            const product = products.find(p => p.name.toLowerCase() === value.toLowerCase());
            if (product) {
                currentItem.productId = product.id;
                currentItem.productName = product.name;
                currentItem.price = product.price;
            }
            currentItem.productNameSearch = value;
        } else if (field === 'price' || field === 'quantity') {
             currentItem[field] = parseFloat(value) || 0;
        }
        
        newItems[index] = currentItem;
        setItems(newItems);
    };


    const addItem = () => {
        setItems([...items, { productId: '', quantity: 1 }]);
    };
    
    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalItems = items
            .filter(i => i.productId && i.quantity && typeof i.price !== 'undefined')
            .map(i => i as OrderItem);

        if (finalItems.length === 0) {
            alert("Please add at least one valid item to the order.");
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
        });
        onClose();
    };

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
                        <div key={index} className="grid grid-cols-12 items-center gap-2">
                            <div className="col-span-5">
                                <input
                                    list="product-list"
                                    value={item.productNameSearch || item.productName || ''}
                                    onChange={e => handleItemChange(index, 'productNameSearch', e.target.value)}
                                    placeholder="Search product..."
                                />
                            </div>
                            <input
                                type="number"
                                placeholder="Qty"
                                min="1"
                                value={item.quantity}
                                onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                className="col-span-2"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                step="0.01"
                                min="0"
                                value={item.price}
                                onChange={e => handleItemChange(index, 'price', e.target.value)}
                                className="col-span-2"
                            />
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
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Order</button>
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
    if (!order) return null;

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
                <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">Total: {order.currency} {order.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
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
                    <button onClick={() => handleViewOrder(order)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">View</button>
                    {currentUser?.roles.includes('Admin') && <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium">Cancel</button>}
                </div>
            )} />

            <ViewSalesOrderModal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} order={selectedOrder} />
            <CreateSalesOrderModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
        </div>
    );
};

export default SalesPage;