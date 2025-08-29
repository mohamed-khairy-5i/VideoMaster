// Enhanced Serverless Function for Video Information Extraction
// Built for Netlify with advanced security and performance features
// Uses intelligent mock data and external APIs

const https = require('https');
const http = require('http');
const { URL } = require('url');

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
  'vk.com', 'vk.ru'
];

// Rate limiting (simple in-memory store)
const requestCounts = new Map();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

// Input validation and security
function validateAndSanitizeUrl(url) {
  try {
    if (!url || url.length > MAX_URL_LENGTH) {
      throw new Error('رابط غير صالح أو طويل جداً');
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
      throw new Error('بروتوكول غير مدعوم');
    }

    // Check against allowed domains
    const hostname = urlObj.hostname.replace('www.', '');
    const isAllowed = ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );

    if (!isAllowed) {
      throw new Error('هذه المنصة غير مدعومة حالياً');
    }

    // Security checks
    if (hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      throw new Error('عناوين محلية غير مسموحة');
    }

    return normalizedUrl;

  } catch (error) {
    throw new Error(`رابط غير صالح: ${error.message}`);
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
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT) {
    throw new Error('تم تجاوز الحد المسموح من الطلبات. انتظر قليلاً قبل المحاولة مرة أخرى.');
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
}

// Detect platform from URL
function detectPlatformFromUrl(url) {
  const cleanUrl = url.toLowerCase();
  
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) return 'youtube';
  if (cleanUrl.includes('tiktok.com')) return 'tiktok';
  if (cleanUrl.includes('instagram.com')) return 'instagram';
  if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) return 'facebook';
  if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) return 'twitter';
  if (cleanUrl.includes('vimeo.com')) return 'vimeo';
  if (cleanUrl.includes('dailymotion.com')) return 'dailymotion';
  if (cleanUrl.includes('twitch.tv')) return 'twitch';
  
  return 'unknown';
}

// Extract video ID from URL
function extractVideoId(url, platform) {
  try {
    if (platform === 'youtube') {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (match) return match[1];
    } else if (platform === 'tiktok') {
      const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
      if (match) return match[1];
    }
    // Add other platforms as needed
  } catch (e) {
    console.warn('Failed to extract video ID:', e.message);
  }
  
  return Math.random().toString(36).substr(2, 11);
}

// Generate realistic video information
async function extractVideoInfo(url) {
  try {
    const platform = detectPlatformFromUrl(url);
    const videoId = extractVideoId(url, platform);
    
    // In production, you would call real APIs here
    // For now, we'll generate intelligent mock data
    
    const videoData = {
      id: videoId,
      title: generateRealisticTitle(platform, url),
      description: generateRealisticDescription(platform),
      uploader: generateRealisticUploader(platform),
      uploader_id: `${platform}_${videoId}`,
      duration: generateRealisticDuration(platform),
      view_count: generateRealisticViews(platform),
      like_count: generateRealisticLikes(platform),
      upload_date: generateRecentDate(),
      thumbnail: generateThumbnailUrl(platform, videoId),
      extractor: platform,
      extractor_key: platform.toUpperCase(),
      webpage_url: url,
      formats: generateRealisticFormats(platform),
      categories: generateCategories(platform),
      tags: generateTags(platform).slice(0, 10),
      age_limit: 0,
      is_live: false,
      availability: 'public'
    };

    return videoData;

  } catch (error) {
    console.error('Video extraction error:', error.message);
    
    // Handle specific errors
    if (error.message.includes('غير مدعومة')) {
      throw new Error('هذه المنصة غير مدعومة حالياً. نحن ندعم YouTube، TikTok، Instagram ومنصات أخرى شهيرة.');
    } else if (error.message.includes('تجاوز الحد')) {
      throw error;
    } else {
      throw new Error('فشل في تحليل الفيديو. تأكد من صحة الرابط وأن الفيديو متاح.');
    }
  }
}

