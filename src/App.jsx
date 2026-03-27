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
import TenantMessages from './pages/tenant/TenantMessages';
import ContractorDashboard from './pages/contractor/ContractorDashboard';
import ContractorJobs from './pages/contractor/ContractorJobs';
import ContractorInvoices from './pages/contractor/ContractorInvoices';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import { TenantsPage, NotificationsPage, ViewingSchedulerPage, RentTrackingPage } from './pages/shared/SharedPages';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/login" replace />;
  return children;
}

function R(roles, el) {
  return <ProtectedRoute allowedRoles={roles}>{el}</ProtectedRoute>;
}

function AppRoutes() {
  const { currentUser } = useApp();
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}/dashboard`} /> : <LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── ADMIN ── */}
      <Route path="/admin/dashboard"      element={R(['admin'], <AdminDashboard />)} />
      <Route path="/admin/leads"          element={R(['admin'], <LeadsPage />)} />
      <Route path="/admin/leasing"        element={R(['admin'], <LeasingPage />)} />
      <Route path="/admin/maintenance"    element={R(['admin'], <MaintenancePage />)} />
      <Route path="/admin/accounting"     element={R(['admin'], <AccountingPage />)} />
      <Route path="/admin/reports"        element={R(['admin'], <ReportsPage />)} />
      <Route path="/admin/properties"     element={R(['admin'], <PropertiesPage />)} />
      <Route path="/admin/units"          element={R(['admin'], <UnitsPage />)} />
      <Route path="/admin/tenants"        element={R(['admin'], <TenantsPage />)} />
      <Route path="/admin/notifications"  element={R(['admin'], <NotificationsPage />)} />

      {/* ── MANAGER ── */}
      <Route path="/manager/dashboard"       element={R(['manager'], <ManagerDashboard />)} />
      <Route path="/manager/leads"           element={R(['manager'], <LeadsPage />)} />
      <Route path="/manager/viewing"         element={R(['manager'], <ViewingSchedulerPage />)} />
      <Route path="/manager/leasing"         element={R(['manager'], <LeasingPage />)} />
      <Route path="/manager/tenants"         element={R(['manager'], <TenantsPage />)} />
      <Route path="/manager/maintenance"     element={R(['manager'], <MaintenancePage />)} />
      <Route path="/manager/rent"            element={R(['manager'], <RentTrackingPage />)} />
      <Route path="/manager/reports"         element={R(['manager'], <ReportsPage />)} />
      <Route path="/manager/notifications"   element={R(['manager'], <NotificationsPage />)} />

      {/* ── TENANT ── */}
      <Route path="/tenant/dashboard"       element={R(['tenant'], <TenantDashboard />)} />
      <Route path="/tenant/lease"           element={R(['tenant'], <TenantLease />)} />
      <Route path="/tenant/payments"        element={R(['tenant'], <TenantPayments />)} />
      <Route path="/tenant/maintenance"     element={R(['tenant'], <TenantMaintenance />)} />
      <Route path="/tenant/requests"        element={R(['tenant'], <TenantMaintenance />)} />
      <Route path="/tenant/messages"        element={R(['tenant'], <TenantMessages />)} />
      <Route path="/tenant/notifications"   element={R(['tenant'], <NotificationsPage />)} />

      {/* ── CONTRACTOR ── */}
      <Route path="/contractor/dashboard"     element={R(['contractor'], <ContractorDashboard />)} />
      <Route path="/contractor/jobs"          element={R(['contractor'], <ContractorJobs />)} />
      <Route path="/contractor/invoices"      element={R(['contractor'], <ContractorInvoices />)} />
      <Route path="/contractor/notifications" element={R(['contractor'], <NotificationsPage />)} />

      {/* ── FINANCE ── */}
      <Route path="/finance/dashboard"          element={R(['finance'], <FinanceDashboard />)} />
      <Route path="/finance/invoices"           element={R(['finance'], <AccountingPage />)} />
      <Route path="/finance/rentroll"           element={R(['finance'], <FinanceDashboard />)} />
      <Route path="/finance/maintenance-costs"  element={R(['finance'], <FinanceDashboard />)} />
      <Route path="/finance/reports"            element={R(['finance'], <ReportsPage />)} />
      <Route path="/finance/notifications"      element={R(['finance'], <NotificationsPage />)} />

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
