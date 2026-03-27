import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { MAINTENANCE_TICKETS } from '../../data';
import { Search, Briefcase, CheckCircle, Clock, AlertCircle, Upload, Filter } from 'lucide-react';

const STATUS_COLORS = {
  Open:          'badge-red',
  'In Progress': 'badge-blue',
  'Pending Parts':'badge-yellow',
  Completed:     'badge-green',
  Invoiced:      'badge-gray',
};

const URGENCY_COLORS = {
  High:   'badge-red',
  Medium: 'badge-yellow',
  Low:    'badge-gray',
};

const STATUS_TABS = ['All', 'Open', 'In Progress', 'Pending Parts', 'Completed', 'Invoiced'];

export default function ContractorJobs() {
  const { currentUser } = useApp();
  const [jobs, setJobs]         = useState(MAINTENANCE_TICKETS.filter(t => t.contractorId === currentUser?.id));
  const [selected, setSelected] = useState(null);
  const [notes, setNotes]       = useState('');
  const [cost, setCost]         = useState('');
  const [search, setSearch]     = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  const updateJob = (id, updates) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
  };

  const filtered = jobs.filter(j => {
    const matchSearch = search === '' ||
      j.id.toLowerCase().includes(search.toLowerCase()) ||
      j.category.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase()) ||
      j.unitId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusTab === 'All' || j.status === statusTab;
    const matchUrgency = urgencyFilter === 'all' || j.urgency === urgencyFilter;
    return matchSearch && matchStatus && matchUrgency;
  });

  const counts = STATUS_TABS.slice(1).reduce((acc, s) => ({ ...acc, [s]: jobs.filter(j => j.status === s).length }), {});
  const totalEarned = jobs.filter(j => j.actualCost).reduce((s, j) => s + (j.actualCost || 0), 0);

  return (
    <AppShell>
      <Topbar title="My Jobs" subtitle={`${currentUser?.company} · Job management`} />
      <div className="page-body">

        {/* Stats row */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 22 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><Briefcase size={18} color="var(--primary)" /></div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><AlertCircle size={18} color="var(--danger)" /></div>
            <div className="stat-value">{counts['Open'] || 0}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><Clock size={18} color="var(--warning)" /></div>
            <div className="stat-value">{counts['In Progress'] || 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={18} color="var(--success)" /></div>
            <div className="stat-value">S${totalEarned.toLocaleString()}</div>
            <div className="stat-label">Total Earned</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
            <Search size={14} color="var(--gray-400)" />
            <input placeholder="Search by ID, category, unit…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} color="var(--gray-400)" />
            <select
              style={{ fontSize: 12, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              value={urgencyFilter}
              onChange={e => setUrgencyFilter(e.target.value)}
            >
              <option value="all">All Urgencies</option>
              <option value="High">High Urgency</option>
              <option value="Medium">Medium Urgency</option>
              <option value="Low">Low Urgency</option>
            </select>
          </div>
        </div>

        {/* Status tabs */}
        <div className="tabs" style={{ marginBottom: 18 }}>
          {STATUS_TABS.map(s => (
            <div key={s} className={`tab ${statusTab === s ? 'active' : ''}`} onClick={() => setStatusTab(s)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {s}
              {s !== 'All' && counts[s] > 0 && (
                <span style={{ background: statusTab === s ? 'var(--primary)' : 'var(--gray-200)', color: statusTab === s ? 'white' : 'var(--gray-600)', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>
                  {counts[s]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Jobs list */}
        {filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon"><Briefcase size={28} /></div>
              <div className="empty-title">{jobs.length === 0 ? 'No jobs assigned yet' : 'No jobs match your filter'}</div>
              <div className="empty-desc">{jobs.length === 0 ? 'You\'ll see jobs here once assigned by the property manager.' : 'Try adjusting your search or filter criteria.'}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(job => (
              <div
                key={job.id}
                className="card"
                style={{ cursor: 'pointer', borderLeft: `4px solid ${job.urgency === 'High' ? 'var(--danger)' : job.urgency === 'Medium' ? 'var(--warning)' : 'var(--gray-200)'}`, transition: 'box-shadow 0.15s' }}
                onClick={() => { setSelected(job); setNotes(job.notes || ''); setCost(job.actualCost || ''); }}
              >
                <div className="card-body" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{job.id}</span>
                        <span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                        <span className={`badge ${URGENCY_COLORS[job.urgency]}`}>{job.urgency} Priority</span>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-900)', marginBottom: 4 }}>
                        {job.category}
                        <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: 13 }}> — Unit {job.unitId}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 8, lineHeight: 1.5 }}>
                        {job.description}
                      </div>

                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>👤 Tenant: <strong>{job.tenantName}</strong></div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>📅 Submitted: {job.submittedAt?.split(' ')[0] || job.submittedAt}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {job.estimatedCost && (
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>
                          Est: <strong>S${job.estimatedCost}</strong>
                        </div>
                      )}
                      {job.actualCost && (
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)' }}>
                          S${job.actualCost}
                        </div>
                      )}
                      <div style={{ marginTop: 8 }}>
                        {job.status === 'Open' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={e => { e.stopPropagation(); updateJob(job.id, { status: 'In Progress' }); }}
                          >
                            Accept Job
                          </button>
                        )}
                        {job.status === 'Completed' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={e => { e.stopPropagation(); updateJob(job.id, { status: 'Invoiced' }); }}
                          >
                            <Upload size={12} /> Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {job.notes && (
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--primary-50)', borderRadius: 8, fontSize: 12, color: 'var(--primary)' }}>
                      📝 <strong>Latest update:</strong> {job.notes}
                    </div>
                  )}

                  {/* Progress indicator */}
                  <div style={{ display: 'flex', gap: 0, marginTop: 12, borderRadius: 6, overflow: 'hidden', height: 4 }}>
                    {['Open', 'In Progress', 'Completed', 'Invoiced'].map((stage, i, arr) => {
                      const statusOrder = ['Open', 'In Progress', 'Pending Parts', 'Completed', 'Invoiced'];
                      const current = statusOrder.indexOf(job.status);
                      const thisIdx = statusOrder.indexOf(stage);
                      const done = thisIdx <= current;
                      return (
                        <div key={stage} style={{ flex: 1, background: done ? 'var(--primary)' : 'var(--gray-200)', marginRight: i < arr.length - 1 ? 2 : 0 }} />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Job Detail Modal ── */}
        {selected && (
          <Modal
            title={`Job ${selected.id} — ${selected.category}`}
            onClose={() => setSelected(null)}
            size="lg"
            footer={
              <>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
                {selected.status === 'Open' && (
                  <button className="btn btn-primary" onClick={() => updateJob(selected.id, { status: 'In Progress' })}>
                    Accept &amp; Start Job
                  </button>
                )}
                {selected.status === 'In Progress' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => updateJob(selected.id, { status: 'Completed', actualCost: parseInt(cost) || selected.estimatedCost, notes })}
                    disabled={!notes}
                  >
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
            {/* Info grid */}
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div>
                <div className="info-row"><div className="info-label">Job ID</div><div className="info-value" style={{ fontWeight: 700, color: 'var(--primary)' }}>{selected.id}</div></div>
                <div className="info-row"><div className="info-label">Unit</div><div className="info-value">{selected.unitId}</div></div>
                <div className="info-row"><div className="info-label">Tenant</div><div className="info-value">{selected.tenantName}</div></div>
                <div className="info-row"><div className="info-label">Category</div><div className="info-value">{selected.category}</div></div>
              </div>
              <div>
                <div className="info-row">
                  <div className="info-label">Status</div>
                  <div className="info-value"><span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status}</span></div>
                </div>
                <div className="info-row">
                  <div className="info-label">Urgency</div>
                  <div className="info-value"><span className={`badge ${URGENCY_COLORS[selected.urgency]}`}>{selected.urgency}</span></div>
                </div>
                <div className="info-row"><div className="info-label">Submitted</div><div className="info-value" style={{ fontSize: 12 }}>{selected.submittedAt}</div></div>
                <div className="info-row"><div className="info-label">Est. Cost</div><div className="info-value">{selected.estimatedCost ? `S$${selected.estimatedCost}` : '—'}</div></div>
              </div>
            </div>

            {/* Fault description */}
            <div style={{ padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 8, fontSize: 13, marginBottom: 16, lineHeight: 1.6, border: '1px solid var(--gray-100)' }}>
              <strong style={{ color: 'var(--gray-700)' }}>Fault Description</strong><br />
              {selected.description}
            </div>

            {/* Progress steps */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, left: '12.5%', right: '12.5%', height: 2, background: 'var(--gray-200)', zIndex: 0 }} />
              {['Open', 'In Progress', 'Completed', 'Invoiced'].map(stage => {
                const order = ['Open', 'In Progress', 'Pending Parts', 'Completed', 'Invoiced'];
                const done = order.indexOf(selected.status) >= order.indexOf(stage);
                return (
                  <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1, flex: 1 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: done ? 'var(--primary)' : 'white', border: `2px solid ${done ? 'var(--primary)' : 'var(--gray-300)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {done && <CheckCircle size={14} color="white" />}
                    </div>
                    <div style={{ fontSize: 11, color: done ? 'var(--primary)' : 'var(--gray-400)', fontWeight: done ? 600 : 400, textAlign: 'center' }}>{stage}</div>
                  </div>
                );
              })}
            </div>

            {/* Work notes + cost form (shown when in progress or completed) */}
            {(selected.status === 'In Progress' || selected.status === 'Completed') && (
              <div>
                <div className="form-group">
                  <label className="form-label">Job Notes / Work Update {selected.status === 'In Progress' ? '*' : ''}</label>
                  <textarea
                    className="form-textarea"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Describe work done, parts used, observations…"
                    style={{ minHeight: 80 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual Cost (S$)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    placeholder={selected.estimatedCost ? `Estimate: S$${selected.estimatedCost}` : 'Enter final cost'}
                  />
                </div>
              </div>
            )}

            {selected.status === 'Open' && (
              <div style={{ padding: '14px 16px', background: 'var(--warning-light)', borderRadius: 10, fontSize: 13, color: 'var(--gray-700)', border: '1px solid #fde68a' }}>
                ⚡ Click <strong>Accept &amp; Start Job</strong> to begin work and update the status to In Progress.
              </div>
            )}

            {selected.status === 'Invoiced' && (
              <div style={{ padding: '14px 16px', background: 'var(--success-light)', borderRadius: 10, fontSize: 13, color: 'var(--success)', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} />
                Invoice submitted. Final amount: <strong>S${selected.actualCost}</strong>
              </div>
            )}
          </Modal>
        )}

      </div>
    </AppShell>
  );
}
