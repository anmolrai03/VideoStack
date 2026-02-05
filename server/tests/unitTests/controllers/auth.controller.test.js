import { beforeEach, describe, expect, vi } from "vitest";

import { statusCodes } from "../../../constants/statusCodes.js";

import User from "../../../models/users.model.js";

import { successResponse } from "../../../utils/responseHandler.js";
import { checkEmail, checkPassword } from "../../../utils/validateData.js";
import AppError from "../../../utils/AppError.js";

import {
  loginController,
  registerController,
  logoutController,
  verifyPasswordController,
  getUserDetailsController,
} from "../../../controller/auth.controller.js";

// MOCKING MODULES
vi.mock("../../../models/users.model.js", () => {
  const MockUser = vi.fn();
  MockUser.findOne = vi.fn();

  return {
    default: MockUser,
  };
});

vi.mock("../../../utils/responseHandler.js", () => ({
  successResponse: vi.fn(),
}));

vi.mock("../../../utils/validateData.js", () => ({
  checkEmail: vi.fn(),
  checkPassword: vi.fn(),
}));

describe("Login Controller", () => {
  let req;
  let res;
  let next;

  // COMMON TEST SETUP
  beforeEach(() => {
    req = { body: {} };
    res = { cookie: vi.fn() };
    next = vi.fn();

    vi.clearAllMocks();
  });

  // VALIDATION ERRORS
  describe("Validation errors", () => {
    it("should call next with MISSING_FIELDS when email is missing", async () => {
      // ARRANGE
      req.body = {
        password: "password",
      };

      checkEmail.mockReturnValue({
        status: false,
        errorMessage: "Email field cannot be emtpy.",
      });

      // ACT
      await loginController(req, res, next);

      // ASSERT
      expect(next).toHaveBeenCalledOnce();

      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.code).toBe("MISSING_FIELDS");
      expect(err.errors).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email" })]),
      );
    });

    it("should call next with MISSING_FIELDS when password is missing", async () => {
      // ARRANGE
      req.body = {
        email: "test@email.com",
      };

      checkEmail.mockReturnValue({ status: true });

      // ACT
      await loginController(req, res, next);

      // ASSERT
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.code).toBe("MISSING_FIELDS");
      expect(err.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "password" }),
        ]),
      );
    });
  });

  // AUTHENTICATION FAILURES
  describe("Authentication failures", () => {
    it("should call next when user is not found", async () => {
      // ARRANGE
      req.body = {
        email: "test@email.com",
        password: "password",
      };

      checkEmail.mockReturnValue({ status: true });

      User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      });

      // ACT
      await loginController(req, res, next);

      // ASSERT
      expect(next).toHaveBeenCalledOnce();

      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(404);
    });

    it("should call next when password does not match", async () => {
      // ARRANGE
      req.body = {
        email: "test@email.com",
        password: "wrong-password",
      };

      checkEmail.mockReturnValue({ status: true });

      const mockUser = {
        comparePassword: vi.fn().mockResolvedValue(false),
      };

      User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });

      // ACT
      await loginController(req, res, next);

      // ASSERT
      expect(next).toHaveBeenCalledOnce();

      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(AppError);
      expect(err.code).toBe("PASSWORD_MISMATCH");
      expect(err.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "password" }),
        ]),
      );
    });
  });

  // SUCCESSFUL LOGIN
  describe("Successful login", () => {

    it("should set accessToken cookie", async () => {
      // ARRANGE
      req.body = {
        email: "test@email.com",
        password: "password",
      };

      checkEmail.mockReturnValue({ status: true });

      const mockUser = {
        _id: "1234",
        comparePassword: vi.fn().mockResolvedValue(true),
        generateToken: vi.fn().mockReturnValue("fake-token"),
      };

      User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });

      // ACT
      await loginController(req, res, next);

      // ASSERT
      expect(res.cookie).toHaveBeenCalledOnce();
      expect(res.cookie).toHaveBeenCalledWith(
        "accessToken",
        "fake-token",
        expect.objectContaining({
          httpOnly: true,
        }),
      );
    });

    it("should return successResponse when login succeeds", async () => {
      // ARRANGE
      req.body = {
        email: "test@email.com",
        password: "password",
      };

      checkEmail.mockReturnValue({ status: true });

      const mockUser = {
        _id: "1234",
        fullname: "Test User",
        comparePassword: vi.fn().mockResolvedValue(true),
        generateToken: vi.fn().mockReturnValue("fake-token"),
      };

      User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });

      // ACT
      await loginController(req, res, next);

      // ASSERT
      expect(successResponse).toHaveBeenCalledOnce();
      expect(successResponse).toHaveBeenCalledWith(
        res,
        200,
        "LOGIN_SUCCESS",
        expect.any(String),
        expect.any(Object),
      );
    });

    it("should handle avatarName for single word names", async () => {
      // ARRANGE
      req.body = {
        email: "test@email.com",
        password: "password",
      };

      checkEmail.mockReturnValue({ status: true });

      const mockUser = {
        _id: "1234",
        fullname: "Test",
        comparePassword: vi.fn().mockResolvedValue(true),
        generateToken: vi.fn().mockReturnValue("fake-token"),
      };

      User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });

      // ACT
      await loginController(req, res, next);

      // ASSERT
      expect(successResponse).toHaveBeenCalledOnce();
      const responseData = successResponse.mock.calls[0][4];
      expect(responseData.avatarName).toBe("T");
    });

    it("should handle avatarName for multi-word names", async () => {
      // ARRANGE
      req.body = {
        email: "test@email.com",
        password: "password",
      };

      checkEmail.mockReturnValue({ status: true });

      const mockUser = {
        _id: "1234",
        fullname: "Test User Blud", // Three names
        comparePassword: vi.fn().mockResolvedValue(true),
        generateToken: vi.fn().mockReturnValue("fake-token"),
      };

      User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });

      // ACT
      await loginController(req, res, next);

      // ASSERT
      expect(successResponse).toHaveBeenCalledOnce();
      const responseData = successResponse.mock.calls[0][4];
      expect(responseData.avatarName).toBe("TUB");
    });

  });
});

