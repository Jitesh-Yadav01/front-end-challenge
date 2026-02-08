'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  title: string;
  data: any;
}

export function LineChart({ title, data }: LineChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        borderColor: '#27272a',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
         x: {
            grid: { display: false },
            ticks: { color: '#71717a', font: { family: 'inherit' } }
        },
        y: {
            grid: { color: '#27272a', borderDash: [4, 4] },
            ticks: { color: '#71717a', font: { family: 'inherit' } },
            border: { display: false }
        }
    },
    elements: {
        point: {
            radius: 0,
            hoverRadius: 6,
            backgroundColor: '#22c55e',
        },
        line: {
            borderWidth: 2,
        }
    }
  };
  
    const enhancedData = {
    ...data,
    datasets: data.datasets.map((ds: any, index: number) => ({
      ...ds,
      borderColor: index === 0 ? '#22c55e' : '#f97316',
      backgroundColor: index === 0 ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
      tension: 0.4,
      fill: index === 0,
    })),
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Line options={options} data={enhancedData} />
      </CardContent>
    </Card>
  );
}
