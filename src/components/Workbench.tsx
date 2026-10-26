import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  UploadCloud,
  FileText,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { DocumentCards } from './DocumentCards';
import { ToolCallTimeline } from './ToolCallTimeline';
import { STARTER_KIT } from '../data/starterKitData';
import { VerificationResult, UploadedImageFile } from '../types';

interface WorkbenchProps {
  selectedScenario: string;
  setSelectedScenario: (s: string) => void;
  result: VerificationResult | null;
  isRunning: boolean;
  onRunAgent: (customPrompt?: string, images?: UploadedImageFile[]) => Promise<void>;
  onNavigateToReviewer: () => void;
}

export const Workbench: React.FC<WorkbenchProps> = ({
  selectedScenario,
  setSelectedScenario,
  result,
  isRunning,
  onRunAgent,
  onNavigateToReviewer,
}) => {
  const [customText, setCustomText] = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImageFile[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Get active scenario data
  const currentScenarioObj =
    STARTER_KIT.blockD.scenarios.find((s) => s.id === selectedScenario) ||
    STARTER_KIT.blockD.scenarios[0];

  const effectivePrompt = customText || currentScenarioObj.prompt;

  const handleSelectScenario = (id: string) => {
    setSelectedScenario(id);
    setCustomText('');
    setIsEditingPrompt(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUploadedImages((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            mimeType: file.type || 'image/jpeg',
            base64,
            previewUrl: base64,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(effectivePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleRun = () => {
    onRunAgent(customText || undefined, uploadedImages);
  };

  return (
    <div className="space-y-6">
      {/* Scenario Selector Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Select Verification Scenario
            </h3>
            <p className="text-xs text-slate-400">
              Exercise the NAB Document & KYC Verification Agent flow across clean, discrepancy, and guardrail probe conditions.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Application ID: <strong className="text-slate-200">APP-10293</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STARTER_KIT.blockD.scenarios.map((sc) => {
            const isSelected = selectedScenario === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(sc.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/70 border-red-600 text-white shadow-md ring-1 ring-red-500/30'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs font-mono">{sc.id} Scenario</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      sc.badgeColor === 'emerald'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : sc.badgeColor === 'amber'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {sc.badge}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-slate-100 mb-1">{sc.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{sc.expected}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Intake Cards */}
      <DocumentCards scenarioId={selectedScenario} uploadedImages={uploadedImages} />

      {/* Input / Multimodal Prompt Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Agent Customer Turn Prompt ({selectedScenario})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingPrompt(!isEditingPrompt)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-950 border border-slate-800 cursor-pointer"
            >
              {isEditingPrompt ? 'Close Editor' : 'Customize Prompt'}
            </button>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-950 border border-slate-800 cursor-pointer"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {isEditingPrompt ? (
          <div>
            <textarea
              value={customText || currentScenarioObj.prompt}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 h-36 resize-y focus:outline-none focus:border-red-500"
            />
            <button
              onClick={() => setCustomText('')}
              className="text-[11px] text-slate-400 hover:text-red-400 mt-1 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset to Scenario Default
            </button>
          </div>
        ) : (
          <pre className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-300 overflow-x-auto max-h-36 whitespace-pre-wrap">
            {effectivePrompt}
          </pre>
        )}

        {/* Optional Multimodal Image Upload attachment */}
        <div className="pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 cursor-pointer">
            <UploadCloud className="w-4 h-4 text-sky-400" />
            <span>Upload Document Image / PDF (Optional Multimodal)</span>
            <input
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="text-[11px] text-slate-400 font-mono">
            {uploadedImages.length > 0
              ? `${uploadedImages.length} custom file(s) attached`
              : 'Accepts PNG, JPG, or PDF'}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={isRunning}
            onClick={handleRun}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-slate-800 text-slate-500 cursor-wait'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50 hover:shadow-red-900/60'
            }`}
          >
            {isRunning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-red-400" />
                <span>Running Function Calling Agent...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Verification Agent</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="space-y-6">
          {/* Notice Banner if simulated or warning */}
          {result.warning && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{result.warning}</span>
            </div>
          )}

          {/* Function Calling Stepper Timeline */}
          <ToolCallTimeline toolCalls={result.toolCalls} isProcessing={isRunning} />

          {/* Agent Final Output Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-white">Agent Response Transcript</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                PII Redaction Enforced
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
              {result.finalAgentText}
            </div>

            {/* If package was submitted, provide quick CTA to Reviewer Desk */}
            {result.submittedPackage && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-red-950/20 border border-red-900/40 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-red-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>
                    Structured reviewer package successfully queued under Task ID:{' '}
                    <strong className="font-mono text-white">REV-55821</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToReviewer}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Open Human Reviewer Station</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
