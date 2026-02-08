'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { ArrowUp, ArrowDown, DollarSign, Users, Activity, BarChart as BarChartIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { KPI } from '@/types';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      kpis {
        id
        label
        value
        trend
        trendDirection
      }
      sales {
        labels
        datasets {
          label
          data
        }
      }
      traffic {
        labels
        datasets {
          label
          data
        }
      }
    }
  }
`;

const ICONS = {
    'Total Sales': DollarSign,
    'Total Earnings': BarChartIcon, 
    'Active Subscribers': Users,
    'Total Traffic': Activity,
    'Total Orders': Activity,
    'Total Products': BarChartIcon,
    'Avg Order Value': DollarSign
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { data, loading: dataLoading, error } = useQuery<{ dashboardStats: { kpis: KPI[], sales: any, traffic: any } }>(GET_DASHBOARD_STATS);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'manager') {
        router.replace('/products');
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'manager') return null;

  if (dataLoading || !data?.dashboardStats) {
     return (
        <div className="flex h-[50vh] items-center justify-center">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
         </h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.dashboardStats.kpis.map((kpi: KPI) => {
          const Icon = ICONS[kpi.label as keyof typeof ICONS] || Activity;
          return (
            <Card key={kpi.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
                <div className="flex items-center text-xs mt-1">
                    <span className={clsx(
                        "flex items-center font-medium",
                        kpi.trendDirection === 'up' ? "text-emerald-500" : "text-rose-500"
                    )}>
                        {kpi.trendDirection === 'up' ? <ArrowUp className="h-3 w-3 mr-0.5"/> : <ArrowDown className="h-3 w-3 mr-0.5"/>}
                        {kpi.trend}%
                    </span>
                    <span className="text-muted-foreground ml-2">from last month</span>
                </div>
                </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4">
            <BarChart title="Monthly Sales" data={data.dashboardStats.sales} />
        </div>
        <div className="col-span-3">
             <LineChart title="Newsletter Subscribers" data={data.dashboardStats.traffic} />
        </div>
      </div>
    </div>
  );
}
