/**
 * Global Error Handler Middleware
 * Handles all application errors with proper logging and user-friendly responses
 */

const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    message: 'Internal Server Error',
    status: 500
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation Error',
      status: 400,
      details: Object.values(err.errors).map(e => e.message)
    };
  }

  // Cast errors
  if (err.name === 'CastError') {
    error = {
      message: 'Invalid ID format',
      status: 400
    };
  }

  // Duplicate key errors
  if (err.code === 11000) {
    error = {
      message: 'Duplicate field value entered',
      status: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401
    };
  }

  // Express validator errors
  if (err.errors && Array.isArray(err.errors)) {
    error = {
      message: 'Validation Error',
      status: 400,
      details: err.errors.map(e => e.msg)
    };
  }

  // Network/Download errors
  if (err.message && err.message.includes('ENOTFOUND')) {
    error = {
      message: 'Network error: Unable to reach the video source',
      status: 503
    };
  }

  if (err.message && err.message.includes('timeout')) {
    error = {
      message: 'Request timeout: The video source took too long to respond',
      status: 408
    };
  }

  // Video extraction errors
  if (err.message && err.message.includes('No video formats found')) {
    error = {
      message: 'No downloadable video formats found for this URL',
      status: 404
    };
  }

  if (err.message && err.message.includes('Unsupported URL')) {
    error = {
      message: 'This video platform is not supported',
      status: 400
    };
  }

  // Rate limit errors
  if (err.message && err.message.includes('Too many requests')) {
    error = {
      message: 'Too many requests. Please try again later.',
      status: 429
    };
  }

  // File size errors
  if (err.message && err.message.includes('File too large')) {
    error = {
      message: 'File size exceeds the maximum limit',
      status: 413
    };
  }

  res.status(error.status).json({
    success: false,
    error: {
      message: error.message,
      ...(error.details && { details: error.details }),
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        originalError: err.message 
      })
    }
  });
};

module.exports = errorHandler;