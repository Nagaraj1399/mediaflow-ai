# 🚀 MediaFlow AI

> **One Upload. Intelligent Pipeline. Every Channel Ready.**  
> Autonomous multi-channel media processing platform powered by **Cloudinary** and **Google Gemini AI**.

---

## 🌟 Executive Overview

In modern e-commerce and digital marketing, a single product photograph must be repurposed into dozens of channel-specific assets:
- **E-Commerce PDP**: 16:9 retina hero banners with focal subject preservation
- **Instagram Feed**: 1:1 square crop with gravity-centered foreground locks
- **Instagram / TikTok Stories**: 9:16 vertical format with tone-matched blur padding
- **Marketplace (Amazon / Shopify)**: 1:1 square with 85% frame occupancy and pure white background padding
- **Paid Social Ads**: 4:5 portrait formats with unsharp mask enhancement and modern AVIF/WebP compression

Historically, this required tedious manual cropping in Photoshop, repetitive transcoding, and disjointed CDN uploads.

**MediaFlow AI** eliminates this friction. By pairing **Google Gemini AI** (`gemini-3.1-flash-lite`) multimodal computer vision with **Cloudinary's dynamic edge transformation infrastructure**, a merchant uploads **one high-resolution master asset**, expresses optional natural language directives, and receives an autonomous, fully optimized multi-channel suite in seconds with measurable 70–80% bandwidth reductions.

---

## 📐 System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                  USER INTERFACE                                   |
|                React 19 SPA · TypeScript · Tailwind CSS · Motion UI               |
|                                                                                   |
|  [Ingestion & Dropzone] -> [Live Before/After Slider] -> [7-Node Pipeline Graph]  |
|  [Channel Variant Grid] -> [Natural Language Modal]   -> [Analytics Dashboard]   |
+------------------------------------------+----------------------------------------+
                                           |
                                HTTP / REST API (JSON)
                                           |
+------------------------------------------v----------------------------------------+
|                     BACKEND ORCHESTRATOR & PROXY (server.ts)                      |
|                  Node.js · Express · Vite Middleware · Strict Auth                |
|                                                                                   |
|  - Rate Limiting & Timeout Guards (callWithTimeout)                               |
|  - Real Byte-Level HTTP Verification (Range requests & Content-Length probes)     |
|  - Dual Mode Engine: Live Cloudinary Sync vs Interactive Studio Mode              |
|  - Zero-Trust Secret Isolation: process.env hidden from client bundles            |
+---------------------+---------------------------------------+---------------------+
                      |                                       |
       @google/genai SDK (v0.1.1)                   Cloudinary SDK (v2.0)
                      |                                       |
