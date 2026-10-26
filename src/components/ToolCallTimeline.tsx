import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import { ToolCallRecord } from '../types';

interface ToolCallTimelineProps {
  toolCalls: ToolCallRecord[];
  isProcessing: boolean;
}

export const ToolCallTimeline: React.FC<ToolCallTimelineProps> = ({ toolCalls, isProcessing }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getToolDescription = (name: string) => {
    switch (name) {
      case 'get_required_documents':
        return 'Queries bank checklist rules for Home Loan product to establish required verification documents.';
      case 'get_application_data':
        return 'Retrieves captured applicant profile from Customer 360 to benchmark against extracted document data.';
      case 'submit_for_human_review':
        return 'Final structured handover tool call delivering the completed package, flags, and confidence scores to the human review desk.';
      default:
        return 'Function call invoked by Gemini agent.';
    }
  };

  const getBadgeStyle = (name: string) => {
    switch (name) {
      case 'get_required_documents':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'get_application_data':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'submit_for_human_review':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-semibold text-slate-200">
            Function Calling Execution Trace ({toolCalls.length} Tool Invocations)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-Delegated Protocol</span>
        </div>
      </div>

      {toolCalls.length === 0 ? (
        <div className="py-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-lg">
          <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
          <p className="text-xs">No function calls recorded yet. Select a scenario and click &ldquo;Run Verification Agent&rdquo;.</p>
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800 before:content-['']">
          {toolCalls.map((call, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div key={idx} className="relative flex items-start gap-3 pl-1">
                {/* Step dot */}
                <div className="z-10 mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>

                {/* Card */}
                <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden transition-all">
                  <div
                    onClick={() => toggleExpand(idx)}
                    className="p-3 cursor-pointer hover:bg-slate-900/60 flex items-center justify-between gap-3 select-none"
                  >
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getBadgeStyle(call.name)}`}>
                        {call.name}()
                      </span>
                      <span className="text-xs text-slate-400 truncate max-w-xs md:max-w-md">
                        {getToolDescription(call.name)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Inspect JSON</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-800 p-3 bg-slate-950 text-xs font-mono space-y-3">
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 text-red-400" /> Function Arguments Passed by Agent:
                        </div>
                        <pre className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-slate-300 overflow-x-auto text-[11px]">
                          {JSON.stringify(call.args, null, 2)}
                        </pre>
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 text-emerald-400" /> Mock Tool Response Returned to Agent:
                        </div>
                        <pre className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-emerald-300/90 overflow-x-auto text-[11px]">
                          {JSON.stringify(call.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="relative flex items-center gap-3 pl-1 text-xs text-slate-400 animate-pulse">
              <div className="z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <span>Gemini is evaluating next function call step...</span>
            </div>
          )}
        </div>
      )}

      {/* Architecture highlight note */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
        <span className="font-semibold text-red-400 shrink-0">Design Rule:</span>
        <span>
          Final structured package is emitted <strong>via the submit_for_human_review tool call</strong> rather than JSON-output mode, preventing the Google AI Studio tool-vs-structured-output conflict and ensuring auditable human triage.
        </span>
      </div>
    </div>
  );
};
