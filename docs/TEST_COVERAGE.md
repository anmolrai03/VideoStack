# Test Coverage

Coverage was generated from the server test suite with `npx vitest run --coverage`. The current run completed 87 tests across 11 test files. Percentages below are reported by Vitest's V8 provider.

## Coverage Summary

| File | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| **All files** | **70.43% (405/575)** | **65.06% (162/249)** | **60.93% (39/64)** | **71.12% (404/568)** |
| `server/app.js` | 50% (14/28) | 0% (0/10) | 20% (1/5) | 51.85% (14/27) |
| `server/controller/auth.controller.js` | 97% (97/100) | 88.09% (37/42) | 100% (7/7) | 97% (97/100) |
| `server/controller/videoProcessing.controller.js` | 100% (24/24) | 82.35% (14/17) | 100% (2/2) | 100% (24/24) |
| `server/controller/videos.controller.js` | 58.44% (45/77) | 55.55% (20/36) | 50% (3/6) | 58.44% (45/77) |
| `server/middlewares/auth.middleware.js` | 91.66% (11/12) | 83.33% (5/6) | 100% (1/1) | 91.66% (11/12) |
| `server/middlewares/errorHandler.middleware.js` | 100% (42/42) | 90.9% (30/33) | 100% (2/2) | 100% (41/41) |
| `server/middlewares/multer.middleware.js` | 50% (4/8) | 30% (3/10) | 0% (0/1) | 50% (4/8) |
| `server/services/ffmpegServices/argsGenerator.js` | 16.12% (5/31) | 0% (0/16) | 0% (0/1) | 16.12% (5/31) |
| `server/services/ffmpegServices/ffmpegRunner.js` | 80.95% (17/21) | 55.55% (5/9) | 83.33% (5/6) | 85% (17/20) |
| `server/services/ffmpegServices/testHLS.js` | 0% (0/3) | 100% (0/0) | 100% (0/0) | 0% (0/3) |
| `server/services/ffmpegServices/validateMedia.js` | 82.14% (23/28) | 75% (6/8) | 75% (6/8) | 82.14% (23/28) |
| `server/services/ffmpegServices/videoPresets.js` | 0% (0/10) | 100% (0/0) | 0% (0/1) | 0% (0/10) |
| `server/services/jwt/jwtServices.js` | 69.56% (16/23) | 50% (3/6) | 100% (3/3) | 69.56% (16/23) |
| `server/services/storageServices/uploadToObjectStorage.js` | 0% (0/26) | 0% (0/4) | 0% (0/6) | 0% (0/24) |
| `server/utils/AppError.js` | 100% (5/5) | 100% (1/1) | 100% (1/1) | 100% (5/5) |
| `server/utils/cleanUpHandler.js` | 0% (0/7) | 0% (0/2) | 0% (0/1) | 0% (0/6) |
| `server/utils/debugLog.js` | 40% (2/5) | 28.57% (2/7) | 100% (1/1) | 40% (2/5) |
| `server/utils/formatDate.js` | 100% (4/4) | 100% (0/0) | 100% (1/1) | 100% (4/4) |
| `server/utils/responseHandler.js` | 100% (4/4) | 100% (2/2) | 100% (2/2) | 100% (4/4) |
| `server/utils/validateData.js` | 100% (49/49) | 100% (30/30) | 100% (2/2) | 100% (49/49) |
| `server/workers/index.js` | 0% (0/9) | 100% (0/0) | 0% (0/1) | 0% (0/9) |
| `server/workers/video.worker.js` | 72.88% (43/59) | 40% (4/10) | 33.33% (2/6) | 74.13% (43/58) |

## Module Notes

### Controllers

`auth.controller.js` is highly covered, including registration, login, cookie handling, logout, password verification, and user-detail paths. `videoProcessing.controller.js` is now fully covered for statements, lines, and functions, with the remaining branch gaps limited to fallback expressions such as optional error text. Its tests cover missing uploads, corrupt files, malformed conversion arguments, successful FFmpeg execution, typed FFmpeg failures, unexpected failures, download errors, and cleanup. `videos.controller.js` is lower because several feed, status, deletion, and database edge paths remain outside the current focused controller tests; the upload and queue failure paths are covered.

### Middlewares

Authentication and centralized error handling are well covered. Multer has lower coverage because its filesystem setup and callback behavior are exercised indirectly by integration boundaries rather than by a dedicated middleware test suite. Its file-size and MIME rejection rules remain important candidates for future focused tests.

### Workers

`video.worker.js` covers successful processing, failed FFmpeg processing, database failure-state updates, cleanup, and BullMQ failure-event handling. The uncovered branches include optional Cloudinary bypass behavior, event metrics, and defensive database-error handling. `workers/index.js` is a process bootstrap module and is not imported by the unit suite to avoid starting a real worker or Redis connection.

### Services

The FFmpeg runner, media validator, JWT service, and response utilities have meaningful unit coverage. `argsGenerator.js` has low coverage because the controller tests mock it; its action-specific argument combinations should be tested independently. `uploadToObjectStorage.js` is intentionally mocked in worker tests because exercising it would require Cloudinary credentials and external network calls. `videoPresets.js` and `testHLS.js` are utility or manual-run paths rather than application entry points, so they are lower priority for the current unit suite.

### Utilities and configuration

Small pure utilities such as `AppError`, `formatDate`, `responseHandler`, and `validateData` are covered. Cleanup and debug helpers are mocked at higher-level boundaries; their direct filesystem and logging behavior can be covered separately if production cleanup diagnostics become a priority. Bootstrap and configuration modules are intentionally not executed in unit tests because they establish external connections or long-running processes.

## Reproduce

From the `server` directory:

```bash
npx vitest run --coverage
```
