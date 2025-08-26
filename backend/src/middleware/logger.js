/**
 * Request Logger Middleware
 * Logs all incoming requests with detailed information
 */

const logger = (req, res, next) => {
  const startTime = Date.now();

  // Log request details
  console.log('📥 Incoming Request:', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    body: req.method === 'POST' ? (req.body || {}) : undefined
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - startTime;
    
    console.log('📤 Response Sent:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      success: res.statusCode < 400
    });

    return originalJson.call(this, body);
  };

  next();
};

module.exports = logger;