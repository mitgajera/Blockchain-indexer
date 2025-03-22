import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface IndexingConfig {
  id: number;
  name: string;
  nftBids: boolean;
  tokenPrices: boolean;
  borrowableTokens: boolean;
  customAddresses: string[];
  isActive: boolean;
  webhookId: string;
  createdAt: string;
}

interface ConfigListProps {
  configs: IndexingConfig[];
  onRefresh: () => void;
  loading?: boolean;
}

export default function ConfigList({ configs, onRefresh, loading = false }: ConfigListProps) {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; configId?: number; configName?: string }>({
    isOpen: false,
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleToggleActive = async (configId: number, isActive: boolean) => {
    setActionLoading(configId);
    try {
      await axios.patch(`/api/indexing/${configId}`, { isActive });
      onRefresh();
    } catch (error) {
      console.error('Error toggling config status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (configId: number) => {
    router.push(`/dashboard/indexing/edit/${configId}`);
  };

  const confirmDelete = (configId: number, configName: string) => {
    setDeleteModal({
      isOpen: true,
      configId,
      configName,
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.configId) return;
    
    setActionLoading(deleteModal.configId);
    try {
      await axios.delete(`/api/indexing/${deleteModal.configId}`);
      setDeleteModal({ isOpen: false });
      onRefresh();
    } catch (error) {
      console.error('Error deleting config:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getEnabledTypes = (config: IndexingConfig) => {
    const types = [];
    if (config.nftBids) types.push('NFT Bids');
    if (config.tokenPrices) types.push('Token Prices');
    if (config.borrowableTokens) types.push('Borrowable Tokens');
    if (config.customAddresses.length > 0) types.push(`${config.customAddresses.length} Custom Addresses`);
    return types.join(', ');
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (configs.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">No indexing configurations yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first indexing configuration.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => router.push('/dashboard/indexing/new')}
            >
              Create Configuration
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Data Types
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Created
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {configs.map((config) => (
                <tr key={config.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {config.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {getEnabledTypes(config)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Switch
                      checked={config.isActive}
                      onChange={() => handleToggleActive(config.id, !config.isActive)}
                      disabled={actionLoading === config.id}
                      className={`${config.isActive ? 'bg-indigo-600' : 'bg-gray-200'} 
                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span className="sr-only">Toggle active status</span>
                      <span
                        className={`${config.isActive ? 'translate-x-5' : 'translate-x-0'}
                          pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      >
                        {config.isActive && (
                          <CheckCircleIcon className="absolute inset-0 m-auto h-3 w-3 text-indigo-600" />
                        )}
                      </span>
                    </Switch>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(config.createdAt).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(config.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        disabled={actionLoading === config.id}
                      >
                        <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => confirmDelete(config.id, config.name)}
                        className="text-red-600 hover:text-red-900"
                        disabled={actionLoading === config.id}
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Configuration"
        footer={
          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false })}
              disabled={actionLoading === deleteModal.configId}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={actionLoading === deleteModal.configId}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the configuration "{deleteModal.configName}"? This will remove all associated webhooks and stop indexing this data. This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}