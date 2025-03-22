import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Card from '../ui/Card';

interface StatusItem {
  id: string;
  name: string;
  status: 'healthy' | 'error' | 'warning' | 'inactive';
  message?: string;
}

interface StatusOverviewProps {
  items: StatusItem[];
  loading?: boolean;
}

export default function StatusOverview({ items, loading = false }: StatusOverviewProps) {
  if (loading) {
    return (
      <Card>
        <div className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">System Status</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Current status of your blockchain indexing services</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
            >
              <dt className="text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  {item.status === 'healthy' && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  )}
                  {item.status === 'error' && (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  {item.status === 'warning' && (
                    <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.status === 'inactive' && (
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>
                    {item.status === 'healthy' && 'Healthy'}
                    {item.status === 'error' && 'Error'}
                    {item.status === 'warning' && 'Warning'}
                    {item.status === 'inactive' && 'Inactive'}
                    {item.message && ` - ${item.message}`}
                  </span>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}