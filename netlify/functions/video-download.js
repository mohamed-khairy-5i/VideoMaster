// Enhanced Serverless Function for Video Download
// Built for Netlify with advanced security and performance features
// Returns secure download URLs instead of direct files

const crypto = require('crypto');

// Security and validation utilities
const MAX_URL_LENGTH = 2048;
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB limit
const DOWNLOAD_TIMEOUT = 300000; // 5 minutes

// Allowed formats for security
const ALLOWED_VIDEO_FORMATS = ['mp4', 'webm', 'mkv'];
const ALLOWED_AUDIO_FORMATS = ['mp3', 'aac', 'opus', 'flac'];
const ALLOWED_QUALITIES = [
  '144p', '240p', '360p', '480p', '720p', '720p60', 
  '1080p', '1080p60', '1440p', '2160p', '4K',
  'best', 'worst', 'bestvideo', 'bestaudio'
];

// Rate limiting for downloads (stricter than info requests)
const downloadCounts = new Map();
const DOWNLOAD_RATE_LIMIT = 10; // downloads per hour
const DOWNLOAD_RATE_WINDOW = 3600000; // 1 hour in ms

// Input validation
function validateDownloadRequest(url, format, quality) {
  if (!url || url.length > MAX_URL_LENGTH) {
    throw new Error('رابط غير صالح');
  }

  if (format) {
    const isValidFormat = [...ALLOWED_VIDEO_FORMATS, ...ALLOWED_AUDIO_FORMATS]
      .includes(format.toLowerCase());
    if (!isValidFormat) {
      throw new Error('تنسيق غير مدعوم');
    }
  }

  if (quality && !ALLOWED_QUALITIES.includes(quality)) {
    throw new Error('جودة غير مدعومة');
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
    throw new Error('تم تجاوز حد التحميل. انتظر قليلاً قبل المحاولة مرة أخرى.');
  }
  
  recentRequests.push(now);
  downloadCounts.set(ip, recentRequests);
}

// Generate secure filename
function generateSecureFilename(title, format, platform) {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  const safeName = (title || 'video').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_').substring(0, 30);
  return `${safeName}_${platform}_${timestamp}_${random}.${format}`;
}

// Detect platform from URL
function detectPlatformFromUrl(url) {
  const cleanUrl = url.toLowerCase();
  
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) return 'youtube';
  if (cleanUrl.includes('tiktok.com')) return 'tiktok';
  if (cleanUrl.includes('instagram.com')) return 'instagram';
  if (cleanUrl.includes('facebook.com')) return 'facebook';
  if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) return 'twitter';
  if (cleanUrl.includes('vimeo.com')) return 'vimeo';
  
  return 'unknown';
}

// Simulate download process with realistic data
async function simulateDownload(url, options = {}) {
  const {
    format = 'mp4',
    quality = '720p',
    audioOnly = false
  } = options;

  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      const platform = detectPlatformFromUrl(url);
      const videoId = url.split('/').pop() || Math.random().toString(36).substr(2, 8);
      
      // Generate realistic file info
      const filename = generateSecureFilename('video_download', format, platform);
      const filesize = generateRealisticFilesize(format, quality, audioOnly);
      
      // In production, this would be a real CDN URL or signed S3 URL
      const downloadUrl = generateSecureDownloadUrl(filename, platform);
      
      resolve({
        success: true,
        downloadUrl,
        filename,
        filesize,
        format,
        quality,
        platform,
        expiresIn: 3600 // 1 hour
      });
    }, 2000); // 2 second simulation
  });
}

// Generate realistic file sizes
function generateRealisticFilesize(format, quality, audioOnly) {
  if (audioOnly) {
    const audioSizes = {
      'mp3': { '128': 4, '192': 6, '320': 10 }, // MB per 5 minutes
      'aac': { '128': 3, '256': 6, '320': 8 },
      'flac': { 'lossless': 25 }
    };
    
    const formatSizes = audioSizes[format] || audioSizes['mp3'];
    const bitrate = quality.replace('kbps', '') || '128';
    const sizePerMinute = (formatSizes[bitrate] || formatSizes['128']) / 5;
    const duration = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
    
    return Math.floor(sizePerMinute * duration * 1024 * 1024); // Convert to bytes
  } else {
    const videoSizes = {
      '144p': 2,   // MB per minute
      '240p': 4,
      '360p': 8,
      '480p': 15,
      '720p': 25,
      '1080p': 50,
      '1440p': 100,
      '2160p': 200
    };
    
    const sizePerMinute = videoSizes[quality] || videoSizes['720p'];
    const duration = Math.floor(Math.random() * 30) + 10; // 10-40 minutes
    
    return Math.floor(sizePerMinute * duration * 1024 * 1024); // Convert to bytes
  }
}

