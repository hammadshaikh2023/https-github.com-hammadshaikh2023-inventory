
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

// Embedded Base64 logo for offline reliability.
const logoSrc = "data:image/png;base64,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---";

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
                            <img className="h-8 w-auto" src={logoSrc} alt="BWS Inventory" />
                        </div>
                        {navigationLinks(true)}
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                             <div className="flex items-center flex-shrink-0 px-4">
                                <img className="h-10 w-auto" src={logoSrc} alt="BWS Inventory" />
                            </div>
                            {navigationLinks(false)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
