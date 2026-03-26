import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { LEASES, UNITS, PROPERTIES, NOTIFICATIONS, VIEWING_SLOTS, LEADS } from '../../data';
import { Users, Bell, Calendar, DollarSign, CheckCircle, AlertCircle, Search } from 'lucide-react';

// ─── Tenants Page ───────────────────────────────────────────────────────────
export function TenantsPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const tenants = LEASES.filter(l => l.status === 'active');
  const filtered = tenants.filter(t => t.tenantName.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <Topbar title="Tenants" subtitle="All active tenants and their lease info" />
      <div className="page-body">
        <div className="flex-between mb-4">
          <div className="search-box">
            <Search size={14} color="var(--gray-400)" />
            <input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="badge badge-blue">{filtered.length} active tenants</span>
        </div>
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Tenant</th><th>Unit</th><th>Property</th><th>Lease Period</th><th>Monthly Rent</th><th>Expiry</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(l => {
                  const unit = UNITS.find(u => u.id === l.unitId);
                  const property = unit ? PROPERTIES.find(p => p.id === unit.propertyId) : null;
                  const daysLeft = Math.ceil((new Date(l.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={l.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(l)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar sm" style={{ background: `hsl(${l.tenantName.charCodeAt(0) * 15}, 60%, 55%)` }}>
                            {l.tenantName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{l.tenantName}</div>
                        </div>
                      </td>
                      <td>{l.unitId}</td>
                      <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{property?.name}</td>
                      <td style={{ fontSize: 12 }}>{l.startDate} → {l.endDate}</td>
                      <td><strong>S${l.monthlyRent.toLocaleString()}</strong></td>
                      <td>
                        <span style={{ fontSize: 12, color: daysLeft < 30 ? 'var(--danger)' : daysLeft < 90 ? 'var(--warning)' : 'var(--gray-400)', fontWeight: daysLeft < 90 ? 600 : 400 }}>
                          {daysLeft}d
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="btn btn-ghost btn-sm">View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <Modal title={`Tenant — ${selected.tenantName}`} onClose={() => setSelected(null)}>
            <div className="info-row"><div className="info-label">Lease ID</div><div className="info-value">{selected.id}</div></div>
            <div className="info-row"><div className="info-label">Unit</div><div className="info-value">{selected.unitId}</div></div>
            <div className="info-row"><div className="info-label">Monthly Rent</div><div className="info-value">S${selected.monthlyRent?.toLocaleString()}</div></div>
            <div className="info-row"><div className="info-label">Deposit</div><div className="info-value">S${selected.deposit?.toLocaleString()}</div></div>
            <div className="info-row"><div className="info-label">Lease Start</div><div className="info-value">{selected.startDate}</div></div>
            <div className="info-row"><div className="info-label">Lease End</div><div className="info-value">{selected.endDate}</div></div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm">Send Message</button>
              <button className="btn btn-ghost btn-sm">Generate Renewal</button>
            </div>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}

// ─── Notifications Page ────────────────────────────────────────────────────
export function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const SICONS = { error: '🔴', warning: '🟡', info: '🔵', success: '🟢' };

  return (
    <AppShell>
      <Topbar title="Notifications" subtitle="System alerts and updates"
        actions={<button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all read</button>}
      />
      <div className="page-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 700 }}>
          {notifs.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} className="card" style={{ cursor: 'pointer', opacity: n.read ? 0.65 : 1, borderLeft: `3px solid ${n.severity === 'error' ? 'var(--danger)' : n.severity === 'warning' ? 'var(--warning)' : n.severity === 'success' ? 'var(--success)' : 'var(--primary)'}` }}>
              <div className="card-body" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 20 }}>{SICONS[n.severity]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: 'var(--gray-800)' }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 3 }}>{n.date}</div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 5 }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

// ─── Viewing Scheduler Page ────────────────────────────────────────────────
export function ViewingSchedulerPage() {
  const [slots, setSlots] = useState(VIEWING_SLOTS);
  const [selected, setSelected] = useState(null);
  const [bookName, setBookName] = useState('');

  const bookSlot = (slotId) => {
    if (!bookName.trim()) return;
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'confirmed', leadName: bookName } : s));
    setSelected(null);
    setBookName('');
  };

  return (
    <AppShell>
      <Topbar title="Viewing Scheduler" subtitle="Manage property viewing appointments" />
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {slots.map(slot => (
            <div key={slot.id} className="card" style={{ cursor: 'pointer', borderTop: `3px solid ${slot.status === 'confirmed' ? 'var(--success)' : 'var(--primary)'}` }}
              onClick={() => slot.status === 'available' && setSelected(slot)}>
              <div className="card-body" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16 }}>{slot.time}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{slot.date}</div>
                  </div>
                  <span className={`badge ${slot.status === 'confirmed' ? 'badge-green' : 'badge-blue'}`}>{slot.status}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Unit {slot.unitId}</div>
                {slot.leadName ? (
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>👤 {slot.leadName}</div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>+ Book this slot</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <Modal title="Book Viewing Slot" onClose={() => setSelected(null)}
            footer={
              <>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => bookSlot(selected.id)} disabled={!bookName}>Confirm Booking</button>
              </>
            }
          >
            <div style={{ marginBottom: 16, padding: '12px', background: 'var(--primary-50)', borderRadius: 8, fontSize: 13 }}>
              📅 {selected.date} at {selected.time} — Unit {selected.unitId}
            </div>
            <div className="form-group">
              <label className="form-label">Lead Name</label>
              <input className="form-input" value={bookName} onChange={e => setBookName(e.target.value)} placeholder="Enter prospect name" />
            </div>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}

// ─── Rent Tracking Page ────────────────────────────────────────────────────
export function RentTrackingPage() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-001', tenant: 'Aisha Patel', unit: 'U-101', amount: 3500, due: '2026-04-01', status: 'pending' },
    { id: 'INV-002', tenant: 'Benjamin Teo', unit: 'U-102', amount: 2800, due: '2026-04-01', status: 'pending' },
    { id: 'INV-003', tenant: 'Chen Wei', unit: 'U-202', amount: 3600, due: '2026-03-01', paid: '2026-03-02', status: 'paid' },
    { id: 'INV-004', tenant: 'Diana Soh', unit: 'U-301', amount: 4200, due: '2026-03-01', paid: '2026-03-01', status: 'paid' },
    { id: 'INV-005', tenant: 'Eagle Corp Pte Ltd', unit: 'U-401', amount: 8500, due: '2026-03-01', status: 'overdue' },
  ]);

  const totalDue = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const overdueAmt = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const markPaid = (id) => setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid', paid: new Date().toISOString().split('T')[0] } : i));

  return (
    <AppShell>
      <Topbar title="Rent Tracking" subtitle="Monitor rent collection and arrears" />
      <div className="page-body">
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 22 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={18} color="var(--success)" /></div>
            <div className="stat-value">S${totalPaid.toLocaleString()}</div>
            <div className="stat-label">Collected</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><AlertCircle size={18} color="var(--danger)" /></div>
            <div className="stat-value">S${overdueAmt.toLocaleString()}</div>
            <div className="stat-label">Overdue Arrears</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><DollarSign size={18} color="var(--primary)" /></div>
            <div className="stat-value">{Math.round((totalPaid / (totalPaid + totalDue)) * 100)}%</div>
            <div className="stat-label">Collection Rate</div>
          </div>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Invoice</th><th>Tenant</th><th>Unit</th><th>Amount</th><th>Due Date</th><th>Paid Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {invoices.map(i => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{i.id}</td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{i.tenant}</td>
                    <td>{i.unit}</td>
                    <td><strong>S${i.amount.toLocaleString()}</strong></td>
                    <td style={{ fontSize: 12 }}>{i.due}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>{i.paid || '—'}</td>
                    <td><span className={`badge ${i.status === 'paid' ? 'badge-green' : i.status === 'overdue' ? 'badge-red' : 'badge-yellow'}`}>{i.status}</span></td>
                    <td>
                      {i.status !== 'paid' && <button className="btn btn-success btn-sm" onClick={() => markPaid(i.id)}>Mark Paid</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
