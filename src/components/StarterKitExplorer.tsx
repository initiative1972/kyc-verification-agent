import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Code, Layers, FileCode, Sparkles, BookOpen } from 'lucide-react';
import { STARTER_KIT } from '../data/starterKitData';

export const StarterKitExplorer: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-800">
                AI Studio Ready
              </span>
              <span className="text-xs text-slate-400">PRD 3 Document & KYC Verification Agent</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Google AI Studio Drop-In Assets & Prompts (Blocks A–E)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Use these drop-in blocks to configure and run the agent directly on{' '}
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 underline inline-flex items-center gap-1 font-mono"
              >
                aistudio.google.com <ExternalLink className="w-3 h-3" />
              </a>{' '}
              in approximately 5 minutes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Recommended Model:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-white">
              Gemini 2.5 Pro
            </span>
          </div>
        </div>

        {/* 5-Minute Checklist */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] text-slate-300">
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <strong className="text-red-400 block font-mono">1. Prompt Setup</strong>
            <span>Create Chat prompt, model: Gemini 2.5 Pro, Temp: 0.2</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <strong className="text-red-400 block font-mono">2. System Instruction</strong>
            <span>Paste Block A into &ldquo;System instructions&rdquo;</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <strong className="text-red-400 block font-mono">3. Function Calling</strong>
            <span>Paste Block B JSON into Tools &rarr; Edit (JSON)</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <strong className="text-red-400 block font-mono">4. Run & Test</strong>
            <span>Paste D1 or D2; reply with Block C mock responses</span>
          </div>
        </div>
      </div>

      {/* Block A: System Instruction */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <div>
              <h3 className="text-sm font-bold text-white">{STARTER_KIT.blockA.title}</h3>
              <p className="text-[11px] text-slate-400">{STARTER_KIT.blockA.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => handleCopy('blockA', STARTER_KIT.blockA.content)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            {copiedSection === 'blockA' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'blockA' ? 'Copied Block A!' : 'Copy Block A'}</span>
          </button>
        </div>
        <div className="p-4 bg-slate-950 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
          {STARTER_KIT.blockA.content}
        </div>
      </div>

      {/* Block B: Function Declarations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold text-white">{STARTER_KIT.blockB.title}</h3>
              <p className="text-[11px] text-slate-400">{STARTER_KIT.blockB.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => handleCopy('blockB', STARTER_KIT.blockB.jsonString)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700 cursor-pointer"
          >
            {copiedSection === 'blockB' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'blockB' ? 'Copied JSON!' : 'Copy Tools JSON'}</span>
          </button>
        </div>
        <div className="p-4 bg-slate-950 text-xs font-mono text-slate-300 max-h-72 overflow-y-auto">
          <pre>{STARTER_KIT.blockB.jsonString}</pre>
        </div>
      </div>

      {/* Block C: Mock Function Responses */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{STARTER_KIT.blockC.title}</h3>
            <p className="text-[11px] text-slate-400">{STARTER_KIT.blockC.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          {/* C1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200">C1 — get_required_documents</span>
              <button
                onClick={() =>
                  handleCopy('c1', JSON.stringify(STARTER_KIT.blockC.c1.response, null, 2))
                }
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                title="Copy C1 JSON"
              >
                {copiedSection === 'c1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto">
              {JSON.stringify(STARTER_KIT.blockC.c1.response, null, 2)}
            </pre>
          </div>

          {/* C2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200">C2 — get_application_data</span>
              <button
                onClick={() =>
                  handleCopy('c2', JSON.stringify(STARTER_KIT.blockC.c2.response, null, 2))
                }
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                title="Copy C2 JSON"
              >
                {copiedSection === 'c2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto">
              {JSON.stringify(STARTER_KIT.blockC.c2.response, null, 2)}
            </pre>
          </div>

          {/* C3 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200">C3 — submit_for_human_review</span>
              <button
                onClick={() =>
                  handleCopy('c3', JSON.stringify(STARTER_KIT.blockC.c3.response, null, 2))
                }
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                title="Copy C3 JSON"
              >
                {copiedSection === 'c3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto">
              {JSON.stringify(STARTER_KIT.blockC.c3.response, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Block D: Test Scenarios */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileCode className="w-4 h-4 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{STARTER_KIT.blockD.title}</h3>
            <p className="text-[11px] text-slate-400">{STARTER_KIT.blockD.subtitle}</p>
          </div>
        </div>

        <div className="space-y-3">
          {STARTER_KIT.blockD.scenarios.map((sc) => (
            <div key={sc.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm">{sc.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {sc.badge}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(sc.id, sc.prompt)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono cursor-pointer"
                >
                  {copiedSection === sc.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === sc.id ? 'Copied Prompt!' : 'Copy Prompt'}</span>
                </button>
              </div>

              <p className="text-slate-400 text-[11px] mb-2 font-sans">
                <strong className="text-slate-300">Expected Agent Outcome: </strong>
                {sc.expected}
              </p>

              <pre className="p-2.5 rounded bg-slate-900/70 border border-slate-800/80 text-slate-300 overflow-x-auto text-[11px] font-mono whitespace-pre-wrap">
                {sc.prompt}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Key Architectural Decision Rationale Note */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 space-y-2">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-red-500" />
          <span>Core Architectural Choice: Function Calling vs Structured JSON Mode</span>
        </h4>
        <p className="text-slate-400 leading-relaxed">
          Google AI Studio traditionally enforces a tradeoff between tools (function calling) and structured output mode (<code className="text-red-400 font-mono">responseSchema</code>). By designing the final reviewer package as the arguments to the <code className="text-red-400 font-mono">submit_for_human_review</code> tool call, the agent uses function calling end-to-end.
        </p>
        <p className="text-slate-400 leading-relaxed">
          Crucially, this ensures the agent <strong>never approves KYC or credit</strong> — the handover to a human is formalized as an explicit API contract, directly complying with APRA CPG 235 non-delegation guidelines.
        </p>
      </div>
    </div>
  );
};
