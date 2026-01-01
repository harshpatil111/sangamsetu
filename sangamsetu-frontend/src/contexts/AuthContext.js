import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      
      // Store token and user data
      localStorage.setItem('access_token', response.access);
      if (response.refresh) {
        localStorage.setItem('refresh_token', response.refresh);
      }
      
      // Store user data
      const userData = {
        id: response.user.id,
        username: response.user.username,
        role: response.user.role,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.',
      };
    }
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) {
      console.log('hasRole: No user or role', { user, requiredRole });
      return false;
    }
    
    // Normalize role to uppercase for comparison
    const userRole = String(user.role).toUpperCase();
    const required = String(requiredRole).toUpperCase();
    
    // Admin has access to everything
    if (userRole === 'ADMIN') return true;
    
    // Check specific role
    const result = userRole === required;
    console.log('hasRole check:', { userRole, required, result });
    return result;
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.role) {
      console.log('hasAnyRole: No user or role', { user, roles });
      return false;
    }
    
    // Normalize role to uppercase for comparison
    const userRole = String(user.role).toUpperCase();
    const normalizedRoles = roles.map(r => String(r).toUpperCase());
    const result = normalizedRoles.includes(userRole);
    console.log('hasAnyRole check:', { userRole, normalizedRoles, result });
    return result;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
