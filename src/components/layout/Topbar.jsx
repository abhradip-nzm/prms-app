import { Bell, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NOTIFICATIONS } from '../../data';

export default function Topbar({ title, subtitle, actions }) {
  const { currentUser } = useApp();
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="page-title">{title}</div>
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>
      <div className="topbar-actions">
        {actions}
        <div className="notif-btn">
          <button className="btn btn-ghost btn-icon">
            <Bell size={16} />
          </button>
          {unread > 0 && <div className="notif-dot" />}
        </div>
        <div className="avatar sm">{currentUser?.avatar}</div>
      </div>
    </div>
  );
}
