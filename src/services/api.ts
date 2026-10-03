import {
  ConfigStatus,
  MediaAnalysis,
  NlpPipelinePlan,
  MediaAsset,
  PipelineJob,
  ChannelVariant,
  AnalyticsData,
  AppApiError,
} from '../types/pipeline';

export async function getConfigStatus(): Promise<ConfigStatus> {
  const res = await fetch('/api/config-status');
  if (!res.ok) throw new Error('Failed to fetch config status');
  return res.json();
}

export async function toggleDemoMode(enabled: boolean): Promise<{ success: boolean; explicitDemoMode: boolean; message: string }> {
  const res = await fetch('/api/toggle-demo-mode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to toggle demo mode');
  }
  return res.json();
}

export async function testCloudinaryConnection(creds?: {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}): Promise<{
  success: boolean;
  service: string;
  result?: {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    resource_type: string;
  };
}> {
  const res = await fetch('/api/test-cloudinary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const err: AppApiError = {
      errorCode: data.errorCode || 'CLOUDINARY_AUTH_ERROR',
      message: data.message || 'Cloudinary authentication failed',
      service: 'cloudinary',
      statusCode: res.status,
      details: data.details,
    };
    throw err;
  }
  return data;
}

export async function analyzeMedia(payload: {
  mediaName: string;
  mediaType?: string;
  base64Data?: string;
  mimeType?: string;
  userPrompt?: string;
  samplePath?: string;
}): Promise<{ success: boolean; analysis: MediaAnalysis; source: string }> {
  const res = await fetch('/api/analyze-media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const err: AppApiError = {
      errorCode: data.errorCode || 'GEMINI_API_ERROR',
      message: data.message || 'Failed to analyze media',
      service: data.service || 'gemini',
      statusCode: res.status,
      details: data.details,
    };
    throw err;
  }
  return data;
}

export async function buildNlpPipeline(
  prompt: string,
  mediaContext?: any
): Promise<{ success: boolean; plan: NlpPipelinePlan; source: string }> {
  const res = await fetch('/api/build-nlp-pipeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, mediaContext }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const err: AppApiError = {
      errorCode: data.errorCode || 'GEMINI_API_ERROR',
      message: data.message || 'Failed to generate natural language pipeline',
      service: data.service || 'gemini',
      statusCode: res.status,
    };
    throw err;
  }
  return data;
}

export async function uploadMedia(payload: {
  name: string;
  dataUrl?: string;
  size?: number;
  type?: string;
  samplePath?: string;
}): Promise<{ success: boolean; asset: MediaAsset; isCloudinaryReal: boolean }> {
  const res = await fetch('/api/upload-media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const err: AppApiError = {
      errorCode: data.errorCode || 'UPLOAD_FAILED',
      message: data.message || 'Failed to upload media',
      service: data.service || 'mediaflow',
      statusCode: res.status,
      details: data.details,
    };
    throw err;
  }
  return data;
}

export async function executePipeline(payload: {
  assetId: string;
  customChannels?: string[];
  customSteps?: any[];
  analysis?: MediaAnalysis;
}): Promise<{
  success: boolean;
  asset: MediaAsset;
  job: PipelineJob;
  variants: ChannelVariant[];
  summary: {
    channelsGenerated: number;
    originalBytes: number;
    optimizedBytes: number;
    reductionPercentage?: number;
    savingsPercent?: number;
    isMeasured: boolean;
    durationMs: number;
    allUrlsVerified: boolean;
  };
}> {
  const res = await fetch('/api/execute-pipeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    const err: AppApiError = {
      errorCode: data.errorCode || 'PIPELINE_EXECUTION_FAILED',
      message: data.message || 'Failed to execute media pipeline',
      service: data.service || 'mediaflow',
      statusCode: res.status,
    };
    throw err;
  }
  return data;
}

export async function getAssets(): Promise<MediaAsset[]> {
  const res = await fetch('/api/assets');
  if (!res.ok) throw new Error('Failed to fetch media assets');
  const data = await res.json();
  return data.assets || [];
}

export async function getAssetById(id: string): Promise<MediaAsset> {
  const res = await fetch(`/api/assets/${id}`);
  if (!res.ok) throw new Error('Asset not found');
  const data = await res.json();
  return data.asset;
}

export async function getJobs(): Promise<PipelineJob[]> {
  const res = await fetch('/api/jobs');
  if (!res.ok) throw new Error('Failed to fetch pipeline history');
  const data = await res.json();
  return data.jobs || [];
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const res = await fetch('/api/analytics');
  if (!res.ok) throw new Error('Failed to fetch analytics');
  const data = await res.json();
  return data.data;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
