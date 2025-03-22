import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { IndexingConfigForm } from '@/types/indexing';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DataTypeSelector from './DataTypeSelector';
import Card from '../ui/Card';

interface Props {
  onSuccess?: () => void;
  initialValues?: Partial<IndexingConfigForm>;
  isEdit?: boolean;
  configId?: number;
}

export default function ConfigForm({ onSuccess, initialValues, isEdit, configId }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<IndexingConfigForm>({
    name: initialValues?.name || '',
    nftBids: initialValues?.nftBids || false,
    tokenPrices: initialValues?.tokenPrices || false,
    borrowableTokens: initialValues?.borrowableTokens || false,
    customAddresses: initialValues?.customAddresses || [],
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<string[]>(initialValues?.customAddresses || []);
  const [newAddress, setNewAddress] = useState('');

  // Add address to array
  const addAddress = () => {
    if (!newAddress) return;
    
    // Basic validation for Solana addresses
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(newAddress)) {
      setError('Please enter a valid Solana address');
      return;
    }
    
    setAddresses([...addresses, newAddress]);
    setNewAddress('');
    setError(null);
  };

  // Remove address from array
  const removeAddress = (index: number) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  // Update addresses in form data when they change
  useEffect(() => {
    setFormData(prev => ({ ...prev, customAddresses: addresses }));
  }, [addresses]);

  const handleDataTypeChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && configId) {
        await axios.patch(`/api/indexing/${configId}`, formData);
      } else {
        await axios.post('/api/indexing/config', formData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/indexing');
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-white bg-red-500 rounded-md">
            {error}
          </div>
        )}

        <div>
          <Input
            id="name"
            name="name"
            type="text"
            label="Configuration Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            placeholder="My Indexing Configuration"
          />
        </div>

        <div>
          <h3 className="block text-sm font-medium text-gray-700 mb-3">Data Types to Index</h3>
          <DataTypeSelector
            nftBids={formData.nftBids}
            tokenPrices={formData.tokenPrices}
            borrowableTokens={formData.borrowableTokens}
            onChange={handleDataTypeChange}
          />
          <p className="mt-2 text-xs text-gray-500">
            Select at least one data type to index, or add custom addresses below.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Addresses (Optional)
          </label>
          <div className="flex space-x-2 mb-2">
            <Input
              id="newAddress"
              name="newAddress"
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter Solana address"
              fullWidth
            />
            <Button
              type="button"
              onClick={addAddress}
              variant="secondary"
            >
              Add
            </Button>
          </div>
          
          {addresses.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Added Addresses:</h4>
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-40 overflow-y-auto">
                {addresses.map((address, index) => (
                  <li key={index} className="px-3 py-2 flex justify-between items-center text-sm">
                    <span className="font-mono truncate">{address}</span>
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            isLoading={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Configuration' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </Card>
  );
}