import React from 'react';
import {
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { PipelineJob } from '../../src/types/pipeline';

interface PipelineHistoryPageProps {
  jobs: PipelineJob[];
  onOpenLogs: (job: PipelineJob) => void;
}

export const PipelineHistoryPage: React.FC<PipelineHistoryPageProps> = ({
  jobs,
  onOpenLogs,
}) => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
          <History className="w-3.5 h-3.5" />
          <span>AUDITING & OBSERVABILITY</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Pipeline Execution History
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete ledger of automated media orchestration runs, step latencies, and bandwidth savings.
        </p>
      </div>

      {/* Jobs Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-500 font-mono border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Job ID & Asset</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Execution Time</th>
                <th className="py-3.5 px-4">Transformations</th>
                <th className="py-3.5 px-4">Bandwidth Saved</th>
                <th className="py-3.5 px-4">Started At</th>
                <th className="py-3.5 px-5 text-right">Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-1 shrink-0">
                        <img
                          src={job.assetUrl}
                          alt={job.assetName}
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200 block truncate max-w-xs">
                          {job.assetName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {job.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {job.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-300 tabular-nums">
                    {job.durationMs}ms
                  </td>

                  <td className="py-4 px-4 font-mono text-blue-400">
                    {job.transformationsCount} operations
                  </td>

                  <td className="py-4 px-4 font-mono text-emerald-400 font-bold tabular-nums">
                    -{job.savingsPercent}%
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">
                    {new Date(job.startedAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => onOpenLogs(job)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      <span>Inspect Logs</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
