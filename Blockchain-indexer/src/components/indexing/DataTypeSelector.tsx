interface DataTypeSelectorProps {
  nftBids: boolean;
  tokenPrices: boolean;
  borrowableTokens: boolean;
  onChange: (name: string, value: boolean) => void;
}

export default function DataTypeSelector({
  nftBids,
  tokenPrices,
  borrowableTokens,
  onChange,
}: DataTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className={`border rounded-lg p-4 ${nftBids ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="nftBids"
              name="nftBids"
              type="checkbox"
              checked={nftBids}
              onChange={(e) => onChange('nftBids', e.target.checked)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="nftBids" className="font-medium text-gray-700">NFT Bids</label>
            <p className="text-gray-500">Track bids and offers on NFT marketplaces</p>
          </div>
        </div>
      </div>

      <div className={`border rounded-lg p-4 ${tokenPrices ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="tokenPrices"
              name="tokenPrices"
              type="checkbox"
              checked={tokenPrices}
              onChange={(e) => onChange('tokenPrices', e.target.checked)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="tokenPrices" className="font-medium text-gray-700">Token Prices</label>
            <p className="text-gray-500">Index real-time token price data from DEXs</p>
          </div>
        </div>
      </div>

      <div className={`border rounded-lg p-4 ${borrowableTokens ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="borrowableTokens"
              name="borrowableTokens"
              type="checkbox"
              checked={borrowableTokens}
              onChange={(e) => onChange('borrowableTokens', e.target.checked)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="borrowableTokens" className="font-medium text-gray-700">Borrowable Tokens</label>
            <p className="text-gray-500">Track lending protocol data and available yield</p>
          </div>
        </div>
      </div>
    </div>
  );
}
