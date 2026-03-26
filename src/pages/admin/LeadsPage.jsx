import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { LEADS, PROPERTIES } from '../../data';
import { Plus, Search, Phone, Mail, Calendar, ChevronRight, User, Filter } from 'lucide-react';

const STAGES = ['New Enquiry', 'Viewing Scheduled', 'Viewed', 'Application Submitted', 'Lease Signed', 'Lost'];

const STATUS_BADGE = {
  'New Enquiry': 'badge-blue',
  'Viewing Scheduled': 'badge-yellow',
  'Viewed': 'badge-blue',
  'Application Submitted': 'badge-yellow',
  'Lease Signed': 'badge-green',
  'Lost': 'badge-gray',
};

export default function LeadsPage({ role = 'admin' }) {
  const [leads, setLeads] = useState(LEADS);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', unitInterest: '', propertyId: 'P-001', source: 'Website Chatbot', notes: '' });

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'All' || l.status === filterStage;
    return matchSearch && matchStage;
  });

  const stageCount = (stage) => leads.filter(l => l.status === stage).length;

  const handleAddLead = () => {
    const lead = { ...newLead, id: `L-00${leads.length + 1}`, status: 'New Enquiry', assignedTo: 'Marcus Lim', createdAt: new Date().toISOString().split('T')[0], viewingDate: null };
    setLeads(prev => [lead, ...prev]);
    setShowAdd(false);
    setNewLead({ name: '', email: '', phone: '', unitInterest: '', propertyId: 'P-001', source: 'Website Chatbot', notes: '' });
  };

  const advanceStage = (leadId) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      const idx = STAGES.indexOf(l.status);
      const next = idx < STAGES.length - 1 ? STAGES[idx + 1] : l.status;
      return { ...l, status: next };
    }));
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => {
        const idx = STAGES.indexOf(prev.status);
        return { ...prev, status: idx < STAGES.length - 1 ? STAGES[idx + 1] : prev.status };
      });
    }
  };

  return (
    <AppShell>
      <Topbar
        title="Leads & Pipeline"
        subtitle="Track lead journey from enquiry to lease"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add Lead
          </button>
        }
      />
      <div className="page-body">

        {/* Pipeline Stages */}
        <div className="card mb-6">
          <div className="card-body" style={{ padding: '16px 20px' }}>
            <div className="pipeline-stages">
              {STAGES.filter(s => s !== 'Lost').map(stage => (
                <div
                  key={stage}
                  className={`pipeline-stage ${filterStage === stage ? 'active' : ''}`}
                  onClick={() => setFilterStage(filterStage === stage ? 'All' : stage)}
                >
                  <div className="pipeline-count">{stageCount(stage)}</div>
                  <div className="pipeline-label">{stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-between mb-4">
          <div className="search-box">
            <Search size={14} color="var(--gray-400)" />
            <input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <select className="form-select" style={{ width: 160, padding: '7px 10px' }} value={filterStage} onChange={e => setFilterStage(e.target.value)}>
              <option value="All">All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Interest</th>
                  <th>Source</th>
                  <th>Stage</th>
                  <th>Viewing</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedLead(lead)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar sm" style={{ background: `hsl(${lead.name.charCodeAt(0) * 15}, 60%, 55%)` }}>
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: 13 }}>{lead.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{lead.unitInterest}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{PROPERTIES.find(p => p.id === lead.propertyId)?.name}</div>
                    </td>
                    <td><span className="badge badge-gray">{lead.source}</span></td>
                    <td><span className={`badge ${STATUS_BADGE[lead.status]}`}>{lead.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{lead.viewingDate || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>{lead.createdAt}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" onClick={() => advanceStage(lead.id)} disabled={lead.status === 'Lease Signed' || lead.status === 'Lost'}>
                        Advance →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <Modal title={`Lead — ${selectedLead.name}`} onClose={() => setSelectedLead(null)} size="lg"
            footer={
              <>
                <button className="btn btn-ghost" onClick={() => setSelectedLead(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => advanceStage(selectedLead.id)}
                  disabled={selectedLead.status === 'Lease Signed' || selectedLead.status === 'Lost'}>
                  Advance Stage →
                </button>
              </>
            }
          >
            {/* Progress Steps */}
            <div style={{ marginBottom: 24 }}>
              <div className="steps">
                {STAGES.filter(s => s !== 'Lost').map((stage, i) => {
                  const idx = STAGES.indexOf(selectedLead.status);
                  const stepIdx = STAGES.filter(s => s !== 'Lost').indexOf(stage);
                  const isDone = stepIdx < (idx === -1 ? 999 : (selectedLead.status === 'Lost' ? -1 : STAGES.filter(s => s !== 'Lost').indexOf(selectedLead.status)));
                  const isActive = stage === selectedLead.status;
                  return (
                    <div key={stage} className="step" style={{ flex: 1 }}>
                      <div className="step-row" style={{ width: '100%', alignItems: 'center' }}>
                        <div className={`step-circle ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>{isDone ? '✓' : i + 1}</div>
                        {i < 4 && <div className={`step-connector ${isDone ? 'done' : ''}`} style={{ flex: 1 }} />}
                      </div>
                      <div className="step-label">{stage}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid-2">
              <div>
                <div className="info-row"><div className="info-label">Full Name</div><div className="info-value">{selectedLead.name}</div></div>
                <div className="info-row"><div className="info-label">Email</div><div className="info-value">{selectedLead.email}</div></div>
                <div className="info-row"><div className="info-label">Phone</div><div className="info-value">{selectedLead.phone}</div></div>
                <div className="info-row"><div className="info-label">Source</div><div className="info-value">{selectedLead.source}</div></div>
              </div>
              <div>
                <div className="info-row"><div className="info-label">Unit Interest</div><div className="info-value">{selectedLead.unitInterest}</div></div>
                <div className="info-row"><div className="info-label">Property</div><div className="info-value">{PROPERTIES.find(p => p.id === selectedLead.propertyId)?.name}</div></div>
                <div className="info-row"><div className="info-label">Viewing Date</div><div className="info-value">{selectedLead.viewingDate || 'Not scheduled'}</div></div>
                <div className="info-row"><div className="info-label">Current Stage</div><div className="info-value"><span className={`badge ${STATUS_BADGE[selectedLead.status]}`}>{selectedLead.status}</span></div></div>
              </div>
            </div>
            {selectedLead.notes && (
              <div style={{ marginTop: 16, padding: '12px', background: 'var(--gray-50)', borderRadius: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                <strong>Notes:</strong> {selectedLead.notes}
              </div>
            )}
          </Modal>
        )}

        {/* Add Lead Modal */}
        {showAdd && (
          <Modal title="Add New Lead" onClose={() => setShowAdd(false)}
            footer={
              <>
                <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddLead} disabled={!newLead.name || !newLead.email}>Add Lead</button>
              </>
            }
          >
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} placeholder="+65 9xxx xxxx" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} placeholder="john@email.com" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Unit Interest</label>
                <select className="form-select" value={newLead.unitInterest} onChange={e => setNewLead(p => ({ ...p, unitInterest: e.target.value }))}>
                  <option value="">Select type</option>
                  {['Studio', '1BR', '2BR', '3BR', 'Office'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Property</label>
                <select className="form-select" value={newLead.propertyId} onChange={e => setNewLead(p => ({ ...p, propertyId: e.target.value }))}>
                  {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Source</label>
              <select className="form-select" value={newLead.source} onChange={e => setNewLead(p => ({ ...p, source: e.target.value }))}>
                {['Website Chatbot', 'WhatsApp', 'Email', 'Referral', 'Walk-in'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" value={newLead.notes} onChange={e => setNewLead(p => ({ ...p, notes: e.target.value }))} placeholder="Additional notes..." />
            </div>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
