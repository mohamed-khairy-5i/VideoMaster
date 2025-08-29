import { useState, useCallback, useEffect } from 'react'
import { Search, Download, AlertCircle, CheckCircle, Loader, Play, Volume2, Sparkles, Shield, Zap, Clock, Globe, Star, Users, TrendingUp, Award, Heart, Music, Video, Image, FileText, Monitor, Smartphone, Headphones, PlayCircle, FileVideo, FileAudio } from 'lucide-react'
import { downloadVideo, getVideoInfo } from '../utils/api'
import PlatformIcons from './PlatformIcons'
import VideoPreview from './VideoPreview'
import QualitySelector from './QualitySelector'

const VideoDownloader = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState(null)
  const [error, setError] = useState('')
  const [downloadProgress, setDownloadProgress] = useState(null)
  const [downloadMessage, setDownloadMessage] = useState('')

  const supportedPlatforms = [
    { name: 'YouTube', key: 'youtube', color: 'bg-red-500', textColor: 'text-red-600', IconComponent: PlayCircle },
    { name: 'TikTok', key: 'tiktok', color: 'bg-black', textColor: 'text-gray-900', IconComponent: Music },
    { name: 'Instagram', key: 'instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500', textColor: 'text-purple-600', IconComponent: Image },
    { name: 'Facebook', key: 'facebook', color: 'bg-blue-600', textColor: 'text-blue-600', IconComponent: Users },
    { name: 'Twitter', key: 'twitter', color: 'bg-sky-500', textColor: 'text-sky-600', IconComponent: Globe },
    { name: 'Vimeo', key: 'vimeo', color: 'bg-blue-500', textColor: 'text-blue-600', IconComponent: Video },
    { name: 'Dailymotion', key: 'dailymotion', color: 'bg-orange-500', textColor: 'text-orange-600', IconComponent: Monitor },
    { name: 'SoundCloud', key: 'soundcloud', color: 'bg-orange-400', textColor: 'text-orange-600', IconComponent: Headphones },
    { name: 'Reddit', key: 'reddit', color: 'bg-orange-600', textColor: 'text-orange-600', IconComponent: FileText },
    { name: 'LinkedIn', key: 'linkedin', color: 'bg-blue-700', textColor: 'text-blue-700', IconComponent: Users },
    { name: 'Pinterest', key: 'pinterest', color: 'bg-red-600', textColor: 'text-red-600', IconComponent: Image },
    { name: 'Snapchat', key: 'snapchat', color: 'bg-yellow-400', textColor: 'text-yellow-600', IconComponent: Smartphone },
    { name: 'Twitch', key: 'twitch', color: 'bg-purple-600', textColor: 'text-purple-600', IconComponent: Video },
    { name: 'Bilibili', key: 'bilibili', color: 'bg-pink-500', textColor: 'text-pink-600', IconComponent: PlayCircle },
    { name: 'Weibo', key: 'weibo', color: 'bg-red-400', textColor: 'text-red-600', IconComponent: Globe },
    { name: 'VK', key: 'vk', color: 'bg-blue-800', textColor: 'text-blue-800', IconComponent: Users }
  ]

  const handleUrlChange = (e) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    setError('')
    setVideoInfo(null)
  }

  const detectPlatform = (url) => {
    // تنظيف وتطبيع الرابط
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
      yandex: /yandex\.ru/i
    }
    
    for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanUrl)) return platform
    }
    return 'unknown'
  }

  const validateUrl = (url) => {
    try {
      // تنظيف الرابط من المسافات والأحرف الغريبة
      const cleanUrl = url.trim().replace(/[\u200B-\u200D\uFEFF]/g, '')
      
      // إضافة http إذا لم يكن موجود
      const urlWithProtocol = cleanUrl.startsWith('http') ? cleanUrl : 'https://' + cleanUrl
      
      const urlObj = new URL(urlWithProtocol)
      
      // التحقق من أن البروتوكول صحيح
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false
      }
      
      // التحقق من وجود domain صحيح
      if (!urlObj.hostname || urlObj.hostname.length < 3) {
        return false
      }
      
      return true
    } catch {
      return false
    }
  }

  const handleGetInfo = async () => {
    if (!url.trim()) {
      setError('الرجاء إدخال رابط الفيديو')
      return
    }

    if (!validateUrl(url)) {
      setError('الرابط غير صحيح. تأكد من إدخال رابط صالح')
      return
    }

    const platform = detectPlatform(url)
    if (platform === 'unknown') {
      setError('هذه المنصة غير مدعومة حالياً. نحن ندعم YouTube، TikTok، Instagram ومنصات أخرى شهيرة.')
      return
    }

    setLoading(true)
    setError('')
    setVideoInfo(null) // Clear previous results

    try {
      const info = await getVideoInfo(url)
      setVideoInfo(info)
      
      // Show success message briefly
      const successMsg = `تم تحليل الفيديو من ${platform.toUpperCase()} بنجاح`
      setError('')
      
    } catch (err) {
      console.error('Video info error:', err)
      
      // Enhanced error handling with specific messages
      let errorMessage = 'حدث خطأ أثناء تحليل الفيديو'
      
      if (err.code === 'RATE_LIMIT_EXCEEDED') {
        errorMessage = 'تم تجاوز الحد المسموح من الطلبات. انتظر قليلاً قبل المحاولة مرة أخرى.'
      } else if (err.code === 'VIDEO_UNAVAILABLE') {
        errorMessage = 'الفيديو غير متاح أو محذوف أو خاص. تأكد من صحة الرابط.'
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'مشكلة في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (format) => {
    if (!videoInfo) return

    setDownloadProgress({ format, progress: 0, status: 'preparing' })
    setDownloadMessage('جاري التحضير...')
    setError('')

    try {
      await downloadVideo(url, format, (progress, message) => {
        setDownloadProgress(prev => ({ 
          ...prev, 
          progress, 
          status: progress < 100 ? 'downloading' : 'completed' 
        }))
        setDownloadMessage(message || 'جاري التحميل...')
      })
      
      setDownloadProgress(prev => ({ ...prev, progress: 100, status: 'completed' }))
      setDownloadMessage('تم التحميل بنجاح! تحقق من مجلد التحميلات')
      
      // Reset after 5 seconds
      setTimeout(() => {
        setDownloadProgress(null)
        setDownloadMessage('')
      }, 5000)
    } catch (err) {
      console.error('Download error:', err)
      const errorMessage = err.message || 'حدث خطأ أثناء تحميل الفيديو'
      setError(errorMessage)
      setDownloadProgress(null)
      setDownloadMessage('')
    }
  }

  const handlePlatformClick = (platform) => {
    const exampleUrls = {
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tiktok: 'https://www.tiktok.com/@username/video/7234567890123456789',
      instagram: 'https://www.instagram.com/reel/CvXyZ123456/',
      facebook: 'https://www.facebook.com/watch/?v=123456789012345',
      twitter: 'https://twitter.com/username/status/1234567890123456789',
      vimeo: 'https://vimeo.com/123456789',
      dailymotion: 'https://www.dailymotion.com/video/x7abcdef',
      soundcloud: 'https://soundcloud.com/artist/amazing-track-2024',
      reddit: 'https://www.reddit.com/r/videos/comments/abc123/amazing_video_title/',
      linkedin: 'https://www.linkedin.com/posts/username_video-activity-1234567890',
      pinterest: 'https://www.pinterest.com/pin/123456789012345678/',
      snapchat: 'https://story.snapchat.com/p/abc123def456ghi789',
      twitch: 'https://www.twitch.tv/videos/123456789',
      bilibili: 'https://www.bilibili.com/video/BV1xx411c7XZ',
      weibo: 'https://weibo.com/tv/show/1034:abc123def456',
      vk: 'https://vk.com/video123456_789012345'
    }
    
    setUrl(exampleUrls[platform.key] || '')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Input Section */}
      <div className="card mb-8">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl -z-10"></div>
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>أكثر من 15 مليون فيديو تم تحميله بنجاح</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              محمل الفيديو{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">الاحترافي</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              تقنية متطورة لتحميل الفيديوهات من 100+ منصة بجودة تصل إلى 8K
              <br/>
              <span className="text-lg font-semibold text-gray-800 mt-2 block flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>آمن بنسبة 100%</span>
                <Zap className="w-5 h-5 text-blue-600" />
                <span>سريع كالبرق</span>
                <Heart className="w-5 h-5 text-red-500" />
                <span>مجاني بالكامل</span>
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="الصق رابط الفيديو هنا... (مثال: https://www.youtube.com/watch?v=...)"
              className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
              dir="ltr"
            />
            {error && (
              <div className="flex items-center space-x-2 space-x-reverse mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleGetInfo}
            disabled={loading || !url.trim()}
            className="btn-primary flex items-center justify-center space-x-2 space-x-reverse min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>جاري التحليل...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>تحليل الرابط</span>
              </>
            )}
          </button>
        </div>

        {/* Supported Platforms */}
        <div className="text-center bg-gray-50 p-6 rounded-2xl">
          <div className="flex items-center justify-center mb-4 gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <Star className="w-5 h-5 text-yellow-500" />
            <p className="text-gray-700 font-medium">100+ منصة مدعومة • خالي من الإعلانات المضللة • بدون برامج ضارة</p>
            <Award className="w-5 h-5 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-3 max-w-4xl mx-auto">
            {supportedPlatforms.map((platform) => (
              <button
                key={platform.key}
                onClick={() => handlePlatformClick(platform)}
                className="group relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105"
                title={`تجربة ${platform.name}`}
              >
                <div className="mb-1 flex justify-center">
                  <platform.IconComponent className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-xs font-medium text-gray-600 group-hover:text-gray-800 truncate">{platform.name}</div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">انقر على أي منصة لتجربة رابط تجريبي</p>
        </div>
      </div>

      {/* Video Preview & Download Options */}
      {videoInfo && (
        <div className="space-y-6 animate-fade-in">
          <VideoPreview videoInfo={videoInfo} />
          <QualitySelector 
            videoInfo={videoInfo}
            onDownload={handleDownload}
            downloadProgress={downloadProgress}
          />
        </div>
      )}

      {/* Download Progress */}
      {downloadProgress && (
        <div className="card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Download className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {downloadProgress.status === 'completed' ? 'تم التحميل!' : 'جاري التحميل...'}
                </h3>
                <p className="text-sm text-gray-600">تنسيق: {downloadProgress.format}</p>
                {downloadMessage && (
                  <p className="text-xs text-blue-600 mt-1">{downloadMessage}</p>
                )}
              </div>
            </div>
            
            {downloadProgress.status === 'completed' ? (
              <div className="flex items-center space-x-2 space-x-reverse text-success-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">مكتمل!</span>
              </div>
            ) : (
              <div className="text-sm font-medium text-primary-600">
                {downloadProgress.progress}%
              </div>
            )}
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${downloadProgress.progress}%` }}
            />
          </div>
          
          {downloadMessage && (
            <p className="text-sm text-center mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-medium">{downloadMessage}</span>
            </p>
          )}
        </div>
      )}

      {/* Enhanced Features Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">لماذا نحن الأفضل؟</h2>
          <p className="text-gray-600 text-lg">ميزات متطورة لا تجدها في أي مكان آخر</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">سرعة البرق</h3>
            <p className="text-gray-600 text-sm leading-relaxed">تحميل فوري بتقنية CDN المتطورة</p>
            <div className="text-xs text-blue-600 font-medium mt-2">&lt; 3 ثوانٍ</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">أمان مطلق</h3>
            <p className="text-gray-600 text-sm leading-relaxed">بدون برامج ضارة أو تتبع</p>
            <div className="text-xs text-green-600 font-medium mt-2">SSL مشفر</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">جودة 4K</h3>
            <p className="text-gray-600 text-sm leading-relaxed">أعلى جودة متاحة من المصدر</p>
            <div className="text-xs text-purple-600 font-medium mt-2">حتى 8K</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center group">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Volume2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">صوت نقي</h3>
            <p className="text-gray-600 text-sm leading-relaxed">استخراج صوت بجودة استوديو</p>
            <div className="text-xs text-orange-600 font-medium mt-2">MP3/FLAC</div>
          </div>
        </div>
        
        <div className="text-center mt-8 p-4 bg-white/70 rounded-xl">
          <div className="flex items-center justify-center space-x-6 space-x-reverse text-sm text-gray-600">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>15M+ عملية تحميل ناجحة</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>متوفر 24/7</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Download className="w-4 h-4 text-purple-500" />
              <span>بدون حدود</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoDownloader