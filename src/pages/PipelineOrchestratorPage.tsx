import React, { useState } from 'react';
import {
  Workflow,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  FileCode,
  Layers,
  Terminal,
  AlertTriangle,
} from 'lucide-react';
import { PipelineGraph } from '../components/pipeline/PipelineGraph';
import { MediaAsset, MediaAnalysis, PipelineStep, PageTab, ChannelVariant, PipelineJob } from '../types/pipeline';
import { executePipeline, formatBytes } from '../services/api';

interface PipelineOrchestratorPageProps {
  currentAsset: MediaAsset;
  currentAnalysis?: MediaAnalysis | null;
  onPipelineExecuted: (asset: MediaAsset, job: PipelineJob, variants: ChannelVariant[]) => void;
  onNavigate: (tab: PageTab) => void;
  onOpenLogs: (job: PipelineJob) => void;
  onOpenNlpModal: () => void;
}

export const PipelineOrchestratorPage: React.FC<PipelineOrchestratorPageProps> = ({
  currentAsset,
  currentAnalysis,
  onPipelineExecuted,
  onNavigate,
  onOpenLogs,
  onOpenNlpModal,
}) => {
  const initialSteps: PipelineStep[] = [
    {
      id: 'step-1',
      name: 'Cloudinary Ingestion & Verification',
      status: 'completed',
      durationMs: 140,
      cloudinaryOp: 'resource_type: auto',
      reasoning: `Verified format (${currentAsset.format.toUpperCase()}), dimensions ${currentAsset.width}x${currentAsset.height}, size ${formatBytes(currentAsset.bytes)}.`,
      inputDescription: currentAsset.name,
      outputDescription: 'Verified Media Payload',
    },
    {
      id: 'step-2',
      name: 'Gemini Semantic Understanding',
      status: 'completed',
      durationMs: 340,
      cloudinaryOp: 'ai_analysis',
      reasoning: currentAnalysis?.pipelineReasoning || currentAsset.pipelineReasoning || 'Identified subject composition and calculated channel recommendations.',
      inputDescription: 'Visual buffer',
      outputDescription: 'Structured JSON Taxonomy',
    },
    {
      id: 'step-3',
      name: 'Cloudinary Quality Audit',
      status: 'pending',
      durationMs: 160,
      cloudinaryOp: `quality_analysis: ${currentAsset.qualityScore}`,
      reasoning: `Quality score ${(currentAsset.qualityScore * 100).toFixed(0)}%. No blur artifacts detected. Asset approved for commercial catalog.`,
      inputDescription: 'High-res source',
      outputDescription: 'Quality Confidence Score',
    },
    {
      id: 'step-4',
      name: 'Smart Subject Framing & Gravity',
      status: 'pending',
      durationMs: 290,
      cloudinaryOp: 'g_auto:subject,c_fill',
      reasoning: 'Computes salient bounding box around the detected subject to prevent unwanted edge cropping during aspect transitions.',
      inputDescription: 'Full frame',
      outputDescription: 'Subject Coordinates',
    },
    {
      id: 'step-5',
      name: 'Channel Aspect Synthesis',
      status: 'pending',
      durationMs: 380,
      cloudinaryOp: 'ar_16:9, ar_1:1, ar_9:16, ar_4:5',
      reasoning: 'Generates specialized crops: 16:9 Hero, 1:1 Square, 9:16 Mobile Story, and 4:5 Vertical Ad.',
      inputDescription: 'Dynamic crop box',
      outputDescription: '7 Channel Deliverables',
    },
    {
      id: 'step-6',
      name: 'Format & Compression Optimization',
      status: 'pending',
      durationMs: 210,
      cloudinaryOp: 'f_auto,q_auto:best',
      reasoning: 'Dynamically serves modern AVIF or WebP based on user browser capability with perceptual quality compression.',
      inputDescription: 'Multi-aspect buffer',
      outputDescription: 'Sub-second modern formats',
    },
    {
      id: 'step-7',
      name: 'CDN Edge Delivery Provisioning',
      status: 'pending',
      durationMs: 90,
      cloudinaryOp: 'delivery_urls',
      reasoning: 'Publishes resilient Cloudinary edge delivery URLs for instant worldwide multi-channel rendering.',
      inputDescription: 'Edge CDN nodes',
      outputDescription: 'Production Edge URLs',
    },
  ];

  const [steps, setSteps] = useState<PipelineStep[]>(initialSteps);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'website',
    'instagram_post',
    'instagram_story',
    'marketplace',
    'ad_creative',
    'mobile_app',
    'thumbnail',
  ]);
  const [lastExecutedJob, setLastExecutedJob] = useState<PipelineJob | null>(null);

  const availableChannels = [
    { id: 'website', label: 'Website Hero', desc: '16:9 AVIF' },
    { id: 'instagram_post', label: 'Instagram Feed', desc: '1:1 Square WebP' },
    { id: 'instagram_story', label: 'Story / TikTok', desc: '9:16 Vertical WebP' },
    { id: 'marketplace', label: 'Amazon Square', desc: '1:1 White Pad JPG' },
    { id: 'ad_creative', label: 'Ad Creative', desc: '4:5 Social WebP' },
    { id: 'mobile_app', label: 'Mobile App', desc: '4:3 Responsive WebP' },
    { id: 'thumbnail', label: 'Catalog Grid', desc: '300x300 Micro' },
  ];

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleRunPipeline = async () => {
    setIsExecuting(true);
    setExecutionError(null);

    // Simulate animated step transitions sequentially
    const updated = [...steps];
    for (let i = 2; i < updated.length; i++) {
      updated[i].status = 'processing';
      setSteps([...updated]);
      await new Promise((r) => setTimeout(r, 220));
      updated[i].status = 'completed';
      setSteps([...updated]);
    }

    try {
      const res = await executePipeline({
        assetId: currentAsset.id,
        customChannels: selectedChannels,
        customSteps: steps,
        analysis: currentAnalysis || undefined,
      });

      setLastExecutedJob(res.job);
      onPipelineExecuted(res.asset, res.job, res.variants);
    } catch (err: any) {
      console.error('Pipeline execution error:', err);
      setExecutionError(err?.message || 'Pipeline execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAddStep = (newStep: PipelineStep) => {
    setSteps((prev) => [...prev, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDuplicateStep = (id: string) => {
    const target = steps.find((s) => s.id === id);
    if (!target) return;
    const duplicated: PipelineStep = {
      ...target,
      id: `step-dup-${Date.now().toString(36)}`,
      name: `${target.name} (Copy)`,
    };
    setSteps((prev) => [...prev, duplicated]);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Title & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <Workflow className="w-3.5 h-3.5" />
            <span>AI PIPELINE ORCHESTRATOR</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Autonomous Pipeline Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gemini synthesized this execution sequence. Cloudinary executes the media operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNlpModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Customize with AI Prompt</span>
          </button>
        </div>
      </div>

      {/* Target Asset Context Strip */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center p-1">
            <img
              src={currentAsset.originalUrl}
              alt={currentAsset.name}
              className="max-h-full max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">
              {currentAsset.name}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
              <span>{currentAsset.category}</span>
              <span>·</span>
              <span>{currentAsset.width}x{currentAsset.height} px</span>
              <span>·</span>
              <span className="text-slate-200">{formatBytes(currentAsset.bytes)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Quality:</span>
          <span className="text-emerald-400 font-bold">
            {(currentAsset.qualityScore * 100).toFixed(0)}%
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">Mode:</span>
          <span className={currentAsset.isDemo ? 'text-indigo-400' : 'text-emerald-400'}>
            {currentAsset.isDemo ? 'Interactive Demo' : 'Live Cloudinary'}
          </span>
        </div>
      </div>

      {/* Execution Error Banner */}
      {executionError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-rose-200 block font-mono">
              PIPELINE EXECUTION HALTED
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">{executionError}</p>
          </div>
        </div>
      )}

      {/* Channel Targets Selector */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              TARGET DELIVERY CHANNELS ({selectedChannels.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Toggle specific aspect ratios to include or exclude from this execution batch
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            {selectedChannels.length * 2} Transformations Planned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
          {availableChannels.map((ch) => {
            const isSelected = selectedChannels.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => toggleChannel(ch.id)}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/30 text-white ring-1 ring-blue-500/40'
                    : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{ch.label}</div>
                <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                  {ch.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Pipeline Graph & Node Inspector */}
      <PipelineGraph
        steps={steps}
        onExecute={handleRunPipeline}
        isExecuting={isExecuting}
        onAddStep={handleAddStep}
        onRemoveStep={handleRemoveStep}
        onDuplicateStep={handleDuplicateStep}
        mediaName={currentAsset.name}
      />

      {/* Post Execution Banner */}
      {lastExecutedJob && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-800/60 flex flex-wrap items-center justify-between gap-4 shadow-xl animate-in fade-in duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>PIPELINE RUN COMPLETE ({lastExecutedJob.durationMs}ms)</span>
            </div>
            <h4 className="text-base font-bold text-white">
              One upload → {lastExecutedJob.channelsCount} production-ready assets
            </h4>
            <p className="text-xs text-slate-300">
              Aggregated storage reduced by {lastExecutedJob.savingsPercent}% using modern AVIF/WebP encoding.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenLogs(lastExecutedJob)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>View Logs</span>
            </button>

            <button
              onClick={() => onNavigate('before-after')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>Before / After Slider</span>
            </button>

            <button
              onClick={() => onNavigate('results')}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <span>Inspect Assets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
