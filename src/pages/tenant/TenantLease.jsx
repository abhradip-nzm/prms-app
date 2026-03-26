import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { useApp } from '../../context/AppContext';
import { LEASES, UNITS, PROPERTIES } from '../../data';
import { FileText, Download, CheckCircle, Calendar, DollarSign, Home } from 'lucide-react';

export default function TenantLease() {
  const { currentUser } = useApp();
  const myLease = LEASES.find(l => l.tenantId === currentUser?.id);
  const myUnit = myLease ? UNITS.find(u => u.id === myLease.unitId) : null;
  const myProperty = myUnit ? PROPERTIES.find(p => p.id === myUnit.propertyId) : null;
  const daysLeft = myLease ? Math.ceil((new Date(myLease.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  const totalDays = myLease ? Math.ceil((new Date(myLease.endDate) - new Date(myLease.startDate)) / (1000 * 60 * 60 * 24)) : 1;
  const progress = Math.round(((totalDays - daysLeft) / totalDays) * 100);

  if (!myLease) return (
    <AppShell>
      <Topbar title="My Lease" subtitle="Tenancy agreement details" />
      <div className="page-body">
        <div className="card"><div className="empty-state"><div className="empty-title">No active lease found</div></div></div>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <Topbar title="My Lease" subtitle="View your tenancy agreement details"
        actions={<button className="btn btn-ghost btn-sm"><Download size={13} /> Download PDF</button>}
      />
      <div className="page-body">

        {/* Lease Progress */}
        <div className="card mb-6">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16 }}>Lease {myLease.id}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 2 }}>Signed digitally on {myLease.signedDate}</div>
              </div>
              <span className="badge badge-green" style={{ fontSize: 13 }}>✓ Active</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--gray-500)', marginBottom: 6 }}>
                <span>{myLease.startDate}</span>
                <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>{progress}% complete · {daysLeft} days remaining</span>
                <span>{myLease.endDate}</span>
              </div>
              <div className="progress-bar" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* Unit Details */}
          <div className="card">
            <div className="card-header"><div className="card-title">Unit Details</div></div>
            <div className="card-body">
              <div className="info-row"><div className="info-label">Unit Reference</div><div className="info-value">{myUnit?.id}</div></div>
              <div className="info-row"><div className="info-label">Unit Type</div><div className="info-value">{myUnit?.type}</div></div>
              <div className="info-row"><div className="info-label">Floor</div><div className="info-value">Level {myUnit?.floor}</div></div>
              <div className="info-row"><div className="info-label">Size</div><div className="info-value">{myUnit?.sqft} sq ft</div></div>
              <div className="info-row"><div className="info-label">Property</div><div className="info-value">{myProperty?.name}</div></div>
              <div className="info-row"><div className="info-label">Address</div><div className="info-value" style={{ fontSize: 12 }}>{myProperty?.address}</div></div>
            </div>
          </div>

          {/* Financial Terms */}
          <div className="card">
            <div className="card-header"><div className="card-title">Financial Terms</div></div>
            <div className="card-body">
              <div className="info-row"><div className="info-label">Monthly Rent</div><div className="info-value" style={{ fontWeight: 700, fontSize: 15, color: 'var(--primary)' }}>S${myLease.monthlyRent?.toLocaleString()}</div></div>
              <div className="info-row"><div className="info-label">Security Deposit</div><div className="info-value">S${myLease.deposit?.toLocaleString()}</div></div>
              <div className="info-row"><div className="info-label">Deposit Months</div><div className="info-value">{myLease.deposit / myLease.monthlyRent} months</div></div>
              <div className="info-row"><div className="info-label">Billing Cycle</div><div className="info-value">1st of every month</div></div>
              <div className="info-row"><div className="info-label">Payment Method</div><div className="info-value">Bank Transfer / PayNow</div></div>
              <div className="info-row"><div className="info-label">Late Fee</div><div className="info-value">S$50 after 7 days</div></div>
            </div>
          </div>
        </div>

        {/* Signed Document */}
        <div className="card mt-6">
          <div className="card-header">
            <div className="card-title">Signed Documents</div>
            <span className="badge badge-green">✓ Digitally Signed</span>
          </div>
          <div className="card-body">
            {[
              { name: 'Tenancy Agreement — Signed Copy', date: myLease.signedDate, size: '284 KB' },
              { name: 'Audit Certificate', date: myLease.signedDate, size: '42 KB' },
              { name: 'Unit Inspection Report', date: myLease.startDate, size: '1.2 MB' },
            ].map(doc => (
              <div key={doc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--primary-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={16} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{doc.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{doc.date} · {doc.size}</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm"><Download size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Renewal CTA */}
        {daysLeft <= 90 && (
          <div style={{ marginTop: 22, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: 16, padding: '22px 28px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Your lease expires soon</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Only {daysLeft} days remaining. Contact your property manager to discuss renewal options.</div>
            </div>
            <button className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>Request Renewal</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
