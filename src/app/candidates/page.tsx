"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { apiFetch } from "@/utils/api";

export default function CandidatePoolPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const statuses = ["Meet Criteria", "Considerable", "Failed"];

  const fetchCandidates = async (pageNum: number = 1, status: string | null = null) => {
    setIsLoading(true);
    try {
      let url = `/api/applicants/?page=${pageNum}&page_size=${pageSize}`;
      if (status) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      const response: any = await apiFetch(url);
      setCandidates(response.results || []);
      setTotalCount(response.count || 0);
      setNextPage(response.next || null);
      setPreviousPage(response.previous || null);
      setPage(pageNum);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to load candidates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(1, statusFilter);
  }, []);

  const handleStatusChange = (status: string | null) => {
    setStatusFilter(status);
    fetchCandidates(1, status);
  };

  const handleGenerateEmail = async () => {
    if (!selectedCandidate) return;
    setIsGeneratingEmail(true);
    try {
      const response: any = await apiFetch("/api/applicants/email/send/", {
        method: "POST",
        body: JSON.stringify({
          name: selectedCandidate.name,
          job_title: "Opportunity",
          summary: selectedCandidate.summary || "",
        }),
      });
      setEmailBody(response.email_body || "");
      setIsEmailModalOpen(true);
    } catch (err) {
      console.error("Failed to generate email:", err);
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
    const mailtoLink = `mailto:${selectedCandidate?.email}?subject=Opportunity for ${selectedCandidate?.name}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  const handleViewCV = () => {
    if (selectedCandidate?.cv_url) {
      window.open(`https://drive.google.com/file/d/${selectedCandidate.cv_url}/view`, "_blank");
    }
  };

  const handleToggleSelect = (candidateId: string) => {
    setSelectedIds(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === candidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map(c => c.id));
    }
  };

  const handleBulkDelete = async (idsToDelete?: string[]) => {
    const ids = idsToDelete ?? selectedIds;
    if (ids.length === 0) return;
    if (!window.confirm(`Delete ${ids.length} candidate(s)? This cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await apiFetch(`/api/applicants/delete/`, {
        method: "DELETE",
        body: JSON.stringify({ candidate_ids: ids }),
      });
      const deletedSet = new Set(ids);
      setCandidates(candidates.filter(c => !deletedSet.has(c.id)));
      setTotalCount(totalCount - ids.length);
      if (selectedCandidate && deletedSet.has(selectedCandidate.id)) {
        setSelectedCandidate(null);
      }
      setSelectedIds([]);
      setOpenMenuId(null);
    } catch (err) {
      console.error("Failed to delete candidates:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <AppLayout>
      <div className="flex gap-6 h-[calc(100vh-120px)] w-full">
        {/* Left Column: Data Grid & Controls */}
        <div className="flex-1 min-w-0 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Toolbar Area */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            {/* Batch Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                <input
                  checked={candidates.length > 0 && selectedIds.length === candidates.length}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  id="selectAll"
                  type="checkbox"
                />
                <label className="text-sm font-medium text-slate-700 cursor-pointer" htmlFor="selectAll">Select All</label>
              </div>
              <div className="h-6 w-px bg-slate-200 mx-1"></div>
              <button
                onClick={() => handleBulkDelete()}
                disabled={selectedIds.length === 0 || isDeleting}
                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                {isDeleting ? "Deleting..." : `Delete (${selectedIds.length})`}
              </button>
            </div>
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === null
                    ? "bg-teal-600 text-white"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-100 bg-white"
                }`}
              >
                All
              </button>
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-teal-600 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-100 bg-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          {/* High-Density Data Table Header */}
          <div className="grid grid-cols-[40px_minmax(250px,1fr)_minmax(200px,2fr)_100px_100px_40px] gap-4 px-4 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center justify-center"></div>
            <div>Candidate</div>
            <div>Top Skills</div>
            <div className="text-center">AI Match</div>
            <div>Status</div>
            <div></div>
          </div>
          {/* Scrollable Table Body */}
          <div className="flex-grow overflow-y-auto bg-white">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-slate-500">Loading candidates...</p>
                </div>
              </div>
            ) : candidates.length === 0 ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-slate-500 text-sm font-medium">No candidates found</p>
              </div>
            ) : (
              candidates.map((candidate, idx) => (
                <div key={candidate.id || idx} onClick={() => setSelectedCandidate(candidate)} className="grid grid-cols-[40px_minmax(250px,1fr)_minmax(200px,2fr)_100px_100px_40px] gap-4 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 items-center cursor-pointer transition-colors" style={selectedCandidate?.id === candidate.id || selectedCandidate?.email === candidate.email ? { backgroundColor: "#F0FDF4" } : {}}>
                  <div className="flex items-center justify-center">
                    <input
                      checked={selectedIds.includes(candidate.id)}
                      onChange={(e) => { e.stopPropagation(); handleToggleSelect(candidate.id); }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                      type="checkbox"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm overflow-hidden">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{candidate.name}</h3>
                      <p className="text-xs text-slate-500">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {candidate.skills && candidate.skills.slice(0, 2).map((skill: any) => (
                      <span key={skill} className="px-2 py-0.5 rounded-full bg-teal-600 text-white font-mono text-[10px] border border-teal-700">
                        {typeof skill === "string" ? skill : skill.name}
                      </span>
                    ))}
                    {candidate.skills && candidate.skills.length > 2 && (
                      <span className="text-slate-500 text-xs font-medium ml-1">+{candidate.skills.length - 2}</span>
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="relative w-10 h-10 flex items-center justify-center" style={{ color: candidate.match_percentage > 80 ? '#14b8a6' : candidate.match_percentage > 60 ? '#f59e0b' : '#ef4444' }}>
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"></path>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray={`${candidate.match_percentage}, 100`} strokeLinecap="round" strokeWidth="3" stroke="currentColor"></path>
                      </svg>
                      <span className="absolute text-[10px] font-bold">{candidate.match_percentage}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${candidate.status === "Meet Criteria" ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.8)]" : candidate.status === "Considerable" ? "bg-amber-500" : "bg-slate-300"}`}></div>
                    <span className="text-xs font-medium text-slate-700">{candidate.status}</span>
                  </div>
                  <div className="flex justify-end relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === candidate.id ? null : candidate.id); }} className="text-slate-400 hover:text-slate-700 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                    {openMenuId === candidate.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBulkDelete([candidate.id]); }}
                          disabled={isDeleting}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="text-slate-500 text-xs font-medium">
              <span>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount} candidate{totalCount !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchCandidates(page - 1)}
                disabled={!previousPage}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-slate-600 px-3 py-1.5">
                Page {page}
              </span>
              <button
                onClick={() => fetchCandidates(page + 1)}
                disabled={!nextPage}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Preview (Simulated 'Dark Mode' Header panel) */}
        <aside className="hidden lg:flex w-[380px] bg-white border border-slate-200 rounded-xl flex-col overflow-hidden shadow-lg flex-shrink-0 relative">
          {selectedCandidate ? (
            <>
              {/* Dark Mode Header for Focus */}
              <div className="bg-[#0F172A] text-slate-200 p-6 relative">
                <button onClick={() => setSelectedCandidate(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full object-cover border-2 border-[#3cddc7] bg-slate-300 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0F172A] shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                  </div>
                  <h2 className="text-xl font-bold mt-4 text-white">{selectedCandidate.name}</h2>
                  <p className="text-sm text-slate-400 mt-1 flex items-center justify-center">{selectedCandidate.email}</p>
                </div>
                {/* AI Turbo Action */}
                <button onClick={handleGenerateEmail} disabled={isGeneratingEmail} className="w-full mt-6 py-2.5 rounded-lg bg-gradient-to-br from-teal-500 to-teal-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,118,110,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  {isGeneratingEmail ? "Generating..." : "Auto-Draft Outreach"}
                </button>
              </div>
          
              {/* Preview Content Body */}
              <div className="p-6 flex-grow overflow-y-auto bg-white flex flex-col gap-6">
                {/* AI Summary Box */}
                <div className="relative p-4 border border-teal-200 rounded-xl bg-slate-50">
                  <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-1 text-teal-700 text-[10px] font-bold tracking-wider uppercase">
                    <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    KuraCV AI Insights
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {selectedCandidate.summary || "Summary not available yet."}
                  </p>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
                <button onClick={handleViewCV} disabled={!selectedCandidate.cv_url} className="flex-1 py-2 px-4 border border-teal-700 text-teal-800 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  View Full CV
                </button>
                <button onClick={() => setIsEmailModalOpen(true)} className="py-2 px-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-6">
              <div>
                <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4m0-4h.01" />
                </svg>
                <p className="text-slate-500 text-sm font-medium">Click a candidate to view details</p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Email Outreach</h3>
              <button onClick={() => { setIsEmailModalOpen(false); setEmailBody(""); }} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6l-12 12M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="p-6 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-600 uppercase mb-2">To:</p>
              <p className="text-sm font-medium text-slate-800">{selectedCandidate?.email}</p>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap break-words font-sans leading-relaxed">{emailBody}</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
              <button
                onClick={handleCopyEmail}
                className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {emailCopied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleSendEmail}
                className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
