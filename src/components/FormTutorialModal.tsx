"use client";

import React, { useState } from "react";
import Image from "next/image";

interface FormTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCRIPT = `function onFormSubmit(e) {
  // 1. Get your deployed Cloud Run URL
  const webhookUrl = "{{REPLACE_WITH_YOUR_WEBHOOK_URL}}";

  // 2. Use the FormResponse object (the robust way)
  const formResponse = e.response;
  const itemResponses = formResponse.getItemResponses();

  let name = "";
  let email = "";
  let cvUrl = "";

  // 3. Loop through the responses to find the right data
  for (let i = 0; i < itemResponses.length; i++) {
    const itemResponse = itemResponses[i];
    const title = itemResponse.getItem().getTitle();
    const response = itemResponse.getResponse();

    if (title === "Name") {
      name = response;
    } else if (title === "Email") {
      email = response;
    } else if (title === "Upload CV") {
      // response is an array of file IDs for file uploads
      // This gets the first file's URL
      cvUrl = response[0];
    }
  }

  // 4. Package it
  const payload = {
    "name": name,
    "email": email,
    "cv_url": cvUrl
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  UrlFetchApp.fetch(webhookUrl, options);
}`;

const STEPS = [
  {
    number: 1,
    title: "Prepare Your Google Form",
    image: "/tutorial/step-1.png",
    content: (
      <div className="flex flex-col gap-3 text-sm text-slate-600 leading-relaxed">
        <p>Create a new form in Google Forms and ensure the following fields are set up <strong>exactly</strong> as required:</p>
        <ul className="flex flex-col gap-2 pl-1">
          {[
            { label: "Name", desc: "Short answer" },
            { label: "Email", desc: "Short answer" },
            { label: "Upload CV", desc: "File upload — set to accept PDF files only" },
          ].map(({ label, desc }) => (
            <li key={label} className="flex items-start gap-2">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span><strong className="text-slate-800">{label}</strong> <span className="text-slate-400">({desc})</span></span>
            </li>
          ))}
        </ul>
        <div className="mt-1 flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          <p className="text-xs text-amber-700"><strong>Pro Tip:</strong> KuraCV relies on these exact titles to map your data. Ensure there are no extra spaces in the question titles.</p>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    title: "Configure Folder Permissions",
    image: "/tutorial/step-2.gif",
    content: (
      <div className="flex flex-col gap-3 text-sm text-slate-600 leading-relaxed">
        <p>Your dashboard needs permission to fetch the CVs you receive.</p>
        <ol className="flex flex-col gap-2 pl-1">
          {[
            "Go to the Google Drive folder where your form responses are saved.",
            'Right-click the folder and select Share.',
            'Change the access setting from "Restricted" to "Anyone with the link can view."',
            "Click Done.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  {
    number: 3,
    title: "Implement the Integration Script",
    image: "/tutorial/step-3.gif",
    content: null, // rendered separately to inject copy button
  },
  {
    number: 4,
    title: "Automate with Triggers",
    image: "/tutorial/step-4.gif",
    content: (
      <div className="flex flex-col gap-3 text-sm text-slate-600 leading-relaxed">
        <p>Make the integration live so it runs every time a candidate submits their application.</p>
        <ol className="flex flex-col gap-2 pl-1">
          {[
            "In the Apps Script editor, click the Triggers icon (the alarm clock on the left sidebar).",
            "Click the + Add Trigger button in the bottom right corner.",
            <span key="config">Configure the settings as follows:<br/>
              <span className="inline-flex flex-col gap-0.5 mt-1.5 ml-1">
                <span>• <strong>Choose which function to run:</strong> onFormSubmit</span>
                <span>• <strong>Select event source:</strong> From form</span>
                <span>• <strong>Select event type:</strong> On form submit</span>
              </span>
            </span>,
            "Click Save. You may be prompted to authorize the script — click Allow to finalize the connection.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-2 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-xs font-bold text-teal-700 mb-1">Verify Your Setup</p>
          <p className="text-xs text-teal-700">Open your form in Preview mode, submit a test application with a dummy PDF, then check your KuraCV Candidate Pool — the new entry should appear within seconds!</p>
        </div>
      </div>
    ),
  },
];

export default function FormTutorialModal({ isOpen, onClose }: FormTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scriptCopied, setScriptCopied] = useState(false);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(SCRIPT);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Connect Form to KuraCV</h2>
              <p className="text-xs text-slate-500">Step {currentStep + 1} of {STEPS.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100 flex-shrink-0">
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Step image */}
          <div className="relative w-full bg-slate-100 border-b border-slate-200" style={{ height: 220 }}>
            <Image
              src={step.image}
              alt={`Step ${step.number}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Step content */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                {step.number}
              </span>
              <h3 className="text-base font-bold text-slate-800">{step.title}</h3>
            </div>

            {step.number === 3 ? (
              <div className="flex flex-col gap-3 text-sm text-slate-600 leading-relaxed">
                <p>Now, let's link the form to your KuraCV API.</p>
                <ol className="flex flex-col gap-2 pl-1">
                  {[
                    'Inside your Google Form, click the three dots (More) at the top right and select Apps Script.',
                    'Delete any existing code in the editor and paste the KuraCV integration script below.',
                    'Replace the webhookUrl in the script with the link provided in your KuraCV Admin panel.',
                    'Click the Disk icon to save the script.',
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                {/* Script box */}
                <div className="relative mt-1 rounded-xl border border-slate-200 bg-[#0F172A] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
                    <span className="text-xs font-mono text-slate-400">Apps Script</span>
                    <button
                      onClick={handleCopyScript}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${scriptCopied ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
                    >
                      {scriptCopied ? (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                          Copy Script
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-[11px] text-slate-300 font-mono overflow-x-auto leading-relaxed whitespace-pre max-h-52 overflow-y-auto">
                    {SCRIPT}
                  </pre>
                </div>
              </div>
            ) : (
              step.content
            )}
          </div>
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`rounded-full transition-all ${i === currentStep ? "w-5 h-2 bg-teal-600" : "w-2 h-2 bg-slate-300 hover:bg-slate-400"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={isFirst}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {isLast ? (
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Done
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                className="px-5 py-2 text-sm font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1.5"
              >
                Next
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
