import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { 
  ServerIcon, 
  TableCellsIcon, 
  BoltIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  iconBgColor: string;
  loading?: boolean;
}

export function StatCard({ title, value, change, icon: Icon, iconBgColor, loading = false }: StatCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-md ${iconBgColor}`}>
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{value}</div>
                  {change !== undefined && (
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? (
                        <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                      ) : (
                        <ArrowDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />
                      )}
                      <span className="sr-only">{change >= 0 ? 'Increased' : 'Decreased'} by</span>
                      {Math.abs(change)}%
                    </div>
                  )}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </Card>
  );
}

interface StatsCardsProps {
  data?: {
    activeConnections: number;
    activeConfigs: number;
    transactionsProcessed: number;
    avgProcessingTime: number;
    transactionGrowth?: number;
  };
  loading?: boolean;
}

export default function StatsCards({ data, loading = false }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Connections"
        value={data?.activeConnections || 0}
        icon={ServerIcon}
        iconBgColor="bg-blue-500"
        loading={loading}
      />
      <StatCard
        title="Active Configs"
        value={data?.activeConfigs || 0}
        icon={TableCellsIcon}
        iconBgColor="bg-indigo-500"
        loading={loading}
      />
      <StatCard
        title="Transactions Processed"
        value={data?.transactionsProcessed || 0}
        change={data?.transactionGrowth}
        icon={BoltIcon}
        iconBgColor="bg-green-500"
        loading={loading}
      />
      <StatCard
        title="Avg. Processing Time"
        value={`${data?.avgProcessingTime || 0} ms`}
        icon={ClockIcon}
        iconBgColor="bg-purple-500"
        loading={loading}
      />
    </div>
  );
}