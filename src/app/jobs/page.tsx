"use client";

import React from "react";
import AppLayout from "@/components/AppLayout";

export default function JobListingsPage() {
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
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-2 rounded-lg font-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
            <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="currentColor" />
            </svg>
            Filter
          </button>
          <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-sm md:hidden cursor-pointer">
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
            <span className="text-4xl font-bold text-primary">12</span>
            <span className="font-body-md text-body-md text-tertiary-container flex items-center gap-1 mb-1 bg-tertiary-fixed/20 px-2 py-0.5 rounded text-[12px] font-semibold">
              <svg className="w-[14px] h-[14px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.707 5.293a1 1 0 0 0-1.414 0l-4 4a1 1 0 0 0 1.414 1.414L11 8.414V18a1 1 0 1 0 2 0V8.414l2.293 2.293a1 1 0 0 0 1.414-1.414l-4-4Z" fill="currentColor" />
              </svg>
              2
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-slate-200 rounded-xl p-stack-md flex flex-col shadow-sm">
          <span className="text-sm font-bold text-slate-800 mb-2">Candidates Processed</span>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-slate-900">1,492</span>
            <span className="font-body-md text-body-md text-on-surface-variant mb-1">this week</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4 overflow-hidden flex">
            <div className="h-full bg-secondary-container w-[65%]"></div>
            <div className="h-full bg-surface-tint w-[20%]"></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-slate-200 rounded-xl p-stack-md flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-bold text-slate-800 mb-2 block">AI Curation Status</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary-container"></span>
              </span>
              <span className="font-body-md text-body-md font-semibold text-tertiary-container">Engine Active</span>
            </div>
          </div>
          <svg className="w-10 h-10 text-surface-container-highest flex-shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <g data-name="Layer 2">
              <g data-name="Q3 icons">
                <g>
                  <path d="M45.6,18.7,41,14.9V7.5a1,1,0,0,0-.6-.9L30.5,2.1h-.4l-.6.2L24,5.9,18.5,2.2,17.9,2h-.4L7.6,6.6a1,1,0,0,0-.6.9v7.4L2.4,18.7a.8.8,0,0,0-.4.8v9H2a.8.8,0,0,0,.4.8L7,33.1v7.4a1,1,0,0,0,.6.9l9.9,4.5h.4l.6-.2L24,42.1l5.5,3.7.6.2h.4l9.9-4.5a1,1,0,0,0,.6-.9V33.1l4.6-3.8a.8.8,0,0,0,.4-.7V19.4h0A.8.8,0,0,0,45.6,18.7Zm-5.1,6.8H42v1.6l-3.5,2.8-.4.3-.4-.2a1.4,1.4,0,0,0-2,.7,1.5,1.5,0,0,0,.6,2l.7.3h0v5.4l-6.6,3.1-4.2-2.8-.7-.5V25.5H27a1.5,1.5,0,0,0,0-3H25.5V9.7l.7-.5,4.2-2.8L37,9.5v5.4h0l-.7.3a1.5,1.5,0,0,0-.6,2,1.4,1.4,0,0,0,1.3.9l.7-.2.4-.2.4.3L42,20.9v1.6H40.5a1.5,1.5,0,0,0,0,3ZM21,25.5h1.5V38.3l-.7.5-4.2,2.8L11,38.5V33.1h0l.7-.3a1.5,1.5,0,0,0,.6-2,1.4,1.4,0,0,0-2-.7l-.4.2-.4-.3L6,27.1V25.5H7.5a1.5,1.5,0,0,0,0-3H6V20.9l3.5-2.8.4-.3.4.2.7.2a1.4,1.4,0,0,0,1.3-.9,1.5,1.5,0,0,0-.6-2L11,15h0V9.5l6.6-3.1,4.2,2.8.7.5V22.5H21a1.5,1.5,0,0,0,0,3Z" />
                  <path d="M13.9,9.9a1.8,1.8,0,0,0,0,2.2l2.6,2.5v2.8l-4,4v5.2l4,4v2.8l-2.6,2.5a1.8,1.8,0,0,0,0,2.2,1.5,1.5,0,0,0,1.1.4,1.5,1.5,0,0,0,1.1-.4l3.4-3.5V29.4l-4-4V22.6l4-4V13.4L16.1,9.9A1.8,1.8,0,0,0,13.9,9.9Z" />
                  <path d="M31.5,14.6l2.6-2.5a1.8,1.8,0,0,0,0-2.2,1.8,1.8,0,0,0-2.2,0l-3.4,3.5v5.2l4,4v2.8l-4,4v5.2l3.4,3.5a1.7,1.7,0,0,0,2.2,0,1.8,1.8,0,0,0,0-2.2l-2.6-2.5V30.6l4-4V21.4l-4-4Z" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Job Listings Table/Cards Area */}
      <div className="bg-surface-container-lowest border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant px-4">
          <button className="px-4 py-3 font-label-md text-label-md text-primary border-b-2 border-primary cursor-pointer">Active (12)</button>
          <button className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hover:text-on-background border-b-2 border-transparent transition-colors cursor-pointer">Closed (45)</button>
          <button className="px-4 py-3 font-label-md text-label-md text-on-surface-variant hover:text-on-background border-b-2 border-transparent transition-colors cursor-pointer">Drafts (3)</button>
        </div>

        {/* List Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface-bright border-b border-outline-variant text-xs font-medium text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">Job Title / Department</div>
          <div className="col-span-2">Date Posted</div>
          <div className="col-span-4">AI Candidate Funnel</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Job Item 1 */}
        <div className="group border-b border-outline-variant hover:bg-[#F0FDF4] transition-colors cursor-pointer relative">
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary-fixed/20 pointer-events-none z-10 transition-colors"></div>
          <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
            <div className="col-span-4 w-full">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">Senior Product Designer</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-sm">Design</span>
                <span className="text-outline text-xs">•</span>
                <span className="font-label-md text-label-md text-on-surface-variant">San Francisco, CA</span>
              </div>
            </div>
            <div className="col-span-2 w-full md:w-auto font-body-md text-body-md text-on-surface-variant">
              <span className="md:hidden font-bold mr-2">Posted:</span> Oct 12, 2023
            </div>
            <div className="col-span-4 w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-label-md text-on-background">245 Total Applicants</span>
              </div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-surface-container-highest">
                <div className="bg-tertiary-container w-[15%]" title="Meet Criteria: 36"></div>
                <div className="bg-secondary w-[30%]" title="Considerable: 74"></div>
                <div className="bg-outline-variant w-[55%]" title="Failed: 135"></div>
              </div>
              <div className="flex gap-3 mt-1.5 font-mono-sm text-[11px]">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-tertiary-container"></div><span>36 Match</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary"></div><span>74 Consider</span></div>
              </div>
            </div>
            <div className="col-span-2 w-full md:w-auto text-left md:text-right flex items-center justify-between md:justify-end gap-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary-fixed/20 text-tertiary-container border border-tertiary-fixed/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                Active
              </span>
              <svg className="w-5 h-5 text-outline group-hover:text-primary transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Job Item 2 */}
        <div className="group border-b border-outline-variant hover:bg-[#F0FDF4] transition-colors cursor-pointer relative">
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary-fixed/20 pointer-events-none z-10 transition-colors"></div>
          <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
            <div className="col-span-4 w-full">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">Machine Learning Engineer</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-sm">Engineering</span>
                <span className="text-outline text-xs">•</span>
                <span className="font-label-md text-label-md text-on-surface-variant">Remote</span>
              </div>
            </div>
            <div className="col-span-2 w-full md:w-auto font-body-md text-body-md text-on-surface-variant">
              <span className="md:hidden font-bold mr-2">Posted:</span> Oct 08, 2023
            </div>
            <div className="col-span-4 w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-label-md text-on-background">189 Total Applicants</span>
              </div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-surface-container-highest">
                <div className="bg-tertiary-container w-[5%]" title="Meet Criteria: 9"></div>
                <div className="bg-secondary w-[15%]" title="Considerable: 28"></div>
                <div className="bg-outline-variant w-[80%]" title="Failed: 152"></div>
              </div>
              <div className="flex gap-3 mt-1.5 font-mono-sm text-[11px]">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-tertiary-container"></div><span>9 Match</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary"></div><span>28 Consider</span></div>
              </div>
            </div>
            <div className="col-span-2 w-full md:w-auto text-left md:text-right flex items-center justify-between md:justify-end gap-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary-fixed/20 text-tertiary-container border border-tertiary-fixed/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                Active
              </span>
              <svg className="w-5 h-5 text-outline group-hover:text-primary transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Job Item 3 */}
        <div className="group border-b border-outline-variant hover:bg-[#F0FDF4] transition-colors cursor-pointer relative">
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary-fixed/20 pointer-events-none z-10 transition-colors"></div>
          <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
            <div className="col-span-4 w-full">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">Director of Sales</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-sm">Sales</span>
                <span className="text-outline text-xs">•</span>
                <span className="font-label-md text-label-md text-on-surface-variant">New York, NY</span>
              </div>
            </div>
            <div className="col-span-2 w-full md:w-auto font-body-md text-body-md text-on-surface-variant">
              <span className="md:hidden font-bold mr-2">Posted:</span> Sep 28, 2023
            </div>
            <div className="col-span-4 w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-label-md text-on-background">412 Total Applicants</span>
              </div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-surface-container-highest">
                <div className="bg-tertiary-container w-[20%]" title="Meet Criteria: 82"></div>
                <div className="bg-secondary w-[40%]" title="Considerable: 165"></div>
                <div className="bg-outline-variant w-[40%]" title="Failed: 165"></div>
              </div>
              <div className="flex gap-3 mt-1.5 font-mono-sm text-[11px]">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-tertiary-container"></div><span>82 Match</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary"></div><span>165 Consider</span></div>
              </div>
            </div>
          </div>
          
          {/* Pagination Footer */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Showing 1-12 of 12 jobs</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-slate-200 transition-colors disabled:opacity-50" disabled>
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="w-7 h-7 rounded bg-teal-700 text-white font-bold flex items-center justify-center">1</button>
              <button className="w-7 h-7 rounded hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700">2</button>
              <button className="w-7 h-7 rounded hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700">3</button>
              <span className="px-1">...</span>
              <button className="p-1 rounded hover:bg-slate-200 transition-colors">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
