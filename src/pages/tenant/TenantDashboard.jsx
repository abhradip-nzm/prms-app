import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { LEASES, INVOICES, MAINTENANCE_TICKETS, UNITS } from '../../data';
import { Home, DollarSign, Wrench, FileText, AlertCircle, CheckCircle, MessageSquare, Send } from 'lucide-react';

export default function TenantDashboard() {
  const { currentUser } = useApp();
  const myLease = LEASES.find(l => l.tenantId === currentUser?.id);
  const myUnit = myLease ? UNITS.find(u => u.id === myLease.unitId) : null;
  const myInvoices = INVOICES.filter(i => i.tenantName === currentUser?.name || i.unitId === myLease?.unitId);
  const myTickets = MAINTENANCE_TICKETS.filter(t => t.tenantId === currentUser?.id || t.unitId === myLease?.unitId);

  const daysToExpiry = myLease ? Math.ceil((new Date(myLease.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from: 'bot', text: 'Hi there! I\'m your PRMS virtual assistant. How can I help you today?' },
    { from: 'bot', text: 'You can ask me about your rent, lease terms, maintenance requests, or building policies.' },
  ]);

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    const responses = {
      rent: 'Your current monthly rent is S$3,500, due on the 1st of each month.',
      lease: `Your lease runs until ${myLease?.endDate}. That's ${daysToExpiry} days remaining.`,
      maintenance: 'To report a fault, tap "Report Fault" in the menu or scan the QR code in your unit.',
      parking: 'Parking is allocated per unit. Please contact your property manager for availability.',
    };
    const lc = chatMsg.toLowerCase();
    const reply = lc.includes('rent') ? responses.rent : lc.includes('lease') ? responses.lease : lc.includes('maintenance') || lc.includes('fault') ? responses.maintenance : lc.includes('parking') ? responses.parking : 'Thank you for your message. I\'ll connect you with your property manager for more details.';
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
              <div><div style={{ fontSize: 22, fontWeight: 800 }}>{myTickets.filter(t => t.status !== 'Completed' && t.status !== 'Invoiced').length}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Open Requests</div></div>
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
            </div>
            <div style={{ padding: '8px 0' }}>
              {myTickets.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon"><Wrench size={22} /></div>
                  <div className="empty-title">No requests</div>
                  <div className="empty-desc">All is well!</div>
                </div>
              )}
              {myTickets.map(t => (
                <div key={t.id} style={{ padding: '12px 22px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>{t.id}</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{t.category}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.description.slice(0, 50)}...</div>
                    </div>
                    <span className={`badge ${t.status === 'Completed' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>{t.status}</span>
                  </div>
                  {t.notes && <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>📝 {t.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code placeholder */}
        <div className="card mt-6">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 90, height: 90, background: 'var(--gray-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--gray-400)' }}>QR Code<br />Unit {myUnit?.unitNumber}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Quick Fault Reporting</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>Scan the QR code in your unit or click below to instantly report a maintenance issue.</div>
              <button className="btn btn-primary btn-sm"><Wrench size={13} /> Report a Fault</button>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
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
              <input placeholder="Ask anything..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
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
