import React, { useState, useEffect } from 'react';
import { Plus, Calendar, X, Users } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';

import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

export default function FilterBar({ 
  accounts, setAccounts,
  selectedCompany, setSelectedCompany, 
  selectedPlatform, setSelectedPlatform,
  dateRange, setDateRange 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyPlatforms, setNewCompanyPlatforms] = useState([]);
  const [newCompanyFollowers, setNewCompanyFollowers] = useState(''); 

  const activeAccount = accounts.find(acc => acc.name === selectedCompany) || accounts[0];

  useEffect(() => {
    if (!activeAccount.platforms.includes(selectedPlatform)) {
      setSelectedPlatform(activeAccount.platforms[0]);
    }
  }, [selectedCompany, activeAccount, selectedPlatform, setSelectedPlatform]);

  const handleAddAccount = () => {
    //failsafe in case a non-admin somehow triggers this
    if (!setAccounts || !newCompanyName || newCompanyPlatforms.length === 0) return;
    
    setAccounts([...accounts, { 
      name: newCompanyName, 
      platforms: newCompanyPlatforms,
      baselineFollowers: parseInt(newCompanyFollowers) || 0 
    }]);
    
    setSelectedCompany(newCompanyName); 
    setSelectedPlatform(newCompanyPlatforms[0]); 
    setShowAddModal(false);
    
    setNewCompanyName('');
    setNewCompanyPlatforms([]);
    setNewCompanyFollowers('');
  };

  const togglePlatform = (platform) => {
    if (newCompanyPlatforms.includes(platform)) {
      setNewCompanyPlatforms(newCompanyPlatforms.filter(p => p !== platform));
    } else {
      setNewCompanyPlatforms([...newCompanyPlatforms, platform]);
    }
  };

  const renderIcon = (platform, size = 24) => {
    switch (platform) {
      case 'Facebook': return <FaFacebook size={size} />;
      case 'Instagram': return <FaInstagram size={size} />;
      case 'LinkedIn': return <FaLinkedin size={size} />;
      case 'TikTok': return <FaTiktok size={size} />;
      case 'YouTube': return <FaYoutube size={size} />;
      default: return null;
    }
  };

  const formattedStartDate = format(dateRange[0].startDate, 'MMM d');
  const formattedEndDate = format(dateRange[0].endDate, 'MMM d');

  return (
    <div className="filter-bar">
      
      {/* conditional render for the admmin*/}
      {setAccounts && showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--text-primary)' }}>Add New Account</h3>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Company / Account Name</label>
            <input type="text" className="custom-input" placeholder="e.g., Sumathi Universal" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} />

            <label style={{ display: 'block', margin: '15px 0 8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Baseline Followers (Fallback)</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="number" className="custom-input" style={{ paddingLeft: '40px' }} placeholder="e.g., 15000" value={newCompanyFollowers} onChange={(e) => setNewCompanyFollowers(e.target.value)} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Used if the CSV export does not include a follower count.</p>

            <label style={{ display: 'block', margin: '15px 0 8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Select Active Platforms</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
              {['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'].map(plat => (
                <div key={plat} className={`platform-toggle ${newCompanyPlatforms.includes(plat) ? 'selected' : ''}`} onClick={() => togglePlatform(plat)}>
                  {renderIcon(plat, 18)} {plat}
                </div>
              ))}
            </div>

            <button className="primary-btn" onClick={handleAddAccount}>Save Account</button>
          </div>
        </div>
      )}

      {/* conditional render add account (for admin)*/}
      <div className="filter-group">
        <select className="custom-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
          {accounts.map((acc, index) => <option key={index} value={acc.name}>{acc.name}</option>)}
        </select>
        
        {/* setAccounts exists (Admin), render the button. if not (User), hide*/}
        {setAccounts && (
          <button className="icon-btn" style={{ border: '1px solid var(--border-color)' }} title="Add Account" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
          </button>
        )}
      </div>

      <div className="social-tabs">
        {activeAccount.platforms.map(platform => (
          <div key={platform} className={`social-tab ${selectedPlatform === platform ? 'active' : ''}`} onClick={() => setSelectedPlatform(platform)} title={platform}>
            {renderIcon(platform)}
          </div>
        ))}
      </div>

      <div className="dropdown-container" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border-color)', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', backgroundColor: showCalendar ? 'var(--accent-light)' : 'transparent' }} onClick={() => setShowCalendar(!showCalendar)}>
          <Calendar size={18} color="var(--accent-primary)" />
          <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{formattedStartDate} - {formattedEndDate}</span>
        </div>

        {showCalendar && (
          <>
            <div onClick={() => setShowCalendar(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', backgroundColor: 'rgba(0, 0, 0, 0.05)', zIndex: 998 }} />
            <div className="calendar-popover" style={{ position: 'absolute', top: '120%', right: 0, padding: '0', width: 'auto', overflow: 'hidden', zIndex: 999, backgroundColor: 'var(--bg-card)', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Select Date Range</span>
                <button onClick={() => setShowCalendar(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '4px' }}><X size={18} /></button>
              </div>
              <DateRange editableDateInputs={true} onChange={item => setDateRange([item.selection])} moveRangeOnFirstSelection={false} ranges={dateRange} rangeColors={['var(--accent-primary)']} />
              <div style={{ padding: '15px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                <button className="primary-btn" style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }} onClick={() => setShowCalendar(false)}>Apply Date Filter</button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}