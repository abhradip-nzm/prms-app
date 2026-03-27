import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { LEASES, INVOICES, MAINTENANCE_TICKETS, UNITS } from '../../data';
import { Home, DollarSign, Wrench, AlertCircle, CheckCircle, MessageSquare, Send, Camera, Plus } from 'lucide-react';

/* ── Inline SVG QR Code ──────────────────────────────────────────────────── */
function QRCodeSVG({ size = 88 }) {
  // QR finder corners + representative data pattern
  return (
    <svg width={size} height={size} viewBox="0 0 23 23" style={{ display: 'block' }}>
      <rect width="23" height="23" fill="white" />
      {/* Top-left finder */}
      <rect x="1" y="1" width="7" height="7" fill="black" />
      <rect x="2" y="2" width="5" height="5" fill="white" />
      <rect x="3" y="3" width="3" height="3" fill="black" />
      {/* Top-right finder */}
      <rect x="15" y="1" width="7" height="7" fill="black" />
      <rect x="16" y="2" width="5" height="5" fill="white" />
      <rect x="17" y="3" width="3" height="3" fill="black" />
      {/* Bottom-left finder */}
      <rect x="1" y="15" width="7" height="7" fill="black" />
      <rect x="2" y="16" width="5" height="5" fill="white" />
      <rect x="3" y="17" width="3" height="3" fill="black" />
      {/* Timing patterns */}
      {[9,11,13].map(x => <rect key={`ht${x}`} x={x} y="6" width="1" height="1" fill="black" />)}
      {[9,11,13].map(y => <rect key={`vt${y}`} x="6" y={y} width="1" height="1" fill="black" />)}
      {/* Data cells */}
      {[
        [9,1],[11,1],[13,1],[10,2],[12,2],[9,3],[11,3],[10,4],[13,4],[12,5],[9,5],
        [1,9],[3,9],[5,9],[7,9],[9,9],[11,9],[13,9],[15,9],[17,9],[19,9],[21,9],
        [2,10],[4,10],[8,10],[12,10],[16,10],[20,10],
        [1,11],[3,11],[7,11],[9,11],[11,11],[13,11],[17,11],[19,11],[21,11],
        [2,12],[6,12],[10,12],[14,12],[18,12],[20,12],
        [1,13],[5,13],[9,13],[13,13],[17,13],[21,13],
        [9,15],[11,15],[13,15],[10,16],[12,16],[14,16],
        [9,17],[11,17],[13,17],[15,17],[10,18],[12,18],[14,18],
        [9,19],[11,19],[13,19],[15,19],[17,19],[10,20],[16,20],
        [9,21],[11,21],[13,21],[15,21],[17,21],[19,21],[21,21],
      ].map(([x, y], i) => <rect key={i} x={x} y={y} width="1" height="1" fill="black" />)}
    </svg>
  );
}

