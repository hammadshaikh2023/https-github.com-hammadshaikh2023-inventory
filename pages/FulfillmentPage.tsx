
import React from 'react';
import DataTable from '../components/DataTable';
import { SalesOrder } from '../types';
import { useData } from '../context/DataContext';

const FulfillmentPage: React.FC = () => {
    const { salesOrders } = useData();
    const ordersToFulfill = salesOrders.filter(o => o.status === 'Pending');

    const columns = [
        { header: 'Order ID', accessor: 'id' as keyof SalesOrder, sortable: true },
        { header: 'Customer', accessor: 'customer' as keyof SalesOrder, sortable: true, render: (item: SalesOrder) => item.customer.name },
        { header: 'Date', accessor: 'date' as keyof SalesOrder, sortable: true },
        { 
            header: 'Items to Fulfill', 
            accessor: 'items' as keyof SalesOrder,
            render: (item: SalesOrder) => (
                <ul className="text-xs list-disc pl-4">
                    {item.items.map(product => (
                        <li key={product.productId}>
                            <span className="font-semibold">{product.quantity}x</span> {product.productName}
                        </li>
                    ))}
                </ul>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Order Fulfillment</h2>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Pending Orders</h3>
                <DataTable columns={columns} data={ordersToFulfill} renderActions={() => (
                    <div className="space-x-2">
                        <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md dark:bg-indigo-900/50 dark:text-indigo-300">Create Packing Slip</button>
                        <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md dark:bg-green-900/50 dark:text-green-300">Generate Shipping Label</button>
                    </div>
                )} />
            </div>
        </div>
    );
};

export default FulfillmentPage;
