import { Shield, Zap, Globe, Users, Award, Target, Code, Rocket, Heart, Clock } from 'lucide-react'

const AboutPage = () => {
  const values = [
    {
      icon: Shield,
      title: 'الأمان أولاً',
      description: 'نضمن لك تجربة آمنة 100% بدون برمجيات ضارة أو إعلانات مضللة'
    },
    {
      icon: Zap,
      title: 'السرعة والكفاءة',
      description: 'خوادم متطورة تضمن أسرع عمليات تحميل في العالم العربي'
    },
    {
      icon: Globe,
      title: 'الوصول العالمي',
      description: 'دعم لأكثر من 50 منصة عالمية مع إضافة منصات جديدة باستمرار'
    },
    {
      icon: Users,
      title: 'مجتمع كبير',
      description: 'أكثر من مليون مستخدم يثق بخدماتنا حول العالم'
    }
  ]

  const stats = [
    { number: '15.8M+', label: 'فيديو تم تحميله بنجاح' },
    { number: '85+', label: 'منصة مدعومة حالياً' },
    { number: '892K+', label: 'مستخدم نشط شهرياً' },
    { number: '99.8%', label: 'معدل نجاح التحميل' }
  ]

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl -z-10"></div>
          <div className="py-16 px-8">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4 text-red-500" />
              <span>نخدم أكثر من 890 ألف مستخدم شهرياً</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              قصتنا مع{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">VidCatch Pro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              بدأت قصتنا في 2020 عندما لاحظ فريقنا المتخصص في التقنية عدم وجود منصة عربية موثوقة وآمنة لتحميل الفيديوهات.
              <br/><br/>
              <span className="font-semibold text-gray-800">اليوم، نحن فخورون بكوننا المنصة الأولى في العالم العربي</span> لتحميل الفيديوهات بجودة 4K وأمان تام، مع أكثر من 15 مليون عملية تحميل ناجحة.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="card">
            <Target className="w-12 h-12 text-primary-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">رسالتنا</h2>
            <p className="text-gray-600 leading-relaxed">
              نسعى لتوفير أفضل وأسهل طريقة لتحميل الفيديوهات من الإنترنت بجودة عالية وأمان كامل، 
              مع ضمان احترام حقوق الطبع والنشر وتوفير تجربة مستخدم استثنائية.
            </p>
          </div>
          
          <div className="card">
            <Award className="w-12 h-12 text-success-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">رؤيتنا</h2>
            <p className="text-gray-600 leading-relaxed">
              أن نصبح المنصة الأولى والأكثر ثقة في العالم العربي لتحميل المحتوى المرئي، 
              مع توسيع خدماتنا لتشمل المزيد من الميزات التقنية المبتكرة.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              قيمنا الأساسية
            </h2>
            <p className="text-xl text-gray-600">
              المبادئ التي نسير عليها في كل ما نقوم به
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="card text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-12 text-white mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              إنجازاتنا بالأرقام
            </h2>
            <p className="text-xl opacity-90">
              أرقام تتحدث عن جودة خدماتنا وثقة المستخدمين
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Journey Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              رحلتنا عبر الزمن
            </h2>
            <p className="text-xl text-gray-600">
              معالم مهمة في تاريخ VidCatch Pro
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 order-2 md:order-1">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-semibold text-blue-600">2020 - الانطلاقة</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">بداية الحلم</h3>
                <p className="text-gray-600 leading-relaxed">
                  بدأنا كفريق صغير من 3 مطورين بهدف حل مشكلة عدم وجود منصة آمنة لتحميل الفيديوهات. في أول شهر، حققنا 1,000 عملية تحميل.
                </p>
              </div>
              <div className="flex-shrink-0 order-1 md:order-2">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  🚀
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  🎆
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-semibold text-green-600">2022 - النمو المتسارع</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">وصول للمليون</h3>
                <p className="text-gray-600 leading-relaxed">
                  بعد عامين من العمل الجاد، تجاوزنا المليون عملية تحميل وأضفنا دعم 60+ منصة. أصبحنا المرجع الأول في العالم العربي.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 order-2 md:order-1">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-semibold text-purple-600">2024 - الحاضر</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">الريادة والتميز</h3>
                <p className="text-gray-600 leading-relaxed">
                  اليوم، نخدم أكثر من 890 ألف مستخدم شهرياً بدعم 85+ منصة وجودة 4K. حققنا 15.8 مليون عملية تحميل ناجحة بمعدل نجاح 99.8%.
                </p>
              </div>
              <div className="flex-shrink-0 order-1 md:order-2">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  🏆
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              التقنية المتقدمة
            </h2>
            <p className="text-xl text-gray-600">
              نستخدم أحدث التقنيات لضمان أفضل تجربة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">معالجة متقدمة</h3>
              <p className="text-gray-600">خوارزميات AI متطورة لاستخراج الفيديوهات بأعلى جودة</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">أمان متعدد الطبقات</h3>
              <p className="text-gray-600">تشفير SSL وفحص متقدم للبرمجيات الضارة</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">شبكة CDN عالمية</h3>
              <p className="text-gray-600">خوادم موزعة في 40+ دولة لأسرع تحميل</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              انضم إلى عائلة VidCatch Pro
            </h2>
            <p className="text-xl opacity-90 mb-8">
              لديك اقتراحات أو تحتاج مساعدة؟ فريقنا متوفر 24/7 لخدمتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@vidcatch.pro"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <span>📧</span>
                <span>راسلنا عبر الإيميل</span>
              </a>
              <a 
                href="https://twitter.com/vidcatchpro"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <span>🐦</span>
                <span>تابعنا على تويتر</span>
              </a>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center justify-center space-x-6 space-x-reverse text-sm opacity-75">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="w-4 h-4" />
                  <span>متوفرون 24/7</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Users className="w-4 h-4" />
                  <span>890K+ مستخدم يثق بنا</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage