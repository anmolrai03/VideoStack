# VideoStack

VideoStack is a Dockerized video-upload and streaming application for clients that need authenticated video uploads, background transcoding, adaptive HLS output, and status tracking. The React client provides the upload and playback experience; the Node.js API persists metadata in MongoDB, uses BullMQ and Redis to schedule work, and runs FFmpeg in a separate worker process before publishing HLS output through Cloudinary.

## Architecture / Pipeline Overview

The primary upload pipeline is:

1. `client/src` sends an authenticated multipart request to `POST /api/videos/upload`.
2. `server/middlewares/multer.middleware.js` validates the MIME type and stores the upload under `public/data/clientUploads`.
3. `server/controller/videos.controller.js` validates the media with `server/services/ffmpegServices/validateMedia.js`, creates a MongoDB video record, and adds a `generate-hls-video` job to `server/queues/video.queue.js`.
4. BullMQ uses Redis from `server/configs/redis.js` as the queue and job-state backend.
5. `server/workers/video.worker.js` updates the record to `PROCESSING`, builds the HLS FFmpeg arguments, and invokes `server/services/ffmpegServices/ffmpegRunner.js`.
6. FFmpeg writes the HLS master playlist and variant segments under `public/data/processed/<videoId>`.
7. The worker uploads the HLS output through `server/services/storageServices/uploadToObjectStorage.js` and the Cloudinary configuration in `server/configs/cloudinary.js`.
8. The worker stores the resulting playlist URL and changes the MongoDB status to `READY`. Failures update the status to `FAILED` with `failureReason`.
9. The client requests the playlist URL through `GET /api/videos/stream/:videoId` and plays the HLS stream with `hls.js`.

The legacy synchronous conversion endpoint remains available at `POST /api/convert`. It is implemented by `server/controller/videoProcessing.controller.js`, which validates the upload, generates conversion arguments with `argsGenerator.js`, runs FFmpeg, streams the result, and removes temporary files.

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- `hls.js`
- `react-hook-form`

### Backend

- Node.js
- Express 5
- Multer for multipart uploads
- Mongoose and MongoDB
- Cookie-based JWT authentication

### Queue and processing

- BullMQ
- Redis via ioredis
- FFmpeg invoked with `child_process.spawn`
- HLS packaging with multiple video variants

### Storage

- MongoDB for users, video metadata, status, and playlist URLs
- Cloudinary for HLS output when `SKIP_CLOUD_UPLOAD=false`
- Local shared media volume for upload and processing files

### Testing

- Vitest
- V8 coverage
- Supertest
- MongoDB Memory Server
- Mocked FFmpeg, BullMQ, Redis, Cloudinary, and filesystem boundaries in unit tests

### Containerization

- Docker
- Docker Compose
- `docker-compose.yml` for local MongoDB, Redis, API, and worker services
- `docker-compose.cloud.yml` for cloud database and Redis deployments

## Setup and Installation

### Prerequisites

- Docker Desktop with Docker Compose
- Node.js and npm for local client development or test execution
- An FFmpeg-capable server image is built by `server/Dockerfile`

### Environment configuration

Copy `server/.env.example` to `server/.env` and set the values below:

| Variable | Purpose |
|---|---|
| `PORT` | Host port exposed by the API; Compose maps it to container port 3000. |
| `NODE_ENV` | Selects development or production Redis behavior and runtime settings. |
| `CORS_ORIGIN` | Allowed browser origin for credentialed requests. |
| `MONGODB_URL` | MongoDB connection string used by `server/configs/db.js`. |
| `JWT_SECRET_KEY` | Secret used to sign and verify access-token cookies. |
| `REDIS_URL` | Redis connection string; use a TLS `rediss://` URL for hosted Redis. |
| `REDIS_HOST` and `REDIS_PORT` | Optional Redis settings retained for environment configuration. |
| `SKIP_CLOUD_UPLOAD` | When `true`, the worker uses a simulated playlist URL instead of calling Cloudinary. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `CDN_URL` | Optional CDN base URL for deployment configuration. |
| `MAX_FILE_SIZE_BYTES` | Optional Multer upload limit; defaults to 100 MiB when unset. |

Do not commit `server/.env` or real credentials. The repository includes `server/.env.example` as the configuration template.

### Start with Docker Compose

```bash
docker compose up --build
```

This starts MongoDB, Redis, the API, and the background worker. The API is available at `http://localhost:3000`; the health endpoint is `GET /health`.

For local frontend development:

```bash
cd client
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

To run the backend or worker outside Compose:

```bash
cd server
npm install
npm run dev
npm run dev:workers
```

Run the API and worker as separate processes when using this mode. Redis and MongoDB must be reachable through the configured environment variables.

## API Endpoints Reference

`POST /api/convert` is unauthenticated. The request is `multipart/form-data` with a `video` file and conversion fields consumed by `argsGenerator.js`: `action` (`video-resize`, `audio-extract`, or `format-convert`), `targetFormat`, and `resolution` for resize operations.

All routes under `/api/videos` are protected by `auth.middleware.js` because `app.js` mounts the route with `authMiddleware`.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/videos/upload` | Required | Validate and queue a video upload. Multipart field: `video`; body fields: `title`, optional `description`. Returns `202` when queued. |
| `GET` | `/api/videos/` | Required | Return the public `READY` video feed. |
| `GET` | `/api/videos/stream/:videoId` | Required | Return the stored HLS playlist URL for a ready video. |
| `GET` | `/api/videos/user` | Required | Return the authenticated user's videos; optional `status` query filter. |
| `DELETE` | `/api/videos/user/delete/:videoId` | Required | Delete an owned video record. |
| `GET` | `/api/videos/user/status/:videoId` | Required | Return status, metadata, thumbnail, and failure reason for an owned video. |
| `POST` | `/api/auth/login` | Public | Authenticate with email and password and set the `accessToken` cookie. |
| `POST` | `/api/auth/register` | Public | Register a user. |
| `GET` | `/api/auth/logout` | Required | Clear the access-token cookie. |
| `POST` | `/api/auth/verify-password` | Required | Verify the authenticated user's password. |
| `GET` | `/api/auth/me` | Required | Return authenticated user details. |
| `GET` | `/health` | Public | Report Redis and MongoDB connectivity. |

## Testing

From the `server` directory, run:

```bash
npx vitest run --coverage
```

The current run passes 87 tests in 11 test files. Overall coverage is 70.43% statements and 71.12% lines. The detailed file-by-file report is available in [docs/TEST_COVERAGE.md](docs/TEST_COVERAGE.md). The suite uses mocks and in-memory test boundaries, so it does not require external MongoDB, Redis, Cloudinary, or FFmpeg services.

## Performance Testing

The archived k6 results measure API resilience for authenticated upload requests. They are not a benchmark of completed FFmpeg throughput because the worker is asynchronous and the tests measure the HTTP enqueue response.

The archived result files and reproducible k6 scripts are available in the [`/benchmarks`](benchmarks/) directory.

### API resilience

| Test | Load | Iterations | Failed requests | Average latency | p95 latency | Maximum latency |
|---|---:|---:|---:|---:|---:|---:|
| Small load | 5 VUs for 60 seconds | 107 | 0.00% | 237.96 ms | 639.21 ms | 1.71 s |
| Staircase stress | Up to 75 VUs for 3 minutes | 4,318 | 0.00% | 487.43 ms | 1.32 s | 2.13 s |

### Worker throughput configuration

| Component | Current configuration | Interpretation |
|---|---|---|
| BullMQ queue | `video-hls-store-processing` | Redis-backed job queue used by the API and worker. |
| Worker concurrency | `1` | One HLS FFmpeg job is processed at a time per worker process. |
| Measured completed-job throughput | Not captured by the archived k6 reports | The available tests record enqueue-response performance, not worker completion time. |

### Scaling limitation

The API and worker use the same local `public/data` paths. Docker Compose provides a shared volume for one deployment, but multiple hosts require shared durable storage or an object-storage staging design. Without that change, a worker on another host may not be able to read the uploaded input or the generated HLS files. Redis and MongoDB are shared services, but they do not solve local filesystem visibility.

## Known Limitations / Roadmap

- Worker concurrency is fixed at `1` per worker process; completion throughput needs a dedicated end-to-end benchmark.
- Shared local media storage limits multi-host horizontal scaling.
- Cloudinary upload is optional in local and load-test configurations; production deployments must configure credentials and validate the resulting CDN behavior.
- There is no CI/CD pipeline in the repository.
- There is no production deployment manifest or infrastructure-as-code configuration in the repository.
- The synchronous `/api/convert` endpoint remains separate from the queued HLS upload flow.
- HLS output and temporary files require an explicit retention and cleanup policy for production use.

