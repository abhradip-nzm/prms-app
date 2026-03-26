import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { LEADS, LEASES, MAINTENANCE_TICKETS, INVOICES, RENT_TRENDS, PROPERTIES, UNITS } from '../../data';
import { Users, FileText, Wrench, DollarSign, AlertCircle } from 'lucide-react';

export default function ManagerDashboard() {
  const openTickets = MAINTENANCE_TICKETS.filter(t => t.status !== 'Completed' && t.status !== 'Invoiced');
  const pendingLeads = LEADS.filter(l => l.status !== 'Lease Signed' && l.status !== 'Lost');
  const expiringLeases = LEASES.filter(l => {
    const days = Math.ceil((new Date(l.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 90 && days > 0;
  });
  const overdueInvoices = INVOICES.filter(i => i.status === 'overdue');

  return (
    <AppShell>
      <Topbar title="Manager Dashboard" subtitle="Your daily operations overview" />
      <div className="page-body">

        {/* Alerts */}
        {(expiringLeases.length > 0 || overdueInvoices.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {expiringLeases.length > 0 && (
              <div style={{ background: 'var(--warning-light)', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <AlertCircle size={16} color="var(--warning)" />
                <strong>{expiringLeases.length} lease(s)</strong> expiring within 90 days — review and renew
              </div>
            )}
            {overdueInvoices.length > 0 && (
              <div style={{ background: 'var(--danger-light)', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <AlertCircle size={16} color="var(--danger)" />
                <strong>{overdueInvoices.length} overdue payment(s)</strong> — follow up required
              </div>
            )}
          </div>
        )}

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><Users size={18} color="var(--primary)" /></div>
            <div className="stat-value">{pendingLeads.length}</div>
            <div className="stat-label">Active Leads</div>
            <div className="stat-change up">↑ {LEADS.filter(l => l.status === 'New Enquiry').length} new enquiries</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><FileText size={18} color="var(--success)" /></div>
            <div className="stat-value">{LEASES.filter(l => l.status === 'active').length}</div>
            <div className="stat-label">Active Leases</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><Wrench size={18} color="var(--warning)" /></div>
            <div className="stat-value">{openTickets.length}</div>
            <div className="stat-label">Open Tickets</div>
            <div className="stat-change down">↑ {openTickets.filter(t => t.urgency === 'High').length} high urgency</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><DollarSign size={18} color="var(--danger)" /></div>
            <div className="stat-value">{overdueInvoices.length}</div>
            <div className="stat-label">Overdue Payments</div>
          </div>
        </div>

        <div className="grid-2 mb-6">
          <div className="card">
            <div className="card-header"><div className="card-title">Rent Collection</div></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={RENT_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `$${v/1000}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => `S$${v.toLocaleString()}`} />
                  <Bar dataKey="collected" fill="var(--primary)" name="Collected" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Urgent Items</div></div>
            <div style={{ padding: '8px 0' }}>
              {[...openTickets.filter(t => t.urgency === 'High').slice(0,3), ...expiringLeases.slice(0,2)].map((item, i) => (
                <div key={i} style={{ padding: '10px 22px', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.urgency === 'High' ? 'var(--danger)' : 'var(--warning)', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.category || `Lease ${item.id}`}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{item.unitId} — {item.description?.slice(0,40) || `Expires ${item.endDate}`}...</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Pipeline */}
        <div className="card">
          <div className="card-header"><div className="card-title">Lead Pipeline</div><span className="badge badge-blue">{LEADS.length} total leads</span></div>
          <div className="card-body" style={{ padding: '12px 20px' }}>
            <div className="pipeline-stages">
              {['New Enquiry', 'Viewing Scheduled', 'Viewed', 'Application Submitted', 'Lease Signed'].map(stage => (
                <div key={stage} className="pipeline-stage">
                  <div className="pipeline-count">{LEADS.filter(l => l.status === stage).length}</div>
                  <div className="pipeline-label">{stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
