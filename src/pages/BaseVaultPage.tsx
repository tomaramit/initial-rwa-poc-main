import { useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface BaseVaultData {
  contract: string;
  network: string;
  currentEpochDay: string;
  currentEpochReward: string;
  currentDailyReward: string;
  totalAssets: string;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/amittomarApiTest`;

const BaseVaultPage = () => {
  const [vaultData, setVaultData] = useState<BaseVaultData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchVaultData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vault data.');
      }

      setVaultData(data);
    } catch (requestError) {
      setVaultData(null);
      setError(requestError instanceof Error ? requestError.message : 'Failed to fetch vault data.');
    } finally {
      setIsLoading(false);
    }
  };

  const rows = vaultData
    ? [
        ['Network', vaultData.network],
        ['Contract address', vaultData.contract],
        ['Current epoch day', vaultData.currentEpochDay],
        ['Current epoch reward', vaultData.currentEpochReward],
        ['Current daily reward', vaultData.currentDailyReward],
        ['Total assets', vaultData.totalAssets]
      ]
    : [];

  return (
    <section className="container mx-auto max-w-5xl px-4 py-16">
      <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Base Mainnet</p>
            <h1 className="mt-1 text-3xl font-bold">Vault data</h1>
            <p className="mt-2 text-neutral-600">Fetch the latest public data from the Base vault contract.</p>
          </div>
          <Button onClick={fetchVaultData} disabled={isLoading} icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}>
            {isLoading ? 'Fetching data...' : 'Fetch vault data'}
          </Button>
        </div>

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {vaultData && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-200">
            <table className="min-w-full divide-y divide-neutral-200 text-left">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-5 py-3 text-sm font-semibold text-neutral-700">Field</th>
                  <th className="px-5 py-3 text-sm font-semibold text-neutral-700">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {rows.map(([field, value]) => (
                  <tr key={field}>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-neutral-800">{field}</td>
                    <td className="break-all px-5 py-4 font-mono text-sm text-neutral-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default BaseVaultPage;
