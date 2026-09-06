import { beforeEach, describe, expect, it, vi } from "vitest";

import errorHandler from "../../../middlewares/errorHandler.middleware.js";
import { errorResponse } from "../../../utils/responseHandler.js";
import AppError from "../../../utils/AppError.js";
import { statusCodes } from "../../../constants/statusCodes.js";

vi.mock(
  "../../../utils/responseHandler.js",
  () => ({ errorResponse: vi.fn() })
);

describe("Error handler middleware test", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = { headersSent: false };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should delegate to next(err) if res.headersSent is true", () => {
    res.headersSent = true;
    const err = new Error("Headers already sent");

    errorHandler(err, req, res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(errorResponse).not.toHaveBeenCalled();
  });

  it("should pass AppError unchanged to errorResponse", () => {
    const err = new AppError({
      statusCode: statusCodes.BAD_REQUEST,
      code: "CUSTOM_APP_ERROR",
      message: "Testing app error",
      errors: [{ field: "video", message: "Invalid video" }],
    });

    errorHandler(err, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.BAD_REQUEST,
      "CUSTOM_APP_ERROR",
      "Testing app error",
      [{ field: "video", message: "Invalid video" }],
    );
  });

  it("should map Multer LIMIT_FILE_SIZE error to 413 PAYLOAD_TOO_LARGE", () => {
    const err = new Error("File too large");
    err.name = "MulterError";
    err.code = "LIMIT_FILE_SIZE";
    err.field = "video";

    errorHandler(err, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.PAYLOAD_TOO_LARGE,
      "FILE_TOO_LARGE",
      "Uploaded file exceeds the maximum allowed file size limit.",
      [{ field: "video", message: "Uploaded file exceeds the maximum allowed file size limit." }],
    );
  });

  it("should map general MulterError to 400 BAD_REQUEST", () => {
    const err = new Error("Unexpected field");
    err.name = "MulterError";
    err.code = "LIMIT_UNEXPECTED_FILE";
    err.field = "avatar";

    errorHandler(err, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.BAD_REQUEST,
      "FILE_UPLOAD_ERROR",
      "Unexpected field",
      [{ field: "avatar", message: "Unexpected field" }],
    );
  });

  it("should map Mongoose CastError to 400 INVALID_ID_FORMAT", () => {
    const err = new Error("Cast to ObjectId failed");
    err.name = "CastError";
    err.path = "videoId";
    err.kind = "ObjectId";
    err.value = "123-invalid-hex";

    errorHandler(err, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.BAD_REQUEST,
      "INVALID_ID_FORMAT",
      "Invalid format for field: videoId",
      [{ field: "videoId", message: 'Cast to ObjectId failed for value "123-invalid-hex"' }],
    );
  });

  it("should map Mongoose ValidationError to 400 VALIDATION_ERROR", () => {
    const err = new Error("Validation failed");
    err.name = "ValidationError";
    err.errors = {
      title: { path: "title", message: "Title is required!" },
    };

    errorHandler(err, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.BAD_REQUEST,
      "VALIDATION_ERROR",
      "Validation failed for request data.",
      [{ field: "title", message: "Title is required!" }],
    );
  });

  it("should map JSON body SyntaxError to 400 INVALID_JSON_PAYLOAD", () => {
    const err = new SyntaxError("Unexpected token in JSON at position 1");
    err.status = 400;
    err.body = "{ invalid json";

    errorHandler(err, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.BAD_REQUEST,
      "INVALID_JSON_PAYLOAD",
      "Malformed JSON payload in request body.",
      [],
    );
  });

  it("should map JsonWebTokenError to 401 INVALID_TOKEN", () => {
    const err = new Error("jwt malformed");
    err.name = "JsonWebTokenError";

    errorHandler(err, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.UNAUTHORIZED,
      "INVALID_TOKEN",
      "Authentication token is invalid or expired.",
      [],
    );
  });

  it("should normalise unhandled generic errors to 500 INTERNAL_SERVER_ERROR without leaking raw stack", () => {
    const err = new Error("Database query failed critically");

    errorHandler(err, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.INTERNAL_SERVER_ERROR,
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred on the server.",
      [],
    );
  });
});