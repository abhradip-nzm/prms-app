export const USERS = [
  { id: 1, name: 'Sarah Chen', email: 'admin@prms.com', password: 'admin123', role: 'admin', avatar: 'SC', phone: '+65 9123 4567' },
  { id: 2, name: 'Marcus Lim', email: 'manager@prms.com', password: 'manager123', role: 'manager', avatar: 'ML', phone: '+65 9234 5678' },
  { id: 3, name: 'Aisha Patel', email: 'tenant@prms.com', password: 'tenant123', role: 'tenant', avatar: 'AP', phone: '+65 9345 6789', unitId: 'U-101' },
  { id: 4, name: 'James Wong', email: 'contractor@prms.com', password: 'contractor123', role: 'contractor', avatar: 'JW', phone: '+65 9456 7890', company: 'ProFix Solutions' },
  { id: 5, name: 'Linda Tan', email: 'finance@prms.com', password: 'finance123', role: 'finance', avatar: 'LT', phone: '+65 9567 8901' },
];

export const PROPERTIES = [
  { id: 'P-001', name: 'Marina Bay Residences', address: '10 Marina Boulevard, Singapore 018983', type: 'Residential', totalUnits: 48, occupiedUnits: 42, manager: 'Marcus Lim' },
  { id: 'P-002', name: 'Orchard Garden Suites', address: '88 Orchard Road, Singapore 238839', type: 'Residential', totalUnits: 36, occupiedUnits: 30, manager: 'Marcus Lim' },
  { id: 'P-003', name: 'Clarke Quay Commercial', address: '3 River Valley Rd, Singapore 179024', type: 'Commercial', totalUnits: 24, occupiedUnits: 20, manager: 'Marcus Lim' },
];

export const UNITS = [
  { id: 'U-101', propertyId: 'P-001', floor: 1, unitNumber: '101', type: '2BR', sqft: 850, monthlyRent: 3500, status: 'occupied', tenantId: 3 },
  { id: 'U-102', propertyId: 'P-001', floor: 1, unitNumber: '102', type: '1BR', sqft: 600, monthlyRent: 2800, status: 'occupied', tenantId: null },
  { id: 'U-201', propertyId: 'P-001', floor: 2, unitNumber: '201', type: '3BR', sqft: 1200, monthlyRent: 5200, status: 'vacant', tenantId: null },
  { id: 'U-202', propertyId: 'P-001', floor: 2, unitNumber: '202', type: '2BR', sqft: 850, monthlyRent: 3600, status: 'occupied', tenantId: null },
  { id: 'U-301', propertyId: 'P-002', floor: 3, unitNumber: '301', type: '2BR', sqft: 900, monthlyRent: 4200, status: 'occupied', tenantId: null },
  { id: 'U-302', propertyId: 'P-002', floor: 3, unitNumber: '302', type: 'Studio', sqft: 400, monthlyRent: 1800, status: 'vacant', tenantId: null },
  { id: 'U-401', propertyId: 'P-003', floor: 4, unitNumber: '401', type: 'Office', sqft: 1500, monthlyRent: 8500, status: 'occupied', tenantId: null },
];

