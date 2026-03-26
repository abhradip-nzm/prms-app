import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { INVOICES } from '../../data';
import { DollarSign, CheckCircle, AlertCircle, CreditCard, Clock } from 'lucide-react';

export default function TenantPayments() {
  const { currentUser } = useApp();
  const [invoices, setInvoices] = useState(INVOICES.filter(i => i.tenantName === currentUser?.name || i.unitId === 'U-101'));
  const [payModal, setPayModal] = useState(null);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaid(true);
    setTimeout(() => {
      setInvoices(prev => prev.map(i => i.id === payModal.id ? { ...i, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : i));
      setPaid(false);
      setPayModal(null);
    }, 1800);
  };

  const pending = invoices.filter(i => i.status === 'pending');
  const overdue = invoices.filter(i => i.status === 'overdue');
  const paidInvoices = invoices.filter(i => i.status === 'paid');

  return (
    <AppShell>
      <Topbar title="My Payments" subtitle="View invoices and make payments" />
      <div className="page-body">

        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 22 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><Clock size={18} color="var(--warning)" /></div>
            <div className="stat-value">S${pending.reduce((s, i) => s + i.amount, 0).toLocaleString()}</div>
            <div className="stat-label">Pending ({pending.length})</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><AlertCircle size={18} color="var(--danger)" /></div>
            <div className="stat-value">S${overdue.reduce((s, i) => s + i.amount, 0).toLocaleString()}</div>
            <div className="stat-label">Overdue ({overdue.length})</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={18} color="var(--success)" /></div>
            <div className="stat-value">S${paidInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}</div>
            <div className="stat-label">Paid This Month</div>
          </div>
        </div>

        {/* Outstanding */}
        {[...overdue, ...pending].length > 0 && (
          <div className="card mb-6">
            <div className="card-header">
              <div className="card-title">Outstanding Payments</div>
              <span className="badge badge-red">{overdue.length + pending.length} invoices</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {[...overdue, ...pending].map(inv => (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 12 }}>{inv.id}</span>
                      <span className={`badge ${inv.status === 'overdue' ? 'badge-red' : 'badge-yellow'}`}>{inv.status}</span>
                      <span className="badge badge-gray">{inv.type}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>S${inv.amount.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: inv.status === 'overdue' ? 'var(--danger)' : 'var(--gray-400)' }}>
                      {inv.status === 'overdue' ? 'Overdue since' : 'Due'}: {inv.dueDate}
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setPayModal(inv)}>
                    <CreditCard size={13} /> Pay Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All invoices */}
        <div className="card">
          <div className="card-header"><div className="card-title">Payment History</div></div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Invoice</th><th>Type</th><th>Amount</th><th>Due Date</th><th>Paid Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{inv.id}</td>
                    <td><span className={`badge ${inv.type === 'rent' ? 'badge-blue' : 'badge-yellow'}`}>{inv.type}</span></td>
                    <td><strong>S${inv.amount.toLocaleString()}</strong></td>
                    <td style={{ fontSize: 12 }}>{inv.dueDate}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>{inv.paidDate || '—'}</td>
                    <td>
                      <span className={`badge ${inv.status === 'paid' ? 'badge-green' : inv.status === 'overdue' ? 'badge-red' : 'badge-yellow'}`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pay Modal */}
        {payModal && (
          <Modal title="Make Payment" onClose={() => !paid && setPayModal(null)}
            footer={paid ? null : (
              <>
                <button className="btn btn-ghost" onClick={() => setPayModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handlePay}><CreditCard size={13} /> Confirm Payment</button>
              </>
            )}
          >
            {paid ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 60, height: 60, background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={30} color="var(--success)" />
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Payment Successful!</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>S${payModal.amount.toLocaleString()} paid. Receipt sent to your email.</div>
              </div>
            ) : (
              <div>
                <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
                  <div className="info-row"><div className="info-label">Invoice</div><div className="info-value">{payModal.id}</div></div>
                  <div className="info-row"><div className="info-label">Amount</div><div className="info-value" style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)' }}>S${payModal.amount.toLocaleString()}</div></div>
                  <div className="info-row"><div className="info-label">Due Date</div><div className="info-value">{payModal.dueDate}</div></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select">
                    <option>PayNow (Recommended)</option>
                    <option>Bank Transfer</option>
                    <option>Credit Card</option>
                  </select>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', padding: '10px', background: 'var(--primary-50)', borderRadius: 8 }}>
                  🔒 Payment is processed securely via Stripe. Your payment details are never stored.
                </div>
              </div>
            )}
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
