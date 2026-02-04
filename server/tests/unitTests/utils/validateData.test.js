import { describe, it, expect } from "vitest";
import { checkEmail, checkPassword } from "../../../utils/validateData.js";

describe("checkPassword", () => {
  it("fails if password is missing", () => {
    const result = checkPassword();
    expect(result.status).toBe(false);
  });

  it("fails if password is not a string", () => {
    const result = checkPassword(12345678);
    expect(result.status).toBe(false);
  });

  it("fails if password is shorter than 8 characters", () => {
    const result = checkPassword("Ab1");
    expect(result.status).toBe(false);
  });

  it("fails if password has no uppercase letter", () => {
    const result = checkPassword("password1");
    expect(result.status).toBe(false);
  });

  it("fails if password has no lowercase letter", () => {
    const result = checkPassword("PASSWORD1");
    expect(result.status).toBe(false);
  });

  it("fails if password has no number", () => {
    const result = checkPassword("Password");
    expect(result.status).toBe(false);
  });

  it("passes for a valid password", () => {
    const result = checkPassword("Password1");
    expect(result.status).toBe(true);
    expect(result.errorMessage).toBe("");
  });
});

describe("checkEmail", () => {
  it("fails if email is missing", () => {
    const result = checkEmail();
    expect(result.status).toBe(false);
  });

  it("fails if email is not a string", () => {
    const result = checkEmail(123);
    expect(result.status).toBe(false);
  });

  it("fails if email is longer than 40 characters", () => {
    const result = checkEmail("a".repeat(41) + "@test.com");
    expect(result.status).toBe(false);
  });

  it("fails if email has no @", () => {
    const result = checkEmail("test.example.com");
    expect(result.status).toBe(false);
  });

  it("fails if email has more than one @", () => {
    const result = checkEmail("test@@example.com");
    expect(result.status).toBe(false);
  });

  it("fails if email has no dot", () => {
    const result = checkEmail("test@examplecom");
    expect(result.status).toBe(false);
  });

  it("fails if email has less than 2 chars after last dot", () => {
    const result = checkEmail("test@example.c");
    expect(result.status).toBe(false);
  });

  it("passes for a valid email", () => {
    const result = checkEmail("test@example.com");
    expect(result.status).toBe(true);
    expect(result.errorMessage).toBe("");
  });
});
