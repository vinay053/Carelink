import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/alerts');
      if (res.data?.data) {
        setActiveAlerts(res.data.data);
      }
    } catch (err) {
      console.warn('Could not refresh alerts:', err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 60000); // 60s refresh
      return () => clearInterval(interval);
    } else {
      setActiveAlerts([]);
    }
  }, [isAuthenticated, fetchAlerts]);

  const acknowledgeAlert = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}/acknowledge`);
      setActiveAlerts(prev => prev.map(a => a._id === alertId ? { ...a, status: 'acknowledged' } : a));
      toast.success('Alert marked as acknowledged');
    } catch (err) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}/resolve`);
      setActiveAlerts(prev => prev.filter(a => a._id !== alertId));
      toast.success('Care gap marked resolved');
    } catch (err) {
      toast.error('Failed to resolve alert');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeAlerts,
        loadingAlerts,
        unreadAlertCount: activeAlerts.filter(a => a.status === 'active').length,
        refreshAlerts: fetchAlerts,
        acknowledgeAlert,
        resolveAlert
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