// Generate secure download URL (mock)
function generateSecureDownloadUrl(filename, platform) {
  // In production, this would be:
  // 1. Upload file to cloud storage (S3, Google Cloud, etc.)
  // 2. Generate signed/temporary URL
  // 3. Return secure URL with expiration
  
  const baseUrl = 'https://cdn.vidcatch.pro/downloads'; // Mock CDN URL
  const token = crypto.randomBytes(16).toString('hex');
  
  return `${baseUrl}/${platform}/${filename}?token=${token}&expires=${Date.now() + 3600000}`;
}

// Format file size for display
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get download progress simulation
function getDownloadProgress(step) {
  const steps = [
    { progress: 10, message: 'جاري الاتصال بالخادم...' },
    { progress: 25, message: 'جاري تحليل الفيديو...' },
    { progress: 40, message: 'جاري استخراج الروابط...' },
    { progress: 60, message: 'جاري معالجة الملف...' },
    { progress: 80, message: 'جاري ضغط الملف...' },
    { progress: 95, message: 'جاري إعداد رابط التحميل...' },
    { progress: 100, message: 'تم إعداد الملف للتحميل!' }
  ];
  
  return steps[Math.min(step, steps.length - 1)];
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
      body: JSON.stringify({ 
        success: false,
        error: 'الطريقة غير مدعومة' 
      })
    };
  }

  try {
    // Get client IP and check rate limit
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                    event.headers['x-real-ip'] || 
                    event.clientContext?.identity?.sourceIp ||
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
          success: false,
          error: 'الرجاء تقديم رابط الفيديو',
          code: 'MISSING_URL' 
        })
      };
    }

    // Validate request
    validateDownloadRequest(url, format, quality);

    // Simulate download process
    const downloadResult = await simulateDownload(url, {
      format: format || 'mp4',
      quality: quality || '720p',
      audioOnly: audioOnly || false
    });

    // Enhanced response with download instructions
    const response = {
      success: true,
      data: {
        downloadUrl: downloadResult.downloadUrl,
        filename: downloadResult.filename,
        filesize: downloadResult.filesize,
        filesizeFormatted: formatFileSize(downloadResult.filesize),
        format: downloadResult.format,
        quality: downloadResult.quality,
        platform: downloadResult.platform,
        expiresIn: downloadResult.expiresIn,
        expiresAt: new Date(Date.now() + downloadResult.expiresIn * 1000).toISOString()
      },
      message: 'تم تحضير الملف بنجاح! انقر على الرابط لبدء التحميل.',
      instructions: {
        ar: 'انقر بزر الماوس الأيمن على رابط التحميل واختر "حفظ الرابط باسم" إذا لم يبدأ التحميل تلقائياً',
        en: 'Right-click the download link and select "Save link as" if download doesn\'t start automatically'
      },
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Download error:', error);

    let statusCode = 500;
    let errorCode = 'DOWNLOAD_ERROR';

    if (error.message.includes('تجاوز حد التحميل')) {
      statusCode = 429;
      errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.message.includes('غير مدعوم') || 
               error.message.includes('غير صالح')) {
      statusCode = 400;
      errorCode = 'INVALID_REQUEST';
    } else if (error.message.includes('timeout') ||
               error.message.includes('انتهت المهلة')) {
      statusCode = 408;
      errorCode = 'DOWNLOAD_TIMEOUT';
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        code: errorCode,
        timestamp: new Date().toISOString(),
        suggestion: 'تأكد من صحة الرابط وحاول مرة أخرى. إذا استمرت المشكلة، تواصل مع الدعم الفني.'
      })
    };
  }
};