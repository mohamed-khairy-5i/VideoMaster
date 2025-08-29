// Enhanced Serverless Function for Video Download
// Built for Netlify with advanced security and performance features

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Security and validation utilities
const MAX_URL_LENGTH = 2048;
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB limit
const DOWNLOAD_TIMEOUT = 300000; // 5 minutes

// Allowed formats for security
const ALLOWED_VIDEO_FORMATS = ['mp4', 'webm', 'mkv', 'flv'];
const ALLOWED_AUDIO_FORMATS = ['mp3', 'aac', 'opus', 'flac', 'wav'];
const ALLOWED_QUALITIES = [
  '144p', '240p', '360p', '480p', '720p', '720p60', 
  '1080p', '1080p60', '1440p', '2160p', '4K',
  'best', 'worst', 'bestvideo', 'bestaudio'
];

// Rate limiting for downloads (stricter than info requests)
const downloadCounts = new Map();
const DOWNLOAD_RATE_LIMIT = 5; // downloads per hour
const DOWNLOAD_RATE_WINDOW = 3600000; // 1 hour in ms

// Input validation
function validateDownloadRequest(url, format, quality) {
  // URL validation (reuse from video-info.js logic)
  if (!url || url.length > MAX_URL_LENGTH) {
    throw new Error('Invalid URL length');
  }

  // Format validation
  if (format) {
    const isValidFormat = [...ALLOWED_VIDEO_FORMATS, ...ALLOWED_AUDIO_FORMATS]
      .includes(format.toLowerCase());
    if (!isValidFormat) {
      throw new Error('Unsupported format');
    }
  }

  // Quality validation
  if (quality && !ALLOWED_QUALITIES.includes(quality)) {
    throw new Error('Unsupported quality');
  }

  return true;
}

// Rate limiting for downloads
function checkDownloadRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - DOWNLOAD_RATE_WINDOW;
  
  if (!downloadCounts.has(ip)) {
    downloadCounts.set(ip, []);
  }
  
  const requests = downloadCounts.get(ip);
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= DOWNLOAD_RATE_LIMIT) {
    throw new Error('Download limit exceeded. Please wait before trying again.');
  }
  
  recentRequests.push(now);
  downloadCounts.set(ip, recentRequests);
}

// Generate secure temporary filename
function generateSecureFilename(originalName, format) {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const safeName = originalName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
  return `${safeName}_${timestamp}_${random}.${format}`;
}

// Enhanced download with yt-dlp
async function downloadVideo(url, options = {}) {
  const {
    format = 'best',
    quality = 'best',
    audioOnly = false,
    maxFilesize = MAX_FILE_SIZE
  } = options;

  return new Promise((resolve, reject) => {
    const tempDir = '/tmp';
    const outputTemplate = path.join(tempDir, '%(title)s_%(id)s.%(ext)s');
    
    // Build yt-dlp command
    const args = [
      '--no-warnings',
      '--no-playlist',
      '--extract-flat', 'false',
      '--write-info-json',
      '--max-filesize', maxFilesize.toString(),
      '--output', outputTemplate
    ];

    // Format selection based on request
    if (audioOnly) {
      args.push('--extract-audio');
      args.push('--audio-format', format);
      if (quality !== 'best') {
        args.push('--audio-quality', quality);
      }
    } else {
      // Video download with specific format/quality
      if (quality === 'best') {
        args.push('--format', 'best[ext=mp4]/best');
      } else if (quality === 'worst') {
        args.push('--format', 'worst[ext=mp4]/worst');
      } else {
        // Specific quality
        const formatSelector = `best[height<=${quality.replace('p', '')}][ext=mp4]/best[height<=${quality.replace('p', '')}]`;
        args.push('--format', formatSelector);
      }
    }

    // Add URL
    args.push(url);

    console.log('yt-dlp command:', 'yt-dlp', args.join(' '));

    // Execute yt-dlp
    const ytdlp = spawn('yt-dlp', args, {
      timeout: DOWNLOAD_TIMEOUT,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    let downloadedFiles = [];

    ytdlp.stdout.on('data', (data) => {
      stdout += data.toString();
      // Parse progress if needed
      const progressMatch = data.toString().match(/(\d+(?:\.\d+)?)%/);
      if (progressMatch) {
        const progress = parseFloat(progressMatch[1]);
        // Could emit progress events here
      }
    });

    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0) {
        // Success - find downloaded files
        try {
          const files = fs.readdirSync(tempDir)
            .filter(file => file.includes('_'))
            .map(file => ({
              path: path.join(tempDir, file),
              name: file,
              size: fs.statSync(path.join(tempDir, file)).size
            }));

          if (files.length === 0) {
            reject(new Error('No files were downloaded'));
            return;
          }

          resolve({
            success: true,
            files: files,
            stdout: stdout,
            stderr: stderr
          });
        } catch (error) {
          reject(new Error(`Failed to process downloaded files: ${error.message}`));
        }
      } else {
        reject(new Error(`Download failed with code ${code}: ${stderr}`));
      }
    });

    ytdlp.on('error', (error) => {
      reject(new Error(`Failed to start download: ${error.message}`));
    });

    // Timeout handling
    setTimeout(() => {
      ytdlp.kill('SIGTERM');
      reject(new Error('Download timeout exceeded'));
    }, DOWNLOAD_TIMEOUT);
  });
}

