import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { NOTIFICATIONS } from '../../data';
import {
  LayoutDashboard, Users, Building2, FileText, Wrench, BarChart3,
  LogOut, MessageSquare, Calendar, DollarSign, Home, Bell, Settings,
  ClipboardList, UserCheck, Briefcase
} from 'lucide-react';

const NAV_CONFIG = {
  admin: [
    { section: 'Overview', items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { label: 'Notifications', icon: Bell, path: '/admin/notifications', badge: true },
    ]},
    { section: 'Management', items: [
      { label: 'Properties', icon: Building2, path: '/admin/properties' },
      { label: 'Units', icon: Home, path: '/admin/units' },
      { label: 'Leads & Pipeline', icon: Users, path: '/admin/leads' },
      { label: 'Leasing', icon: FileText, path: '/admin/leasing' },
      { label: 'Tenants', icon: UserCheck, path: '/admin/tenants' },
      { label: 'Maintenance', icon: Wrench, path: '/admin/maintenance' },
      { label: 'Accounting', icon: DollarSign, path: '/admin/accounting' },
    ]},
    { section: 'Analytics', items: [
      { label: 'Reports & KPIs', icon: BarChart3, path: '/admin/reports' },
    ]},
  ],
  manager: [
    { section: 'Overview', items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/manager/dashboard' },
    ]},
    { section: 'Operations', items: [
      { label: 'Leads & Viewing', icon: Users, path: '/manager/leads' },
      { label: 'Viewing Scheduler', icon: Calendar, path: '/manager/viewing' },
      { label: 'Leasing', icon: FileText, path: '/manager/leasing' },
      { label: 'Tenants', icon: UserCheck, path: '/manager/tenants' },
      { label: 'Maintenance', icon: Wrench, path: '/manager/maintenance' },
    ]},
    { section: 'Finance', items: [
      { label: 'Rent Tracking', icon: DollarSign, path: '/manager/rent' },
      { label: 'Reports', icon: BarChart3, path: '/manager/reports' },
    ]},
  ],
  tenant: [
    { section: 'My Home', items: [
      { label: 'Dashboard', icon: Home, path: '/tenant/dashboard' },
      { label: 'My Lease', icon: FileText, path: '/tenant/lease' },
      { label: 'Payments', icon: DollarSign, path: '/tenant/payments' },
    ]},
    { section: 'Services', items: [
      { label: 'Report Fault', icon: Wrench, path: '/tenant/maintenance' },
      { label: 'My Requests', icon: ClipboardList, path: '/tenant/requests' },
    ]},
    { section: 'Help', items: [
      { label: 'Messages', icon: MessageSquare, path: '/tenant/messages' },
    ]},
  ],
  contractor: [
    { section: 'Work', items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/contractor/dashboard' },
      { label: 'My Jobs', icon: Briefcase, path: '/contractor/jobs' },
    ]},
    { section: 'Billing', items: [
      { label: 'Invoices', icon: DollarSign, path: '/contractor/invoices' },
    ]},
  ],
  finance: [
    { section: 'Finance', items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/finance/dashboard' },
      { label: 'Invoices', icon: FileText, path: '/finance/invoices' },
      { label: 'Rent Roll', icon: DollarSign, path: '/finance/rentroll' },
      { label: 'Maintenance Costs', icon: Wrench, path: '/finance/maintenance-costs' },
      { label: 'Reports', icon: BarChart3, path: '/finance/reports' },
    ]},
  ],
};

export default function Sidebar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  if (!currentUser) return null;

  const navItems = NAV_CONFIG[currentUser.role] || [];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">NZ</div>
        <div>
          <div className="logo-text">PRMS Portal</div>
          <div className="logo-sub">NextZen Minds</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(section => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="icon" />
                {item.label}
                {item.badge && unread > 0 && <span className="nav-badge">{unread}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">{currentUser.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name truncate">{currentUser.name}</div>
            <div className="user-role">{currentUser.role}</div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={logout} title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
