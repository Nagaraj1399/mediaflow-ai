import React, { useState } from 'react';
import {
  Cpu,
  User,
  Layout,
  Workflow,
  Sparkles,
  Cloud,
  Layers,
  Globe,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ComponentDetail {
  id: string;
  title: string;
  role: string;
  tech: string;
  responsibilities: string[];
  securityNote: string;
}

export const ArchitecturePage: React.FC = () => {
  const [activeComponentId, setActiveComponentId] = useState<string>('gemini');

  const components: Record<string, ComponentDetail> = {
    user: {
      id: 'user',
      title: 'Merchant & Creative Team',
      role: 'Source Media Producer',
      tech: 'Browser / Desktop & Mobile Viewport',
      responsibilities: [
        'Single master media upload (PNG, JPEG, WebP, AVIF, Video)',
        'Natural language intent expression ("Make ready for Instagram & Amazon")',
        'Inspection of differential quality slider and channel variants',
        'One-click CDN copy, download, and catalog distribution',
      ],
      securityNote: 'Zero client-side secrets. Authenticates via session context.',
    },
    react: {
      id: 'react',
      title: 'React 19 SPA (Client Application)',
      role: 'UI & Interactive Canvas',
      tech: 'React 19, TypeScript, Tailwind CSS, Motion',
      responsibilities: [
        'High-speed drag-and-drop ingestion with instant local preview',
        'Interactive 7-node visual pipeline graph with dynamic progress states',
        'Draggable Before/After differential split comparison slider',
        'Local state persistence for instant zero-latency page transitions',
      ],
      securityNote: 'Never bundles Cloudinary API Secret or Gemini API Keys.',
    },
    orchestrator: {
      id: 'orchestrator',
      title: 'Backend API & Pipeline Orchestrator',
      role: 'Secure Full-Stack Node.js Engine',
      tech: 'Express, Node.js, TypeScript, Vite Middleware',
      responsibilities: [
        'Validates media MIME types, payload size bounds, and integrity',
        'Coordinates asynchronous calls to Gemini GenAI and Cloudinary SDK',
        'Translates semantic AI intents into strict Cloudinary transformation strings',
        'Calculates real byte savings and builds observability telemetry logs',
      ],
      securityNote: 'Safely accesses process.env server credentials; handles CORS & proxies.',
    },
    gemini: {
      id: 'gemini',
      title: 'Google Gemini 3.1 Flash / Flash-Lite',
      role: 'Autonomous Semantic Reasoning & Intent Architect',
      tech: '@google/genai TypeScript SDK (Server-Side)',
      responsibilities: [
        'Multi-modal visual inspection: subject detection, lighting, & background analysis',
        'Structured JSON taxonomy output with rigorous schema enforcement',
        'Understands natural language requests and converts to channel recipes',
        'Generates human-readable explanations explaining why transformations were selected',
      ],
      securityNote: 'Invoked strictly from server.ts with User-Agent telemetry and hidden API key.',
    },
    cloudinary: {
      id: 'cloudinary',
      title: 'Cloudinary Media Infrastructure',
      role: 'High-Performance Media Processing & Global Delivery',
      tech: 'Cloudinary SDK v2 & Edge Transformation Engine',
      responsibilities: [
        'Ingests source assets with resource_type: auto and quality audit',
        'Dynamic gravity auto-crop (g_auto:subject, c_fill, c_pad)',
        'Perceptual quality encoding (q_auto:best) and next-gen format conversion (f_auto)',
        'Global low-latency multi-channel edge CDN distribution',
      ],
      securityNote: 'API Secret remains exclusively server-side. Public URLs use secure signatures.',
    },
    outputs: {
      id: 'outputs',
      title: 'Multi-Channel Output Assets',
      role: 'Production Channel Deliverables',
      tech: 'Cloudinary Transformation URLs / AVIF / WebP',
      responsibilities: [
        'Website PDP 16:9 Hero Banner with high-DPI retina rendering',
        'Instagram Feed 1:1 Square with gravity-centered subject lock',
        'TikTok / Instagram Story 9:16 Vertical with tone-matched background padding',
        'Amazon & Marketplace 1:1 Square with 85% frame occupancy pure white padding',
        'Paid Social Ad 4:5 Portrait with adaptive unsharp mask filter',
      ],
      securityNote: 'Directly embeddable across e-commerce storefronts and advertising networks.',
    },
  };

  const active = components[activeComponentId] || components['gemini'];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>SYSTEM ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Intelligent Decoupled Architecture
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          How MediaFlow AI pairs Gemini AI semantic reasoning with Cloudinary media processing infrastructure.
        </p>
      </div>

      {/* Interactive System Flow Diagram */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="text-xs font-mono text-slate-400">
            CLICK ANY COMPONENT NODE TO INSPECT ITS RESPONSIBILITY & DATA CONTRACT
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            Interactive Schema
          </span>
        </div>

        {/* Diagram Flow */}
        <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
          {/* Node 1: User */}
          <button
            onClick={() => setActiveComponentId('user')}
            className={`w-72 p-3.5 rounded-xl border text-center transition-all ${
              activeComponentId === 'user'
                ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-200">
              <User className="w-4 h-4 text-blue-400" />
              <span>MERCHANT / CREATIVE USER</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Single Upload + Natural Language Intent
            </div>
          </button>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Node 2: React Web App */}
          <button
            onClick={() => setActiveComponentId('react')}
            className={`w-80 p-3.5 rounded-xl border text-center transition-all ${
              activeComponentId === 'react'
                ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-200">
              <Layout className="w-4 h-4 text-indigo-400" />
              <span>REACT 19 WEB APP (CLIENT)</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              UI, Visual Pipeline Graph, Before/After Slider
            </div>
          </button>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Node 3: Orchestrator */}
          <button
            onClick={() => setActiveComponentId('orchestrator')}
            className={`w-96 p-4 rounded-xl border text-center transition-all ${
              activeComponentId === 'orchestrator'
                ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
              <Workflow className="w-4 h-4 text-blue-400" />
              <span>BACKEND API & PIPELINE ORCHESTRATOR</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Secure Gateway · Translates AI Intent → Cloudinary Operations
            </div>
          </button>

          {/* Split Branches: Gemini & Cloudinary */}
          <div className="w-full flex justify-center items-center gap-8 pt-2">
            <div className="flex-1 flex flex-col items-center">
              <ArrowDown className="w-4 h-4 text-purple-400" />
              <button
                onClick={() => setActiveComponentId('gemini')}
                className={`w-full p-4 rounded-xl border text-center transition-all mt-2 ${
                  activeComponentId === 'gemini'
                    ? 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-500'
                    : 'border-slate-800 bg-slate-900/60 hover:border-purple-900/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>GOOGLE GEMINI AI</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Gemini 3.1 Flash · Semantic Reasoning
                </div>
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <ArrowDown className="w-4 h-4 text-blue-400" />
              <button
                onClick={() => setActiveComponentId('cloudinary')}
                className={`w-full p-4 rounded-xl border text-center transition-all mt-2 ${
                  activeComponentId === 'cloudinary'
                    ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-900/60 hover:border-blue-900/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-300">
                  <Cloud className="w-4 h-4 text-blue-400" />
                  <span>CLOUDINARY ENGINE</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Transforms, Gravity, Auto-Format & CDN
                </div>
              </button>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Node 5: Output Channel Deliverables */}
          <button
            onClick={() => setActiveComponentId('outputs')}
            className={`w-80 p-3.5 rounded-xl border text-center transition-all ${
              activeComponentId === 'outputs'
                ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
              <Layers className="w-4 h-4" />
              <span>7 CHANNEL DELIVERABLES</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Website, Instagram, Stories, Amazon, Ads, Mobile, Thumbnails
            </div>
          </button>
        </div>
      </div>

      {/* Deep-Dive Component Inspector Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase">
              COMPONENT SPECIFICATION
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {active.title}
            </h3>
            <p className="text-xs text-slate-400">{active.role}</p>
          </div>

          <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            {active.tech}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <span className="font-mono text-slate-400 block font-semibold">
              PRIMARY RESPONSIBILITIES
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {active.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-mono text-blue-400 block font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                SECURITY & SECRET ISOLATION
              </span>
              <p className="text-slate-400 leading-relaxed">
                {active.securityNote}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/30 text-slate-400 leading-relaxed">
              <span className="text-slate-300 font-semibold block mb-0.5">
                Hackathon Key Takeaway:
              </span>
              AI does the thinking (Gemini). Cloudinary does the media processing. The user receives production-ready assets without manual friction.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
