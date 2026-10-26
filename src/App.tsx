import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Workbench } from './components/Workbench';
import { ReviewerDesk } from './components/ReviewerDesk';
import { StarterKitExplorer } from './components/StarterKitExplorer';
import { AcceptanceAuditView } from './components/AcceptanceAuditView';
import { BlockBViewer } from './components/BlockBViewer';
import { BlockCViewer } from './components/BlockCViewer';
import { BlockDViewer } from './components/BlockDViewer';
import { VerificationResult, UploadedImageFile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'block-b' | 'block-c' | 'block-d' | 'reviewer' | 'starter-kit' | 'audit'>('studio');
  const [selectedScenario, setSelectedScenario] = useState<string>('D1');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [adjudicationStatus, setAdjudicationStatus] = useState<string>('pending_human_review');

  // Check backend config
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setHasKey(data.hasGeminiKey || false);
        if (data.defaultModel) {
          setSelectedModel(data.defaultModel);
        }
      })
      .catch((err) => {
        console.error('Error fetching config:', err);
      });
  }, []);

  // Run verification
  const handleRunAgent = useCallback(
    async (customPrompt?: string, images: UploadedImageFile[] = []) => {
      setIsRunning(true);
      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioId: selectedScenario,
            appId: 'APP-10293',
            documentsText: customPrompt,
            images,
            model: selectedModel,
            temperature: 0.2,
          }),
        });

        const data: VerificationResult = await response.json();
        setResult(data);
        setAdjudicationStatus('pending_human_review');
      } catch (err) {
        console.error('Agent execution error:', err);
      } finally {
        setIsRunning(false);
      }
    },
    [selectedScenario, selectedModel]
  );

  // Run default D1 on first load so user immediately sees populated verification
  useEffect(() => {
    handleRunAgent();
  }, [handleRunAgent]);

  // Handle human reviewer adjudication
  const handleAdjudicate = async (decision: string, notes: string) => {
    try {
      const response = await fetch('/api/reviewer/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: result?.submittedPackage?.appId || 'APP-10293',
          reviewTaskId: 'REV-55821',
          decision,
          reviewerNotes: notes,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAdjudicationStatus(decision);
      }
    } catch (err) {
      console.error('Error submitting adjudication:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-red-900 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        hasKey={hasKey}
        pendingReviewCount={result?.submittedPackage ? (adjudicationStatus === 'pending_human_review' ? 1 : 0) : 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'studio' && (
          <Workbench
            selectedScenario={selectedScenario}
            setSelectedScenario={setSelectedScenario}
            result={result}
            isRunning={isRunning}
            onRunAgent={handleRunAgent}
            onNavigateToReviewer={() => setActiveTab('reviewer')}
          />
        )}

        {activeTab === 'block-b' && <BlockBViewer />}

        {activeTab === 'block-c' && <BlockCViewer />}

        {activeTab === 'block-d' && (
          <BlockDViewer
            onRunScenario={(scenarioId) => {
              setSelectedScenario(scenarioId);
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'reviewer' && (
          <ReviewerDesk
            currentPackage={result?.submittedPackage || null}
            onAdjudicate={handleAdjudicate}
            status={adjudicationStatus}
          />
        )}

        {activeTab === 'starter-kit' && <StarterKitExplorer />}

        {activeTab === 'audit' && (
          <AcceptanceAuditView
            checks={result?.acceptanceChecks || []}
            scenarioId={selectedScenario}
            submittedPackage={result?.submittedPackage || null}
            finalAgentText={result?.finalAgentText || ''}
            onRunScenario={(scenarioId) => {
              setSelectedScenario(scenarioId);
              setActiveTab('studio');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            NAB Digital Sales &bull; PRD 3 Document & KYC Verification Agent &bull; Non-Delegated Decision Architecture
          </span>
          <span className="font-mono text-slate-400">
            Compliant with APRA CPG 235 & AUSTRAC Identity Verification Guidelines
          </span>
        </div>
      </footer>
    </div>
  );
}
