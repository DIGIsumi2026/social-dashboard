import React, { useState } from 'react';
import { UploadCloud, CheckCircle, RefreshCw, AlertTriangle, UserPlus } from 'lucide-react';

//for activities
export default function ActivityFeed({ activities = [] }) {
  const [filter, setFilter] = useState('all');

  const filteredActivities = activities.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getIcon = (type, status) => {
    if (type === 'upload' && status === 'success') return <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ADE80', padding: '12px', borderRadius: '50%' }}><UploadCloud size={24} /></div>;
    if (type === 'error') return <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px', borderRadius: '50%' }}><AlertTriangle size={24} /></div>;
    if (type === 'system') return <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', padding: '12px', borderRadius: '50%' }}><RefreshCw size={24} /></div>;
    if (type === 'team') return <div style={{ backgroundColor: 'rgba(167, 139, 250, 0.1)', color: '#A78BFA', padding: '12px', borderRadius: '50%' }}><UserPlus size={24} /></div>;
    return <CheckCircle size={24} />;
  };

  return (
    <div style={{ maxWidth: '850px', margin: '20px auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '5px' }}>Activity Log</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Track data uploads, system syncs, and team actions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', backgroundColor: 'var(--bg-card)', padding: '5px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {['all', 'upload', 'system', 'team'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize', border: 'none', backgroundColor: filter === f ? 'var(--accent-primary)' : 'transparent', color: filter === f ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="timeline-container">
        {filteredActivities.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>No activity found for this filter.</p>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="timeline-item">
              <div className="timeline-icon">{getIcon(activity.type, activity.status)}</div>
              <div className="timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', margin: 0 }}>{activity.title}</h3>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>{activity.time}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '15px', lineHeight: '1.5' }}>{activity.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>
                    {activity.user.charAt(0)}
                  </div>
                  {activity.user}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}