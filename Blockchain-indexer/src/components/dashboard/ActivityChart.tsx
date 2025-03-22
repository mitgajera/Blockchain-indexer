import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js';
import Card from '../ui/Card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityData {
  date: string;
  count: number;
  type: string;
}

interface ActivityChartProps {
  data: ActivityData[];
  loading?: boolean;
  title?: string;
  height?: number;
}

export default function ActivityChart({ 
  data, 
  loading = false, 
  title = 'Event Activity', 
  height = 300 
}: ActivityChartProps) {
  const chartData = useMemo(() => {
    // Group data by date and type
    const groupedData = data.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = {};
      }
      if (!acc[curr.date][curr.type]) {
        acc[curr.date][curr.type] = 0;
      }
      acc[curr.date][curr.type] += curr.count;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Get unique types
    const allTypes = [...new Set(data.map(d => d.type))];
    
    // Get all dates and sort them
    const allDates = [...new Set(data.map(d => d.date))].sort();

    // Prepare datasets
    const datasets = allTypes.map((type, index) => {
      const colors = [
        { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgb(59, 130, 246)' },
        { bg: 'rgba(99, 102, 241, 0.2)', border: 'rgb(99, 102, 241)' },
        { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgb(139, 92, 246)' },
        { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgb(16, 185, 129)' },
      ];
      
      const colorIndex = index % colors.length;
      
      return {
        label: type,
        data: allDates.map(date => groupedData[date]?.[type] || 0),
        borderColor: colors[colorIndex].border,
        backgroundColor: colors[colorIndex].bg,
        tension: 0.3,
      };
    });

    return {
      labels: allDates,
      datasets,
    };
  }, [data]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  if (loading) {
    return (
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="animate-pulse mt-4" style={{ height }}>
            <div className="bg-gray-200 h-full w-full rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div style={{ height }}>
          {data.length > 0 ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No activity data available</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}