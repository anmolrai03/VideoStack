import { useState, useCallback } from "react";

export function useAction(actionFun) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await actionFun(...args);
        console.log("useAction: ", result);
        if (!result.success) {
          setError(result);
        } else {
          setData(result.data);
        }
        return result;
      } catch (err) {
        console.log("Error in the API hook: ", err);
        const normalizedError = {
          success: false,
          data: null,
          message:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong.",
          errors: err?.response?.data?.errors || []
        };

        setError(normalizedError);
        return normalizedError;
      } finally {
        setLoading(false);
      }
    },
    [actionFun],
  );

  return { execute, loading, error, data };
}
