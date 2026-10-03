export type PageTab =
  | 'dashboard'
  | 'upload'
  | 'pipeline'
  | 'results'
  | 'before-after'
  | 'library'
  | 'history'
  | 'analytics'
  | 'architecture'
  | 'settings';

export interface UrlVerification {
  status: number;
  contentType: string;
  bytes: number;
  width?: number;
  height?: number;
  verified: boolean;
  error?: string;
  latencyMs?: number;
}

export interface ChannelVariant {
  id: string;
  channel: string;
  label: string;
  aspectRatio: string;
  dimensions: string;
  url: string;
  cloudinaryUrl?: string;
  format: string;
  estimatedBytes: number;
  originalBytes: number;
  savingsPercent: number;
  isMeasured?: boolean;
  transformation: string;
  rationale: string;
  verification?: UrlVerification;
}

export interface MediaAsset {
  id: string;
  name: string;
  originalUrl: string;
  optimizedUrl?: string;
  resourceType: 'image' | 'video';
  format: string;
  width: number;
  height: number;
  bytes: number;
  optimizedBytes?: number;
  publicId: string;
  createdAt: string;
  tags: string[];
  category: string;
  detectedSubject: string;
  qualityScore: number;
  blurDetection?: string;
  background?: string;
  qualityWarning?: string;
  isDemo: boolean;
  channelVariants?: ChannelVariant[];
  pipelineReasoning?: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'warning';
  durationMs?: number;
  cloudinaryOp: string;
  reasoning: string;
  inputDescription?: string;
  outputDescription?: string;
}

export interface PipelineJob {
  id: string;
  assetId: string;
  assetName: string;
  assetUrl: string;
  status: 'completed' | 'processing' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationMs: number;
  transformationsCount: number;
  channelsCount: number;
  savingsPercent: number;
  isMeasured?: boolean;
  isDemo: boolean;
  steps: {
    id: string;
    name: string;
    status: 'completed' | 'processing' | 'pending' | 'failed';
    durationMs: number;
    cloudinaryOp: string;
    reasoning: string;
  }[];
}

export interface MediaAnalysis {
  mediaType: string;
  category: string;
  detectedSubject: string;
  background: string;
  qualityScore: number;
  blurDetection?: string;
  lightingQuality?: string;
  compositionAssessment?: string;
  recommendedProcessing: string[];
  recommendedChannels: string[];
  reasoning?: string;
  pipelineReasoning: string;
}

export interface NlpPipelinePlan {
  title: string;
  summary: string;
  channels: string[];
  steps: {
    id: string;
    name: string;
    operation: string;
    target?: string;
    reasoning: string;
    cloudinaryTransform: string;
  }[];
  estimatedTransformations: number;
  estimatedStorageSavingsPercent: number;
}

export interface ConfigStatus {
  cloudinaryConfigured: boolean;
  cloudinaryAuthStatus: 'verified' | 'unverified' | 'failed' | 'not_configured';
  cloudinaryAuthError?: string;
  cloudName: string;
  hasApiKey: boolean;
  hasUploadPreset: boolean;
  geminiConfigured: boolean;
  geminiModel: string;
  mode: 'production' | 'demo';
  explicitDemoMode: boolean;
  message: string;
}

export interface AppApiError {
  errorCode: string;
  message: string;
  service: 'cloudinary' | 'gemini' | 'mediaflow';
  statusCode: number;
  requestId?: string;
  details?: any;
}

export interface AnalyticsData {
  assetsProcessed: number;
  activePipelines: number;
  totalTransformations: number;
  storageSavedPercent: number;
  storageSavedGb: string;
  timeSavedHours: number;
  averageDurationMs: number;
  channelCounts: Record<string, number>;
  isDemoWorkspace: boolean;
}
