import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns'; 
import { X, PlayCircle, PauseCircle, ChevronLeft, ChevronRight, Play, Lightbulb } from 'lucide-react'; 
import './App.css'; 
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import FilterBar from './components/dashboard/FilterBar';
import StatGrid from './components/dashboard/StatGrid';
import MainCharts from './components/dashboard/MainCharts';
import ContentPieChart from './components/dashboard/ContentPieChart';
import DataUploader from './components/DataUploader'; 
import ActivityFeed from './components/dashboard/ActivityFeed'; 
import UserManagement from './components/dashboard/UserManagement';
import Settings from './pages/Settings';

function InsightsBanner({ platform }) {
  return (
    <div style={{ backgroundColor: 'rgba(112, 82, 255, 0.1)', border: '1px solid var(--accent-primary)', padding: '15px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', animation: 'slideDown 0.4s ease' }}>
      <div style={{ backgroundColor: 'var(--accent-primary)', padding: '8px', borderRadius: '50%', color: 'white' }}><Lightbulb size={20} /></div>
      <div>
        <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold', margin: 0, fontSize: '0.9rem' }}>AI Performance Insight</p>
        <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem' }}>
          <strong>{platform} Interactions</strong> are up significantly this period. Consider increasing short-form video content to capitalize on the algorithm boost.
        </p>
      </div>
    </div>
  );
}

