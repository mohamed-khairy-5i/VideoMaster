/**
 * Health Check Routes
 * Provides system health and status information
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Basic health check
 */
router.get('/', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: formatUptime(uptime)
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    features: {
      videoDownload: true,
      multiPlatform: true,
      caching: true,
      rateLimiting: true
    }
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with system info
 */
router.get('/detailed', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: {
      uptime: {
        seconds: Math.floor(uptime),
        formatted: formatUptime(uptime)
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        arrayBuffers: `${Math.round(memoryUsage.arrayBuffers / 1024 / 1024)}MB`
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3001,
      rateLimitEnabled: true,
      corsEnabled: true,
      helmetEnabled: true
    },
    features: {
      supportedPlatforms: [
        'YouTube',
        'TikTok', 
        'Instagram',
        'Facebook',
        'Twitter',
        'Vimeo',
        'Dailymotion',
        'Reddit',
        'Streamable',
        'Twitch'
      ],
      supportedFormats: ['mp4', 'webm', 'mp3', 'm4a'],
      maxQuality: '4K',
      cacheEnabled: true,
      downloadTimeout: '5 minutes'
    },
    limits: {
      rateLimitWindow: `${parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 60000 || 15} minutes`,
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      maxFileSize: '1GB',
      concurrentDownloads: parseInt(process.env.CONCURRENT_DOWNLOADS) || 5
    }
  });
});

/**
 * Format uptime in human readable format
 */
function formatUptime(uptime) {
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

module.exports = router;