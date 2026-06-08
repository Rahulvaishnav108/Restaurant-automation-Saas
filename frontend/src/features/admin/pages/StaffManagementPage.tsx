import React, { useState } from 'react';
import { Download, Plus, X, User, Mail, Phone, Briefcase, Building2, Calendar, DollarSign } from 'lucide-react';
import { StaffStatCards } from '../components/staff/StaffStatCards';
import { StaffTable } from '../components/staff/StaffTable';
import { TodaysSchedule, UpcomingBirthdays } from '../components/staff/StaffSchedule';
import {
  AttendanceOverview,
  PayrollSummary,
  PerformanceOverview,
  RolesDistribution,
} from '../components/staff/StaffAnalytics';
import { useStaffStore } from '../store/staff.store';
import type { StaffRole, StaffDepartment, StaffStatus } from '../store/staff.store';

// ── Add Staff Modal ────────────────────────────────────────────────────────

const ROLES: StaffRole[]       = ['Manager', 'Chef', 'Server', 'Bartender', 'Host', 'Cleaner'];
const DEPTS: StaffDepartment[] = ['Management', 'Kitchen', 'Service', 'Bar', 'Front Desk', 'Cleaning'];
const STATUSES: StaffStatus[]  = ['Active', 'On Leave', 'Inactive'];

interface AddStaffModalProps {
  onClose: () => void;
}

function AddStaffModal({ onClose }: AddStaffModalProps): JSX.Element {
  const { addMember } = useStaffStore();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    role: 'Server' as StaffRole,
    department: 'Service' as StaffDepartment,
    status: 'Active' as StaffStatus,
    salary: '',
    hireDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    performance: 4.0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.salary || isNaN(Number(form.salary))) e.salary = 'Valid salary required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const initials = form.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    addMember({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      department: form.department,
      status: form.status,
      salary: Number(form.salary),
      hireDate: form.hireDate,
      performance: form.performance,
      avatar: initials,
    });
    onClose();
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default" aria-label="Close modal" />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Add Staff Member</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Fill in the details to add a new team member</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="add-name" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5" /> Full Name *
            </label>
            <input
              id="add-name"
              type="text"
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={(e) => field('name', e.target.value)}
              className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 ${errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="add-email" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5">
              <Mail className="w-3.5 h-3.5" /> Email *
            </label>
            <input
              id="add-email"
              type="email"
              placeholder="jane@restaurant.com"
              value={form.email}
              onChange={(e) => field('email', e.target.value)}
              className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="add-phone" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone *
            </label>
            <input
              id="add-phone"
              type="text"
              placeholder="+91 98765 00000"
              value={form.phone}
              onChange={(e) => field('phone', e.target.value)}
              className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 ${errors.phone ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="add-role" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Role
              </label>
              <select id="add-role" value={form.role} onChange={(e) => field('role', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-gray-100">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="add-dept" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5">
                <Building2 className="w-3.5 h-3.5" /> Department
              </label>
              <select id="add-dept" value={form.department} onChange={(e) => field('department', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-gray-100">
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="add-status" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5" /> Status
              </label>
              <select id="add-status" value={form.status} onChange={(e) => field('status', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-gray-100">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="add-salary" className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Salary (₹) *
              </label>
              <input
                id="add-salary"
                type="number"
                placeholder="35000"
                value={form.salary}
                onChange={(e) => field('salary', e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 ${errors.salary ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              />
              {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-sm">
            Add Staff Member
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Export Report Modal ────────────────────────────────────────────────────

interface ExportReportModalProps {
  onClose: () => void;
}

function ExportReportModal({ onClose }: ExportReportModalProps): JSX.Element {
  const { members } = useStaffStore();
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [fields, setFields] = useState({
    name: true, email: true, role: true, department: true,
    phone: true, status: true, hireDate: true, salary: false, performance: false,
  });
  const [exported, setExported] = useState(false);

  const toggleField = (k: keyof typeof fields) => setFields(prev => ({ ...prev, [k]: !prev[k] }));

  const handleExport = () => {
    const activeFields = Object.entries(fields).filter(([, v]) => v).map(([k]) => k) as Array<keyof typeof fields>;
    const data = members.map(m => {
      const row: Record<string, unknown> = {};
      activeFields.forEach(f => { row[f] = m[f]; });
      return row;
    });

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      const headers = activeFields.join(',');
      const rows = data.map(r => activeFields.map(f => `"${r[f] ?? ''}"`).join(','));
      content = [headers, ...rows].join('\n');
      filename = `staff-report-${new Date().toISOString().slice(0,10)}.csv`;
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify(data, null, 2);
      filename = `staff-report-${new Date().toISOString().slice(0,10)}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(onClose, 1200);
  };

  const FIELD_LABELS: Record<keyof typeof fields, string> = {
    name: 'Full Name', email: 'Email', role: 'Role', department: 'Department',
    phone: 'Phone', status: 'Status', hireDate: 'Hire Date', salary: 'Salary', performance: 'Performance',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default" aria-label="Close modal" />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Export Staff Report</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{members.length} staff members will be exported</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Export Format</p>
            <div className="flex gap-2">
              {(['csv', 'json'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${format === f ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Include Fields</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(fields) as Array<keyof typeof fields>).map(k => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fields[k]}
                    onChange={() => toggleField(k)}
                    className="w-3.5 h-3.5 accent-orange-500"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{FIELD_LABELS[k]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleExport}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl transition-colors shadow-sm ${exported ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            <Download className="w-3.5 h-3.5" />
            {exported ? 'Exported!' : `Export as ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function StaffManagementPage(): JSX.Element {
  const [showAddModal,       setShowAddModal]       = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Staff Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your team, schedules, roles and performance</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Staff
          </button>
        </div>
      </div>

      <StaffStatCards />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <StaffTable />
        <div className="space-y-4">
          <TodaysSchedule />
          <UpcomingBirthdays />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AttendanceOverview />
        <PayrollSummary />
        <PerformanceOverview />
        <RolesDistribution />
      </div>

      {showAddModal      && <AddStaffModal    onClose={() => setShowAddModal(false)}    />}
      {showExportModal && <ExportReportModal onClose={() => setShowExportModal(false)} />}
    </div>
  );
}