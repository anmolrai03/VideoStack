import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:3000";
const videoFile = open("./sample.mp4", "b");

// Much smaller test: ramps to just 5 virtual users over 30s, holds for 30s, ramps down.
// Good for confirming things work and getting a clean, small dataset first.
export const options = {
  stages: [
    { duration: "15s", target: 5 }, // ramp up to 5 fake users
    { duration: "30s", target: 5 }, // hold steady at 5 for 30s
    { duration: "15s", target: 0 }, // ramp down
  ],
};

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: "test@user1.com", password: "TestUser1" }),
    { headers: { "Content-Type": "application/json" } },
  );

  check(loginRes, { "login successful (200)": (r) => r.status === 200 });

  const cookie = loginRes.cookies["accessToken"]
    ? loginRes.cookies["accessToken"][0].value
    : null;

  return { token: cookie };
}

export default function (data) {
  const payload = {
    title: `Small Test - VU ${__VU} - Iter ${__ITER}`,
    description: "k6 small load test upload",
    video: http.file(videoFile, "sample.mp4", "video/mp4"),
  };

  const params = { headers: { Cookie: `accessToken=${data.token}` } };

  const res = http.post(`${BASE_URL}/api/videos/upload`, payload, params);

  check(res, {
    "status is 202": (r) => r.status === 202,
  });

  sleep(2); // slightly longer pause so this stays gentle
}
