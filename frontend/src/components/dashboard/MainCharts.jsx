import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

//reusable component fot mini charts 
const SingleChart = ({ data, dataKey, color, title }) => (
  <div style={{ 
    backgroundColor: 'var(--bg-card)', 
    padding: '20px', 
    borderRadius: '16px', 
    border: '1px solid var(--border-color)', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {title}
    </h3>
    
    <div style={{ width: '100%', height: '220px', flexGrow: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color_${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
          <XAxis dataKey="week" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color_${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

//main component that renders all 3 side by side 
export default function MainCharts({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        No chart data available for this period.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
      <SingleChart data={chartData} dataKey="followers" color="#EC4899" title="Follower Growth" />
      <SingleChart data={chartData} dataKey="likes" color="#10B981" title="Interactions & Likes" />
      <SingleChart data={chartData} dataKey="comments" color="#8B5CF6" title="Profile Visits" />
    </div>
  );
}