import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Play, CheckCircle2, Sliders, Layers } from 'lucide-react';
import { buildNlpPipeline } from '../../services/api';
import { NlpPipelinePlan } from '../../types/pipeline';

interface NlpPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (plan: NlpPipelinePlan) => void;
  currentMediaContext?: any;
}

export const NlpPromptModal: React.FC<NlpPromptModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
  currentMediaContext,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<NlpPipelinePlan | null>(null);
  const [source, setSource] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Make this product ready for website, Instagram feed, and Amazon marketplace.',
    'Create high-converting vertical TikTok/Reels stories with ambient background padding.',
    'Prepare catalog for multi-channel launch: hero banner, 1:1 square, and fast thumbnails.',
    'OLED dark theme: pure black background padding for luxury watch and electronics.',
  ];

  const handleGenerate = async (queryText?: string) => {
    const textToUse = queryText || prompt;
    if (!textToUse.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await buildNlpPipeline(textToUse, currentMediaContext);
      setPlan(res.plan);
      setSource(res.source);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate pipeline from description');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (plan) {
      onApplyPlan(plan);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Natural Language Pipeline Builder
              </h3>
              <p className="text-xs text-slate-400">
                Describe your desired channels and treatment; Gemini configures the Cloudinary pipeline.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block">
            USER INTENT PROMPT
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'Make this product ready for my website, Instagram post, and marketplace with white background padding.'"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-sans"
            />
          </div>
        </div>

        {/* Quick Suggestion Pills (functional buttons with click handlers) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-500 block">
            QUICK PRESETS
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(qp);
                  handleGenerate(qp);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-left transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Plan Preview Result */}
        {plan && (
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-900/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {plan.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                {source}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {plan.summary}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">TARGET CHANNELS</span>
                <span className="text-blue-400 font-medium capitalize">
                  {plan.channels.join(', ').replace(/_/g, ' ')}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">AI ESTIMATED SAVINGS</span>
                <span className="text-emerald-400 font-bold font-mono">
                  ~{plan.estimatedStorageSavingsPercent}% Storage Reduction
                </span>
              </div>
            </div>

            {/* Generated Steps */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-500 block">
                COMPILED CLOUDINARY STAGES ({plan.steps.length})
              </span>
              <div className="space-y-1">
                {plan.steps.map((st, i) => (
                  <div
                    key={st.id || i}
                    className="flex items-center justify-between px-3 py-1.5 rounded bg-slate-900/70 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500 font-mono text-[10px]">
                        0{i + 1}
                      </span>
                      <span className="text-slate-200 font-medium truncate">
                        {st.name}
                      </span>
                    </div>
                    <code className="text-blue-400 text-[11px] font-mono truncate ml-2">
                      {st.cloudinaryTransform}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!plan ? (
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={loading || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gemini Parsing Intent...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Pipeline</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Pipeline ({plan.steps.length} Steps)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
