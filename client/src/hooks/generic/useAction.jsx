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
        if (!result.success) {
          setError(result.message);
        }
        setData(result.data);
        return result;
      } catch (err) {
        console.log("Error in the API hook: ", err);
        setError("Something went wrong.");
        return {success: false , data: null, message: "Something went wrong."}
      }finally{
        setLoading(false);
      }
    },
    [actionFun],
  );

  return { execute, loading, error, data };
}
