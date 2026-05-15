import React, { useState, useEffect } from 'react';
import { Palette, Briefcase, CheckCircle, Plus, Trash2, Moon, Sun } from 'lucide-react';

export default function Settings({ accounts, setAccounts }) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [toast, setToast] = useState(false);

  //apperance state
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });
  const [accentColor, setAccentColor] = useState(() => {
    const currentCSSColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
    return currentCSSColor || '#7052FF';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const colorSwatches = [
    { name: 'Purple (Default)', hex: '#7052FF' },
    { name: 'Emerald', hex: '#34C759' },
    { name: 'Ocean Blue', hex: '#0EA5E9' },
    { name: 'Sunset Orange', hex: '#F97316' },
    { name: 'Rose', hex: '#FFC107' }
  ];

  //dynamically changes the css 
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-primary', accentColor);
  }, [accentColor]);

  //portfolio state
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyPlatforms, setNewCompanyPlatforms] = useState({
    Facebook: true, Instagram: false, LinkedIn: false
  });

  const handleTogglePlatform = (platform) => {
    setNewCompanyPlatforms(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const handleAddCompany = () => {
    if (!newCompanyName.trim()) return;
    
    // convert the true/false object into an array of strings (e.g., ['Facebook', 'LinkedIn'])
    const platformsArray = Object.keys(newCompanyPlatforms).filter(key => newCompanyPlatforms[key]);
    
    if (platformsArray.length === 0) {
        alert("Please select at least one platform!");
        return;
    }

    // add to the master list
    setAccounts([...accounts, { name: newCompanyName, platforms: platformsArray }]);
    
    //reset form, show success
    setNewCompanyName('');
    setNewCompanyPlatforms({ Facebook: true, Instagram: false, LinkedIn: false });
    showToast();
  };

  const handleDeleteCompany = (companyName) => {
    if (accounts.length === 1) return alert("You must have at least one company!");
    setAccounts(accounts.filter(acc => acc.name !== companyName));
  };

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', width: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '5px' }}>Dashboard Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage your workspace appearance and corporate portfolio.</p>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* SETTINGS SIDEBAR */}
        <div style={{ width: '250px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card)', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('appearance')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', backgroundColor: activeTab === 'appearance' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'appearance' ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', textAlign: 'left' }}
          >
            <Palette size={20} /> Appearance
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', backgroundColor: activeTab === 'portfolio' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'portfolio' ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', textAlign: 'left' }}
          >
            <Briefcase size={20} /> Portfolio Manager
          </button>
        </div>

        {/*content area- settings*/}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card)', padding: '30px', minHeight: '500px' }}>
          
          {/*tab 1- apperance */}
          {activeTab === 'appearance' && (
            <div className="animation-fade-in">
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Appearance Preferences</h3>
              
              <div style={{ marginBottom: '35px' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '15px' }}>Brand Accent Color</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {colorSwatches.map(color => (
                    <button 
                      key={color.hex}
                      onClick={() => setAccentColor(color.hex)}
                      title={color.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: color.hex, border: accentColor === color.hex ? '3px solid white' : 'none', outline: accentColor === color.hex ? `2px solid ${color.hex}` : 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '15px' }}>Interface Theme</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => setTheme('light')} style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', backgroundColor: theme === 'light' ? 'rgba(112, 82, 255, 0.1)' : 'var(--bg-main)', border: `2px solid ${theme === 'light' ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600' }}>
                    <Sun size={28} color={theme === 'light' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                    Light Mode
                  </button>
                  <button onClick={() => setTheme('dark')} style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', backgroundColor: theme === 'dark' ? 'rgba(112, 82, 255, 0.1)' : 'var(--bg-main)', border: `2px solid ${theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600' }}>
                    <Moon size={28} color={theme === 'dark' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                    Dark Mode
                  </button>
                </div>
              </div>
            </div>
          )}

          {/*tab 2 portfolio */}
          {activeTab === 'portfolio' && (
            <div className="animation-fade-in">
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Portfolio Manager</h3>
              
              {/*add company form */}
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>Register New Entity</h4>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <input 
                    type="text" 
                    placeholder="E.g., Nexus Retail Group" 
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px', fontWeight: '500' }}>Active Platforms</p>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  {['Facebook', 'Instagram', 'LinkedIn'].map(platform => (
                    <label key={platform} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={newCompanyPlatforms[platform]}
                        onChange={() => handleTogglePlatform(platform)}
                        style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                      /> {platform}
                    </label>
                  ))}
                </div>

                <button onClick={handleAddCompany} style={{ padding: '10px 20px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={18} /> Add to Portfolio
                </button>
              </div>

              {/* active company list */}
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>Active Entities</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accounts.map(acc => (
                  <div key={acc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div>
                      <h4 style={{ color: 'var(--text-primary)', margin: '0 0 5px 0' }}>{acc.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{acc.platforms.join(' • ')}</p>
                    </div>
                    <button onClick={() => handleDeleteCompany(acc.name)} style={{ padding: '8px', backgroundColor: 'transparent', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* toast notification */}
      {toast && (
        <div className="toast-container">
          <span style={{ fontWeight: '600' }}><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }}/> Saved!</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Portfolio updated successfully.</span>
          <div className="toast-progress"></div>
        </div>
      )}
    </div>
  );
}