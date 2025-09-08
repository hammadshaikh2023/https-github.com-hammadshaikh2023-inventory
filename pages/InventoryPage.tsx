
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
import { useDebounce } from '../hooks/useDebounce';
import { QrCodeIcon, PlusIcon, EditIcon, CloseIcon } from '../components/IconComponents';

const AddEditProductModal: React.FC<{
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
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price per Unit</label>
                             <input type="number" name="price" step="0.01" value={formData.price || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm rounded-md" />
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

const BulkStatusModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (status: Product['status']) => void;
    currentStatus: Product['status'];
    setCurrentStatus: (status: Product['status']) => void;
    selectedCount: number;
}> = ({ isOpen, onClose, onSubmit, currentStatus, setCurrentStatus, selectedCount }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Status for ${selectedCount} Products`}>
        <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">Select the new status for all selected products.</p>
            <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as Product['status'])}
                className="w-full"
            >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
            </select>
            <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button onClick={() => onSubmit(currentStatus)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Apply Status</button>
            </div>
        </div>
    </Modal>
);

const BulkStockModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    adjustment: number;
    setAdjustment: (value: number) => void;
    selectedCount: number;
}> = ({ isOpen, onClose, onSubmit, adjustment, setAdjustment, selectedCount }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust Stock for ${selectedCount} Products`}>
        <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">Enter a value to adjust the stock quantity. Use a negative number to decrease stock.</p>
            <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value, 10) || 0)}
                placeholder="e.g., 100 or -50"
                className="w-full"
            />
            <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button onClick={onSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Adjust Stock</button>
            </div>
        </div>
    </Modal>
);


const InventoryPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { products, bulkUpdateProductStatus, bulkAdjustProductStock } = useData();
    const [isScannerOpen, setScannerOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    
    // State for user inputs
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // State for Bulk Edit
    const [isBulkEditActive, setBulkEditActive] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [isBulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
    const [bulkStatus, setBulkStatus] = useState<Product['status']>('In Stock');
    const [isBulkStockModalOpen, setBulkStockModalOpen] = useState(false);
    const [stockAdjustment, setStockAdjustment] = useState(0);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => statusFilter === 'All' || p.status === statusFilter)
            .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
            .filter(p => 
                p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                p.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
    }, [products, debouncedSearchTerm, statusFilter, categoryFilter]);
    
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const handleAddProduct = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    }

    const handleToggleBulkEdit = () => {
        setBulkEditActive(prev => !prev);
        setSelectedProductIds([]);
    };
    
    const handleBulkStatusUpdate = () => {
        bulkUpdateProductStatus(selectedProductIds, bulkStatus);
        setBulkStatusModalOpen(false);
        handleToggleBulkEdit();
    };

    const handleBulkStockAdjust = () => {
        if (stockAdjustment === 0) return;
        bulkAdjustProductStock(selectedProductIds, stockAdjustment);
        setBulkStockModalOpen(false);
        setStockAdjustment(0);
        handleToggleBulkEdit();
    };


    const columns = [
        { header: 'Product Name', accessor: 'name' as keyof Product, sortable: true },
        { header: 'SKU', accessor: 'sku' as keyof Product, sortable: true },
        { header: 'Category', accessor: 'category' as keyof Product, sortable: true },
        { header: 'Stock', accessor: 'stock' as keyof Product, sortable: true, render: (item: Product) => `${item.stock.toLocaleString()} ${item.unitOfMeasure}` },
        { header: 'Price', accessor: 'price' as keyof Product, sortable: true, render: (item: Product) => `${item.currency} ${item.price.toFixed(2)}` },
        { header: 'Status', accessor: 'status' as keyof Product, sortable: true, render: (item: Product) => {
            const color = item.status === 'In Stock' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                        : item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{item.status}</span>;
        }},
        { header: 'Warehouse', accessor: 'warehouse' as keyof Product, sortable: true },
    ];
    
    const renderRowActions = (product: Product) => {
        if (!currentUser?.roles.includes('Admin')) return null;
        return (
            <div className="space-x-2 no-print">
                <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">Edit</button>
            </div>
        );
    };

    const exportableData = filteredProducts;
    const exportColumns = columns.map(c => ({ header: c.header, accessor: c.accessor }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Inventory</h2>
                <div className="flex items-center space-x-2">
                    <ExportDropdown data={exportableData} columns={exportColumns} fileName="Inventory" />
                    <button onClick={() => setScannerOpen(true)} className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 no-print">
                        <QrCodeIcon className="w-5 h-5 mr-2" />
                    </button>
                    {currentUser?.roles.includes('Admin') && (
                        <button onClick={handleAddProduct} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 no-print">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Product
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center gap-4 no-print">
                <input
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 shadow-sm rounded-md"
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full md:w-auto shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="All">All Statuses</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full md:w-auto shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {currentUser?.roles.includes('Admin') && (
                     <button
                        onClick={handleToggleBulkEdit}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ml-auto ${
                            isBulkEditActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900'
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900'
                        }`}
                    >
                        {isBulkEditActive ? <CloseIcon className="w-5 h-5 mr-2" /> : <EditIcon className="w-5 h-5 mr-2" />}
                        <span>{isBulkEditActive ? 'Cancel' : 'Bulk Edit'}</span>
                    </button>
                )}
            </div>
            
            <DataTable
                columns={columns}
                data={filteredProducts}
                renderActions={isBulkEditActive ? undefined : renderRowActions}
                isBulkEditActive={isBulkEditActive}
                selectedItems={selectedProductIds}
                onSelectionChange={setSelectedProductIds}
            />

            {isBulkEditActive && selectedProductIds.length > 0 && (
                <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white dark:bg-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-4 flex items-center justify-between z-40 animate-slideInUp border-t dark:border-gray-700">
                    <span className="font-medium text-gray-800 dark:text-white">{selectedProductIds.length} item(s) selected</span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setBulkStatusModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update Status</button>
                        <button onClick={() => setBulkStockModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700">Adjust Stock</button>
                    </div>
                </div>
            )}
            
            <Modal isOpen={isScannerOpen} onClose={() => setScannerOpen(false)} title="Scan Product Barcode">
                <BarcodeScanner />
            </Modal>
            
            <AddEditProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} product={editingProduct} />

            <BulkStatusModal
                isOpen={isBulkStatusModalOpen}
                onClose={() => setBulkStatusModalOpen(false)}
                onSubmit={handleBulkStatusUpdate}
                currentStatus={bulkStatus}
                setCurrentStatus={setBulkStatus}
                selectedCount={selectedProductIds.length}
            />
             <BulkStockModal
                isOpen={isBulkStockModalOpen}
                onClose={() => setBulkStockModalOpen(false)}
                onSubmit={handleBulkStockAdjust}
                adjustment={stockAdjustment}
                setAdjustment={setStockAdjustment}
                selectedCount={selectedProductIds.length}
            />
        </div>
    );
};

export default InventoryPage;
