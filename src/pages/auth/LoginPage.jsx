import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Building2, Shield, User, Wrench, DollarSign, Settings } from 'lucide-react';

const ROLES = [
  { key: 'admin', label: 'Admin', icon: Settings, email: 'admin@prms.com', password: 'admin123' },
  { key: 'manager', label: 'Manager', icon: Building2, email: 'manager@prms.com', password: 'manager123' },
  { key: 'tenant', label: 'Tenant', icon: User, email: 'tenant@prms.com', password: 'tenant123' },
  { key: 'contractor', label: 'Contractor', icon: Wrench, email: 'contractor@prms.com', password: 'contractor123' },
  { key: 'finance', label: 'Finance', icon: DollarSign, email: 'finance@prms.com', password: 'finance123' },
];

const ROLE_HOME = {
  admin: '/admin/dashboard',
  manager: '/manager/dashboard',
  tenant: '/tenant/dashboard',
  contractor: '/contractor/dashboard',
  finance: '/finance/dashboard',
};

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@prms.com');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role.key);
    setEmail(role.email);
    setPassword(role.password);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate(ROLE_HOME[result.role]);
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
            <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontFamily: 'Sora', fontWeight: 800, color: 'white', backdropFilter: 'blur(4px)' }}>NZ</div>
            <div>
              <div style={{ color: 'white', fontFamily: 'Sora', fontWeight: 800, fontSize: 20 }}>NextZen Minds</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Connect to the Future</div>
            </div>
          </div>

          <h1 style={{ color: 'white', fontFamily: 'Sora', fontSize: 38, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Property Rental<br />Management<br />System
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, maxWidth: 380, marginBottom: 40 }}>
            A unified, cloud-native platform that automates the full tenancy lifecycle — from initial lead capture to lease expiry and beyond.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 360 }}>
            {[
              { icon: '🏠', label: 'Lead Management' },
              { icon: '📄', label: 'Digital Leasing' },
              { icon: '🔧', label: 'Maintenance' },
              { icon: '📊', label: 'Analytics' },
            ].map(f => (
              <div key={f.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div style={{ marginBottom: 36 }}>
          <div className="login-form-title">Welcome back</div>
          <div className="login-form-sub">Sign in to your PRMS account</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div className="form-label">Quick login — select your role</div>
          <div className="role-selector">
            {ROLES.map(role => (
              <button
                key={role.key}
                className={`role-btn ${selectedRole === role.key ? 'selected' : ''}`}
                onClick={() => handleRoleSelect(role)}
                type="button"
              >
                <role.icon size={18} color={selectedRole === role.key ? 'var(--primary)' : 'var(--gray-400)'} />
                <span className="role-btn-name">{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>

          {error && (
            <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '14px', background: 'var(--gray-50)', borderRadius: 10, fontSize: 12, color: 'var(--gray-500)' }}>
          <strong style={{ color: 'var(--gray-700)' }}>Demo Credentials</strong><br />
          Use the role buttons above to auto-fill credentials. All passwords are role+123 (e.g., admin123)
        </div>
      </div>
    </div>
  );
}
