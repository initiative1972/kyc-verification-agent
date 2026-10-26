import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  Terminal,
  CheckCircle2,
  FileCode2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { STARTER_KIT } from '../data/starterKitData';

export const BlockBViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'visual' | 'json'>('visual');

  const blockBJson = STARTER_KIT.blockB.jsonString;

  const handleCopy = () => {
    navigator.clipboard.writeText(blockBJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([blockBJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'block-b-function-declarations.json';
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
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-800">
                Function Calling Specification
              </span>
              <span className="text-xs text-slate-400">PRD 3 Starter Kit</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Block B — Function Declarations (Tools JSON)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Paste this schema into Google AI Studio under <strong>Tools &rarr; Function calling &rarr; Edit (JSON)</strong>. The 3 declarations drive the entire intake, policy cross-check, and human handoff cycle.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON!' : 'Copy Block B'}</span>
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

        {/* View toggle */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex space-x-2 text-xs">
            <button
              onClick={() => setActiveSubTab('visual')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeSubTab === 'visual'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Schema Explorer
            </button>
            <button
              onClick={() => setActiveSubTab('json')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeSubTab === 'json'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw AI Studio JSON Editor
            </button>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 3 Declarations Loaded
          </span>
        </div>
      </div>

      {activeSubTab === 'visual' ? (
        <div className="space-y-4">
          {/* Tool 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-xs font-mono border border-blue-800">
                  1
                </span>
                <h3 className="font-mono font-bold text-sm text-sky-400">
                  get_required_documents
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Pre-check Query
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Return the required-document checklist for an application&apos;s product (e.g. driver licence, payslip, bank statement for Home Loans).
            </p>

            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Required Parameters:
              </span>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-red-400 font-bold">appId</span>
                <span className="text-slate-400">: string</span>
                <span className="text-slate-400 text-[11px]">&mdash; Application ID (e.g. &ldquo;APP-10293&rdquo;)</span>
              </div>
            </div>
          </div>

          {/* Tool 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-xs font-mono border border-purple-800">
                  2
                </span>
                <h3 className="font-mono font-bold text-sm text-purple-400">
                  get_application_data
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Customer 360 Baseline
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Return the captured application fields to validate documents against (Applicant Full Name, Date of Birth, Residential Address, Stated Income).
            </p>

            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Required Parameters:
              </span>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-red-400 font-bold">appId</span>
                <span className="text-slate-400">: string</span>
                <span className="text-slate-400 text-[11px]">&mdash; Application ID</span>
              </div>
            </div>
          </div>

          {/* Tool 3 */}
          <div className="bg-slate-900 border-2 border-emerald-900/40 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono border border-emerald-800">
                  3
                </span>
                <h3 className="font-mono font-bold text-sm text-emerald-400">
                  submit_for_human_review
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Final Structured Output Tool Call
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Submit the extracted data, discrepancies and flags to the human reviewer queue. This is the final structured output of the agent and ensures a regulated human decision.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-[11px] uppercase font-bold text-slate-400 mb-2">
                  Parameters Schema:
                </div>

                <div className="flex items-start gap-2 text-slate-200">
                  <span className="text-red-400 font-bold">appId</span>
                  <span className="text-slate-400">: string (required)</span>
                </div>

                <div className="pl-3 border-l border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-bold">
                    documents: Array&lt;object&gt; (required)
                  </div>
                  <div className="text-[11px] text-slate-400 pl-2">
                    &bull; <strong className="text-slate-200">type</strong>: string (e.g. &ldquo;drivers_licence&rdquo;, &ldquo;payslip&rdquo;)<br />
                    &bull; <strong className="text-slate-200">extracted</strong>: object (raw fields and values)<br />
                    &bull; <strong className="text-slate-200">confidence</strong>: number (0.0 to 1.0)<br />
                    &bull; <strong className="text-slate-200">quality</strong>: enum [&ldquo;ok&rdquo;, &ldquo;poor&rdquo;, &ldquo;expired&rdquo;]<br />
                    &bull; <strong className="text-slate-200">lowConfidenceFields</strong>: string[] (fields with confidence &lt; 0.7)
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-200">
                  <span className="text-amber-400 font-bold">discrepancies</span>
                  <span className="text-slate-400">: string[] (required) &mdash; Human-readable mismatch descriptions</span>
                </div>

                <div className="flex items-start gap-2 text-slate-200">
                  <span className="text-sky-400 font-bold">checklistComplete</span>
                  <span className="text-slate-400">: boolean (required) &mdash; All required documents provided</span>
                </div>

                <div className="flex items-start gap-2 text-slate-200">
                  <span className="text-purple-400 font-bold">readyForHumanReview</span>
                  <span className="text-slate-400">: boolean (required) &mdash; Flagged ready for human check</span>
                </div>

                <div className="flex items-start gap-2 text-slate-200">
                  <span className="text-slate-300 font-bold">reviewerNotes</span>
                  <span className="text-slate-400">: string (optional summary notes)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Raw JSON Editor */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-sky-400" />
              <span>Tools &rarr; Function Calling &rarr; Edit (JSON)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Paste directly into Google AI Studio
            </span>
          </div>

          <div className="p-4 bg-slate-950 text-xs font-mono text-slate-200 overflow-x-auto max-h-[600px] select-all leading-relaxed">
            <pre>{blockBJson}</pre>
          </div>
        </div>
      )}

      {/* Compliance Note */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-0.5">Why Function Calling Drives the Flow:</strong>
          <span>
            Google AI Studio prevents combining native JSON Mode (<code className="text-red-400 font-mono">responseSchema</code>) with Function Tools. Calling <code className="text-emerald-400 font-mono">submit_for_human_review</code> produces the required structured JSON output seamlessly without conflict and provides a tamper-evident audit record.
          </span>
        </div>
      </div>
    </div>
  );
};
