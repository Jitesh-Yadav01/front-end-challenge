'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  data: any;
}

export function BarChart({ title, data }: BarChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
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
    layout: {
        padding: 0
    },
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
  };

  const enhancedData = {
    ...data,
    datasets: data.datasets.map((ds: any) => ({
      ...ds,
      backgroundColor: '#3b82f6',
      borderRadius: 4,
      barThickness: 24,
      hoverBackgroundColor: '#2563eb',
    })),
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Bar options={options} data={enhancedData} />
      </CardContent>
    </Card>
  );
}
