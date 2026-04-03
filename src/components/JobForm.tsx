import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { useStore } from '../store/jobStore';
import { JobFormData, JobStatus } from '../types/job.types';
import { STATUS_STYLE } from '../utils/helpers';

const BLANK: JobFormData = {
  companyName: '', role: '', status: 'Applied',
  appliedDate: new Date().toISOString().split('T')[0],
  jobLink: '', notes: '', followUpDate: '',
};

const STATUSES: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];

const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div>
    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export const JobForm: React.FC = () => {
  const { formOpen, editing, closeForm, addJob, updateJob } = useStore();
  const [form, setForm] = useState<JobFormData>(BLANK);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  useEffect(() => {
    if (editing) {
      setForm({
        companyName: editing.companyName, role: editing.role, status: editing.status,
        appliedDate: editing.appliedDate, jobLink: editing.jobLink || '',
        notes: editing.notes || '', followUpDate: editing.followUpDate || '',
      });
    } else {
      setForm(BLANK);
    }
    setErrors({});
  }, [editing, formOpen]);

  const set = (k: keyof JobFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.companyName.trim()) e.companyName = 'Required';
    if (!form.role.trim()) e.role = 'Required';
    if (!form.appliedDate) e.appliedDate = 'Required';
    if (form.jobLink && !/^https?:\/\//i.test(form.jobLink)) e.jobLink = 'Must start with https://';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    editing ? updateJob(editing.id, form) : addJob(form);
    closeForm();
  };

  if (!formOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="backdrop absolute inset-0 animate-fade-in" onClick={closeForm} />

      <div className="relative z-10 bg-white rounded-2xl w-full max-w-md animate-slide-up overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="font-semibold text-zinc-900 text-base tracking-tight">
              {editing ? 'Edit application' : 'Track new job'}
            </h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">
              {editing ? 'Update the details below' : 'Add a role to your tracker'}
            </p>
          </div>
          <button onClick={closeForm}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">

          <div className="grid grid-cols-2 gap-3">
            <Field label="Company" error={errors.companyName}>
              <input value={form.companyName} onChange={set('companyName')} placeholder="Razorpay"
                className={`input w-full px-3 py-2 rounded-lg ${errors.companyName ? 'border-red-400' : ''}`} />
            </Field>
            <Field label="Role" error={errors.role}>
              <input value={form.role} onChange={set('role')} placeholder="Frontend Dev"
                className={`input w-full px-3 py-2 rounded-lg ${errors.role ? 'border-red-400' : ''}`} />
            </Field>
          </div>

          <Field label="Status">
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map(s => {
                const st = STATUS_STYLE[s];
                const active = form.status === s;
                return (
                  <button key={s} type="button"
                    onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`pill cursor-pointer transition-all ${active ? st.pill : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? st.dot : 'bg-zinc-300'}`} />
                    {s}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Applied date" error={errors.appliedDate}>
              <input type="date" value={form.appliedDate} onChange={set('appliedDate')}
                className={`input w-full px-3 py-2 rounded-lg ${errors.appliedDate ? 'border-red-400' : ''}`} />
            </Field>
            <Field label="Follow-up date">
              <input type="date" value={form.followUpDate} onChange={set('followUpDate')}
                className="input w-full px-3 py-2 rounded-lg" />
            </Field>
          </div>

          <Field label="Job link" error={errors.jobLink}>
            <input value={form.jobLink} onChange={set('jobLink')} placeholder="https://..."
              className={`input w-full px-3 py-2 rounded-lg ${errors.jobLink ? 'border-red-400' : ''}`} />
          </Field>

          <Field label="Notes">
            <textarea value={form.notes} onChange={set('notes')} rows={3}
              placeholder="Recruiter name, salary range, prep notes..."
              className="input w-full px-3 py-2 rounded-lg resize-none" />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <button onClick={closeForm} className="btn btn-ghost px-4 py-2 rounded-lg">Cancel</button>
          <button onClick={submit} className="btn btn-primary px-4 py-2 rounded-lg">
            {editing ? <Save size={14} /> : <Plus size={14} />}
            {editing ? 'Save changes' : 'Add job'}
          </button>
        </div>
      </div>
    </div>
  );
};
