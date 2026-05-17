"use client";

import React from "react";
import AppLayout from "@/components/AppLayout";

export default function CandidatePoolPage() {
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
                <input className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" id="selectAll" type="checkbox" />
                <label className="text-sm font-medium text-slate-700 cursor-pointer" htmlFor="selectAll">Select All</label>
              </div>
              <div className="h-6 w-px bg-slate-200 mx-1"></div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Invite
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                Tag
              </button>
            </div>
            {/* Filters */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors bg-white">
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filter By
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-primary/20 rounded-lg text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                Skills: React
                <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
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
            {/* Row 1: Selected/Active */}
            <div className="grid grid-cols-[40px_minmax(250px,1fr)_minmax(200px,2fr)_100px_100px_40px] gap-4 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 items-center bg-[#F0FDF4] relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>
              <div className="flex items-center justify-center">
                <input defaultChecked className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer" type="checkbox" />
              </div>
              <div className="flex items-center gap-3">
                <img alt="Candidate avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" src="https://i.pravatar.cc/150?u=sarah" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sarah Jenkins</h3>
                  <p className="text-xs text-slate-500">Senior Frontend Dev at TechFlow</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white font-mono text-[10px] border border-teal-700">React</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">TypeScript</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">GraphQL</span>
                <span className="text-slate-500 text-xs font-medium ml-1">+3</span>
              </div>
              <div className="flex justify-center items-center">
                <div className="relative w-10 h-10 flex items-center justify-center text-teal-600">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"></path>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="92, 100" strokeLinecap="round" strokeWidth="3" stroke="currentColor"></path>
                  </svg>
                  <span className="absolute text-[10px] font-bold">92%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.8)]"></div>
                <span className="text-xs font-medium text-slate-700">Available</span>
              </div>
              <div className="flex justify-end">
                <button className="text-slate-400 hover:text-slate-700 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-[40px_minmax(250px,1fr)_minmax(200px,2fr)_100px_100px_40px] gap-4 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 items-center">
              <div className="flex items-center justify-center">
                <input className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer" type="checkbox" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                  MC
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Michael Chen</h3>
                  <p className="text-xs text-slate-500">Full Stack Engineer</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white font-mono text-[10px] border border-teal-700">React</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">Node.js</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">AWS</span>
              </div>
              <div className="flex justify-center items-center">
                <div className="relative w-10 h-10 flex items-center justify-center text-teal-500">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"></path>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="3" stroke="currentColor"></path>
                  </svg>
                  <span className="absolute text-[10px] font-bold text-teal-700">85%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <span className="text-xs font-medium text-slate-500">Passive</span>
              </div>
              <div className="flex justify-end">
                <button className="text-slate-400 hover:text-slate-700 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid grid-cols-[40px_minmax(250px,1fr)_minmax(200px,2fr)_100px_100px_40px] gap-4 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 items-center opacity-70">
              <div className="flex items-center justify-center">
                <input className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer" type="checkbox" />
              </div>
              <div className="flex items-center gap-3">
                <img alt="Candidate avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200 grayscale" src="https://i.pravatar.cc/150?u=david" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">David Ross</h3>
                  <p className="text-xs text-slate-500">UI Developer</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">Vue.js</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">CSS</span>
              </div>
              <div className="flex justify-center items-center">
                <div className="relative w-10 h-10 flex items-center justify-center text-slate-400">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"></path>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="60, 100" strokeLinecap="round" strokeWidth="3" stroke="currentColor"></path>
                  </svg>
                  <span className="absolute text-[10px] font-bold">60%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <span className="text-xs font-medium text-slate-500">Passive</span>
              </div>
              <div className="flex justify-end">
                <button className="text-slate-400 hover:text-slate-700 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Pagination Footer */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Showing 1-24 of 1,204 candidates</span>
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

        {/* Right Column: Candidate Preview (Simulated 'Dark Mode' Header panel) */}
        <aside className="hidden lg:flex w-[380px] bg-white border border-slate-200 rounded-xl flex-col overflow-hidden shadow-lg flex-shrink-0 relative">
          {/* Dark Mode Header for Focus */}
          <div className="bg-[#0F172A] text-slate-200 p-6 relative">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="relative">
                <img alt="Sarah Jenkins" className="w-20 h-20 rounded-full object-cover border-2 border-[#3cddc7]" src="https://i.pravatar.cc/150?u=sarah" />
                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0F172A] shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
              </div>
              <h2 className="text-xl font-bold mt-4 text-white">Sarah Jenkins</h2>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1 justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                San Francisco, CA
              </p>
            </div>
            {/* AI Turbo Action */}
            <button className="w-full mt-6 py-2.5 rounded-lg bg-gradient-to-br from-teal-500 to-teal-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,118,110,0.3)] hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Auto-Draft Outreach
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
                Sarah is a highly matched candidate (92%) due to her extensive 5-year background in React and modern front-end architectures. Her recent project leading a migration to Next.js perfectly aligns with our current tech debt initiatives.
              </p>
            </div>
            
            {/* Match Breakdown */}
            <div>
              <h4 className="text-xs text-slate-800 font-bold uppercase tracking-wider mb-3">Requirement Match</h4>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1">
                    <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Frontend Architecture
                  </span>
                  <span className="font-mono text-teal-700 font-medium">Strong</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1">
                    <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Team Leadership
                  </span>
                  <span className="font-mono text-teal-700 font-medium">Moderate</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1">
                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                    GraphQL Exp.
                  </span>
                  <span className="font-mono text-slate-500 font-medium">Partial</span>
                </div>
              </div>
            </div>
            
            {/* Work History Snippet */}
            <div>
              <h4 className="text-xs text-slate-800 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Recent Experience
              </h4>
              <div className="relative pl-4 border-l border-slate-200 flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                  <h5 className="text-[13px] font-bold text-slate-800">Senior Frontend Dev</h5>
                  <p className="text-[11px] text-slate-500">TechFlow • 2021 - Present</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                  <h5 className="text-[13px] font-bold text-slate-800">UI Engineer</h5>
                  <p className="text-[11px] text-slate-500">CloudNova • 2018 - 2021</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
            <button className="flex-1 py-2 px-4 border border-teal-700 text-teal-800 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
              View Full CV
            </button>
            <button className="py-2 px-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
