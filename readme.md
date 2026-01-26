# VideoStack – Phase 1

VideoStack is a **Dockerized, stateless media-processing backend** built with Node.js and FFmpeg. Phase 1 focuses on **video/audio conversion**, **format changes**, and **resolution scaling**, packaged as a production-ready Docker image suitable for containerized deployment.

---

## Features (Phase 1)

- Video upload and processing
- Resolution scaling (240p, 360p, 480p, 720p, 1080p)
- Audio extraction (MP3 / AAC formats)
- Container format conversion (MP4 - MKV)
- Stateless REST API (no database dependency)
- FFmpeg-powered media processing
- FFmpeg process runs asynchronously
- Temporary files auto-cleaned after response
- Docker containerization with optimized production configuration
- Health check monitoring for deployment orchestration

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js v22.18.0 |
| **Framework** | Express.js |
| **Media Processing** | FFmpeg |
| **File Upload** | Multer |
| **Containerization** | Docker |
| **Architecture** | Stateless REST API |

---

## Project Structure

```
VideoStack/
├── client/                          # Frontend React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
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
│   ├── public/
│   │   └── data/
│   │       ├── clientUploads/       # Temporary upload storage
│   │       └── processed/           # Temporary processed files storage
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── package.json
│   ├── server.js                    # Entry point
│   └── app.js                       # Express configuration
├── .gitignore
└── readme.md
```

## Architecture Overview

```
POST /api/convert (video file + action + params)
    ↓
Multer Middleware (validates, stores temp file)
    ↓
Video Processing Controller (parses action & params)
    ↓
FFmpeg Services (generates args based on action, runs FFmpeg)
    ↓
Streams processed file to client
    ↓
Cleanup Handler (deletes temp files)
```

## 🎬 API Endpoints

### Video Processing

**Endpoint:** `POST /api/convert`

**Request (multipart/form-data):**
```
- file: Video file (MP4, MKV, etc.)
- action: "resize" | "extract-audio" | "convert-format"
- targetFormat: "mp3" | "aac" | "mp4" | "mkv" (depends on action)
- resolution: "240p" | "360p" | "480p" | "720p" | "1080p" (optional, for resize only)
```

**Response:**
- Processed file (streamed directly to client for download)

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@video.mp4" \
  -F "action=resize" \
  -F "resolution=720p" \
  -o output.mp4
```

---

## Docker Deployment

### Prerequisites

- Docker Engine or Docker Desktop

### Build Image

```bash
cd server
docker build -t videostack-server:1.0 .
```

**Build Optimization:**

- Uses `.dockerignore` to exclude unnecessary files

### Run Container

```bash
docker run -d \
  --name videostack-server \
  --env-file .env \
  -p 3000:3000 \
  videostack-server:1.0
```

**Container Features:**

- Stateless operation
- Environment variables injected at runtime
- Port 3000 exposed for API access

### Verify Deployment

```bash
# Check container status
docker ps

# View logs
docker logs videostack-server

# Test API
curl -X GET http://localhost:3000/health
```

---

## Environment Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Performance Considerations

| Operation | Processing Time | File Size Limit |
|-----------|-----------------|-----------------|
| Audio Extraction | 5-30s | 10MB max |
| Video Resize | 30-120s | 10MB max |
| Format Conversion | 5-20s | 10MB max |

**Constraints:**

- Maximum upload size: **10MB** (enforced by Multer)

## Quick Start

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend available at: **http://localhost:5173**

### Backend

```bash
cd server
npm install
npm run dev
```

Backend available at: **http://localhost:3000**

### Production (Docker)

```bash
cd server
docker build -t videostack-server:1.0 .
docker run -d -p 3000:3000 --env-file .env videostack-server:1.0
```

---

## Security

- Input validation on all uploads
- Temporary files auto-deleted after processing
