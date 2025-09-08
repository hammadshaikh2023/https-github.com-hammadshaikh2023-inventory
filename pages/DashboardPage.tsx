import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { mockRecentActivity, mockSalesDataForChart } from '../data/mockData';
import { InventoryIcon, SalesIcon, PurchasesIcon, PlusIcon, QrCodeIcon, ClockIcon } from '../components/IconComponents';

// Import Modals from other pages
import { AddEditProductModal } from './InventoryPage';
import { CreateSalesOrderModal } from './SalesPage';
import { CreatePurchaseOrderModal } from './PurchasesPage';
import Modal from '../components/Modal';
import BarcodeScanner from '../components/BarcodeScanner';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-transform hover:scale-105 duration-300">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {change && (
                <p className={`text-xs font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                    {change}
                </p>
            )}
        </div>
    </div>
);

const QuickActionButton: React.FC<{ label: string, icon: React.ReactNode, onClick: () => void }> = ({ label, icon, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1"
    >
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
            {icon}
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
    </button>
);

const UpcomingReminders: React.FC = () => {
    const { reminders, updateReminderStatus } = useData();
    const pendingReminders = reminders
        .filter(r => r.status === 'Pending' && new Date(r.reminderDateTime) > new Date())
        .sort((a, b) => new Date(a.reminderDateTime).getTime() - new Date(b.reminderDateTime).getTime())
        .slice(0, 5); // Show top 5 upcoming

    if (pendingReminders.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-indigo-500"/>
                    Upcoming Reminders
                </h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No pending reminders.</p>
            </div>
        )
    }

    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-indigo-500"/>
                Upcoming Reminders
            </h3>
            <ul className="space-y-4">
                {pendingReminders.map(reminder => (
                    <li key={reminder.id} className="flex items-start justify-between">
                        <div>
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{reminder.task}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                For Order: {reminder.orderId}
                            </p>
                            <p className="text-xs text-indigo-500 dark:text-indigo-400">
                                Due: {new Date(reminder.reminderDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                        </div>
                        <button
                            onClick={() => updateReminderStatus(reminder.id, 'Completed')}
                            className="text-xs px-2 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
                            title="Mark as Complete"
                        >
                           ✔️
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}


const DashboardPage: React.FC = () => {
    const { products, salesOrders, purchaseOrders } = useData();
    
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
    const [isSalesModalOpen, setSalesModalOpen] = useState(false);
    const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [isScannerOpen, setScannerOpen] = useState(false);

    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockItems = products.filter(p => p.status === 'Low Stock');
    const outOfStockItems = products.filter(p => p.status === 'Out of Stock');
    const totalRevenueByCurrency = salesOrders
        .filter(o => o.status === 'Fulfilled')
        .reduce((acc, o) => {
            acc[o.currency] = (acc[o.currency] || 0) + o.total;
            return acc;
        }, {} as Record<string, number>);

    const revenueString = Object.entries(totalRevenueByCurrency)
        .map(([currency, total]) => `${currency} ${(total / 1000).toFixed(1)}k`)
        .join(' | ');

    const topSellingProducts = useMemo(() => {
        const productSales = new Map<string, number>();
        salesOrders.forEach(order => {
            if (order.status === 'Fulfilled') {
                order.items.forEach(item => {
                    productSales.set(item.productId, (productSales.get(item.productId) || 0) + item.quantity);
                });
            }
        });

        return Array.from(productSales.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([productId, quantitySold]) => ({
                product: products.find(p => p.id === productId),
                quantitySold,
            }));
    }, [salesOrders, products]);


    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="p-4 bg-gray-900/80 text-white rounded-lg shadow-lg">
              <p className="label font-bold">{`${label}`}</p>
              <p className="intro text-indigo-300">{`Sales: $${payload[0].value.toLocaleString()}`}</p>
              <p className="intro text-green-300">{`Profit: $${payload[1].value.toLocaleString()}`}</p>
            </div>
          );
        }
        return null;
      };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>

            {/* Quick Actions */}
            <div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickActionButton label="New Sales Order" icon={<PlusIcon className="w-6 h-6 text-indigo-500" />} onClick={() => setSalesModalOpen(true)} />
                    <QuickActionButton label="New Purchase Order" icon={<PlusIcon className="w-6 h-6 text-indigo-500" />} onClick={() => setPurchaseModalOpen(true)} />
                    <QuickActionButton label="Add New Product" icon={<PlusIcon className="w-6 h-6 text-indigo-500" />} onClick={() => setAddProductModalOpen(true)} />
                    <QuickActionButton label="Scan Item" icon={<QrCodeIcon className="w-6 h-6 text-indigo-500" />} onClick={() => setScannerOpen(true)} />
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={revenueString || '$0.0k'} icon={<SalesIcon className="w-6 h-6 text-indigo-500" />} change="+12.5% this month" changeType="increase"/>
                <StatCard title="Total Stock Units" value={totalStock.toLocaleString()} icon={<InventoryIcon className="w-6 h-6 text-indigo-500" />} change="-1.2% this month" changeType="decrease" />
                <StatCard title="Pending Sales" value={String(salesOrders.filter(o => o.status === 'Pending').length)} icon={<SalesIcon className="w-6 h-6 text-indigo-500" />} />
                <StatCard title="Pending Purchases" value={String(purchaseOrders.filter(o => o.status === 'Pending').length)} icon={<PurchasesIcon className="w-6 h-6 text-indigo-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Sales & Profit Overview</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={mockSalesDataForChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.8}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${Number(value)/1000}k`} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(79, 70, 229, 0.1)'}} />
                            <Legend wrapperStyle={{paddingTop: '20px'}}/>
                            <Bar dataKey="sales" fill="url(#colorSales)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="profit" fill="#34d399" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Side Panels */}
                <div className="space-y-8">
                    {/* Upcoming Reminders */}
                    <UpcomingReminders />
                    
                    {/* Inventory Alerts */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Inventory Alerts</h3>
                        <ul className="space-y-3">
                            {lowStockItems.map(item => (
                                <li key={item.id} className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                        <p className="text-gray-500">{item.stock} units left</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Low Stock</span>
                                </li>
                            ))}
                            {outOfStockItems.map(item => (
                                <li key={item.id} className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                        <p className="text-gray-500">Out of stock</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Out of Stock</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                     {/* Top Selling Products */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Top Selling Products</h3>
                        <ul className="space-y-3">
                            {topSellingProducts.map(({ product, quantitySold }, index) => (
                                <li key={product?.id || index} className="flex items-center justify-between text-sm">
                                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{product?.name || 'Unknown Product'}</p>
                                    <p className="text-gray-500 font-semibold">{quantitySold.toLocaleString()} sold</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Recent Activity</h3>
                        <ul className="space-y-4">
                            {mockRecentActivity.map(activity => (
                                <li key={activity.id} className="flex items-start space-x-3">
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{activity.user.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{activity.action}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
             {/* Modals */}
            <AddEditProductModal isOpen={isAddProductModalOpen} onClose={() => setAddProductModalOpen(false)} product={null} />
            <CreateSalesOrderModal isOpen={isSalesModalOpen} onClose={() => setSalesModalOpen(false)} />
            <CreatePurchaseOrderModal isOpen={isPurchaseModalOpen} onClose={() => setPurchaseModalOpen(false)} />
            <Modal isOpen={isScannerOpen} onClose={() => setScannerOpen(false)} title="Scan Barcode">
                <BarcodeScanner />
            </Modal>
        </div>
    );
};

export default DashboardPage;