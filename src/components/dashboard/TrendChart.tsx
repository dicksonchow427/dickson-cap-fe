import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendData } from '../../types/dashboard';

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
        <div id="trend-chart-period-badge" className="bg-[#13426B] text-white text-sm px-2 py-1 rounded-md" data-testid="trend-chart-period-indicator">8 Months</div>
      </div>
      <hr id="trend-chart-separator" className="border-gray-200 mb-5" data-testid="trend-chart-header-separator" />

      <div id="trend-chart-container" className="mb-3" style={{ width: '100%', height: '150px' }} data-testid="trend-area-chart-container">
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
            <Tooltip />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#b3b3b3' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#b3b3b3' }}
            />
            <Area
              type="monotone"
              dataKey="received"
              stackId="1"
              stroke="#1e40af"
              fill="#1e40af"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="given"
              stackId="1"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Trend Legend with current values */}
      <div id="trend-chart-legend" className="flex justify-between text-sm" data-testid="trend-chart-legend-container">
        <div id="trend-legend-received" className="flex items-center space-x-2" data-testid="trend-legend-received-section">
          <div id="trend-legend-received-color" className="w-3 h-3 rounded-full bg-[#13426B]" data-testid="trend-legend-received-color-indicator" />
          <span id="trend-legend-received-text" className="text-sm text-gray-600" data-testid="trend-legend-received-text-label">Received ({currentReceived})</span>
        </div>
        <div id="trend-legend-given" className="flex items-center space-x-2" data-testid="trend-legend-given-section">
          <div id="trend-legend-given-color" className="w-3 h-3 rounded-full bg-green-600" data-testid="trend-legend-given-color-indicator" />
          <span id="trend-legend-given-text" className="text-sm text-gray-600" data-testid="trend-legend-given-text-label">Given ({currentGiven})</span>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;