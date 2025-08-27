import { useState } from 'react'
import { Download, Volume2, Film, FileAudio, Loader, CheckCircle } from 'lucide-react'

const QualitySelector = ({ videoInfo, onDownload, downloadProgress }) => {
  const [selectedTab, setSelectedTab] = useState('video')

  // Mock data - في التطبيق الحقيقي، ستأتي من API
  const videoFormats = [
    { id: 'mp4_1080p', format: 'MP4', quality: '1080p', size: '45.2 MB', note: 'جودة عالية' },
    { id: 'mp4_720p', format: 'MP4', quality: '720p', size: '28.7 MB', note: 'جودة متوسطة' },
    { id: 'mp4_480p', format: 'MP4', quality: '480p', size: '18.3 MB', note: 'جودة قياسية' },
    { id: 'mp4_360p', format: 'MP4', quality: '360p', size: '12.1 MB', note: 'جودة منخفضة' },
    { id: 'webm_1080p', format: 'WebM', quality: '1080p', size: '38.9 MB', note: 'حجم أصغر' }
  ]

  const audioFormats = [
    { id: 'mp3_320kbps', format: 'MP3', quality: '320 kbps', size: '7.8 MB', note: 'جودة ممتازة' },
    { id: 'mp3_192kbps', format: 'MP3', quality: '192 kbps', size: '4.7 MB', note: 'جودة جيدة' },
    { id: 'mp3_128kbps', format: 'MP3', quality: '128 kbps', size: '3.1 MB', note: 'جودة قياسية' },
    { id: 'aac_256kbps', format: 'AAC', quality: '256 kbps', size: '6.2 MB', note: 'جودة عالية' },
    { id: 'flac', format: 'FLAC', quality: 'Lossless', size: '28.4 MB', note: 'بدون ضياع' }
  ]

  const tabs = [
    { id: 'video', name: 'فيديو', icon: Film, count: videoFormats.length },
    { id: 'audio', name: 'صوت', icon: Volume2, count: audioFormats.length }
  ]

  const getQualityColor = (quality) => {
    if (quality.includes('1080p') || quality === 'Lossless' || quality === '320 kbps') {
      return 'text-success-600 bg-success-50'
    }
    if (quality.includes('720p') || quality === '256 kbps' || quality === '192 kbps') {
      return 'text-primary-600 bg-primary-50'
    }
    return 'text-gray-600 bg-gray-50'
  }

  const isDownloading = (formatId) => {
    return downloadProgress?.format === formatId && downloadProgress?.status !== 'completed'
  }

  const isCompleted = (formatId) => {
    return downloadProgress?.format === formatId && downloadProgress?.status === 'completed'
  }

  const FormatItem = ({ format, type }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4 space-x-reverse flex-1">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {type === 'video' ? (
            <Film className="w-5 h-5 text-gray-600" />
          ) : (
            <FileAudio className="w-5 h-5 text-gray-600" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 space-x-reverse mb-1">
            <span className="font-medium text-gray-900">{format.format}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(format.quality)}`}>
              {format.quality}
            </span>
            {format.note && (
              <span className="text-xs text-gray-500">({format.note})</span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            حجم الملف: {format.size}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDownload(format.id)}
        disabled={isDownloading(format.id)}
        className={`download-btn flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isCompleted(format.id)
            ? 'bg-success-500 text-white'
            : isDownloading(format.id)
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
        }`}
      >
        {isCompleted(format.id) ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>مكتمل</span>
          </>
        ) : isDownloading(format.id) ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>جاري...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>تحميل</span>
          </>
        )}
      </button>
    </div>
  )

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">اختر التنسيق والجودة</h3>
        <p className="text-gray-600">اختر التنسيق المناسب لك من الخيارات المتاحة أدناه</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 space-x-reverse px-6 py-3 font-medium transition-colors border-b-2 ${
                selectedTab === tab.id
                  ? 'border-primary-600 text-primary-600 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Format List */}
      <div className="space-y-3">
        {selectedTab === 'video' ? (
          videoFormats.map((format) => (
            <FormatItem key={format.id} format={format} type="video" />
          ))
        ) : (
          audioFormats.map((format) => (
            <FormatItem key={format.id} format={format} type="audio" />
          ))
        )}
      </div>

      {/* Download Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 نصائح التحميل:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• اختر جودة 1080p للحصول على أفضل وضوح</li>
          <li>• استخدم MP3 320kbps للحصول على أفضل جودة صوت</li>
          <li>• تنسيق WebM يوفر حجم ملف أصغر مع جودة جيدة</li>
          <li>• FLAC لمحبي الصوت عالي الجودة (حجم أكبر)</li>
        </ul>
      </div>

      {/* Legal Notice */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          ⚠️ يرجى احترام حقوق الطبع والنشر واستخدام المحتوى المحمل للاستخدام الشخصي فقط
        </p>
      </div>
    </div>
  )
}

export default QualitySelector