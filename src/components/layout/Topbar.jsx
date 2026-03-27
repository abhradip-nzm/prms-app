import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { NOTIFICATIONS } from '../../data';

const NOTIF_PATHS = {
  admin:      '/admin/notifications',
  manager:    '/manager/notifications',
  tenant:     '/tenant/notifications',
  contractor: '/contractor/notifications',
  finance:    '/finance/notifications',
};

export default function Topbar({ title, subtitle, actions }) {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const handleBell = () => {
    const path = NOTIF_PATHS[currentUser?.role];
    if (path) navigate(path);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="page-title">{title}</div>
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>
      <div className="topbar-actions">
        {actions}
        <div className="notif-btn" style={{ position: 'relative', cursor: 'pointer' }} onClick={handleBell} title="Notifications">
          <button className="btn btn-ghost btn-icon">
            <Bell size={16} />
          </button>
          {unread > 0 && (
            <div className="notif-dot" style={{
              position: 'absolute', top: 4, right: 4,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--danger)', border: '2px solid white',
              pointerEvents: 'none',
            }} />
          )}
        </div>
        <div className="avatar sm">{currentUser?.avatar}</div>
      </div>
    </div>
  );
}
