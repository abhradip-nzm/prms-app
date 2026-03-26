import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LeadsPage from './pages/admin/LeadsPage';
import LeasingPage from './pages/admin/LeasingPage';
import MaintenancePage from './pages/admin/MaintenancePage';
import AccountingPage from './pages/admin/AccountingPage';
import ReportsPage from './pages/admin/ReportsPage';
import { PropertiesPage, UnitsPage } from './pages/admin/PropertiesPage';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TenantDashboard from './pages/tenant/TenantDashboard';
import TenantLease from './pages/tenant/TenantLease';
import TenantPayments from './pages/tenant/TenantPayments';
import TenantMaintenance from './pages/tenant/TenantMaintenance';
import ContractorDashboard from './pages/contractor/ContractorDashboard';
import ContractorInvoices from './pages/contractor/ContractorInvoices';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import { TenantsPage, NotificationsPage, ViewingSchedulerPage, RentTrackingPage } from './pages/shared/SharedPages';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { currentUser } = useApp();
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}/dashboard`} /> : <LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute allowedRoles={['admin']}><LeadsPage /></ProtectedRoute>} />
      <Route path="/admin/leasing" element={<ProtectedRoute allowedRoles={['admin']}><LeasingPage /></ProtectedRoute>} />
      <Route path="/admin/maintenance" element={<ProtectedRoute allowedRoles={['admin']}><MaintenancePage /></ProtectedRoute>} />
      <Route path="/admin/accounting" element={<ProtectedRoute allowedRoles={['admin']}><AccountingPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>} />
      <Route path="/admin/properties" element={<ProtectedRoute allowedRoles={['admin']}><PropertiesPage /></ProtectedRoute>} />
      <Route path="/admin/units" element={<ProtectedRoute allowedRoles={['admin']}><UnitsPage /></ProtectedRoute>} />
      <Route path="/admin/tenants" element={<ProtectedRoute allowedRoles={['admin']}><TenantsPage /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><NotificationsPage /></ProtectedRoute>} />
      <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/leads" element={<ProtectedRoute allowedRoles={['manager']}><LeadsPage /></ProtectedRoute>} />
      <Route path="/manager/viewing" element={<ProtectedRoute allowedRoles={['manager']}><ViewingSchedulerPage /></ProtectedRoute>} />
      <Route path="/manager/leasing" element={<ProtectedRoute allowedRoles={['manager']}><LeasingPage /></ProtectedRoute>} />
      <Route path="/manager/tenants" element={<ProtectedRoute allowedRoles={['manager']}><TenantsPage /></ProtectedRoute>} />
      <Route path="/manager/maintenance" element={<ProtectedRoute allowedRoles={['manager']}><MaintenancePage /></ProtectedRoute>} />
      <Route path="/manager/rent" element={<ProtectedRoute allowedRoles={['manager']}><RentTrackingPage /></ProtectedRoute>} />
      <Route path="/manager/reports" element={<ProtectedRoute allowedRoles={['manager']}><ReportsPage /></ProtectedRoute>} />
      <Route path="/tenant/dashboard" element={<ProtectedRoute allowedRoles={['tenant']}><TenantDashboard /></ProtectedRoute>} />
      <Route path="/tenant/lease" element={<ProtectedRoute allowedRoles={['tenant']}><TenantLease /></ProtectedRoute>} />
      <Route path="/tenant/payments" element={<ProtectedRoute allowedRoles={['tenant']}><TenantPayments /></ProtectedRoute>} />
      <Route path="/tenant/maintenance" element={<ProtectedRoute allowedRoles={['tenant']}><TenantMaintenance /></ProtectedRoute>} />
      <Route path="/tenant/requests" element={<ProtectedRoute allowedRoles={['tenant']}><TenantMaintenance /></ProtectedRoute>} />
      <Route path="/tenant/messages" element={<ProtectedRoute allowedRoles={['tenant']}><TenantDashboard /></ProtectedRoute>} />
      <Route path="/contractor/dashboard" element={<ProtectedRoute allowedRoles={['contractor']}><ContractorDashboard /></ProtectedRoute>} />
      <Route path="/contractor/jobs" element={<ProtectedRoute allowedRoles={['contractor']}><ContractorDashboard /></ProtectedRoute>} />
      <Route path="/contractor/invoices" element={<ProtectedRoute allowedRoles={['contractor']}><ContractorInvoices /></ProtectedRoute>} />
      <Route path="/finance/dashboard" element={<ProtectedRoute allowedRoles={['finance']}><FinanceDashboard /></ProtectedRoute>} />
      <Route path="/finance/invoices" element={<ProtectedRoute allowedRoles={['finance']}><AccountingPage /></ProtectedRoute>} />
      <Route path="/finance/rentroll" element={<ProtectedRoute allowedRoles={['finance']}><FinanceDashboard /></ProtectedRoute>} />
      <Route path="/finance/maintenance-costs" element={<ProtectedRoute allowedRoles={['finance']}><FinanceDashboard /></ProtectedRoute>} />
      <Route path="/finance/reports" element={<ProtectedRoute allowedRoles={['finance']}><ReportsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
