import React, { useState, useMemo } from 'react';
import { ArrowUpIcon, ArrowDownIcon, EyeIcon } from './IconComponents';

interface Column<T> {
    header: string;
    accessor: keyof T;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    sortFn?: (a: T, b: T) => number;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    renderActions?: (item: T) => React.ReactNode;
    onViewDetails?: (item: T) => void;
    selection?: {
        selectedIds: string[];
        onToggleAll: () => void;
        onToggleRow: (id: string) => void;
        allSelected: boolean;
    };
    rowClassName?: (item: T) => string;
}

type SortConfig<T> = {
    key: keyof T;
    direction: 'ascending' | 'descending';
} | null;

const DataTable = <T extends { id: string },>(
    { columns, data, renderActions, onViewDetails, selection, rowClassName }: DataTableProps<T>
) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
    const itemsPerPage = 10;

    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            const sortColumn = columns.find(c => c.accessor === sortConfig.key);

            sortableItems.sort((a, b) => {
                // Use custom sort function if provided
                if (sortColumn?.sortFn) {
                    const result = sortColumn.sortFn(a, b);
                    return sortConfig.direction === 'ascending' ? result : -result;
                }
                
                // Default sorting logic
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                const isANull = valA === null || valA === undefined;
                const isBNull = valB === null || valB === undefined;

                if (isANull && isBNull) return 0;
                if (isANull) return 1; // nulls/undefined go to the end
                if (isBNull) return -1; // nulls/undefined go to the end
                
                let comparison = 0;
                if (valA < valB) {
                    comparison = -1;
                } else if (valA > valB) {
                    comparison = 1;
                }

                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [data, sortConfig, columns]);
    
    const requestSort = (key: keyof T) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {selection && (
                                <th className="px-6 py-3">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                                        checked={selection.allSelected}
                                        onChange={selection.onToggleAll}
                                        aria-label="Select all items on this page"
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th 
                                    key={String(col.accessor)} 
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    {col.sortable ? (
                                        <button onClick={() => requestSort(col.accessor)} className="flex items-center space-x-1 focus:outline-none">
                                            <span>{col.header}</span>
                                            {sortConfig?.key === col.accessor ? (
                                                sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-3 h-3"/> : <ArrowDownIcon className="w-3 h-3"/>
                                            ) : <span className="w-3 h-3"></span>}
                                        </button>
                                    ) : (
                                        col.header
                                    )}
                                </th>
                            ))}
                            {(renderActions || onViewDetails) && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider no-print">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => {
                                const isSelected = selection?.selectedIds.includes(item.id);
                                const customRowClass = rowClassName ? rowClassName(item) : '';
                                
                                return (
                                <tr 
                                    key={item.id} 
                                    className={`transition-colors duration-150 animate-slideInUp ${
                                        isSelected 
                                            ? 'bg-indigo-50 dark:bg-gray-700' 
                                            : customRowClass || 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                                    style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'backwards' }}
                                >
                                    {selection && (
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                                                checked={selection.selectedIds.includes(item.id)}
                                                onChange={() => selection.onToggleRow(item.id)}
                                                aria-label={`Select item ${item.id}`}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-900 dark:text-gray-200">
                                              {col.render ? col.render(item) : (item[col.accessor] as React.ReactNode)}
                                            </span>
                                        </td>
                                    ))}
                                    {(renderActions || onViewDetails) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right no-print">
                                            <div className="flex items-center justify-end space-x-4">
                                                {onViewDetails && (
                                                    <button
                                                        onClick={() => onViewDetails(item)}
                                                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        title="View Details"
                                                        aria-label={`View details for item ${item.id}`}
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {renderActions && renderActions(item)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                                );
                            })
                        ) : (
                             <tr>
                                <td 
                                    colSpan={columns.length + ((renderActions || onViewDetails) ? 1 : 0) + (selection ? 1 : 0)} 
                                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                 <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 no-print">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-medium text-gray-600 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm font-medium text-gray-600 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;