import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Bar } from 'recharts';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChartProps = {
  processedData: Record<string, any>[];
  apexOptions: any;
  yAxes: string[];
  xAxis: string;
};

export const AdvancedCharts = ({ processedData, yAxes, xAxis }: ChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState(yAxes[0]);

  // Calculate growth rates
  const growthData = processedData.map((current, index, array) => {
    if (index === 0) return { ...current, growth: 0 };
    const previous = array[index - 1];
    const growth = ((current[selectedMetric] - previous[selectedMetric]) / previous[selectedMetric]) * 100;
    return { ...current, growth };
  });

  // Calculate moving averages for trend analysis
  const trendData = processedData.map((current, index, array) => {
    if (index < 2) return { ...current, trend: current[selectedMetric] };
    const threePeriodAvg = (array[index][selectedMetric] + 
                           array[index - 1][selectedMetric] + 
                           array[index - 2][selectedMetric]) / 3;
    return { ...current, trend: threePeriodAvg };
  });

  const chartColors = {
    primary: '#0EA5E9',    // Ocean Blue
    secondary: '#F97316',  // Bright Orange
    tertiary: '#8B5CF6',  // Vivid Purple
    background: '#F8FAFC', // Light Gray
    grid: '#E2E8F0'       // Soft Gray
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto bg-slate-100/80">
          <TabsTrigger value="trends" className="data-[state=active]:bg-white">Trend Analysis</TabsTrigger>
          <TabsTrigger value="comparative" className="data-[state=active]:bg-white">Comparative</TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-white">Growth & Profitability</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card className="p-6 backdrop-blur-sm bg-white/90 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Trend Analysis</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer>
                <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    {yAxes.map((axis, index) => (
                      <linearGradient key={axis} id={`gradient-${axis}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis 
                    dataKey={xAxis} 
                    tick={{ fill: '#475569' }}
                    stroke="#94A3B8"
                  />
                  <YAxis 
                    tick={{ fill: '#475569' }}
                    stroke="#94A3B8"
                    tickFormatter={(value) => `$${new Intl.NumberFormat('en-US').format(value)}`}
                  />
                  <Tooltip content={CustomTooltip} />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke={chartColors.primary} 
                    fill={`url(#gradient-${selectedMetric})`}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trend" 
                    stroke={chartColors.secondary}
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="comparative">
          <Card className="p-6 backdrop-blur-sm bg-white/90 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Comparative Analysis</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer>
                <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis 
                    dataKey={xAxis} 
                    tick={{ fill: '#475569' }}
                    stroke="#94A3B8"
                  />
                  <YAxis 
                    tick={{ fill: '#475569' }}
                    stroke="#94A3B8"
                    tickFormatter={(value) => `$${new Intl.NumberFormat('en-US').format(value)}`}
                  />
                  <Tooltip content={CustomTooltip} />
                  {yAxes.map((axis, index) => (
                    <Bar 
                      key={axis} 
                      dataKey={axis} 
                      fill={index === 0 ? chartColors.primary : index === 1 ? chartColors.secondary : chartColors.tertiary}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card className="p-6 backdrop-blur-sm bg-white/90 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Growth & Profitability</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer>
                <ComposedChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis 
                    dataKey={xAxis} 
                    tick={{ fill: '#475569' }}
                    stroke="#94A3B8"
                  />
                  <YAxis 
                    yAxisId="left" 
                    tick={{ fill: '#475569' }}
                    stroke="#94A3B8"
                    tickFormatter={(value) => `$${new Intl.NumberFormat('en-US').format(value)}`}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fill: '#475569' }}
                    stroke="#94A3B8"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={CustomTooltip} />
                  <Bar 
                    yAxisId="left" 
                    dataKey={selectedMetric} 
                    fill={chartColors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="growth" 
                    stroke={chartColors.secondary}
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
      <p className="font-semibold text-slate-700">{label}</p>
      {payload.map((item: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: item.color }}>
          {item.name}: {item.name === 'growth' 
            ? `${item.value.toFixed(2)}%`
            : `$${new Intl.NumberFormat('en-US').format(item.value)}`}
        </p>
      ))}
    </div>
  );
};