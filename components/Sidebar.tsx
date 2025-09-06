import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, InventoryIcon, SalesIcon, PurchasesIcon, WarehouseIcon, FulfillmentIcon, ReportsIcon, SettingsIcon, AuditIcon, CloseIcon } from './IconComponents';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const allNavItems = [
    { to: '/', icon: <DashboardIcon />, label: 'Dashboard' },
    { to: '/inventory', icon: <InventoryIcon />, label: 'Inventory' },
    { to: '/sales', icon: <SalesIcon />, label: 'Sales' },
    { to: '/purchases', icon: <PurchasesIcon />, label: 'Purchases' },
    { to: '/warehouses', icon: <WarehouseIcon />, label: 'Warehouses' },
    { to: '/fulfillment', icon: <FulfillmentIcon />, label: 'Fulfillment' },
    { to: '/audit', icon: <AuditIcon />, label: 'Audit' },
    { to: '/reports', icon: <ReportsIcon />, label: 'Reports & Analytics' },
    { to: '/settings', icon: <SettingsIcon />, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const { currentUser } = useAuth();
    
    const navLinkClasses = "flex items-center px-4 py-2.5 text-gray-500 hover:bg-indigo-100 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors duration-200";
    const activeNavLinkClasses = "bg-indigo-500 text-white dark:bg-indigo-600 dark:text-white shadow-md";

    const navItems = currentUser?.roles.includes('Admin')
        ? allNavItems
        : allNavItems.filter(item => !['/reports', '/audit'].includes(item.to));

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}>
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">BWS</h1>
                     <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-600 dark:text-gray-400">
                        <CloseIcon />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(item => (
                        <NavLink 
                            key={item.to} 
                            to={item.to} 
                            end={item.to === '/'}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
                        >
                            {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-3' })}
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;