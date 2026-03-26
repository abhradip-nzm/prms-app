import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { LEASES, UNITS, LEADS } from '../../data';
import { FileText, Plus, Download, Send, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';

const STATUS_BADGE = { active: 'badge-green', expired: 'badge-red', pending: 'badge-yellow' };

const LEASE_STEPS = ['Generate Document', 'Review & Approve', 'Send for Signing', 'Countersign', 'Archive'];

export default function LeasingPage() {
  const [leases, setLeases] = useState(LEASES);
  const [tab, setTab] = useState('active');
  const [showNew, setShowNew] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [newLeaseStep, setNewLeaseStep] = useState(0);
  const [newLease, setNewLease] = useState({ tenantName: '', unitId: '', startDate: '', endDate: '', monthlyRent: '', deposit: '' });
  const [signStatus, setSignStatus] = useState({});

  const filtered = leases.filter(l => tab === 'active' ? l.status === 'active' : l.status !== 'active');
  const expiringLeases = leases.filter(l => {
    if (!l.renewalAlert) return false;
    const days = Math.ceil((new Date(l.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 90 && days > 0;
  });

  const handleCreateLease = () => {
    if (newLeaseStep < LEASE_STEPS.length - 1) { setNewLeaseStep(s => s + 1); return; }
    const lease = { ...newLease, id: `LS-00${leases.length + 1}`, status: 'active', signedDate: new Date().toISOString().split('T')[0], renewalAlert: false };
    setLeases(prev => [lease, ...prev]);
    setShowNew(false);
    setNewLeaseStep(0);
    setNewLease({ tenantName: '', unitId: '', startDate: '', endDate: '', monthlyRent: '', deposit: '' });
  };

  const handleSign = (leaseId, party) => {
    setSignStatus(prev => ({ ...prev, [`${leaseId}_${party}`]: 'signed' }));
  };

  return (
    <AppShell>
      <Topbar title="Leasing" subtitle="Manage tenancy agreements and digital signing"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>
            <Plus size={14} /> New Lease
          </button>
        }
      />
      <div className="page-body">

        {/* Expiry Alerts */}
        {expiringLeases.length > 0 && (
          <div style={{ background: 'var(--warning-light)', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={18} color="var(--warning)" />
            <div>
              <strong style={{ fontSize: 13 }}>Lease Renewal Alert</strong>
              <span style={{ fontSize: 13, marginLeft: 8, color: 'var(--gray-600)' }}>
                {expiringLeases.length} lease{expiringLeases.length > 1 ? 's' : ''} expiring soon — action required
              </span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={18} color="var(--success)" /></div>
            <div className="stat-value">{leases.filter(l => l.status === 'active').length}</div>
            <div className="stat-label">Active Leases</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><Clock size={18} color="var(--warning)" /></div>
            <div className="stat-value">{expiringLeases.length}</div>
            <div className="stat-label">Expiring Soon</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><FileText size={18} color="var(--primary)" /></div>
            <div className="stat-value">S${leases.reduce((s, l) => s + l.deposit, 0).toLocaleString()}</div>
            <div className="stat-label">Total Deposits Held</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)' }}><CheckCircle size={18} color="var(--primary)" /></div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Signed Digitally</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>Active Leases</div>
          <div className={`tab ${tab === 'other' ? 'active' : ''}`} onClick={() => setTab('other')}>Other</div>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Lease ID</th>
                  <th>Tenant</th>
                  <th>Unit</th>
                  <th>Period</th>
                  <th>Monthly Rent</th>
                  <th>Deposit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lease => {
                  const unit = UNITS.find(u => u.id === lease.unitId);
                  const daysLeft = Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={lease.id}>
                      <td><span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{lease.id}</span></td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{lease.tenantName}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Signed {lease.signedDate}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13 }}>{lease.unitId}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{unit?.type}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>{lease.startDate} →</div>
                        <div style={{ fontSize: 12, color: daysLeft < 30 ? 'var(--danger)' : daysLeft < 90 ? 'var(--warning)' : 'var(--gray-400)' }}>
                          {lease.endDate} {daysLeft > 0 ? `(${daysLeft}d left)` : '(expired)'}
                        </div>
                      </td>
                      <td><strong>S${lease.monthlyRent.toLocaleString()}</strong></td>
                      <td>S${lease.deposit.toLocaleString()}</td>
                      <td><span className={`badge ${STATUS_BADGE[lease.status] || 'badge-gray'}`}>{lease.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setShowDetail(lease)}><Eye size={12} /></button>
                          <button className="btn btn-ghost btn-sm"><Download size={12} /></button>
                          {daysLeft < 90 && <button className="btn btn-primary btn-sm">Renew</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Lease Wizard Modal */}
        {showNew && (
          <Modal title="New Tenancy Agreement" onClose={() => { setShowNew(false); setNewLeaseStep(0); }} size="lg"
            footer={
              <>
                <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateLease}>
                  {newLeaseStep < LEASE_STEPS.length - 1 ? 'Next Step →' : 'Complete & Archive'}
                </button>
              </>
            }
          >
            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 28, overflowX: 'auto' }}>
              {LEASE_STEPS.map((step, i) => (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div className={`step-circle ${i < newLeaseStep ? 'done' : i === newLeaseStep ? 'active' : 'pending'}`}>
                      {i < newLeaseStep ? '✓' : i + 1}
                    </div>
                    {i < LEASE_STEPS.length - 1 && <div className={`step-connector ${i < newLeaseStep ? 'done' : ''}`} style={{ flex: 1 }} />}
                  </div>
                  <div className="step-label">{step}</div>
                </div>
              ))}
            </div>

            {newLeaseStep === 0 && (
              <div>
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--primary-50)', borderRadius: 10, fontSize: 13, color: 'var(--primary)' }}>
                  Select a lease template or configure a custom agreement for this tenancy.
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tenant Name *</label>
                    <input className="form-input" value={newLease.tenantName} onChange={e => setNewLease(p => ({ ...p, tenantName: e.target.value }))} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit *</label>
                    <select className="form-select" value={newLease.unitId} onChange={e => setNewLease(p => ({ ...p, unitId: e.target.value }))}>
                      <option value="">Select unit</option>
                      {UNITS.filter(u => u.status === 'vacant').map(u => <option key={u.id} value={u.id}>{u.id} - {u.type} (${u.monthlyRent}/mo)</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" type="date" value={newLease.startDate} onChange={e => setNewLease(p => ({ ...p, startDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" type="date" value={newLease.endDate} onChange={e => setNewLease(p => ({ ...p, endDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Rent (S$)</label>
                    <input className="form-input" type="number" value={newLease.monthlyRent} onChange={e => setNewLease(p => ({ ...p, monthlyRent: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deposit Amount (S$)</label>
                    <input className="form-input" type="number" value={newLease.deposit} onChange={e => setNewLease(p => ({ ...p, deposit: e.target.value }))} />
                  </div>
                </div>
              </div>
            )}

            {newLeaseStep === 1 && (
              <div>
                <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 20, fontSize: 13, lineHeight: 1.8 }}>
                  <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>TENANCY AGREEMENT</div>
                  <p>This Tenancy Agreement is entered into between the Landlord and Tenant for the rental of the above-mentioned property unit.</p>
                  <p><strong>Tenant:</strong> {newLease.tenantName || '[Tenant Name]'} | <strong>Unit:</strong> {newLease.unitId || '[Unit ID]'}</p>
                  <p><strong>Period:</strong> {newLease.startDate || '[Start]'} to {newLease.endDate || '[End]'}</p>
                  <p><strong>Monthly Rent:</strong> S${newLease.monthlyRent || '0'} | <strong>Deposit:</strong> S${newLease.deposit || '0'}</p>
                  <p style={{ marginTop: 12, color: 'var(--gray-500)', fontSize: 12 }}>... Standard terms and conditions apply as per template TA-2025-001 ...</p>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--gray-500)' }}>📄 Auto-generated from Template Library. Legal team review completed.</div>
              </div>
            )}

            {newLeaseStep === 2 && (
              <div>
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--primary-50)', borderRadius: 10, fontSize: 13 }}>
                  E-signature invitations will be sent via email and WhatsApp to all parties.
                </div>
                {['Tenant', 'Landlord / Authorised Rep'].map(party => (
                  <div key={party} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid var(--gray-200)', borderRadius: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{party}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Invitation pending send</div>
                    </div>
                    <button className="btn btn-primary btn-sm"><Send size={12} /> Send Invite</button>
                  </div>
                ))}
              </div>
            )}

            {newLeaseStep === 3 && (
              <div>
                {['Tenant', 'Landlord'].map(party => (
                  <div key={party} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: `1px solid ${signStatus[`new_${party}`] === 'signed' ? 'var(--success)' : 'var(--gray-200)'}`, borderRadius: 10, marginBottom: 10, background: signStatus[`new_${party}`] === 'signed' ? 'var(--success-light)' : 'white' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{party} Signature</div>
                      <div style={{ fontSize: 12, color: signStatus[`new_${party}`] === 'signed' ? 'var(--success)' : 'var(--gray-400)' }}>
                        {signStatus[`new_${party}`] === 'signed' ? '✓ Signed digitally' : 'Awaiting signature'}
                      </div>
                    </div>
                    {signStatus[`new_${party}`] !== 'signed' ? (
                      <button className="btn btn-success btn-sm" onClick={() => handleSign('new', party)}>Sign Now</button>
                    ) : <CheckCircle size={20} color="var(--success)" />}
                  </div>
                ))}
              </div>
            )}

            {newLeaseStep === 4 && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: 64, height: 64, background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={32} color="var(--success)" />
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Lease Agreement Complete!</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Signed document archived to secure vault. Audit certificate generated.</div>
              </div>
            )}
          </Modal>
        )}

        {/* Lease Detail Modal */}
        {showDetail && (
          <Modal title={`Lease ${showDetail.id}`} onClose={() => setShowDetail(null)} size="lg">
            <div className="info-row"><div className="info-label">Tenant</div><div className="info-value">{showDetail.tenantName}</div></div>
            <div className="info-row"><div className="info-label">Unit</div><div className="info-value">{showDetail.unitId}</div></div>
            <div className="info-row"><div className="info-label">Lease Period</div><div className="info-value">{showDetail.startDate} → {showDetail.endDate}</div></div>
            <div className="info-row"><div className="info-label">Monthly Rent</div><div className="info-value">S${showDetail.monthlyRent?.toLocaleString()}</div></div>
            <div className="info-row"><div className="info-label">Deposit Held</div><div className="info-value">S${showDetail.deposit?.toLocaleString()}</div></div>
            <div className="info-row"><div className="info-label">Signed Date</div><div className="info-value">{showDetail.signedDate}</div></div>
            <div className="info-row"><div className="info-label">Status</div><div className="info-value"><span className={`badge ${STATUS_BADGE[showDetail.status]}`}>{showDetail.status}</span></div></div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-sm"><Download size={12} /> Download PDF</button>
              <button className="btn btn-ghost btn-sm"><FileText size={12} /> View Document</button>
            </div>
          </Modal>
        )}

      </div>
    </AppShell>
  );
}
