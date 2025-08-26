/**
 * Download Routes
 * Handles video download requests and generation of download links
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const videoService = require('../services/videoService');

const router = express.Router();

/**
 * POST /api/download/prepare
 * Prepare download by getting video info and generating download URL
 */
router.post('/prepare',
  [
    body('url')
      .notEmpty()
      .withMessage('URL is required')
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Invalid URL format')
      .isLength({ max: 2048 })
      .withMessage('URL too long'),
    body('format')
      .optional()
      .isIn(['mp4', 'webm', 'mkv', 'mp3', 'm4a'])
      .withMessage('Invalid format'),
    body('quality')
      .optional()
      .isIn(['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', 'audio'])
      .withMessage('Invalid quality')
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

      const { url, format = 'mp4', quality = '720p' } = req.body;

      console.log('⬇️ Preparing download:', { url, format, quality });

      // Check if URL is supported
      if (!videoService.isSupportedUrl(url)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Unsupported platform or URL',
            code: 'UNSUPPORTED_PLATFORM'
          }
        });
      }

      // Get video information
      const videoInfo = await videoService.getVideoInfo(url);
      
      // Generate download URL
      const downloadData = await videoService.generateDownloadUrl(url, format, quality);

      res.json({
        success: true,
        data: {
          video: {
            id: videoInfo.id,
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail,
            duration: videoInfo.duration,
            platform: videoInfo.platform,
            uploader: videoInfo.uploader
          },
          download: {
            ...downloadData,
            preparedAt: new Date().toISOString(),
            validUntil: downloadData.expires
          },
          instructions: [
            '1. Click the download link below',
            '2. Choose "Save As" in your browser', 
            '3. Select download location',
            '4. Wait for download to complete'
          ]
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/download/batch
 * Prepare batch download for multiple URLs (future feature)
 */
router.post('/batch',
  [
    body('urls')
      .isArray({ min: 1, max: 10 })
      .withMessage('URLs must be an array with 1-10 items'),
    body('urls.*')
      .isURL({ protocols: ['http', 'https'] })
      .withMessage('Each URL must be valid'),
    body('format')
      .optional()
      .isIn(['mp4', 'webm', 'mp3'])
      .withMessage('Invalid format'),
    body('quality')
      .optional()
      .isIn(['360p', '720p', '1080p', 'audio'])
      .withMessage('Invalid quality')
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

      const { urls, format = 'mp4', quality = '720p' } = req.body;

      console.log('📦 Preparing batch download:', { count: urls.length, format, quality });

      const results = [];
      const batchErrors = [];

      // Process each URL
      for (let i = 0; i < urls.length; i++) {
        try {
          const url = urls[i];
          
          if (!videoService.isSupportedUrl(url)) {
            batchErrors.push({
              url,
              index: i,
              error: 'Unsupported platform'
            });
            continue;
          }

          const videoInfo = await videoService.getVideoInfo(url);
          const downloadData = await videoService.generateDownloadUrl(url, format, quality);

          results.push({
            index: i,
            url,
            video: {
              id: videoInfo.id,
              title: videoInfo.title,
              platform: videoInfo.platform
            },
            download: downloadData
          });

        } catch (error) {
          batchErrors.push({
            url: urls[i],
            index: i,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        data: {
          results,
          summary: {
            total: urls.length,
            successful: results.length,
            failed: batchErrors.length,
            format,
            quality
          },
          errors: batchErrors.length > 0 ? batchErrors : undefined,
          preparedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/download/status/:id
 * Get download status (future feature for progress tracking)
 */
router.get('/status/:id', (req, res) => {
  const { id } = req.params;

  // Simulate download status
  const statuses = ['preparing', 'downloading', 'processing', 'completed', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const progress = randomStatus === 'downloading' ? Math.floor(Math.random() * 100) : 
                  randomStatus === 'completed' ? 100 : 0;

  res.json({
    success: true,
    data: {
      id,
      status: randomStatus,
      progress,
      message: getStatusMessage(randomStatus, progress),
      estimatedTimeRemaining: randomStatus === 'downloading' ? 
        `${Math.floor(Math.random() * 120)} seconds` : null,
      createdAt: new Date(Date.now() - Math.random() * 300000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * GET /api/download/history
 * Get download history (future feature)
 */
router.get('/history', (req, res) => {
  // Simulate download history
  const history = Array.from({ length: 5 }, (_, i) => ({
    id: `download_${i + 1}`,
    title: `Sample Video ${i + 1}`,
    platform: ['YouTube', 'TikTok', 'Instagram'][Math.floor(Math.random() * 3)],
    format: 'mp4',
    quality: '720p',
    status: 'completed',
    downloadedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    filesize: `${Math.floor(Math.random() * 100)}MB`
  }));

  res.json({
    success: true,
    data: {
      history,
      total: history.length,
      page: 1,
      limit: 10
    }
  });
});

/**
 * Helper function to get status message
 */
function getStatusMessage(status, progress) {
  switch (status) {
    case 'preparing': return 'Extracting video information...';
    case 'downloading': return `Downloading... ${progress}%`;
    case 'processing': return 'Processing video file...';
    case 'completed': return 'Download completed successfully!';
    case 'failed': return 'Download failed. Please try again.';
    default: return 'Unknown status';
  }
}

module.exports = router;