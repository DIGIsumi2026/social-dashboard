import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#7052FF', '#4ADE80', '#38BDF8', '#FBBF24'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 15px', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
}

//accepts piedata
export default function ContentPieChart({ pieData = [] }) {
  const hasData = pieData && pieData.length > 0;

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-color)', height: '100%' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1.1rem' }}>Content Published</h3>
      <div style={{ width: '100%', height: '250px', position: 'relative' }}>
        
        {!hasData && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)', fontWeight: '500', zIndex: 10 }}>
            No Data Available
          </div>
        )}

        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={hasData ? pieData : [{ name: 'Empty', value: 100 }]}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              isAnimationActive={hasData}
            >
              {hasData 
                ? pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                : <Cell fill="var(--border-color)" opacity={0.3} /> //grey ring when empty
              }
            </Pie>
            {hasData && <Tooltip content={<CustomTooltip />} />}
            {hasData && <Legend verticalAlign="bottom" height={36} iconType="circle" />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}