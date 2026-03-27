import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { PROPERTIES, UNITS, LEADS, LEASES, MAINTENANCE_TICKETS, INVOICES, RENT_TRENDS, MAINTENANCE_COSTS, NOTIFICATIONS } from '../../data';
import { Building2, Users, DollarSign, Wrench, AlertCircle, CheckCircle } from 'lucide-react';

const PIPELINE_COLORS = ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'];

function PropertyFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        fontSize: 12, padding: '4px 10px', height: 30, borderRadius: 6,
        border: '1px solid var(--gray-200)', background: 'white',
        color: 'var(--gray-700)', cursor: 'pointer', minWidth: 160,
        fontFamily: 'var(--font-body)',
      }}
    >
      <option value="all">All Properties</option>
      {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );
}

function unitsByProp(pid)    { return pid === 'all' ? UNITS : UNITS.filter(u => u.propertyId === pid); }
function leasesByProp(pid)   { const ids = unitsByProp(pid).map(u => u.id); return LEASES.filter(l => ids.includes(l.unitId)); }
function ticketsByProp(pid)  { const ids = unitsByProp(pid).map(u => u.id); return MAINTENANCE_TICKETS.filter(t => ids.includes(t.unitId)); }
function invoicesByProp(pid) { const ids = unitsByProp(pid).map(u => u.id); return INVOICES.filter(i => ids.includes(i.unitId)); }
function leadsByProp(pid)    { return pid === 'all' ? LEADS : LEADS.filter(l => l.propertyId === pid); }

