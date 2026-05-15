import React from 'react';
import { LayoutDashboard, Settings, Menu, MonitorPlay, Clock } from 'lucide-react'; 

export default function UserSidebar({ isCollapsed, setIsCollapsed, currentPage, setCurrentPage }) {
  const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      <div>
        <div className="sidebar-header">
          <img src="/logo.png" alt="Company Logo" className="brand-logo" />
          <button className="icon-btn toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            <Menu size={20} />
          </button>
        </div>
        
        <div className="nav-links">
          <div className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
            <LayoutDashboard size={20} /><span>Dashboard</span>
          </div>
          <div className={`nav-item ${currentPage === 'present' ? 'active' : ''}`} onClick={() => setCurrentPage('present')}>
            <MonitorPlay size={20} /><span>Present Mode</span>
          </div>
          <div className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => setCurrentPage('settings')}>
            <Settings size={20} /><span>Settings</span>
          </div>
        </div>
      </div>

      {/* data health- footer */}
      {!isCollapsed && (
        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>
              <Clock size={14} /> Last Data Sync
            </div>
            <div style={{ color: '#4ADE80', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>
              Today, {syncTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}