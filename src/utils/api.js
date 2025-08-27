// API utilities for VidCatch Pro
// This file contains mock API functions for demonstration
// In production, these would connect to actual backend services

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock video information based on URL
export const getVideoInfo = async (url) => {
  await delay(1000 + Math.random() * 2000) // Simulate network delay
  
  // Validate URL format
  if (!isValidUrl(url)) {
    throw new Error('رابط غير صحيح. الرجاء التحقق من الرابط المدخل.')
  }
  
  const platform = detectPlatform(url)
  
  // Simulate different scenarios
  const random = Math.random()
  if (random < 0.1) {
    throw new Error('لا يمكن الوصول للفيديو. قد يكون محذوفاً أو محمياً.')
  }
  
  // Generate mock video info based on platform
  const mockData = generateMockVideoInfo(platform, url)
  
  return mockData
}

// Mock video download function
export const downloadVideo = async (url, format, onProgress) => {
  await delay(500) // Initial delay
  
  // Simulate download progress
  for (let progress = 0; progress <= 100; progress += Math.random() * 10) {
    const currentProgress = Math.min(100, Math.floor(progress))
    onProgress?.(currentProgress)
    await delay(200) // Simulate download time
  }
  
  // Simulate final processing
  await delay(1000)
  onProgress?.(100)
  
  // In a real implementation, this would trigger the actual file download
  console.log(`محاكاة تحميل: ${url} بتنسيق ${format}`)
  
  return {
    success: true,
    message: 'تم التحميل بنجاح!'
  }
}

// Helper function to validate URLs
export const isValidUrl = (string) => {
  try {
    const url = new URL(string)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

// Helper function to detect platform from URL
export const detectPlatform = (url) => {
  const patterns = {
    youtube: /(youtube\.com|youtu\.be)/i,
    tiktok: /tiktok\.com/i,
    instagram: /instagram\.com/i,
    facebook: /(facebook\.com|fb\.watch|fb\.me)/i,
    twitter: /(twitter\.com|x\.com|t\.co)/i,
    vimeo: /vimeo\.com/i,
    dailymotion: /dailymotion\.com/i,
    twitch: /twitch\.tv/i,
    reddit: /reddit\.com/i,
    soundcloud: /soundcloud\.com/i
  }
  
  for (const [platform, pattern] of Object.entries(patterns)) {
    if (pattern.test(url)) return platform
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

// Generate mock video formats
const generateMockFormats = () => {
  return [
    {
      format_id: '137',
      ext: 'mp4',
      width: 1920,
      height: 1080,
      fps: 30,
      vcodec: 'avc1',
      acodec: 'none',
      filesize: 45234567,
      quality: '1080p'
    },
    {
      format_id: '136',
      ext: 'mp4',
      width: 1280,
      height: 720,
      fps: 30,
      vcodec: 'avc1',
      acodec: 'none',
      filesize: 28765432,
      quality: '720p'
    },
    {
      format_id: '135',
      ext: 'mp4',
      width: 854,
      height: 480,
      fps: 30,
      vcodec: 'avc1',
      acodec: 'none',
      filesize: 18345678,
      quality: '480p'
    }
  ]
}

// Get supported platforms list
export const getSupportedPlatforms = async () => {
  await delay(500)
  
  return [
    {
      name: 'YouTube',
      key: 'youtube',
      description: 'أكبر منصة فيديو في العالم',
      features: ['4K', 'HD', 'Subtitles', 'Playlists'],
      domain: 'youtube.com'
    },
    {
      name: 'TikTok',
      key: 'tiktok',
      description: 'منصة الفيديوهات القصيرة الشهيرة',
      features: ['HD', 'No Watermark'],
      domain: 'tiktok.com'
    },
    {
      name: 'Instagram',
      key: 'instagram',
      description: 'فيديوهات وريلز انستجرام',
      features: ['Stories', 'Reels', 'IGTV', 'Posts'],
      domain: 'instagram.com'
    },
    {
      name: 'Facebook',
      key: 'facebook',
      description: 'فيديوهات فيسبوك العامة والخاصة',
      features: ['HD', 'Live Videos', 'Stories'],
      domain: 'facebook.com'
    },
    {
      name: 'Twitter/X',
      key: 'twitter',
      description: 'فيديوهات تويتر وإكس',
      features: ['HD', 'GIFs'],
      domain: 'twitter.com'
    },
    {
      name: 'Vimeo',
      key: 'vimeo',
      description: 'منصة الفيديو الاحترافية',
      features: ['4K', 'High Quality', 'No Ads'],
      domain: 'vimeo.com'
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