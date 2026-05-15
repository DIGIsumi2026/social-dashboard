import React, { useState } from 'react';
import AdminApp from './AdminApp';
import UserApp from './UserApp';
import Login from './pages/Login'; 

export default function App() {
  //state track after successful login
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('auth') === 'true');
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);  

  const handleLogin = (assignedRole) => {
    setRole(assignedRole);
    setIsAuthenticated(true);
    //save to browser memory
    localStorage.setItem('auth', 'true');
    localStorage.setItem('role', assignedRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    //erase from browser memory
    localStorage.removeItem('auth');
    localStorage.removeItem('role');
  };

  //THE AUTHENTICATION WALL
  //not logged in, they only see the Login screen.
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  //THE ROUTER
  //Once logged in, route them to the correct dashboard
  return (
    <>
      {role === 'admin' ? <AdminApp onLogout={handleLogout} /> : <UserApp onLogout={handleLogout} />}
    </>
  );
}