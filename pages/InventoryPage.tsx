import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import BarcodeScanner from '../components/BarcodeScanner';
import ExportDropdown from '../components/ExportDropdown';
import CurrencySelector from '../components/CurrencySelector';
import { useData } from '../context/DataContext';
import { Product, Currency } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { QrCodeIcon, PlusIcon, CloseIcon, SearchIcon, MinusIcon, ArrowUpIcon, ArrowDownIcon, PrinterIcon } from '../components/IconComponents';

export const AddEditProductModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    product: Product | null,
}> = ({ isOpen, onClose, product }) => {
    
    const { addProduct, updateProduct } = useData();
    const { defaultCurrency } = useSettings();
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                dateAdded: new Date().toISOString().split('T')[0],
                qualityTestStatus: 'Pending',
                status: 'In Stock',
                currency: defaultCurrency,
                batchNumber: '', // Start with empty batch number
            });
        }
        setShowHistory(false); // Reset history view on modal open/product change
    }, [product, isOpen, defaultCurrency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'stock' || name === 'price' || name === 'unitCost') {
            const numericValue = parseFloat(value);
            // Ensure value is a non-negative number.
            // If the input value is empty, invalid, or negative, it will be treated as 0.
            setFormData(prev => ({ ...prev, [name]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleCurrencyChange = (currency: Currency) => {
        setFormData(prev => ({ ...prev, currency }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, imageUrl: undefined }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            updateProduct(formData as Product);
        } else {
            addProduct(formData as Omit<Product, 'id'>);
        }
        onClose();
    }
    
    const handleStockChange = (delta: number) => {
        setFormData(prev => {
            const currentStock = Number(prev.stock) || 0;
            const newStock = Math.max(0, currentStock + delta); // Prevent negative stock
            return { ...prev, stock: newStock };
        });
    };

    const handleAutoGenerateBatchNumber = () => {
        const today = new Date();
        const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '');
        const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
        const newBatchNumber = `BN-${yyyymmdd}-${randomChars}`;
        setFormData(prev => ({ ...prev, batchNumber: newBatchNumber }));
    };

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
                            <div className="flex items-center mt-1">
                                <button
                                    type="button"
                                    onClick={() => handleStockChange(-1)}
                                    className="px-3 py-3 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:z-10"
                                    aria-label="Decrease stock quantity by one"
                                >
                                    <MinusIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock || ''}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full text-center font-medium border-t border-b border-gray-300 dark:border-gray-600 py-3 px-0 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 rounded-none dark:bg-gray-800"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleStockChange(1)}
                                    className="px-3 py-3 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:z-10"
                                    aria-label="Increase stock quantity by one"
                                >
                                    <PlusIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
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
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Number</label>
                            <button
                                type="button"
                                onClick={handleAutoGenerateBatchNumber}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                            >
                                Auto Generate
                            </button>
                        </div>
                        <input
                            id="batchNumber"
                            type="text"
                            name="batchNumber"
                            value={formData.batchNumber || ''}
                            onChange={handleChange}
                            className="block w-full shadow-sm rounded-md"
                        />
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiration Date (Optional)</label>
                        <input type="date" name="expires" value={formData.expires || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm rounded-md" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Image</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {formData.imageUrl && (
                                <img src={formData.imageUrl} alt="Product Preview" className="h-20 w-20 object-cover rounded-md" />
                            )}
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="file"
                                    id="image-upload"
                                    name="imageUrl"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Upload Image
                                </label>
                                {formData.imageUrl && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {product?.history && product.history.length > 0 && (
                    <div className="md:col-span-2 pt-4 border-t dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setShowHistory(!showHistory)}
                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center"
                        >
                            {showHistory ? 'Hide' : 'Show'} Stock History
                            {showHistory ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />}
                        </button>
                        {showHistory && (
                            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-2 rounded-md border dark:border-gray-700">
                                {product.history.map((entry, index) => (
                                    <div key={index} className="text-xs p-1.5 rounded bg-white dark:bg-gray-800">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{entry.action}</p>
                                        <p className="text-gray-500 dark:text-gray-400">{entry.user} - {new Date(entry.timestamp).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}


                <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Product</button>
                </div>
            </form>
        </Modal>
    );
};


const UpdateStockModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}> = ({ isOpen, onClose, product }) => {
    const { updateProductStock } = useData();
    const { currentUser } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [action, setAction] = useState<'add' | 'remove'>('add');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setAction('add');
            setReason('');
        }
    }, [isOpen]);

    if (!product) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert('A reason for the stock adjustment is required.');
            return;
        }
        const quantityChange = action === 'add' ? quantity : -quantity;
        if (currentUser) {
            updateProductStock(product.id, quantityChange, reason.trim(), currentUser.name);
        }
        onClose();
    };
    
    const maxRemove = product.stock;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Update Stock for ${product.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p>Current stock: <strong className="text-indigo-600 dark:text-indigo-400">{product.stock.toLocaleString()}</strong> units</p>
                <div className="flex items-center space-x-4">
                    <select value={action} onChange={e => setAction(e.target.value as 'add' | 'remove')}>
                        <option value="add">Add Stock</option>
                        <option value="remove">Remove Stock</option>
                    </select>
                    <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        max={action === 'remove' ? maxRemove : undefined}
                        required
                    />
                </div>
                {action === 'remove' && quantity > maxRemove && (
                    <p className="text-sm text-red-500">Cannot remove more stock than is available.</p>
                )}
                <div>
                    <label htmlFor="stock-adjustment-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Adjustment</label>
                    <textarea
                        id="stock-adjustment-reason"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        rows={3}
                        required
                        className="mt-1 block w-full"
                        placeholder="e.g., Damaged stock, Received from PO #123, Manual correction..."
                    />
                </div>
                 <div className="flex justify-end pt-4 space-x-2 border-t dark:border-gray-700 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                    <button type="submit" disabled={action === 'remove' && quantity > maxRemove} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300">Confirm Update</button>
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

const getExpiryStatus = (item: Product): number => {
    if (!item.expires) {
        return 3; // No expiry date, sort last
    }
    const expiryDate = new Date(item.expires);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
        return 0; // Expired, sort first
    }
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    if (expiryDate <= thirtyDaysFromNow) {
        return 1; // Expiring soon, sort second
    }

    return 2; // Not expiring soon, sort third
};


const InventoryPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { products, deleteProducts, updateProductStatus } = useData();
    const [isScannerOpen, setScannerOpen] = useState(false);
    const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
    const [isUpdateStockModalOpen, setUpdateStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    
    // State for bulk action modals
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isStatusUpdateOpen, setStatusUpdateOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<Product['status']>('In Stock');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // State for user inputs
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [expiryFilter, setExpiryFilter] = useState('All');

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
            .filter(p => {
                if (expiryFilter === 'All') return true;
                const expiryStatus = getExpiryStatus(p);
                if (expiryFilter === 'Expiring Soon') return expiryStatus === 1;
                if (expiryFilter === 'Expired') return expiryStatus === 0;
                return true;
            })
            .filter(p => 
                p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                p.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
    }, [products, debouncedSearchTerm, statusFilter, categoryFilter, expiryFilter]);
    
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const totalStockForCategory = useMemo(() => {
        const productsToSum = (categoryFilter === 'All')
            ? products
            : products.filter(p => p.category === categoryFilter);
        return productsToSum.reduce((sum, p) => sum + p.stock, 0);
    }, [products, categoryFilter]);


    const handleAddProduct = () => {
        setSelectedProduct(null);
        setAddEditModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setAddEditModalOpen(true);
    };

    const handleUpdateStock = (product: Product) => {
        setSelectedProduct(product);
        setUpdateStockModalOpen(true);
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
        setIsUpdatingStatus(true);
        // Simulate API call for better UX
        setTimeout(() => {
            updateProductStatus(selectedProductIds, newStatus);
            setSelectedProductIds([]);
            setStatusUpdateOpen(false);
            setIsUpdatingStatus(false);
        }, 500);
    };

    const getRowClassName = (item: Product): string => {
        const status = getExpiryStatus(item);
        if (status === 0) { // Expired
            return 'bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70';
        }
        if (status === 1) { // Expiring Soon
            return 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/70';
        }
        return '';
    };

    const columns = [
        { 
            header: 'Image', 
            accessor: 'imageUrl' as keyof Product,
            render: (item: Product) => (
                item.imageUrl ?
                <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded-md" />
                : <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500">No Img</div>
            )
        },
        { header: 'SKU', accessor: 'sku' as keyof Product, sortable: true },
        { header: 'Batch #', accessor: 'batchNumber' as keyof Product, sortable: true },
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
        { header: 'Date Added', accessor: 'dateAdded' as keyof Product, sortable: true },
        { 
            header: 'Expires', 
            accessor: 'expires' as keyof Product, 
            sortable: true, 
            sortFn: (a: Product, b: Product) => {
                const statusA = getExpiryStatus(a);
                const statusB = getExpiryStatus(b);
    
                if (statusA !== statusB) {
                    return statusA - statusB;
                }
    
                if (statusA === 3) { // Both have no expiry date
                    return 0;
                }
                
                // Both have expiry dates and same status.
                const dateA = new Date(a.expires!).getTime();
                const dateB = new Date(b.expires!).getTime();
                
                return dateA - dateB;
            },
            render: (item: Product) => {
                if (!item.expires) {
                    return <span className="text-gray-500">N/A</span>;
                }
                const expiryDate = new Date(item.expires);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize today's date
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(today.getDate() + 30);
                
                let color = 'text-gray-800 dark:text-gray-200';
                if (expiryDate < today) {
                    color = 'text-red-600 dark:text-red-400 font-bold'; // Expired
                } else if (expiryDate <= thirtyDaysFromNow) {
                    color = 'text-yellow-600 dark:text-yellow-400 font-semibold'; // Expiring soon
                }
    
                return <span className={color}>{item.expires}</span>;
            }
        },
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

    const renderActions = (item: Product) => {
        const canUpdateStock = currentUser?.roles.includes('Admin') || currentUser?.roles.includes('Inventory Manager');
        if (!canUpdateStock) return null;
        
        return (
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => handleUpdateStock(item)}
                    className="p-1 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-gray-700"
                    title="Increase stock"
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
                 <button
                    onClick={() => handleUpdateStock(item)}
                    className="p-1 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-gray-700"
                    title="Decrease stock"
                >
                    <MinusIcon className="w-4 h-4" />
                </button>
            </div>
        )
    };
    
    const exportColumns = columns
        .filter(c => c.header !== 'Image') // Exclude the image column from exports
        .map(c => ({ header: c.header, accessor: c.accessor }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Inventory</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setScannerOpen(true)} className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors no-print">
                        <QrCodeIcon className="w-5 h-5 mr-2" />
                        Scan
                    </button>
                    <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors no-print">
                        <PrinterIcon className="w-5 h-5 mr-2" />
                        Print
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
                <div className="relative w-full md:w-1/3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full shadow-sm rounded-md pl-10 pr-10"
                    />
                    {searchTerm && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                                aria-label="Clear search"
                            >
                                <CloseIcon className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="shadow-sm rounded-md">
                        <option value="All">All Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                     <select value={expiryFilter} onChange={e => setExpiryFilter(e.target.value)} className="shadow-sm rounded-md">
                        <option value="All">All Expiry Statuses</option>
                        <option value="Expiring Soon">Expiring Soon</option>
                        <option value="Expired">Expired</option>
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
                <div className="sticky top-4 sm:top-6 z-10 p-3 bg-indigo-100 dark:bg-gray-700 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 animate-fadeIn no-print border-l-4 border-indigo-500">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-indigo-800 dark:text-indigo-200">{selectedProductIds.length} item(s) selected</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setStatusUpdateOpen(true)} className="px-4 py-2 text-sm font-medium text-indigo-700 bg-white rounded-md hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-300 dark:hover:bg-gray-600 shadow-sm border border-indigo-200 dark:border-gray-600 transition-colors">Update Status</button>
                        <button onClick={() => setDeleteConfirmOpen(true)} className="px-4 py-2 text-sm font-medium text-red-700 bg-white rounded-md hover:bg-red-50 dark:bg-gray-800 dark:text-red-300 dark:hover:bg-gray-600 shadow-sm border border-red-200 dark:border-gray-600 transition-colors">Delete Selected</button>
                        <button 
                            onClick={() => setSelectedProductIds([])} 
                            className="p-2 text-gray-600 bg-white rounded-full hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
                            aria-label="Clear selection"
                            title="Clear selection"
                        >
                            <CloseIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            <DataTable
                columns={columns}
                data={filteredProducts}
                renderActions={renderActions}
                rowClassName={getRowClassName}
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

            <AddEditProductModal isOpen={isAddEditModalOpen} onClose={() => setAddEditModalOpen(false)} product={selectedProduct} />
            
            <UpdateStockModal isOpen={isUpdateStockModalOpen} onClose={() => setUpdateStockModalOpen(false)} product={selectedProduct} />

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
                        Are you sure you want to update the status for <strong className="text-gray-800 dark:text-white">{selectedProductIds.length}</strong> selected products to <strong className="text-gray-800 dark:text-white">"{newStatus}"</strong>?
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
                        <button type="button" onClick={() => setStatusUpdateOpen(false)} disabled={isUpdatingStatus} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmStatusUpdate}
                            disabled={isUpdatingStatus}
                            className="px-4 py-2 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-wait flex items-center justify-center min-w-[120px]"
                        >
                            {isUpdatingStatus ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                'Update Status'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default InventoryPage;