import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartData } from '../../types/dashboard';

interface DistributionChartProps {
  data: ChartData[];
  title: string;
  badgeText?: string;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  title,
  badgeText = "By Category"
}) => {
  const total = data.reduce((sum, dataItem) => sum + dataItem.value, 0);

  return (
    <div id="distribution-chart-card" className="bg-white rounded-lg p-4 shadow-sm" data-testid="distribution-chart-widget">
      <div id="distribution-chart-header" className="flex justify-between items-center mb-5" data-testid="distribution-chart-header-section">
        <h4 id="distribution-chart-title" className="text-base font-semibold text-gray-900" data-testid="distribution-chart-section-title">{title}</h4>
        <div id="distribution-chart-badge" className="bg-primary-background text-white text-sm px-2 py-1 rounded-md" data-testid="distribution-chart-category-badge">{badgeText}</div>
      </div>

      <hr id="distribution-chart-separator" className="border-gray-200 mb-5" data-testid="distribution-chart-header-separator" />

      <div id="distribution-chart-content" className="flex flex-col items-center justify-center" data-testid="distribution-chart-content-wrapper">
        {/* Chart Container */}
        <div id="distribution-chart-container" className="flex-shrink-0 mx-auto" style={{ width: '200px', height: '160px', position: 'relative' }} data-testid="distribution-pie-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ outline: 'none', zIndex: 100 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const item = payload[0] as { name?: string; value?: number; payload?: { color?: string }; color?: string };
                    const name = item.name || 'Unknown';
                    const value = item.value || 0;
                    const color = (item?.payload?.color as string) || (item.color as string) || '#13426B';
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                    return (
                      <div
                        style={{
                          background: '#fff',
                          border: `1px solid ${color}`,
                          borderRadius: '8px',
                          padding: '8px 10px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          zIndex: 100
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 9999, background: color }} />
                          <span style={{ fontSize: 14, color: '#111827', fontWeight: 600 }}>{name}</span>
                        </div>
                        <div style={{ fontSize: 14, color: '#4B5563', marginTop: 4 }}>{value} ({percentage}%)</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label showing total */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <div className="text-4xl font-bold text-primary-background">
              {total}
            </div>
            <div className="text-sm text-gray-500">
              Total
            </div>
          </div>
        </div>

        {/* Legend Container - Separate from chart */}
        <div className="w-full mt-3 flex justify-center">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionChart;
