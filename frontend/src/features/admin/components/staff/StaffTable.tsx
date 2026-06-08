import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, MoreVertical, X, Eye, Pencil, Trash2, User, Mail, Phone, Briefcase, Building2, Calendar, DollarSign, Star } from 'lucide-react';
import { useStaffStore } from '../../store/staff.store';
import type { StaffRole, StaffDepartment, StaffStatus, StaffMember } from '../../store/staff.store';

// ── Constants for Edit Modal (Defined at top-level to be in scope) ────────
const EDIT_ROLES: StaffRole[]        = ['Manager', 'Chef', 'Server', 'Bartender', 'Host', 'Cleaner'];
const EDIT_DEPTS: StaffDepartment[] = ['Management', 'Kitchen', 'Service', 'Bar', 'Front Desk', 'Cleaning'];
const EDIT_STATUSES: StaffStatus[]  = ['Active', 'On Leave', 'Inactive'];

const ROLES: Array<StaffRole | 'All Roles'>           = ['All Roles', 'Manager', 'Chef', 'Server', 'Bartender', 'Host', 'Cleaner'];
const DEPTS: Array<StaffDepartment | 'All Departments'> = ['All Departments', 'Management', 'Kitchen', 'Service', 'Bar', 'Front Desk', 'Cleaning'];
const STATUSES: Array<StaffStatus | 'All'>             = ['All', 'Active', 'On Leave', 'Inactive'];

