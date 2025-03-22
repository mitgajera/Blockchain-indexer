import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

// Define generic indexed transaction type
interface IndexedTransaction {
  id: string;
  signature: string;
  transaction_type: string;
  timestamp: string;
  [key: string]: any; // For dynamic fields
}

interface IndexingTableProps {
  title: string;
  data: IndexedTransaction[];
  columns: Array<{
    header: string;
    accessor: string;
    isNumeric?: boolean;
    render?: (value: any, row: IndexedTransaction) => React.ReactNode;
  }>;
  total: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function IndexingTable({
  title,
  data,
  columns,
  total,
  limit,
  offset,
  onPageChange,
  onSort,
  onSearch,
  loading = false,
  error = null,
}: IndexingTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; transaction?: IndexedTransaction }>({
    isOpen: false,
  });

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // Handle sort click
  const handleSortClick = (field: string) => {
    if (!onSort) return;
    
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  // Handle search
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Handle Enter key in search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle pagination
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange((currentPage - 2) * limit);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage * limit);
    }
  };

  // View transaction details
  const viewDetails = (transaction: IndexedTransaction) => {
    setDetailModal({
      isOpen: true,
      transaction,
    });
  };

  return (
    <>
      <Card title={title}>
        {/* Search and filters */}
        {onSearch && (
          <div className="mb-4">
            <div className="sm:flex sm:justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative rounded-md shadow-sm">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by signature or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    fullWidth
                    rightIcon={
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSearch}
                        className="absolute right-0 top-0 h-full rounded-l-none"
                      >
                        Search
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-white bg-red-500 rounded-md">
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.accessor}
                      scope="col"
                      className={`py-3.5 px-3 text-left text-sm font-semibold text-gray-900 ${
                        onSort ? 'cursor-pointer hover:bg-gray-100' : ''
                      } ${column.isNumeric ? 'text-right' : 'text-left'}`}
                      onClick={() => onSort && handleSortClick(column.accessor)}
                    >
                      <div className="flex items-center">
                        <span>{column.header}</span>
                        {onSort && sortField === column.accessor && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={`${row.id}-${column.accessor}`}
                        className={`px-3 py-4 text-sm ${
                          column.isNumeric ? 'text-right' : 'text-left'
                        } ${
                          column.accessor === 'signature'
                            ? 'font-mono text-xs text-gray-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {column.render
                          ? column.render(row[column.accessor], row)
                          : column.accessor === 'signature'
                          ? `${row[column.accessor].substring(0, 8)}...${row[column.accessor].substring(
                              row[column.accessor].length - 8
                            )}`
                          : column.accessor === 'timestamp'
                          ? format(new Date(row[column.accessor]), 'MMM d, yyyy HH:mm:ss')
                          : row[column.accessor]}
                      </td>
                    ))}
                    <td className="px-3 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => viewDetails(row)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{offset + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(offset + limit, total)}</span> of{' '}
                  <span className="font-medium">{total}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Transaction details modal */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false })}
        title="Transaction Details"
        size="lg"
      >
        {detailModal.transaction && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Signature</h3>
              <p className="mt-1 font-mono text-sm break-all">{detailModal.transaction.signature}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p className="mt-1 text-sm">{detailModal.transaction.transaction_type}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
              <p className="mt-1 text-sm">
                {format(new Date(detailModal.transaction.timestamp), 'PPpp')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Transaction Data</h3>
              <div className="mt-2 bg-gray-50 p-3 rounded-md">
                <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-96">
                  {JSON.stringify(
                    Object.entries(detailModal.transaction).reduce((acc, [key, value]) => {
                      if (!['id', 'signature', 'transaction_type', 'timestamp'].includes(key)) {
                        acc[key] = value;
                      }
                      return acc;
                    }, {} as Record<string, any>),
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setDetailModal({ isOpen: false })}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}