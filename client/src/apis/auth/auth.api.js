import api from "../setup/api.js";
import apiCallHandler from "../setup/apiCallHandler.js";

import authURL from "../../constants/APIConstants/authURLS.js";


export function loginAPI({ email, password }) {
  return apiCallHandler(
    () => api.post(authURL.LOGIN_URL, { email, password }),
    "Logged In Successfully.",
  );
}

export function registerAPI({ fullname, email, username, password }) {
  return apiCallHandler(
    () =>
      api.post(authURL.REGISTER_URL, { fullname, username, email, password }),
    "Sign-Up Success",
  );
}

export function logoutAPI() {
  return apiCallHandler(
    () => api.get(authURL.LOGOUT_URL),
    "Logged Out Successfully",
  );
}

export function verifyPasswordAPI(password) {
  return apiCallHandler(
    () => api.post(authURL.VERIFY_PASSWORD_URL, { password }),
    "Password Verified",
  );
}

export function getMeAPI() {
  return apiCallHandler(
    () => api.get(authURL.GET_ME_URL),
    "User Fetched Successfully",
  );
}


