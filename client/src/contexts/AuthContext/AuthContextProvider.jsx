import { useEffect, useMemo, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { useGetMe } from "../../hooks/auth/auth.hooks.js";

export default function AuthContextProvider({ children }) {
  const { execute: getMe } = useGetMe();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  // Add a refetch function
  const refetchUser = useCallback(async () => {
    const res = await getMe();
    if (res.success) {
      setUser(res.data);
    } else {
      setUser(null);
    }
  }, [getMe]);

  useEffect(() => {
    const checkAuth = async () => {
      await refetchUser();
      setAuthChecked(true);
    };
    checkAuth();
  }, [refetchUser]);

  const value = useMemo(
    () => ({
      authChecked,
      user,
      refetchUser,
    }),
    [authChecked, user, refetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
