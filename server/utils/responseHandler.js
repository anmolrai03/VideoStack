const successResponse = ( res , statusCode ,code, message , data=null) => {
  return res.status(statusCode).json({
    success: true,
    code,
    message, 
    data
  })
}

const errorResponse = (res , statusCode , code,message , errors=[]) => {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    errors
  })
}

export {successResponse , errorResponse};