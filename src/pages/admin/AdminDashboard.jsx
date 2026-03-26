import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { PROPERTIES, UNITS, LEADS, LEASES, MAINTENANCE_TICKETS, INVOICES, RENT_TRENDS, MAINTENANCE_COSTS, NOTIFICATIONS } from '../../data';
import { Building2, Users, DollarSign, Wrench, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const COLORS = ['#1a56db', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export default function AdminDashboard() {
  const occupancyRate = Math.round((UNITS.filter(u => u.status === 'occupied').length / UNITS.length) * 100);
  const totalRent = LEASES.filter(l => l.status === 'active').reduce((s, l) => s + l.monthlyRent, 0);
  const openTickets = MAINTENANCE_TICKETS.filter(t => t.status !== 'Completed' && t.status !== 'Invoiced').length;
  const overdueInvoices = INVOICES.filter(i => i.status === 'overdue').length;
  const unread = NOTIFICATIONS.filter(n => !n.read);

  const pipelineData = [
    { name: 'New Enquiry', value: LEADS.filter(l => l.status === 'New Enquiry').length },
    { name: 'Viewing', value: LEADS.filter(l => l.status === 'Viewing Scheduled').length },
    { name: 'Viewed', value: LEADS.filter(l => l.status === 'Viewed').length },
    { name: 'Application', value: LEADS.filter(l => l.status === 'Application Submitted').length },
    { name: 'Signed', value: LEADS.filter(l => l.status === 'Lease Signed').length },
  ];

  return (
    <AppShell>
      <Topbar title="Admin Dashboard" subtitle="Overview of all operations" />
      <div className="page-body">

        {/* KPI Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}>
              <Building2 size={20} color="var(--primary)" />
            </div>
            <div className="stat-value">{occupancyRate}%</div>
            <div className="stat-label">Occupancy Rate</div>
            <div className="stat-change up">↑ +3% vs last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#d1fae5' }}>
              <DollarSign size={20} color="var(--success)" />
            </div>
            <div className="stat-value">S${totalRent.toLocaleString()}</div>
            <div className="stat-label">Monthly Rent Roll</div>
            <div className="stat-change up">↑ 5 active leases</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)' }}>
              <Wrench size={20} color="var(--warning)" />
            </div>
            <div className="stat-value">{openTickets}</div>
            <div className="stat-label">Open Maintenance</div>
            <div className="stat-change down">↑ 2 high urgency</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--danger-light)' }}>
              <AlertCircle size={20} color="var(--danger)" />
            </div>
            <div className="stat-value">{overdueInvoices}</div>
            <div className="stat-label">Overdue Payments</div>
            <div className="stat-change down">S$8,500 at risk</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}>
              <Users size={20} color="var(--primary)" />
            </div>
            <div className="stat-value">{LEADS.length}</div>
            <div className="stat-label">Active Leads</div>
            <div className="stat-change up">↑ 20-35% conversion target</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}>
              <CheckCircle size={20} color="var(--success)" />
            </div>
            <div className="stat-value">{UNITS.filter(u => u.status === 'occupied').length}/{UNITS.length}</div>
            <div className="stat-label">Units Occupied</div>
            <div className="stat-change up">{UNITS.filter(u => u.status === 'vacant').length} vacant</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid-2 mb-6">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Rent Collection Trend</div>
                <div className="card-subtitle">6-month overview</div>
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={RENT_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--gray-400)' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => [`S$${v.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="due" stroke="var(--gray-300)" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Due" />
                  <Line type="monotone" dataKey="collected" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4 }} name="Collected" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Lead Pipeline</div>
                <div className="card-subtitle">By conversion stage</div>
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pipelineData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fill: 'var(--gray-500)' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid-2 mb-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Maintenance Costs by Category</div>
              <span className="badge badge-gray">Last 6 months</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MAINTENANCE_COSTS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <Tooltip />
                  <Bar dataKey="plumbing" stackId="a" fill="#1a56db" name="Plumbing" />
                  <Bar dataKey="electrical" stackId="a" fill="#3b82f6" name="Electrical" />
                  <Bar dataKey="ac" stackId="a" fill="#60a5fa" name="AC" />
                  <Bar dataKey="general" stackId="a" fill="#bfdbfe" name="General" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Notifications</div>
              <span className="badge badge-red">{unread.length} new</span>
            </div>
            <div className="card-body" style={{ padding: '12px 22px' }}>
              {unread.slice(0, 5).map(n => (
                <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.severity === 'error' ? 'var(--danger)' : n.severity === 'warning' ? 'var(--warning)' : 'var(--primary)', flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--gray-700)', fontWeight: 500 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>{n.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Overview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Properties Overview</div>
            <span className="badge badge-blue">{PROPERTIES.length} properties</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Total Units</th>
                  <th>Occupied</th>
                  <th>Occupancy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {PROPERTIES.map(p => {
                  const occ = Math.round((p.occupiedUnits / p.totalUnits) * 100);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: 13 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{p.address}</div>
                      </td>
                      <td><span className="badge badge-blue">{p.type}</span></td>
                      <td>{p.totalUnits}</td>
                      <td>{p.occupiedUnits}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${occ}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>{occ}%</span>
                        </div>
                      </td>
                      <td><span className={`badge ${occ > 85 ? 'badge-green' : occ > 70 ? 'badge-yellow' : 'badge-red'}`}>{occ > 85 ? 'High' : occ > 70 ? 'Medium' : 'Low'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
