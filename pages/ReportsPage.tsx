


import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { mockSalesDataForChart } from '../data/mockData';
import { FileTextIcon, PrinterIcon } from '../components/IconComponents';

const COLORS = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-gray-900/80 text-white rounded-lg shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          {payload.map((p: any, index: number) => {
            const style = { color: p.name === 'sales' ? '#d5cebb' : p.color };
            return (
               <p key={index} style={style}>{`${p.name}: ${p.value.toLocaleString()}`}</p>
            );
          })}
        </div>
      );
    }
    return null;
};


const ReportsPage: React.FC = () => {
    const { products } = useData();

    const inventoryByCategory = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + product.stock;
        return acc;
    }, {} as Record<string, number>);
    
    const pieData = Object.keys(inventoryByCategory).map(key => ({
        name: key,
        value: inventoryByCategory[key]
    }));

    const mockStockVsSold = products.map(p => ({
        name: p.name,
        stock: p.stock,
        sold: Math.floor(Math.random() * (p.stock + 50)) + 10 // Mock sold data
    }));


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h2>
                <div className="flex items-center space-x-2">
                    <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <FileTextIcon className="w-5 h-5 mr-2" />
                        Export as CSV
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <PrinterIcon className="w-5 h-5 mr-2" />
                        Print Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Trend */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Sales Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockSalesDataForChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorSalesTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSalesTrend)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Stock vs Sold */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Stock vs. Sold Units</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockStockVsSold.slice(0, 5)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false}/>
                             <XAxis dataKey="name" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false}/>
                             <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false}/>
                             <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(79, 70, 229, 0.1)'}} />
                             <Legend />
                             <Bar dataKey="stock" fill="#818cf8" radius={[4, 4, 0, 0]} />
                             <Bar dataKey="sold" fill="#34d399" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Inventory by Category */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Inventory by Category</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={pieData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={80} 
                                outerRadius={120} 
                                fill="#8884d8" 
                                paddingAngle={3}
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                             <Tooltip content={<CustomTooltip />}/>
                             <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
