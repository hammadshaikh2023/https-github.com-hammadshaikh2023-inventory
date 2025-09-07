import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Modal from '../components/Modal';
import { PlusIcon } from '../components/IconComponents';
import { User } from '../types';
import CurrencySelector from '../components/CurrencySelector';

const SettingsPage: React.FC = () => {
    const { currentUser } = useAuth();

    const allTabs = [
        { id: 'profile', label: 'Profile', component: <ProfileSettings /> },
        { id: 'general', label: 'General', component: <GeneralSettings /> },
        { id: 'users', label: 'Users & Roles', component: <UsersAndRolesSettings /> },
        { id: 'database', label: 'Database', component: <DatabaseSettings /> },
        { id: 'security', label: 'Security', component: <SecuritySettings /> },
    ];

    const availableTabs = currentUser?.roles.includes('Admin')
        ? allTabs
        : allTabs.filter(tab => tab.id === 'profile' || tab.id === 'general');
        
    const [activeTab, setActiveTab] = useState(availableTabs[0].id);

     // Effect to reset tab if user switches to a role that can't see the current tab
    useEffect(() => {
        if (!availableTabs.some(t => t.id === activeTab)) {
            setActiveTab(availableTabs[0].id);
        }
    }, [currentUser, activeTab, availableTabs]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h2>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto px-6">
                        {availableTabs.map(tab => (
                             <TabButton key={tab.id} id={tab.id} activeTab={activeTab} setActiveTab={setActiveTab}>
                                {tab.label}
                             </TabButton>
                        ))}
                    </nav>
                </div>
                <div className="p-6">
                    {availableTabs.find(tab => tab.id === activeTab)?.component}
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{id: string, activeTab: string, setActiveTab: (id: string) => void, children: React.ReactNode}> = ({id, activeTab, setActiveTab, children}) => {
    const isActive = activeTab === id;
    return (
        <button
            onClick={() => setActiveTab(id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                isActive
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
            {children}
        </button>
    )
}

const FormField: React.FC<{label: string, type: string, placeholder: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean }> = 
({label, type, placeholder, id, value, onChange, required}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input type={type} id={id} name={id} placeholder={placeholder} value={value} onChange={onChange} required={required} className="mt-1 block w-full shadow-sm rounded-md" />
    </div>
);

const ProfileSettings: React.FC = () => (
    <div className="space-y-6 max-w-xl">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Profile</h3>
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" id="name" placeholder="Admin User" className="mt-1 block w-full shadow-sm rounded-md" />
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input type="email" id="email" placeholder="admin@example.com" className="mt-1 block w-full shadow-sm rounded-md" />
        </div>
        <div className="pt-4 border-t dark:border-gray-700">
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
             <div className="space-y-4 mt-4">
                 <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                    <input type="password" id="current_password" placeholder="••••••••" className="mt-1 block w-full shadow-sm rounded-md" />
                </div>
                <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input type="password" id="new_password" placeholder="••••••••" className="mt-1 block w-full shadow-sm rounded-md" />
                </div>
                <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input type="password" id="confirm_password" placeholder="••••••••" className="mt-1 block w-full shadow-sm rounded-md" />
                </div>
             </div>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
    </div>
);

const GeneralSettings: React.FC = () => {
    const { defaultCurrency, setDefaultCurrency, lowStockThreshold, setLowStockThreshold } = useSettings();

    return (
        <div className="space-y-6 max-w-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">General Settings</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">This will be the default currency for all new transactions.</p>
                <CurrencySelector value={defaultCurrency} onChange={setDefaultCurrency} />
            </div>
            <div className="pt-4 border-t dark:border-gray-700">
                <label htmlFor="low-stock-threshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Low Stock Threshold</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Set the stock level at which products are considered "Low Stock".</p>
                <input
                    type="number"
                    id="low-stock-threshold"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="mt-1 block w-full max-w-xs shadow-sm rounded-md"
                />
            </div>
        </div>
    );
};

const availableRoles = ['Admin', 'User', 'Inventory Manager', 'Sales Representative', 'Warehouse Staff', 'Logistics'];

const AddEditUserModal: React.FC<{ isOpen: boolean; onClose: () => void; user: User | null }> = ({ isOpen, onClose, user }) => {
    const { addUser, updateUser } = useData();
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                name: '',
                email: '',
                username: '',
                password: '',
                designation: '',
                roles: ['User'],
                status: 'Active'
            });
        }
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (role: string) => {
        setFormData(prev => {
            const roles = prev.roles ? [...prev.roles] : [];
            if (roles.includes(role)) {
                return { ...prev, roles: roles.filter(r => r !== role) };
            } else {
                return { ...prev, roles: [...roles, role] };
            }
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (user) { // Edit mode
            const finalUserData = { ...formData };
            if (!formData.password) { // Don't update password if field is blank
                delete finalUserData.password;
            }
            updateUser(finalUserData as User);
        } else { // Add mode
            addUser(formData as Omit<User, 'id'>);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? "Edit User" : "Add New User"}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <FormField id="name" label="Full Name" type="text" placeholder="John Doe" value={formData.name || ''} onChange={handleChange} required />
                <FormField id="email" label="Email" type="email" placeholder="john.doe@bws.com" value={formData.email || ''} onChange={handleChange} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField id="username" label="Username" type="text" placeholder="johndoe" value={formData.username || ''} onChange={handleChange} required/>
                    <FormField id="password" label="Password" type="password" placeholder={user ? "Leave blank to keep unchanged" : "••••••••"} value={formData.password || ''} onChange={handleChange} required={!user} />
                </div>
                <FormField id="designation" label="Designation" type="text" placeholder="Quarry Manager" value={formData.designation || ''} onChange={handleChange} required/>
                
                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Roles</label>
                     <div className="mt-2 grid grid-cols-2 gap-2">
                        {availableRoles.map(role => (
                            <label key={role} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.roles?.includes(role) || false}
                                    onChange={() => handleRoleChange(role)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm">{role}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 pt-2">Account Status</label>
                     <div className="mt-2 flex items-center space-x-4">
                         <label className="flex items-center space-x-2">
                             <input
                                type="radio"
                                name="status"
                                value="Active"
                                checked={formData.status === 'Active'}
                                onChange={handleChange}
                                className="text-indigo-600 focus:ring-indigo-500"
                             />
                             <span className="text-sm">Active</span>
                         </label>
                         <label className="flex items-center space-x-2">
                             <input
                                type="radio"
                                name="status"
                                value="Blocked"
                                checked={formData.status === 'Blocked'}
                                onChange={handleChange}
                                className="text-indigo-600 focus:ring-indigo-500"
                             />
                             <span className="text-sm">Blocked</span>
                         </label>
                     </div>
                </div>

                <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{user ? "Save Changes" : "Add User"}</button>
                </div>
            </form>
        </Modal>
    );
};

const UsersAndRolesSettings: React.FC = () => {
    const { currentUser } = useAuth();
    const { users } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleAdd = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Users & Roles</h3>
            <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add User
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700"><tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                         <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.designation}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.roles.join(', ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                <button 
                                    onClick={() => handleEdit(user)}
                                    disabled={user.id === currentUser?.id}
                                    className="text-indigo-600 hover:text-indigo-900 font-medium dark:text-indigo-400 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AddEditUserModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} user={editingUser} />
    </div>
    );
};

const SecuritySettings: React.FC = () => (
    <div className="space-y-6 max-w-xl">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security</h3>
        <div className="p-4 border rounded-lg dark:border-gray-700 flex justify-between items-center">
            <div>
                <p className="font-medium">Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Enable</button>
        </div>
    </div>
);

const DatabaseSettings: React.FC = () => {
    const [dbType, setDbType] = useState('local');

    return (
        <div className="space-y-4 max-w-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Database Connection</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Connection Type</label>
                <select 
                    value={dbType}
                    onChange={(e) => setDbType(e.target.value)}
                    className="mt-1 block w-full shadow-sm rounded-md"
                >
                    <option value="local">Local Server</option>
                    <option value="cloud">Cloud Server</option>
                </select>
            </div>
            {dbType === 'local' && (
                 <div>
                    <label htmlFor="local_path" className="block text-sm font-medium text-gray-700 dark:text-gray-300">SQLite File Path</label>
                    <input type="text" id="local_path" placeholder="/path/to/database.sqlite" className="mt-1 block w-full shadow-sm rounded-md" />
                </div>
            )}
            {dbType === 'cloud' && (
                <div>
                    <label htmlFor="cloud_string" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Connection String</label>
                    <input type="text" id="cloud_string" placeholder="postgres://user:pass@host:port/dbname" className="mt-1 block w-full shadow-sm rounded-md" />
                </div>
            )}
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Connection</button>
        </div>
    )
}

export default SettingsPage;