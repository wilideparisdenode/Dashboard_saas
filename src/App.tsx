import './App.css'
import SiteBar from './components/SiteBar'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PaymentMonitoring from './components/PaymentMonitoring'
import UserManagement from './pages/UserManagement'
import { ProductInventoryPage } from './pages/ProductInventory'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import OrderManagement from './pages/Order_management'
import Overview from './pages/Overview'
import { AuthProvider } from '../src/components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/login'
import RegisterPage from './components/register'
// import ProfilePage from './components/'
// import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <div className="sitebar-in-app">
              <SiteBar />
          </div>
        
          
          <div className="page-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Overview />
                </ProtectedRoute>
              } />
              
              {/* <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } /> */}
              
              <Route path="/user_management" element={
                <ProtectedRoute requireAdmin>
                  <UserManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/payment_monitoring" element={
                <ProtectedRoute>
                  <PaymentMonitoring />
                </ProtectedRoute>
              } />
              
              <Route path="/product_managment" element={
                <ProtectedRoute>
                  <ProductInventoryPage />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/order_management" element={
                <ProtectedRoute>
                  <OrderManagement />
                </ProtectedRoute>
              } />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App