import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileImage,
  FileVideo,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { SAMPLE_MEDIA_ITEMS, SampleMediaItem } from '../services/sampleMedia';
import { analyzeMedia, uploadMedia, formatBytes, toggleDemoMode } from '../services/api';
import { MediaAnalysis, MediaAsset, PageTab, ConfigStatus } from '../types/pipeline';

interface UploadAnalyzePageProps {
  onMediaReady: (asset: MediaAsset, analysis: MediaAnalysis) => void;
  onNavigate: (tab: PageTab) => void;
  config?: ConfigStatus | null;
  onRefreshConfig?: () => void;
}

export const UploadAnalyzePage: React.FC<UploadAnalyzePageProps> = ({
  onMediaReady,
  onNavigate,
  config,
  onRefreshConfig,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    type: string;
    previewUrl: string;
    dataUrl?: string;
    width: number;
    height: number;
    format: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedAsset, setUploadedAsset] = useState<MediaAsset | null>(null);
  const [analysis, setAnalysis] = useState<MediaAnalysis | null>(null);
  const [analysisSource, setAnalysisSource] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [userDirective, setUserDirective] = useState('');
  const [activeSamplePath, setActiveSamplePath] = useState<string | undefined>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (file: File) => {
    if (!file) return;
    setError(null);
    setActiveSamplePath(undefined);
    const previewUrl = URL.createObjectURL(file);
    const format = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const isVideo = file.type.startsWith('video/') || ['mp4', 'mov', 'webm'].includes(format);

    const reader = new FileReader();
    reader.onerror = () => {
      setError('Unable to read selected file from your device.');
    };
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        setError('Failed to extract data from selected file.');
        return;
      }

      if (isVideo) {
        const fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type || 'video/mp4',
          previewUrl,
          dataUrl,
          width: 1920,
          height: 1080,
          format,
        };
        setSelectedFile(fileInfo);
        startUploadAndAnalysis(fileInfo);
      } else {
        const img = new Image();
        img.onload = () => {
          const fileInfo = {
            name: file.name,
            size: file.size,
            type: file.type || 'image/jpeg',
            previewUrl,
            dataUrl,
            width: img.width || 1200,
            height: img.height || 1200,
            format,
          };
          setSelectedFile(fileInfo);
          startUploadAndAnalysis(fileInfo);
        };
        img.onerror = () => {
          const fileInfo = {
            name: file.name,
            size: file.size,
            type: file.type || 'image/jpeg',
            previewUrl,
            dataUrl,
            width: 1200,
            height: 1200,
            format,
          };
          setSelectedFile(fileInfo);
          startUploadAndAnalysis(fileInfo);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample: SampleMediaItem) => {
    setError(null);
    setActiveSamplePath(sample.url);
    if (sample.suggestedPrompt) {
      setUserDirective(sample.suggestedPrompt);
    }
    if (!config?.cloudinaryConfigured && !config?.explicitDemoMode) {
      try {
        await toggleDemoMode(true);
        if (onRefreshConfig) await onRefreshConfig();
      } catch (e) {
        console.error('Failed to toggle demo mode', e);
      }
    }

    const fileData = {
      name: sample.name,
      size: sample.bytes,
      type: 'image/jpeg',
      previewUrl: sample.url,
      dataUrl: undefined,
      width: sample.width,
      height: sample.height,
      format: sample.format,
    };
    setSelectedFile(fileData);
    startUploadAndAnalysis(fileData, sample.url);
  };

  const handleEnableDemoAndUpload = async () => {
    try {
      setIsUploading(true);
      setError(null);
      await toggleDemoMode(true);
      if (onRefreshConfig) await onRefreshConfig();
      if (selectedFile) {
        await startUploadAndAnalysis(selectedFile, activeSamplePath);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to enable demo mode');
    } finally {
      setIsUploading(false);
    }
  };

  const startUploadAndAnalysis = async (
    fileInfo: typeof selectedFile,
    samplePath?: string
  ) => {
    if (!fileInfo) return;
    const pathToUse = samplePath || activeSamplePath;
    if (samplePath) setActiveSamplePath(samplePath);

    setIsUploading(true);
    setIsAnalyzing(false);
    setError(null);
    setAnalysis(null);

    try {
      // 1. Upload to Cloudinary / register asset
      const uploadRes = await uploadMedia({
        name: fileInfo.name,
        dataUrl: fileInfo.dataUrl,
        size: fileInfo.size,
        type: fileInfo.type,
        samplePath: pathToUse,
      });

      setUploadedAsset(uploadRes.asset);
      setIsUploading(false);

      // 2. Run Gemini Semantic Analysis
      setIsAnalyzing(true);
      const analysisRes = await analyzeMedia({
        mediaName: fileInfo.name,
        mediaType: fileInfo.type.includes('video') ? 'video' : 'image',
        base64Data: fileInfo.dataUrl,
        mimeType: fileInfo.type,
        samplePath: pathToUse,
        userPrompt: userDirective || undefined,
      });

      setAnalysis(analysisRes.analysis);
      setAnalysisSource(analysisRes.source);
    } catch (err: any) {
      setError(err?.message || 'Processing failed');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleProceedToPipeline = () => {
    if (uploadedAsset && analysis) {
      onMediaReady(uploadedAsset, analysis);
      onNavigate('pipeline');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>INGESTION & REASONING</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Upload & Autonomous Media Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload any image or video. Gemini semantically understands the media, and Cloudinary prepares the autonomous pipeline.
        </p>
      </div>

      {/* Cloudinary Status & Demo Option Helper */}
      {!config?.cloudinaryConfigured && !config?.explicitDemoMode && (
        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-200">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Instant Evaluation:</strong> Cloudinary API secret is unverified. You can enable Demo Mode to test file uploads and Gemini AI analysis immediately.
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              await toggleDemoMode(true);
              if (onRefreshConfig) await onRefreshConfig();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all"
          >
            Enable Demo Mode (1-Click)
          </button>
        </div>
      )}

      {/* Main Drag-and-Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-950/20'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
        }`}
      >
        {/* Full-coverage native file input: 100% reliable click & drop inside iFrames */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files[0]);
            }
            e.target.value = '';
          }}
        />

        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              Drop your media here
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              or <span className="text-blue-400 underline font-medium">browse files</span> from your computer
            </p>
          </div>
          <div className="pt-1">
            <span className="inline-block px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
              Choose File
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Supports PNG, JPG, WebP, AVIF, MP4, MOV (up to 50MB)
          </div>
        </div>
      </div>

      {/* 1-Click Demo Media Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-mono font-medium text-slate-300">
              OR TEST IMMEDIATELY WITH CURATED PRODUCT ASSETS (1-CLICK)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Instant Hackathon Demo
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SAMPLE_MEDIA_ITEMS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="group cursor-pointer rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/60 transition-all p-3 space-y-2.5 text-left"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-slate-300 border border-slate-800">
                  {sample.category.split('&')[0]}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                  {sample.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {sample.tagline}
                </p>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  {sample.width}x{sample.height} · {formatBytes(sample.bytes)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-rose-200 block font-mono">
                OPERATION HALTED — ERROR DETECTED
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">{error}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-rose-900/40">
            {(!config?.cloudinaryConfigured || error.includes('Cloudinary authentication failed') || error.includes('CLOUDINARY_AUTH_ERROR')) && (
              <button
                type="button"
                onClick={handleEnableDemoAndUpload}
                disabled={isUploading}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enable Demo Mode & Continue Upload</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Configure Credentials in Settings →
            </button>
          </div>
        </div>
      )}

      {/* Inspection & AI Analysis Results Section */}
      {selectedFile && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs font-mono text-blue-400">
                ACTIVE ASSET INSPECTION
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-0.5">
                {selectedFile.name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => startUploadAndAnalysis(selectedFile, activeSamplePath)}
                disabled={isUploading || isAnalyzing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-blue-950/40 transition-all active:scale-95"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>
                  {isUploading ? 'Uploading Media...' : isAnalyzing ? 'Analyzing with Gemini...' : analysis ? 'Re-Analyze with Gemini' : 'Upload & Analyze Asset'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setUploadedAsset(null);
                  setAnalysis(null);
                  setActiveSamplePath(undefined);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {analysis && (
                <button
                  type="button"
                  onClick={handleProceedToPipeline}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
                >
                  <span>Build & Run Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Optional Prompt Directive */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              AI Directive:
            </span>
            <input
              type="text"
              value={userDirective}
              onChange={(e) => setUserDirective(e.target.value)}
              placeholder="e.g. Optimize for multi-channel marketplace & high-conversion social ads"
              className="flex-1 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none min-w-[200px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Media Preview & Metadata */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                <img
                  src={selectedFile.previewUrl}
                  alt={selectedFile.name}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {/* Animated AI Scanning Line when analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse pointer-events-none border-b-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                )}
              </div>

              {/* Physical metadata specs */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Resolution:</span>
                  <span className="text-slate-200">{selectedFile.width} × {selectedFile.height} px</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>File Size:</span>
                  <span className="text-slate-200">{formatBytes(selectedFile.size)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Format:</span>
                  <span className="text-slate-200">{selectedFile.format.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Ingest Status:</span>
                  <span className="text-emerald-400 font-semibold">
                    {isUploading ? 'Uploading...' : 'Ready for Pipeline'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Analysis Cards (2 cols) */}
            <div className="md:col-span-2 space-y-4">
              {/* Scanning status banner */}
              {isAnalyzing && (
                <div className="p-5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-center space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-blue-400">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>GEMINI AI SEMANTIC UNDERSTANDING</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Detecting subject boundary, analyzing lighting geometry, evaluating quality score, and preparing Cloudinary recipe...
                  </p>
                </div>
              )}

              {/* Analysis Complete */}
              {analysis && (
                <div className="space-y-4">
                  {/* Analysis Header */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200">
                        Semantic Understanding Complete
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                      {analysisSource}
                    </span>
                  </div>

                  {/* Quality & Classification Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        CATEGORY
                      </span>
                      <span className="text-slate-200 font-medium">
                        {analysis.category}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        QUALITY SCORE
                      </span>
                      <span className="text-emerald-400 font-bold font-mono text-sm">
                        {(analysis.qualityScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        BACKGROUND
                      </span>
                      <span className="text-slate-300 font-medium capitalize">
                        {analysis.background}
                      </span>
                    </div>
                  </div>

                  {/* Detected Subject */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block">
                      DETECTED FOREGROUND SUBJECT
                    </span>
                    <p className="text-slate-200 font-medium">
                      {analysis.detectedSubject}
                    </p>
                  </div>

                  {/* AI Reasoning */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-blue-900/30 text-xs space-y-1.5">
                    <span className="text-[10px] text-blue-400 font-mono block">
                      PIPELINE REASONING & STRATEGY
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {analysis.pipelineReasoning}
                    </p>
                  </div>

                  {/* Recommended Channels */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono block">
                      RECOMMENDED CHANNEL TARGETS ({analysis.recommendedChannels.length})
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {analysis.recommendedChannels.map((ch) => (
                        <span
                          key={ch}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] capitalize"
                        >
                          {ch.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA to Pipeline */}
                  <div className="pt-2">
                    <button
                      onClick={handleProceedToPipeline}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <span>Proceed to AI Pipeline Orchestrator</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
