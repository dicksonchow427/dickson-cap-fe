import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartData } from '../../types/dashboard';

interface DistributionChartProps {
  data: ChartData[];
  title?: string;
  badgeText?: string;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ 
  data, 
  title = "Recognition Distribution", 
  badgeText = "By Category" 
}) => {
  const total = data.reduce((sum, dataItem) => sum + dataItem.value, 0);

  return (
    <div id="distribution-chart-card" className="bg-white rounded-lg p-4 shadow-sm" data-testid="distribution-chart-widget">
      <div id="distribution-chart-header" className="flex justify-between items-center mb-4" data-testid="distribution-chart-header-section">
        <h4 id="distribution-chart-title" className="text-lg font-semibold text-gray-900" data-testid="distribution-chart-section-title">{title}</h4>
        <div id="distribution-chart-badge" className="bg-[#13426B] text-white text-base px-2 py-1 rounded-md" data-testid="distribution-chart-category-badge">{badgeText}</div>
      </div>

      <hr id="distribution-chart-separator" className="border-gray-200 mb-4" data-testid="distribution-chart-header-separator" />

      <div id="distribution-chart-content" className="flex items-center justify-center" data-testid="distribution-chart-content-wrapper">
        {/* Chart Container */}
        <div id="distribution-chart-container" className="flex-shrink-0 mx-auto" style={{ width: '180px', height: '180px' }} data-testid="distribution-pie-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ outline: 'none' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const item: any = payload[0];
                    const name = item.name as string;
                    const value = item.value as number;
                    const color = (item?.payload?.color as string) || item.color;
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                    return (
                      <div
                        style={{
                          background: '#fff',
                          border: `1px solid ${color}`,
                          borderRadius: '8px',
                          padding: '6px 8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 9999, background: color }} />
                          <span style={{ fontSize: 12, color: '#111827', fontWeight: 600 }}>{name}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>{value} ({percentage}%)</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DistributionChart;