export default function AdminDashboard() {
  const [kpiFilter,      setKpiFilter]      = useState('all');
  const [rentFilter,     setRentFilter]     = useState('all');
  const [pipelineFilter, setPipelineFilter] = useState('all');
  const [maintFilter,    setMaintFilter]    = useState('all');
  const [notifFilter,    setNotifFilter]    = useState('all');
  const [propsFilter,    setPropsFilter]    = useState('all');

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpiUnits    = unitsByProp(kpiFilter);
  const kpiLeases   = leasesByProp(kpiFilter);
  const kpiTickets  = ticketsByProp(kpiFilter);
  const kpiInvoices = invoicesByProp(kpiFilter);
  const kpiLeads    = leadsByProp(kpiFilter);

  const occupancyRate   = kpiUnits.length ? Math.round((kpiUnits.filter(u => u.status === 'occupied').length / kpiUnits.length) * 100) : 0;
  const totalRent       = kpiLeases.filter(l => l.status === 'active').reduce((s, l) => s + l.monthlyRent, 0);
  const openTickets     = kpiTickets.filter(t => t.status !== 'Completed' && t.status !== 'Invoiced').length;
  const overdueAmt      = kpiInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  const highUrgency     = kpiTickets.filter(t => t.urgency === 'High' && t.status !== 'Completed' && t.status !== 'Invoiced').length;

  // ── Lead Pipeline ─────────────────────────────────────────────────────────
  const pLeads = leadsByProp(pipelineFilter);
  const pipelineData = [
    { name: 'New Enquiry', value: pLeads.filter(l => l.status === 'New Enquiry').length },
    { name: 'Viewing',     value: pLeads.filter(l => l.status === 'Viewing Scheduled').length },
    { name: 'Viewed',      value: pLeads.filter(l => l.status === 'Viewed').length },
    { name: 'Application', value: pLeads.filter(l => l.status === 'Application Submitted').length },
    { name: 'Signed',      value: pLeads.filter(l => l.status === 'Lease Signed').length },
  ];

  // ── Maintenance chart ─────────────────────────────────────────────────────
  const getMaintData = () => {
    if (maintFilter === 'all') return MAINTENANCE_COSTS;
    const pt = ticketsByProp(maintFilter);
    return ['Oct','Nov','Dec','Jan','Feb','Mar'].map(m => ({
      month: m,
      plumbing:    pt.filter(t => t.category === 'Plumbing').reduce((s, t) => s + (t.actualCost || t.estimatedCost || 0), 0),
      electrical:  pt.filter(t => t.category === 'Electrical').reduce((s, t) => s + (t.actualCost || t.estimatedCost || 0), 0),
      ac:          pt.filter(t => t.category === 'Air Conditioning').reduce((s, t) => s + (t.actualCost || t.estimatedCost || 0), 0),
      general:     pt.filter(t => t.category === 'General').reduce((s, t) => s + (t.actualCost || t.estimatedCost || 0), 0),
    }));
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  const unread = NOTIFICATIONS.filter(n => !n.read);
  const visibleNotifs = notifFilter === 'all'
    ? unread
    : unread.filter(n => unitsByProp(notifFilter).some(u => n.message.includes(u.id)));

  // ── Properties table ──────────────────────────────────────────────────────
  const visibleProps = propsFilter === 'all' ? PROPERTIES : PROPERTIES.filter(p => p.id === propsFilter);

  return (
    <AppShell>
      <Topbar title="Admin Dashboard" subtitle="Overview of all operations" />
      <div className="page-body">

        {/* ── KPI Section ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--gray-900)' }}>Key Performance Indicators</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>Portfolio snapshot</div>
            </div>
            <PropertyFilter value={kpiFilter} onChange={setKpiFilter} />
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><Building2 size={20} color="var(--primary)" /></div>
              <div className="stat-value">{occupancyRate}%</div>
              <div className="stat-label">Occupancy Rate</div>
              <div className="stat-change up">↑ +3% vs last month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5' }}><DollarSign size={20} color="var(--success)" /></div>
              <div className="stat-value">S${totalRent.toLocaleString()}</div>
              <div className="stat-label">Monthly Rent Roll</div>
              <div className="stat-change up">↑ {kpiLeases.filter(l => l.status === 'active').length} active leases</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><Wrench size={20} color="var(--warning)" /></div>
              <div className="stat-value">{openTickets}</div>
              <div className="stat-label">Open Maintenance</div>
              <div className="stat-change down">↑ {highUrgency} high urgency</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><AlertCircle size={20} color="var(--danger)" /></div>
              <div className="stat-value">{kpiInvoices.filter(i => i.status === 'overdue').length}</div>
              <div className="stat-label">Overdue Payments</div>
              <div className="stat-change down">S${overdueAmt.toLocaleString()} at risk</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><Users size={20} color="var(--primary)" /></div>
              <div className="stat-value">{kpiLeads.filter(l => l.status !== 'Lost').length}</div>
              <div className="stat-label">Active Leads</div>
              <div className="stat-change up">↑ 20-35% conversion target</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={20} color="var(--success)" /></div>
              <div className="stat-value">{kpiUnits.filter(u => u.status === 'occupied').length}/{kpiUnits.length}</div>
              <div className="stat-label">Units Occupied</div>
              <div className="stat-change up">{kpiUnits.filter(u => u.status === 'vacant').length} vacant</div>
            </div>
          </div>
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid-2 mb-6">
          {/* Rent Collection */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Rent Collection Trend</div>
                <div className="card-subtitle">6-month overview</div>
              </div>
              <PropertyFilter value={rentFilter} onChange={setRentFilter} />
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

          {/* Lead Pipeline — multi-colour bars */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Lead Pipeline</div>
                <div className="card-subtitle">By conversion stage</div>
              </div>
              <PropertyFilter value={pipelineFilter} onChange={setPipelineFilter} />
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={pipelineData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <YAxis dataKey="name" type="category" width={88} tick={{ fontSize: 10, fill: 'var(--gray-500)' }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(v, n, p) => [v, p.payload.name]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Leads">
                    {pipelineData.map((_, i) => (
                      <Cell key={i} fill={PIPELINE_COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* colour legend */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                {pipelineData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: PIPELINE_COLORS[i], flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>{item.name} <strong>({item.value})</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid-2 mb-6">
          {/* Maintenance Costs */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Maintenance Costs by Category</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge badge-gray">Last 6 months</span>
                <PropertyFilter value={maintFilter} onChange={setMaintFilter} />
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getMaintData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <Tooltip />
                  <Bar dataKey="plumbing"   stackId="a" fill="#1a56db" name="Plumbing" />
                  <Bar dataKey="electrical" stackId="a" fill="#3b82f6" name="Electrical" />
                  <Bar dataKey="ac"         stackId="a" fill="#60a5fa" name="AC" />
                  <Bar dataKey="general"    stackId="a" fill="#bfdbfe" name="General" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Notifications</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge badge-red">{unread.length} new</span>
                <PropertyFilter value={notifFilter} onChange={setNotifFilter} />
              </div>
            </div>
            <div className="card-body" style={{ padding: '12px 22px' }}>
              {visibleNotifs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 13, color: 'var(--gray-400)' }}>
                  No notifications for this property
                </div>
              ) : (
                visibleNotifs.slice(0, 5).map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                      background: n.severity === 'error' ? 'var(--danger)' : n.severity === 'warning' ? 'var(--warning)' : 'var(--primary)'
                    }} />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--gray-700)', fontWeight: 500 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>{n.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Properties Overview ── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Properties Overview</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="badge badge-blue">{PROPERTIES.length} properties</span>
              <PropertyFilter value={propsFilter} onChange={setPropsFilter} />
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Property</th><th>Type</th><th>Total Units</th><th>Occupied</th><th>Occupancy</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleProps.map(p => {
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
                      <td>
                        <span className={`badge ${occ > 85 ? 'badge-green' : occ > 70 ? 'badge-yellow' : 'badge-red'}`}>
                          {occ > 85 ? 'High' : occ > 70 ? 'Medium' : 'Low'}
                        </span>
                      </td>
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
