import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { mockRecentActivity, mockSalesDataForChart } from '../data/mockData';
import { InventoryIcon, SalesIcon, PurchasesIcon } from '../components/IconComponents';

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


const DashboardPage: React.FC = () => {
    const { products, salesOrders, purchaseOrders } = useData();
    
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
        </div>
    );
};

export default DashboardPage;