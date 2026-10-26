import React, { useState } from 'react';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ShieldAlert,
  Send,
  Building,
  Check,
  RefreshCw,
} from 'lucide-react';
import { ReviewerPackage } from '../types';

interface ReviewerDeskProps {
  currentPackage: ReviewerPackage | null;
  onAdjudicate: (decision: string, notes: string) => void;
  status: string;
}

export const ReviewerDesk: React.FC<ReviewerDeskProps> = ({
  currentPackage,
  onAdjudicate,
  status,
}) => {
  const [officerNotes, setOfficerNotes] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Application baseline data
  const applicationData = {
    fullName: 'Jordan Alex Taylor',
    dateOfBirth: '1990-07-14',
    address: '12 Example St, Melbourne VIC 3000',
    statedIncomeAnnual: 95000,
    product: 'Home Loan (First Home Buyer)',
    appId: currentPackage?.appId || 'APP-10293',
  };

  const handleDecisionClick = (decision: string) => {
    setSelectedDecision(decision);
  };

  const handleSubmitAdjudication = () => {
    if (!selectedDecision) return;
    onAdjudicate(selectedDecision, officerNotes);
    setIsSubmitted(true);
  };

  const resetReview = () => {
    setIsSubmitted(false);
    setSelectedDecision(null);
    setOfficerNotes('');
  };

  if (!currentPackage) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <UserCheck className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-semibold text-slate-200">Reviewer Queue Empty</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          No document verification package has been submitted by the agent yet. Run scenario D1 or D2 in the Verification Studio to emit a <code className="text-red-400 font-mono">submit_for_human_review</code> tool call.
        </p>
      </div>
    );
  }

  const hasDiscrepancies = (currentPackage.discrepancies || []).length > 0;
  const isExpired = currentPackage.documents.some((d) => d.quality === 'expired');

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                TASK: REV-55821
              </span>
              <span className="text-xs text-slate-400 font-mono">
                App ID: <strong className="text-slate-100">{currentPackage.appId}</strong>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                Queue: onboarding-kyc
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Human Reviewer Adjudication Station &bull; Retail Banking
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-slate-400 block">Accredited Reviewer</span>
              <span className="font-semibold text-slate-200">Officer H. Edwards (ID: 482)</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-red-900/40 border border-red-700/60 flex items-center justify-center text-red-300 font-bold text-xs">
              HE
            </div>
          </div>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Checklist Status</span>
            <span
              className={`font-semibold ${
                currentPackage.checklistComplete ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {currentPackage.checklistComplete ? 'Complete (3/3 docs)' : 'Incomplete / Missing items'}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Identified Discrepancies</span>
            <span
              className={`font-semibold ${
                hasDiscrepancies ? 'text-red-400 font-mono' : 'text-emerald-400'
              }`}
            >
              {currentPackage.discrepancies.length} variance flag(s)
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Document Quality</span>
            <span
              className={`font-semibold ${
                isExpired ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {isExpired ? 'Flagged: Expired Document' : 'All Valid / Current'}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Human Review Required</span>
            <span className="font-semibold text-sky-400">
              Mandatory under CPG 235
            </span>
          </div>
        </div>
      </div>

      {/* Discrepancies Alert Banner */}
      {hasDiscrepancies && (
        <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-4 text-xs text-red-200">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-red-300 uppercase tracking-wide">
                Agent Discrepancy Findings (Requires Human Adjudication):
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-200">
                {currentPackage.discrepancies.map((disc, idx) => (
                  <li key={idx} className="font-medium">
                    {disc}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-red-400/90 italic pt-1">
                Notice: The agent strictly flagged and preserved these mismatches without attempting to alter or self-reconcile customer data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-red-400" />
          <span>Cross-Check Verification Matrix (Application vs Extracted Documents)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Field</th>
                <th className="py-2.5 px-3">Application Baseline (NAB Customer 360)</th>
                <th className="py-2.5 px-3">Extracted from Uploaded Documents</th>
                <th className="py-2.5 px-3">Cross-Check Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {/* Full Name */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-300">Full Name</td>
                <td className="py-2.5 px-3 text-slate-200">{applicationData.fullName}</td>
                <td className="py-2.5 px-3 text-slate-200">
                  {currentPackage.documents.find((d) => d.extracted?.fullName)?.extracted?.fullName ||
                    'Jordan Alex Taylor'}
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Match
                  </span>
                </td>
              </tr>

              {/* Date of Birth */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-300">Date of Birth</td>
                <td className="py-2.5 px-3 font-mono text-slate-200">{applicationData.dateOfBirth}</td>
                <td className="py-2.5 px-3 font-mono">
                  {currentPackage.documents.find((d) => d.extracted?.dateOfBirth)?.extracted?.dateOfBirth ||
                    'Not Found'}
                </td>
                <td className="py-2.5 px-3">
                  {currentPackage.documents.find((d) => d.extracted?.dateOfBirth)?.extracted?.dateOfBirth ===
                  '1990-07-14' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                      <XCircle className="w-3.5 h-3.5" /> Mismatch (1991 vs 1990)
                    </span>
                  )}
                </td>
              </tr>

              {/* Address */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-300">Residential Address</td>
                <td className="py-2.5 px-3 text-slate-200">{applicationData.address}</td>
                <td className="py-2.5 px-3 text-slate-200">
                  {currentPackage.documents.find((d) => d.extracted?.address)?.extracted?.address ||
                    '12 Example St, Melbourne VIC 3000'}
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Match
                  </span>
                </td>
              </tr>

              {/* Gross Annual Income */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-300">Stated Income (p.a.)</td>
                <td className="py-2.5 px-3 font-mono text-slate-200">
                  ${applicationData.statedIncomeAnnual.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 font-mono">
                  {currentPackage.documents.find((d) => d.extracted?.grossAnnualIncome)?.extracted
                    ?.grossAnnualIncome
                    ? `$${currentPackage.documents
                        .find((d) => d.extracted?.grossAnnualIncome)
                        ?.extracted?.grossAnnualIncome.toLocaleString()}`
                    : '$72,000 / $95,000'}
                </td>
                <td className="py-2.5 px-3">
                  {currentPackage.documents.find((d) => d.extracted?.grossAnnualIncome)?.extracted
                    ?.grossAnnualIncome === 95000 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5" /> Income Variance
                    </span>
                  )}
                </td>
              </tr>

              {/* Driver Licence Expiry */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-300">ID Validity & Expiry</td>
                <td className="py-2.5 px-3 text-slate-400">Must be non-expired under AML rules</td>
                <td className="py-2.5 px-3 font-mono">
                  {currentPackage.documents.find((d) => d.type?.includes('licence'))?.extracted
                    ?.expiryDate || 'N/A'}
                </td>
                <td className="py-2.5 px-3">
                  {isExpired ? (
                    <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                      <XCircle className="w-3.5 h-3.5" /> EXPIRED (Quality: expired)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Current (2029-03-01)
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Processed Documents & Confidence Scores */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-3">
          Document Intake Classification & Extraction Confidence
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentPackage.documents.map((doc, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-slate-200 capitalize">
                  {doc.type.replace(/_/g, ' ')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    doc.quality === 'ok'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : doc.quality === 'expired'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {doc.quality.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence Score:</span>
                  <span
                    className={`font-mono font-bold ${
                      doc.confidence >= 0.7 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {(doc.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                {doc.lowConfidenceFields && doc.lowConfidenceFields.length > 0 && (
                  <div className="text-red-400 text-[10px] bg-red-950/40 p-1 rounded mt-1">
                    Flagged fields: {doc.lowConfidenceFields.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Human Reviewer Adjudication Action Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-red-900/50 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Building className="w-4 h-4 text-red-500" />
          <h3 className="text-base font-bold text-white">Human Reviewer Adjudication (REV-55821)</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Under APRA prudential standards and NAB AML/CTF program, the human compliance officer retains sole authority to clear identity, request further verification, or reject an applicant.
        </p>

        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Adjudication Recorded Successfully</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <p>Decision: <strong className="text-white uppercase">{selectedDecision}</strong></p>
              <p>Adjudicated by: Officer H. Edwards (ID: 482)</p>
              <p>Timestamp: {new Date().toLocaleString()}</p>
              {officerNotes && <p>Reviewer Notes: &ldquo;{officerNotes}&rdquo;</p>}
            </div>
            <button
              onClick={resetReview}
              className="mt-2 text-xs flex items-center gap-1.5 text-slate-400 hover:text-white px-3 py-1.5 rounded bg-slate-900 border border-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Decision
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Decision Buttons */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                Select Human Determination:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDecisionClick('approved')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                    selectedDecision === 'approved'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve KYC</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Identity verified; all standards satisfied.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecisionClick('reupload_requested')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                    selectedDecision === 'reupload_requested'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-2 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Request Re-upload</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Request current licence and missing bank statement.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecisionClick('escalated')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                    selectedDecision === 'escalated'
                      ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-indigo-400 mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Escalate to Fraud Ops</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Route to Specialist AML / Fraud Investigation.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecisionClick('rejected')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                    selectedDecision === 'rejected'
                      ? 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-red-400 mb-1">
                    <XCircle className="w-4 h-4" />
                    <span>Decline / Reject KYC</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Critical compliance failure or fraudulent doc.
                  </span>
                </button>
              </div>
            </div>

            {/* Officer Notes */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1 font-mono">
                Human Reviewer Adjudication Rationale:
              </label>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="Enter mandatory audit notes (e.g. 'Customer contacted to provide renewed VicRoads licence; bank statement requested for Sep-Nov 2026 period')..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500 font-sans h-20 resize-none"
              />
            </div>

            {/* Submit Adjudication */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={!selectedDecision}
                onClick={handleSubmitAdjudication}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs transition-all ${
                  selectedDecision
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-900/40 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Regulated Human Determination</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
