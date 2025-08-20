export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  
  // Log the full error for debugging
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    status: status,
    path: req.path,
    method: req.method
  });
  
  // In development, provide more error details
  const errorResponse = {
    error: message,
    status: status
  };
  
  if (process.env.NODE_ENV === 'development' && status === 500) {
    errorResponse.details = err.message;
    errorResponse.stack = err.stack;
  }
  
  res.status(status).json(errorResponse);
}
