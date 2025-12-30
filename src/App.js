import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Components
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SalesDatabase from './pages/SalesDatabase';
import LeadTracker from './pages/LeadTracker';
import CostingList from './pages/CostingList';
import CostingForm from './pages/CostingForm';
import SalesPerformance from './pages/SalesPerformance';
import Quotation from './pages/Quotation';
import './App.css';
import './common.css';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

// Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// Layout
function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Sales Database */}
          <Route
            path="/sales-database"
            element={
              <ProtectedRoute>
                <Layout>
                  <SalesDatabase />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Lead Tracker */}
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Layout>
                  <LeadTracker />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Costing List */}
          <Route
            path="/costings"
            element={
              <ProtectedRoute>
                <Layout>
                  <CostingList />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Costing Form */}
          <Route
            path="/costing/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <CostingForm />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Sales Performance */}
          <Route
            path="/sales-performance"
            element={
              <ProtectedRoute>
                <Layout>
                  <SalesPerformance />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Quotation */}
          <Route
            path="/quotation"
            element={
              <ProtectedRoute>
                <Layout>
                  <Quotation />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* React Query Devtools */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;