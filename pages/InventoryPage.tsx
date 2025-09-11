import React, { useState, useMemo, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import BarcodeScanner from '../components/BarcodeScanner';
import ExportDropdown from '../components/ExportDropdown';
import CurrencySelector from '../components/CurrencySelector';
import { useData } from '../context/DataContext';
import { Product, Currency } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { QrCodeIcon, PlusIcon } from '../components/IconComponents';

export const AddEditProductModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    product: Product | null,
}> = ({ isOpen, onClose, product }) => {
    
    const { addProduct, updateProduct } = useData();
    const { defaultCurrency } = useSettings();
    const [formData, setFormData] = useState<Partial<Product>>({});

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                dateAdded: new Date().toISOString().split('T')[0],
                qualityTestStatus: 'Pending',
                status: 'In Stock',
                currency: defaultCurrency,
            });
        }
    }, [product, isOpen, defaultCurrency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCurrencyChange = (currency: Currency) => {
        setFormData(prev => ({ ...prev, currency }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            updateProduct(formData as Product);
        } else {
            addProduct(formData as Omit<Product, 'id'>);
        }
        onClose();
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit Product" : "Add New Product"}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                        <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select name="category" value={formData.category || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md">
                            <option value="">Select Category</option>
                            <option value="Aggregates">Aggregates</option>
                            <option value="Binders">Binders</option>
                            <option value="Additives">Additives</option>
                            <option value="Lab Supplies">Lab Supplies</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse</label>
                        <select name="warehouse" value={formData.warehouse || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md">
                             <option value="">Select Warehouse</option>
                             <option value="Quarry Site A">Quarry Site A</option>
                             <option value="Main Plant">Main Plant</option>
                             <option value="Quarry Site B">Quarry Site B</option>
                             <option value="Testing Lab">Testing Lab</option>
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
                            <input type="number" name="stock" value={formData.stock || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit of Measure</label>
                             <select name="unitOfMeasure" value={formData.unitOfMeasure || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md">
                                <option value="">Select Unit</option>
                                <option value="Ton">Ton</option>
                                <option value="Cubic Meter">Cubic Meter</option>
                                <option value="Bag">Bag</option>
                                <option value="Drum">Drum</option>
                            </select>
                        </div>
                    </div>
                     <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price per Unit</label>
                             <input type="number" name="price" step="0.01" value={formData.price || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Cost</label>
                            <input type="number" name="unitCost" step="0.01" value={formData.unitCost || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                            <CurrencySelector value={formData.currency || 'USD'} onChange={handleCurrencyChange} />
                         </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
                        <input type="text" name="supplier" value={formData.supplier || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Number</label>
                        <input type="text" name="batchNumber" value={formData.batchNumber || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quality Test Status</label>
                         <select name="qualityTestStatus" value={formData.qualityTestStatus || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md">
                            <option value="Pending">Pending</option>
                            <option value="Passed">Passed</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Added</label>
                        <input type="date" name="dateAdded" value={formData.dateAdded || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md" />
                    </div>
                </div>

                <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Product</button>
                </div>
            </form>
        </Modal>
    );
};


// Custom hook for debouncing a value.
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the specified delay.
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the value or delay changes before the timer fires.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-call effect if value or delay changes

    return debouncedValue;
}


const InventoryPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { products, deleteProducts, updateProductStatus } = useData();
    const [isScannerOpen, setScannerOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    
    // State for bulk action modals
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isStatusUpdateOpen, setStatusUpdateOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<Product['status']>('In Stock');

    // State for user inputs
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Debounce the search term to avoid excessive re-renders on each keystroke
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filteredProducts = useMemo(() => {
        return products
            .map(p => ({
                ...p,
                profitMargin: p.price > 0 ? ((p.price - p.unitCost) / p.price) * 100 : 0
            }))
            .filter(p => statusFilter === 'All' || p.status === statusFilter)
            .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
            .filter(p => 
                p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                p.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
    }, [products, debouncedSearchTerm, statusFilter, categoryFilter]);
    
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const totalStockForCategory = useMemo(() => {
        const productsToSum = (categoryFilter === 'All')
            ? products
            : products.filter(p => p.category === categoryFilter);
        return productsToSum.reduce((sum, p) => sum + p.stock, 0);
    }, [products, categoryFilter]);


    const handleAddProduct = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };
    
    // Selection Handlers
    const handleToggleAll = () => {
        if (selectedProductIds.length === filteredProducts.length) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(filteredProducts.map(p => p.id));
        }
    };

    const handleToggleRow = (productId: string) => {
        setSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };
    
    // Bulk Action Handlers
    const handleConfirmDelete = () => {
        deleteProducts(selectedProductIds);
        setSelectedProductIds([]);
        setDeleteConfirmOpen(false);
    };

    const handleConfirmStatusUpdate = () => {
        updateProductStatus(selectedProductIds, newStatus);
        setSelectedProductIds([]);
        setStatusUpdateOpen(false);
    };

    const columns = [
        { header: 'SKU', accessor: 'sku' as keyof Product, sortable: true },
        { header: 'Product Name', accessor: 'name' as keyof Product, sortable: true },
        { header: 'Category', accessor: 'category' as keyof Product, sortable: true },
        { header: 'Stock Quantity', accessor: 'stock' as keyof Product, sortable: true, render: (item: Product) => item.stock.toLocaleString() },
        { header: 'Unit of Measure', accessor: 'unitOfMeasure' as keyof Product, sortable: true },
        { header: 'Price', accessor: 'price' as keyof Product, sortable: true, render: (item: Product) => `${item.currency} ${item.price.toFixed(2)}` },
        { 
            header: 'Profit Margin', 
            accessor: 'profitMargin' as keyof Product, 
            sortable: true, 
            render: (item: Product) => {
                if (item.price === 0) {
                    return <span className="text-gray-500">N/A</span>;
                }
                const margin = item.profitMargin!;
                const color = margin >= 30 ? 'text-green-500' 
                            : margin >= 15 ? 'text-yellow-500' 
                            : 'text-red-500';
                return <span className={`font-medium ${color}`}>{margin.toFixed(1)}%</span>;
            }
        },
        { header: 'Warehouse', accessor: 'warehouse' as keyof Product, sortable: true },
        { header: 'Batch No.', accessor: 'batchNumber' as keyof Product, sortable: true },
        { header: 'Status', accessor: 'status' as keyof Product, sortable: true, render: (item: Product) => {
            const color = item.status === 'In Stock' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                        : item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{item.status}</span>;
        }},
         { header: 'Quality', accessor: 'qualityTestStatus' as keyof Product, sortable: true, render: (item: Product) => {
            const color = item.qualityTestStatus === 'Passed' ? 'text-green-500' 
                        : item.qualityTestStatus === 'Pending' ? 'text-yellow-500' 
                        : 'text-red-500';
            return <span className={`font-medium ${color}`}>{item.qualityTestStatus}</span>;
        }},
    ];

    const exportColumns = columns.map(c => ({ header: c.header, accessor: c.accessor }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Inventory</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setScannerOpen(true)} className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors no-print">
                        <QrCodeIcon className="w-5 h-5 mr-2" />
                        Scan
                    </button>
                     <ExportDropdown
                        data={filteredProducts}
                        columns={exportColumns}
                        fileName="Inventory_Report"
                    />
                    {currentUser?.roles.includes('Admin') && (
                        <button onClick={handleAddProduct} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors no-print">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Product
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 pt-2 no-print">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                                    categoryFilter === cat
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4 md:space-y-0 md:flex md:items-center md:justify-between no-print">
                <input 
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 shadow-sm rounded-md"
                />
                <div className="flex items-center space-x-4">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="shadow-sm rounded-md">
                        <option value="All">All Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                    <div className="text-right pl-4 border-l dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total stock in '{categoryFilter}'
                        </p>
                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {totalStockForCategory.toLocaleString()} units
                        </p>
                    </div>
                </div>
            </div>

            {selectedProductIds.length > 0 && (
                <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 animate-fadeIn no-print">
                    <span className="font-semibold text-indigo-800 dark:text-indigo-200">{selectedProductIds.length} item(s) selected</span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setStatusUpdateOpen(true)} className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900">Update Status</button>
                        <button onClick={() => setDeleteConfirmOpen(true)} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">Delete Selected</button>
                    </div>
                </div>
            )}

            <DataTable
                columns={columns}
                data={filteredProducts}
                selection={currentUser?.roles.includes('Admin') ? {
                    selectedIds: selectedProductIds,
                    onToggleAll: handleToggleAll,
                    onToggleRow: handleToggleRow,
                    allSelected: selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0,
                } : undefined}
                onViewDetails={currentUser?.roles.includes('Admin') ? handleEditProduct : undefined}
            />

            <Modal isOpen={isScannerOpen} onClose={() => setScannerOpen(false)} title="Scan Barcode">
                <BarcodeScanner />
            </Modal>

            <AddEditProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} product={editingProduct} />

            {/* Bulk Delete Confirmation Modal */}
            <Modal isOpen={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Bulk Deletion">
                <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete the selected {selectedProductIds.length} products? This action cannot be undone.
                    </p>
                    <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700">
                        <button type="button" onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="button" onClick={handleConfirmDelete} className="px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700">
                            Delete Products
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Bulk Status Update Modal */}
            <Modal isOpen={isStatusUpdateOpen} onClose={() => setStatusUpdateOpen(false)} title="Bulk Update Status">
                <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300">
                        Select a new status for the {selectedProductIds.length} selected products.
                    </p>
                    <div>
                        <label htmlFor="bulk-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Status</label>
                        <select
                            id="bulk-status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as Product['status'])}
                            className="mt-1 block w-full shadow-sm rounded-md"
                        >
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700">
                        <button type="button" onClick={() => setStatusUpdateOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="button" onClick={handleConfirmStatusUpdate} className="px-4 py-2 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700">
                            Update Status
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default InventoryPage;