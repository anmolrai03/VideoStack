import {beforeEach, describe, expect, it, vi} from "vitest";

import errorHandler from "../../middlewares/errorHandler.middleware.js";
import { errorResponse } from "../../utils/responseHandler.js";
import AppError from "../../utils/AppError";
import { statusCodes } from "../../constants/statusCodes";

vi.mock(
  "../../utils/responseHandler.js" , 
  () => ({errorResponse: vi.fn()})
);

describe("Error handler middleware test" , () => {
  let req;
  let res;
  let err;
  let next;

  beforeEach( () => {
    req = {}; res = {}; err={}; next = vi.fn();
    vi.clearAllMocks();
  });

  it("should pass the AppError unchanged to Error Response" , () => {
    // ARRANGE
    err = new AppError({
      statusCode: statusCodes.BAD_REQUEST,
      code: "TEST_INTERNAL_SERVER_ERROR",
      message: "Testing app error on throw",
      errors: [{field: "Test App" , message: "This is test field generated."}]
    });

    // ACT
    errorHandler(err , req , res , next);

    //ASSERT
    expect(errorResponse).toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.BAD_REQUEST,
      "TEST_INTERNAL_SERVER_ERROR",
      "Testing app error on throw",
      [{field: "Test App" , message: "This is test field generated."}]
    );
    
  });

  it("should normalise any other error in AppError" , () => {
    //ARRANGE
    err = new Error("Some unknown error thrown");

    // ACT
    errorHandler(err , req , res , next);

    //ASSERT
    expect(errorResponse).toHaveBeenCalledOnce();
    expect(errorResponse).toHaveBeenCalledWith(
      res,
      statusCodes.INTERNAL_SERVER_ERROR,
      "INTERNAL_SERVER_ERROR",
      "Something unknown went wrong.",
      []
    )
  });

});