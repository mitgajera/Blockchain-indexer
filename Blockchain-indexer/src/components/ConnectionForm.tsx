import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { DatabaseConnectionForm, TestConnectionResult } from '@/types/database';

interface Props {
  onSuccess?: () => void;
  initialValues?: Partial<DatabaseConnectionForm>;
  isEdit?: boolean;
  connectionId?: number;
}

export default function ConnectionForm({ onSuccess, initialValues, isEdit, connectionId }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<DatabaseConnectionForm>({
    host: initialValues?.host || '',
    port: initialValues?.port || 5432,
    database: initialValues?.database || '',
    username: initialValues?.username || '',
    password: initialValues?.password || '',
    ssl: initialValues?.ssl || false
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'port' ? parseInt(value) : value
    });
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const response = await axios.post<TestConnectionResult>('/api/db-connection/test', formData);
      setTestResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setTestResult({
          success: false,
          message: error.response.data.message,
        });
      } else {
        setTestResult({
          success: false,
          message: 'An unexpected error occurred while testing the connection',
        });
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && connectionId) {
        // Only send fields that were changed
        const payload: Record<string, any> = {};
        
        if (initialValues?.host !== formData.host) payload.host = formData.host;
        if (initialValues?.port !== formData.port) payload.port = formData.port;
        if (initialValues?.database !== formData.database) payload.database = formData.database;
        if (initialValues?.username !== formData.username) payload.username = formData.username;
        if (formData.password) payload.password = formData.password; // Only send if provided (changed)
        if (initialValues?.ssl !== formData.ssl) payload.ssl = formData.ssl;

        await axios.patch(`/api/db-connection/${connectionId}`, payload);
      } else {
        await axios.post('/api/db-connection', formData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/connections');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-white bg-red-500 rounded-md">
          {error}
        </div>
      )}

      {testResult && (
        <div className={`p-3 text-sm text-white rounded-md ${testResult.success ? 'bg-green-500' : 'bg-red-500'}`}>
          {testResult.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="host" className="block text-sm font-medium text-gray-700">
            Host
          </label>
          <input
            type="text"
            name="host"
            id="host"
            value={formData.host}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., localhost or db.example.com"
          />
        </div>

        <div>
          <label htmlFor="port" className="block text-sm font-medium text-gray-700">
            Port
          </label>
          <input
            type="number"
            name="port"
            id="port"
            value={formData.port}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="5432"
          />
        </div>

        <div>
          <label htmlFor="database" className="block text-sm font-medium text-gray-700">
            Database Name
          </label>
          <input
            type="text"
            name="database"
            id="database"
            value={formData.database}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., postgres"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., postgres"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEdit}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={isEdit ? "Leave blank to keep current password" : "Database password"}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="ssl"
            id="ssl"
            checked={formData.ssl}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="ssl" className="block ml-2 text-sm font-medium text-gray-700">
            Enable SSL
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 space-x-4">
        <button
          type="button"
          onClick={testConnection}
          disabled={isTesting}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Connection' : 'Save Connection'}
        </button>
      </div>
    </form>
  );
}