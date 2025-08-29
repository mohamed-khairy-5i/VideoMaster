import { useState, useCallback, useEffect } from 'react'
import { Search, Download, AlertCircle, CheckCircle, Loader, Play, Volume2, Sparkles, Shield, Zap, Clock } from 'lucide-react'
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

  const supportedPlatforms = [
    { name: 'YouTube', key: 'youtube', color: 'bg-red-500', textColor: 'text-red-600', icon: '🎬' },
    { name: 'TikTok', key: 'tiktok', color: 'bg-black', textColor: 'text-gray-900', icon: '🎵' },
    { name: 'Instagram', key: 'instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500', textColor: 'text-purple-600', icon: '📸' },
    { name: 'Facebook', key: 'facebook', color: 'bg-blue-600', textColor: 'text-blue-600', icon: '👥' },
    { name: 'Twitter', key: 'twitter', color: 'bg-sky-500', textColor: 'text-sky-600', icon: '🐦' },
    { name: 'Vimeo', key: 'vimeo', color: 'bg-blue-500', textColor: 'text-blue-600', icon: '🎭' },
    { name: 'Dailymotion', key: 'dailymotion', color: 'bg-orange-500', textColor: 'text-orange-600', icon: '📺' },
    { name: 'SoundCloud', key: 'soundcloud', color: 'bg-orange-400', textColor: 'text-orange-600', icon: '🎧' },
    { name: 'Reddit', key: 'reddit', color: 'bg-orange-600', textColor: 'text-orange-600', icon: '📖' },
    { name: 'LinkedIn', key: 'linkedin', color: 'bg-blue-700', textColor: 'text-blue-700', icon: '💼' },
    { name: 'Pinterest', key: 'pinterest', color: 'bg-red-600', textColor: 'text-red-600', icon: '📌' },
    { name: 'Snapchat', key: 'snapchat', color: 'bg-yellow-400', textColor: 'text-yellow-600', icon: '👻' }
  ]

  const handleUrlChange = (e) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    setError('')
    setVideoInfo(null)
  }

  const detectPlatform = (url) => {
    const patterns = {
      youtube: /(youtube\.com|youtu\.be)/,
      tiktok: /tiktok\.com/,
      instagram: /instagram\.com/,
      facebook: /(facebook\.com|fb\.watch)/,
      twitter: /(twitter\.com|x\.com)/,
      vimeo: /vimeo\.com/,
      dailymotion: /dailymotion\.com/,
      twitch: /twitch\.tv/
    }
    
    for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(url)) return platform
    }
    return 'unknown'
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
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
      setError('المنصة غير مدعومة. تحقق من قائمة المنصات المدعومة أدناه')
      return
    }

    setLoading(true)
    setError('')

    try {
      const info = await getVideoInfo(url)
      setVideoInfo(info)
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء الحصول على معلومات الفيديو')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (format) => {
    if (!videoInfo) return

    setDownloadProgress({ format, progress: 0, status: 'preparing' })

    try {
      await downloadVideo(url, format, (progress) => {
        setDownloadProgress(prev => ({ ...prev, progress, status: 'downloading' }))
      })
      
      setDownloadProgress(prev => ({ ...prev, progress: 100, status: 'completed' }))
      
      // Reset after 3 seconds
      setTimeout(() => {
        setDownloadProgress(null)
      }, 3000)
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل الفيديو')
      setDownloadProgress(null)
    }
  }

  const handlePlatformClick = (platform) => {
    const exampleUrls = {
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tiktok: 'https://www.tiktok.com/@username/video/1234567890',
      instagram: 'https://www.instagram.com/p/ABC123/',
      facebook: 'https://www.facebook.com/watch/?v=1234567890',
      twitter: 'https://twitter.com/username/status/1234567890',
      vimeo: 'https://vimeo.com/123456789',
      dailymotion: 'https://www.dailymotion.com/video/x123456',
      soundcloud: 'https://soundcloud.com/artist/track-name',
      reddit: 'https://www.reddit.com/r/videos/comments/abc123/title/',
      linkedin: 'https://www.linkedin.com/posts/user_video-123456',
      pinterest: 'https://www.pinterest.com/pin/123456789/',
      snapchat: 'https://story.snapchat.com/p/abc123'
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
              تقنية متطورة لتحميل الفيديوهات من 85+ منصة بجودة تصل إلى 4K
              <br/>
              <span className="text-lg font-semibold text-gray-800 mt-2 block">سريع • آمن • مجاني بالكامل</span>
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
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-5 h-5 text-green-600 ml-2" />
            <p className="text-gray-700 font-medium">85+ منصة مدعومة بأمان تام</p>
          </div>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-3 max-w-4xl mx-auto">
            {supportedPlatforms.map((platform) => (
              <button
                key={platform.key}
                onClick={() => handlePlatformClick(platform)}
                className="group relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105"
                title={`تجربة ${platform.name}`}
              >
                <div className="text-2xl mb-1">{platform.icon}</div>
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
                <h3 className="font-semibold text-gray-900">جاري التحميل...</h3>
                <p className="text-sm text-gray-600">تنسيق: {downloadProgress.format}</p>
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
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            {downloadProgress.status === 'preparing' && 'جاري تحضير الملف...'}
            {downloadProgress.status === 'downloading' && 'جاري التحميل...'}
            {downloadProgress.status === 'completed' && 'تم التحميل بنجاح! تحقق من مجلد التحميلات'}
          </p>
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