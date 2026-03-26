import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { MAINTENANCE_TICKETS } from '../../data';
import { useApp } from '../../context/AppContext';
import { DollarSign, Upload } from 'lucide-react';

export default function ContractorInvoices() {
  const { currentUser } = useApp();
  const completed = MAINTENANCE_TICKETS.filter(t => t.contractorId === currentUser?.id && (t.status === 'Completed' || t.status === 'Invoiced'));

  return (
    <AppShell>
      <Topbar title="My Invoices" subtitle="Submit and track your invoices" />
      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Completed Jobs — Ready to Invoice</div>
            <span className="badge badge-blue">{completed.length} jobs</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Job ID</th><th>Unit</th><th>Category</th><th>Completed</th><th>Actual Cost</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {completed.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{t.id}</td>
                    <td>{t.unitId}</td>
                    <td><span className="badge badge-gray">{t.category}</span></td>
                    <td style={{ fontSize: 12 }}>{t.submittedAt?.split(' ')[0]}</td>
                    <td><strong>{t.actualCost ? `S$${t.actualCost}` : '—'}</strong></td>
                    <td><span className={`badge ${t.status === 'Invoiced' ? 'badge-gray' : 'badge-green'}`}>{t.status}</span></td>
                    <td>
                      {t.status === 'Completed' && t.actualCost && (
                        <button className="btn btn-primary btn-sm"><Upload size={12} /> Submit Invoice</button>
                      )}
                      {t.status === 'Invoiced' && <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>✓ Submitted</span>}
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