export const LEADS = [
  { id: 'L-001', name: 'David Ng', email: 'david.ng@email.com', phone: '+65 9111 2222', unitInterest: '2BR', propertyId: 'P-001', source: 'Website Chatbot', status: 'Viewing Scheduled', viewingDate: '2026-03-28', notes: 'Interested in high floor', assignedTo: 'Marcus Lim', createdAt: '2026-03-20' },
  { id: 'L-002', name: 'Rachel Kim', email: 'rachel.k@email.com', phone: '+65 9222 3333', unitInterest: '1BR', propertyId: 'P-002', source: 'WhatsApp', status: 'New Enquiry', viewingDate: null, notes: 'Budget around $2,500', assignedTo: 'Marcus Lim', createdAt: '2026-03-22' },
  { id: 'L-003', name: 'Tom Bradley', email: 'tom.b@email.com', phone: '+65 9333 4444', unitInterest: 'Office', propertyId: 'P-003', source: 'Email', status: 'Viewed', viewingDate: '2026-03-18', notes: 'Needs parking space', assignedTo: 'Marcus Lim', createdAt: '2026-03-15' },
  { id: 'L-004', name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+65 9444 5555', unitInterest: '3BR', propertyId: 'P-001', source: 'Website Chatbot', status: 'Application Submitted', viewingDate: '2026-03-10', notes: 'Family of 4', assignedTo: 'Marcus Lim', createdAt: '2026-03-08' },
  { id: 'L-005', name: 'Kevin Ong', email: 'kevin.o@email.com', phone: '+65 9555 6666', unitInterest: 'Studio', propertyId: 'P-002', source: 'Referral', status: 'Lease Signed', viewingDate: '2026-02-20', notes: 'Young professional', assignedTo: 'Marcus Lim', createdAt: '2026-02-15' },
  { id: 'L-006', name: 'Mei Lin', email: 'mei.lin@email.com', phone: '+65 9666 7777', unitInterest: '2BR', propertyId: 'P-001', source: 'Website Chatbot', status: 'Lost', viewingDate: '2026-03-05', notes: 'Found another property', assignedTo: 'Marcus Lim', createdAt: '2026-03-01' },
];

export const LEASES = [
  { id: 'LS-001', unitId: 'U-101', tenantId: 3, tenantName: 'Aisha Patel', startDate: '2025-04-01', endDate: '2026-03-31', monthlyRent: 3500, deposit: 7000, status: 'active', signedDate: '2025-03-15', renewalAlert: true },
  { id: 'LS-002', unitId: 'U-102', tenantId: null, tenantName: 'Benjamin Teo', startDate: '2024-07-01', endDate: '2026-06-30', monthlyRent: 2800, deposit: 5600, status: 'active', signedDate: '2024-06-20', renewalAlert: false },
  { id: 'LS-003', unitId: 'U-202', tenantId: null, tenantName: 'Chen Wei', startDate: '2025-01-01', endDate: '2026-12-31', monthlyRent: 3600, deposit: 7200, status: 'active', signedDate: '2024-12-18', renewalAlert: false },
  { id: 'LS-004', unitId: 'U-301', tenantId: null, tenantName: 'Diana Soh', startDate: '2025-06-01', endDate: '2027-05-31', monthlyRent: 4200, deposit: 8400, status: 'active', signedDate: '2025-05-22', renewalAlert: false },
  { id: 'LS-005', unitId: 'U-401', tenantId: null, tenantName: 'Eagle Corp Pte Ltd', startDate: '2024-01-01', endDate: '2026-12-31', monthlyRent: 8500, deposit: 17000, status: 'active', signedDate: '2023-12-10', renewalAlert: false },
];

export const MAINTENANCE_TICKETS = [
  { id: 'MT-001', unitId: 'U-101', tenantId: 3, tenantName: 'Aisha Patel', category: 'Plumbing', description: 'Leaking tap in kitchen sink, dripping continuously', urgency: 'High', status: 'In Progress', submittedAt: '2026-03-22 09:30', assignedTo: 'James Wong', contractorId: 4, estimatedCost: 280, actualCost: null, photos: true, notes: 'Contractor visited, parts ordered' },
  { id: 'MT-002', unitId: 'U-102', tenantId: null, tenantName: 'Benjamin Teo', category: 'Electrical', description: 'Power outlet in bedroom not working', urgency: 'Medium', status: 'Open', submittedAt: '2026-03-23 14:15', assignedTo: null, contractorId: null, estimatedCost: null, actualCost: null, photos: false, notes: '' },
  { id: 'MT-003', unitId: 'U-202', tenantId: null, tenantName: 'Chen Wei', category: 'Air Conditioning', description: 'AC unit in master bedroom not cooling properly', urgency: 'High', status: 'Completed', submittedAt: '2026-03-18 10:00', assignedTo: 'James Wong', contractorId: 4, estimatedCost: 450, actualCost: 420, photos: true, notes: 'Gas topped up, filter cleaned' },
  { id: 'MT-004', unitId: 'U-301', tenantId: null, tenantName: 'Diana Soh', category: 'General', description: 'Main door lock stiff and difficult to turn', urgency: 'Medium', status: 'Pending Parts', submittedAt: '2026-03-20 16:45', assignedTo: 'James Wong', contractorId: 4, estimatedCost: 180, actualCost: null, photos: false, notes: 'Lock cylinder needs replacement, ordered' },
  { id: 'MT-005', unitId: 'U-101', tenantId: 3, tenantName: 'Aisha Patel', category: 'Plumbing', description: 'Toilet cistern running water continuously', urgency: 'Low', status: 'Invoiced', submittedAt: '2026-03-10 11:20', assignedTo: 'James Wong', contractorId: 4, estimatedCost: 150, actualCost: 165, photos: false, notes: 'Replaced fill valve' },
];

export const INVOICES = [
  { id: 'INV-001', leaseId: 'LS-001', tenantName: 'Aisha Patel', unitId: 'U-101', amount: 3500, dueDate: '2026-04-01', paidDate: null, status: 'pending', type: 'rent' },
  { id: 'INV-002', leaseId: 'LS-002', tenantName: 'Benjamin Teo', unitId: 'U-102', amount: 2800, dueDate: '2026-04-01', paidDate: null, status: 'pending', type: 'rent' },
  { id: 'INV-003', leaseId: 'LS-003', tenantName: 'Chen Wei', unitId: 'U-202', amount: 3600, dueDate: '2026-03-01', paidDate: '2026-03-02', status: 'paid', type: 'rent' },
  { id: 'INV-004', leaseId: 'LS-004', tenantName: 'Diana Soh', unitId: 'U-301', amount: 4200, dueDate: '2026-03-01', paidDate: '2026-03-01', status: 'paid', type: 'rent' },
  { id: 'INV-005', leaseId: 'LS-005', tenantName: 'Eagle Corp Pte Ltd', unitId: 'U-401', amount: 8500, dueDate: '2026-03-01', paidDate: null, status: 'overdue', type: 'rent' },
  { id: 'INV-006', tenantName: 'Aisha Patel', unitId: 'U-101', amount: 165, dueDate: '2026-03-15', paidDate: null, status: 'pending', type: 'maintenance', maintenanceId: 'MT-005' },
];

export const NOTIFICATIONS = [
  { id: 1, type: 'lease_expiry', message: 'Lease LS-001 (Aisha Patel, U-101) expires in 9 days', severity: 'warning', date: '2026-03-26', read: false },
  { id: 2, type: 'maintenance', message: 'New maintenance request MT-002 submitted for U-102', severity: 'info', date: '2026-03-23', read: false },
  { id: 3, type: 'payment_overdue', message: 'Rent overdue: Eagle Corp Pte Ltd (U-401) - $8,500', severity: 'error', date: '2026-03-10', read: false },
  { id: 4, type: 'lead', message: 'New lead L-002 from Rachel Kim via WhatsApp', severity: 'info', date: '2026-03-22', read: true },
  { id: 5, type: 'maintenance_complete', message: 'Maintenance MT-003 completed - AC unit U-202', severity: 'success', date: '2026-03-19', read: true },
];

export const VIEWING_SLOTS = [
  { id: 'VS-001', date: '2026-03-28', time: '10:00', unitId: 'U-201', leadId: 'L-001', leadName: 'David Ng', status: 'confirmed' },
  { id: 'VS-002', date: '2026-03-29', time: '14:00', unitId: 'U-302', leadId: null, leadName: null, status: 'available' },
  { id: 'VS-003', date: '2026-03-30', time: '11:00', unitId: 'U-201', leadId: null, leadName: null, status: 'available' },
  { id: 'VS-004', date: '2026-04-01', time: '15:00', unitId: 'U-302', leadId: null, leadName: null, status: 'available' },
];

export const RENT_TRENDS = [
  { month: 'Oct', collected: 21800, due: 22600 },
  { month: 'Nov', collected: 22600, due: 22600 },
  { month: 'Dec', collected: 20100, due: 22600 },
  { month: 'Jan', collected: 22600, due: 22600 },
  { month: 'Feb', collected: 21500, due: 22600 },
  { month: 'Mar', collected: 19100, due: 22600 },
];

export const MAINTENANCE_COSTS = [
  { month: 'Oct', plumbing: 450, electrical: 220, ac: 800, general: 150 },
  { month: 'Nov', plumbing: 180, electrical: 350, ac: 420, general: 280 },
  { month: 'Dec', plumbing: 320, electrical: 180, ac: 650, general: 420 },
  { month: 'Jan', plumbing: 280, electrical: 290, ac: 380, general: 190 },
  { month: 'Feb', plumbing: 165, electrical: 420, ac: 520, general: 310 },
  { month: 'Mar', plumbing: 445, electrical: 0, ac: 420, general: 180 },
];

export const PIPELINE_DATA = [
  { stage: 'New Enquiry', count: 1, color: '#93c5fd' },
  { stage: 'Viewing Scheduled', count: 1, color: '#60a5fa' },
  { stage: 'Viewed', count: 1, color: '#3b82f6' },
  { stage: 'Application', count: 1, color: '#2563eb' },
  { stage: 'Lease Signed', count: 1, color: '#1d4ed8' },
];
