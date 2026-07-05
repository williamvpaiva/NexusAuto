import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { HealthPage } from './pages/HealthPage';
import { LoginPage } from './pages/LoginPage';
import { VehicleList } from './components/VehicleList';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';

// Placeholder para Dashboard
function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Dashboard</h1>
      <p style={{ color: '#64748b' }}>Área protegida - apenas usuários autenticados</p>
      <VehicleList />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route
        path="/login"
        element={
          <RouteErrorBoundary routeName="login">
            <LoginPage />
          </RouteErrorBoundary>
        }
      />
      
      {/* Rotas Protegidas */}
      <Route
        path="/"
        element={
          <RouteErrorBoundary routeName="home">
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          </RouteErrorBoundary>
        }
      />
      <Route
        path="/health"
        element={
          <RouteErrorBoundary routeName="health">
            <ProtectedRoute>
              <Layout>
                <HealthPage />
              </Layout>
            </ProtectedRoute>
          </RouteErrorBoundary>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RouteErrorBoundary routeName="dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </RouteErrorBoundary>
        }
      />
      <Route
        path="/veiculos"
        element={
          <RouteErrorBoundary routeName="veiculos">
            <ProtectedRoute>
              <Layout>
                <VehicleList />
              </Layout>
            </ProtectedRoute>
          </RouteErrorBoundary>
        }
      />
    </Routes>
  );
}