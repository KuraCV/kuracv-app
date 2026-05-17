"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CreateJobModal from "./CreateJobModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased transition-colors duration-300">
      {/* SideNavBar */}
      <nav className="hidden md:flex bg-[#F8FAFC] dark:bg-surface-container-high font-label-md text-label-md border-r border-[#E2E8F0] dark:border-slate-200 fixed left-0 top-0 h-screen flex-col p-stack-md gap-stack-sm w-[280px] z-20">
        <div className="flex items-center px-4 py-stack-md mb-stack-md">
          <Image
            src="/images/kuracv-logo-landscape.png"
            alt="KuraCV Logo"
            width={160}
            height={48}
            className="object-contain w-auto h-auto max-h-12"
            priority
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <Link
            href="/jobs"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium ${pathname === "/jobs" ? "bg-[#5EEAD4] text-[#0F766E] font-bold" : "text-[#475569] hover:bg-surface-bright"}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g strokeWidth="0" />
              <g strokeLinecap="round" strokeLinejoin="round" />
              <g>
                <path d="M16,7H8V4A1,1,0,0,1,9,3h6a1,1,0,0,1,1,1Zm1,4H7m8,0v2" style={{ fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }} />
                <rect x="5" y="5" width="14" height="18" rx="1" transform="translate(26 2) rotate(90)" style={{ fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }} />
              </g>
            </svg>
            <span>Job Listings</span>
          </Link>
          <Link
            href="/candidates"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium ${pathname === "/candidates" ? "bg-[#5EEAD4] text-[#0F766E] font-bold" : "text-[#475569] hover:bg-surface-bright"}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g strokeWidth="0" />
              <g strokeLinecap="round" strokeLinejoin="round" />
              <g>
                <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.9699 14.44C18.3399 14.67 19.8499 14.43 20.9099 13.72C22.3199 12.78 22.3199 11.24 20.9099 10.3C19.8399 9.59004 18.3099 9.35003 16.9399 9.59003" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.99994 14.44C5.62994 14.67 4.11994 14.43 3.05994 13.72C1.64994 12.78 1.64994 11.24 3.05994 10.3C4.12994 9.59004 5.65994 9.35003 7.02994 9.59003" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.32996 13.45 9.32996 12.05C9.32996 10.62 10.48 9.46997 11.91 9.46997C13.34 9.46997 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
            <span>Candidate Pool</span>
          </Link>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-label-md py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
              <path d="M6 12H18M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Create New Job
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="bg-white border-b border-[#E2E8F0] font-body-md text-body-md sticky top-0 z-10 w-full">
          <div className="flex justify-between items-center px-margin-x h-16 w-full">
            {/* Mobile Menu Button & Brand */}
            <div className="flex items-center gap-4 md:hidden">
              <button className="text-[#475569] cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">
                KuraCV
              </span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                className="w-full bg-[#F1F5F9] rounded-full py-2 pl-10 pr-4 text-[#475569] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#5EEAD4] transition-all"
                placeholder="Search jobs, skills, or candidates..."
                type="text"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-auto">
              <button className="text-[#475569] hover:bg-[#F1F5F9] transition-colors p-2 rounded-full scale-95 active:scale-100 relative cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.31317 12.463C6.20006 9.29213 8.60976 6.6252 11.701 6.5C14.7923 6.6252 17.202 9.29213 17.0889 12.463C17.0889 13.78 18.4841 15.063 18.525 16.383C18.525 16.4017 18.525 16.4203 18.525 16.439C18.5552 17.2847 17.9124 17.9959 17.0879 18.029H13.9757C13.9786 18.677 13.7404 19.3018 13.3098 19.776C12.8957 20.2372 12.3123 20.4996 11.701 20.4996C11.0897 20.4996 10.5064 20.2372 10.0923 19.776C9.66161 19.3018 9.42346 18.677 9.42635 18.029H6.31317C5.48869 17.9959 4.84583 17.2847 4.87602 16.439C4.87602 16.4203 4.87602 16.4017 4.87602 16.383C4.91795 15.067 6.31317 13.781 6.31317 12.463Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.42633 17.279C9.01212 17.279 8.67633 17.6148 8.67633 18.029C8.67633 18.4432 9.01212 18.779 9.42633 18.779V17.279ZM13.9757 18.779C14.3899 18.779 14.7257 18.4432 14.7257 18.029C14.7257 17.6148 14.3899 17.279 13.9757 17.279V18.779ZM12.676 5.25C13.0902 5.25 13.426 4.91421 13.426 4.5C13.426 4.08579 13.0902 3.75 12.676 3.75V5.25ZM10.726 3.75C10.3118 3.75 9.97601 4.08579 9.97601 4.5C9.97601 4.91421 10.3118 5.25 10.726 5.25V3.75ZM9.42633 18.779H13.9757V17.279H9.42633V18.779ZM12.676 3.75H10.726V5.25H12.676V3.75Z" fill="currentColor" />
                </svg>
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#EF4444] rounded-full"></span>
              </button>
              <button className="text-[#475569] hover:bg-[#F1F5F9] transition-colors p-2 rounded-full scale-95 active:scale-100 cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsLogoutOpen(!isLogoutOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden border-[2.5px] border-[#5EEAD4] cursor-pointer ml-1 block focus:outline-none focus:ring-2 focus:ring-[#5EEAD4]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Recruiter profile photo"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc6qiCjGXrc7XH0w6Q8CrxFgp3c-UgyjW93HOgDBTt0n8giS0dWDSvBVcF8opRpC-09xQlsfxJPAul-pXyy22_Wx_y9lAaeb2CQkuB3ctxtXK_yL5c-bUFmHODYO82SQQy8xGTm83DqWfnr_Yxn3k-F6YHoHuyYhBEB1DW-1pEiJnYHJlmyN6qtnDgIgz8YMQqSAJTsurF-fzEGHc5OBpjhL54m_AwGSpdTpnS0APQtJK4PVdgtHBYfC2a3ihZq3RcyKUoiMS8_mg"
                  />
                </button>

                {isLogoutOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10 cursor-default" 
                      onClick={() => setIsLogoutOpen(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#CBD5E1] rounded-xl shadow-lg py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-[#E2E8F0]">
                        <p className="text-sm font-bold text-slate-800">HR Manager</p>
                        <p className="text-xs text-slate-500 truncate">recruiter@kuracv.com</p>
                      </div>
                      <Link 
                        href="/settings"
                        onClick={() => setIsLogoutOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                      </Link>
                      <Link 
                        href="/login"
                        onClick={() => setIsLogoutOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors w-full text-left"
                      >
                        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-gutter max-w-container-max mx-auto w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center bg-surface-bright border-t border-outline-variant">
          <p className="text-label-md text-on-surface-variant font-sans opacity-80">
            &copy; {new Date().getFullYear()} KuraCV AI Recruitment Platform. All rights reserved.
          </p>
        </footer>
      </div>
      <CreateJobModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