export default function TenantDashboard() {
  const { currentUser } = useApp();
  const myLease    = LEASES.find(l => l.tenantId === currentUser?.id);
  const myUnit     = myLease ? UNITS.find(u => u.id === myLease.unitId) : null;
  const myInvoices = INVOICES.filter(i => i.tenantName === currentUser?.name || i.unitId === myLease?.unitId);
  const [tickets, setTickets] = useState(MAINTENANCE_TICKETS.filter(t => t.tenantId === currentUser?.id || t.unitId === myLease?.unitId));

  const daysToExpiry = myLease ? Math.ceil((new Date(myLease.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  /* ── Fault modal state ── */
  const [showFault, setShowFault]       = useState(false);
  const [faultSubmitted, setFaultSubmitted] = useState(false);
  const [faultForm, setFaultForm]       = useState({ category: 'Plumbing', description: '', urgency: 'Medium', hasPhoto: false });

  const handleFaultSubmit = () => {
    const t = {
      id: `MT-00${MAINTENANCE_TICKETS.length + tickets.length + 1}`,
      unitId: myUnit?.id || 'U-101',
      tenantId: currentUser?.id,
      tenantName: currentUser?.name,
      ...faultForm,
      status: 'Open',
      submittedAt: new Date().toLocaleString(),
      assignedTo: null, contractorId: null, estimatedCost: null, actualCost: null,
      photos: faultForm.hasPhoto, notes: '',
    };
    setTickets(prev => [t, ...prev]);
    setFaultSubmitted(true);
    setTimeout(() => {
      setFaultSubmitted(false);
      setShowFault(false);
      setFaultForm({ category: 'Plumbing', description: '', urgency: 'Medium', hasPhoto: false });
    }, 2200);
  };

  /* ── Chat state ── */
  const [showChat, setShowChat] = useState(false);
  const [chatMsg,  setChatMsg]  = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from: 'bot', text: "Hi there! I'm your PRMS virtual assistant. How can I help you today?" },
    { from: 'bot', text: 'You can ask me about your rent, lease terms, maintenance requests, or building policies.' },
  ]);

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    const lc = chatMsg.toLowerCase();
    const reply = lc.includes('rent') ? `Your current monthly rent is S$${myUnit?.monthlyRent?.toLocaleString()}, due on the 1st of each month.`
      : lc.includes('lease') ? `Your lease runs until ${myLease?.endDate}. That's ${daysToExpiry} days remaining.`
      : lc.includes('maintenance') || lc.includes('fault') ? 'To report a fault, tap "Report a Fault" on your dashboard or scan the QR code in your unit.'
      : lc.includes('parking') ? 'Parking is allocated per unit. Please contact your property manager for availability.'
      : "Thank you for your message. I'll connect you with your property manager for more details.";
    setChatHistory(prev => [...prev, { from: 'user', text: chatMsg }, { from: 'bot', text: reply }]);
    setChatMsg('');
  };

  return (
    <AppShell>
      <Topbar title="My Dashboard" subtitle={`Welcome back, ${currentUser?.name?.split(' ')[0]}`} />
      <div className="page-body">

        {/* Lease alert */}
        {daysToExpiry && daysToExpiry <= 90 && (
          <div style={{ background: 'var(--warning-light)', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={18} color="var(--warning)" />
            <div>
              <strong style={{ fontSize: 13 }}>Lease Expiry Notice</strong>
              <span style={{ fontSize: 13, marginLeft: 8, color: 'var(--gray-600)' }}>
                Your lease expires in <strong>{daysToExpiry} days</strong> ({myLease?.endDate}). Contact your manager to discuss renewal.
              </span>
            </div>
          </div>
        )}

        {/* Unit overview */}
        {myUnit && (
          <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: 16, padding: '24px 28px', marginBottom: 22, color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', right: 30, top: 10, fontSize: 60, opacity: 0.1 }}>🏠</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Your Home</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Unit {myUnit.unitNumber} — {myUnit.type}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>{myUnit.sqft} sq ft · Floor {myUnit.floor}</div>
            <div style={{ display: 'flex', gap: 24 }}>
              <div><div style={{ fontSize: 22, fontWeight: 800 }}>S${myUnit.monthlyRent.toLocaleString()}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Monthly Rent</div></div>
              <div><div style={{ fontSize: 22, fontWeight: 800 }}>{daysToExpiry}d</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Lease Days Left</div></div>
              <div><div style={{ fontSize: 22, fontWeight: 800 }}>{tickets.filter(t => t.status !== 'Completed' && t.status !== 'Invoiced').length}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Open Requests</div></div>
            </div>
          </div>
        )}

        <div className="grid-2">
          {/* Recent Invoices */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">My Payments</div>
              <span className="badge badge-blue">{myInvoices.length} invoices</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {myInvoices.slice(0, 4).map(inv => (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 22px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.id} — {inv.type}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Due {inv.dueDate}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <strong>S${inv.amount.toLocaleString()}</strong>
                    <span className={`badge ${inv.status === 'paid' ? 'badge-green' : inv.status === 'overdue' ? 'badge-red' : 'badge-yellow'}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Requests */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">My Maintenance Requests</div>
              <button className="btn btn-primary btn-sm" onClick={() => setShowFault(true)}><Plus size={13} /> Report</button>
            </div>
            <div style={{ padding: '8px 0' }}>
              {tickets.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon"><Wrench size={22} /></div>
                  <div className="empty-title">No requests</div>
                  <div className="empty-desc">All is well!</div>
                </div>
              )}
              {tickets.slice(0, 4).map(t => (
                <div key={t.id} style={{ padding: '12px 22px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>{t.id}</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{t.category}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.description.slice(0, 48)}…</div>
                    </div>
                    <span className={`badge ${t.status === 'Completed' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>{t.status}</span>
                  </div>
                  {t.notes && <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>📝 {t.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Fault Reporting ── */}
        <div className="card mt-6">
          <div className="card-header">
            <div>
              <div className="card-title">Quick Fault Reporting</div>
              <div className="card-subtitle">Scan QR or tap the button to report a maintenance issue instantly</div>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* QR Code */}
            <div style={{
              flexShrink: 0, background: 'white', border: '2px solid var(--gray-200)',
              borderRadius: 12, padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <QRCodeSVG size={88} />
              <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--gray-400)', marginTop: 4, fontWeight: 600, letterSpacing: '0.05em' }}>
                UNIT {myUnit?.unitNumber || '101'}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>
                Scan the QR code posted in your unit's bathroom / kitchen, or click the button below to instantly log a maintenance issue. We acknowledge requests within <strong>minutes</strong>.
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowFault(true)}>
                  <Wrench size={13} /> Report a Fault
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => {}}>
                  📋 View All Requests
                </button>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
                {[
                  { label: 'Open', val: tickets.filter(t => t.status === 'Open').length, color: 'var(--danger)' },
                  { label: 'In Progress', val: tickets.filter(t => t.status === 'In Progress' || t.status === 'Pending Parts').length, color: 'var(--warning)' },
                  { label: 'Resolved', val: tickets.filter(t => t.status === 'Completed' || t.status === 'Invoiced').length, color: 'var(--success)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Fault Report Modal ── */}
      {showFault && (
        <Modal
          title="Report a Fault"
          onClose={() => { setShowFault(false); setFaultSubmitted(false); }}
          footer={faultSubmitted ? null : (
            <>
              <button className="btn btn-ghost" onClick={() => setShowFault(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleFaultSubmit} disabled={!faultForm.description}>Submit Request</button>
            </>
          )}
        >
          {faultSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 64, height: 64, background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={30} color="var(--success)" />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Request Submitted!</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>You'll receive a confirmation via email and WhatsApp shortly.</div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--primary-50)', borderRadius: 8, fontSize: 13, color: 'var(--primary)' }}>
                📍 Reporting for: <strong>Unit {myUnit?.unitNumber}, {myUnit?.propertyId === 'P-001' ? 'Marina Bay Residences' : 'Your Property'}</strong>
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={faultForm.category} onChange={e => setFaultForm(p => ({ ...p, category: e.target.value }))}>
                  {['Plumbing', 'Electrical', 'Air Conditioning', 'General', 'Structural', 'Appliances'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" value={faultForm.description} onChange={e => setFaultForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the fault — when it started and how it affects you." style={{ minHeight: 90 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {['Low', 'Medium', 'High'].map(u => (
                    <button key={u} type="button" onClick={() => setFaultForm(p => ({ ...p, urgency: u }))}
                      style={{
                        padding: '10px', borderRadius: 8, cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
                        border: `1.5px solid ${faultForm.urgency === u ? (u === 'High' ? 'var(--danger)' : u === 'Medium' ? 'var(--warning)' : 'var(--success)') : 'var(--gray-200)'}`,
                        background: faultForm.urgency === u ? (u === 'High' ? 'var(--danger-light)' : u === 'Medium' ? 'var(--warning-light)' : 'var(--success-light)') : 'white',
                      }}>
                      {u === 'High' ? '🔴' : u === 'Medium' ? '🟡' : '🟢'} {u}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Photo (optional)</label>
                <div
                  style={{ border: '2px dashed var(--gray-200)', borderRadius: 10, padding: '18px', textAlign: 'center', cursor: 'pointer', background: faultForm.hasPhoto ? 'var(--success-light)' : 'var(--gray-50)' }}
                  onClick={() => setFaultForm(p => ({ ...p, hasPhoto: !p.hasPhoto }))}
                >
                  <Camera size={22} color={faultForm.hasPhoto ? 'var(--success)' : 'var(--gray-400)'} style={{ margin: '0 auto 8px', display: 'block' }} />
                  <div style={{ fontSize: 13, color: faultForm.hasPhoto ? 'var(--success)' : 'var(--gray-400)', fontWeight: 600 }}>
                    {faultForm.hasPhoto ? '✓ Photo attached' : 'Click to attach photo'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ── Chatbot ── */}
      <div className="chat-widget">
        {showChat && (
          <div className="chat-window">
            <div className="chat-header">
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14 }}>PRMS Assistant</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Online 24/7</div>
            </div>
            <div className="chat-messages">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.from}`}>{msg.text}</div>
              ))}
            </div>
            <div className="chat-input-row">
              <input placeholder="Ask anything…" value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
              <button className="btn btn-primary btn-icon btn-sm" onClick={sendMsg}><Send size={13} /></button>
            </div>
          </div>
        )}
        <div className="chat-bubble" onClick={() => setShowChat(s => !s)}>
          <MessageSquare size={22} />
        </div>
      </div>
    </AppShell>
  );
}
