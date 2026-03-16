import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Exercise from './pages/Exercise';
import Review from './pages/Review';
import Settings from './pages/Settings';

export default function App() {
  const currentPage = useAppStore((s) => s.currentPage);
  const loadDashboardData = useAppStore((s) => s.loadDashboardData);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'exercise':
        return <Exercise />;
      case 'review':
        return <Review />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}
