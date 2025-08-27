import { Shield, Zap, Globe, Users, Award, Target } from 'lucide-react'

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
    { number: '2.5M+', label: 'فيديو محمل' },
    { number: '50+', label: 'منصة مدعومة' },
    { number: '125K+', label: 'مستخدم نشط' },
    { number: '99.9%', label: 'معدل النجاح' }
  ]

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            من نحن؟
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            VidCatch Pro هو أكثر من مجرد موقع لتحميل الفيديوهات. نحن فريق من المطورين المتحمسين 
            الذين يؤمنون بحرية الوصول للمحتوى الرقمي والاستفادة منه بطريقة قانونية وآمنة.
          </p>
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
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

        {/* Team Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            فريق العمل
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            فريق من المطورين والمصممين المتخصصين في التقنيات الحديثة، 
            نعمل بشغف لتطوير أفضل الحلول التقنية لمستخدمينا.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                أ
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">أحمد محمد</h3>
              <p className="text-gray-600 mb-2">مطور واجهات المستخدم</p>
              <p className="text-sm text-gray-500">خبرة 5 سنوات في React و JavaScript</p>
            </div>
            
            <div className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                س
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">سارة علي</h3>
              <p className="text-gray-600 mb-2">مطورة خلفية</p>
              <p className="text-sm text-gray-500">متخصصة في Node.js و Python</p>
            </div>
            
            <div className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-warning-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                م
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">محمد الأحمد</h3>
              <p className="text-gray-600 mb-2">مصمم UX/UI</p>
              <p className="text-sm text-gray-500">خبرة في تصميم التجارب التفاعلية</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="card text-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تواصل معنا
          </h2>
          <p className="text-gray-600 mb-6">
            لديك اقتراحات أو تحتاج مساعدة؟ نحن هنا لمساعدتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@vidcatch.pro"
              className="btn-primary"
            >
              راسلنا عبر الإيميل
            </a>
            <a 
              href="#"
              className="btn-secondary"
            >
              تابعنا على تويتر
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage