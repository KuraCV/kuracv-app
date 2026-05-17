"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Successfully logged in (Demo Mode)");
    }, 1500);
  };

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
              Welcome Back
            </h1>
            <p className="text-body-md text-on-surface-variant font-sans">
              Log in to your high-velocity HR workspace.
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
            </svg>Continue with Google
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-5">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="text-label-md font-semibold text-outline tracking-wider">OR</span>
            <div className="h-px bg-outline-variant flex-1"></div>
          </div>

          {/* Email Login Form */}
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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
              <div className="flex justify-between items-center">
                <label
                  className="text-label-md font-semibold text-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  className="text-label-md font-medium text-secondary hover:text-primary transition-colors duration-200"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
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
                  Log In
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

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-body-md text-on-surface-variant font-sans">
              Don&apos;t have an account?
              <Link
                className="font-semibold text-primary hover:text-secondary transition-colors duration-200 ml-1"
                href="/register"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Area (Outside card, minimalist) */}
      <footer className="mt-8 text-center opacity-70">
        <p className="text-label-md text-on-surface-variant font-sans">
          &copy; {new Date().getFullYear()} KuraCV AI Recruitment Platform.
        </p>
      </footer>
    </div>
  );
}
