/**
 * Security Middleware
 * Additional security measures and validation
 */

const security = (req, res, next) => {
  // Remove potentially dangerous headers
  delete req.headers['x-forwarded-host'];
  delete req.headers['x-forwarded-proto'];

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Block suspicious user agents
  const userAgent = req.get('User-Agent') || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /wget/i,
    /curl/i
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious && !userAgent.includes('Googlebot') && !userAgent.includes('Bingbot')) {
    console.warn('⚠️ Suspicious user agent blocked:', {
      userAgent,
      ip: req.ip,
      url: req.url,
      timestamp: new Date().toISOString()
    });
    
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access forbidden',
        code: 'SUSPICIOUS_USER_AGENT'
      }
    });
  }

  // Validate request size
  const contentLength = parseInt(req.get('content-length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      error: {
        message: 'Request too large',
        maxSize: '10MB'
      }
    });
  }

  // Block requests with suspicious patterns in URL
  const suspiciousUrlPatterns = [
    /\.\./,  // Path traversal
    /\/\//,  // Double slashes
    /<script>/i, // XSS attempt
    /javascript:/i, // Javascript protocol
    /data:/i, // Data protocol
    /vbscript:/i // VBScript protocol
  ];

  const hasSuspiciousUrl = suspiciousUrlPatterns.some(pattern => pattern.test(req.url));
  
  if (hasSuspiciousUrl) {
    console.warn('⚠️ Suspicious URL pattern blocked:', {
      url: req.url,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid request format'
      }
    });
  }

  next();
};

module.exports = security;