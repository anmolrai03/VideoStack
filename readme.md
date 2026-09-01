# VideoStack

**A Dockerized, stateless media-processing backend built with Node.js and FFmpeg — handling video/audio conversion, format changes, and resolution scaling through a clean REST API.**

![Node](https://img.shields.io/badge/Node.js-v22.18.0-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-powered-007808?logo=ffmpeg&logoColor=white)
![Status](https://img.shields.io/badge/status-Phase%201%20complete-brightgreen)

---

<!-- 
## Demo

Replace this with an actual GIF: record a short screen capture of uploading a file,
     selecting an action (resize/extract-audio/convert-format), and downloading the result.
     Tools: ScreenToGif (Windows), Kap (Mac), or peek (Linux). Keep it under 10-15 seconds.

![VideoStack demo](docs/demo.gif)

*Upload → select operation → processed file streams back, all in one request.*

---
 -->

## Table of Contents

- [Why This Project](#why-this-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [Performance & Constraints](#performance--constraints)
- [Security](#security)
- [Roadmap](#roadmap)

---

## Why This Project

Most media-processing demos wrap FFmpeg in a script and call it done. VideoStack is built as an actual **stateless service** — no database, no persistent storage, no shared session state — so it can scale horizontally behind a load balancer with zero coordination between instances. Every request is self-contained: file in, FFmpeg processes it asynchronously, processed file streams out, temp files are cleaned up automatically.

This was a deliberate design choice to mirror how production media pipelines (think transcoding services at YouTube/Netflix scale, just far smaller) separate stateless processing workers from persistent storage layers — which is also why Phase 2 introduces a queue (BullMQ/Redis) to decouple ingestion from processing entirely.

## Features

**Phase 1 (current):**
- Video upload and processing via a single REST endpoint
- Resolution scaling — 240p, 360p, 480p, 720p, 1080p
- Audio extraction — MP3 / AAC
- Container format conversion — MP4 ↔ MKV
- Fully stateless REST API — no database dependency
- Asynchronous FFmpeg execution (non-blocking)
- Automatic temp file cleanup after every response
- Production-optimized Docker image
- Health-check endpoint for orchestration (Kubernetes/Swarm-ready)

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js v22.18.0 |
| Framework | Express.js |
| Media Processing | FFmpeg |
| File Upload | Multer |
| Frontend | React + Vite + Tailwind CSS |
| Containerization | Docker |
| Architecture | Stateless REST API |

## Architecture

```
POST /api/convert (video file + action + params)
        │
        ▼
Multer Middleware (validates, stores temp file)
        │
        ▼
Video Processing Controller (parses action & params)
        │
        ▼
FFmpeg Services (generates args based on action, runs FFmpeg)
        │
        ▼
Streams processed file directly to client
        │
        ▼
Cleanup Handler (deletes temp files)
```

**Project structure:**

```
VideoStack/
├── client/                          # React frontend (Vite + Tailwind)
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── server/                          # Express backend (containerized)
│   ├── controller/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   │   └── ffmpegServices/
│   │       ├── argsGenerator.js
│   │       ├── ffmpegRunner.js
│   │       └── videoPresets.js
│   ├── utils/
│   ├── public/data/
│   │   ├── clientUploads/           # Temporary upload storage
│   │   └── processed/               # Temporary processed output
│   ├── Dockerfile
│   ├── server.js                    # Entry point
│   └── app.js                       # Express configuration
└── readme.md
```

## API Reference

### `POST /api/convert`

**Request** (`multipart/form-data`):

| Field | Type | Values | Notes |
|---|---|---|---|
| `file` | file | MP4, MKV, etc. | required |
| `action` | string | `resize` \| `extract-audio` \| `convert-format` | required |
| `targetFormat` | string | `mp3` \| `aac` \| `mp4` \| `mkv` | required for `extract-audio` / `convert-format` |
| `resolution` | string | `240p`…`1080p` | required for `resize` only |

**Response:** processed file, streamed directly for download.

**Example:**

```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@video.mp4" \
  -F "action=resize" \
  -F "resolution=720p" \
  -o output.mp4
```

### `GET /health`

Returns service health status for deployment orchestration.

## Getting Started

**Frontend:**
```bash
cd client
npm install
npm run dev
```
Runs at `http://localhost:5173`

**Backend:**
```bash
cd server
npm install
npm run dev
```
Runs at `http://localhost:3000`

**Environment variables** (`server/.env`):
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Docker Deployment

**Prerequisites:** Docker Engine or Docker Desktop

```bash
# Build
cd server
docker build -t videostack-server:1.0 .

# Run
docker run -d \
  --name videostack-server \
  --env-file .env \
  -p 3000:3000 \
  videostack-server:1.0

# Verify
docker ps
docker logs videostack-server
curl http://localhost:3000/health
```

Image is built with a `.dockerignore` to keep the production image lean, and runs statelessly — environment variables injected at runtime, no volumes required for operation.

## Performance & Constraints

| Operation | Processing Time | File Size Limit |
|-----------|-----------------|-----------------|
| Audio Extraction | 5–30s | 10MB max |
| Video Resize | 30–120s | 10MB max |
| Format Conversion | 5–20s | 10MB max |

Upload size is capped at **10MB**, enforced by Multer.

## Security

- Input validation on all uploads
- Temporary files auto-deleted after every response — no orphaned data on disk

## Roadmap

- [ ] Async job queue with BullMQ + Redis (decouple upload from processing)
- [ ] HLS packaging for adaptive streaming
- [ ] Object storage + CDN delivery integration
- [ ] Vitest/Supertest test coverage for FFmpeg service layer
- [ ] Raise upload size limit via chunked/resumable uploads

---

**Author:** Anmol Rai — [GitHub](https://github.com/anmolrai03) · [LinkedIn](https://linkedin.com/in/anmol-rai-4203b6285)
