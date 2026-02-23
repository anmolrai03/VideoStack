import { errorResponse, successResponse } from "./apiResponse";

async function apiCallHandler(requestFn, fallbackSuccessMessage="Request Successful") {
  try {
    const response = await requestFn();
    return successResponse(
      response?.data, response?.data?.message || fallbackSuccessMessage
    )
  } catch (error) {
    console.log("API Error,",error.message,":", error);
    return errorResponse(error?.response?.data?.message || error.message || "API Error Occured.")
  }
}

export default apiCallHandler;