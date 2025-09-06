
import React, { useState, useMemo, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import BarcodeScanner from '../components/BarcodeScanner';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { QrCodeIcon, PlusIcon } from '../components/IconComponents';

const AddEditProductModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    product: Product | null,
}> = ({ isOpen, onClose, product }) => {
    
    const { addProduct, updateProduct } = useData();
    const [formData, setFormData] = useState<Partial<Product>>({});

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                dateAdded: new Date().toISOString().split('T')[0],
                qualityTestStatus: 'Pending',
                status: 'In Stock'
            });
        }
    }, [product, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                        <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select name="category" value={formData.category || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="">Select Category</option>
                            <option value="Aggregates">Aggregates</option>
                            <option value="Binders">Binders</option>
                            <option value="Additives">Additives</option>
                            <option value="Lab Supplies">Lab Supplies</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse</label>
                        <select name="warehouse" value={formData.warehouse || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
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
                            <input type="number" name="stock" value={formData.stock || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit of Measure</label>
                             <select name="unitOfMeasure" value={formData.unitOfMeasure || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                                <option value="">Select Unit</option>
                                <option value="Ton">Ton</option>
                                <option value="Cubic Meter">Cubic Meter</option>
                                <option value="Bag">Bag</option>
                                <option value="Drum">Drum</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price per Unit</label>
                        <input type="number" name="price" step="0.01" value={formData.price || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
                        <input type="text" name="supplier" value={formData.supplier || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Number</label>
                        <input type="text" name="batchNumber" value={formData.batchNumber || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quality Test Status</label>
                         <select name="qualityTestStatus" value={formData.qualityTestStatus || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="Pending">Pending</option>
                            <option value="Passed">Passed</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Added</label>
                        <input type="date" name="dateAdded" value={formData.dateAdded || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
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


const InventoryPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { products } = useData();
    const [isScannerOpen, setScannerOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

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
    
    const columns = [
        { header: 'SKU', accessor: 'sku' as keyof Product, sortable: true },
        { header: 'Product Name', accessor: 'name' as keyof Product, sortable: true },
        { header: 'Category', accessor: 'category' as keyof Product, sortable: true },
        { header: 'Stock', accessor: 'stock' as keyof Product, sortable: true, render: (item: Product) => `${item.stock.toLocaleString()} ${item.unitOfMeasure}` },
        { header: 'Price', accessor: 'price' as keyof Product, sortable: true, render: (item: Product) => `$${item.price.toFixed(2)}` },
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Inventory</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setScannerOpen(true)} className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <QrCodeIcon className="w-5 h-5 mr-2" />
                        Scan
                    </button>
                    {currentUser?.roles.includes('Admin') && (
                        <button onClick={handleAddProduct} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Product
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                <input 
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex items-center space-x-4">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value="All">All Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="shadow-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            <DataTable columns={columns} data={filteredProducts} renderActions={currentUser?.roles.includes('Admin') ? (product) => (
                 <div className="space-x-2">
                    <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium">Delete</button>
                </div>
            ) : undefined} />

            <Modal isOpen={isScannerOpen} onClose={() => setScannerOpen(false)} title="Scan Barcode">
                <BarcodeScanner />
            </Modal>

            <AddEditProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} product={editingProduct} />
        </div>
    );
};

export default InventoryPage;