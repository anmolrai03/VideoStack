function successResponse(data, message = "success"){
  return {
    success: true,
    data,
    message
  }
}

function errorResponse(message = "error"){
  return {
    success: false,
    data: null,
    message
  }
}

export {successResponse, errorResponse};