import React, { useState } from 'react';
import { apiFetch, ApiError } from '@/utils/api';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: () => void;
}

export default function CreateJobModal({ isOpen, onClose, onJobCreated }: CreateJobModalProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("Remote");
  const [type, setType] = useState("Full-time");
  const [status, setStatus] = useState("Active");
  const [requirements, setRequirements] = useState("");
  const [appLink, setAppLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      setErrorMsg("Job title is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await apiFetch("/api/jobs/", {
        method: "POST",
        body: JSON.stringify({
          title: jobTitle,
          department: department,
          location_model: location,
          employment_type: type,
          status: status,
          requirements: requirements,
          form_link: appLink,
        }),
      });

      // Reset Form fields
      setJobTitle("");
      setDepartment("");
      setLocation("Remote");
      setType("Full-time");
      setStatus("Active");
      setRequirements("");
      setAppLink("");

      if (onJobCreated) {
        onJobCreated();
      }
      onClose();
    } catch (err: any) {
      console.error("Failed to create job:", err);
      if (err instanceof ApiError) {
        // Handle nested django field error arrays
        const errorDetail = err.data.detail || err.data.error;
        if (errorDetail) {
          setErrorMsg(errorDetail);
        } else {
          const fieldErrors = Object.entries(err.data)
            .map(([field, msgs]) => {
              const formattedMsgs = Array.isArray(msgs) ? msgs.join(" ") : String(msgs);
              return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${formattedMsgs}`;
            })
            .join(" | ");
          setErrorMsg(fieldErrors || "Failed to create job. Please verify your inputs.");
        }
      } else {
        setErrorMsg("Failed to connect to the server. Please check your network connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1E293B]">Create New Job</h2>
          <button 
            onClick={onClose}
            className="text-[#64748B] hover:bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="create-job-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {errorMsg && (
              <div className="w-full bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm font-medium leading-5 flex-1">{errorMsg}</div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#64748B]">Job Title</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-1 focus:ring-primary"
                required
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#64748B]">Employment Type</label>
                <div className="relative">
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#64748B]">Application Form Link</label>
              <input 
                type="text" 
                placeholder="https://forms.google.com/..."
                value={appLink}
                onChange={(e) => setAppLink(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-[#E2E8F0] bg-white">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="create-job-form"
            className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 min-w-[120px] cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              "Create Job"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
