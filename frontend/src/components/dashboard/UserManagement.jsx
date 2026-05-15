import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Edit2, Trash2, Shield, User, X, CheckCircle, Mail, Lock, Type } from 'lucide-react';

export default function UserManagement({ onActivity }) {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', role: 'user', password: '' });

  //components loads-fetch data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("Failed to connect to database.");
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: null, name: '', email: '', role: 'user', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (users.length === 1) return alert("You cannot delete the last user!");
    
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
        showToast("User deleted successfully.");
        
        //logs- deletion 
        if (onActivity) onActivity('team', 'User Access Revoked', `An account was permanently removed from the system.`, 'info');
        
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return alert("Please fill all fields!");
    }

    try {
      if (modalMode === 'add') {
        const response = await axios.post('http://localhost:5000/api/users', formData);
        setUsers([...users, response.data]);
        showToast("New user created successfully.");
        
        //logs- creation
        if (onActivity) onActivity('team', 'New User Registered', `Granted ${formData.role} access to ${formData.name} (${formData.email}).`, 'success');
        
      } else {
        const response = await axios.put(`http://localhost:5000/api/users/${formData.id}`, formData);
        setUsers(users.map(u => (u.id === formData.id ? response.data : u)));
        showToast("User updated successfully.");
        
        //logs- updates
        if (onActivity) onActivity('team', 'User Profile Updated', `Modified access details for ${formData.name}.`, 'info');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.response?.data?.error || "Failed to save user.");
    }
  };

  //sepatate user by roles
  const admins = users.filter(u => u.role === 'admin');
  const standardUsers = users.filter(u => u.role === 'user');

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', width: '100%' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="var(--accent-primary)" /> Team Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Manage system administrators and standard client viewers separately.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          style={{ padding: '10px 20px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* admin table */}
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={20} color="var(--accent-primary)" /> Administrators
      </h3>
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card)', overflow: 'hidden', marginBottom: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(112, 82, 255, 0.05)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>User Details</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Password</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</div>
                </td>
                <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {user.password}
                </td>
                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                  <button onClick={() => openEditModal(user)} title="Edit User" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px', marginRight: '10px' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(user.id)} title="Delete User" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* user table */}
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <User size={20} color="#10B981" /> Standard Users
      </h3>
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>User Details</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Password</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {standardUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</div>
                </td>
                <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {user.password}
                </td>
                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                  <button onClick={() => openEditModal(user)} title="Edit User" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px', marginRight: '10px' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(user.id)} title="Delete User" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {standardUsers.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No standard users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* add edit model */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="animation-slideDown" style={{ backgroundColor: '#FFFFFF', padding: '35px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', position: 'relative' }}>
            
            {/* close icons */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '5px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ color: '#1F2937', margin: '0 0 25px 0', fontSize: '1.4rem', fontWeight: 'bold' }}>
              {modalMode === 'add' ? 'Add New User' : 'Edit User Details'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* full name */}
              <div>
                <label style={{ display: 'block', color: '#8B94A6', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <Type size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="E.g., Jane Doe" style={{ width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#1F2937', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* email address */}
              <div>
                <label style={{ display: 'block', color: '#8B94A6', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@company.com" style={{ width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#1F2937', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* password */}
              <div>
                <label style={{ display: 'block', color: '#8B94A6', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Enter secure password" style={{ width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#1F2937', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* account role */}
              <div>
                <label style={{ display: 'block', color: '#8B94A6', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Account Role</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {/* User Toggle */}
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: `1px solid ${formData.role === 'user' ? '#7052FF' : '#E5E7EB'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: '#FFFFFF' }}>
                    <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={() => setFormData({...formData, role: 'user'})} style={{ accentColor: '#7052FF', width: '16px', height: '16px', margin: 0 }} />
                    <User size={18} color={formData.role === 'user' ? '#1F2937' : '#9CA3AF'} /> 
                    <span style={{ color: '#1F2937', fontSize: '0.95rem', fontWeight: '500' }}>User</span>
                  </label>
                  
                  {/* admin toggle */}
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: `1px solid ${formData.role === 'admin' ? '#7052FF' : '#E5E7EB'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: '#FFFFFF' }}>
                    <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={() => setFormData({...formData, role: 'admin'})} style={{ accentColor: '#7052FF', width: '16px', height: '16px', margin: 0 }} />
                    <Shield size={18} color={formData.role === 'admin' ? '#1F2937' : '#9CA3AF'} /> 
                    <span style={{ color: '#1F2937', fontSize: '0.95rem', fontWeight: '500' }}>Admin</span>
                  </label>
                </div>
              </div>

              {/*submit button */}
              <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#7052FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>
                {modalMode === 'add' ? 'Create Account' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* tost notification */}
      {toast && (
        <div className="toast-container">
          <span style={{ fontWeight: '600' }}><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }}/> Success!</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{toast}</span>
          <div className="toast-progress"></div>
        </div>
      )}
    </div>
  );
}