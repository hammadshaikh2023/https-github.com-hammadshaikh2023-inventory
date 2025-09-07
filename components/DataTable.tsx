
import React, { useState, useMemo } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from './IconComponents';

interface Column<T> {
    header: string;
    accessor: keyof T;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    renderActions?: (item: T) => React.ReactNode;
}

type SortConfig<T> = {
    key: keyof T;
    direction: 'ascending' | 'descending';
} | null;

const DataTable = <T extends { id: string },>(
    { columns, data, renderActions }: DataTableProps<T>
) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
    const itemsPerPage = 10;

    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);
    
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
                            {renderActions && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr 
                                    key={item.id} 
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 animate-slideInUp"
                                    style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'backwards' }}
                                >
                                    {columns.map((col) => (
                                        <td key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-900 dark:text-gray-200">
                                              {col.render ? col.render(item) : (item[col.accessor] as React.ReactNode)}
                                            </span>
                                        </td>
                                    ))}
                                    {renderActions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {renderActions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td 
                                    colSpan={columns.length + (renderActions ? 1 : 0)} 
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
                 <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
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
