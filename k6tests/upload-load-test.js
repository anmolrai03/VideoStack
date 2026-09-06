import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';

// Open sample video file as binary
const videoFile = open('../sample.mp4', 'b');

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 VUs
    { duration: '1m', target: 20 },  // Ramp up to 20 VUs
    { duration: '30s', target: 0 },  // Ramp down to 0 VUs
  ],
};

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: 'test@user1.com',
      password: 'TestUser1',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const loginCheck = check(loginRes, {
    'login successful (200)': (r) => r.status === 200,
  });

  if (!loginCheck) {
    throw new Error(`Setup login failed with status ${loginRes.status}: ${loginRes.body}`);
  }

  // Extract accessToken from cookie
  const cookie = loginRes.cookies['accessToken']
    ? loginRes.cookies['accessToken'][0].value
    : null;

  return { token: cookie };
}

export default function (data) {
  const payload = {
    title: `Load Test Video - VU ${__VU} - Iter ${__ITER}`,
    description: 'k6 load test upload',
    video: http.file(videoFile, 'sample.mp4', 'video/mp4'),
  };

  const params = {
    headers: {
      Cookie: `accessToken=${data.token}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/videos/upload`, payload, params);

  check(res, {
    'status is 202': (r) => r.status === 202,
    'has videoId': (r) => {
      try {
        const json = r.json();
        return json && json.data && json.data.videoId !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
