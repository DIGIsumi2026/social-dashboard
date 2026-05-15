import React from 'react';
import { LayoutDashboard, UploadCloud, Activity, Settings, Menu, MonitorPlay, Clock, Shield, User, Users } from 'lucide-react';
export default function Sidebar({ isCollapsed, setIsCollapsed, currentPage, setCurrentPage }) {
  //live time stamp
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
          <div className={`nav-item ${currentPage === 'upload' ? 'active' : ''}`} onClick={() => setCurrentPage('upload')}>
            <UploadCloud size={20} /><span>Upload Files</span>
          </div>
          
        <div className={`nav-item ${currentPage === 'activity' ? 'active' : ''}`} onClick={() => setCurrentPage('activity')}>
            <Activity size={20} /><span>Activity</span>
          </div>          
          
          <div className={`nav-item ${currentPage === 'users' ? 'active' : ''}`} onClick={() => setCurrentPage('users')}>
             <Users size={20} /><span>Team</span>
           </div>
          
          <div className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => setCurrentPage('settings')}>
            <Settings size={20} /><span>Settings</span>
          </div>
        </div>
      </div>

      {/* data health time stamp */}
      {!isCollapsed && (
        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>
            <Clock size={14} /> Last Data Sync
          </div>
          <div style={{ color: '#4ADE80', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px' }}>
            Today, {syncTime}
          </div>
        </div>
      )}
    </div>
  );
}