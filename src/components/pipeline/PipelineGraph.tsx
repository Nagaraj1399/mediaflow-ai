import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Edit2,
  ChevronRight,
  ShieldCheck,
  Maximize,
  Sliders,
  Layers,
  Zap,
} from 'lucide-react';
import { PipelineStep } from '../../types/pipeline';

interface PipelineGraphProps {
  steps: PipelineStep[];
  onExecute: () => void;
  isExecuting: boolean;
  onAddStep?: (newStep: PipelineStep) => void;
  onRemoveStep?: (id: string) => void;
  onDuplicateStep?: (id: string) => void;
  onEditStep?: (step: PipelineStep) => void;
  mediaName?: string;
  sourceType?: string;
}

export const PipelineGraph: React.FC<PipelineGraphProps> = ({
  steps,
  onExecute,
  isExecuting,
  onAddStep,
  onRemoveStep,
  onDuplicateStep,
  onEditStep,
  mediaName,
  sourceType = 'image',
}) => {
  const [activeStepId, setActiveStepId] = useState<string>(steps[0]?.id || '');
  const [isEditingCustomStep, setIsEditingCustomStep] = useState(false);
  const [editingStepData, setEditingStepData] = useState<PipelineStep | null>(null);

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];

  const getStatusIcon = (status: PipelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'processing':
        return (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        );
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBorder = (status: PipelineStep['status'], isSelected: boolean) => {
    if (isSelected) {
      return 'border-blue-500 ring-1 ring-blue-500/50 bg-slate-900';
    }
    switch (status) {
      case 'completed':
        return 'border-emerald-800/60 bg-slate-900/60 hover:border-emerald-600/60';
      case 'processing':
        return 'border-blue-500/80 bg-blue-950/40 animate-pulse';
      case 'warning':
        return 'border-amber-800/60 bg-amber-950/20';
      case 'failed':
        return 'border-rose-800/60 bg-rose-950/20';
      default:
        return 'border-slate-800 bg-slate-900/40 hover:border-slate-700';
    }
  };

  const handleCreateStep = () => {
    const newId = `step-custom-${Date.now().toString(36)}`;
    const newStep: PipelineStep = {
      id: newId,
      name: 'Custom Transformation',
      status: 'pending',
      cloudinaryOp: 'e_contrast:20,q_auto',
      reasoning: 'User custom defined stage injected into autonomous pipeline flow.',
      inputDescription: 'Processed raster frames',
      outputDescription: 'Modified buffer',
    };
    if (onAddStep) onAddStep(newStep);
    setActiveStepId(newId);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-mono">
              Autonomous Pipeline Flow
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              {steps.length} Sequenced Nodes
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">
            Cloudinary Execution Architecture
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {onAddStep && (
            <button
              onClick={handleCreateStep}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Step</span>
            </button>
          )}

          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
          >
            {isExecuting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Media Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Interactive Pipeline Graph */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-inner">
        <div className="flex items-center min-w-max gap-3 py-2">
          {steps.map((step, index) => {
            const isSelected = activeStep?.id === step.id;
            return (
              <React.Fragment key={step.id}>
                {/* Node Box */}
                <div
                  onClick={() => setActiveStepId(step.id)}
                  className={`w-44 p-3.5 rounded-xl border transition-all cursor-pointer text-left select-none relative ${getStatusBorder(
                    step.status,
                    isSelected
                  )}`}
                >
                  {/* Step order index badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      Step {index + 1}
                    </span>
                    <div>{getStatusIcon(step.status)}</div>
                  </div>

                  <h5 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                    {step.name}
                  </h5>

                  <p className="text-[11px] font-mono text-blue-400/90 truncate mb-2">
                    {step.cloudinaryOp}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/80">
                    <span className="capitalize">{step.status}</span>
                    <span className="tabular-nums">
                      {step.durationMs ? `${step.durationMs}ms` : '—'}
                    </span>
                  </div>
                </div>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="text-slate-600 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Step Deep Dive Inspector */}
      {activeStep && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-400">
                  Node Inspector
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 capitalize">
                  Status: {activeStep.status}
                </span>
              </div>
              <h4 className="text-base font-semibold text-slate-100 mt-0.5">
                {activeStep.name}
              </h4>
            </div>

            {/* Step Controls (Add / Duplicate / Delete) */}
            <div className="flex items-center gap-2">
              {onDuplicateStep && (
                <button
                  onClick={() => onDuplicateStep(activeStep.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
              )}
              {onRemoveStep && steps.length > 2 && (
                <button
                  onClick={() => onRemoveStep(activeStep.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs transition-colors border border-rose-900/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reasoning & Input / Output */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-mono text-slate-500 block mb-1">
                  AI DECISION & REASONING
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {activeStep.reasoning}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">
                    INPUT
                  </span>
                  <span className="text-slate-300 font-medium">
                    {activeStep.inputDescription || mediaName || 'Source Media stream'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">
                    OUTPUT
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {activeStep.outputDescription || 'Multi-channel deliverables'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cloudinary Operation Specification */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-mono text-slate-500 block mb-1">
                  CLOUDINARY OPERATIONAL PRIMITIVE
                </span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-400 space-y-1">
                  <div className="text-slate-400 text-[11px]">
                    // Cloudinary SDK / URL API transform
                  </div>
                  <div className="text-blue-300 font-semibold">
                    {activeStep.cloudinaryOp}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="text-slate-300 font-medium">
                  Autonomous Optimization Rule
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Execution leverages Cloudinary dynamic edge transforms without manual local re-encoding or heavy bandwidth round-trips.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