const ROLE_COLORS: Record<StaffRole, string> = {
  Manager:   'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  Chef:      'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  Server:    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  Bartender: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  Host:      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Cleaner:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const STATUS_COLORS: Record<StaffStatus, string> = {
  Active:    'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  'On Leave':'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Inactive:  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
};

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

// ── Modals ────────────────────────────────────────────────────────────────

function ViewStaffModal({ member, onClose, onEdit }: { member: StaffMember; onClose: () => void; onEdit: () => void }): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close modal" className="absolute inset-0 bg-black/50 backdrop-blur-sm w-full h-full cursor-default" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Staff Member Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xl font-bold">
              {member.avatar}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{member.name}</h3>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[member.role]}`}>{member.role}</span>
            </div>
            <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[member.status]}`}>{member.status}</span>
          </div>

          <div className="space-y-3">
            {[
              { icon: Mail,     label: 'Email',      value: member.email      },
              { icon: Phone,    label: 'Phone',      value: member.phone      },
              { icon: Building2,  label: 'Department', value: member.department },
              { icon: Calendar,   label: 'Hire Date',  value: member.hireDate   },
              { icon: DollarSign, label: 'Salary',     value: `₹${member.salary.toLocaleString()}` },
              { icon: Star,       label: 'Performance',value: `${member.performance} / 5.0` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Close</button>
          <button onClick={onEdit} className="px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-sm">Edit Member</button>
        </div>
      </div>
    </div>
  );
}

function EditStaffModal({ member, onClose }: { member: StaffMember; onClose: () => void }): JSX.Element {
  const { updateMember } = useStaffStore();
  const [form, setForm] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone,
    role: member.role,
    department: member.department,
    status: member.status,
    salary: String(member.salary),
    performance: member.performance,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.salary || isNaN(Number(form.salary))) e.salary = 'Valid salary required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const initials = form.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
    updateMember(member.id, {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      department: form.department,
      status: form.status,
      salary: Number(form.salary),
      performance: form.performance,
      avatar: initials,
    });
    onClose();
  };

  const field = (key: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close modal" className="absolute inset-0 bg-black/50 backdrop-blur-sm w-full h-full cursor-default" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Staff Member</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update details for {member.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="edit-name" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5"><User className="w-3.5 h-3.5" /> Full Name *</label>
            <input id="edit-name" type="text" value={form.name} onChange={(e) => field('name', e.target.value)} className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 text-gray-900 dark:text-gray-100 ${errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="edit-email" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5"><Mail className="w-3.5 h-3.5" /> Email *</label>
            <input id="edit-email" type="email" value={form.email} onChange={(e) => field('email', e.target.value)} className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 text-gray-900 dark:text-gray-100 ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="edit-phone" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5"><Phone className="w-3.5 h-3.5" /> Phone</label>
            <input id="edit-phone" type="text" value={form.phone} onChange={(e) => field('phone', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-role" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5"><Briefcase className="w-3.5 h-3.5" /> Role</label>
              <select id="edit-role" value={form.role} onChange={(e) => field('role', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-gray-100">
                {EDIT_ROLES.map((r: StaffRole) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="edit-dept" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5"><Building2 className="w-3.5 h-3.5" /> Department</label>
              <select id="edit-dept" value={form.department} onChange={(e) => field('department', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-gray-100">
                {EDIT_DEPTS.map((d: StaffDepartment) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-status" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5"><Calendar className="w-3.5 h-3.5" /> Status</label>
              <select id="edit-status" value={form.status} onChange={(e) => field('status', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-gray-100">
                {EDIT_STATUSES.map((s: StaffStatus) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="edit-salary" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5"><DollarSign className="w-3.5 h-3.5" /> Salary (₹) *</label>
              <input id="edit-salary" type="number" value={form.salary} onChange={(e) => field('salary', e.target.value)} className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none text-gray-900 dark:text-gray-100 ${errors.salary ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`} />
              {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ member, onClose }: { member: StaffMember; onClose: () => void }): JSX.Element {
  const { deleteMember } = useStaffStore();
  const handleDelete = () => { deleteMember(member.id); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close modal" className="absolute inset-0 bg-black/50 backdrop-blur-sm w-full h-full cursor-default" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Remove Staff Member</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Are you sure you want to remove <span className="font-semibold text-gray-800 dark:text-gray-200">{member.name}</span>? This action cannot be undone.</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={handleDelete} className="flex-1 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">Remove</button>
        </div>
      </div>
    </div>
  );
}

function ViewAllModal({ onClose }: { onClose: () => void }): JSX.Element {
  const { members } = useStaffStore();
  const [search, setSearch] = useState('');
  const filtered = members.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close modal" className="absolute inset-0 bg-black/50 backdrop-blur-sm w-full h-full cursor-default" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">All Staff Members</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{members.length} total members</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(m => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{m.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{m.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{m.email}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${ROLE_COLORS[m.role]}`}>{m.role}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[m.status]}`}>{m.status}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-400">No members found</div>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

function ActionMenu({  onView, onEdit, onDelete }: {
  member: StaffMember;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 w-40">
          <button
            type="button"
            onClick={() => { setOpen(false); onView(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View Details
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit Member
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onDelete(); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Table ─────────────────────────────────────────────────────────────

export function StaffTable(): JSX.Element {
  const {
    members, searchQuery, roleFilter, departmentFilter, statusFilter, currentPage, perPage, showAll,
    setSearchQuery, setRoleFilter, setDepartmentFilter, setStatusFilter, setCurrentPage,
  } = useStaffStore();

  const [viewMember,   setViewMember]   = useState<StaffMember | null>(null);
  const [editMember,   setEditMember]   = useState<StaffMember | null>(null);
  const [deleteMember, setDeleteMember] = useState<StaffMember | null>(null);
  const [showViewAll,  setShowViewAll]  = useState(false);

  // Renamed parameter to _member to satisfy linting rule
  const filtered = members.filter((_member) => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || _member.name.toLowerCase().includes(q) || _member.email.toLowerCase().includes(q);
    const matchR = roleFilter === 'All Roles' || _member.role === roleFilter;
    const matchD = departmentFilter === 'All Departments' || _member.department === departmentFilter;
    const matchS = statusFilter === 'All' || _member.status === statusFilter;
    return matchQ && matchR && matchD && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(currentPage, totalPages);
  const paged = showAll ? filtered : filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mr-2">Staff Members</h3>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 w-36 text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
            />
          </div>

          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as StaffRole | 'All Roles')} className="text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-300">
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>

          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value as StaffDepartment | 'All Departments')} className="text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-300">
            {DEPTS.map((d) => <option key={d}>{d}</option>)}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StaffStatus | 'All')} className="text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-300">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>

          <button
            type="button"
            onClick={() => setShowViewAll(true)}
            className="ml-auto text-xs font-semibold text-orange-500 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Staff Member', 'Role', 'Department', 'Phone', 'Status', 'Hire Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={m.avatar} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{m.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[m.role]}`}>{m.role}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{m.department}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{m.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[m.status]}`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{m.hireDate}</td>
                  <td className="px-4 py-3">
                    <ActionMenu
                      member={m}
                      onView={() => setViewMember(m)}
                      onEdit={() => setEditMember(m)}
                      onDelete={() => setDeleteMember(m)}
                    />
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">No staff members found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!showAll && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {paged.length > 0 ? (page - 1) * perPage + 1 : 0} to {Math.min(page * perPage, filtered.length)} of {filtered.length} staff
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage(page - 1)} disabled={page <= 1} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button type="button" key={p} onClick={() => setCurrentPage(p)} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${p === page ? 'bg-orange-500 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{p}</button>
              ))}
              <button type="button" onClick={() => setCurrentPage(page + 1)} disabled={page >= totalPages} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showViewAll   && <ViewAllModal    onClose={() => setShowViewAll(false)} />}
      {viewMember   && <ViewStaffModal  member={viewMember}  onClose={() => setViewMember(null)}  onEdit={() => { setEditMember(viewMember); setViewMember(null); }} />}
      {editMember   && <EditStaffModal  member={editMember}  onClose={() => setEditMember(null)}  />}
      {deleteMember && <DeleteConfirmModal member={deleteMember} onClose={() => setDeleteMember(null)} />}
    </>
  );
}