+---------------------v----------------+    +-----------------v---------------------+
|        GOOGLE GEMINI AI ENGINE       |    |     CLOUDINARY MEDIA INFRASTRUCTURE   |
|   gemini-3.1-flash-lite (Multimodal) |    |   Edge Dynamic Transformation Engine  |
|                                      |    |                                       |
| - Multimodal Foreground Extraction   |    | - Intelligent Subject Crop (g_auto)   |
| - Subject & Geometry Detection       |    | - Aspect Padding & Blurs (c_pad, b_*) |
| - Lighting & Blur Evaluation         |    | - Auto Format & Quality (f_auto,q_*)  |
| - NLP Directive -> Channel Pipeline  |    | - Global Edge CDN Distribution        |
+--------------------------------------+    +---------------------------------------+
```

### Architecture Highlights

1. **Autonomous Semantic Vision Layer (Google Gemini)**:
   - Inspects image bytes at the perceptual level.
   - Detects subject bounding boxes, lighting geometry, depth of field, and background characteristics.
   - Emits structured JSON schemas enforcing quality scores, blur ratings, and channel recommendations.
2. **Deterministic Edge Transformation Layer (Cloudinary)**:
   - Compiles semantic intents into deterministic Cloudinary URL transformation strings (`c_fill,g_auto,w_1080,h_1080/q_auto,f_auto`).
   - Executes dynamic face/subject tracking, background padding, and next-generation format transcoding (AVIF / WebP) at the CDN edge.
3. **Observability & Verification Layer**:
   - Every generated URL is validated via server-side HTTP probes.
   - Measures exact byte sizes and load latencies, computing real-world bandwidth reductions (typically 75%+ savings).

---

## ⚡ Core Features

| Feature | Description |
| :--- | :--- |
| **Multimodal Vision Analysis** | Gemini 3.1 Flash analyzes subject, category, lighting, and blur in <2 seconds. |
| **Autonomous 7-Node Pipeline** | Visual step-by-step pipeline execution graph showing each transformation phase. |
| **Natural Language Pipeline Builder** | Describe your target (e.g. *"Create a TikTok story and an Amazon compliant photo"*); Gemini generates the Cloudinary recipe. |
| **Interactive Before/After Slider** | Draggable split-view slider comparing master media against channel-optimized variants. |
| **Channel Presets** | Instant presets for Website Hero, Instagram Post, Instagram Story, Marketplace, Paid Ads, and Thumbnails. |
| **Real CDN Verification** | Live status probes verify HTTP 200, MIME type, byte weight, and latency for every generated asset. |
| **Live Bandwidth Analytics** | Tracks cumulative megabytes processed, bandwidth reduction percentages, and global CDN delivery stats. |
| **Dual Operational Modes** | **Cloudinary Live Production Sync** (using verified API keys) and **Interactive Studio Mode** (instant local evaluation with full Gemini AI vision). |

---

## 🔌 API Endpoints Reference

All API routes are served securely through Express proxy handlers in `server.ts`:

### Media & Pipeline Operations

- **`POST /api/upload-media`**  
  Ingests master image or video (base64 or local preset). In Live Mode, executes a signed Cloudinary upload; in Studio Mode, registers the asset into the local pipeline registry.
  
- **`POST /api/analyze-media`**  
  Performs multimodal computer vision using Google Gemini (`gemini-3.1-flash-lite`). Accepts `base64Data` or `samplePath` and returns structured taxonomy, quality scores, and channel recipes.

- **`POST /api/build-nlp-pipeline`**  
  Accepts a natural language user prompt (e.g., *"Make ready for Pinterest and square ads"*) and converts it into a multi-step Cloudinary execution plan.

- **`POST /api/execute-pipeline`**  
  Executes transformation sequences against Cloudinary, calculates byte savings, probes URLs for HTTP verification, and creates a historical execution job.

### Data & State Queries

- **`GET /api/media-assets`**  
  Retrieves cataloged media assets with all channel variants and metadata.

- **`GET /api/pipeline-jobs`**  
  Returns pipeline execution logs with telemetry details, step timings, and status badges.

- **`GET /api/analytics`**  
  Returns aggregate operational statistics: bandwidth saved, CDN requests, average reduction percentage, and channel distribution.

### System & Connectivity

- **`GET /api/config-status`**  
  Returns real-time health and connectivity status for Cloudinary and Google Gemini AI.

- **`POST /api/test-cloudinary`**  
  Validates credentials via `cloudinary.api.ping()` and a signed test upload/destroy cycle.

- **`POST /api/toggle-demo-mode`**  
  Toggles between Interactive Studio Mode and Cloudinary Live Sync Mode.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** v18+ or v20+
- **Google Gemini API Key** (available from [Google AI Studio](https://aistudio.google.com/))
- **Cloudinary Account** *(optional for local testing; required for live cloud sync)*

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/mediaflow-ai.git
   cd mediaflow-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Fill in your configuration:
   ```env
   # Google Gemini API Key (Required for AI Vision & Pipeline Planning)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Cloudinary Credentials (Optional for Studio Mode; Required for Live Sync)
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   CLOUDINARY_UPLOAD_PRESET=
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔒 Security & Privacy

- **Zero Client-Side Secrets**: Client bundles never expose `CLOUDINARY_API_SECRET` or `GEMINI_API_KEY`. All third-party interactions are brokered via backend API routes.
- **Input Validation**: Upload payloads enforce strict MIME type checks (`image/*`, `video/*`) and payload limits (60MB).
- **Graceful Fault Tolerance**: Automatic model fallback (`gemini-3.1-flash-lite` → `gemini-flash-latest`) ensures high availability under traffic spikes or quota constraints.

---

## 📄 License

MIT License. Designed and built for autonomous multi-channel media operations.
