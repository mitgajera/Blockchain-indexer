import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

interface DbConnection {
  id: number;
  host: string;
  port: number;
  database: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConnectionListProps {
  connections: DbConnection[];
  onRefresh: () => void;
  loading?: boolean;
}

export default function ConnectionList({ 
  connections, 
  onRefresh, 
  loading = false 
}: ConnectionListProps) {
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    connectionId?: number; 
    connectionName?: string; 
  }>({
    isOpen: false,
  });
  
  const [activeModal, setActiveModal] = useState<{ 
    isOpen: boolean; 
    connectionId?: number; 
    connectionName?: string;
  }>({
    isOpen: false,
  });
  
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confirmDelete = (connection: DbConnection) => {
    setDeleteModal({
      isOpen: true,
      connectionId: connection.id,
      connectionName: `${connection.database} (${connection.host}:${connection.port})`,
    });
  };

  const confirmSetActive = (connection: DbConnection) => {
    if (connection.isActive) return;
    
    setActiveModal({
      isOpen: true,
      connectionId: connection.id,
      connectionName: `${connection.database} (${connection.host}:${connection.port})`,
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.connectionId) return;
    
    setActionLoading(deleteModal.connectionId);
    setError(null);
    
    try {
      await axios.delete(`/api/db-connection/${deleteModal.connectionId}`);
      setDeleteModal({ isOpen: false });
      onRefresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while deleting the connection');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetActive = async () => {
    if (!activeModal.connectionId) return;
    
    setActionLoading(activeModal.connectionId);
    setError(null);
    
    try {
      await axios.patch(`/api/db-connection/${activeModal.connectionId}`, {
        isActive: true,
      });
      setActiveModal({ isOpen: false });
      onRefresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while setting the active connection');
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Database Connections</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your PostgreSQL database connections for storing indexed blockchain data
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/dashboard/connections/new">
                <Button leftIcon={<PlusIcon className="h-5 w-5" />}>
                  New Connection
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 text-sm text-white bg-red-500 rounded-md">
              {error}
            </div>
          )}

          {connections.length === 0 ? (
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
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No database connections</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new database connection.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/connections/new">
                  <Button leftIcon={<PlusIcon className="h-5 w-5" />}>
                    New Connection
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Database
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Host & Port
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {connections.map((connection) => (
                      <tr key={connection.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {connection.database}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {connection.host}:{connection.port}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {connection.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {connection.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircleIcon className="mr-1 h-4 w-4" />
                              Active
                            </span>
                          ) : (
                            <button
                              onClick={() => confirmSetActive(connection)}
                              className="text-indigo-600 hover:text-indigo-900"
                              disabled={actionLoading === connection.id}
                            >
                              Set as active
                            </button>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-3">
                            <Link
                              href={`/dashboard/connections/edit/${connection.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <PencilIcon className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">Edit</span>
                            </Link>
                            <button
                              onClick={() => confirmDelete(connection)}
                              className="text-red-600 hover:text-red-900"
                              disabled={actionLoading === connection.id || connection.isActive}
                            >
                              <TrashIcon
                                className={`h-5 w-5 ${
                                  connection.isActive ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                aria-hidden="true"
                              />
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
          )}
        </div>
      </Card>

      {/* Set Active Connection Modal */}
      <Modal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal({ isOpen: false })}
        title="Set as Active Connection"
        footer={
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setActiveModal({ isOpen: false })}
              disabled={actionLoading === activeModal.connectionId}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSetActive}
              isLoading={actionLoading === activeModal.connectionId}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to set &quot;{activeModal.connectionName}&quot; as your active database connection?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This will deactivate any currently active connections.
        </p>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Connection"
        footer={
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false })}
              disabled={actionLoading === deleteModal.connectionId}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={actionLoading === deleteModal.connectionId}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the connection to &quot;{deleteModal.connectionName}&quot;? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}