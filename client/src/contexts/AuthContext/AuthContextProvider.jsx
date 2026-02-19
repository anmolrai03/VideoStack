import { useEffect, useMemo, useState } from "react";
import {AuthContext} from "./AuthContext";

import {useGetMe} from "../../hooks/auth/auth.hooks.js";

export function AuthContextProvider({children}){

  const {execute: getMe}  = useGetMe();

  const [authChecked, setAuthChecked] = useState(false);
  const [user , setUser] = useState(null);

  useEffect( () => {
    const checkAuth = async () => {
      const res =await getMe();
      if( res.success){
        setUser(res.data);
      } else {
        setUser(null)
      }

      setAuthChecked(true);
    }

    checkAuth();
  }, [getMe]);

  const value = useMemo( () => {
    return {
      authChecked,
      user
    }
  }, [authChecked, user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}