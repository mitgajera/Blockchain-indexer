import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ConnectionForm {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  isActive: boolean;
}

interface ConnectionFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<ConnectionForm>;
  isEdit?: boolean;
  connectionId?: number;
}

export default function ConnectionForm({
  onSuccess,
  initialValues,
  isEdit = false,
  connectionId,
}: ConnectionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ConnectionForm>({
    host: initialValues?.host || '',
    port: initialValues?.port || 5432,
    database: initialValues?.database || '',
    username: initialValues?.username || '',
    password: initialValues?.password || '',
    ssl: initialValues?.ssl || false,
    isActive: initialValues?.isActive || false,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    let finalValue: string | number | boolean = value;
    
    if (type === 'number') {
      finalValue = parseInt(value) || 0;
    } else if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    setError(null);
    
    try {
      const { host, port, database, username, password, ssl } = formData;
      
      if (!host || !database || !username) {
        setError('Please fill in all required fields before testing the connection');
        setTestingConnection(false);
        return;
      }
      
      const response = await axios.post('/api/db-connection/test', {
        host,
        port,
        database,
        username,
        password,
        ssl,
      });
      
      setTestResult({
        success: response.data.success,
        message: response.data.message,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setTestResult({
          success: false,
          message: error.response.data.message,
        });
      } else {
        setTestResult({
          success: false,
          message: 'An error occurred while testing the connection',
        });
      }
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEdit && connectionId) {
        await axios.patch(`/api/db-connection/${connectionId}`, formData);
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
    <Card>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-white bg-red-500 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="host" className="block text-sm font-medium text-gray-700">
                Host <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="host"
                id="host"
                value={formData.host}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., localhost or db.example.com"
              />
            </div>
            
            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                Port <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="port"
                id="port"
                value={formData.port}
                onChange={handleChange}
                required
                min="1"
                max="65535"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="database" className="block text-sm font-medium text-gray-700">
                Database Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="database"
                id="database"
                value={formData.database}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., blockchain_index"
              />
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password {isEdit && <span className="text-gray-500 text-xs">(leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={isEdit ? "••••••••" : ""}
              />
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="ssl"
                  name="ssl"
                  type="checkbox"
                  checked={formData.ssl}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="ssl" className="font-medium text-gray-700">
                  Use SSL
                </label>
                <p className="text-gray-500">
                  Enable SSL/TLS for database connection
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isActive" className="font-medium text-gray-700">
                  Set as Active Connection
                </label>
                <p className="text-gray-500">
                  Use this connection for indexing blockchain data
                </p>
              </div>
            </div>
          </div>
          
          {testResult && (
            <div
              className={`p-3 text-sm rounded-md ${
                testResult.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {testResult.message}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row-reverse sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
            <div className="flex space-x-3">
              <Button
                type="submit"
                isLoading={loading}
              >
                {loading ? 'Saving...' : isEdit ? 'Update Connection' : 'Create Connection'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/connections')}
              >
                Cancel
              </Button>
            </div>
            
            <Button
              type="button"
              variant="secondary"
              onClick={handleTestConnection}
              isLoading={testingConnection}
            >
              Test Connection
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}