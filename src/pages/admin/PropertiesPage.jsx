import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Modal from '../../components/common/Modal';
import { PROPERTIES, UNITS, LEASES } from '../../data';
import { Building2, Home, Plus, Eye, MapPin } from 'lucide-react';

export function PropertiesPage() {
  const [selected, setSelected] = useState(null);
  const propUnits = selected ? UNITS.filter(u => u.propertyId === selected.id) : [];
  const occ = p => Math.round((p.occupiedUnits / p.totalUnits) * 100);

  return (
    <AppShell>
      <Topbar title="Properties" subtitle="Manage your property portfolio" />
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
          {PROPERTIES.map(p => (
            <div key={p.id} className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onClick={() => setSelected(p)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
              <div style={{ height: 120, background: `linear-gradient(135deg, hsl(${p.id.charCodeAt(3) * 40}, 60%, 25%), hsl(${p.id.charCodeAt(3) * 40 + 40}, 70%, 45%))`, borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Building2 size={40} color="rgba(255,255,255,0.3)" />
                <span className={`badge ${p.type === 'Residential' ? 'badge-blue' : 'badge-yellow'}`} style={{ position: 'absolute', top: 12, right: 12 }}>{p.type}</span>
              </div>
              <div className="card-body">
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 14, display: 'flex', gap: 4, alignItems: 'center' }}>
                  <MapPin size={12} />{p.address}
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                  <div><div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20 }}>{p.totalUnits}</div><div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Total</div></div>
                  <div><div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, color: 'var(--success)' }}>{p.occupiedUnits}</div><div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Occupied</div></div>
                  <div><div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, color: 'var(--warning)' }}>{p.totalUnits - p.occupiedUnits}</div><div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Vacant</div></div>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${occ(p)}%` }} /></div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 6 }}>{occ(p)}% occupancy · Managed by {p.manager}</div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <Modal title={selected.name} onClose={() => setSelected(null)} size="lg">
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{selected.address}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className={`badge ${selected.type === 'Residential' ? 'badge-blue' : 'badge-yellow'}`}>{selected.type}</span>
                <span className="badge badge-green">{occ(selected)}% Occupied</span>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Units</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Unit</th><th>Type</th><th>Sq Ft</th><th>Rent</th><th>Status</th></tr></thead>
                <tbody>
                  {propUnits.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.id}</td>
                      <td>{u.type}</td>
                      <td>{u.sqft}</td>
                      <td>S${u.monthlyRent.toLocaleString()}</td>
                      <td><span className={`badge ${u.status === 'occupied' ? 'badge-green' : 'badge-yellow'}`}>{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}

export function UnitsPage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const filtered = UNITS.filter(u => filter === 'all' || u.status === filter);

  return (
    <AppShell>
      <Topbar title="Units" subtitle="All rental units across properties" />
      <div className="page-body">
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter('all')}>
            <div className="stat-value">{UNITS.length}</div><div className="stat-label">Total Units</div>
          </div>
          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter('occupied')}>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{UNITS.filter(u => u.status === 'occupied').length}</div><div className="stat-label">Occupied</div>
          </div>
          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter('vacant')}>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{UNITS.filter(u => u.status === 'vacant').length}</div><div className="stat-label">Vacant</div>
          </div>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Unit</th><th>Property</th><th>Type</th><th>Floor</th><th>Size</th><th>Monthly Rent</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(u)}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{u.id}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{PROPERTIES.find(p => p.id === u.propertyId)?.name}</td>
                    <td><span className="badge badge-gray">{u.type}</span></td>
                    <td>Level {u.floor}</td>
                    <td>{u.sqft} sq ft</td>
                    <td><strong>S${u.monthlyRent.toLocaleString()}</strong></td>
                    <td><span className={`badge ${u.status === 'occupied' ? 'badge-green' : 'badge-yellow'}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <Modal title={`Unit ${selected.id}`} onClose={() => setSelected(null)}>
            <div className="info-row"><div className="info-label">Unit Number</div><div className="info-value">{selected.unitNumber}</div></div>
            <div className="info-row"><div className="info-label">Property</div><div className="info-value">{PROPERTIES.find(p => p.id === selected.propertyId)?.name}</div></div>
            <div className="info-row"><div className="info-label">Type</div><div className="info-value">{selected.type}</div></div>
            <div className="info-row"><div className="info-label">Floor</div><div className="info-value">Level {selected.floor}</div></div>
            <div className="info-row"><div className="info-label">Size</div><div className="info-value">{selected.sqft} sq ft</div></div>
            <div className="info-row"><div className="info-label">Monthly Rent</div><div className="info-value" style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>S${selected.monthlyRent.toLocaleString()}</div></div>
            <div className="info-row"><div className="info-label">Status</div><div className="info-value"><span className={`badge ${selected.status === 'occupied' ? 'badge-green' : 'badge-yellow'}`}>{selected.status}</span></div></div>
            {selected.status === 'occupied' && (
              <div className="info-row"><div className="info-label">Lease</div><div className="info-value">{LEASES.find(l => l.unitId === selected.id)?.id || '—'}</div></div>
            )}
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
