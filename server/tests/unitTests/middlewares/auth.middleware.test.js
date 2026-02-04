import {describe , it , expect , vi, beforeEach} from "vitest";

import authMiddleware from "../../../middlewares/auth.middleware.js";
import { jwtVerify } from "../../../services/jwt/jwtServices";

vi.mock(
  "../../../services/jwt/jwtServices.js", 
  ()  => ({jwtVerify: vi.fn()})
);

describe("authMiddleware Testing" , () => {

  // DECLEAR VARIABLES
  let req;
  let res;
  let next;

  //CONFIGURING req , res , next
  beforeEach(()=> {
    req= {
      cookies: {}
    };
    res= {};
    next = vi.fn();

    vi.clearAllMocks();
  });


  it("should throw error to next(error) if no token exists" , () => {

    authMiddleware(req , res , next);

    expect(next).toHaveBeenCalledOnce();
    // console.log("next mock calls: " , next.mock.calls);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);

  });

  it("should call jwtVerify if token exists" , () => {
    req.cookies.accessToken = "valid-token";

    jwtVerify.mockReturnValue({sub: "238", fullname: "Coco"});

    authMiddleware(req , res , next);

    expect(jwtVerify).toHaveBeenCalledWith("valid-token");

  });

  it("should throw error if jwtVerify returns errors" , () => {
    req.cookies.accessToken = "invalid-token";

    jwtVerify.mockImplementation( () => {
      throw new Error("Invalid Token error");
    });

    authMiddleware(req , res , next);

    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("should set clientData correctly if jwtVerify returns data", () => {
    req.cookies.accessToken = "valid-token";

    jwtVerify.mockReturnValue({sub: "1234" , fullname: "Erehhh Mateyyy"});

    authMiddleware(req , res, next);

    expect(req.clientData).toEqual({
      "userId": "1234",
      "fullname": "Erehhh Mateyyy"
    })
  });

  it("should call next when everything runs correctly.", () => {
    req.cookies.accessToken = "valid-token";

    authMiddleware(req , res , next)
    expect(next)
      .toHaveBeenCalledExactlyOnceWith();
  });

});

