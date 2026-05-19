import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';

const IOSTraveller = (props) => {
  const { x, y, width, height, color } = props;
  const centerY = height / 2;

  return (
    <g transform={`translate(${x}, ${y})`} style={{ cursor: 'ew-resize', outline: 'none' }}>
      <rect x={-10} y={-15} width={width + 20} height={height + 30} fill="transparent" />
      
            <circle 
        cx={width / 2} 
        cy={centerY} 
        r={10} 
        fill="#ffffff" 
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={1}
        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.25))' }}
      />
            <circle 
        cx={width / 2} 
        cy={centerY} 
        r={3.5} 
        fill={color} 
      />
    </g>
  );
};

// reusable component for mini charts
const SingleChart = ({ data, dataKey, color, title, type = 'area' }) => (
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
    
    <div style={{ width: '100%', height: '340px', minHeight: '340px', flexGrow: 1 }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={340}>
        
        {type === 'bar' ? (
          
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
            <XAxis dataKey="week" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value} />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }} />
            
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
            
            <Brush 
              dataKey="week" 
              height={10}               
              stroke="transparent"      
              fill="rgba(0,0,0,0.06)"   
              tickFormatter={() => ''} 
              travellerWidth={16}
              traveller={(props) => <IOSTraveller {...props} color={color} />}
            />
          </BarChart>

        ) : (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
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
            
            <Brush 
              dataKey="week" 
              height={10}               
              stroke="transparent"      
              fill="rgba(0,0,0,0.06)"   
              tickFormatter={() => ''} 
              travellerWidth={16}
              traveller={(props) => <IOSTraveller {...props} color={color} />}
            />
          </AreaChart>
        )}
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

      <SingleChart data={chartData} dataKey="followers" color="#EC4899" title="Follower Growth" type="area" />
      <SingleChart data={chartData} dataKey="likes" color="#10B981" title="Interactions & Likes" type="bar" />
      <SingleChart data={chartData} dataKey="comments" color="#8B5CF6" title="Profile Visits" type="bar" />
    </div>
  );
}