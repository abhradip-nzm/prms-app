import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { INVOICES, LEASES, RENT_TRENDS, MAINTENANCE_COSTS } from '../../data';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useState } from 'react';

export default function FinanceDashboard() {
  const [tab, setTab] = useState('overview');
  const totalDue = INVOICES.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPaid = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const overdue = INVOICES.filter(i => i.status === 'overdue');
  const collectionRate = Math.round((totalPaid / (totalPaid + totalDue)) * 100);

  return (
    <AppShell>
      <Topbar title="Finance Dashboard" subtitle="Financial overview and reporting"
        actions={<button className="btn btn-ghost btn-sm"><Download size={13} /> Export Report</button>}
      />
      <div className="page-body">

        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 22 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={18} color="var(--success)" /></div>
            <div className="stat-value">S${totalPaid.toLocaleString()}</div>
            <div className="stat-label">Collected</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><DollarSign size={18} color="var(--warning)" /></div>
            <div className="stat-value">S${(totalDue - overdue.reduce((s, i) => s + i.amount, 0)).toLocaleString()}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><AlertCircle size={18} color="var(--danger)" /></div>
            <div className="stat-value">S${overdue.reduce((s, i) => s + i.amount, 0).toLocaleString()}</div>
            <div className="stat-label">Overdue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><TrendingUp size={18} color="var(--primary)" /></div>
            <div className="stat-value">{collectionRate}%</div>
            <div className="stat-label">Collection Rate</div>
          </div>
        </div>

        <div className="tabs">
          {[['overview', 'Overview'], ['rentroll', 'Rent Roll'], ['maintenance', 'Maintenance Costs'], ['intercompany', 'Intercompany']].map(([k, l]) => (
            <div key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</div>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div className="grid-2 mb-6">
              <div className="card">
                <div className="card-header"><div className="card-title">Rent Collection Trend</div></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={RENT_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v/1000}k`} />
                      <Tooltip formatter={v => `S$${v.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="due" stroke="var(--gray-300)" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Due" />
                      <Line type="monotone" dataKey="collected" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 3 }} name="Collected" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="card-header"><div className="card-title">Maintenance Spend</div></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={MAINTENANCE_COSTS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="plumbing" stackId="a" fill="#1a56db" name="Plumbing" />
                      <Bar dataKey="electrical" stackId="a" fill="#3b82f6" name="Electrical" />
                      <Bar dataKey="ac" stackId="a" fill="#60a5fa" name="AC" />
                      <Bar dataKey="general" stackId="a" fill="#bfdbfe" name="General" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'rentroll' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Rent Roll — March 2026</div>
              <button className="btn btn-ghost btn-sm"><Download size={12} /> Excel</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Lease ID</th><th>Tenant</th><th>Unit</th><th>Monthly Rent</th><th>Due Date</th><th>Status</th><th>Arrears</th></tr>
                </thead>
                <tbody>
                  {LEASES.map(l => {
                    const inv = INVOICES.find(i => i.leaseId === l.id);
                    return (
                      <tr key={l.id}>
                        <td style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{l.id}</td>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{l.tenantName}</td>
                        <td>{l.unitId}</td>
                        <td><strong>S${l.monthlyRent.toLocaleString()}</strong></td>
                        <td style={{ fontSize: 12 }}>2026-04-01</td>
                        <td><span className={`badge ${!inv ? 'badge-gray' : inv.status === 'paid' ? 'badge-green' : inv.status === 'overdue' ? 'badge-red' : 'badge-yellow'}`}>{inv?.status || 'N/A'}</span></td>
                        <td style={{ color: inv?.status === 'overdue' ? 'var(--danger)' : 'var(--gray-400)', fontWeight: inv?.status === 'overdue' ? 700 : 400 }}>
                          {inv?.status === 'overdue' ? `S$${inv.amount.toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: 'var(--primary-50)', fontWeight: 700 }}>
                    <td colSpan={3}><strong>Total</strong></td>
                    <td><strong>S${LEASES.reduce((s, l) => s + l.monthlyRent, 0).toLocaleString()}</strong></td>
                    <td colSpan={3} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'intercompany' && (
          <div className="card">
            <div className="card-header"><div className="card-title">Intercompany Billing</div><span className="badge badge-blue">Module Active</span></div>
            <div className="card-body">
              <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--primary-50)', borderRadius: 10, fontSize: 13 }}>
                Shared maintenance costs are automatically allocated across related entities based on unit usage.
              </div>
              {[
                { entity: 'Marina Bay Holdings Pte Ltd', type: 'Maintenance Share', amount: 1245, period: 'Mar 2026', status: 'pending' },
                { entity: 'Orchard Investments Ltd', type: 'Maintenance Share', amount: 890, period: 'Mar 2026', status: 'paid' },
                { entity: 'Clarke Commercial Corp', type: 'Management Fee', amount: 3200, period: 'Mar 2026', status: 'paid' },
              ].map((ic, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{ic.entity}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{ic.type} · {ic.period}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <strong>S${ic.amount.toLocaleString()}</strong>
                    <span className={`badge ${ic.status === 'paid' ? 'badge-green' : 'badge-yellow'}`}>{ic.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'maintenance' && (
          <div className="card">
            <div className="card-header"><div className="card-title">Maintenance Cost Allocation</div><button className="btn btn-ghost btn-sm"><Download size={12} /> Export</button></div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Ticket</th><th>Unit</th><th>Category</th><th>Contractor</th><th>Cost</th><th>Chargeable</th><th>Status</th></tr></thead>
                <tbody>
                  {[
                    { id: 'MT-001', unit: 'U-101', cat: 'Plumbing', contractor: 'James Wong', cost: 280, chargeable: false, status: 'In Progress' },
                    { id: 'MT-003', unit: 'U-202', cat: 'AC', contractor: 'James Wong', cost: 420, chargeable: false, status: 'Completed' },
                    { id: 'MT-005', unit: 'U-101', cat: 'Plumbing', contractor: 'James Wong', cost: 165, chargeable: true, status: 'Invoiced' },
                  ].map(row => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{row.id}</td>
                      <td>{row.unit}</td>
                      <td><span className="badge badge-gray">{row.cat}</span></td>
                      <td style={{ fontSize: 13 }}>{row.contractor}</td>
                      <td><strong>S${row.cost}</strong></td>
                      <td><span className={`badge ${row.chargeable ? 'badge-yellow' : 'badge-green'}`}>{row.chargeable ? 'Tenant' : 'Landlord'}</span></td>
                      <td><span className={`badge ${row.status === 'Invoiced' ? 'badge-gray' : row.status === 'Completed' ? 'badge-green' : 'badge-blue'}`}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
