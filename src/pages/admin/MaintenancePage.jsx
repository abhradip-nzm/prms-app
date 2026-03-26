import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { MAINTENANCE_TICKETS, USERS } from '../../data';
import { Wrench, Plus, AlertCircle, Clock, CheckCircle, Search, Filter } from 'lucide-react';

const STATUS_COLORS = { Open: 'badge-red', 'In Progress': 'badge-blue', 'Pending Parts': 'badge-yellow', Completed: 'badge-green', Invoiced: 'badge-gray' };
const URGENCY_COLORS = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-gray' };
const STATUSES = ['Open', 'In Progress', 'Pending Parts', 'Completed', 'Invoiced'];

const contractors = USERS.filter(u => u.role === 'contractor');

export default function MaintenancePage() {
  const [tickets, setTickets] = useState(MAINTENANCE_TICKETS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newTicket, setNewTicket] = useState({ unitId: '', category: 'Plumbing', description: '', urgency: 'Medium', photos: false });

  const filtered = tickets.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.unitId.toLowerCase().includes(search.toLowerCase()) || t.tenantName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const advanceStatus = (id) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== id) return t;
      const idx = STATUSES.indexOf(t.status);
      return { ...t, status: idx < STATUSES.length - 1 ? STATUSES[idx + 1] : t.status };
    }));
    if (selected?.id === id) setSelected(prev => {
      const idx = STATUSES.indexOf(prev.status);
      return { ...prev, status: idx < STATUSES.length - 1 ? STATUSES[idx + 1] : prev.status };
    });
  };

  const assignContractor = (id, contractorId) => {
    const c = contractors.find(c => c.id === parseInt(contractorId));
    setTickets(prev => prev.map(t => t.id === id ? { ...t, assignedTo: c?.name, contractorId: c?.id, status: 'In Progress' } : t));
    if (selected?.id === id) setSelected(prev => ({ ...prev, assignedTo: c?.name, contractorId: c?.id, status: 'In Progress' }));
  };

  const handleCreateTicket = () => {
    const t = { ...newTicket, id: `MT-00${tickets.length + 1}`, tenantName: 'Manual Entry', submittedAt: new Date().toLocaleString(), assignedTo: null, contractorId: null, estimatedCost: null, actualCost: null, notes: '' };
    setTickets(prev => [t, ...prev]);
    setShowNew(false);
    setNewTicket({ unitId: '', category: 'Plumbing', description: '', urgency: 'Medium', photos: false });
  };

  return (
    <AppShell>
      <Topbar title="Maintenance & Faults" subtitle="Track and manage all maintenance requests"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>
            <Plus size={14} /> New Ticket
          </button>
        }
      />
      <div className="page-body">

        {/* Stats */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
          {STATUSES.map((status, i) => {
            const count = tickets.filter(t => t.status === status).length;
            const colors = [['var(--danger)', 'var(--danger-light)'], ['var(--primary)', 'var(--primary-50)'], ['var(--warning)', 'var(--warning-light)'], ['var(--success)', 'var(--success-light)'], ['var(--gray-500)', 'var(--gray-100)']];
            return (
              <div key={status} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilterStatus(filterStatus === status ? 'All' : status)}>
                <div className="stat-value" style={{ color: colors[i][0] }}>{count}</div>
                <div className="stat-label">{status}</div>
              </div>
            );
          })}
        </div>

        <div className="flex-between mb-4">
          <div className="search-box">
            <Search size={14} color="var(--gray-400)" />
            <input placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 160, padding: '7px 10px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Unit / Tenant</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(t)}>
                    <td><span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{t.id}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{t.unitId}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{t.tenantName}</div>
                    </td>
                    <td><span className="badge badge-gray">{t.category}</span></td>
                    <td style={{ maxWidth: 180 }}>
                      <div className="truncate" style={{ fontSize: 12, maxWidth: 180 }}>{t.description}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{t.submittedAt.split(' ')[0]}</div>
                    </td>
                    <td><span className={`badge ${URGENCY_COLORS[t.urgency]}`}>{t.urgency}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[t.status]}`}>{t.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--gray-600)' }}>{t.assignedTo || <span style={{ color: 'var(--gray-400)' }}>Unassigned</span>}</td>
                    <td style={{ fontSize: 12 }}>
                      {t.actualCost ? <strong>S${t.actualCost}</strong> : t.estimatedCost ? <span style={{ color: 'var(--gray-400)' }}>est. ${t.estimatedCost}</span> : '—'}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" onClick={() => advanceStatus(t.id)} disabled={t.status === 'Invoiced'}>→</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Detail Modal */}
        {selected && (
          <Modal title={`Ticket ${selected.id}`} onClose={() => setSelected(null)} size="lg"
            footer={
              <>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => advanceStatus(selected.id)} disabled={selected.status === 'Invoiced'}>
                  Advance Status →
                </button>
              </>
            }
          >
            {/* Job Lifecycle Steps */}
            <div style={{ display: 'flex', marginBottom: 24, overflowX: 'auto' }}>
              {STATUSES.map((s, i) => {
                const idx = STATUSES.indexOf(selected.status);
                return (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div className={`step-circle ${i < idx ? 'done' : i === idx ? 'active' : 'pending'}`} style={{ fontSize: 10 }}>
                        {i < idx ? '✓' : i + 1}
                      </div>
                      {i < STATUSES.length - 1 && <div className={`step-connector ${i < idx ? 'done' : ''}`} style={{ flex: 1 }} />}
                    </div>
                    <div className="step-label" style={{ fontSize: 9 }}>{s}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid-2">
              <div>
                <div className="info-row"><div className="info-label">Unit</div><div className="info-value">{selected.unitId}</div></div>
                <div className="info-row"><div className="info-label">Tenant</div><div className="info-value">{selected.tenantName}</div></div>
                <div className="info-row"><div className="info-label">Category</div><div className="info-value">{selected.category}</div></div>
                <div className="info-row"><div className="info-label">Urgency</div><div className="info-value"><span className={`badge ${URGENCY_COLORS[selected.urgency]}`}>{selected.urgency}</span></div></div>
              </div>
              <div>
                <div className="info-row"><div className="info-label">Status</div><div className="info-value"><span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status}</span></div></div>
                <div className="info-row"><div className="info-label">Submitted</div><div className="info-value">{selected.submittedAt}</div></div>
                <div className="info-row"><div className="info-label">Est. Cost</div><div className="info-value">{selected.estimatedCost ? `S$${selected.estimatedCost}` : '—'}</div></div>
                <div className="info-row"><div className="info-label">Actual Cost</div><div className="info-value">{selected.actualCost ? `S$${selected.actualCost}` : 'Pending'}</div></div>
              </div>
            </div>

            <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 8, fontSize: 13 }}>
              <strong>Description:</strong> {selected.description}
            </div>
            {selected.notes && (
              <div style={{ marginTop: 8, padding: '10px 14px', background: 'var(--primary-50)', borderRadius: 8, fontSize: 13 }}>
                <strong>Notes:</strong> {selected.notes}
              </div>
            )}

            {/* Assign Contractor */}
            {!selected.assignedTo && (
              <div style={{ marginTop: 16 }}>
                <label className="form-label">Assign Contractor</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select className="form-select" onChange={e => assignContractor(selected.id, e.target.value)} defaultValue="">
                    <option value="">Select contractor</option>
                    {contractors.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
                  </select>
                </div>
              </div>
            )}
          </Modal>
        )}

        {/* New Ticket Modal */}
        {showNew && (
          <Modal title="Create Maintenance Ticket" onClose={() => setShowNew(false)}
            footer={
              <>
                <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateTicket} disabled={!newTicket.unitId || !newTicket.description}>Create Ticket</button>
              </>
            }
          >
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Unit ID *</label>
                <input className="form-input" value={newTicket.unitId} onChange={e => setNewTicket(p => ({ ...p, unitId: e.target.value }))} placeholder="e.g. U-101" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={newTicket.category} onChange={e => setNewTicket(p => ({ ...p, category: e.target.value }))}>
                  {['Plumbing', 'Electrical', 'Air Conditioning', 'General', 'Structural'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" value={newTicket.description} onChange={e => setNewTicket(p => ({ ...p, description: e.target.value }))} placeholder="Describe the fault in detail..." />
            </div>
            <div className="form-group">
              <label className="form-label">Urgency Level</label>
              <select className="form-select" value={newTicket.urgency} onChange={e => setNewTicket(p => ({ ...p, urgency: e.target.value }))}>
                {['Low', 'Medium', 'High'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
