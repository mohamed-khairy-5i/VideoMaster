/**
 * Video Information Routes
 * Handles video information extraction and platform details
 */

const express = require('express');
const { body, query, validationResult } = require('express-validator');
const videoService = require('../services/videoService');

const router = express.Router();

/**
 * POST /api/info/extract
 * Extract video information from URL
 */
router.post('/extract', 
  [
    body('url')
      .notEmpty()
      .withMessage('URL is required')
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Invalid URL format')
      .isLength({ max: 2048 })
      .withMessage('URL too long (max 2048 characters)')
  ],
  async (req, res, next) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: errors.array()
          }
        });
      }

      const { url } = req.body;

      console.log('🔍 Extracting video info for:', url);

      // Check if URL is supported
      if (!videoService.isSupportedUrl(url)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Unsupported platform or URL',
            supportedPlatforms: videoService.getSupportedPlatforms()
          }
        });
      }

      // Extract video information
      const videoInfo = await videoService.getVideoInfo(url);

      res.json({
        success: true,
        data: {
          videoInfo,
          extractedAt: new Date().toISOString(),
          platform: videoInfo.platform,
          availableFormats: videoInfo.formats.length,
          recommendedQuality: '720p'
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/info/platforms
 * Get list of supported platforms
 */
router.get('/platforms', (req, res) => {
  const platforms = videoService.getSupportedPlatforms();
  
  res.json({
    success: true,
    data: {
      platforms,
      totalSupported: platforms.length,
      lastUpdated: new Date().toISOString(),
      features: {
        multiQuality: true,
        audioExtraction: true,
        playlistSupport: true,
        batchDownload: false // Future feature
      }
    }
  });
});

/**
 * GET /api/info/formats
 * Get available video/audio formats
 */
router.get('/formats', (req, res) => {
  res.json({
    success: true,
    data: {
      videoFormats: [
        {
          format: 'mp4',
          description: 'MP4 Video',
          quality: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'],
          compatibility: 'Universal',
          recommended: true
        },
        {
          format: 'webm',
          description: 'WebM Video',
          quality: ['360p', '480p', '720p', '1080p'],
          compatibility: 'Modern browsers',
          recommended: false
        },
        {
          format: 'mkv',
          description: 'Matroska Video',
          quality: ['720p', '1080p', '1440p', '2160p'],
          compatibility: 'Desktop players',
          recommended: false
        }
      ],
      audioFormats: [
        {
          format: 'mp3',
          description: 'MP3 Audio',
          bitrate: ['128kbps', '192kbps', '320kbps'],
          compatibility: 'Universal',
          recommended: true
        },
        {
          format: 'm4a',
          description: 'M4A Audio',
          bitrate: ['128kbps', '256kbps'],
          compatibility: 'Apple devices',
          recommended: false
        },
        {
          format: 'webm',
          description: 'WebM Audio',
          bitrate: ['128kbps', '192kbps'],
          compatibility: 'Modern browsers',
          recommended: false
        }
      ],
      qualityLevels: {
        '144p': { width: 256, height: 144, description: 'Low quality' },
        '240p': { width: 426, height: 240, description: 'Low quality' },
        '360p': { width: 640, height: 360, description: 'Standard quality' },
        '480p': { width: 854, height: 480, description: 'Good quality' },
        '720p': { width: 1280, height: 720, description: 'HD quality', recommended: true },
        '1080p': { width: 1920, height: 1080, description: 'Full HD quality' },
        '1440p': { width: 2560, height: 1440, description: '2K quality' },
        '2160p': { width: 3840, height: 2160, description: '4K quality' }
      }
    }
  });
});

/**
 * POST /api/info/validate
 * Validate if URL is supported without full extraction
 */
router.post('/validate',
  [
    body('url')
      .notEmpty()
      .withMessage('URL is required')
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Invalid URL format')
  ],
  (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: errors.array()
          }
        });
      }

      const { url } = req.body;
      const isSupported = videoService.isSupportedUrl(url);
      
      let platform = 'Unknown';
      if (isSupported) {
        try {
          const urlObj = new URL(url);
          platform = videoService.identifyPlatform(urlObj.hostname);
        } catch (e) {
          // URL parsing failed
        }
      }

      res.json({
        success: true,
        data: {
          url,
          isSupported,
          platform,
          message: isSupported 
            ? `✅ ${platform} is supported` 
            : '❌ This platform is not supported',
          estimatedProcessingTime: isSupported ? '1-3 seconds' : null
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'URL validation failed',
          details: error.message
        }
      });
    }
  }
);

module.exports = router;