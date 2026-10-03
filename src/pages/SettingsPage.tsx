import React, { useState } from 'react';
import {
  Settings,
  Cloud,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  ExternalLink,
  Sliders,
  Check,
} from 'lucide-react';
import { ConfigStatus } from '../types/pipeline';
import { testCloudinaryConnection, toggleDemoMode } from '../services/api';

interface SettingsPageProps {
  config: ConfigStatus | null;
  onRefreshConfig: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ config, onRefreshConfig }) => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const [inputCloud, setInputCloud] = useState(config?.cloudName || '');
  const [inputKey, setInputKey] = useState('');
  const [inputSecret, setInputSecret] = useState('');

  const [togglingDemo, setTogglingDemo] = useState(false);

  const handleTestCloudinary = async (useInputs = false) => {
    setTestingConnection(true);
    setTestResult(null);
    setTestError(null);
    try {
      const payload = useInputs && inputCloud && inputKey && inputSecret
        ? { cloudName: inputCloud, apiKey: inputKey, apiSecret: inputSecret }
        : undefined;

      const res = await testCloudinaryConnection(payload);
      setTestResult(res.result);
      await onRefreshConfig();
    } catch (err: any) {
      setTestError(err?.message || 'Authentication failed');
      await onRefreshConfig();
    } finally {
      setTestingConnection(false);
    }
  };

  const handleToggleDemoMode = async (enabled: boolean) => {
    setTogglingDemo(true);
    try {
      await toggleDemoMode(enabled);
      await onRefreshConfig();
    } catch (err: any) {
      console.error('Failed to toggle demo mode:', err);
    } finally {
      setTogglingDemo(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
          <Settings className="w-3.5 h-3.5" />
          <span>INFRASTRUCTURE CONFIGURATION</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Cloudinary & AI Connections
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real media pipeline infrastructure. Test live Cloudinary connectivity or explicitly enable development demo mode.
        </p>
      </div>

      {/* Mode Status Callout */}
      <div
        className={`p-6 rounded-2xl border ${
          config?.cloudinaryConfigured && config.cloudinaryAuthStatus === 'verified'
            ? 'bg-emerald-950/20 border-emerald-800/60'
            : config?.explicitDemoMode
            ? 'bg-blue-950/20 border-blue-800/60'
            : 'bg-rose-950/20 border-rose-900/60'
        } space-y-3`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                config?.cloudinaryConfigured && config.cloudinaryAuthStatus === 'verified'
                  ? 'bg-emerald-600/20 text-emerald-400'
                  : config?.explicitDemoMode
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'bg-rose-600/20 text-rose-400'
              }`}
            >
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {config?.cloudinaryConfigured && config.cloudinaryAuthStatus === 'verified'
                  ? 'Cloudinary Real Connection: VERIFIED'
                  : config?.explicitDemoMode
                  ? 'Explicit Demo Mode (Developer Selected)'
                  : 'Cloudinary Real Connection: AUTHENTICATION FAILED'}
              </h3>
              <p className="text-xs text-slate-300">
                {config?.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleTestCloudinary(false)}
            disabled={testingConnection}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>{testingConnection ? 'Testing Real API...' : 'Test Cloudinary Connection'}</span>
          </button>
        </div>

        {/* Test Result Inspection */}
        {testResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/60 text-xs font-mono space-y-2 text-emerald-300">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>REAL CLOUDINARY CONNECTIVITY VERIFIED</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
              <div>public_id: <span className="text-emerald-400">{testResult.public_id}</span></div>
              <div>format: <span className="text-emerald-400">{testResult.format}</span></div>
              <div>dimensions: <span className="text-emerald-400">{testResult.width}x{testResult.height}</span></div>
              <div>bytes: <span className="text-emerald-400">{testResult.bytes}</span></div>
              <div className="col-span-2 truncate">secure_url: <span className="text-blue-400">{testResult.secure_url}</span></div>
            </div>
          </div>
        )}

        {/* Test Error Inspection */}
        {testError && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-900 text-xs font-mono space-y-1.5 text-rose-300">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>CLOUDINARY_AUTH_ERROR (HTTP 401)</span>
            </div>
            <p className="text-[11px] text-slate-200">
              {testError}
            </p>
          </div>
        )}
      </div>

      {/* Explicit Demo Mode Control Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              EXPLICIT DEMO MODE TOGGLE
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Per strict project requirements, Demo Mode will never automatically take over on error. You can explicitly enable it here for offline hackathon evaluations.
            </p>
          </div>

          <button
            onClick={() => handleToggleDemoMode(!config?.explicitDemoMode)}
            disabled={togglingDemo}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
              config?.explicitDemoMode
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {config?.explicitDemoMode ? 'Explicit Demo Mode: ON' : 'Explicit Demo Mode: OFF'}
          </button>
        </div>
      </div>

      {/* Test Updated Cloudinary Credentials */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-slate-100">
            Configure / Update Cloudinary Credentials
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test and apply your real Cloudinary Cloud Name, API Key, and API Secret.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">CLOUDINARY_CLOUD_NAME</label>
            <input
              type="text"
              placeholder="e.g. my-cloud"
              value={inputCloud}
              onChange={(e) => setInputCloud(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">CLOUDINARY_API_KEY</label>
            <input
              type="text"
              placeholder="e.g. 123456789012345"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">CLOUDINARY_API_SECRET</label>
            <input
              type="password"
              placeholder="Paste secret"
              value={inputSecret}
              onChange={(e) => setInputSecret(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleTestCloudinary(true)}
            disabled={testingConnection || !inputCloud || !inputKey || !inputSecret}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            Apply & Test Real Connection
          </button>
        </div>
      </div>
    </div>
  );
};
