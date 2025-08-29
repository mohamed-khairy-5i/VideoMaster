// API utilities for VidCatch Pro
// This file contains mock API functions for demonstration
// In production, these would connect to actual backend services

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Enhanced error handling
class APIError extends Error {
  constructor(message, code, statusCode) {
    super(message)
    this.name = 'APIError'
    this.code = code
    this.statusCode = statusCode
  }
}

// HTTP client with enhanced error handling
const httpClient = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.error || `HTTP ${response.status}`,
        errorData.code || 'HTTP_ERROR',
        response.status
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    // Network or parsing errors
    throw new APIError(
      'فشل في الاتصال بالخادم. تحقق من اتصالك بالإنترنت.',
      'NETWORK_ERROR',
      0
    )
  }
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Real video information extraction using serverless functions
export const getVideoInfo = async (url) => {
  // Client-side validation first
  if (!isValidUrl(url)) {
    throw new APIError(
      'رابط غير صحيح. الرجاء التحقق من صحة الرابط.',
      'INVALID_URL',
      400
    )
  }
  
  const normalizedUrl = normalizeUrl(url)
  const platform = detectPlatform(normalizedUrl)
  
  if (platform === 'unknown') {
    throw new APIError(
      'هذه المنصة غير مدعومة حالياً. نحن ندعم YouTube، TikTok، Instagram ومنصات أخرى شهيرة.',
      'UNSUPPORTED_PLATFORM',
      400
    )
  }

  try {
    const response = await httpClient(`${API_BASE_URL}/video/info`, {
      method: 'POST',
      body: JSON.stringify({ url: normalizedUrl })
    })

    if (!response.success) {
      throw new APIError(response.error, response.code, 500)
    }

    // Enhance the response with client-side processing
    const enhancedData = {
      ...response.data,
      platform,
      normalizedUrl,
      extractedAt: new Date().toISOString(),
      // Add quality labels and organize formats
      videoFormats: response.data.formats?.filter(f => f.height || f.vcodec !== 'none') || [],
      audioFormats: response.data.formats?.filter(f => f.acodec !== 'none' && !f.height) || []
    }

    return enhancedData

  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    // Fallback error message
    throw new APIError(
      'فشل في تحليل الفيديو. تأكد من صحة الرابط وأن الفيديو متاح.',
      'EXTRACTION_FAILED',
      500
    )
  }
}

