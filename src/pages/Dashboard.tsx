import React, { useState } from 'react';
import { Plus, Search, X, Bell, Briefcase, TrendingUp, Trophy, XCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../store/jobStore';
import { JobCard } from '../components/JobCard';
import { JobForm } from '../components/JobForm';
import { FilterStatus, JobStatus } from '../types/job.types';
import { STATUS_STYLE, isOverdue } from '../utils/helpers';

const FILTERS: FilterStatus[] = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

const STAT_CONFIG = [
  { key: 'Applied',   label: 'Applied',     icon: Briefcase,   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  { key: 'Interview', label: 'Interviewing', icon: TrendingUp,  color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100' },
  { key: 'Offer',     label: 'Offers',       icon: Trophy,      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { key: 'Rejected',  label: 'Rejected',     icon: XCircle,     color: 'text-zinc-400',    bg: 'bg-zinc-50',    border: 'border-zinc-100' },
] as const;

export const Dashboard: React.FC = () => {
  const { jobs, search, filter, setSearch, setFilter, openForm, filtered } = useStore();
  const [heroDismissed, setHeroDismissed] = useState(false);
  const list = filtered();

  const counts = {
    Applied:   jobs.filter(j => j.status === 'Applied').length,
    Interview: jobs.filter(j => j.status === 'Interview').length,
    Offer:     jobs.filter(j => j.status === 'Offer').length,
    Rejected:  jobs.filter(j => j.status === 'Rejected').length,
  };

  const overdueCount = jobs.filter(j => isOverdue(j.followUpDate)).length;
  const total = jobs.length;

  return (
    <div className="min-h-screen bg-[#f8f8fb]">

      {/* ── Nav ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200/60 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <Briefcase size={13} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold text-zinc-900 tracking-tight">JobTrack</span>
          </div>
          <div className="flex items-center gap-3">
            {overdueCount > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                <Bell size={11} />{overdueCount} overdue
              </span>
            )}
            <button onClick={() => openForm()} className="btn btn-primary px-3.5 py-2 rounded-lg">
              <Plus size={14} />Add job
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      {!heroDismissed && (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
          {/* 3D floating planes */}
          <div className="hero-scene">
            <div className="hero-dots" />
            <div className="plane plane-1" />
            <div className="plane plane-2" />
            <div className="plane plane-3" />
            <div className="plane plane-4" />
            <div className="plane plane-5" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="fade-up fade-up-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-indigo-300" />
                <span className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">
                  Why this exists
                </span>
              </div>
              <h2 className="text-white text-2xl font-semibold tracking-tight leading-snug mb-2 max-w-lg">
                Job hunting is chaos.<br />
                <span className="text-indigo-200">This keeps you in control.</span>
              </h2>
              <p className="text-indigo-200/80 text-sm max-w-md leading-relaxed">
                Spreadsheets get messy. Emails get buried. JobTrack gives you one clean place to log every application, track where things stand, and never miss a follow-up — so you can focus on actually getting hired.
              </p>
              <button
                onClick={() => openForm()}
                className="mt-5 inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Start tracking <ChevronRight size={15} />
              </button>
            </div>

            {/* Mini stat preview */}
            {total > 0 && (
              <div className="fade-up fade-up-2 grid grid-cols-2 gap-2.5 flex-shrink-0">
                {STAT_CONFIG.map(s => (
                  <div key={s.key}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-center min-w-[90px]">
                    <p className="text-white text-xl font-bold leading-none">{counts[s.key as keyof typeof counts]}</p>
                    <p className="text-indigo-200 text-[11px] mt-1 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setHeroDismissed(true)}
            className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Stat cards ── */}
        {total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 fade-up fade-up-2">
            {STAT_CONFIG.map((s, i) => {
              const Icon = s.icon;
              const val = counts[s.key as keyof typeof counts];
              return (
                <div key={s.key} className={`stat-card rounded-xl p-4 border ${s.border}`}
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                    <Icon size={15} className={s.color} />
                  </div>
                  <p className={`text-2xl font-bold leading-none ${s.color}`}>{val}</p>
                  <p className="text-zinc-400 text-[12px] font-medium mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Section header ── */}
        <div className="flex items-center justify-between mb-5 fade-up fade-up-3">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">
              {heroDismissed ? 'Your Applications' : 'All Applications'}
            </h1>
            <p className="text-[12.5px] text-zinc-400 mt-0.5">
              {total === 0 ? 'Nothing tracked yet — add your first job.' : `${total} application${total !== 1 ? 's' : ''} tracked`}
            </p>
          </div>
          {heroDismissed && (
            <button onClick={() => openForm()} className="btn btn-primary px-3.5 py-2 rounded-lg text-sm">
              <Plus size={14} />Add job
            </button>
          )}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-6 fade-up fade-up-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input w-full pl-9 pr-8 py-2 rounded-xl text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map(f => {
              const active = filter === f;
              const isStatus = f !== 'All';
              const count = isStatus ? counts[f as JobStatus] : total;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[12.5px] font-medium px-3 py-1.5 rounded-xl border transition-all ${
                    active
                      ? isStatus
                        ? STATUS_STYLE[f as JobStatus].pill
                        : 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'
                  }`}
                >
                  {f}
                  {active && count > 0 && (
                    <span className="ml-1.5 opacity-60 font-mono text-[11px]">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Grid ── */}
        {list.length === 0 ? (
          <div className="text-center py-20 fade-up">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase size={20} className="text-zinc-300" />
            </div>
            <p className="text-base font-medium text-zinc-700 mb-1">
              {search || filter !== 'All' ? 'No results' : 'Nothing here yet'}
            </p>
            <p className="text-sm text-zinc-400 mb-5">
              {search || filter !== 'All' ? 'Try a different search or filter.' : 'Add your first job application to get started.'}
            </p>
            {!search && filter === 'All' && (
              <button onClick={() => openForm()} className="btn btn-primary px-4 py-2.5 rounded-xl">
                <Plus size={14} />Add first job
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-[11.5px] text-zinc-400 font-mono mb-3">
              {list.length} result{list.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {list.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </>
        )}
      </main>

      <JobForm />
    </div>
  );
};
