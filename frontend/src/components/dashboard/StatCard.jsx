import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react'; 

export default function StatCard({ title, targetNumber, delta = 0 }) {
  const [count, setCount] = useState(0);

  //pastel colors
  const randomColor = useMemo(() => {
    const pastelTints = [
      'rgba(56, 189, 248, 0.1)', 'rgba(167, 139, 250, 0.1)', 
      'rgba(52, 211, 153, 0.1)', 'rgba(251, 146, 60, 0.1)', 'rgba(244, 114, 182, 0.1)'
    ];
    return pastelTints[Math.floor(Math.random() * pastelTints.length)];
  }, []);

  //counting animation
  useEffect(() => {
    let start = 0;
    const duration = 1500; 
    const increment = targetNumber / (duration / 16); 

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetNumber]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    return num.toLocaleString();
  };

  //determine the growth is positive or negative
  const isPositive = delta >= 0;

  return (
    <div 
      className="stat-card" 
      style={{
        backgroundColor: 'var(--bg-card)',
        backgroundImage: `linear-gradient(${randomColor}, ${randomColor})`,
        padding: '24px',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        border: `1px solid ${randomColor.replace('0.1', '0.3')}`,
        cursor: 'default'
      }}
    >
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h3>
      
      {/* Wrapper to put the number and the percentage pill side-by-side */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: '800', lineHeight: 1 }}>
          {formatNumber(count)}
        </h2>
        
        {/*delta percentage indicator*/}
        {delta !== 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            color: isPositive ? '#4ADE80' : '#EF4444', 
            backgroundColor: isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            padding: '4px 8px', 
            borderRadius: '20px', 
            fontSize: '0.85rem', 
            fontWeight: 'bold', 
            marginBottom: '4px' 
          }}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
    </div>
  );
}