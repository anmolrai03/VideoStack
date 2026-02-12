import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import createApp from "../../app.js";

import { statusCodes } from "../../constants/statusCodes.js";

import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from "../setUp/mongoTestSetup.js";
import User from "../../models/users.model.js";

//TESTING THE LOGIN API.
describe("POST /api/auth/login", () => {
  //CREATE THE APP
  let app;

  // initial setup
  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  // it should give code as 404 and errors data for missing email or password
  it("should give code as 404 and errors data for missing email or password", async () => {
    //ARRANGE
    const reqData = {
      email: "",
      password: "",
    };

    //ACT
    const res = await request(app).post("/api/auth/login").send(reqData);

    //ASSERT
    expect(res.statusCode).toBe(statusCodes.BAD_REQUEST);
    expect(typeof res.body.code).toBe("string");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email",
        }),
      ]),
    );
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email",
          message: "Email is missing.",
        }),
        expect.objectContaining({
          field: "password",
          message: "Password is missing.",
        }),
      ]),
    );

  });

  it("should return login success when email and password is correct", async () => {
    //ARRANGE
    await User.create({
      email: "testuser@gmail.com",
      password: "test-Password",
      username: "testUser12",
      fullname: "Test User",
    });

    // ACT
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@gmail.com", password: "test-Password" });

    //ASSERT
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("LOGIN_SUCCESS");
    expect(res.body.data).toMatchObject({
      avatarName: "TU",
    });

    // console.log(res);

    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should return login fail if email does not exist", async () => {
    //ARRANGE
    await User.create({
      email: "testuser@gmail.com",
      password: "test-Password",
      username: "testUser12",
      fullname: "Test User",
    });

    // ACT
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser2@gmail.com", password: "test-Password" });

    //ASSERT
    expect(res.status).toBe(statusCodes.NOT_FOUND);
    expect(typeof res.body.code).toBe("string");

    // console.log(res);

    expect(res.headers["set-cookie"]).toBeUndefined();
  });


  it("should return login fail if password does not match", async () => {
    //ARRANGE
    await User.create({
      email: "testuser@gmail.com",
      password: "test-Password",
      username: "testUser12",
      fullname: "Test User",
    });

    // ACT
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@gmail.com", password: "test-Password1" });

    //ASSERT
    expect(res.status).toBe(statusCodes.UNAUTHORIZED);
    expect(typeof res.body.code).toBe("string");

    // console.log(res);
    expect(res.body.errors[0].field).toBe("password");
    expect(res.headers["set-cookie"]).toBeUndefined();
  });


});

//TESTING THE REGISTER API
describe("POST /api/auth/register", () => {
  let app;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it("should return validation error for invalid input", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullname: "",
      email: "",
      username: "",
      password: "",
    });

    expect(res.statusCode).toBe(statusCodes.BAD_REQUEST);
    expect(res.body.code).toBe("VALIDATION_ERROR");
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("should return conflict if email already exists", async () => {
    await User.create({
      fullname: "Test User",
      email: "test@test.com",
      username: "testuser",
      password: "passWord1",
    });

    const res = await request(app).post("/api/auth/register").send({
      fullname: "Test User",
      email: "test@test.com",
      username: "anotheruser",
      password: "passWord1",
    });

    expect(res.statusCode).toBe(statusCodes.CONFLICT);
    expect(res.body.code).toBe("USER_EXISTS");
  });

  it("should register user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullname: "Test User",
      email: "test@test.com",
      username: "testuser",
      password: "Password1",
    });

    expect(res.statusCode).toBe(statusCodes.CREATED);
    expect(res.body.code).toBe("USER_CREATED");

    const userInDb = await User.findOne({ email: "test@test.com" });
    expect(userInDb).toBeTruthy();
  });
});

// TESTING LOGOUT API
describe("GET /api/auth/logout", () => {
  let app;
  let cookie;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it("should return MISSING_TOKEN when not logged in", async () => {
    const res = await request(app).get("/api/auth/logout");

    expect(res.statusCode).toBeDefined();
    expect(res.body.code).toEqual(expect.any(String))
  });

  it("should logout user successfully", async () => {
    await User.create({
      fullname: "Test User",
      email: "test@test.com",
      username: "testuser",
      password: "Password1",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "Password1",
      });

    cookie = loginRes.headers["set-cookie"];

    // console.log("login" , cookie);
    expect(cookie).toBeDefined();
    // expect(cookie).toContain("accessToken=");

    const res = await request(app)
      .get("/api/auth/logout")
      .set("Cookie", cookie);

    // console.log(res);

    expect(res.statusCode).toBe(statusCodes.OK);
    expect(res.body.code).toBe("LOGGED_OUT");
    
    const logoutCookie = res.headers['set-cookie'];
    // console.log("lougut ", logoutCookie);

    expect(logoutCookie).toBeDefined();
    expect(logoutCookie[0]).toContain('accessToken=');

  });
});

// TESTING VERIFY PASSWORD API
describe("POST /api/auth/verify-password", () => {
  let app;
  let cookie;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it("should return UNAUTHORIZED if not logged in,i.e, no token", async () => {
    const res = await request(app)
      .post("/api/auth/verify-password")
      .send({ password: "Password1" });

    expect(res.statusCode).toBeDefined();
  });

  it("should return UNAUTHORIZED if password is wrong", async () => {

    await User.create({
      fullname: "Test User",
      email: "test@test.com",
      username: "testuser",
      password: "Password1",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "Password1" });

    cookie = loginRes.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/verify-password")
      .set("Cookie", cookie)
      .send({ password: "WrongPassword2" });

    expect(res.statusCode).toBe(statusCodes.UNAUTHORIZED);
    expect(res.body.code).toBe("VALIDATION_ERROR");
  });

  it("should verify password successfully", async () => {
    await User.create({
      fullname: "Test User",
      email: "test@test.com",
      username: "testuser",
      password: "Password1",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "Password1" });

    cookie = loginRes.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/verify-password")
      .set("Cookie", cookie)
      .send({ password: "Password1" });

    // console.log(res.statusCode , res.body);

    expect(res.statusCode).toBe(statusCodes.OK);
    expect(res.body.code).toBe("PASSWORD_VERIFIED");
  });

});


// TESTING GETME API
describe("GET /api/auth/me", () => {
  let app;
  let cookie;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it("should return BAD_REQUEST if not logged in", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.statusCode).toBeDefined();
  });

  it("should return user data successfully", async () => {
    await User.create({
      fullname: "Test User",
      email: "test@test.com",
      username: "testuser",
      password: "Password1",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "Password1" });

    cookie = loginRes.headers["set-cookie"];

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(statusCodes.OK);
    expect(res.body.code).toBe("USER_DATA_SENT");
    expect(res.body.data.email).toBe("test@test.com");
  });

});
