function successResponse(data, message = "success"){
  return {
    success: true,
    data,
    errors: [],
    message
  }
}

function errorResponse(message = "error", errors=[]){
  return {
    success: false,
    data: null,
    errors,
    message
  }
}

export {successResponse, errorResponse};