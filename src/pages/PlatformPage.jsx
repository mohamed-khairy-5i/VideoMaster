import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VideoDownloader from '../components/VideoDownloader'
import { Play, Download, Star, Users, Clock, Shield } from 'lucide-react'

const PlatformPage = () => {
  const { platform } = useParams()
  const [platformData, setPlatformData] = useState(null)
  
  useEffect(() => {
    // Mock platform data - في التطبيق الحقيقي، ستأتي من API
    const platforms = {
      youtube: {
        name: 'YouTube',
        name_ar: 'يوتيوب',
        description: 'تحميل فيديوهات YouTube بجودة عالية من 144p إلى 4K',
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgGradient: 'from-red-500 to-red-600',
        icon: '🎥',
        features: [
          'تحميل بجودة 4K و 8K',
          'دعم القوائم والقنوات',
          'استخراج الترجمات',
          'تحميل الصوت منفصلاً'
        ],
        stats: {
          users: '2.7B',
          content: '500+ ساعة يومياً',
          languages: '100+'
        },
        tips: [
          'استخدم روابط youtube.com أو youtu.be',
          'يمكن تحميل الفيديوهات الخاصة (غير مدرجة)',
          'الجودة تعتمد على الفيديو الأصلي'
        ]
      },
      tiktok: {
        name: 'TikTok',
        name_ar: 'تيك توك',
        description: 'حمل فيديوهات TikTok بدون علامة مائية وبجودة عالية',
        color: 'bg-black',
        textColor: 'text-gray-900',
        bgGradient: 'from-gray-900 to-black',
        icon: '🎵',
        features: [
          'بدون علامة مائية',
          'جودة HD أصلية',
          'حفظ الصوت الأصلي',
          'سرعة عالية في التحميل'
        ],
        stats: {
          users: '1.7B',
          content: '1B+ فيديو يومياً',
          avgLength: '30 ثانية'
        },
        tips: [
          'انسخ رابط الفيديو مباشرة من TikTok',
          'يعمل مع الفيديوهات العامة فقط',
          'لا يتطلب تسجيل دخول'
        ]
      },
      instagram: {
        name: 'Instagram',
        name_ar: 'إنستغرام',
        description: 'حمل فيديوهات و Reels و Stories من Instagram',
        color: 'bg-gradient-to-br from-purple-500 to-pink-500',
        textColor: 'text-purple-600',
        bgGradient: 'from-purple-500 to-pink-500',
        icon: '📷',
        features: [
          'فيديوهات المنشورات',
          'Instagram Reels',
          'IGTV و Stories',
          'صور عالية الجودة'
        ],
        stats: {
          users: '2.4B',
          content: '95M+ منشور يومياً',
          engagement: '4.2%'
        },
        tips: [
          'استخدم روابط instagram.com/p/',
          'لا يعمل مع الحسابات الخاصة',
          'جودة التحميل حسب المنشور الأصلي'
        ]
      },
      facebook: {
        name: 'Facebook',
        name_ar: 'فيسبوك',
        description: 'تحميل فيديوهات Facebook و Watch بجودة عالية',
        color: 'bg-blue-600',
        textColor: 'text-blue-600',
        bgGradient: 'from-blue-600 to-blue-700',
        icon: '🔗',
        features: [
          'فيديوهات المنشورات',
          'Facebook Watch',
          'فيديوهات Stories',
          'البث المباشر (محدود)'
        ],
        stats: {
          users: '3.0B',
          content: '8B+ فيديو يومياً',
          watchTime: '100M+ ساعة'
        },
        tips: [
          'استخدم روابط facebook.com/watch',
          'يدعم الفيديوهات العامة فقط',
          'بعض الفيديوهات قد تتطلب تسجيل دخول'
        ]
      },
      twitter: {
        name: 'Twitter/X',
        name_ar: 'تويتر/إكس',
        description: 'حمل فيديوهات و GIFs من Twitter و X',
        color: 'bg-sky-500',
        textColor: 'text-sky-600',
        bgGradient: 'from-sky-500 to-sky-600',
        icon: '🐦',
        features: [
          'فيديوهات قصيرة',
          'GIF متحركة',
          'جودة HD',
          'محتوى مباشر'
        ],
        stats: {
          users: '450M',
          content: '500M+ تغريدة',
          videos: '2B+ مشاهدة'
        },
        tips: [
          'استخدم روابط twitter.com أو x.com',
          'يعمل مع التغريدات العامة',
          'بعض الفيديوهات قد تكون محمية'
        ]
      },
      vimeo: {
        name: 'Vimeo',
        name_ar: 'فيميو',
        description: 'تحميل فيديوهات Vimeo عالية الجودة',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgGradient: 'from-blue-500 to-blue-600',
        icon: '🎨',
        features: [
          'جودة 4K و HDR',
          'بدون إعلانات',
          'محتوى احترافي',
          'أدوات متقدمة'
        ],
        stats: {
          users: '260M',
          creators: '1.6M+',
          quality: '4K HDR'
        },
        tips: [
          'استخدم روابط vimeo.com',
          'جودة عالية جداً للمحتوى الاحترافي',
          'بعض الفيديوهات قد تكون مدفوعة'
        ]
      }
    }
    
    setPlatformData(platforms[platform] || null)
  }, [platform])
  
  if (!platformData) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">منصة غير مدعومة</h1>
          <p className="text-gray-600">نعتذر، هذه المنصة غير متاحة حالياً</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Platform Hero */}
      <section className={`py-20 px-4 bg-gradient-to-br ${platformData.bgGradient} text-white relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">{platformData.icon}</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              تحميل من {platformData.name_ar}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              {platformData.description}
            </p>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {Object.entries(platformData.stats).map(([key, value], index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">{value}</div>
                <div className="text-sm opacity-80">
                  {key === 'users' ? 'مستخدم' :
                   key === 'content' ? 'محتوى' :
                   key === 'languages' ? 'لغة' :
                   key === 'avgLength' ? 'متوسط الطول' :
                   key === 'engagement' ? 'معدل التفاعل' :
                   key === 'watchTime' ? 'وقت المشاهدة' :
                   key === 'creators' ? 'منشئ محتوى' :
                   key === 'quality' ? 'أعلى جودة' :
                   key === 'videos' ? 'مشاهدة فيديو' :
                   key}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Downloader */}
      <section className="py-16 px-4 bg-white">
        <VideoDownloader />
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ميزات {platformData.name_ar}
            </h2>
            <p className="text-xl text-gray-600">
              ما يميز تحميل الفيديوهات من {platformData.name_ar}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformData.features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips & Guidelines */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Tips */}
            <div className="card">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-success-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">نصائح للتحميل</h3>
              </div>
              <ul className="space-y-3">
                {platformData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3 space-x-reverse text-gray-600">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guidelines */}
            <div className="card">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-warning-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">إرشادات مهمة</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 space-x-reverse text-gray-600">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">احترم حقوق الطبع والنشر</span>
                </li>
                <li className="flex items-start space-x-3 space-x-reverse text-gray-600">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">استخدم المحتوى للاستخدام الشخصي فقط</span>
                </li>
                <li className="flex items-start space-x-3 space-x-reverse text-gray-600">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">لا تعيد توزيع المحتوى بدون إذن</span>
                </li>
                <li className="flex items-start space-x-3 space-x-reverse text-gray-600">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">تأكد من رابط الفيديو قبل التحميل</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              أسئلة شائعة حول {platformData.name_ar}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3">هل يمكن تحميل جميع فيديوهات {platformData.name_ar}؟</h3>
              <p className="text-gray-600">
                نعم، يمكن تحميل معظم فيديوهات {platformData.name_ar} العامة. 
                بعض الفيديوهات المحمية بحقوق طبع أو الخاصة قد لا تكون متاحة.
              </p>
            </div>
            
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3">ما هي أفضل جودة متاحة؟</h3>
              <p className="text-gray-600">
                تعتمد جودة التحميل على جودة الفيديو الأصلي. 
                يدعم {platformData.name_ar} جودات عالية تصل إلى 4K في بعض الحالات.
              </p>
            </div>
            
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3">هل الخدمة مجانية بالكامل؟</h3>
              <p className="text-gray-600">
                نعم، خدمتنا مجانية بالكامل ولا تتطلب تسجيل أو اشتراك. 
                يمكنك تحميل عدد غير محدود من الفيديوهات.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 px-4 bg-gradient-to-r ${platformData.bgGradient} text-white`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ابدأ تحميل فيديوهات {platformData.name_ar} الآن!
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            انسخ رابط أي فيديو من {platformData.name_ar} واحصل عليه بجودة عالية في ثوان
          </p>
          <button 
            onClick={() => {
              document.querySelector('.input-field')?.focus()
              window.scrollTo({ top: document.querySelector('.input-field')?.offsetTop - 100, behavior: 'smooth' })
            }}
            className="btn bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4"
          >
            جرب الآن مجاناً
          </button>
        </div>
      </section>
    </div>
  )
}

export default PlatformPage