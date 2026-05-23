"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();
  const { register, authError, clearError, isAuthenticated } = useAuth();

  // Redirect to jobs if already logged in, clear previous errors
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/jobs");
    }
    clearError();
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      await register(fullName, email, password);
      // Context will redirect user on success
    } catch (err) {
      // Errors are captured in context's authError
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = localLoading;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background transition-colors duration-300">
      {/* Login Container */}
      <main className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-lg border border-surface-variant p-8 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Background Accent (Subtle Kinetic Element) */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-fixed rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Section */}
          <div className="mb-6 w-full flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <Image
              src="/images/kuracv-logo-portrait.png"
              alt="KuraCV Logo"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </div>

          {/* Header */}
          <div className="text-center mb-6 w-full">
            <h1 className="text-headline-lg font-bold text-on-surface mb-2 font-sans tracking-tight">
              Create an Account
            </h1>
            <p className="text-body-md text-on-surface-variant font-sans">
              Join the high-velocity HR workspace.
            </p>
          </div>

          {/* SSO Primary Action */}
          <button className="w-full flex items-center justify-center gap-3 bg-surface border border-outline-variant hover:bg-surface-container-low transition-all duration-200 py-3 px-4 rounded-xl font-medium text-label-md text-on-surface mb-5 active:scale-[0.98] cursor-pointer">
            {/* SVG Google Icon */}
            <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-5">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="text-label-md font-semibold text-outline tracking-wider">OR</span>
            <div className="h-px bg-outline-variant flex-1"></div>
          </div>

          {/* Registration Error Banner */}
          {authError && (
            <div className="w-full bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-4 py-3 rounded-xl flex items-start gap-3 mb-5 animate-in fade-in slide-in-from-top-1 duration-200">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm font-medium leading-5 flex-1">
                {authError}
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-label-md font-semibold text-on-surface-variant"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <div className="relative flex items-center input-focus-glow rounded-xl bg-surface border border-outline-variant overflow-hidden transition-all duration-200">
                <svg aria-hidden="true" className="w-4 h-4 text-outline mx-3 select-none flex-shrink-0" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-140.000000, -2159.000000)" fill="currentColor">
                      <g transform="translate(56.000000, 160.000000)">
                        <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598"></path>
                      </g>
                    </g>
                  </g>
                </svg>
                <input
                  className="flex-1 bg-transparent border-none py-2.5 pr-3 text-on-surface font-sans text-body-md focus:outline-none placeholder:text-outline-variant focus:ring-0"
                  id="fullName"
                  name="fullName"
                  placeholder="Jane Doe"
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-label-md font-semibold text-on-surface-variant"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative flex items-center input-focus-glow rounded-xl bg-surface border border-outline-variant overflow-hidden transition-all duration-200">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-outline mx-3 select-none flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  className="flex-1 bg-transparent border-none py-2.5 pr-3 text-on-surface font-sans text-body-md focus:outline-none placeholder:text-outline-variant focus:ring-0"
                  id="email"
                  name="email"
                  placeholder="recruiter@company.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-label-md font-semibold text-on-surface-variant"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center input-focus-glow rounded-xl bg-surface border border-outline-variant overflow-hidden transition-all duration-200">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-outline mx-3 select-none flex-shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12,13a1.49,1.49,0,0,0-1,2.61V17a1,1,0,0,0,2,0V15.61A1.49,1.49,0,0,0,12,13Zm5-4V7A5,5,0,0,0,7,7V9a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V12A3,3,0,0,0,17,9ZM9,7a3,3,0,0,1,6,0V9H9Zm9,12a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1Z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  className="flex-1 bg-transparent border-none py-2.5 pr-3 text-on-surface font-sans text-body-md focus:outline-none placeholder:text-outline-variant focus:ring-0"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              className="mt-2 w-full turbo-btn py-3 rounded-xl font-semibold text-label-md shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign Up
                  <svg
                    aria-hidden="true"
                    className="w-[18px] h-[18px] flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L13 6M19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-body-md text-on-surface-variant font-sans">
              Already have an account?
              <Link
                className="font-semibold text-primary hover:text-secondary transition-colors duration-200 ml-1"
                href="/login"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="mt-8 text-center opacity-70">
        <p className="text-label-md text-on-surface-variant font-sans">
          &copy; {new Date().getFullYear()} KuraCV AI Recruitment Platform.
        </p>
      </footer>
    </div>
  );
}
