import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';
const videoFile = open('../sample.mp4', 'b');

// Staircase pattern: hold at each step long enough to see stable behavior,
// then step up. Watch WHICH step the failures start appearing at.
export const options = {
  stages: [
    { duration: '20s', target: 10 },  // step 1
    { duration: '20s', target: 10 },  // hold
    { duration: '20s', target: 25 },  // step 2
    { duration: '20s', target: 25 },  // hold
    { duration: '20s', target: 50 },  // step 3
    { duration: '20s', target: 50 },  // hold
    { duration: '20s', target: 75 },  // step 4
    { duration: '20s', target: 75 },  // hold
    { duration: '20s', target: 0 },   // ramp down
  ],
  thresholds: {
    // Test auto-marks as failed once error rate crosses 5% — a clear, visible flag
    http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: false }],
  },
};

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: 'test@user1.com', password: 'TestUser1' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  const cookie = loginRes.cookies['accessToken']
    ? loginRes.cookies['accessToken'][0].value
    : null;
  return { token: cookie };
}

export default function (data) {
  const payload = {
    title: `Stress Test - VU ${__VU} - Iter ${__ITER}`,
    description: 'k6 stress test upload',
    video: http.file(videoFile, 'sample.mp4', 'video/mp4'),
  };
  const params = { headers: { Cookie: `accessToken=${data.token}` } };

  const res = http.post(`${BASE_URL}/api/videos/upload`, payload, params);

  check(res, { 'status is 202': (r) => r.status === 202 });

  sleep(1);
}