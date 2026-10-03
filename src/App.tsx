import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { UploadAnalyzePage } from './pages/UploadAnalyzePage';
import { PipelineOrchestratorPage } from './pages/PipelineOrchestratorPage';
import { AssetResultsPage } from './pages/AssetResultsPage';
import { BeforeAfterPage } from './pages/BeforeAfterPage';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { PipelineHistoryPage } from './pages/PipelineHistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';
import { NlpPromptModal } from './components/pipeline/NlpPromptModal';
import { ExecutionLogModal } from './components/pipeline/ExecutionLogModal';
import {
  PageTab,
  MediaAsset,
  MediaAnalysis,
  PipelineJob,
  ChannelVariant,
  AnalyticsData,
  ConfigStatus,
  NlpPipelinePlan,
} from './types/pipeline';
import {
  getConfigStatus,
  getAssets,
  getJobs,
  getAnalytics,
  executePipeline,
} from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('dashboard');
  const [allAssets, setAllAssets] = useState<MediaAsset[]>([]);
  const [currentAsset, setCurrentAsset] = useState<MediaAsset | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<MediaAnalysis | null>(null);
  const [recentJobs, setRecentJobs] = useState<PipelineJob[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [config, setConfig] = useState<ConfigStatus | null>(null);

  const [selectedVariantForCompare, setSelectedVariantForCompare] = useState<ChannelVariant | null>(null);
  const [nlpModalOpen, setNlpModalOpen] = useState(false);
  const [activeLogJob, setActiveLogJob] = useState<PipelineJob | null>(null);

  // Initial load
  const loadInitialData = async () => {
    try {
      const [cfg, assets, jobs, anlt] = await Promise.all([
        getConfigStatus().catch(() => null),
        getAssets().catch(() => []),
        getJobs().catch(() => []),
        getAnalytics().catch(() => null),
      ]);

      if (cfg) setConfig(cfg);
      if (assets && assets.length > 0) {
        setAllAssets(assets);
        setCurrentAsset(assets[0]);
      }
      if (jobs) setRecentJobs(jobs);
      if (anlt) setAnalytics(anlt);
    } catch (err) {
      console.warn('Initial load warning:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handler when user finishes uploading/selecting media
  const handleMediaReady = (asset: MediaAsset, analysis: MediaAnalysis) => {
    setCurrentAsset(asset);
    setCurrentAnalysis(analysis);
    setAllAssets((prev) => [asset, ...prev.filter((a) => a.id !== asset.id)]);
    setCurrentTab('pipeline');
  };

  // Handler when pipeline execution completes
  const handlePipelineExecuted = (
    asset: MediaAsset,
    job: PipelineJob,
    variants: ChannelVariant[]
  ) => {
    setCurrentAsset(asset);
    setAllAssets((prev) => [asset, ...prev.filter((a) => a.id !== asset.id)]);
    setRecentJobs((prev) => [job, ...prev]);
    // Refresh analytics in background
    getAnalytics().then(setAnalytics).catch(() => {});
  };

  // Handler for applying NLP plan
  const handleApplyNlpPlan = async (plan: NlpPipelinePlan) => {
    if (!currentAsset) return;
    try {
      const res = await executePipeline({
        assetId: currentAsset.id,
        customChannels: plan.channels,
        customSteps: plan.steps.map((st, idx) => ({
          id: st.id,
          name: st.name,
          durationMs: 150 + idx * 50,
          cloudinaryOp: st.cloudinaryTransform || st.operation,
          reasoning: st.reasoning,
        })),
        analysis: currentAnalysis || undefined,
      });

      handlePipelineExecuted(res.asset, res.job, res.variants);
      setCurrentTab('results');
    } catch (err) {
      console.error('Failed to execute NLP plan:', err);
    }
  };

  const isDemo = config ? !config.cloudinaryConfigured : true;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        isDemo={isDemo}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          config={config}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentTab}
              recentAssets={allAssets}
              recentJobs={recentJobs}
              analytics={analytics}
              onSelectAsset={(a) => {
                setCurrentAsset(a);
                setSelectedVariantForCompare(a.channelVariants?.[0] || null);
              }}
              onOpenNlpModal={() => setNlpModalOpen(true)}
            />
          )}

          {currentTab === 'upload' && (
            <UploadAnalyzePage
              onMediaReady={handleMediaReady}
              onNavigate={setCurrentTab}
              config={config}
              onRefreshConfig={loadInitialData}
            />
          )}

          {currentTab === 'pipeline' && currentAsset && (
            <PipelineOrchestratorPage
              currentAsset={currentAsset}
              currentAnalysis={currentAnalysis}
              onPipelineExecuted={handlePipelineExecuted}
              onNavigate={setCurrentTab}
              onOpenLogs={(j) => setActiveLogJob(j)}
              onOpenNlpModal={() => setNlpModalOpen(true)}
            />
          )}

          {currentTab === 'results' && currentAsset && (
            <AssetResultsPage
              currentAsset={currentAsset}
              onNavigate={setCurrentTab}
              onSelectForComparison={(variant) => {
                setSelectedVariantForCompare(variant);
                setCurrentTab('before-after');
              }}
            />
          )}

          {currentTab === 'before-after' && currentAsset && (
            <BeforeAfterPage
              currentAsset={currentAsset}
              selectedVariant={selectedVariantForCompare}
              allAssets={allAssets}
              onSelectAsset={(a) => {
                setCurrentAsset(a);
                setSelectedVariantForCompare(a.channelVariants?.[0] || null);
              }}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'library' && (
            <MediaLibraryPage
              assets={allAssets}
              onSelectAsset={(a) => {
                setCurrentAsset(a);
                setSelectedVariantForCompare(a.channelVariants?.[0] || null);
              }}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'history' && (
            <PipelineHistoryPage
              jobs={recentJobs}
              onOpenLogs={(j) => setActiveLogJob(j)}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage analytics={analytics} />
          )}

          {currentTab === 'architecture' && (
            <ArchitecturePage />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              config={config}
              onRefreshConfig={async () => {
                const cfg = await getConfigStatus();
                setConfig(cfg);
              }}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NlpPromptModal
        isOpen={nlpModalOpen}
        onClose={() => setNlpModalOpen(false)}
        onApplyPlan={handleApplyNlpPlan}
        currentMediaContext={currentAsset}
      />

      <ExecutionLogModal
        isOpen={Boolean(activeLogJob)}
        onClose={() => setActiveLogJob(null)}
        job={activeLogJob}
      />
    </div>
  );
}
