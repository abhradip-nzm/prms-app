import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { MAINTENANCE_TICKETS } from '../../data';
import { Briefcase, CheckCircle, Clock, DollarSign, AlertCircle, Upload } from 'lucide-react';

const STATUS_COLORS = { Open: 'badge-red', 'In Progress': 'badge-blue', 'Pending Parts': 'badge-yellow', Completed: 'badge-green', Invoiced: 'badge-gray' };

export default function ContractorDashboard() {
  const { currentUser } = useApp();
  const [jobs, setJobs] = useState(MAINTENANCE_TICKETS.filter(t => t.contractorId === currentUser?.id));
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState('');

  const updateJob = (id, updates) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppShell>
      <Topbar title="Contractor Portal" subtitle={`Welcome, ${currentUser?.name} · ${currentUser?.company}`} />
      <div className="page-body">

        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 22 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><Briefcase size={18} color="var(--primary)" /></div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><Clock size={18} color="var(--warning)" /></div>
            <div className="stat-value">{jobs.filter(j => j.status === 'In Progress').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={18} color="var(--success)" /></div>
            <div className="stat-value">{jobs.filter(j => j.status === 'Completed' || j.status === 'Invoiced').length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><DollarSign size={18} color="var(--success)" /></div>
            <div className="stat-value">S${jobs.filter(j => j.actualCost).reduce((s, j) => s + (j.actualCost || 0), 0).toLocaleString()}</div>
            <div className="stat-label">Total Earned</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.length === 0 ? (
            <div className="card"><div className="empty-state"><div className="empty-icon"><Briefcase size={24} /></div><div className="empty-title">No jobs assigned</div><div className="empty-desc">You'll see jobs here once assigned by the property manager.</div></div></div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="card" style={{ cursor: 'pointer' }} onClick={() => { setSelected(job); setNotes(job.notes || ''); setCost(job.actualCost || ''); }}>
                <div className="card-body" style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 12 }}>{job.id}</span>
                        <span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                        <span className={`badge ${job.urgency === 'High' ? 'badge-red' : job.urgency === 'Medium' ? 'badge-yellow' : 'badge-gray'}`}>{job.urgency}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{job.category} — {job.unitId}</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 8 }}>{job.description}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Submitted: {job.submittedAt} · Tenant: {job.tenantName}</div>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 20 }}>
                      {job.estimatedCost && <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Est: S${job.estimatedCost}</div>}
                      {job.actualCost && <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--success)' }}>S${job.actualCost}</div>}
                    </div>
                  </div>
                  {job.notes && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--primary-50)', borderRadius: 8, fontSize: 12, color: 'var(--primary)' }}>
                      📝 {job.notes}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Job Detail Modal */}
        {selected && (
          <Modal title={`Job ${selected.id} — ${selected.category}`} onClose={() => setSelected(null)} size="lg"
            footer={
              <>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
                {selected.status === 'In Progress' && (
                  <button className="btn btn-primary" onClick={() => updateJob(selected.id, { status: 'Completed', actualCost: parseInt(cost) || selected.estimatedCost, notes })}>
                    Mark Complete
                  </button>
                )}
                {selected.status === 'Completed' && (
                  <button className="btn btn-success" onClick={() => updateJob(selected.id, { status: 'Invoiced' })}>
                    <Upload size={13} /> Submit Invoice
                  </button>
                )}
              </>
            }
          >
            <div className="grid-2">
              <div>
                <div className="info-row"><div className="info-label">Unit</div><div className="info-value">{selected.unitId}</div></div>
                <div className="info-row"><div className="info-label">Tenant</div><div className="info-value">{selected.tenantName}</div></div>
                <div className="info-row"><div className="info-label">Category</div><div className="info-value">{selected.category}</div></div>
                <div className="info-row"><div className="info-label">Urgency</div><div className="info-value"><span className={`badge ${selected.urgency === 'High' ? 'badge-red' : 'badge-yellow'}`}>{selected.urgency}</span></div></div>
              </div>
              <div>
                <div className="info-row"><div className="info-label">Status</div><div className="info-value"><span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status}</span></div></div>
                <div className="info-row"><div className="info-label">Submitted</div><div className="info-value" style={{ fontSize: 12 }}>{selected.submittedAt}</div></div>
                <div className="info-row"><div className="info-label">Est. Cost</div><div className="info-value">{selected.estimatedCost ? `S$${selected.estimatedCost}` : '—'}</div></div>
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--gray-50)', borderRadius: 8, fontSize: 13, marginBottom: 16, marginTop: 8 }}>
              <strong>Fault Description:</strong> {selected.description}
            </div>

            {(selected.status === 'In Progress' || selected.status === 'Completed') && (
              <div>
                <div className="form-group">
                  <label className="form-label">Job Notes / Update</label>
                  <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe work done, parts used..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual Cost (S$)</label>
                  <input className="form-input" type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="Enter final cost" />
                </div>
              </div>
            )}

            {selected.status === 'Open' && (
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => updateJob(selected.id, { status: 'In Progress' })}>
                Accept & Start Job
              </button>
            )}
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
