import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const HealthPage = lazy(() => import('./pages/HealthPage').then(module => ({ default: module.HealthPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const SalesDashboardPage = lazy(() => import('./pages/SalesDashboardPage').then(module => ({ default: module.SalesDashboardPage })));
const VehicleList = lazy(() => import('./components/VehicleList').then(module => ({ default: module.VehicleList })));
const TarefasPage = lazy(() => import('./pages/TarefasPage').then(module => ({ default: module.TarefasPage })));

// Placeholder para Dashboard
function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Dashboard</h1>
      <p style={{ color: '#64748b' }}>Área protegida - apenas usuários autenticados</p>
      <Suspense fallback={<div>Carregando lista de veículos...</div>}>
        <VehicleList />
      </Suspense>
    </div>
  );
}

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
    <p>Carregando...</p>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
        <Route
          path="/register"
          element={
            <RouteErrorBoundary routeName="register">
              <RegisterPage />
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
          path="/sales-dashboard"
          element={
            <RouteErrorBoundary routeName="sales-dashboard">
              <ProtectedRoute>
                <Layout>
                  <SalesDashboardPage />
                </Layout>
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
        <Route
          path="/tarefas"
          element={
            <RouteErrorBoundary routeName="tarefas">
              <ProtectedRoute>
                <Layout>
                  <TarefasPage />
                </Layout>
              </ProtectedRoute>
            </RouteErrorBoundary>
          }
        />
      </Routes>
    </Suspense>
  );
}