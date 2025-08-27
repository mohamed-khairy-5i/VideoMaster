import { useEffect, useState } from 'react'
import VideoDownloader from '../components/VideoDownloader'
import { Zap, Shield, Globe, Star, Users, TrendingUp } from 'lucide-react'

const HomePage = () => {
  const [stats, setStats] = useState({
    totalDownloads: 2547836,
    platformsSupported: 50,
    usersActive: 125000
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
          totalDownloads: Math.floor(2547836 * progress),
          platformsSupported: Math.floor(50 * progress),
          usersActive: Math.floor(125000 * progress)
        })

        if (step >= steps) {
          clearInterval(interval)
          setStats({
            totalDownloads: 2547836,
            platformsSupported: 50,
            usersActive: 125000
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
      icon: Zap,
      title: 'سرعة فائقة',
      description: 'تحميل فوري بدون انتظار أو قوائم انتظار طويلة',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: Shield,
      title: '100% آمن',
      description: 'بدون برامج ضارة أو إعلانات مضللة، حماية كاملة لجهازك',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Globe,
      title: '50+ منصة',
      description: 'دعم شامل لجميع المنصات الشهيرة وأكثر من 50 موقع',
      color: 'text-blue-600 bg-blue-100'
    }
  ]

  const testimonials = [
    {
      name: 'أحمد محمد',
      role: 'مصمم جرافيك',
      content: 'أفضل موقع لتحميل الفيديوهات! سريع وسهل الاستخدام، وبدون إعلانات مزعجة.',
      rating: 5
    },
    {
      name: 'سارة علي',
      role: 'طالبة جامعية',
      content: 'أستخدمه يومياً لتحميل المحاضرات من YouTube. جودة ممتازة وتحميل سريع.',
      rating: 5
    },
    {
      name: 'محمد العتيبي',
      role: 'منشئ محتوى',
      content: 'يدعم تيك توك وانستجرام بشكل ممتاز. أصبح أداتي المفضلة للعمل.',
      rating: 5
    }
  ]

  const popularPlatforms = [
    { name: 'YouTube', users: '2.7B', color: 'bg-red-500' },
    { name: 'TikTok', users: '1.7B', color: 'bg-black' },
    { name: 'Instagram', users: '2.4B', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { name: 'Facebook', users: '3.0B', color: 'bg-blue-600' }
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
              حمل أي فيديو من{' '}
              <span className="gradient-text">الإنترنت</span>{' '}
              مجاناً
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              أسرع وأأمن موقع لتحميل الفيديوهات من YouTube، TikTok، Instagram، Facebook وأكثر من 50 منصة أخرى بجودة عالية ومجاناً 100%
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="card text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
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
              <div key={index} className="card text-center group hover:scale-105 transition-transform duration-300">
                <div className={`w-16 h-16 ${platform.color} rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-200`}>
                  {platform.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{platform.name}</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
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