//log out pop
export default function AdminApp({ onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [accounts, setAccounts] = useState([
    { name: 'Sumathi Universal', platforms: ['Facebook', 'Instagram', 'LinkedIn'] },
    { name: 'Sumathi Ventures', platforms: ['Facebook', 'Instagram', 'LinkedIn'] },
    { name: 'Octagon Engineering', platforms: ['Facebook', 'Instagram', 'LinkedIn'] }
  ]);

  const [selectedCompany, setSelectedCompany] = useState(accounts[0].name);
  const [selectedPlatform, setSelectedPlatform] = useState(accounts[0].platforms[0]);
  const [dateRange, setDateRange] = useState([{ startDate: new Date(new Date().setDate(new Date().getDate() - 30)), endDate: new Date(), key: 'selection' }]);
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [deltas, setDeltas] = useState({ views: 0, visits: 0, viewers: 0, followers: 0, interactions: 0 });

  //state to local storage 
  const [activities, setActivities] = useState(() => {
    const savedLogs = localStorage.getItem('dashboard_activities');
    if (savedLogs) return JSON.parse(savedLogs);
    //default feeback log
    return [
      { id: Date.now(), type: 'system', title: 'System Initialized', desc: 'Dashboard tracking services are online.', time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), user: 'System Agent', status: 'info' }
    ];
  });

  // auto save logs on change
  useEffect(() => {
    localStorage.setItem('dashboard_activities', JSON.stringify(activities));
  }, [activities]);

  //logger function
  const logActivity = (type, title, desc, status = 'info') => {
    const newLog = {
      id: Date.now(),
      type,
      title,
      desc,
      time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user: 'Admin User',
      status
    };
    //log out top
    setActivities(prevLogs => [newLog, ...prevLogs].slice(0, 50)); 
  };;

  const handleUploadSuccess = (uploadedCompany, uploadedPlatform, uploadedMetric) => {
    const newActivity = {
      id: Date.now(),
      type: 'upload',
      title: 'Data Upload Successful',
      desc: `Raw CSV data for ${uploadedPlatform} ${uploadedMetric} was securely uploaded to ${uploadedCompany}'s database.`,
      time: 'Just now',
      user: 'Admin User', 
      status: 'success'
    };
    setActivities([newActivity, ...activities]);
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    setIsFetching(true); 
    try {
      const start = format(dateRange[0].startDate, 'yyyy-MM-dd');
      const end = format(dateRange[0].endDate, 'yyyy-MM-dd');
      const queryParams = `?company=${selectedCompany}&platform=${selectedPlatform}&startDate=${start}&endDate=${end}`;
      
      const totalsRes = await axios.get(`http://localhost:5000/api/upload/totals${queryParams}`);
      const chartsRes = await axios.get(`http://localhost:5000/api/upload/charts${queryParams}`);
      const pieRes = await axios.get(`http://localhost:5000/api/upload/pie${queryParams}`); 
      
      setDashboardData({
        views: parseInt(totalsRes.data.total_views) || 0,
        visits: parseInt(totalsRes.data.total_visits) || 0,
        viewers: parseInt(totalsRes.data.total_viewers) || 0,
        followers: parseInt(totalsRes.data.followers) || 0,
        interactions: parseInt(totalsRes.data.interactions) || 0
      });
      setChartData(chartsRes.data); 
      setPieData(pieRes.data);
      
      if (totalsRes.data.deltas) {
        setDeltas(totalsRes.data.deltas);
      } else {
        setDeltas({ views: 0, visits: 0, viewers: 0, followers: 0, interactions: 0 });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => setIsFetching(false), 400); 
    }
  };

  useEffect(() => {
    const currentAccountExists = accounts.find(acc => acc.name === selectedCompany);
    if (!currentAccountExists) {
        setSelectedCompany(accounts[0].name);
        setSelectedPlatform(accounts[0].platforms[0]);
    }
  }, [accounts]);

  useEffect(() => { fetchDashboardData(); }, [selectedCompany, selectedPlatform, dateRange]);

  const handleNextSlide = () => {
    const currentAccount = accounts.find(acc => acc.name === selectedCompany);
    if (!currentAccount) return;
    const currentPlatformIndex = currentAccount.platforms.indexOf(selectedPlatform);
    if (currentPlatformIndex < currentAccount.platforms.length - 1) setSelectedPlatform(currentAccount.platforms[currentPlatformIndex + 1]);
    else {
      const nextAccount = accounts[(accounts.findIndex(acc => acc.name === selectedCompany) + 1) % accounts.length];
      setSelectedCompany(nextAccount.name); setSelectedPlatform(nextAccount.platforms[0]); 
    }
  };

  const handlePrevSlide = () => {
    const currentAccount = accounts.find(acc => acc.name === selectedCompany);
    if (!currentAccount) return;
    const currentPlatformIndex = currentAccount.platforms.indexOf(selectedPlatform);
    if (currentPlatformIndex > 0) setSelectedPlatform(currentAccount.platforms[currentPlatformIndex - 1]);
    else {
      const prevAccount = accounts[(accounts.findIndex(acc => acc.name === selectedCompany) - 1 + accounts.length) % accounts.length];
      setSelectedCompany(prevAccount.name); setSelectedPlatform(prevAccount.platforms[prevAccount.platforms.length - 1]); 
    }
  };

  useEffect(() => {
    let interval;
    if (currentPage === 'present') {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
      if (isPlaying) interval = setInterval(handleNextSlide, 10000); 
    } else {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsPlaying(true); 
    }
    return () => clearInterval(interval);
  }, [currentPage, selectedCompany, selectedPlatform, accounts, isPlaying]);

  useEffect(() => {
    const handleFsChange = () => { if (!document.fullscreenElement && currentPage === 'present') setCurrentPage('dashboard'); };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [currentPage]);

  const dashboardDataWithDeltas = dashboardData ? { ...dashboardData, deltas } : null;

  return (
    <div className={`app-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="main-content">
        {/* pass the role and on Logout prop down to header */}
        {currentPage !== 'present' && <Header role="admin" onLogout={onLogout} />}
        
        <main className="content-area">
          {currentPage === 'dashboard' ? (
            <div className="dashboard-page page-transition" style={{ position: 'relative' }}>
              {isFetching && ( <div className="loading-overlay"><div className="spinner"></div></div> )}
              <FilterBar accounts={accounts} setAccounts={setAccounts} selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} dateRange={dateRange} setDateRange={setDateRange} />
              <InsightsBanner platform={selectedPlatform} />
              <StatGrid data={dashboardDataWithDeltas} />
              <MainCharts chartData={chartData} /> 
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                 <ContentPieChart pieData={pieData} />
              </div>
            </div>

          ) : currentPage === 'upload' ? (
            <div className="upload-page page-transition" style={{ padding: '20px' }}>
              <DataUploader onUploadSuccess={handleUploadSuccess} onBack={() => setCurrentPage('dashboard')} />
            </div>

          ) : currentPage === 'users' ? (
            <div className="users-page page-transition" style={{ padding: '20px' }}>
              <UserManagement onActivity={logActivity} /> 
            </div>

          ) : currentPage === 'activity' ? (
            <div className="activity-page page-transition" style={{ padding: '20px' }}>
              <ActivityFeed activities={activities} />
            </div>
            
          ) : currentPage === 'settings' ? (
            <div className="settings-page page-transition" style={{ padding: '20px' }}>
              <Settings accounts={accounts} setAccounts={setAccounts} />
            </div>

          ) : (
            <div className="presentation-container">
              <div className="presentation-header" style={{ position: 'relative' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><PlayCircle size={32} color="var(--accent-primary)" /><h1 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', margin: 0 }}>{selectedCompany}</h1></div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '5px', fontWeight: '500' }}>Live Analytics • {selectedPlatform}</p>
                </div>
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'var(--bg-card)', padding: '8px 20px', borderRadius: '50px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)', zIndex: 10 }}>
                  <button className="icon-btn" style={{ color: 'var(--text-primary)' }} onClick={handlePrevSlide}><ChevronLeft size={24} /></button>
                  <button className="icon-btn" style={{ color: 'var(--accent-primary)' }} onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <PauseCircle size={32} /> : <Play size={32} fill="currentColor" />}</button>
                  <button className="icon-btn" style={{ color: 'var(--text-primary)' }} onClick={handleNextSlide}><ChevronRight size={24} /></button>
                </div>
                <button onClick={() => setCurrentPage('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'transparent', color: '#EF4444', border: '2px solid #EF4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s', zIndex: 10 }}><X size={20} /> Exit Presentation</button>
              </div>
              <div key={`${selectedCompany}-${selectedPlatform}`} className="presentation-content"><StatGrid data={dashboardDataWithDeltas} /><MainCharts chartData={chartData} /></div>
              <div className="progress-bar-container"><div key={`progress-${selectedCompany}-${selectedPlatform}`} className="progress-bar-fill animate-progress" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}></div></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}