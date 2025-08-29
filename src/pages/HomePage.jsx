import { useEffect, useState } from 'react'
import VideoDownloader from '../components/VideoDownloader'
import { Download, Shield, Globe, Star, Users, TrendingUp, Play, CheckCircle, Zap, Heart } from 'lucide-react'

const HomePage = () => {
  const [stats, setStats] = useState({
    totalDownloads: 15847239,
    platformsSupported: 85,
    usersActive: 892341
  })

  // Animate stats on component mount
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000 // 2 seconds
      const steps = 50
      const stepDuration = duration / steps

      let step = 0
      const interval = setInterval(() => {
        step++
        const progress = step / steps
        
        setStats({
          totalDownloads: Math.floor(15847239 * progress),
          platformsSupported: Math.floor(85 * progress),
          usersActive: Math.floor(892341 * progress)
        })

        if (step >= steps) {
          clearInterval(interval)
          setStats({
            totalDownloads: 15847239,
            platformsSupported: 85,
            usersActive: 892341
          })
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }

    const timer = setTimeout(animateStats, 500)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: Download,
      title: 'تحميل بجودة 4K',
      description: 'احصل على أعلى جودة متاحة من 144p حتى 4K مع دعم HDR',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Shield,
      title: '100% آمن ومجاني',
      description: 'بدون برامج ضارة أو رسوم خفية، حماية كاملة للخصوصية',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Zap,
      title: 'سرعة البرق',
      description: 'تحميل فوري بتقنية التسريع المتطورة وخوادم CDN عالمية',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Globe,
      title: '85+ منصة مدعومة',
      description: 'يوتيوب، تيك توك، انستغرام، فيسبوك، تويتر وأكثر من 80 منصة أخرى',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: Play,
      title: 'صوت منفصل MP3',
      description: 'استخرج الصوت بجودة عالية بتنسيق MP3، AAC، أو FLAC',
      color: 'text-pink-600 bg-pink-100'
    },
    {
      icon: CheckCircle,
      title: 'بدون تسجيل',
      description: 'ابدأ التحميل فوراً بدون إنشاء حساب أو تقديم بيانات شخصية',
      color: 'text-teal-600 bg-teal-100'
    }
  ]

  const testimonials = [
    {
      name: 'د. خالد الأحمدي',
      role: 'أستاذ جامعي - جامعة الملك سعود',
      content: 'أستخدم VidCatch Pro لحفظ المحاضرات التعليمية من يوتيوب. الجودة ممتازة والواجهة بسيطة جداً. ينصح به بشدة للأكاديميين.',
      rating: 5,
      avatar: '👨‍🏫'
    },
    {
      name: 'منى الزهراني',
      role: 'منشئة محتوى - 250K متابع',
      content: 'كمنشئة محتوى، أحتاج لحفظ فيديوهات المنافسين للدراسة. هذا الموقع يوفر عليّ ساعات من البحث عن أدوات معقدة.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'فهد المطيري',
      role: 'طالب طب - جامعة الملك عبدالعزيز',
      content: 'المحاضرات الطبية على يوتيوب أصبحت في متناول يدي بفضل VidCatch Pro. يحمل حتى الفيديوهات الطويلة بسرعة مذهلة!',
      rating: 5,
      avatar: '👨‍⚕️'
    },
    {
      name: 'نورا القحطاني',
      role: 'مديرة تسويق رقمي',
      content: 'أستخدمه لتحليل إعلانات المنافسين من فيسبوك وانستغرام. سهل الاستخدام ويدعم جميع المنصات التي أحتاجها في عملي.',
      rating: 5,
      avatar: '👩‍💻'
    }
  ]

  const popularPlatforms = [
    { name: 'YouTube', users: '2.7B+', color: 'bg-red-500', icon: '🎬' },
    { name: 'TikTok', users: '1.7B+', color: 'bg-black', icon: '🎵' },
    { name: 'Instagram', users: '2.4B+', color: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: '📸' },
    { name: 'Facebook', users: '3.0B+', color: 'bg-blue-600', icon: '👥' },
    { name: 'Twitter', users: '450M+', color: 'bg-blue-400', icon: '🐦' },
    { name: 'Vimeo', users: '260M+', color: 'bg-teal-500', icon: '🎭' },
    { name: 'Dailymotion', users: '112M+', color: 'bg-indigo-600', icon: '📺' },
    { name: 'SoundCloud', users: '175M+', color: 'bg-orange-500', icon: '🎧' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-30"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce-slow">
              <Star className="w-4 h-4" />
              <span>الموقع الأول لتحميل الفيديوهات في العالم العربي</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              حمّل أي فيديو من{' '}
              <span className="gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">85+ منصة</span>{' '}
              مجاناً
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              الموقع العربي الأول لتحميل الفيديوهات بجودة 4K من يوتيوب، تيك توك، انستغرام، فيسبوك و 80+ منصة أخرى. 
              <span className="font-semibold text-gray-800">سريع وآمن وبدون إعلانات مضللة!</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.totalDownloads.toLocaleString()}+
              </div>
              <div className="text-gray-600">فيديو تم تحميله</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-success-600 mb-2">
                {stats.platformsSupported}+
              </div>
              <div className="text-gray-600">منصة مدعومة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-warning-600 mb-2">
                {stats.usersActive.toLocaleString()}+
              </div>
              <div className="text-gray-600">مستخدم نشط</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Downloader */}
      <section className="py-16 px-4 bg-white">
        <VideoDownloader />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              لماذا VidCatch Pro؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نقدم لك أفضل تجربة تحميل بميزات متطورة وأمان عالي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="group card text-center hover:scale-105 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Platforms */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              المنصات الأكثر شعبية
            </h2>
            <p className="text-xl text-gray-600">
              نحن ندعم جميع المنصات الرائدة في العالم
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularPlatforms.map((platform, index) => (
              <div key={index} className="card text-center group hover:scale-105 transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-gray-300">
                <div className={`w-16 h-16 ${platform.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                  {platform.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{platform.name}</h3>
                <p className="text-sm text-gray-600">{platform.users} مستخدم</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ماذا يقول المستخدمون؟
            </h2>
            <p className="text-xl text-gray-600">
              آلاف المستخدمين يثقون بـ VidCatch Pro يومياً
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-2xl">{testimonial.avatar}</span>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed text-lg italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-sm text-blue-600 font-medium">{testimonial.role}</div>
                  </div>
                  <Heart className="w-6 h-6 text-red-500 opacity-70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-6 opacity-90" />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ابدأ التحميل الآن!
          </h2>
          
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            انضم إلى ملايين المستخدمين الذين يحملون فيديوهاتهم المفضلة مجاناً كل يوم
          </p>
          
          <button 
            onClick={() => document.querySelector('.input-field')?.focus()}
            className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
          >
            جرب الآن مجاناً
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage