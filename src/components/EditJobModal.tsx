import React, { useState, useEffect } from 'react';

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    title: string;
    department: string;
    location: string;
    type: string;
    status: string;
  };
  onSave: (updatedJob: {
    title: string;
    department: string;
    location: string;
    type: string;
    status: string;
  }) => void;
}

export default function EditJobModal({ isOpen, onClose, job, onSave }: EditJobModalProps) {
  const [jobTitle, setJobTitle] = useState(job.title);
  const [department, setDepartment] = useState(job.department);
  const [location, setLocation] = useState(job.location);
  const [type, setType] = useState(job.type);
  const [status, setStatus] = useState(job.status);

  // Sync state with job prop when modal opens or job prop changes
  useEffect(() => {
    setJobTitle(job.title);
    setDepartment(job.department);
    setLocation(job.location);
    setType(job.type);
    setStatus(job.status);
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: jobTitle,
      department,
      location,
      type,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1E293B]">Edit Job Details</h2>
          <button 
            onClick={onClose}
            className="text-[#64748B] hover:bg-slate-100 p-1.5 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="edit-job-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#64748B]">Job Title</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#64748B]">Department</label>
                <input 
                  type="text" 
                  placeholder="e.g. Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#64748B]">Employment Type</label>
                <div className="relative">
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#64748B]">Location Model</label>
                <div className="flex gap-4">
                  {['Remote', 'Hybrid', 'On-site'].map((loc) => (
                    <label key={loc} className={`flex-1 flex items-center justify-center py-2 border rounded-md cursor-pointer transition-all text-sm ${location === loc ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9] bg-[#F8FAFC]'}`}>
                      <input 
                        type="radio" 
                        name="location" 
                        value={loc}
                        checked={location === loc}
                        onChange={() => setLocation(loc)}
                        className="hidden" 
                      />
                      {loc}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#64748B]">Job Status</label>
                <div className="relative">
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#64748B]">Job Requirements</label>
              <textarea 
                placeholder="Describe the ideal candidate..."
                rows={4}
                defaultValue="Looking for a highly skilled Senior Frontend Developer to join our core engineering team. Ideal candidate should have 5+ years of experience with React and Next.js, deep understanding of Tailwind CSS, and experience with modern state management libraries. A background in building accessible interfaces is a huge plus."
                className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#64748B]">Application Form Link</label>
              <input 
                type="text" 
                placeholder="https://forms.google.com/..."
                defaultValue="https://forms.google.com/kuracv-apply/senior-frontend"
                className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-[#E2E8F0] bg-white">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-slate-50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="edit-job-form"
            className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
