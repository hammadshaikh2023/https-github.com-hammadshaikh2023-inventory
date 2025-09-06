
import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { PurchaseOrder, OrderItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { PlusIcon } from '../components/IconComponents';


const CreatePurchaseOrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { products, addPurchaseOrder } = useData();
    const [vendorName, setVendorName] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<Partial<OrderItem>[]>([{ productId: '', quantity: 1, price: 0 }]);

    const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
        const newItems = [...items];
        const currentItem = { ...newItems[index], [field]: value };
        
        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if(product) {
                currentItem.productName = product.name;
            }
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
        const finalItems = items
            .filter(i => i.productId && i.quantity && i.price)
            .map(i => i as OrderItem);

        if (finalItems.length === 0) {
            alert("Please add at least one valid item to the order.");
            return;
        }

        addPurchaseOrder({
            vendor: {
                name: vendorName,
                contactPerson: 'Demo Contact',
            },
            date: orderDate,
            items: finalItems,
        });

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Purchase Order">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor Name</label>
                        <input type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</label>
                        <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>

                <h4 className="font-semibold text-gray-800 dark:text-white pt-2">Order Items</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                            <select
                                value={item.productId}
                                onChange={e => handleItemChange(index, 'productId', e.target.value)}
                                className="col-span-5 shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="">Select a product</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input
                                type="number"
                                placeholder="Qty"
                                min="1"
                                value={item.quantity}
                                onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                                className="col-span-3 shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                step="0.01"
                                min="0"
                                value={item.price}
                                onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                className="col-span-3 shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                             <button type="button" onClick={() => removeItem(index)} className="col-span-1 text-red-500 hover:text-red-700">&times;</button>
                        </div>
                    ))}
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


const PurchasesPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { purchaseOrders } = useData();
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const columns = [
        { header: 'Order ID', accessor: 'id' as keyof PurchaseOrder, sortable: true },
        { header: 'Vendor', accessor: 'vendor' as keyof PurchaseOrder, sortable: true, render: (item: PurchaseOrder) => item.vendor.name },
        { header: 'Date', accessor: 'date' as keyof PurchaseOrder, sortable: true },
        { header: 'Total', accessor: 'total' as keyof PurchaseOrder, sortable: true, render: (item: PurchaseOrder) => `$${item.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
        { header: 'Status', accessor: 'status' as keyof PurchaseOrder, sortable: true, render: (item: PurchaseOrder) => {
            const color = item.status === 'Received' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                        : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{item.status}</span>;
        }},
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Purchase Orders</h2>
                {currentUser?.roles.includes('Admin') && (
                    <button onClick={() => setCreateModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create Purchase Order
                    </button>
                )}
            </div>
            <DataTable columns={columns} data={purchaseOrders} renderActions={() => (
                <div className="space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">View</button>
                </div>
            )} />
            <CreatePurchaseOrderModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
        </div>
    );
};

export default PurchasesPage;