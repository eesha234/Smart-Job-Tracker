import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Trash2, Pencil, ChevronDown, Bell, CalendarDays } from 'lucide-react';
import { Job, JobStatus } from '../types/job.types';
import { useStore } from '../store/jobStore';
import { STATUS_STYLE, fmt, daysSince, isOverdue, isDueSoon } from '../utils/helpers';

const ALL_STATUSES: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];

export const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const { setStatus, deleteJob, openForm } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const st = STATUS_STYLE[job.status];
  const overdue = isOverdue(job.followUpDate);
  const soon = isDueSoon(job.followUpDate);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="card rounded-xl p-5 flex flex-col gap-3.5 animate-slide-up">

      {/* Company + role */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-900 text-[15px] leading-snug truncate tracking-tight">
            {job.companyName}
          </p>
          <p className="text-zinc-500 text-[13px] mt-0.5 truncate">{job.role}</p>
        </div>

        {/* Status dropdown */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className={`pill ${st.pill} cursor-pointer hover:opacity-80 transition-opacity`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
            {st.label}
            <ChevronDown size={10} className={`transition-transform duration-150 ml-0.5 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-card-hover z-30 overflow-hidden w-36 animate-fade-in py-1">
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => { setStatus(job.id, s); setMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center gap-2.5 transition-colors
                    ${job.status === s ? 'bg-zinc-50 text-zinc-900 font-medium' : 'text-zinc-600 hover:bg-zinc-50'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_STYLE[s].dot}`} />
                  {STATUS_STYLE[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dates row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-[12px] text-zinc-400 font-mono">
          <CalendarDays size={11} />
          {fmt(job.appliedDate)}
          {daysSince(job.appliedDate) > 0 && (
            <span className="text-zinc-300 font-sans">· {daysSince(job.appliedDate)}d ago</span>
          )}
        </span>

        {job.followUpDate && (
          <span className={`flex items-center gap-1 text-[12px] font-medium
            ${overdue ? 'text-red-500' : soon ? 'text-amber-500' : 'text-zinc-400'}`}>
            <Bell size={11} />
            {overdue ? 'Follow-up overdue' : soon ? 'Follow-up soon' : `Follow-up ${fmt(job.followUpDate)}`}
          </span>
        )}
      </div>

      {/* Notes */}
      {job.notes && (
        <p className="text-[12.5px] text-zinc-400 leading-relaxed line-clamp-2 border-l-2 border-zinc-100 pl-3">
          {job.notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
        {job.jobLink ? (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[12px] text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors"
          >
            <ExternalLink size={11} />
            View listing
          </a>
        ) : <span />}

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => openForm(job)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors"
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => deleteJob(job.id)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
