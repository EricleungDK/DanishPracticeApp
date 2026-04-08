import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Exercise from './pages/Exercise';
import Review from './pages/Review';
import Settings from './pages/Settings';
import VocabBoost from './pages/VocabBoost';

export default function App() {
  const currentPage = useAppStore((s) => s.currentPage);
  const loadDashboardData = useAppStore((s) => s.loadDashboardData);
  const loadTheme = useAppStore((s) => s.loadTheme);

  useEffect(() => {
    loadTheme();
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
      case 'vocab-boost':
        return <VocabBoost />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