// Real video download using serverless functions
export const downloadVideo = async (url, format, onProgress) => {
  // Validate inputs
  if (!url || !format) {
    throw new APIError('الرابط والتنسيق مطلوبان', 'MISSING_PARAMS', 400)
  }
  
  const normalizedUrl = normalizeUrl(url)
  const platform = detectPlatform(normalizedUrl)
  
  // Parse format to determine type and quality
  const formatInfo = parseFormatString(format)
  
  onProgress?.(0, 'جاري الاتصال بالخادم...')
  
  try {
    const response = await httpClient(`${API_BASE_URL}/video/download`, {
      method: 'POST',
      body: JSON.stringify({
        url: normalizedUrl,
        format: formatInfo.format,
        quality: formatInfo.quality,
        audioOnly: formatInfo.isAudio
      })
    })

    if (!response.success) {
      throw new APIError(response.error, response.code, 500)
    }

    // Simulate progress for better UX
    onProgress?.(25, 'جاري تحضير التحميل...')
    await delay(500)
    
    onProgress?.(50, 'جاري معالجة الملف...')
    await delay(800)
    
    onProgress?.(75, 'جاري إعداد رابط التحميل...')
    await delay(600)
    
    onProgress?.(90, 'تم تحضير الملف')
    await delay(400)
    
    // Trigger actual download
    if (response.data.downloadUrl) {
      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = response.data.downloadUrl
      link.download = response.data.filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    onProgress?.(100, 'تم بدء التحميل!')
    
    return {
      success: true,
      message: response.message || 'تم بدء التحميل! تحقق من مجلد التحميلات',
      fileName: response.data.filename,
      filesize: response.data.filesize,
      platform,
      format: formatInfo
    }

  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    throw new APIError(
      'فشل في تحميل الفيديو. حاول مرة أخرى.',
      'DOWNLOAD_FAILED',
      500
    )
  }
}

// Parse format string to extract type and quality info
function parseFormatString(format) {
  const audioFormats = ['mp3', 'aac', 'opus', 'flac', 'wav']
  const isAudio = audioFormats.some(af => format.toLowerCase().includes(af))
  
  // Extract quality info
  const qualityMatch = format.match(/(\d+p|\d+kbps|best|worst|lossless)/i)
  const quality = qualityMatch ? qualityMatch[1].toLowerCase() : 'best'
  
  // Extract format
  const formatMatch = format.match(/(mp4|webm|mp3|aac|opus|flac|wav)/i)
  const extractedFormat = formatMatch ? formatMatch[1].toLowerCase() : (isAudio ? 'mp3' : 'mp4')
  
  return {
    format: extractedFormat,
    quality: quality,
    isAudio: isAudio,
    original: format
  }
}

// Enhanced URL validation with auto-fixing
export const isValidUrl = (string) => {
  try {
    // Clean URL from spaces and invisible characters
    const cleanUrl = string.trim().replace(/[\u200B-\u200D\uFEFF]/g, '')
    
    // Add protocol if missing
    const urlWithProtocol = cleanUrl.startsWith('http') ? cleanUrl : 'https://' + cleanUrl
    
    const url = new URL(urlWithProtocol)
    
    // Check for valid protocol
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false
    }
    
    // Check for valid hostname
    if (!url.hostname || url.hostname.length < 3) {
      return false
    }
    
    // Check for localhost or IP addresses (for security)
    if (url.hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

// Auto-fix URL format
export const normalizeUrl = (url) => {
  try {
    const cleanUrl = url.trim().replace(/[\u200B-\u200D\uFEFF]/g, '')
    const urlWithProtocol = cleanUrl.startsWith('http') ? cleanUrl : 'https://' + cleanUrl
    return new URL(urlWithProtocol).href
  } catch {
    return url
  }
}

// Helper function to detect platform from URL with enhanced detection
export const detectPlatform = (url) => {
  const cleanUrl = url.toLowerCase().trim()
  
  const patterns = {
    youtube: /(youtube\.com|youtu\.be|youtube-nocookie\.com|m\.youtube\.com|gaming\.youtube\.com)/i,
    tiktok: /(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com|m\.tiktok\.com)/i,
    instagram: /(instagram\.com|instagr\.am)/i,
    facebook: /(facebook\.com|fb\.watch|fb\.me|m\.facebook\.com|web\.facebook\.com|business\.facebook\.com)/i,
    twitter: /(twitter\.com|x\.com|t\.co|mobile\.twitter\.com)/i,
    vimeo: /(vimeo\.com|player\.vimeo\.com)/i,
    dailymotion: /(dailymotion\.com|dai\.ly)/i,
    twitch: /(twitch\.tv|clips\.twitch\.tv|m\.twitch\.tv)/i,
    reddit: /(reddit\.com|redd\.it|v\.redd\.it|old\.reddit\.com|new\.reddit\.com|m\.reddit\.com)/i,
    soundcloud: /(soundcloud\.com|snd\.sc|m\.soundcloud\.com)/i,
    linkedin: /(linkedin\.com|lnkd\.in)/i,
    pinterest: /(pinterest\.com|pin\.it)/i,
    snapchat: /(snapchat\.com|story\.snapchat\.com)/i,
    bilibili: /(bilibili\.com|b23\.tv)/i,
    weibo: /(weibo\.com|weibo\.cn|t\.cn)/i,
    vk: /(vk\.com|vk\.ru)/i,
    ok: /(ok\.ru|odnoklassniki\.ru)/i,
    rutube: /rutube\.ru/i,
    yandex: /yandex\.ru/i,
    coub: /coub\.com/i,
    vine: /vine\.co/i,
    ted: /ted\.com/i,
    bandcamp: /bandcamp\.com/i,
    mixcloud: /mixcloud\.com/i
  }
  
  for (const [platform, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleanUrl)) return platform
  }
  
  return 'unknown'
}

// Generate mock video information
const generateMockVideoInfo = (platform, url) => {
  const titles = {
    youtube: [
      'كيفية تعلم البرمجة في 30 يوماً',
      'أفضل النصائح للمبرمجين المبتدئين',
      'شرح React.js بالعربية - الدرس الأول',
      'مقارنة بين لغات البرمجة المختلفة'
    ],
    tiktok: [
      'رقصة ترند جديدة 🔥',
      'طبخة سريعة ولذيذة',
      'نصائح للدراسة بفعالية',
      'كوميديا يومية مضحكة'
    ],
    instagram: [
      'خلف الكواليس - جلسة تصوير',
      'نصائح الموضة للشتاء',
      'وصفة الحلوى المفضلة',
      'تمارين رياضية منزلية'
    ],
    facebook: [
      'لحظات مميزة مع العائلة',
      'إعلان منتج جديد مثير',
      'مقطع تحفيزي ملهم',
      'شرح تقني مفصل'
    ]
  }
  
  const uploaders = {
    youtube: ['أكاديمية البرمجة', 'قناة التقنية العربية', 'تعلم مع أحمد', 'المبرمج العربي'],
    tiktok: ['@sara_content', '@ahmed_trends', '@tech_tips_ar', '@comedy_arabic'],
    instagram: ['@lifestyle_blogger', '@tech_reviewer', '@food_lover', '@fitness_coach'],
    facebook: ['صفحة التقنية', 'مجتمع المطورين', 'أخبار التكنولوجيا', 'تعليم مجاني']
  }
  
  const platformTitles = titles[platform] || titles.youtube
  const platformUploaders = uploaders[platform] || uploaders.youtube
  
  const title = platformTitles[Math.floor(Math.random() * platformTitles.length)]
  const uploader = platformUploaders[Math.floor(Math.random() * platformUploaders.length)]
  
  return {
    id: generateVideoId(),
    title,
    description: `${title} - محتوى رائع ومفيد يستحق المشاهدة. تم إنشاؤه بعناية لتقديم أفضل تجربة للمشاهدين.`,
    uploader,
    uploader_id: uploader.replace(/[@\s]/g, '').toLowerCase(),
    duration: Math.floor(Math.random() * 1800) + 60, // 1-30 minutes
    view_count: Math.floor(Math.random() * 1000000) + 1000,
    like_count: Math.floor(Math.random() * 50000) + 100,
    upload_date: generateRandomDate(),
    thumbnail: generateThumbnailUrl(platform),
    extractor: platform,
    webpage_url: url,
    formats: generateMockFormats()
  }
}

// Generate random video ID
const generateVideoId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Generate random upload date
const generateRandomDate = () => {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return randomDate.toISOString().split('T')[0]
}

// Generate mock thumbnail URL
const generateThumbnailUrl = (platform) => {
  const colors = ['3B82F6', 'EF4444', '10B981', 'F59E0B', '8B5CF6', 'F97316']
  const color = colors[Math.floor(Math.random() * colors.length)]
  return `https://via.placeholder.com/640x360/${color}/FFFFFF?text=${platform.toUpperCase()}`
}

// Generate comprehensive mock video/audio formats
const generateMockFormats = () => {
  const videoFormats = [
    {
      format_id: '401',
      ext: 'mp4',
      width: 3840,
      height: 2160,
      fps: 60,
      vcodec: 'av01.0.12M.10.0.110.09.16.09.0',
      acodec: 'opus',
      filesize: 1024 * 1024 * 512, // 512MB
      quality: '4K (2160p60)',
      format_note: 'HDR, VP9'
    },
    {
      format_id: '400',
      ext: 'mp4',
      width: 3840,
      height: 2160,
      fps: 30,
      vcodec: 'avc1.640033',
      acodec: 'mp4a.40.2',
      filesize: 1024 * 1024 * 300, // 300MB
      quality: '4K (2160p)',
      format_note: 'Premium'
    },
    {
      format_id: '303',
      ext: 'webm',
      width: 1920,
      height: 1080,
      fps: 60,
      vcodec: 'vp9.2',
      acodec: 'opus',
      filesize: 1024 * 1024 * 150, // 150MB
      quality: '1080p60',
      format_note: 'VP9, High Frame Rate'
    },
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
      format_id: '134',
      ext: 'mp4',
      width: 640,
      height: 360,
      fps: 30,
      vcodec: 'avc1.4d401e',
      acodec: 'none',
      filesize: 12345678,
      quality: '360p',
      format_note: 'Video only'
    }
  ]
  
  const audioFormats = [
    {
      format_id: 'audio-320',
      ext: 'mp3',
      abr: 320,
      acodec: 'mp3',
      filesize: 1024 * 1024 * 12, // 12MB
      quality: 'Audio MP3 (320kbps)',
      format_note: 'High Quality Audio'
    },
    {
      format_id: 'audio-256',
      ext: 'aac',
      abr: 256,
      acodec: 'aac',
      filesize: 1024 * 1024 * 10, // 10MB
      quality: 'Audio AAC (256kbps)',
      format_note: 'High Quality Audio'
    },
    {
      format_id: 'audio-128',
      ext: 'mp3',
      abr: 128,
      acodec: 'mp3',
      filesize: 1024 * 1024 * 5, // 5MB
      quality: 'Audio MP3 (128kbps)',
      format_note: 'Standard Quality Audio'
    },
    {
      format_id: 'audio-96',
      ext: 'opus',
      abr: 96,
      acodec: 'opus',
      filesize: 1024 * 1024 * 4, // 4MB
      quality: 'Audio OPUS (96kbps)',
      format_note: 'Compressed Audio'
    },
    {
      format_id: 'audio-flac',
      ext: 'flac',
      abr: 1411,
      acodec: 'flac',
      filesize: 1024 * 1024 * 45, // 45MB
      quality: 'Audio FLAC (Lossless)',
      format_note: 'Studio Quality Audio'
    }
  ]
  
  return [...videoFormats, ...audioFormats]
}

// Get supported platforms list
export const getSupportedPlatforms = async () => {
  await delay(500)
  
  return [
    {
      name: 'YouTube',
      key: 'youtube',
      description: 'أكبر منصة فيديو في العالم',
      features: ['8K', '4K', 'HDR', 'Subtitles', 'Playlists', 'Live Streams'],
      domain: 'youtube.com'
    },
    {
      name: 'TikTok',
      key: 'tiktok',
      description: 'منصة الفيديوهات القصيرة الشهيرة',
      features: ['HD', 'No Watermark', 'Original Audio'],
      domain: 'tiktok.com'
    },
    {
      name: 'Instagram',
      key: 'instagram',
      description: 'فيديوهات وريلز وقصص انستجرام',
      features: ['Stories', 'Reels', 'IGTV', 'Posts', 'Live Videos'],
      domain: 'instagram.com'
    },
    {
      name: 'Facebook',
      key: 'facebook',
      description: 'فيديوهات فيسبوك وWatch',
      features: ['HD', 'Live Videos', 'Stories', 'Watch Party'],
      domain: 'facebook.com'
    },
    {
      name: 'Twitter/X',
      key: 'twitter',
      description: 'فيديوهات وGIFs تويتر/إكس',
      features: ['HD', 'GIFs', 'Live Spaces', 'Fleets'],
      domain: 'twitter.com'
    },
    {
      name: 'Vimeo',
      key: 'vimeo',
      description: 'منصة الفيديو الاحترافية',
      features: ['8K', '4K', 'HDR', 'No Ads', 'Privacy Controls'],
      domain: 'vimeo.com'
    },
    {
      name: 'Dailymotion',
      key: 'dailymotion',
      description: 'منصة الفيديو الفرنسية',
      features: ['HD', '4K', 'Live TV', 'News'],
      domain: 'dailymotion.com'
    },
    {
      name: 'Twitch',
      key: 'twitch',
      description: 'منصة بث الألعاب',
      features: ['HD', '4K', 'Live Streams', 'Clips', 'VODs'],
      domain: 'twitch.tv'
    },
    {
      name: 'SoundCloud',
      key: 'soundcloud',
      description: 'منصة الصوت والموسيقى',
      features: ['High Quality Audio', 'Playlists', 'Podcasts'],
      domain: 'soundcloud.com'
    },
    {
      name: 'Reddit',
      key: 'reddit',
      description: 'فيديوهات من مجتمع Reddit',
      features: ['HD', 'GIFs', 'Live Streams'],
      domain: 'reddit.com'
    },
    {
      name: 'Bilibili',
      key: 'bilibili',
      description: 'منصة الفيديو الصينية',
      features: ['4K', 'HD', 'Anime', 'Live Streams'],
      domain: 'bilibili.com'
    }
  ]
}

// Search for videos (mock function)
export const searchVideos = async (query, platform = 'all') => {
  await delay(1000)
  
  // Mock search results
  const results = Array.from({ length: 10 }, (_, i) => ({
    id: generateVideoId(),
    title: `${query} - نتيجة البحث ${i + 1}`,
    uploader: `قناة رقم ${i + 1}`,
    duration: Math.floor(Math.random() * 1800) + 60,
    view_count: Math.floor(Math.random() * 1000000) + 1000,
    thumbnail: generateThumbnailUrl(platform === 'all' ? 'search' : platform),
    platform: platform === 'all' ? ['youtube', 'vimeo', 'dailymotion'][Math.floor(Math.random() * 3)] : platform
  }))
  
  return results
}

// Get download statistics (mock)
export const getDownloadStats = async () => {
  await delay(800)
  
  return {
    totalDownloads: 2547836,
    todayDownloads: 15423,
    activeUsers: 125000,
    supportedPlatforms: 50,
    avgDownloadTime: '3.2s',
    successRate: '99.8%'
  }
}

// Report a problem with video (mock)
export const reportProblem = async (url, problemType, description) => {
  await delay(1000)
  
  console.log('تم إرسال بلاغ:', { url, problemType, description })
  
  return {
    success: true,
    reportId: generateVideoId(),
    message: 'تم استلام البلاغ وسيتم مراجعته قريباً'
  }
}

export default {
  getVideoInfo,
  downloadVideo,
  isValidUrl,
  detectPlatform,
  getSupportedPlatforms,
  searchVideos,
  getDownloadStats,
  reportProblem
}