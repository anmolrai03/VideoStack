import { describe, it, expect, beforeEach } from "vitest";

import getAllowedOrigins from "../../constants/appCORS.js";

describe("testing getAllowedOrigins()", () => {
  beforeEach(() => {
    delete process.env.CORS_ORIGIN;
  });

  it("should throw an error if env file do not have CORS_ORIGIN", () => {
    delete process.env.CORS_ORIGIN;

    expect(() => getAllowedOrigins()).toThrow(
      "CORS_ORIGIN is not configured in environment variables.",
    );
  });

  it("should return the list of origins", () => {
    process.env.CORS_ORIGIN =
      "http://localhost:5173, yourother api urls, another";

    const results = getAllowedOrigins();

    expect(results).toEqual([
      "http://localhost:5173",
      "yourother api urls",
      "another",
    ]);
  });
});