// REGISTER CONTROLLER
describe("Register Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = vi.fn();
    vi.clearAllMocks();
    User.findOne = vi.fn();
  });

  it("should throw VALIDATION_ERROR when input is invalid", async () => {
    req.body = {
      fullname: "",
      email: "",
      username: "",
      password: "",
    };

    checkEmail.mockReturnValue({
      status: false,
      errorMessage: "Invalid email",
    });

    checkPassword.mockReturnValue({
      status: false,
      errorMessage: "Weak password",
    });

    await registerController(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.errors.length).toBeGreaterThan(0);
  });

  it("should throw USER_EXISTS when email already exists", async () => {
    req.body = {
      fullname: "Eren Yeager",
      email: "eren@test.com",
      username: "eren",
      password: "Password1",
    };

    checkEmail.mockReturnValue({ status: true });
    checkPassword.mockReturnValue({ status: true });

    User.findOne.mockResolvedValue({ _id: "123" });

    await registerController(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err.code).toBe("USER_EXISTS");
    expect(err.statusCode).toBe(statusCodes.CONFLICT);
  });

  it("should create user successfully", async () => {

    //ARRANGE
    req.body = {
      fullname: "Eren Yeager",
      email: "eren@test.com",
      username: "eren",
      password: "Password1",
    };

    checkEmail.mockReturnValue({ status: true });
    checkPassword.mockReturnValue({ status: true });

    // USER DO NOT EXIST ALREADY
    User.findOne.mockResolvedValue(null);

    const saveMock = vi.fn().mockResolvedValue(true);

    User.mockImplementation( function () {
      this.save = saveMock
    });

    //ACT
    await registerController(req, res, next);

    //ASSERT
    expect(User).toHaveBeenCalledWith({
      fullname: "Eren Yeager",
      email: "eren@test.com",
      username: "eren",
      password: "Password1",
    });

    expect(saveMock).toHaveBeenCalledOnce();
    expect(successResponse).toHaveBeenCalledOnce();
    expect(next).not.toHaveBeenCalled();
  });
  
});

