import { useNavigate } from "react-router-dom";

import {useAction} from "../generic/useAction.jsx";
import { useAuthContext } from "../../contexts/AuthContext/AuthContext.js";

import {getMeAPI, loginAPI, logoutAPI, registerAPI, verifyPasswordAPI} from "../../apis/auth/auth.api.js";

export function useLogin(){
  return useAction(loginAPI);
}

export function useRegister(){
  return useAction(registerAPI);
}

export function useLogout() {
  const { execute, loading } = useAction(logoutAPI);
  const navigate = useNavigate();
  const { refetchUser } = useAuthContext();

  const logout = async () => {
    const result = await execute();
    if (result.success) {
      await refetchUser(); // Re-fetch user to clear state
      navigate("/");
    }
    return result;
  };

  return { logout, loading };
}


export function useVerifyPassword(){
  return useAction(verifyPasswordAPI);
}

export function useGetMe(){
  return useAction(getMeAPI);
}