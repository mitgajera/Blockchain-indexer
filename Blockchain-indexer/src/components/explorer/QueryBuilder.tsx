import { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface QueryBuilderProps {
  onRunQuery: (query: string) => void;
  defaultQuery?: string;
  isLoading?: boolean;
}

export default function QueryBuilder({ 
  onRunQuery, 
  defaultQuery = '', 
  isLoading = false 
}: QueryBuilderProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [error, setError] = useState<string | null>(null);

  // Simple SQL validation
  const validateQuery = (sql: string): { valid: boolean; message?: string } => {
    const trimmedSql = sql.trim().toLowerCase();
    
    if (!trimmedSql) {
      return { valid: false, message: 'Query cannot be empty' };
    }
    
    if (
      trimmedSql.includes('insert ') ||
      trimmedSql.includes('update ') ||
      trimmedSql.includes('delete ') ||
      trimmedSql.includes('drop ') ||
      trimmedSql.includes('alter ') ||
      trimmedSql.includes('create ')
    ) {
      return { valid: false, message: 'Only SELECT queries are allowed' };
    }
    
    if (!trimmedSql.startsWith('select ')) {
      return { valid: false, message: 'Query must start with SELECT' };
    }
    
    return { valid: true };
  };

  const handleRunQuery = () => {
    const validation = validateQuery(query);
    
    if (!validation.valid) {
      setError(validation.message || 'Invalid query');
      return;
    }
    
    setError(null);
    onRunQuery(query);
  };

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">SQL Query Builder</h3>
        <p className="mt-1 text-sm text-gray-500">
          Run SQL queries against your indexed blockchain data. Only SELECT queries are permitted.
        </p>
        
        {error && (
          <div className="mt-3 p-3 text-sm text-white bg-red-500 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-4">
          <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden">
            <textarea
              rows={6}
              className="block w-full border-0 p-3 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm font-mono"
              placeholder="SELECT * FROM nft_bids LIMIT 100"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            
            <div className="border-t border-gray-300 bg-gray-50 px-3 py-2 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                <span className="font-medium">Tip:</span> Access indexed tables like nft_bids, token_prices, or borrowable_tokens
              </div>
              <Button
                onClick={handleRunQuery}
                isLoading={isLoading}
                disabled={!query.trim()}
              >
                Run Query
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setQuery('SELECT * FROM nft_bids ORDER BY timestamp DESC LIMIT 100')}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              NFT Bids
            </button>
            <button
              type="button"
              onClick={() => setQuery('SELECT * FROM token_prices ORDER BY timestamp DESC LIMIT 100')}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Token Prices
            </button>
            <button
              type="button"
              onClick={() => setQuery('SELECT * FROM borrowable_tokens ORDER BY timestamp DESC LIMIT 100')}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Borrowable Tokens
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}