// LOGOUT CONTROLLER
describe("Logout Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { };
    res = { clearCookie: vi.fn() };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should throw UNAUTHORIZED when userId is missing", async () => {
    //ARRANGE
    req.clientData={
      userId: "",
      fullname: "Test user"
    }

    //ACT
    await logoutController(req, res, next);

    //ASSERT
    expect(next).toHaveBeenCalledOnce();

    const err = next.mock.calls[0][0];
    // console.log("logout" , err)
    expect(err).toBeInstanceOf(AppError);
    expect(typeof err.code).toBe("string");
  });

  it("should clear cookie and logout successfully", async () => {
    //ARRANGE
    req.clientData = {
      userId: "123",
      fullname: "Eren",
    };

    //ACT
    await logoutController(req, res, next);

    //ASSERT
    expect(res.clearCookie).toHaveBeenCalledWith("accessToken",expect.objectContaining({
      httpOnly: true
    }));
    expect(successResponse).toHaveBeenCalledOnce();
    expect(successResponse).toHaveBeenCalledWith(
      res,
      200,
      expect.any(String),
      expect.stringContaining(req.clientData.fullname)
    );

  });

});

// VERIFY PASSWORD CONTROLLER
describe("Verify Password Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, clientData: {} };
    res = {};
    next = vi.fn();
    vi.clearAllMocks();
  });


  it("should throw USER_DO_NOT_EXIST when user do not exist" , async () =>{
    //ARRANGE 
    req.body.password = "some-password";
    req.clientData.userId = "123";

    // checkPassword.mockReturnValue({
    //   status: true,
    //   errorMessage: "",
    // });

    User.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
    });

    //ACT
    await verifyPasswordController(req , res, next);

    //ASSERT
    expect(next).toHaveBeenCalledOnce();

    const err = next.mock.calls[0][0];
    // console.log(err);
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(statusCodes.NOT_FOUND);
    expect(err.code).toBe("USER_DO_NOT_EXIST")
  });

  it("should throw VALIDATION_ERROR when password does not match", async () => {
    //ARRANGE
    req.body.password = "Password1";
    req.clientData.userId = "1";

    // checkPassword.mockReturnValue({ status: true });

    const mockUser = {
      comparePassword: vi.fn().mockResolvedValue(false)
    };

    User.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    });

    //ACT
    await verifyPasswordController(req, res, next);

    //ASSERT
    expect(next).toHaveBeenCalledOnce();

    const err = next.mock.calls[0][0];
    // console.log("error", err);

    expect(err.statusCode).toBe(statusCodes.UNAUTHORIZED);
    expect(typeof err.code).toBe("string");
    expect(err.code).toBe("VALIDATION_ERROR" || expect.any(String));

  });

  it("should verify password successfully", async () => {
    //ARRANGE
    req.body.password = "Password1";
    req.clientData.userId = "123";

    // checkPassword.mockReturnValue({ status: true });

    User.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        comparePassword: vi.fn().mockResolvedValue(true),
      }),
    });

    //ACT
    await verifyPasswordController(req, res, next);

    //ASSERT
    expect(successResponse).toHaveBeenCalledOnce();
    expect(next).not.toHaveBeenCalled();
  });

});

// GET ME CONTROLLER
describe("getMe Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { clientData: {} };
    res = {};
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should throw UNAUTHORIZED when userId is missing", async () => {
    await getUserDetailsController(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err.code).toBe("UNAUTHORIZED");
  });

  it("should throw USER_NOT_FOUND when user does not exist", async () => {
    req.clientData.userId = "123";

    User.findOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    });

    await getUserDetailsController(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err.code).toBe("USER_NOT_FOUND");
  });

  it("should return user data successfully", async () => {
    //ARRANGE
    req.clientData.userId = "123";

    User.findOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: "123",
        email: "test@test.com",
        fullname: "Test user",
        username: "userTest13",
      }),
    });

    //ACT
    await getUserDetailsController(req, res, next);

    //ASSERT
    expect(successResponse).toHaveBeenCalledOnce();
    expect(next).not.toHaveBeenCalled();

    const user = {
      _id: "123",
      email: expect.any(String),
      fullname: expect.any(String),
      username: expect.any(String)
    }
    expect(successResponse).toHaveBeenCalledWith(
      res,
      200,
      "USER_DATA_SENT",
      expect.any(String),
      expect.objectContaining(user)
    );

  });
});
