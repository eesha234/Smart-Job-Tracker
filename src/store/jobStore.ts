import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Job, JobFormData, FilterStatus, JobStatus } from '../types/job.types';

interface Store {
  jobs: Job[];
  search: string;
  filter: FilterStatus;
  formOpen: boolean;
  editing: Job | null;

  addJob: (d: JobFormData) => void;
  updateJob: (id: string, d: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  setStatus: (id: string, s: JobStatus) => void;
  setSearch: (v: string) => void;
  setFilter: (v: FilterStatus) => void;
  openForm: (job?: Job) => void;
  closeForm: () => void;
  filtered: () => Job[];
}

const SEED: Job[] = [
  { id: uuidv4(), companyName: 'Razorpay', role: 'Senior Frontend Engineer', status: 'Interview', appliedDate: '2025-03-15', jobLink: 'https://razorpay.com/jobs', notes: 'Great first round. Technical round scheduled.', followUpDate: '2025-04-02', createdAt: new Date().toISOString() },
  { id: uuidv4(), companyName: 'Zepto', role: 'React Developer', status: 'Applied', appliedDate: '2025-03-20', notes: 'Applied via LinkedIn.', followUpDate: '2025-04-05', createdAt: new Date().toISOString() },
  { id: uuidv4(), companyName: 'Groww', role: 'Frontend Lead', status: 'Offer', appliedDate: '2025-02-28', notes: 'Offer received! Negotiating CTC.', createdAt: new Date().toISOString() },
  { id: uuidv4(), companyName: 'Flipkart', role: 'SDE-2 Frontend', status: 'Rejected', appliedDate: '2025-02-10', notes: 'Rejected after final round.', createdAt: new Date().toISOString() },
  { id: uuidv4(), companyName: 'CRED', role: 'UI Engineer', status: 'Applied', appliedDate: '2025-03-25', jobLink: 'https://cred.club/careers', notes: 'Dream company.', followUpDate: '2025-04-01', createdAt: new Date().toISOString() },
];

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      jobs: SEED,
      search: '',
      filter: 'All',
      formOpen: false,
      editing: null,

      addJob: (d) => set(s => ({ jobs: [{ ...d, id: uuidv4(), createdAt: new Date().toISOString() }, ...s.jobs] })),
      updateJob: (id, d) => set(s => ({ jobs: s.jobs.map(j => j.id === id ? { ...j, ...d } : j) })),
      deleteJob: (id) => set(s => ({ jobs: s.jobs.filter(j => j.id !== id) })),
      setStatus: (id, status) => get().updateJob(id, { status }),
      setSearch: (v) => set({ search: v }),
      setFilter: (v) => set({ filter: v }),
      openForm: (job) => set({ formOpen: true, editing: job ?? null }),
      closeForm: () => set({ formOpen: false, editing: null }),

      filtered: () => {
        const { jobs, search, filter } = get();
        return jobs.filter(j => {
          const q = search.toLowerCase();
          const matchSearch = !q || j.companyName.toLowerCase().includes(q) || j.role.toLowerCase().includes(q);
          const matchFilter = filter === 'All' || j.status === filter;
          return matchSearch && matchFilter;
        });
      },
    }),
    { name: 'jobtrack-v2' }
  )
);
