import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { INVOICES, LEASES } from '../../data';
import { DollarSign, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

const STATUS_BADGE = { paid: 'badge-green', pending: 'badge-yellow', overdue: 'badge-red' };

export default function AccountingPage() {
  const [invoices, setInvoices] = useState(INVOICES);
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? invoices : invoices.filter(i => i.status === tab);

  const totalDue = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const markPaid = (id) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : i));
  };

  return (
    <AppShell>
      <Topbar title="Accounting & Invoicing" subtitle="Rent invoices, payments and reconciliation" />
      <div className="page-body">

        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={18} color="var(--success)" /></div>
            <div className="stat-value">S${totalCollected.toLocaleString()}</div>
            <div className="stat-label">Collected This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><Clock size={18} color="var(--warning)" /></div>
            <div className="stat-value">S${(totalDue - overdue).toLocaleString()}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><AlertCircle size={18} color="var(--danger)" /></div>
            <div className="stat-value">S${overdue.toLocaleString()}</div>
            <div className="stat-label">Overdue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><TrendingUp size={18} color="var(--primary)" /></div>
            <div className="stat-value">{Math.round((totalCollected / (totalCollected + totalDue)) * 100)}%</div>
            <div className="stat-label">Collection Rate</div>
          </div>
        </div>

        <div className="tabs">
          {[['all', 'All Invoices'], ['pending', 'Pending'], ['paid', 'Paid'], ['overdue', 'Overdue']].map(([key, label]) => (
            <div key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</div>
          ))}
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Tenant</th>
                  <th>Unit</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}>
                    <td><span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{inv.id}</span></td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{inv.tenantName}</td>
                    <td style={{ fontSize: 13 }}>{inv.unitId}</td>
                    <td><span className={`badge ${inv.type === 'rent' ? 'badge-blue' : 'badge-yellow'}`}>{inv.type}</span></td>
                    <td><strong>S${inv.amount.toLocaleString()}</strong></td>
                    <td style={{ fontSize: 12 }}>{inv.dueDate}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>{inv.paidDate || '—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[inv.status]}`}>{inv.status}</span></td>
                    <td>
                      {inv.status !== 'paid' && (
                        <button className="btn btn-success btn-sm" onClick={() => markPaid(inv.id)}>Mark Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bank Feed Reconciliation */}
        <div className="card mt-6">
          <div className="card-header">
            <div>
              <div className="card-title">Bank Feed Reconciliation</div>
              <div className="card-subtitle">Auto-matched incoming payments</div>
            </div>
            <span className="badge badge-green">Live</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { ref: 'TXN-28930', amount: 3600, tenant: 'Chen Wei', matched: true, date: '2026-03-02' },
                { ref: 'TXN-28931', amount: 4200, tenant: 'Diana Soh', matched: true, date: '2026-03-01' },
                { ref: 'TXN-29100', amount: 2800, tenant: 'Unmatched', matched: false, date: '2026-03-05' },
              ].map(txn => (
                <div key={txn.ref} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: txn.matched ? 'var(--success-light)' : 'var(--warning-light)', borderRadius: 10, border: `1px solid ${txn.matched ? '#6ee7b7' : '#fde68a'}` }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--gray-600)' }}>{txn.ref}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>S${txn.amount.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{txn.date}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: txn.matched ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
                      {txn.matched ? `✓ Matched → ${txn.tenant}` : '⚠ Unmatched — Review Required'}
                    </span>
                    {!txn.matched && <button className="btn btn-ghost btn-sm">Match</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
