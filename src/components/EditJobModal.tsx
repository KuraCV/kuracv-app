import React, { useState, useEffect } from 'react';
import FormTutorialModal from '@/components/FormTutorialModal';

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id?: string;
    title: string;
    department: string;
    location: string;
    location_model?: string;
    type: string;
    employment_type?: string;
    status: string;
    requirements?: string;
    form_link?: string;
  };
  onSave: (updatedJob: any) => Promise<boolean>;
  isSaving?: boolean;
}

export default function EditJobModal({ isOpen, onClose, job, onSave, isSaving }: EditJobModalProps) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);

  const WEBHOOK_BASE = "https://kuracv-service-207878771603.asia-southeast2.run.app/api/applicants/webhook/";
  const webhookUrl = job.id ? `${WEBHOOK_BASE}${job.id}/` : "";
  const [jobTitle, setJobTitle] = useState(job.title);
  const [department, setDepartment] = useState(job.department);
  const [location, setLocation] = useState(job.location || job.location_model || "Remote");
  const [type, setType] = useState(job.type || job.employment_type || "Full-time");
  const [status, setStatus] = useState(job.status);
  const [requirements, setRequirements] = useState(job.requirements || "");
  const [appLink, setAppLink] = useState(job.form_link || "");

  // Sync state with job prop when modal opens or job prop changes
  useEffect(() => {
    setJobTitle(job.title || "");
    setDepartment(job.department || "");
    setLocation(job.location || job.location_model || "Remote");
    setType(job.type || job.employment_type || "Full-time");
    setStatus(job.status || "Active");
    setRequirements(job.requirements || "");
    setAppLink(job.form_link || "");
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave({
      title: jobTitle,
      department,
      location_model: location,
      location,
      employment_type: type,
      type,
      status,
      requirements,
      form_link: appLink,
    });
    if (success && job.id) {
      setShowWebhook(true);
    }
  };

  if (showWebhook) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-teal-600 px-6 py-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white">Job Updated!</h2>
            <p className="text-sm text-teal-100 mt-1">Your webhook URL is shown below. Make sure your Apps Script is using the correct URL.</p>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Webhook URL</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <code className="text-xs text-slate-700 break-all font-mono leading-relaxed">{webhookUrl}</code>
              </div>
            </div>
            <button
              onClick={handleCopyWebhook}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                webhookCopied ? "bg-green-100 text-green-700 border border-green-200" : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {webhookCopied ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  Copy Webhook URL
                </>
              )}
            </button>
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              <p className="text-xs text-amber-700 leading-relaxed">
                Paste this URL into your Apps Script, replacing the <strong>webhookUrl</strong> variable. Each job has a unique URL.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1E293B]">Edit Job Details</h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-[#64748B] hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer"
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
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#64748B]">Application Form Link</label>
                <button
                  type="button"
                  onClick={() => setIsTutorialOpen(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Connect form to KuraCV tutorial
                </button>
              </div>
              <input
                type="text"
                placeholder="https://forms.google.com/..."
                value={appLink}
                onChange={(e) => setAppLink(e.target.value)}
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
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-slate-50 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="edit-job-form"
            disabled={isSaving}
            className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

      </div>
      <FormTutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
}
