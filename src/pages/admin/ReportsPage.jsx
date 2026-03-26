import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { RENT_TRENDS, MAINTENANCE_COSTS, PROPERTIES, UNITS } from '../../data';
import { Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const PIE_COLORS = ['#1a56db', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export default function ReportsPage() {
  const [tab, setTab] = useState('overview');

  const occupancyData = PROPERTIES.map(p => ({ name: p.name.split(' ').slice(0,2).join(' '), occupancy: Math.round((p.occupiedUnits / p.totalUnits) * 100), vacant: Math.round(((p.totalUnits - p.occupiedUnits) / p.totalUnits) * 100) }));
  const unitTypeData = ['Studio', '1BR', '2BR', '3BR', 'Office'].map(t => ({ name: t, value: UNITS.filter(u => u.type === t).length }));

  return (
    <AppShell>
      <Topbar title="Reports & Analytics" subtitle="Executive dashboards and KPI tracking"
        actions={
          <>
            <button className="btn btn-ghost btn-sm"><RefreshCw size={13} /> Refresh</button>
            <button className="btn btn-primary btn-sm"><Download size={13} /> Export</button>
          </>
        }
      />
      <div className="page-body">

        <div className="tabs">
          {[['overview', 'Overview'], ['rent', 'Rent Roll'], ['occupancy', 'Occupancy'], ['maintenance', 'Maintenance']].map(([key, label]) => (
            <div key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</div>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div className="grid-2 mb-6">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Rent Collection vs Due</div>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={RENT_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={v => `$${v/1000}k`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={v => `S$${v.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="due" fill="var(--gray-200)" name="Due" radius={[4,4,0,0]} />
                      <Bar dataKey="collected" fill="var(--primary)" name="Collected" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Unit Type Distribution</div>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={unitTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {unitTypeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Property Occupancy Rate</div>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={occupancyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => `${v}%`} />
                    <Bar dataKey="occupancy" fill="var(--primary)" radius={[0,4,4,0]} name="Occupied %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'rent' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Rent Roll Report — March 2026</div>
              <button className="btn btn-ghost btn-sm"><Download size={12} /> Export Excel</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Unit</th>
                    <th>Tenant</th>
                    <th>Property</th>
                    <th>Monthly Rent</th>
                    <th>Lease End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {UNITS.filter(u => u.status === 'occupied').map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.id}</td>
                      <td>Tenant {u.id}</td>
                      <td>Property {u.propertyId}</td>
                      <td><strong>S${u.monthlyRent.toLocaleString()}</strong></td>
                      <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>2026-12-31</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--primary-50)', fontWeight: 700 }}>
                    <td colSpan={3} style={{ fontWeight: 700 }}>Total</td>
                    <td><strong>S${UNITS.filter(u => u.status === 'occupied').reduce((s, u) => s + u.monthlyRent, 0).toLocaleString()}</strong></td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'maintenance' && (
          <div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Maintenance Cost Breakdown</div>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={MAINTENANCE_COSTS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="plumbing" stackId="a" fill="#1a56db" name="Plumbing" />
                    <Bar dataKey="electrical" stackId="a" fill="#3b82f6" name="Electrical" />
                    <Bar dataKey="ac" stackId="a" fill="#60a5fa" name="AC" />
                    <Bar dataKey="general" stackId="a" fill="#bfdbfe" name="General" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'occupancy' && (
          <div>
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
              {PROPERTIES.map(p => (
                <div key={p.id} className="stat-card">
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--gray-700)' }}>{p.name}</div>
                  <div className="stat-value">{Math.round((p.occupiedUnits / p.totalUnits) * 100)}%</div>
                  <div className="stat-label">Occupancy Rate</div>
                  <div style={{ marginTop: 12 }}>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.round((p.occupiedUnits / p.totalUnits) * 100)}%` }} /></div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 6 }}>{p.occupiedUnits}/{p.totalUnits} units occupied</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Vacancy Report</div><button className="btn btn-ghost btn-sm"><Download size={12} /> Export</button></div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Unit</th><th>Type</th><th>Property</th><th>Sq Ft</th><th>Asking Rent</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {UNITS.filter(u => u.status === 'vacant').map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600 }}>{u.id}</td>
                        <td>{u.type}</td>
                        <td>{PROPERTIES.find(p => p.id === u.propertyId)?.name}</td>
                        <td>{u.sqft}</td>
                        <td>S${u.monthlyRent.toLocaleString()}/mo</td>
                        <td><span className="badge badge-yellow">Vacant</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
