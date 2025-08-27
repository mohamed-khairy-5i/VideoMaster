import { 
  Play, 
  Music, 
  Camera, 
  Users, 
  MessageCircle, 
  Video, 
  Tv,
  Gamepad2,
  Globe
} from 'lucide-react'

const PlatformIcons = ({ platform, className = "w-5 h-5" }) => {
  const icons = {
    youtube: <Play className={className} />,
    tiktok: <Music className={className} />,
    instagram: <Camera className={className} />,
    facebook: <Users className={className} />,
    twitter: <MessageCircle className={className} />,
    vimeo: <Video className={className} />,
    dailymotion: <Tv className={className} />,
    twitch: <Gamepad2 className={className} />,
    default: <Globe className={className} />
  }

  return icons[platform] || icons.default
}

export default PlatformIcons