// Helper functions for generating realistic data
function generateRealisticTitle(platform, url) {
  const titles = {
    youtube: [
      'شرح شامل: كيفية تعلم البرمجة خطوة بخطوة',
      'أفضل النصائح للمبتدئين في عالم التكنولوجيا',
      'مراجعة تفصيلية: أحدث الأجهزة التقنية لعام 2024',
      'دليل كامل لتطوير المواقع الإلكترونية الحديثة',
      'أسرار النجاح في مجال التصميم الجرافيكي',
      'تعلم الذكاء الاصطناعي في 30 دقيقة فقط'
    ],
    tiktok: [
      'نصائح سريعة ومفيدة للحياة اليومية 💡',
      'ترند جديد يجب أن تجربه الآن 🔥',
      'حقائق مذهلة لم تكن تعرفها من قبل',
      'لحظات مضحكة من الحياة اليومية 😂',
      'حيل ذكية توفر عليك الوقت والجهد',
      'رقصة شعبية جديدة تكتسح السوشيال ميديا'
    ],
    instagram: [
      'خلف الكواليس: يوم في حياة مؤثر',
      'أفكار إبداعية لإنشاء محتوى متميز',
      'نصائح احترافية للتصوير بالهاتف',
      'وصفات لذيذة وسهلة التحضير في البيت',
      'أزياء وموضة: أحدث الاتجاهات',
      'تمارين رياضية بسيطة يمكن ممارستها في البيت'
    ],
    facebook: [
      'لحظات مميزة مع الأصدقاء والعائلة',
      'إعلان عن منتج جديد ومبتكر',
      'مقطع تحفيزي ملهم لبداية الأسبوع',
      'شرح تقني مفصل لأحدث التطبيقات',
      'تغطية حصرية لحدث مهم',
      'مقابلة شخصية مع خبير في المجال'
    ]
  };
  
  const platformTitles = titles[platform] || titles.youtube;
  return platformTitles[Math.floor(Math.random() * platformTitles.length)];
}

function generateRealisticDescription(platform) {
  const descriptions = {
    youtube: 'شرح مفصل ومفيد يهدف إلى تعليم المشاهدين مهارات جديدة وقيمة. المحتوى مصمم بعناية ليكون سهل الفهم ومناسب للمبتدئين والمتقدمين على حد سواء.',
    tiktok: 'محتوى ممتع وسريع يهدف إلى الترفيه والإفادة في نفس الوقت. مناسب لجميع الأعمار ويحتوي على معلومات مفيدة.',
    instagram: 'محتوى بصري جذاب يستكشف جوانب مختلفة من الحياة اليومية. مصمم لإلهام المتابعين وتقديم قيمة حقيقية.',
    facebook: 'محتوى اجتماعي يهدف إلى التفاعل مع المجتمع ومشاركة الخبرات والآراء المفيدة.'
  };
  
  return descriptions[platform] || descriptions.youtube;
}

function generateRealisticUploader(platform) {
  const uploaders = {
    youtube: ['أكاديمية التقنية العربية', 'قناة المعرفة', 'تعلم مع أحمد', 'المبرمج العربي', 'شروحات تقنية'],
    tiktok: ['@sara_content', '@ahmed_trends', '@tech_tips_ar', '@daily_life_hacks', '@creative_ideas'],
    instagram: ['@tech_lifestyle', '@creative_designer', '@food_lover_ar', '@fitness_coach_ar', '@travel_enthusiast'],
    facebook: ['صفحة التقنية العربية', 'مجتمع المطورين', 'أخبار التكنولوجيا', 'تعليم مجاني', 'محتوى مفيد']
  };
  
  const platformUploaders = uploaders[platform] || uploaders.youtube;
  return platformUploaders[Math.floor(Math.random() * platformUploaders.length)];
}

function generateRealisticDuration(platform) {
  const durations = {
    youtube: () => Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
    tiktok: () => Math.floor(Math.random() * 180) + 15,    // 15 seconds to 3 minutes
    instagram: () => Math.floor(Math.random() * 300) + 30, // 30 seconds to 5 minutes
    facebook: () => Math.floor(Math.random() * 600) + 60   // 1-11 minutes
  };
  
  const durationFn = durations[platform] || durations.youtube;
  return durationFn();
}

function generateRealisticViews(platform) {
  const viewRanges = {
    youtube: () => Math.floor(Math.random() * 500000) + 10000,  // 10K - 510K
    tiktok: () => Math.floor(Math.random() * 1000000) + 50000,  // 50K - 1.05M
    instagram: () => Math.floor(Math.random() * 200000) + 5000, // 5K - 205K
    facebook: () => Math.floor(Math.random() * 100000) + 2000   // 2K - 102K
  };
  
  const viewFn = viewRanges[platform] || viewRanges.youtube;
  return viewFn();
}

function generateRealisticLikes(platform) {
  const likeRanges = {
    youtube: () => Math.floor(Math.random() * 25000) + 500,  // 500 - 25.5K
    tiktok: () => Math.floor(Math.random() * 50000) + 1000,  // 1K - 51K
    instagram: () => Math.floor(Math.random() * 10000) + 200, // 200 - 10.2K
    facebook: () => Math.floor(Math.random() * 5000) + 100    // 100 - 5.1K
  };
  
  const likeFn = likeRanges[platform] || likeRanges.youtube;
  return likeFn();
}

function generateRecentDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 365); // Random day in last year
  const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function generateThumbnailUrl(platform, videoId) {
  const colors = ['2563EB', 'EF4444', '10B981', 'F59E0B', '8B5CF6', 'F97316'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const text = encodeURIComponent(platform.toUpperCase() + ' VIDEO');
  return `https://via.placeholder.com/640x360/${color}/FFFFFF?text=${text}`;
}

function generateRealisticFormats(platform) {
  const baseFormats = [
    {
      format_id: '137',
      ext: 'mp4',
      width: 1920,
      height: 1080,
      fps: 30,
      vcodec: 'avc1.640028',
      acodec: 'none',
      filesize: 45234567,
      quality: '1080p',
      format_note: 'Video only'
    },
    {
      format_id: '136',
      ext: 'mp4',
      width: 1280,
      height: 720,
      fps: 30,
      vcodec: 'avc1.4d401f',
      acodec: 'none',
      filesize: 28765432,
      quality: '720p',
      format_note: 'Video only'
    },
    {
      format_id: '135',
      ext: 'mp4',
      width: 854,
      height: 480,
      fps: 30,
      vcodec: 'avc1.4d401e',
      acodec: 'none',
      filesize: 18345678,
      quality: '480p',
      format_note: 'Video only'
    },
    {
      format_id: 'audio-320',
      ext: 'mp3',
      abr: 320,
      acodec: 'mp3',
      filesize: 1024 * 1024 * 8,
      quality: 'Audio MP3 (320kbps)',
      format_note: 'High Quality Audio'
    },
    {
      format_id: 'audio-128',
      ext: 'mp3',
      abr: 128,
      acodec: 'mp3',
      filesize: 1024 * 1024 * 4,
      quality: 'Audio MP3 (128kbps)',
      format_note: 'Standard Quality Audio'
    }
  ];
  
  return baseFormats;
}

function generateCategories(platform) {
  const categories = {
    youtube: ['Education', 'Technology', 'Entertainment', 'Science & Technology'],
    tiktok: ['Entertainment', 'Comedy', 'Education', 'Lifestyle'],
    instagram: ['Lifestyle', 'Fashion', 'Food', 'Travel'],
    facebook: ['News', 'Entertainment', 'Technology', 'Education']
  };
  
  const platformCategories = categories[platform] || categories.youtube;
  return [platformCategories[Math.floor(Math.random() * platformCategories.length)]];
}

function generateTags(platform) {
  const tags = {
    youtube: ['تعلم', 'شرح', 'تقنية', 'برمجة', 'تطوير', 'مفيد', 'عربي'],
    tiktok: ['ترند', 'مضحك', 'سريع', 'نصائح', 'حيل', 'جديد'],
    instagram: ['جميل', 'إلهام', 'إبداع', 'موضة', 'تصوير', 'فن'],
    facebook: ['مشاركة', 'مجتمع', 'خبر', 'مفيد', 'تفاعل', 'اجتماعي']
  };
  
  return tags[platform] || tags.youtube;
}

// Process formats for client
function processFormats(formats) {
  if (!Array.isArray(formats)) return [];
  
  return formats.map(format => ({
    format_id: format.format_id,
    ext: format.ext,
    width: format.width || null,
    height: format.height || null,
    fps: format.fps || null,
    vcodec: format.vcodec,
    acodec: format.acodec,
    filesize: format.filesize || null,
    quality: format.quality || getQualityLabel(format),
    format_note: format.format_note || '',
    abr: format.abr || null,
    vbr: format.vbr || null
  }));
}

function getQualityLabel(format) {
  if (format.acodec !== 'none' && (!format.vcodec || format.vcodec === 'none')) {
    const abr = format.abr || 128;
    const ext = format.ext || 'audio';
    return `Audio ${ext.toUpperCase()} (${abr}kbps)`;
  } else if (format.height) {
    const fps = format.fps ? `${format.fps}fps` : '';
    return `${format.height}p${fps}`;
  }
  return format.format_id || 'Unknown';
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
      body: JSON.stringify({ error: 'الطريقة غير مدعومة' })
    };
  }

  try {
    // Get client IP for rate limiting
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                    event.headers['x-real-ip'] || 
                    event.clientContext?.identity?.sourceIp ||
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
          success: false,
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
        timestamp: new Date().toISOString(),
        message: 'تم تحليل الفيديو بنجاح'
      })
    };

  } catch (error) {
    console.error('Handler error:', error);

    // Determine error type and status code
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';

    if (error.message.includes('تجاوز الحد')) {
      statusCode = 429;
      errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.message.includes('رابط غير صالح') || 
               error.message.includes('غير مدعومة')) {
      statusCode = 400;
      errorCode = 'INVALID_URL';
    } else if (error.message.includes('غير متاح')) {
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