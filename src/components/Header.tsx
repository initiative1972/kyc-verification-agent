import React from 'react';
import { ShieldCheck, Sparkles, FileText, CheckCircle2, UserCheck, Cpu, Code, Layers, FileCode } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'block-b' | 'block-c' | 'block-d' | 'reviewer' | 'starter-kit' | 'audit';
  setActiveTab: (tab: 'studio' | 'block-b' | 'block-c' | 'block-d' | 'reviewer' | 'starter-kit' | 'audit') => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  hasKey: boolean;
  pendingReviewCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedModel,
  setSelectedModel,
  hasKey,
  pendingReviewCount,
}) => {
  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Banner with NAB Brand and Mode Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-900/30 ring-2 ring-red-500/20">
            <span className="text-xl tracking-tighter">nab</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">NAB Document & KYC Agent</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800/60">
                PRD 3 Starter Kit
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Agentic Digital Sales &bull; Non-Delegated Identity Verification &bull; AI Studio Prototype
            </p>
          </div>
        </div>

        {/* Right side controls: Model picker & Human-in-the-Loop badge */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Regulatory Guardrail Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Human-in-the-Loop Mandatory</span>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <Cpu className="w-4 h-4 text-red-400" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-mono outline-none cursor-pointer"
            >
              <option value="gemini-3.8-flash" className="bg-slate-900 text-white">
                gemini-3.8-flash (Fast & Multimodal)
              </option>
              <option value="gemini-3.1-pro-preview" className="bg-slate-900 text-white">
                gemini-3.1-pro-preview (Deep Reasoning)
              </option>
              <option value="gemini-2.5-pro" className="bg-slate-900 text-white">
                gemini-2.5-pro (PRD 3 Default)
              </option>
            </select>
          </div>

          {/* API Key Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-mono text-[11px]">
              {hasKey ? 'Gemini API Connected' : 'Simulated Sandbox'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-2 sm:space-x-4 py-2 overflow-x-auto text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'studio'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Verification Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('block-b')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'block-b'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Block B Tools (Function Calling)</span>
          </button>

          <button
            onClick={() => setActiveTab('block-c')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'block-c'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Block C Mocks (Responses)</span>
          </button>

          <button
            onClick={() => setActiveTab('block-d')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'block-d'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Block D Scenarios (D1–D3)</span>
          </button>

          <button
            onClick={() => setActiveTab('reviewer')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all relative ${
              activeTab === 'reviewer'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Human Reviewer Desk (REV-55821)</span>
            {pendingReviewCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold">
                {pendingReviewCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('starter-kit')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'starter-kit'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Starter Kit Drop-ins (Block A–E)</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'audit'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Block E Acceptance (6 Checks)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
