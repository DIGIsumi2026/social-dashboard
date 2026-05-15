import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';

export default function UserSettings() {
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

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-primary', accentColor);
  }, [accentColor]);

  const colorSwatches = [
    { name: 'Purple (Default)', hex: '#7052FF' }, { name: 'Emerald', hex: '#10B981' },
    { name: 'Ocean Blue', hex: '#0EA5E9' }, { name: 'Sunset Orange', hex: '#F97316' }, { name: 'Rose', hex: '#F43F5E' }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', width: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '5px' }}>My Preferences</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Customize your dashboard viewing experience.</p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card)', padding: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
          <Palette size={20} color="var(--accent-primary)" /> Appearance Settings
        </h3>
        
        <div style={{ marginBottom: '35px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '15px' }}>Personal Accent Color</label>
          <div style={{ display: 'flex', gap: '15px' }}>
            {colorSwatches.map(color => (
              <button 
                key={color.hex} onClick={() => setAccentColor(color.hex)} title={color.name} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: color.hex, border: accentColor === color.hex ? '3px solid white' : 'none', outline: accentColor === color.hex ? `2px solid ${color.hex}` : 'none', cursor: 'pointer', transition: 'transform 0.2s' }} 
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
              />
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '15px' }}>Interface Theme</label>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => setTheme('light')} style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', backgroundColor: theme === 'light' ? 'rgba(112, 82, 255, 0.1)' : 'var(--bg-main)', border: `2px solid ${theme === 'light' ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600' }}>
              <Sun size={28} color={theme === 'light' ? 'var(--accent-primary)' : 'var(--text-secondary)'} /> Light Mode
            </button>
            <button onClick={() => setTheme('dark')} style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', backgroundColor: theme === 'dark' ? 'rgba(112, 82, 255, 0.1)' : 'var(--bg-main)', border: `2px solid ${theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600' }}>
              <Moon size={28} color={theme === 'dark' ? 'var(--accent-primary)' : 'var(--text-secondary)'} /> Dark Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}