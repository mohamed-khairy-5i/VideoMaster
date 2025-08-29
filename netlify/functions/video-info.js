// Enhanced Serverless Function for Video Information Extraction
// Built for Netlify with advanced security and performance features

const { execSync } = require('child_process');
const path = require('path');

// Security and validation utilities
const MAX_URL_LENGTH = 2048;
const ALLOWED_DOMAINS = [
  'youtube.com', 'youtu.be', 'youtube-nocookie.com', 'm.youtube.com',
  'tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'm.tiktok.com',
  'instagram.com', 'instagr.am',
  'facebook.com', 'fb.watch', 'fb.me', 'm.facebook.com',
  'twitter.com', 'x.com', 't.co', 'mobile.twitter.com',
  'vimeo.com', 'player.vimeo.com',
  'dailymotion.com', 'dai.ly',
  'twitch.tv', 'clips.twitch.tv', 'm.twitch.tv',
  'reddit.com', 'redd.it', 'v.redd.it',
  'soundcloud.com', 'snd.sc',
  'linkedin.com', 'lnkd.in',
  'pinterest.com', 'pin.it',
  'snapchat.com', 'story.snapchat.com',
  'bilibili.com', 'b23.tv',
  'weibo.com', 'weibo.cn',
  'vk.com', 'vk.ru',
  'ok.ru', 'odnoklassniki.ru',
  'rutube.ru',
  'yandex.ru'
];

// Rate limiting (simple in-memory store for demo)
const requestCounts = new Map();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in ms

// Input validation and security
function validateAndSanitizeUrl(url) {
  try {
    // Basic length check
    if (!url || url.length > MAX_URL_LENGTH) {
      throw new Error('URL too long or empty');
    }

    // Clean and normalize URL
    const cleanUrl = url.trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove invisible characters
      .toLowerCase();

    // Add protocol if missing
    const normalizedUrl = cleanUrl.startsWith('http') ? cleanUrl : 'https://' + cleanUrl;
    
    const urlObj = new URL(normalizedUrl);

    // Validate protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }

    // Check against allowed domains
    const hostname = urlObj.hostname.replace('www.', '');
    const isAllowed = ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );

    if (!isAllowed) {
      throw new Error('Domain not supported');
    }

    // Additional security checks
    if (hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      throw new Error('Local addresses not allowed');
    }

    return normalizedUrl;

  } catch (error) {
    throw new Error(`Invalid URL: ${error.message}`);
  }
}

// Rate limiting check
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_WINDOW;
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  
  const requests = requestCounts.get(ip);
  
  // Remove old requests
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Please wait before trying again.');
  }
  
  // Add current request
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
}

// Enhanced video info extraction using yt-dlp
async function extractVideoInfo(url) {
  try {
    // yt-dlp command with comprehensive options for better extraction
    const command = [
      'yt-dlp',
      '--no-warnings',
      '--no-playlist',
      '--extract-flat',
      '--dump-json',
      '--no-check-certificate',
      '--user-agent', '"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"',
      '--referer', '"https://www.google.com/"',
      `"${url}"`
    ].join(' ');

    console.log('Executing command:', command);
    
    const output = execSync(command, {
      timeout: 30000, // 30 seconds timeout
      maxBuffer: 1024 * 1024, // 1MB buffer
      encoding: 'utf8'
    });

    const videoData = JSON.parse(output);

    // Enhanced data processing and security filtering
    const processedData = {
      id: videoData.id || 'unknown',
      title: (videoData.title || 'Untitled Video').substring(0, 200), // Limit title length
      description: (videoData.description || '').substring(0, 500), // Limit description
      uploader: (videoData.uploader || videoData.channel || 'Unknown').substring(0, 100),
      uploader_id: videoData.uploader_id || videoData.channel_id || 'unknown',
      duration: videoData.duration || 0,
      view_count: videoData.view_count || 0,
      like_count: videoData.like_count || 0,
      upload_date: videoData.upload_date || new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      thumbnail: videoData.thumbnail || null,
      extractor: videoData.extractor || 'unknown',
      extractor_key: videoData.extractor_key || 'unknown',
      webpage_url: videoData.webpage_url || url,
      formats: processFormats(videoData.formats || []),
      // Additional metadata
      categories: videoData.categories || [],
      tags: (videoData.tags || []).slice(0, 10), // Limit tags
      age_limit: videoData.age_limit || 0,
      is_live: videoData.is_live || false,
      availability: videoData.availability || 'public'
    };

    return processedData;

  } catch (error) {
    console.error('yt-dlp error:', error.message);
    
    // Handle specific yt-dlp errors
    if (error.message.includes('Video unavailable')) {
      throw new Error('الفيديو غير متاح أو تم حذفه');
    } else if (error.message.includes('Private video')) {
      throw new Error('الفيديو خاص ولا يمكن الوصول إليه');
    } else if (error.message.includes('Sign in to confirm')) {
      throw new Error('الفيديو يتطلب تسجيل دخول');
    } else if (error.message.includes('This video is not available')) {
      throw new Error('الفيديو غير متاح في منطقتك');
    } else {
      throw new Error('فشل في تحليل الفيديو. تأكد من صحة الرابط');
    }
  }
}

// Process and filter video formats
function processFormats(formats) {
  if (!Array.isArray(formats)) {
    return [];
  }

  return formats
    .filter(format => format && (format.vcodec !== 'none' || format.acodec !== 'none'))
    .map(format => ({
      format_id: format.format_id,
      ext: format.ext,
      width: format.width || null,
      height: format.height || null,
      fps: format.fps || null,
      vcodec: format.vcodec,
      acodec: format.acodec,
      filesize: format.filesize || null,
      filesize_approx: format.filesize_approx || null,
      quality: getQualityLabel(format),
      format_note: format.format_note || '',
      abr: format.abr || null, // Audio bitrate
      vbr: format.vbr || null, // Video bitrate
      protocol: format.protocol || 'https'
    }))
    .slice(0, 20); // Limit number of formats
}

// Generate quality labels
function getQualityLabel(format) {
  if (format.acodec !== 'none' && (format.vcodec === 'none' || !format.vcodec)) {
    // Audio only
    const abr = format.abr || 128;
    const ext = format.ext || 'audio';
    return `Audio ${ext.toUpperCase()} (${abr}kbps)`;
  } else if (format.height) {
    // Video with height info
    const fps = format.fps ? `${format.fps}fps` : '';
    return `${format.height}p${fps}`;
  } else if (format.format_note) {
    return format.format_note;
  } else {
    return format.format_id || 'Unknown';
  }
}

// Main handler
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get client IP for rate limiting
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                    event.headers['x-real-ip'] || 
                    'unknown';

    // Check rate limit
    checkRateLimit(clientIP);

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { url } = body;

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

    // Validate and sanitize URL
    const validatedUrl = validateAndSanitizeUrl(url);

    // Extract video information
    const videoInfo = await extractVideoInfo(validatedUrl);

    // Success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: videoInfo,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Handler error:', error);

    // Determine error type and status code
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';

    if (error.message.includes('Rate limit')) {
      statusCode = 429;
      errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.message.includes('Invalid URL') || 
               error.message.includes('Domain not supported')) {
      statusCode = 400;
      errorCode = 'INVALID_URL';
    } else if (error.message.includes('Video unavailable') ||
               error.message.includes('Private video')) {
      statusCode = 404;
      errorCode = 'VIDEO_UNAVAILABLE';
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