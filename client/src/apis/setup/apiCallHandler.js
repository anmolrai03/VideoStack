import { errorResponse, successResponse } from "./apiResponse";

async function apiCallHandler(requestFn, fallbackSuccessMessage="Request Successful") {
  try {
    const response = await requestFn();
    console.log("API CALL HANDLER(SUCCESS): ", response.data);
    return successResponse(
      response?.data?.data,
      response?.data?.message || fallbackSuccessMessage
    )
  } catch (error) {
    console.log("API Error,",error.message,":", error);
    console.log("API CALL HANDLER(ERROR): ", error?.response?.data)
    return errorResponse(
      error?.response?.data?.message || error.message || "API Error Occured.",
      error?.response?.data?.errors
    )
  }
}

export default apiCallHandler;