// Clean up temporary files
function cleanupTempFiles(files) {
  files.forEach(file => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error('Failed to cleanup file:', file.path, error);
    }
  });
}

// Main handler
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let downloadedFiles = [];

  try {
    // Get client IP and check rate limit
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                    event.headers['x-real-ip'] || 
                    'unknown';
    
    checkDownloadRateLimit(clientIP);

    // Parse request
    const body = JSON.parse(event.body || '{}');
    const { url, format, quality, audioOnly } = body;

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'الرجاء تقديم رابط الفيديو',
          code: 'MISSING_URL' 
        })
      };
    }

    // Validate request
    validateDownloadRequest(url, format, quality);

    // For Netlify, we'll return a pre-signed download URL instead of the actual file
    // This is because Netlify functions have response size limits
    
    // Start download process
    const downloadResult = await downloadVideo(url, {
      format: format || 'mp4',
      quality: quality || 'best',
      audioOnly: audioOnly || false
    });

    downloadedFiles = downloadResult.files;

    // In production, you would:
    // 1. Upload files to cloud storage (S3, Google Cloud, etc.)
    // 2. Generate secure download URLs
    // 3. Return those URLs to the client
    
    // For demo purposes, we'll return file info and a mock download URL
    const fileInfo = downloadedFiles[0];
    const mockDownloadUrl = `https://your-cdn.com/downloads/${path.basename(fileInfo.name)}`;

    // Cleanup temporary files
    cleanupTempFiles(downloadedFiles);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          downloadUrl: mockDownloadUrl,
          filename: fileInfo.name,
          filesize: fileInfo.size,
          format: format || 'mp4',
          quality: quality || 'best',
          expiresIn: 3600 // 1 hour
        },
        message: 'تم تحضير الملف للتحميل',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Download error:', error);

    // Cleanup on error
    if (downloadedFiles.length > 0) {
      cleanupTempFiles(downloadedFiles);
    }

    let statusCode = 500;
    let errorCode = 'DOWNLOAD_ERROR';

    if (error.message.includes('Download limit')) {
      statusCode = 429;
      errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.message.includes('Unsupported') || 
               error.message.includes('Invalid')) {
      statusCode = 400;
      errorCode = 'INVALID_REQUEST';
    } else if (error.message.includes('timeout')) {
      statusCode = 408;
      errorCode = 'DOWNLOAD_TIMEOUT';
    } else if (error.message.includes('too large') ||
               error.message.includes('filesize')) {
      statusCode = 413;
      errorCode = 'FILE_TOO_LARGE';
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        code: errorCode,
        timestamp: new Date().toISOString()
      })
    };
  }
};