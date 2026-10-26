export interface ExtractedDocument {
  type: string;
  extracted: Record<string, any>;
  confidence: number;
  quality: 'ok' | 'poor' | 'expired';
  lowConfidenceFields?: string[];
}

export interface ReviewerPackage {
  appId: string;
  documents: ExtractedDocument[];
  discrepancies: string[];
  checklistComplete: boolean;
  readyForHumanReview: boolean;
  reviewerNotes?: string;
  reviewTaskId?: string;
}

export interface ToolCallRecord {
  name: string;
  args: any;
  response: any;
  timestamp?: string;
}

export interface AcceptanceCheck {
  id: string;
  label: string;
  passed: boolean;
  details: string;
}

export interface VerificationResult {
  scenarioId: string;
  turns: Array<{ role: 'user' | 'model'; text: string }>;
  toolCalls: ToolCallRecord[];
  submittedPackage: ReviewerPackage | null;
  finalAgentText: string;
  acceptanceChecks: AcceptanceCheck[];
  isSimulated?: boolean;
  warning?: string;
  fallbackNotice?: string;
}

export interface AdjudicationRecord {
  appId: string;
  reviewTaskId: string;
  status: 'pending_human_review' | 'approved' | 'rejected' | 'reupload_requested' | 'escalated';
  adjudicatedAt?: string;
  adjudicatedBy?: string;
  humanReviewerNotes?: string;
  documents?: ExtractedDocument[];
  discrepancies?: string[];
  checklistComplete?: boolean;
  readyForHumanReview?: boolean;
  reviewerNotes?: string;
}

export interface UploadedImageFile {
  name: string;
  size: number;
  mimeType: string;
  base64: string;
  previewUrl: string;
}
