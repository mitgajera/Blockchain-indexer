import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/solid';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Log {
  id: number;
  eventType: string;
  status: string;
  message?: string;
  metadata?: Record<string, any>;
  createdAt: string | Date;
}

interface LogsViewerProps {
  logs: Log[];
  total: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  loading?: boolean;
}

export default function LogsViewer({ 
  logs, 
  total, 
  limit, 
  offset, 
  onPageChange, 
  loading = false 
}: LogsViewerProps) {
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);
  const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

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

  const statusIcon = (status: string) => {
    if (status === 'SUCCESS') {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    if (status === 'ERROR') {
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  const getEventTypeClass = (eventType: string) => {
    switch (eventType) {
      case 'WEBHOOK_RECEIVED':
        return 'bg-blue-100 text-blue-800';
      case 'DATA_INDEXED':
        return 'bg-green-100 text-green-800';
      case 'WEBHOOK_PROCESSING':
      case 'DATA_INDEXING':
        return 'bg-yellow-100 text-yellow-800';
      case 'WEBHOOK_PROCESSED':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card title="Recent Activity Logs" className="h-full">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-gray-100 animate-pulse rounded"></div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No logs found</p>
        </div>
      ) : (
        <div>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Event Type</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {logs.map((log) => (
                  <tr 
                    key={log.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEventTypeClass(log.eventType)}`}>
                        {log.eventType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        {statusIcon(log.status)}
                        <span className="ml-1">{log.status}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <div className={expandedLog === log.id ? '' : 'truncate max-w-xs'}>
                        {log.message || '-'}
                      </div>
                      {log.metadata && expandedLog === log.id && (
                        <div className="mt-2 bg-gray-50 p-2 rounded text-xs">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
        </div>
      )}
    </Card>
  );
}