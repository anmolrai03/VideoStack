import {useAction} from "../generic/useAction.jsx";

import {getMeAPI, loginAPI, logoutAPI, registerAPI, verifyPasswordAPI} from "../../apis/auth/auth.api.js";

export function useLogin(){
  return useAction(loginAPI);
}

export function useRegister(){
  return useAction(registerAPI);
}

export function useLogout(){
  return useAction(logoutAPI);
}

export function useVerifyPassword(){
  return useAction(verifyPasswordAPI);
}

export function useGetMe(){
  return useAction(getMeAPI);
}