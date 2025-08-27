import { Play, Calendar, Eye, ThumbsUp, Clock, User } from 'lucide-react'

const VideoPreview = ({ videoInfo }) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num?.toString() || '0'
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Thumbnail */}
        <div className="lg:w-1/2">
          <div className="video-preview relative group cursor-pointer">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
            
            {/* Duration Badge */}
            {videoInfo.duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                {formatDuration(videoInfo.duration)}
              </div>
            )}
          </div>
        </div>

        {/* Video Info */}
        <div className="lg:w-1/2 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {videoInfo.title}
            </h2>
            
            {videoInfo.description && (
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {videoInfo.description}
              </p>
            )}
          </div>

          {/* Channel/Author Info */}
          {videoInfo.uploader && (
            <div className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{videoInfo.uploader}</p>
                {videoInfo.uploader_id && (
                  <p className="text-sm text-gray-500">@{videoInfo.uploader_id}</p>
                )}
              </div>
            </div>
          )}

          {/* Video Statistics */}
          <div className="grid grid-cols-2 gap-4">
            {videoInfo.view_count && (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{formatNumber(videoInfo.view_count)} مشاهدة</span>
              </div>
            )}
            
            {videoInfo.like_count && (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{formatNumber(videoInfo.like_count)} إعجاب</span>
              </div>
            )}
            
            {videoInfo.upload_date && (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(videoInfo.upload_date)}</span>
              </div>
            )}
            
            {videoInfo.duration && (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatDuration(videoInfo.duration)}</span>
              </div>
            )}
          </div>

          {/* Platform Badge */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              videoInfo.extractor === 'youtube' ? 'bg-red-100 text-red-700' :
              videoInfo.extractor === 'tiktok' ? 'bg-gray-100 text-gray-700' :
              videoInfo.extractor === 'instagram' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' :
              videoInfo.extractor === 'facebook' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {videoInfo.extractor ? videoInfo.extractor.toUpperCase() : 'غير محدد'}
            </div>
            
            {videoInfo.age_limit && (
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
                +{videoInfo.age_limit}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPreview