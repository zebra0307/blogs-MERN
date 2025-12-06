export const errorHandler = (statusCode, message) => {
  const error = new Error(); //error constructor from js
  error.statusCode = statusCode;
  error.message = message;
  return error;
};