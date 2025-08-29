import { useState } from 'react'
import { Download, Volume2, Film, FileAudio, Loader, CheckCircle, Sparkles, Crown, Zap, Award, Star } from 'lucide-react'

const QualitySelector = ({ videoInfo, onDownload, downloadProgress }) => {
  const [selectedTab, setSelectedTab] = useState('video')

  // Enhanced video formats with realistic data
  const videoFormats = [
    { id: 'mp4_4k_hdr', format: 'MP4', quality: '4K HDR (2160p60)', size: '512 MB', note: 'حصري - جودة سينمائية', premium: true, icon: Crown },
    { id: 'mp4_4k', format: 'MP4', quality: '4K (2160p)', size: '300 MB', note: 'جودة فائقة', premium: true, icon: Sparkles },
    { id: 'webm_1080p60', format: 'WebM', quality: '1080p60', size: '150 MB', note: 'عالي الإطارات', icon: Zap },
    { id: 'mp4_1080p', format: 'MP4', quality: '1080p', size: '95 MB', note: 'جودة عالية - الأكثر شعبية', popular: true, icon: Star },
    { id: 'mp4_720p', format: 'MP4', quality: '720p', size: '65 MB', note: 'جودة متوسطة', icon: null },
    { id: 'mp4_480p', format: 'MP4', quality: '480p', size: '35 MB', note: 'جودة قياسية', icon: null },
    { id: 'mp4_360p', format: 'MP4', quality: '360p', size: '22 MB', note: 'توفير البيانات', icon: null },
    { id: 'webm_1080p', format: 'WebM', quality: '1080p', size: '78 MB', note: 'حجم محسن', icon: null }
  ]

  const audioFormats = [
    { id: 'flac_lossless', format: 'FLAC', quality: 'Lossless (1411 kbps)', size: '45 MB', note: 'جودة استوديو - بدون ضياع', premium: true, icon: Crown },
    { id: 'mp3_320kbps', format: 'MP3', quality: '320 kbps', size: '12 MB', note: 'جودة ممتازة - الأكثر شعبية', popular: true, icon: Star },
    { id: 'aac_256kbps', format: 'AAC', quality: '256 kbps', size: '10 MB', note: 'جودة عالية محسنة', icon: Award },
    { id: 'mp3_192kbps', format: 'MP3', quality: '192 kbps', size: '7.5 MB', note: 'جودة جيدة', icon: null },
    { id: 'mp3_128kbps', format: 'MP3', quality: '128 kbps', size: '5 MB', note: 'جودة قياسية', icon: null },
    { id: 'opus_96kbps', format: 'OPUS', quality: '96 kbps', size: '4 MB', note: 'ضغط متقدم', icon: null }
  ]

  const tabs = [
    { id: 'video', name: 'فيديو', icon: Film, count: videoFormats.length },
    { id: 'audio', name: 'صوت', icon: Volume2, count: audioFormats.length }
  ]

  const getQualityColor = (quality, premium, popular) => {
    if (premium) {
      return 'text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200'
    }
    if (popular) {
      return 'text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200'
    }
    if (quality.includes('4K') || quality.includes('2160p') || quality.includes('HDR')) {
      return 'text-red-600 bg-red-50 border border-red-200'
    }
    if (quality.includes('1080p') || quality.includes('Lossless') || quality === '320 kbps') {
      return 'text-success-600 bg-success-50 border border-success-200'
    }
    if (quality.includes('720p') || quality === '256 kbps' || quality === '192 kbps') {
      return 'text-primary-600 bg-primary-50 border border-primary-200'
    }
    return 'text-gray-600 bg-gray-50 border border-gray-200'
  }

  const isDownloading = (formatId) => {
    return downloadProgress?.format === formatId && downloadProgress?.status !== 'completed'
  }

  const isCompleted = (formatId) => {
    return downloadProgress?.format === formatId && downloadProgress?.status === 'completed'
  }

  const FormatItem = ({ format, type }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
      format.premium 
        ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-md'
        : format.popular
        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-md'
        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
    }`}>
      <div className="flex items-center space-x-4 space-x-reverse flex-1">
        <div className={`p-2 rounded-lg shadow-sm ${
          format.premium ? 'bg-gradient-to-r from-purple-100 to-pink-100' :
          format.popular ? 'bg-gradient-to-r from-yellow-100 to-orange-100' :
          'bg-white'
        }`}>
          {format.icon && format.icon !== null ? (
            <format.icon className={`w-5 h-5 ${
              format.premium ? 'text-purple-600' :
              format.popular ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
          ) : (
            type === 'video' ? (
              <Film className="w-5 h-5 text-gray-600" />
            ) : (
              <FileAudio className="w-5 h-5 text-gray-600" />
            )
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 space-x-reverse mb-1 flex-wrap gap-1">
            <span className={`font-medium ${
              format.premium ? 'text-purple-900' :
              format.popular ? 'text-yellow-900' :
              'text-gray-900'
            }`}>{format.format}</span>
            
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getQualityColor(format.quality, format.premium, format.popular)}`}>
              {format.quality}
            </span>
            
            {format.premium && (
              <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                حصري
              </span>
            )}
            
            {format.popular && (
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                الأكثر شعبية
              </span>
            )}
          </div>
          
          {format.note && (
            <div className={`text-sm font-medium ${
              format.premium ? 'text-purple-700' :
              format.popular ? 'text-yellow-700' :
              'text-gray-600'
            }`}>
              {format.note}
            </div>
          )}
          <div className={`text-sm ${
            format.premium ? 'text-purple-600' :
            format.popular ? 'text-yellow-600' :
            'text-gray-600'
          }`}>
            حجم الملف: <span className="font-semibold">{format.size}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDownload(format.id)}
        disabled={isDownloading(format.id)}
        className={`download-btn flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
          isCompleted(format.id)
            ? 'bg-success-500 text-white shadow-lg'
            : isDownloading(format.id)
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : format.premium
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
            : format.popular
            ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
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

      {/* Enhanced Download Tips */}
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-blue-900">نصائح الخبراء للتحميل الأمثل</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white/70 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">للجودة الفائقة:</span>
            </div>
            <p className="text-sm text-purple-800">4K HDR للشاشات الكبيرة، FLAC للصوت الاحترافي</p>
          </div>
          
          <div className="bg-white/70 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-900">الأكثر شعبية:</span>
            </div>
            <p className="text-sm text-yellow-800">1080p MP4 للفيديو، 320kbps MP3 للصوت</p>
          </div>
          
          <div className="bg-white/70 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">للسرعة:</span>
            </div>
            <p className="text-sm text-green-800">WebM لحجم أصغر، 720p للتوازن المثالي</p>
          </div>
          
          <div className="bg-white/70 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">للمحمول:</span>
            </div>
            <p className="text-sm text-blue-800">480p لتوفير البيانات، AAC للصوت المحسن</p>
          </div>
        </div>
      </div>

      {/* Enhanced Legal Notice */}
      <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-800">التزامنا بالقوانين</span>
        </div>
        <p className="text-sm text-gray-700 text-center leading-relaxed">
          نحن ملتزمون باحترام حقوق الطبع والنشر. يرجى استخدام المحتوى المحمل للاستخدام الشخصي فقط 
          وتجنب إعادة توزيع المحتوى المحمي بحقوق الطبع والنشر.
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-600">
          <span>🛡️ آمن ومحمي</span>
          <span>⚖️ قانوني ومتوافق</span>
          <span>🔒 خصوصية مضمونة</span>
        </div>
      </div>
    </div>
  )
}

export default QualitySelector