import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Link as LinkIcon, 
  Search,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowRight,
  Settings,
  Info
} from 'lucide-react'
import { useVideoDownload } from '../../hooks/useVideoDownload'

const DownloadSection: React.FC = () => {
  const [url, setUrl] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('mp4')
  const [selectedQuality, setSelectedQuality] = useState('720p')
  
  const {
    extractInfo,
    prepareDownload,
    videoInfo,
    downloadData,
    isLoading,
    isExtracting,
    error,
    clearError
  } = useVideoDownload()

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    
    clearError()
    await extractInfo(url.trim())
  }

  const handleDownload = async () => {
    if (!videoInfo) return
    await prepareDownload(url, selectedFormat, selectedQuality)
  }

  const formats = [
    { value: 'mp4', label: 'MP4 Video', description: 'الأكثر توافقاً' },
    { value: 'webm', label: 'WebM Video', description: 'جودة عالية' },
    { value: 'mp3', label: 'MP3 Audio', description: 'صوت فقط' }
  ]

  const qualities = [
    { value: '144p', label: '144p', description: 'حجم صغير' },
    { value: '360p', label: '360p', description: 'جودة عادية' },
    { value: '720p', label: '720p HD', description: 'مُوصى به' },
    { value: '1080p', label: '1080p Full HD', description: 'أفضل جودة' }
  ]

  const supportedPlatforms = [
    { name: 'YouTube', color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'TikTok', color: 'text-black', bg: 'bg-gray-50' },
    { name: 'Instagram', color: 'text-pink-500', bg: 'bg-pink-50' },
    { name: 'Facebook', color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Twitter', color: 'text-blue-400', bg: 'bg-blue-50' },
    { name: 'Vimeo', color: 'text-blue-600', bg: 'bg-blue-50' }
  ]

  return (
    <section id="download" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            تحميل سريع وآمن 🚀
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اتضع رابط الفيديو وسنقوم بتحضير الملف للتحميل خلال ثوانٍ قليلة
          </p>
        </motion.div>

        {/* Main Download Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg"
        >
          
          {/* URL Input Form */}
          <form onSubmit={handleUrlSubmit} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="الصق رابط الفيديو هنا... (YouTube, TikTok, Instagram, إلخ)"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-right placeholder-gray-400"
                  dir="ltr"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isExtracting || !url.trim()}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isExtracting ? (
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
              </motion.button>
            </div>
          </form>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 rtl:space-x-reverse"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-700 font-medium">حدث خطأ</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Info Display */}
          <AnimatePresence>
            {videoInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-green-700 font-medium mb-2">تم العثور على الفيديو بنجاح!</p>
                      
                      {/* Video Preview */}
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                          {videoInfo.thumbnail && (
                            <img
                              src={videoInfo.thumbnail}
                              alt={videoInfo.title}
                              className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{videoInfo.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              المنصة: <span className="font-medium">{videoInfo.platform}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              المدة: <span className="font-medium">{Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Format and Quality Selection */}
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  
                  {/* Format Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Settings className="w-4 h-4 inline ml-1" />
                      نوع الملف
                    </label>
                    <div className="space-y-2">
                      {formats.map((format) => (
                        <label key={format.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="format"
                            value={format.value}
                            checked={selectedFormat === format.value}
                            onChange={(e) => setSelectedFormat(e.target.value)}
                            className="ml-3 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{format.label}</div>
                            <div className="text-sm text-gray-500">{format.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quality Selection */}
                  {selectedFormat !== 'mp3' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <Info className="w-4 h-4 inline ml-1" />
                        الجودة
                      </label>
                      <div className="space-y-2">
                        {qualities.map((quality) => (
                          <label key={quality.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="quality"
                              value={quality.value}
                              checked={selectedQuality === quality.value}
                              onChange={(e) => setSelectedQuality(e.target.value)}
                              className="ml-3 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{quality.label}</div>
                              <div className="text-sm text-gray-500">{quality.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-3 rtl:space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>جاري تحضير التحميل...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>تحميل {selectedFormat.toUpperCase()} - {selectedFormat !== 'mp3' ? selectedQuality : 'Audio'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Download Ready */}
          <AnimatePresence>
            {downloadData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 bg-gradient-to-br from-green-50 to-secondary-50 border border-green-200 rounded-xl"
              >
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">الملف جاهز للتحميل! 🎉</h3>
                  <p className="text-gray-600 mb-6">
                    اسم الملف: <span className="font-medium">{downloadData.filename}</span>
                  </p>
                  
                  <motion.a
                    href={downloadData.downloadUrl}
                    download={downloadData.filename}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-gradient-to-r from-green-600 to-secondary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Download className="w-6 h-6" />
                    <span>تحميل الآن</span>
                  </motion.a>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    حجم الملف: {downloadData.filesize ? `~${Math.round(downloadData.filesize / (1024 * 1024))}MB` : 'غير محدد'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Supported Platforms */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">المنصات المدعومة:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {supportedPlatforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`px-3 py-1.5 ${platform.bg} ${platform.color} rounded-full text-sm font-medium`}
                >
                  {platform.name}
                </motion.div>
              ))}
              <div className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                +994 منصة أخرى
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DownloadSection