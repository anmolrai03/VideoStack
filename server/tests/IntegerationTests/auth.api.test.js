import request from "supertest";
import { describe, expect , it } from "vitest";

import createApp from "../../app.js";

import { statusCodes } from "../../constants/statusCodes.js";

//TESTING THE LOGIN API.
describe("POST /api/auth/login" , () => {
  //CREATE THE APP
  const app = createApp();

  // it should give code as 404 and errors data for missing email or password
  it("should give code as 404 and errors data for missing email or password" , async () => {
    //ARRANGE 
    const reqData = {
      email: "",
      password: ""
    };

    //ACT
    const res = 
      await request(app)
        .post("/api/auth/login")
        .send(reqData);

    //ASSERT
    expect(res.statusCode).toBe(statusCodes.BAD_REQUEST);
    expect(typeof res.body.code).toBe("string");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email"
        })
      ])
    );
    expect(res.body.errors[0].message).toBe("Email is missing.");
    expect(res.body.errors[1].message).toBe("Password is missing.");
    
  });


});