import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendData } from '../../types/dashboard';
import { CHART_COLORS } from '../../constants/badgeColors';

interface TrendChartProps {
  data: TrendData[];
  currentReceived: number;
  currentGiven: number;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  currentReceived,
  currentGiven
}) => {
  return (
    <div id="trend-chart-card" className="bg-white rounded-lg p-4 shadow-sm" data-testid="trend-chart-widget">
      <div id="trend-chart-header" className="flex justify-between items-center mb-5" data-testid="trend-chart-header-section">
        <h4 id="trend-chart-title" className="text-base font-semibold text-gray-900" data-testid="trend-chart-section-title">Recognition Trend</h4>
        <div id="trend-chart-period-badge" className="bg-primary-background text-white text-sm px-2 py-1 rounded-md" data-testid="trend-chart-period-indicator">8 Months</div>
      </div>
      <hr id="trend-chart-separator" className="border-gray-200 mb-5" data-testid="trend-chart-header-separator" />

      <div id="trend-chart-container" className="mb-3" style={{ width: '100%', height: '180px' }} data-testid="trend-area-chart-container">
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorGiven" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px', color: '#111827' }}
              itemStyle={{ fontSize: '14px', color: '#4b5563' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }}
              iconType="square"
              iconSize={12}
              formatter={(value) => {
                const label = value === 'received' ? 'Received' : 'Given';
                const count = value === 'received' ? currentReceived : currentGiven;
                return `${label} (${count})`;
              }}
              style={{ fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="received"
              stackId="1"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              fill="url(#colorReceived)"
              name="received"
            />
            <Area
              type="monotone"
              dataKey="given"
              stackId="1"
              stroke={CHART_COLORS[1]}
              strokeWidth={2}
              fill="url(#colorGiven)"
              name="given"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default TrendChart;