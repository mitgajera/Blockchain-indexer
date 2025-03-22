import { CubeIcon, ServerIcon, TableCellsIcon, BoltIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';

interface StatsItem {
  id: string;
  name: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface StatsGridProps {
  connections: number;
  configs: number;
  eventsProcessed: number;
  activeWebhooks: number;
}

export default function StatsGrid({ 
  connections, 
  configs, 
  eventsProcessed, 
  activeWebhooks 
}: StatsGridProps) {
  const stats: StatsItem[] = [
    {
      id: 'connections',
      name: 'Database Connections',
      value: connections,
      description: 'Total number of database connections',
      icon: ServerIcon,
      color: 'bg-blue-500',
    },
    {
      id: 'configs',
      name: 'Indexing Configs',
      value: configs,
      description: 'Active indexing configurations',
      icon: TableCellsIcon,
      color: 'bg-indigo-500',
    },
    {
      id: 'events',
      name: 'Events Processed',
      value: eventsProcessed.toLocaleString(),
      description: 'Total blockchain events processed',
      icon: BoltIcon,
      color: 'bg-green-500',
    },
    {
      id: 'webhooks',
      name: 'Active Webhooks',
      value: activeWebhooks,
      description: 'Currently active webhook listeners',
      icon: CubeIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.id} className="overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          {stat.description && (
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-gray-500">
                {stat.description}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}import { CubeIcon, ServerIcon, TableCellsIcon, BoltIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';

interface StatsItem {
  id: string;
  name: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface StatsGridProps {
  connections: number;
  configs: number;
  eventsProcessed: number;
  activeWebhooks: number;
}

export default function StatsGrid({ 
  connections, 
  configs, 
  eventsProcessed, 
  activeWebhooks 
}: StatsGridProps) {
  const stats: StatsItem[] = [
    {
      id: 'connections',
      name: 'Database Connections',
      value: connections,
      description: 'Total number of database connections',
      icon: ServerIcon,
      color: 'bg-blue-500',
    },
    {
      id: 'configs',
      name: 'Indexing Configs',
      value: configs,
      description: 'Active indexing configurations',
      icon: TableCellsIcon,
      color: 'bg-indigo-500',
    },
    {
      id: 'events',
      name: 'Events Processed',
      value: eventsProcessed.toLocaleString(),
      description: 'Total blockchain events processed',
      icon: BoltIcon,
      color: 'bg-green-500',
    },
    {
      id: 'webhooks',
      name: 'Active Webhooks',
      value: activeWebhooks,
      description: 'Currently active webhook listeners',
      icon: CubeIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.id} className="overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          {stat.description && (
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-gray-500">
                {stat.description}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}