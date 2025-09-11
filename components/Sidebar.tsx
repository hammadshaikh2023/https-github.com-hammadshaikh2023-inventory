

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
const logoSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAACvCAMAAADob2qvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkE0NEQyNTdEMUM1MTFFNEI0M0JFNjNCODBEREE5MTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkE0NEQyNThEMUM1MTFFNEI0M0JFNjNCODBEREE5MTQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2QTQ0RDI1NUQxQzUxMUU0QjQzQkU2M0I4MERERDkxNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2QTQ0RDI1NkQxQzUxMUU0QjQzQkU2M0I4MERERDkxNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps63Z5cAAAC5SURBVHja7N1ncsIwEAVQNrfS3b/S3X+p0+L0YpI2V98QcTzm9/zNS2lMmqZpmu5fPj/+/v39+/fL9++fPj19+7Isy/7+1y+3P/758+fz52/n9++/f/789e/X+/s/LMvy52/n9a+fdz+u9+vP2y/7//39+8/Pz98/f/r8e31/LcvS76/P/+2X/3+9fv7+f/r5/+f6/f/1359//+fz8/f/f/n8+P33v37+/H79/PuH+/fP28/vP6/f/17/P7/vP7/evn5+/v37/ev3/5+3n9f7969fP7//fv/99+/v3z8/v/7+//r8+/v796+f37/+/f/9+v2P9+9fv3/+8/Pz9/f/1++f6+/f//f/5++/f/7++9/v718/f37/fvn++9ev/3/+8/f/9fP39/f/9ev7/8/P38+v/+9//9//v/73/fv/68//+fv+58+/+vP7/+v/7z9//v7z/fv/9fP/v39/33/9+//r/f/r++/P//fv37+/f3+///7z/+/v689/vf/+/fn/7c+f//7++/3z++//P/95+3n/6/f/33/7+f/f/9+/v/+///z++vP/v/+8/v/+v77+f/f/9f33/5/fn/+///763/3nx88AQIAAQIE+AUECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAA/G8BBgB65E68vUu5AgAAAABJRU5ErkJggg==";

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