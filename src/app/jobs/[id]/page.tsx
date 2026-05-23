"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/utils/api";
import EditJobModal from "@/components/EditJobModal";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;

  const [job, setJob] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("candidates");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Applicants state
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<boolean>(false);
  
  // Email generation state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  
  // Editable baseline requirements state
  const [requirementsVal, setRequirementsVal] = useState("");

  const fetchJobDetails = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data: any = await apiFetch(`/api/jobs/${jobId}/`);
      setJob(data);
      setRequirementsVal(data.requirements || "");
    } catch (err) {
      console.error("Failed to load job details:", err);
      setErrorMsg("Failed to retrieve the job details from server.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicants = async () => {
    if (!jobId) return;
    setIsLoadingApplicants(true);
    try {
      const response: any = await apiFetch(`/api/applicants/job/${jobId}/`);
      const applicantsList = response.applicants || [];
      console.log("Fetched applicants:", applicantsList);
      setApplicants(applicantsList);
    } catch (err) {
      console.error("Failed to load applicants:", err);
      // Don't set error for applicants - it's secondary data
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!selectedCandidate || !job) return;
    setIsGeneratingEmail(true);
    setEmailCopied(false);
    try {
      const response: any = await apiFetch(`/api/applicants/email/send/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedCandidate.name,
          job_title: job.title,
          summary: selectedCandidate.aiSummary,
        }),
      });
      setEmailBody(response.email_body || "");
      setIsEmailModalOpen(true);
    } catch (err) {
      console.error("Failed to generate email:", err);
      alert("Failed to generate email. Please try again.");
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBody);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (selectedCandidate.email) {
      const subject = `Application Status - ${job?.title || "Job Position"}`;
      const mailtoLink = `mailto:${selectedCandidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;
      setIsEmailModalOpen(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      fetchApplicants();
    }
  }, [jobId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!job) return;
    try {
      const updated: any = await apiFetch(`/api/jobs/${jobId}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setJob(updated);
    } catch (err) {
      console.error("Failed to update job status:", err);
      alert("Failed to update status on server.");
    }
  };

  const handleUpdateEngine = async () => {
    try {
      const updated: any = await apiFetch(`/api/jobs/${jobId}/`, {
        method: "PATCH",
        body: JSON.stringify({ requirements: requirementsVal }),
      });
      setJob(updated);
      alert("AI engine requirements baseline updated successfully!");
    } catch (err) {
      console.error("Failed to update baseline:", err);
      alert("Failed to update requirements baseline.");
    }
  };

  const handleSaveJob = async (updatedPayload: any) => {
    setIsSavingJob(true);
    setSaveFeedback(null);
    try {
      const updated: any = await apiFetch(`/api/jobs/${jobId}/`, {
        method: "PUT",
        body: JSON.stringify({
          title: updatedPayload.title,
          department: updatedPayload.department,
          location_model: updatedPayload.location_model,
          employment_type: updatedPayload.employment_type,
          status: updatedPayload.status,
          requirements: updatedPayload.requirements,
          form_link: updatedPayload.form_link,
        }),
      });
      setJob(updated);
      setRequirementsVal(updated.requirements || "");
      setIsEditModalOpen(false);
      setSaveFeedback({ type: "success", message: "Job details updated successfully!" });
      setTimeout(() => setSaveFeedback(null), 3000);
    } catch (err) {
      console.error("Failed to save changes:", err);
      setSaveFeedback({ 
        type: "error", 
        message: err instanceof ApiError ? err.data.detail || "Failed to save job modifications." : "Failed to save job modifications." 
      });
    } finally {
      setIsSavingJob(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiFetch(`/api/jobs/${jobId}/`, {
        method: "DELETE",
      });
      alert("Job deleted successfully.");
      router.push("/jobs");
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("Failed to delete this job posting. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleCopyLink = () => {
    if (!job?.form_link) {
      alert("No application link specified for this job.");
      return;
    }
    navigator.clipboard.writeText(job.form_link);
    alert("Application link copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-teal-100 text-teal-800 focus:ring-teal-500 border-teal-200";
      case "Closed": return "bg-slate-200 text-slate-800 focus:ring-slate-500 border-slate-300";
      case "Draft": return "bg-amber-100 text-amber-800 focus:ring-amber-500 border-amber-200";
      default: return "bg-teal-100 text-teal-800 focus:ring-teal-500 border-teal-200";
    }
  };

  // Map API applicants to display format
  const candidates = applicants.map((applicant: any, idx: number) => {
    const statusMap: { [key: string]: string } = {
      "Meet Criteria": "Meet Criteria",
      "Considerable": "Considerable",
      "Failed": "Failed",
    };
    return {
      id: idx,
      name: applicant.name,
      email: applicant.email,
      role: job?.title || "Applicant",
      match: applicant.match_percentage || 0,
      status: statusMap[applicant.status] || applicant.status || "Pending",
      date: applicant.created_at ? new Date(applicant.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A",
      avatar: null,
      aiSummary: applicant.summary || "Awaiting summary.",
      skills: (applicant.skills || []).map((skill: any) => ({
        name: typeof skill === "string" ? skill : skill.name,
        matched: true,
      })),
      cv_url: applicant.cv_url,
    };
  });

  const isSuccess = selectedCandidate?.status === "Meet Criteria" || selectedCandidate?.status === "Considerable";

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="w-12 h-12 border-4 border-[#5EEAD4]/20 border-t-[#0F766E] rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500 font-sans">Loading job details...</p>
        </div>
      </AppLayout>
    );
  }

  if (errorMsg || !job) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <svg className="w-16 h-16 text-rose-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-base font-bold text-slate-800 mb-1">{errorMsg || "Job posting not found"}</p>
          <Link href="/jobs" className="mt-4 bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0F766E]/90">
            Back to Job Listings
          </Link>
        </div>
      </AppLayout>
    );
  }

  const jobLoc = job.location_model || job.location || "Remote";
  const jobType = job.employment_type || job.type || "Full-time";

  return (
    <AppLayout>
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="text-slate-500 hover:text-primary transition-colors bg-white border border-slate-200 rounded-full p-2 shadow-sm cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
              <div className="relative inline-flex items-center">
                <select 
                  value={job.status || "Active"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`${getStatusColor(job.status)} text-xs font-bold pl-3 pr-7 py-1 rounded-full uppercase tracking-wide border border-transparent outline-none cursor-pointer focus:ring-2 appearance-none hover:opacity-80 transition-opacity m-0`}
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
                <svg className={`w-3 h-3 absolute right-2.5 pointer-events-none ${job.status === 'Active' ? 'text-teal-800' : job.status === 'Closed' ? 'text-slate-800' : 'text-amber-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {job.department || "General"} • {jobLoc} • {jobType}
            </p>
          </div>
        </div>
        
        {/* Buttons Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            Edit Job
          </button>
          
          <button 
            onClick={handleDeleteJob}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            Delete
          </button>

          <button 
            onClick={handleCopyLink}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Share Link
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Candidates", value: "128", trend: "+12", trendUp: true },
          { label: "High Match (>80%)", value: "24", trend: "+3", trendUp: true },
          { label: "Shortlisted", value: "12", trend: "0", trendUp: true },
          { label: "Interviewing", value: "5", trend: "+1", trendUp: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp && stat.trend !== "0" ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'}`}>
                {stat.trend} this week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex border-b border-slate-200 px-2 bg-slate-50 justify-between items-center">
          <div className="flex">
            <button 
              onClick={() => setActiveTab("candidates")}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === "candidates" ? "border-primary text-primary bg-white font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Candidates Pool
            </button>
            <button 
              onClick={() => setActiveTab("details")}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === "details" ? "border-primary text-primary bg-white font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Job Details
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="p-0 flex-1">
          {activeTab === "candidates" && (
            <div className="overflow-x-auto">
              {isLoadingApplicants ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500">Loading applicants...</p>
                  </div>
                </div>
              ) : candidates.length === 0 ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <p className="text-slate-500 text-sm font-medium">No applicants yet</p>
                  </div>
                </div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-white">
                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Candidate Name</th>
                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">AI Match Score</th>
                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Current Role</th>
                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Applied Date</th>
                        <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {candidates.map((c) => (
                        <tr key={c.id} className="hover:bg-[#F0FDF4] transition-colors cursor-pointer bg-white group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] border border-slate-200 flex items-center justify-center text-[#475569] font-bold text-sm">
                                {c.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-100 rounded-full h-2 max-w-[120px] overflow-hidden">
                                <div className={`h-2 rounded-full ${c.match > 85 ? 'bg-[#5EEAD4]' : c.match > 70 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${c.match}%` }}></div>
                              </div>
                              <span className="text-sm font-bold text-slate-700 w-8">{c.match}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">{c.role}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                              c.status === 'Meet Criteria' ? 'bg-[#E6F4F1] text-[#0F766E]' :
                              c.status === 'Considerable' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{c.date}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => setSelectedCandidate(c)}
                              className="text-[#0F766E] hover:underline text-sm font-bold border-none bg-transparent cursor-pointer"
                            >
                              View Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-slate-500 text-xs font-medium">
                    <span>Showing 1-{candidates.length} of {candidates.length} applicant{candidates.length !== 1 ? "s" : ""}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="p-8 max-w-4xl animate-in fade-in duration-200">
              
              <div className="border border-[#E2E8F0] rounded-xl p-6 mb-8 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <svg className="w-6 h-6 text-[#0F766E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                  </svg>
                  <h2 className="text-xl font-bold text-[#1E293B]">Job Requirements Baseline</h2>
                </div>

                <div className="relative">
                  <textarea 
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 text-sm text-[#334155] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#5EEAD4] focus:ring-1 focus:ring-[#5EEAD4] transition-all min-h-[160px] pb-16 resize-y"
                    placeholder="Describe your ideal candidate in plain English..."
                    value={requirementsVal}
                    onChange={(e) => setRequirementsVal(e.target.value)}
                  ></textarea>
                  <button 
                    onClick={handleUpdateEngine}
                    className="absolute bottom-4 right-4 bg-[#5EEAD4] text-[#0F766E] px-4 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-[#5EEAD4]/80 transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                      <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                      <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    Update AI Engine
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-3">Application Form Link</h3>
              {job.form_link ? (
                <div className="bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-4 py-3 flex items-center justify-between w-full max-w-xl shadow-sm">
                  <span className="text-slate-600 text-sm truncate mr-4">{job.form_link}</span>
                  <button 
                    onClick={handleCopyLink}
                    className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1 cursor-pointer border-none bg-transparent"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No application form link configured.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200 relative">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#475569] font-bold text-xl overflow-hidden">
                  {selectedCandidate.avatar ? (
                    <img src={selectedCandidate.avatar} alt={selectedCandidate.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedCandidate.name.split(' ').map((n: string) => n[0]).join('')
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E293B]">{selectedCandidate.name}</h3>
                  <p className="text-[15px] text-[#64748B]">{selectedCandidate.role}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-sm ${isSuccess ? 'bg-[#E6F4F1] text-[#0F766E]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                {isSuccess ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                )}
                {selectedCandidate.match}% Match
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 mb-5 relative">
              <div className="absolute top-3 right-3 text-[#CBD5E1]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0-2 4 5 5 0 0 0 5 5v1a3 3 0 0 0 6 0v-1a5 5 0 0 0 5-5 5 5 0 0 0-2-4V7a5 5 0 0 0-5-5z"></path>
                </svg>
              </div>
              <p className="text-[15px] text-[#334155] leading-relaxed pr-6">
                <strong className={`${isSuccess ? 'text-[#0F766E]' : 'text-[#DC2626]'} mr-1`}>AI Summary:</strong>
                {selectedCandidate.aiSummary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCandidate.skills.map((skill: any) => (
                <span key={skill.name} className={`text-[13px] font-mono px-3 py-1.5 rounded-full shadow-sm ${skill.matched ? 'bg-[#0F766E] text-white border border-transparent' : 'bg-[#E2E8F0] text-[#475569] border border-[#CBD5E1]'}`}>
                  {skill.name}
                </span>
              ))}
            </div>

            <div className="border-t border-[#E2E8F0] pt-5 grid grid-cols-2 gap-3">
              <button 
                onClick={handleGenerateEmail}
                disabled={isGeneratingEmail}
                className={`w-full font-bold py-2.5 rounded-md transition-colors text-sm cursor-pointer flex items-center justify-center gap-2 ${isSuccess ? 'bg-[#0F766E] text-white hover:bg-[#0F766E]/90 disabled:opacity-50' : 'bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#334155] disabled:opacity-50'}`}
              >
                {isGeneratingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <path d="m22 6-10 7L2 6"></path>
                    </svg>
                    Generate Email
                  </>
                )}
              </button>
              <button 
                onClick={() => {
                  if (selectedCandidate.cv_url) {
                    const cvUrl = `https://drive.google.com/file/d/${selectedCandidate.cv_url}/view`;
                    window.open(cvUrl, '_blank');
                  }
                }}
                disabled={!selectedCandidate.cv_url}
                className="w-full bg-white border border-[#0F766E] text-[#0F766E] hover:bg-[#F8FAFC] font-bold py-2.5 rounded-md transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M9 15l3 3 5-5"></path>
                </svg>
                View CV
              </button>
            </div>
          </div>
          <div className="fixed inset-0 z-[-1]" onClick={() => setSelectedCandidate(null)}></div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && emailBody && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200 relative max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E6F4F1] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0F766E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <path d="m22 6-10 7L2 6"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E293B]">Email to {selectedCandidate?.name}</h3>
                  <p className="text-[15px] text-[#64748B]">{selectedCandidate?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#475569] transition-colors p-1"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 mb-5 min-h-[200px] max-h-[400px] overflow-y-auto">
              <p className="text-[15px] text-[#334155] leading-relaxed whitespace-pre-wrap font-sans">
                {emailBody}
              </p>
            </div>

            <div className="border-t border-[#E2E8F0] pt-5 flex gap-3">
              <button 
                onClick={handleCopyEmail}
                className={`flex-1 font-bold py-2.5 rounded-md transition-colors text-sm cursor-pointer flex items-center justify-center gap-2 ${
                  emailCopied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#334155]'
                }`}
              >
                {emailCopied ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                    Copy Email
                  </>
                )}
              </button>
              <button 
                onClick={handleSendEmail}
                className="flex-1 bg-[#0F766E] text-white hover:bg-[#0F766E]/90 font-bold py-2.5 rounded-md transition-colors text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <path d="m22 6-10 7L2 6"></path>
                </svg>
                Send Email
              </button>
            </div>
          </div>
          <div className="fixed inset-0 z-[-1]" onClick={() => setIsEmailModalOpen(false)}></div>
        </div>
      )}

      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={{
          id: jobId as string,
          title: job.title,
          department: job.department,
          location: job.location_model || job.location,
          type: job.employment_type || job.type,
          status: job.status,
          requirements: job.requirements,
          form_link: job.form_link,
        }}
        onSave={handleSaveJob}
        isSaving={isSavingJob}
      />

      {/* Success/Error Feedback */}
      {saveFeedback && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-3 ${
          saveFeedback.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-800" 
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {saveFeedback.type === "success" ? (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <p className="font-medium">{saveFeedback.message}</p>
        </div>
      )}
    </AppLayout>
  );
}
