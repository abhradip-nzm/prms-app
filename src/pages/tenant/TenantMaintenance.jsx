import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { MAINTENANCE_TICKETS } from '../../data';
import { Wrench, Plus, Camera, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const STATUS_COLORS = { Open: 'badge-red', 'In Progress': 'badge-blue', 'Pending Parts': 'badge-yellow', Completed: 'badge-green', Invoiced: 'badge-gray' };

export default function TenantMaintenance() {
  const { currentUser } = useApp();
  const [tickets, setTickets] = useState(MAINTENANCE_TICKETS.filter(t => t.tenantId === currentUser?.id));
  const [showNew, setShowNew] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ category: 'Plumbing', description: '', urgency: 'Medium', hasPhoto: false });

  const handleSubmit = () => {
    const t = {
      id: `MT-00${MAINTENANCE_TICKETS.length + tickets.length + 1}`,
      unitId: 'U-101',
      tenantId: currentUser?.id,
      tenantName: currentUser?.name,
      ...form,
      status: 'Open',
      submittedAt: new Date().toLocaleString(),
      assignedTo: null, contractorId: null, estimatedCost: null, actualCost: null,
      photos: form.hasPhoto, notes: ''
    };
    setTickets(prev => [t, ...prev]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowNew(false); setForm({ category: 'Plumbing', description: '', urgency: 'Medium', hasPhoto: false }); }, 2000);
  };

  return (
    <AppShell>
      <Topbar
        title="Report a Fault"
        subtitle="Submit and track your maintenance requests"
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}><Plus size={14} /> New Request</button>}
      />
      <div className="page-body">

        {/* QR Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary-50), var(--accent-light))', border: '1px solid var(--primary-200)', borderRadius: 14, padding: '18px 22px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--gray-200)', flexShrink: 0 }}>
            <div style={{ fontSize: 9, textAlign: 'center', color: 'var(--gray-400)', lineHeight: 1.4 }}>QR<br/>U-101</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--primary)', marginBottom: 4 }}>Unit U-101 Fault Portal</div>
            <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>Scan the QR code posted in your unit bathroom/kitchen, or use the button above to report faults instantly. We'll acknowledge within minutes.</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 22 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><AlertCircle size={18} color="var(--danger)" /></div>
            <div className="stat-value">{tickets.filter(t => t.status === 'Open').length}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><Clock size={18} color="var(--primary)" /></div>
            <div className="stat-value">{tickets.filter(t => t.status === 'In Progress' || t.status === 'Pending Parts').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={18} color="var(--success)" /></div>
            <div className="stat-value">{tickets.filter(t => t.status === 'Completed' || t.status === 'Invoiced').length}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        {/* Ticket List */}
        {tickets.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon"><Wrench size={24} /></div>
              <div className="empty-title">No maintenance requests</div>
              <div className="empty-desc">Your unit is in great shape! Submit a request if anything needs attention.</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setShowNew(true)}><Plus size={13} /> Report a Fault</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tickets.map(t => (
              <div key={t.id} className="card">
                <div className="card-body" style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 12 }}>{t.id}</span>
                        <span className={`badge ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                        <span className={`badge ${t.urgency === 'High' ? 'badge-red' : t.urgency === 'Medium' ? 'badge-yellow' : 'badge-gray'}`}>{t.urgency}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-900)' }}>{t.category}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{t.submittedAt?.split(' ')[0] || t.submittedAt}</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 10 }}>{t.description}</div>

                  {/* Timeline */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['Open', 'In Progress', 'Pending Parts', 'Completed'].map((stage, i) => {
                      const statuses = ['Open', 'In Progress', 'Pending Parts', 'Completed', 'Invoiced'];
                      const current = statuses.indexOf(t.status);
                      const stageIdx = statuses.indexOf(stage);
                      return (
                        <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: stageIdx <= current ? 'var(--primary)' : 'var(--gray-300)' }} />
                          <span style={{ fontSize: 11, color: stageIdx <= current ? 'var(--primary)' : 'var(--gray-400)', fontWeight: stageIdx === current ? 700 : 400 }}>{stage}</span>
                          {i < 3 && <div style={{ width: 20, height: 1, background: stageIdx < current ? 'var(--primary)' : 'var(--gray-200)' }} />}
                        </div>
                      );
                    })}
                  </div>

                  {t.assignedTo && (
                    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--gray-500)' }}>
                      👷 Assigned to: <strong>{t.assignedTo}</strong>
                    </div>
                  )}
                  {t.notes && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--primary-50)', borderRadius: 8, fontSize: 12, color: 'var(--primary)' }}>
                      📋 Update: {t.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Ticket Modal */}
        {showNew && (
          <Modal title="Report a Fault" onClose={() => setShowNew(false)}
            footer={
              submitted ? null : (
                <>
                  <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.description}>Submit Request</button>
                </>
              )
            }
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 60, height: 60, background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={28} color="var(--success)" />
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Request Submitted!</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>You'll receive a confirmation via email and WhatsApp shortly.</div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--primary-50)', borderRadius: 8, fontSize: 13, color: 'var(--primary)' }}>
                  📍 Reporting for: <strong>Unit U-101, Marina Bay Residences</strong>
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {['Plumbing', 'Electrical', 'Air Conditioning', 'General', 'Structural', 'Appliances'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Please describe the fault in detail. Include when it started and how it affects you." style={{ minHeight: 100 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency Level</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {['Low', 'Medium', 'High'].map(u => (
                      <button key={u} type="button" onClick={() => setForm(p => ({ ...p, urgency: u }))}
                        style={{ padding: '10px', borderRadius: 8, border: `1.5px solid ${form.urgency === u ? (u === 'High' ? 'var(--danger)' : u === 'Medium' ? 'var(--warning)' : 'var(--success)') : 'var(--gray-200)'}`, background: form.urgency === u ? (u === 'High' ? 'var(--danger-light)' : u === 'Medium' ? 'var(--warning-light)' : 'var(--success-light)') : 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>
                        {u === 'High' ? '🔴' : u === 'Medium' ? '🟡' : '🟢'} {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Photos</label>
                  <div style={{ border: '2px dashed var(--gray-200)', borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer', background: form.hasPhoto ? 'var(--success-light)' : 'var(--gray-50)' }}
                    onClick={() => setForm(p => ({ ...p, hasPhoto: !p.hasPhoto }))}>
                    <Camera size={22} color={form.hasPhoto ? 'var(--success)' : 'var(--gray-400)'} style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: 13, color: form.hasPhoto ? 'var(--success)' : 'var(--gray-400)', fontWeight: 600 }}>
                      {form.hasPhoto ? '✓ Photo attached' : 'Click to attach photo (optional)'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
