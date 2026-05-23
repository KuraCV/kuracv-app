"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import CreateJobModal from "@/components/CreateJobModal";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

type StatusTab = "All" | "Active" | "Closed" | "Draft";

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pagination state
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search & Filter state
  const [searchVal, setSearchVal] = useState("");
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([]);
  const [selectedLocationModels, setSelectedLocationModels] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Stat card counts — computed from current page results
  const activeJobsCount = jobs.filter((j: any) => j.status === "Active").length;
  const closedJobsCount = jobs.filter((j: any) => j.status === "Closed").length;
  const draftJobsCount = jobs.filter((j: any) => j.status === "Draft").length;

  /**
   * Core fetch function.
   * - Pass a full URL (from next/previous) to navigate pages.
   * - Pass nothing to build a fresh first-page request from current state.
   */
  const fetchJobs = useCallback(
    async (pageUrl?: string | null) => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        let url: string;

        if (pageUrl) {
          // Use the exact URL the server gave us (already has all params + cursor)
          url = pageUrl;
        } else {
          const queryParams = new URLSearchParams();
          if (searchVal.trim()) {
            queryParams.set("search", searchVal.trim());
          }
          if (selectedEmploymentTypes.length > 0) {
            queryParams.set("employment_type", selectedEmploymentTypes.join(","));
          }
          if (selectedLocationModels.length > 0) {
            queryParams.set("location_model", selectedLocationModels.join(","));
          }
          if (activeTab !== "All") {
            queryParams.set("status", activeTab);
          }
          url = `/api/jobs/?${queryParams.toString()}`;
        }

        const res: any = await apiFetch(url);
        setJobs(res.results ?? []);
        setTotalCount(res.count ?? 0);
        setNextUrl(res.next ?? null);
        setPreviousUrl(res.previous ?? null);
      } catch (err) {
        console.error("Failed to load jobs list:", err);
        setErrorMsg("Failed to retrieve job postings from server.");
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchVal, selectedEmploymentTypes, selectedLocationModels, activeTab]
  );

  // Re-fetch from page 1 whenever filters, search, or active tab change
  useEffect(() => {
    setCurrentPage(1);
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmploymentTypes, selectedLocationModels, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const handleNext = () => {
    if (!nextUrl) return;
    setCurrentPage((p) => p + 1);
    fetchJobs(nextUrl);
  };

  const handlePrevious = () => {
    if (!previousUrl) return;
    setCurrentPage((p) => p - 1);
    fetchJobs(previousUrl);
  };

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const toggleEmploymentType = (type: string) => {
    setSelectedEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleLocationModel = (loc: string) => {
    setSelectedLocationModels((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const clearFilters = () => {
    setSelectedEmploymentTypes([]);
    setSelectedLocationModels([]);
    setSearchVal("");
  };

  // Calculate page info
  const pageSize = jobs.length;
  const hasPagination = nextUrl !== null || previousUrl !== null;

  return (
    <AppLayout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-stack-lg gap-stack-md">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Job Listings</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage and track all active and closed curation pipelines.
          </p>
        </div>

        {/* Actions Controls */}
        <div className="flex flex-wrap items-center gap-3 relative">

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-[#F1F5F9] rounded-lg border border-[#CBD5E1] overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-[#5EEAD4] w-full sm:w-60">
            <svg className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="flex-1 bg-transparent border-none py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
          </form>

          {/* Filter Trigger button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2 rounded-lg font-label-md hover:bg-surface-container-low transition-all cursor-pointer relative"
            >
              <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="currentColor" />
              </svg>
              Filter
              {(selectedEmploymentTypes.length > 0 || selectedLocationModels.length > 0) && (
                <span className="w-2 h-2 bg-[#EF4444] rounded-full absolute top-1 right-1"></span>
              )}
            </button>

            {/* Checkbox Floating Dropdown Panel */}
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-20 cursor-default" onClick={() => setIsFilterOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#CBD5E1] rounded-xl shadow-xl p-5 z-30 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Employment Type</h4>
                    <div className="flex flex-col gap-2">
                      {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
                        <label key={type} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedEmploymentTypes.includes(type)}
                            onChange={() => toggleEmploymentType(type)}
                            className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-3.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Location Model</h4>
                    <div className="flex flex-col gap-2">
                      {['Remote', 'Hybrid', 'On-site'].map((loc) => (
                        <label key={loc} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLocationModels.includes(loc)}
                            onChange={() => toggleLocationModel(loc)}
                            className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          {loc}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-3.5 flex justify-between items-center">
                    <button
                      onClick={clearFilters}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer border-none bg-transparent"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="bg-[#0F766E] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-[#0F766E]/90 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
              <path d="M6 12H18M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            New Job
          </button>
        </div>
      </div>

      {/* Bento Grid Layout for High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <div className="bg-surface-container-lowest border border-slate-200 rounded-xl p-stack-md flex flex-col relative overflow-hidden group shadow-sm">
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-secondary-fixed/20 rounded-full blur-2xl group-hover:bg-secondary-fixed/30 transition-colors"></div>
          <span className="text-sm font-bold text-slate-800 mb-2 z-10">Total Active Jobs</span>
          <div className="flex items-end gap-3 z-10">
            <span className="text-4xl font-bold text-primary">{activeJobsCount}</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-slate-200 rounded-xl p-stack-md flex flex-col shadow-sm">
          <span className="text-sm font-bold text-slate-800 mb-2">Total Closed Jobs</span>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-slate-900">{closedJobsCount}</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-slate-200 rounded-xl p-stack-md flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-bold text-slate-800 mb-2 block">Curation Pipeline</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary-container"></span>
              </span>
              <span className="font-body-md text-body-md font-semibold text-tertiary-container">Active ({totalCount} postings)</span>
            </div>
          </div>
          <svg className="w-10 h-10 text-surface-container-highest flex-shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <g data-name="Layer 2">
              <g data-name="Q3 icons">
                <g>
                  <path d="M45.6,18.7,41,14.9V7.5a1,1,0,0,0-.6-.9L30.5,2.1h-.4l-.6.2L24,5.9,18.5,2.2,17.9,2h-.4L7.6,6.6a1,1,0,0,0-.6.9v7.4L2.4,18.7a.8.8,0,0,0-.4.8v9H2a.8.8,0,0,0,.4.8L7,33.1v7.4a1,1,0,0,0,.6.9l9.9,4.5h.4l.6-.2L24,42.1l5.5,3.7.6.2h.4l9.9-4.5a1,1,0,0,0,.6-.9V33.1l4.6-3.8a.8.8,0,0,0,.4-.7V19.4h0A.8.8,0,0,0,45.6,18.7Zm-5.1,6.8H42v1.6l-3.5,2.8-.4.3-.4-.2a1.4,1.4,0,0,0-2,.7,1.5,1.5,0,0,0,.6,2l.7.3h0v5.4l-6.6,3.1-4.2-2.8-.7-.5V25.5H27a1.5,1.5,0,0,0,0-3H25.5V9.7l.7-.5,4.2-2.8L37,9.5v5.4h0l-.7.3a1.5,1.5,0,0,0-.6,2,1.4,1.4,0,0,0,1.3.9l.7-.2.4-.2.4.3L42,20.9v1.6H40.5a1.5,1.5,0,0,0,0,3ZM21,25.5h1.5V38.3l-.7.5-4.2,2.8L11,38.5V33.1h0l.7-.3a1.5,1.5,0,0,0,.6-2,1.4,1.4,0,0,0-2-.7l-.4.2-.4-.3L6,27.1V25.5H7.5a1.5,1.5,0,0,0,0-3H6V20.9l3.5-2.8.4-.3.4.2.7.2a1.4,1.4,0,0,0,1.3-.9,1.5,1.5,0,0,0-.6-2L11,15h0V9.5l6.6-3.1,4.2,2.8.7.5V22.5H21a1.5,1.5,0,0,0,0-3H6V20.9l3.5-2.8.4-.3.4.2.7.2a1.4,1.4,0,0,0,1.3-.9,1.5,1.5,0,0,0-.6-2L11,15h0V9.5l6.6-3.1,4.2,2.8.7.5V22.5H21a1.5,1.5,0,0,0,0-3Z" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Job Listings Table/Cards Area */}
      <div className="bg-surface-container-lowest border border-slate-200 rounded-xl overflow-hidden shadow-sm">

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant px-4 bg-slate-50 gap-1 overflow-x-auto">
          {([
            { key: "All",    label: "All Jobs" },
            { key: "Active", label: "Active"   },
            { key: "Closed", label: "Closed"   },
            { key: "Draft",  label: "Draft"    },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                activeTab === key
                  ? "text-primary border-primary"
                  : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {label}
              {activeTab === key && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {totalCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading / Error states */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-[#5EEAD4]/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500 font-sans">Retrieving curation jobs...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <svg className="w-12 h-12 text-rose-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm font-semibold text-slate-600 font-sans">{errorMsg}</p>
            <button onClick={() => fetchJobs()} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90">Retry</button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <svg className="w-16 h-16 text-slate-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <p className="text-base font-bold text-slate-700 mb-1 font-sans">
              {activeTab === "All" ? "No job postings found" : `No ${activeTab} jobs`}
            </p>
            <p className="text-sm text-slate-500 max-w-xs font-sans">
              {activeTab === "All"
                ? "Create a new job pipeline or adjust your filters to search again."
                : `There are currently no jobs with a ${activeTab} status.`}
            </p>
          </div>
        ) : (
          <>
            {/* List Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface-bright border-b border-outline-variant text-xs font-medium text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Job Title / Department</div>
              <div className="col-span-2">Employment Type</div>
              <div className="col-span-3">Location Model</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {/* List Items */}
            <div className="divide-y divide-slate-100 bg-white">
              {jobs.map((job: any) => {
                const jobLoc = job.location_model || job.location || "Remote";
                const jobType = job.employment_type || job.type || "Full-time";

                return (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="group hover:bg-[#F0FDF4] transition-colors cursor-pointer relative block"
                  >
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary-fixed/20 pointer-events-none z-10 transition-colors"></div>
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">

                      <div className="col-span-5 w-full">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-sm">{job.department || "General"}</span>
                        </div>
                      </div>

                      <div className="col-span-2 w-full md:w-auto font-body-md text-body-md text-on-surface-variant">
                        <span className="md:hidden font-bold mr-2 text-slate-500 uppercase tracking-wider text-[10px]">Employment Type:</span>
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-bold">{jobType}</span>
                      </div>

                      <div className="col-span-3 w-full md:w-auto font-body-md text-body-md text-on-surface-variant">
                        <span className="md:hidden font-bold mr-2 text-slate-500 uppercase tracking-wider text-[10px]">Location:</span>
                        <span className="bg-[#E6F4F1] text-[#0F766E] px-2.5 py-1 rounded text-xs font-bold">{jobLoc}</span>
                      </div>

                      <div className="col-span-2 w-full md:w-auto text-left md:text-right flex items-center justify-between md:justify-end gap-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          job.status === "Active" ? "bg-teal-100 text-teal-800 border-teal-200" :
                          job.status === "Closed" ? "bg-slate-100 text-slate-800 border-slate-200" :
                          "bg-amber-100 text-amber-800 border-amber-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            job.status === "Active" ? "bg-teal-600" :
                            job.status === "Closed" ? "bg-slate-600" :
                            "bg-amber-600"
                          }`}></span>
                          {job.status || "Active"}
                        </span>
                        <svg className="w-5 h-5 text-outline group-hover:text-primary transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3">
              {/* Info */}
              <span className="text-xs font-medium text-slate-500">
                {totalCount > 0
                  ? `Page ${currentPage} · Showing ${pageSize} of ${totalCount} job${totalCount !== 1 ? "s" : ""}`
                  : `${pageSize} job${pageSize !== 1 ? "s" : ""}`}
              </span>

              {/* Controls — only shown when there are multiple pages */}
              {hasPagination && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={!previousUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Previous
                  </button>

                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20 min-w-[2.5rem] text-center">
                    {currentPage}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={!nextUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onJobCreated={() => { setCurrentPage(1); fetchJobs(); }}
      />
    </AppLayout>
  );
}
