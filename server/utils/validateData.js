/*
  - atleast 8 length
  - should contain atleast one UpperCase
  - should contain atleast one lowerCase
  - should contain atleast one number
*/
const checkPassword = (password) => {
  let errorMessage = "";
  let status = false;

  if (!password) {
    errorMessage = "Password is missing.";
    return { status, errorMessage };
  }

  if (typeof password !== 'string') {
    errorMessage = "Password must be a string.";
    return { status, errorMessage };
  }

  if (password.length < 8) {
    errorMessage = "Password should be at least 8 characters long.";
    return { status, errorMessage };
  }

  if (!/[A-Z]/.test(password)) {
    errorMessage = "Password must contain at least one uppercase letter.";
    return { status, errorMessage };
  }

  if (!/[a-z]/.test(password)) {
    errorMessage = "Password must contain at least one lowercase letter.";
    return { status, errorMessage };
  }

  if (!/\d/.test(password)) {
    errorMessage = "Password must contain at least one number.";
    return { status, errorMessage };
  }

  status = true;
  return { status, errorMessage };
};

/*
  CHECKS IF EMAIL CONTAINS
  -> 1- @
  -> atleast 1 - '.'
  -> atleast 2 characters after '.'
*/
const checkEmail = (email) => {
  let errorMessage = "";
  let status = false;

  if( !email ){
    errorMessage = "Email is missing."
    return {status , errorMessage};
  }

  if( typeof email !== 'string'){
    errorMessage = "Email must be string."
    return {status , errorMessage};
  }

  if( email.length > 40 ){
    errorMessage = "Email should be less than 40 chars";
    return {status , errorMessage};
  }

  const map = new Map(); // Use Map instead of HashMap for standard JS
  for( const char of email ){
    map.set(char, (map.get(char) || 0) + 1);
  }

  if( !map.has("@") || map.get('@') !== 1 ){
    errorMessage = `Email should contain exactly 1 '@' symbol.`;
    return {status , errorMessage};
  }

  if( !map.has(".") ){
    errorMessage = `Email should contain at least one '.'.`;
    return {status , errorMessage};
  }

  // Check for at least 2 characters after the last '.'
  const lastDotIndex = email.lastIndexOf('.');
  if (lastDotIndex === -1 || email.length - lastDotIndex - 1 < 2) {
    errorMessage = " Email should have at least 2 characters after the last '.'. ";
    return { status, errorMessage };
  }

  return { status: true , errorMessage };
};

export { checkPassword, checkEmail };