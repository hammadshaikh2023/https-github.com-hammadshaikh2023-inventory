



import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, InventoryIcon, SalesIcon, PurchasesIcon, WarehouseIcon, FulfillmentIcon, ReportsIcon, SettingsIcon, AuditIcon, CloseIcon, BellIcon } from './IconComponents';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const allNavItems = [
    { to: '/', icon: <DashboardIcon />, label: 'Dashboard', roles: ['Admin', 'User', 'Inventory Manager', 'Sales Representative', 'Warehouse Staff', 'Logistics'] },
    { to: '/inventory', icon: <InventoryIcon />, label: 'Inventory', roles: ['Admin', 'User', 'Inventory Manager', 'Warehouse Staff'] },
    { to: '/sales', icon: <SalesIcon />, label: 'Sales', roles: ['Admin', 'User', 'Sales Representative'] },
    { to: '/purchases', icon: <PurchasesIcon />, label: 'Purchases', roles: ['Admin', 'User', 'Inventory Manager'] },
    { to: '/warehouses', icon: <WarehouseIcon />, label: 'Warehouses', roles: ['Admin', 'User', 'Warehouse Staff'] },
    { to: '/fulfillment', icon: <FulfillmentIcon />, label: 'Fulfillment', roles: ['Admin', 'User', 'Logistics'] },
    { to: '/audit', icon: <AuditIcon />, label: 'Audit', roles: ['Admin'] },
    { to: '/reports', icon: <ReportsIcon />, label: 'Reports & Analytics', roles: ['Admin', 'Inventory Manager'] },
    { to: '/notifications', icon: <BellIcon />, label: 'Notifications', roles: ['Admin', 'User', 'Inventory Manager', 'Sales Representative', 'Warehouse Staff', 'Logistics'] },
    { to: '/settings', icon: <SettingsIcon />, label: 'Settings', roles: ['Admin', 'User', 'Inventory Manager', 'Sales Representative', 'Warehouse Staff', 'Logistics'] },
];

// FIX: The Sidebar component implementation was missing, causing an import error.
// It has been added below, along with a default export.
const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const { currentUser } = useAuth();

    const navItems = allNavItems.filter(item => 
        currentUser?.roles.some(role => item.roles.includes(role))
    );

    const navigationLinks = (isMobile: boolean) => (
        <nav className={`mt-5 px-2 space-y-1 ${isMobile ? '' : 'flex-1'}`}>
            {navItems.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                        `group flex items-center px-2 py-2 font-medium rounded-md ${
                            isMobile ? 'text-base' : 'text-sm'
                        } ${
                            isActive
                                ? 'bg-indigo-100 text-indigo-900 dark:bg-gray-900 dark:text-white'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                        }`
                    }
                >
                    {React.cloneElement(item.icon, { className: "mr-3 flex-shrink-0 h-6 w-6" })}
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
    
    const companyLink = (
        <div className="flex-shrink-0 flex p-4 border-t border-gray-200 dark:border-gray-700">
            <a href="https://www.bigwallsolutions.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-full group block">
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200">
                        Big Wall Solutions
                    </p>
                </div>
            </a>
        </div>
    );

    return (
        <>
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                {/* Overlay */}
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button onClick={() => setSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <CloseIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                             <div className="h-8 w-auto flex items-center text-xl font-bold" aria-label="BWS Inventory">
                                <span style={{ color: '#EF7722' }}>BWS</span>
                                <span style={{ color: '#37353E' }} className="dark:text-gray-200"> Inventory</span>
                            </div>
                        </div>
                        {navigationLinks(true)}
                    </div>
                    {companyLink}
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                             <div className="flex items-center flex-shrink-0 px-4">
                                <div className="h-10 w-auto flex items-center text-2xl font-bold" aria-label="BWS Inventory">
                                    <span style={{ color: '#EF7722' }}>BWS</span>
                                    <span style={{ color: '#37353E' }} className="dark:text-gray-200"> Inventory</span>
                                </div>
                            </div>
                            {navigationLinks(false)}
                        </div>
                        {companyLink}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;