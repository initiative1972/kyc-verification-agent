import React, { useState } from 'react';
import {
  Layers,
  Copy,
  Check,
  Download,
  Terminal,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { STARTER_KIT } from '../data/starterKitData';

export const BlockCViewer: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const c1Json = JSON.stringify(STARTER_KIT.blockC.c1.response, null, 2);
  const c2Json = JSON.stringify(STARTER_KIT.blockC.c2.response, null, 2);
  const c3Json = JSON.stringify(STARTER_KIT.blockC.c3.response, null, 2);

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = () => {
    const allMocks = {
      C1_get_required_documents: STARTER_KIT.blockC.c1.response,
      C2_get_application_data: STARTER_KIT.blockC.c2.response,
      C3_submit_for_human_review: STARTER_KIT.blockC.c3.response,
    };
    navigator.clipboard.writeText(JSON.stringify(allMocks, null, 2));
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = () => {
    const allMocks = {
      C1_get_required_documents: STARTER_KIT.blockC.c1.response,
      C2_get_application_data: STARTER_KIT.blockC.c2.response,
      C3_submit_for_human_review: STARTER_KIT.blockC.c3.response,
    };
    const blob = new Blob([JSON.stringify(allMocks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'block-c-mock-responses.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                Mock Systems Response Hub
              </span>
              <span className="text-xs text-slate-400">PRD 3 Starter Kit</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Block C — Mock Function Responses
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Paste these mock responses into Google AI Studio when the Gemini agent emits each matching <code className="text-red-400 font-mono">functionCall</code> during testing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              {copiedKey === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all' ? 'Copied All Mocks!' : 'Copy All Mocks'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
          </div>
        </div>

        {/* Workflow Guide */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <div className="text-blue-400 font-mono font-bold text-[11px] mb-1">Step 1 &bull; C1 Checklist</div>
            <span className="text-slate-400 text-[11px]">When model calls <code className="text-slate-200">get_required_documents</code>, paste C1 with the 3 required documents.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <div className="text-purple-400 font-mono font-bold text-[11px] mb-1">Step 2 &bull; C2 Baseline Data</div>
            <span className="text-slate-400 text-[11px]">When model calls <code className="text-slate-200">get_application_data</code>, paste C2 with the applicant&apos;s captured fields.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <div className="text-emerald-400 font-mono font-bold text-[11px] mb-1">Step 3 &bull; C3 Queue Handoff</div>
            <span className="text-slate-400 text-[11px]">When model calls <code className="text-slate-200">submit_for_human_review</code>, reply with C3 to acknowledge task creation.</span>
          </div>
        </div>
      </div>

      {/* C1 Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-xs font-mono border border-blue-800">
              C1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm text-slate-100">
                  Response for <span className="text-blue-400">get_required_documents</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Policy Rules Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Returns the mandatory document checklist for Home Loan application <strong className="text-slate-300 font-mono">APP-10293</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopy('c1', c1Json)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700 cursor-pointer"
          >
            {copiedKey === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'c1' ? 'Copied C1!' : 'Copy C1 Response'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed select-all">
          <pre>{c1Json}</pre>
        </div>

        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Required documents: drivers_licence, payslip, bank_statement</span>
          <span>Product: home_loan</span>
        </div>
      </div>

      {/* C2 Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-xs font-mono border border-purple-800">
              C2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm text-slate-100">
                  Response for <span className="text-purple-400">get_application_data</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  NAB Customer 360
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Provides authoritative baseline application fields used to cross-check extracted document values.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopy('c2', c2Json)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700 cursor-pointer"
          >
            {copiedKey === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'c2' ? 'Copied C2!' : 'Copy C2 Response'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed select-all">
          <pre>{c2Json}</pre>
        </div>

        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Target applicant: Jordan Alex Taylor</span>
          <span>Baseline Stated Income: $95,000 p.a. &bull; DOB: 1990-07-14</span>
        </div>
      </div>

      {/* C3 Card */}
      <div className="bg-slate-900 border-2 border-emerald-900/40 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono border border-emerald-800">
              C3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm text-slate-100">
                  Response for <span className="text-emerald-400">submit_for_human_review</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Terminal Handshake
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Acknowledges human review queue task creation and allows the Gemini agent to close out cleanly.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopy('c3', c3Json)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700 cursor-pointer"
          >
            {copiedKey === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'c3' ? 'Copied C3!' : 'Copy C3 Response'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed select-all">
          <pre>{c3Json}</pre>
        </div>

        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Review Task ID: REV-55821</span>
          <span>Queue: onboarding-kyc</span>
        </div>
      </div>

      {/* Note on Terminal Handshake */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-0.5">Terminal Handoff Design Principle:</strong>
          <span>
            When the agent calls <code className="text-emerald-400 font-mono">submit_for_human_review</code>, replying with C3 informs the agent that the review task has been successfully persisted. The model then delivers a factual, concise summary with redacted PII, deferring the final decision to the human reviewer.
          </span>
        </div>
      </div>
    </div>
  );
};
