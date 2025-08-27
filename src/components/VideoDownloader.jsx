import { useState, useCallback } from 'react'
import { Search, Download, AlertCircle, CheckCircle, Loader, Play, Volume2 } from 'lucide-react'
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
    { name: 'YouTube', key: 'youtube', color: 'bg-red-500', textColor: 'text-red-600' },
    { name: 'TikTok', key: 'tiktok', color: 'bg-black', textColor: 'text-gray-900' },
    { name: 'Instagram', key: 'instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500', textColor: 'text-purple-600' },
    { name: 'Facebook', key: 'facebook', color: 'bg-blue-600', textColor: 'text-blue-600' },
    { name: 'Twitter', key: 'twitter', color: 'bg-sky-500', textColor: 'text-sky-600' },
    { name: 'Vimeo', key: 'vimeo', color: 'bg-blue-500', textColor: 'text-blue-600' },
    { name: 'Dailymotion', key: 'dailymotion', color: 'bg-orange-500', textColor: 'text-orange-600' },
    { name: 'Twitch', key: 'twitch', color: 'bg-purple-600', textColor: 'text-purple-600' }
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
      twitch: 'https://www.twitch.tv/videos/123456789'
    }
    
    setUrl(exampleUrls[platform.key] || '')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Input Section */}
      <div className="card mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            حمل أي فيديو من{' '}
            <span className="gradient-text">الإنترنت</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أدخل رابط الفيديو من أي منصة مدعومة واحصل على معاينة فورية مع خيارات تحميل متعددة
          </p>
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
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">المنصات المدعومة:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {supportedPlatforms.map((platform) => (
              <button
                key={platform.key}
                onClick={() => handlePlatformClick(platform)}
                className={`platform-icon ${platform.color} hover:scale-110 transition-all duration-200 tooltip`}
                title={`انقر لتجربة ${platform.name}`}
              >
                <PlatformIcons platform={platform.key} className="w-5 h-5" />
              </button>
            ))}
          </div>
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

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Download className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">سريع ومجاني</h3>
          <p className="text-gray-600 text-sm">تحميل فوري بدون انتظار أو رسوم</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Play className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">جودة عالية</h3>
          <p className="text-gray-600 text-sm">من 144p إلى 4K حسب توفر الجودة</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-6 h-6 text-warning-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">صوت منفصل</h3>
          <p className="text-gray-600 text-sm">تحميل الصوت بتنسيقات MP3 و AAC</p>
        </div>
      </div>
    </div>
  )
}

export default VideoDownloader