"use client";

import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useParams } from "next/navigation";
import EditJobModal from "@/components/EditJobModal";

export default function JobDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("candidates");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [job, setJob] = useState({
    id: params.id || "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "Active",
    postedDate: "2 days ago",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-teal-100 text-teal-800 focus:ring-teal-500";
      case "Closed": return "bg-slate-200 text-slate-800 focus:ring-slate-500";
      case "Draft": return "bg-amber-100 text-amber-800 focus:ring-amber-500";
      default: return "bg-teal-100 text-teal-800 focus:ring-teal-500";
    }
  };

  const candidates = [
    { id: 1, name: "Marcus Thorne", role: "Senior Frontend Developer", match: 84, status: "Meet Criteria", date: "Oct 25", avatar: "https://i.pravatar.cc/150?u=marcus", aiSummary: "Marcus has extensive experience with React and Tailwind, but his background is primarily in e-commerce rather than fintech. He lacks direct experience with Next.js but shows a strong capacity for learning new frameworks.", skills: [{name: "React", matched: true}, {name: "Tailwind CSS", matched: true}, {name: "Agile", matched: false}, {name: "TypeScript", matched: true}] },
    { id: 2, name: "Jordan Smith", role: "Junior Web Developer", match: 42, status: "Failed", date: "Oct 24", avatar: null, aiSummary: "Jordan is a recent bootcamp graduate with a strong portfolio in basic HTML/CSS, but lacks the required 3+ years of professional React experience and enterprise-level architecture knowledge.", skills: [{name: "HTML5", matched: false}, {name: "CSS3", matched: false}, {name: "JavaScript", matched: false}, {name: "Tailwind", matched: false}] },
    { id: 3, name: "Emma Davis", role: "Full Stack Developer", match: 91, status: "Meet Criteria", date: "Oct 25", avatar: null, aiSummary: "Emma is a strong candidate with 6 years of experience...", skills: [{name: "React", matched: true}, {name: "Node.js", matched: true}, {name: "TypeScript", matched: true}] },
    { id: 4, name: "Michael Chen", role: "React Developer", match: 76, status: "Considerable", date: "Oct 23", avatar: null, aiSummary: "Michael has solid React experience but lacks...", skills: [{name: "React", matched: true}, {name: "CSS", matched: false}, {name: "Redux", matched: true}] },
    { id: 5, name: "James Brown", role: "Frontend Developer", match: 65, status: "Considerable", date: "Oct 20", avatar: null, aiSummary: "James is primarily a backend dev...", skills: [{name: "Python", matched: false}, {name: "JavaScript", matched: true}] },
  ];

  const isSuccess = selectedCandidate?.status === "Meet Criteria" || selectedCandidate?.status === "Considerable";

  return (
    <AppLayout>
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="text-slate-500 hover:text-primary transition-colors bg-white border border-slate-200 rounded-full p-2 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
              <div className="relative inline-flex items-center">
                <select 
                  value={job.status}
                  onChange={(e) => setJob({ ...job, status: e.target.value })}
                  className={`${getStatusColor(job.status)} text-xs font-bold pl-3 pr-7 py-1 rounded-full uppercase tracking-wide border-none outline-none cursor-pointer focus:ring-2 appearance-none hover:opacity-80 transition-opacity m-0`}
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
              {job.department} • {job.location} • {job.type} • Posted {job.postedDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
          >
            Edit Job
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
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

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex border-b border-slate-200 px-2 bg-slate-50 justify-between items-center">
          <div className="flex">
            <button 
              onClick={() => setActiveTab("candidates")}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "candidates" ? "border-primary text-primary bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Candidates Pool
            </button>
            <button 
              onClick={() => setActiveTab("details")}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "details" ? "border-primary text-primary bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Job Details
            </button>
          </div>
          
          {/* Actions: Search & Filter */}
          <div className="flex items-center gap-3 pr-2">
            <div className="relative hidden sm:block">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-48 bg-white text-slate-700" />
            </div>
            <button className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="currentColor"/>
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-0 flex-1">
          {activeTab === "candidates" && (
            <div className="overflow-x-auto">
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
                          className="text-[#0F766E] hover:underline text-sm font-bold"
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination Footer */}
              <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-slate-500 text-xs font-medium">
                <span>Showing 1-5 of 5 candidates</span>
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
          )}

          {activeTab === "details" && (
            <div className="p-8 max-w-4xl">
              
              <div className="border border-[#E2E8F0] rounded-xl p-6 mb-8 bg-white">
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
                    placeholder="Describe your ideal candidate in plain English... e.g., 'Looking for a senior frontend dev with 5+ years React experience, background in fintech, and strong CSS skills.'"
                    defaultValue="Looking for a highly skilled Senior Frontend Developer to join our core engineering team. Ideal candidate should have 5+ years of experience with React and Next.js, deep understanding of Tailwind CSS, and experience with modern state management libraries. A background in building accessible interfaces is a huge plus."
                  ></textarea>
                  <button className="absolute bottom-4 right-4 bg-[#5EEAD4] text-[#0F766E] px-4 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-[#5EEAD4]/80 transition-colors shadow-sm">
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
              <div className="bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-4 py-3 flex items-center justify-between w-full max-w-xl">
                <span className="text-slate-600 text-sm truncate">https://forms.google.com/kuracv-apply/senior-frontend</span>
                <button className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1 ml-4">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
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
                onClick={() => setSelectedCandidate(null)}
                className={`w-full font-bold py-2.5 rounded-md transition-colors text-sm ${isSuccess ? 'bg-[#0F766E] text-white hover:bg-[#0F766E]/90' : 'bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#334155]'}`}
              >
                Schedule Interview
              </button>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="w-full bg-white border border-[#0F766E] text-[#0F766E] hover:bg-[#F8FAFC] font-bold py-2.5 rounded-md transition-colors text-sm"
              >
                View CV
              </button>
            </div>
          </div>
          {/* Backdrop click to close */}
          <div className="fixed inset-0 z-[-1]" onClick={() => setSelectedCandidate(null)}></div>
        </div>
      )}

      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={job}
        onSave={(updatedJob) => setJob({ ...job, ...updatedJob })}
      />
    </AppLayout>
  );
}
