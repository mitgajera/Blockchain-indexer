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
  transactionsProcessed: number;
  successCount: number;
  errorCount: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  loading?: boolean;
}

export default function ActivityChart({ data, loading = false }: ActivityChartProps) {
  const chartData = useMemo(() => {
    const labels = data.map(d => d.date);
    
    return {
      labels,
      datasets: [
        {
          label: 'Total Transactions',
          data: data.map(d => d.transactionsProcessed),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.4,
        },
        {
          label: 'Successful',
          data: data.map(d => d.successCount),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
        },
        {
          label: 'Failed',
          data: data.map(d => d.errorCount),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          tension: 0.4,
        },
      ],
    };
  }, [data]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card title="Activity Over Time" className="h-full">
      {loading ? (
        <div className="h-80 w-full bg-gray-100 animate-pulse rounded flex items-center justify-center">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      ) : (
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      )}
    </Card>
  );
}