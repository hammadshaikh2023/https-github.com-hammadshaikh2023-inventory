
import React, { useState, useMemo, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { SalesOrder, GatePass } from '../types';
import { useData } from '../context/DataContext';
import { useDebounce } from '../hooks/useDebounce';
import { PrinterIcon } from '../components/IconComponents';

const PackingSlipModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: SalesOrder | null;
}> = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Packing Slip for Order #${order.id}`}>
            <div className="printable-content space-y-6 text-gray-800">
                <header className="text-center">
                    <h2 className="text-2xl font-bold">Packing Slip</h2>
                    <p>Order ID: {order.id}</p>
                </header>
                <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
                    <div>
                        <h3 className="font-semibold">BWS Inc.</h3>
                        <p>123 Industrial Ave, Gravelton</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Ship To:</h3>
                        <p>{order.customer.name}</p>
                        <p>{order.customer.shippingAddress}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Product Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Quantity</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Unit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {order.items.map(item => (
                                <tr key={item.productId}>
                                    <td className="px-4 py-2">{item.productName}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">Units</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <footer className="pt-8 mt-8 border-t">
                    <div className="flex justify-between">
                        <div>
                            <p className="mt-4">Packed by: _________________________</p>
                        </div>
                        <div>
                            <p className="mt-4">Checked by: ________________________</p>
                        </div>
                    </div>
                </footer>
                <div className="flex justify-end pt-4 no-print">
                    <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PrinterIcon className="w-5 h-5 mr-2" /> Print
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const ShippingLabelModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: SalesOrder | null;
}> = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Shipping Label for Order #${order.id}`}>
            <div className="printable-content border-4 border-dashed p-4" style={{ minHeight: '400px', width: '100%'}}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border-r pr-4">
                        <h4 className="text-sm font-light">FROM:</h4>
                        <p className="font-bold text-lg">BWS Inc.</p>
                        <p>123 Industrial Ave</p>
                        <p>Gravelton, ST 12345</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-light">TO:</h4>
                        <p className="font-bold text-lg">{order.customer.name}</p>
                        <p>{order.customer.shippingAddress}</p>
                    </div>
                </div>
                <div className="text-center mt-8 pt-8 border-t-2 border-dashed">
                    <p className="text-lg font-mono tracking-widest">||| | ||| |||| || |||| |||| |||</p>
                    <p className="font-bold text-2xl">{order.id}</p>
                </div>
                 <div className="flex justify-end pt-4 no-print">
                    <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PrinterIcon className="w-5 h-5 mr-2" /> Print
                    </button>
                </div>
            </div>
        </Modal>
    );
}

const GatePassModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: SalesOrder | null;
    mode: 'create' | 'view';
}> = ({ isOpen, onClose, order, mode }) => {
    const { gatePasses, addGatePass } = useData();
    const [formData, setFormData] = useState<Omit<GatePass, 'gatePassId' | 'issueDate' | 'orderId'>>({
        driverName: '', driverContact: '', driverIdNumber: '', driverLicenseNumber: '', vehicleNumber: ''
    });

    if (!order) return null;
    const existingGatePass = gatePasses.find(gp => gp.orderId === order.id);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addGatePass({ orderId: order.id, ...formData });
        onClose();
    };
    
     const handleEmail = () => {
        if (!existingGatePass) return;
        const subject = `Gate Pass for Order ${order.id}`;
        const body = `
GATE PASS - ${existingGatePass.gatePassId}
-----------------------------------
Order ID: ${order.id}
Customer: ${order.customer.name}
Issue Date: ${new Date(existingGatePass.issueDate).toLocaleString()}
-----------------------------------
DRIVER DETAILS
Name: ${existingGatePass.driverName}
Contact: ${existingGatePass.driverContact}
ID Number: ${existingGatePass.driverIdNumber}
License No: ${existingGatePass.driverLicenseNumber}
-----------------------------------
VEHICLE DETAILS
Vehicle No: ${existingGatePass.vehicleNumber}
-----------------------------------
ITEMS
${order.items.map(item => `- ${item.quantity}x ${item.productName}`).join('\n')}
-----------------------------------
This pass authorizes the above vehicle and driver to exit the premises with the specified goods.
`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
        window.location.href = mailtoLink;
    };

    if (mode === 'create') {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title={`Create Gate Pass for Order #${order.id}`}>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium">Driver's Name</label>
                            <input type="text" name="driverName" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Driver's Contact</label>
                            <input type="tel" name="driverContact" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Driver's ID Number</label>
                            <input type="text" name="driverIdNumber" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Driver's License Number</label>
                            <input type="text" name="driverLicenseNumber" onChange={handleChange} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Vehicle Number</label>
                            <input type="text" name="vehicleNumber" onChange={handleChange} required />
                        </div>
                     </div>
                     <div className="flex justify-end pt-4 space-x-2 border-t mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Gate Pass</button>
                    </div>
                </form>
            </Modal>
        )
    }

    if (mode === 'view' && existingGatePass) {
         return (
             <Modal isOpen={isOpen} onClose={onClose} title={`Gate Pass #${existingGatePass.gatePassId}`}>
                <div className="printable-content space-y-4 text-gray-800">
                    <h3 className="text-xl font-bold">Gate Pass: {existingGatePass.gatePassId}</h3>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Date Issued:</strong> {new Date(existingGatePass.issueDate).toLocaleString()}</p>
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold">Driver & Vehicle Information</h4>
                        <p><strong>Driver:</strong> {existingGatePass.driverName} ({existingGatePass.driverContact})</p>
                        <p><strong>License No:</strong> {existingGatePass.driverLicenseNumber}</p>
                        <p><strong>Vehicle No:</strong> {existingGatePass.vehicleNumber}</p>
                    </div>
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold">Items for Dispatch</h4>
                         <ul className="list-disc pl-5">
                            {order.items.map(item => <li key={item.productId}>{item.quantity}x {item.productName}</li>)}
                        </ul>
                    </div>
                </div>
                 <div className="flex justify-end pt-4 space-x-2 border-t mt-4 no-print">
                    <button onClick={handleEmail} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Email</button>
                    <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <PrinterIcon className="w-5 h-5 mr-2" /> Print
                    </button>
                </div>
             </Modal>
         )
    }
    
    return null;
}

const FulfillmentPage: React.FC = () => {
    const { salesOrders, gatePasses } = useData();
    const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
    const [isPackingSlipOpen, setPackingSlipOpen] = useState(false);
    const [isShippingLabelOpen, setShippingLabelOpen] = useState(false);
    const [isGatePassModalOpen, setGatePassModalOpen] = useState(false);
    const [gatePassMode, setGatePassMode] = useState<'create' | 'view'>('create');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    
    const ordersToFulfill = useMemo(() => {
        return salesOrders
            .filter(o => o.status === 'Pending')
            .filter(order => {
                const term = debouncedSearchTerm.toLowerCase();
                return order.id.toLowerCase().includes(term) ||
                       order.customer.name.toLowerCase().includes(term);
            });
    }, [salesOrders, debouncedSearchTerm]);


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
    
    const renderActions = (order: SalesOrder) => {
        const hasGatePass = gatePasses.some(gp => gp.orderId === order.id);
        
        return (
            <div className="flex flex-col sm:flex-row gap-2 items-start">
                <button onClick={() => { setSelectedOrder(order); setPackingSlipOpen(true); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md dark:bg-blue-900/50 dark:text-blue-300 w-full text-left">Packing Slip</button>
                <button onClick={() => { setSelectedOrder(order); setShippingLabelOpen(true); }} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md dark:bg-green-900/50 dark:text-green-300 w-full text-left">Shipping Label</button>
                <button 
                    onClick={() => {
                        setSelectedOrder(order);
                        setGatePassMode(hasGatePass ? 'view' : 'create');
                        setGatePassModalOpen(true);
                    }}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md dark:bg-indigo-900/50 dark:text-indigo-300 w-full text-left whitespace-nowrap"
                >
                    {hasGatePass ? 'View Gate Pass' : 'Create Gate Pass'}
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Order Fulfillment</h2>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg no-print">
                <input
                    type="text"
                    placeholder="Search by Order ID or Customer..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 shadow-sm rounded-md"
                />
            </div>
            
            <DataTable columns={columns} data={ordersToFulfill} renderActions={renderActions} />

            <PackingSlipModal isOpen={isPackingSlipOpen} onClose={() => setPackingSlipOpen(false)} order={selectedOrder} />
            <ShippingLabelModal isOpen={isShippingLabelOpen} onClose={() => setShippingLabelOpen(false)} order={selectedOrder} />
            <GatePassModal isOpen={isGatePassModalOpen} onClose={() => setGatePassModalOpen(false)} order={selectedOrder} mode={gatePassMode} />
        </div>
    );
};

export default FulfillmentPage;
