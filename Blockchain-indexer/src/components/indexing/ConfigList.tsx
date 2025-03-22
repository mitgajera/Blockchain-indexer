import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

interface IndexingConfig {
  id: number;
  name: string;
  nftBids: boolean;
  tokenPrices: boolean;
  borrowableTokens: boolean;
  customAddresses: string[];
  webhookId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConfigListProps {
  configs: IndexingConfig[];
  onDelete?: () => void;
  onActivate?: () => void;
  loading?: boolean;
}

export default function ConfigList({ 
  configs, 
  onDelete, 
  onActivate, 
  loading = false 
}: ConfigListProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<IndexingConfig | null>(null);
  const [deletingConfig, setDeletingConfig] = useState(false);
  const [activatingConfig, setActivatingConfig] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (config: IndexingConfig) => {
    setConfigToDelete(config);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!configToDelete) return;
    
    setDeletingConfig(true);
    setError(null);
    
    try {
      await axios.delete(`/api/indexing/${configToDelete.id}`);
      setDeleteConfirmOpen(false);
      if (onDelete) onDelete();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to delete configuration');
      }
    } finally {
      setDeletingConfig(false);
    }
  };

  const handleActivate = async (configId: number, currentState: boolean) => {
    setActivatingConfig(configId);
    setError(null);
    
    try {
      await axios.patch(`/api/indexing/${configId}`, {
        isActive: !currentState,
      });
      if (onActivate) onActivate();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to update configuration');
      }
    } finally {
      setActivatingConfig(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="p-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h3 className="text-lg font-medium text-gray-900">Indexing Configurations</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your blockchain data indexing configurations
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link href="/dashboard/indexing/new">
                <Button leftIcon={<PlusIcon className="h-5 w-5" />}>
                  New Configuration
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 text-sm text-white bg-red-500 rounded-md">
              {error}
            </div>
          )}
          
          {configs.length === 0 ? (
            <div className="mt-6 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No configurations</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new indexing configuration.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/indexing/new">
                  <Button>
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Configuration
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                        >
                          Data Types
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                        >
                          Addresses
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {configs.map((config) => (
                        <tr key={config.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                            {config.name}
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            <div className="space-y-1">
                              {config.nftBids && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">NFT Bids</span>}
                              {config.tokenPrices && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-1">Token Prices</span>}
                              {config.borrowableTokens && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Borrowable Tokens</span>}
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                            {config.customAddresses.length > 0 ? `${config.customAddresses.length} addresses` : 'None'}
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              config.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {config.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                            <div className="flex space-x-2 justify-end">
                              <button
                                onClick={() => handleActivate(config.id, config.isActive)}
                                disabled={activatingConfig === config.id}
                                className={`${
                                  config.isActive 
                                    ? 'text-red-600 hover:text-red-900' 
                                    : 'text-green-600 hover:text-green-900'
                                } disabled:opacity-50`}
                              >
                                {activatingConfig === config.id ? 
                                  'Processing...' : 
                                  config.isActive ? 'Deactivate' : 'Activate'
                                }
                              </button>
                              <Link
                                href={`/dashboard/indexing/edit/${config.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                                <span className="sr-only">Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(config)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Configuration"
        footer={
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deletingConfig}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deletingConfig}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the configuration &quot;{configToDelete?.name}&quot;? This action cannot be undone.
        </p>
        {configToDelete?.isActive && (
          <p className="mt-2 text-sm text-red-500">
            Warning: This configuration is currently active. Deleting it will stop data indexing.
          </p>
        )}
        {error && (
          <div className="mt-3 p-2 text-sm text-white bg-red-500 rounded-md">
            {error}
          </div>
        )}
      </Modal>
    </>
  );
}