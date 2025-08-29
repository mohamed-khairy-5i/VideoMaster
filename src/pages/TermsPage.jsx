import { FileText, AlertTriangle, Scale, Shield, Globe, Users } from 'lucide-react'

const TermsPage = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'قبول الشروط',
      icon: FileText,
      content: [
        'باستخدام موقع VidCatch Pro، فإنك توافق على هذه الشروط والأحكام',
        'إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الخدمة',
        'نحتفظ بالحق في تعديل هذه الشروط في أي وقت مع إشعار مسبق',
        'استمرار استخدامك للخدمة بعد التعديل يعني موافقتك على الشروط الجديدة'
      ]
    },
    {
      id: 'service-description',
      title: 'وصف الخدمة',
      icon: Globe,
      content: [
        'VidCatch Pro هو موقع مجاني لتحميل الفيديوهات من منصات الإنترنت المختلفة',
        'نوفر واجهة سهلة الاستخدام لتحميل المحتوى المرئي بجودات مختلفة',
        'الخدمة متاحة على مدار الساعة مع إمكانية انقطاعات للصيانة',
        'نسعى لدعم أكبر عدد ممكن من المنصات والمواقع الشهيرة'
      ]
    },
    {
      id: 'user-responsibilities',
      title: 'مسؤوليات المستخدم',
      icon: Users,
      content: [
        'استخدام الخدمة للأغراض القانونية والشخصية فقط',
        'عدم تحميل محتوى محمي بحقوق الطبع والنشر للاستخدام التجاري',
        'عدم محاولة اختراق أو إضرار أنظمة الموقع',
        'الالتزام بشروط الاستخدام للمنصات الأصلية للمحتوى'
      ]
    },
    {
      id: 'prohibited-uses',
      title: 'الاستخدامات المحظورة',
      icon: AlertTriangle,
      content: [
        'تحميل محتوى غير قانوني أو مخالف للآداب العامة',
        'استخدام الخدمة لأغراض تجارية دون إذن مسبق',
        'إعادة بيع أو توزيع المحتوى المحمل بشكل غير قانوني',
        'محاولة التحايل على أنظمة الحماية أو القيود التقنية'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'الملكية الفكرية',
      icon: Scale,
      content: [
        'نحترم حقوق الملكية الفكرية لجميع منشئي المحتوى',
        'المستخدم مسؤول عن التأكد من حقوقه في تحميل واستخدام المحتوى',
        'نحن لا نتحمل مسؤولية انتهاك حقوق الطبع والنشر من قبل المستخدمين',
        'نتعاون مع أصحاب الحقوق في حالة وجود مخالفات مبلغ عنها'
      ]
    },
    {
      id: 'disclaimers',
      title: 'إخلاء المسؤولية',
      icon: Shield,
      content: [
        'الخدمة متوفرة "كما هي" دون ضمانات من أي نوع',
        'لا نضمن دقة أو اكتمال أو توفر المحتوى المحمل',
        'لا نتحمل مسؤولية أي أضرار مباشرة أو غير مباشرة',
        'استخدام الخدمة على مسؤولية المستخدم الشخصية'
      ]
    }
  ]

  const importantNotices = [
    {
      title: 'حقوق المؤلفين',
      description: 'يجب احترام حقوق منشئي المحتوى. استخدم المحتوى للأغراض الشخصية والتعليمية فقط.',
      type: 'warning',
      icon: '⚖️'
    },
    {
      title: 'قيود الاستخدام العادل',
      description: 'نطبق حدوداً عادلة لضمان أفضل خدمة لجميع المستخدمين وحماية خوادمنا.',
      type: 'info',
      icon: '⚙️'
    },
    {
      title: 'المحتوى المحظور',
      description: 'ممنوع تحميل محتوى غير قانوني، مضايقات، أو يحتوي على عنف أو كراهية.',
      type: 'danger',
      icon: '⚠️'
    }
  ]

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            شروط الاستخدام
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدمات VidCatch Pro. 
            استخدام الموقع يعني موافقتك على جميع الشروط المذكورة أدناه.
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 space-x-reverse bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
            <span>آخر تحديث: 29 أغسطس 2025</span>
            <span>•</span>
            <span>الإصدار 3.2</span>
          </div>
        </div>

        {/* Important Notices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {importantNotices.map((notice, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-2xl border-2 hover:shadow-lg transition-all duration-300 ${
                notice.type === 'warning' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300' :
                notice.type === 'danger' ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:border-red-300' :
                'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse mb-3">
                <span className="text-2xl">{notice.icon}</span>
                <h3 className={`font-bold text-lg ${
                  notice.type === 'warning' ? 'text-yellow-800' :
                  notice.type === 'danger' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {notice.title}
                </h3>
              </div>
              <p className={`leading-relaxed ${
                notice.type === 'warning' ? 'text-yellow-700' :
                notice.type === 'danger' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {notice.description}
              </p>
            </div>
          ))}
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={section.id} className="card">
                <div className="flex items-start space-x-4 space-x-reverse mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3 space-x-reverse text-gray-600">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* DMCA Policy */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 mt-12 border border-gray-200">
          <div className="flex items-center space-x-4 space-x-reverse mb-6">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">سياسة DMCA</h3>
              <p className="text-gray-600">حماية حقوق الملكية الفكرية</p>
            </div>
          </div>
          
          <div className="space-y-6 text-gray-700">
            <p className="text-lg leading-relaxed">
              نحن ملتزمون بقانون الألفية للحقوق الرقمية (DMCA) ونتعامل بجدية مع جميع البلاغات الصحيحة لانتهاك حقوق الطبع والنشر.
            </p>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <span className="text-2xl">📧</span>
                <h4 className="font-bold text-gray-900 text-lg">خطوات الإبلاغ عن انتهاك</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="font-medium text-gray-900">أرسل إشعاراً مفصلاً</p>
                      <p className="text-sm text-gray-600">dmca@vidcatch.pro</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="font-medium text-gray-900">حدد المحتوى المنتهك</p>
                      <p className="text-sm text-gray-600">مع روابط محددة</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="font-medium text-gray-900">قدم إثبات الملكية</p>
                      <p className="text-sm text-gray-600">وثائق رسمية معتمدة</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="font-medium text-gray-900">استجابة سريعة</p>
                      <p className="text-sm text-gray-600">خلال 12-24 ساعة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="card bg-red-50 border-red-200 mt-8">
          <h3 className="text-xl font-bold text-red-900 mb-4">تحديد المسؤولية</h3>
          <div className="text-red-800 space-y-3">
            <p>
              لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية 
              تنتج عن استخدام أو عدم القدرة على استخدام خدماتنا.
            </p>
            <p>
              الحد الأقصى لمسؤوليتنا تجاه أي مطالبة لن يتجاوز المبلغ المدفوع لنا مقابل الخدمة، 
              أو 100 دولار أمريكي، أيهما أقل.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="card bg-blue-50 border-blue-200 mt-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">القانون المطبق</h3>
          <p className="text-blue-800">
            تخضع هذه الشروط والأحكام لقوانين المملكة العربية السعودية وتفسر وفقاً لها. 
            أي نزاعات ستحل عبر التحكيم أو المحاكم المختصة في المملكة العربية السعودية.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 mt-8 text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📞</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">هل لديك أسئلة؟</h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              فريقنا القانوني موجود لمساعدتك في فهم شروط الاستخدام والإجابة عن جميع استفساراتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:legal@vidcatch.pro"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <span>⚖️</span>
                <span>الفريق القانوني</span>
              </a>
              <a 
                href="/about#contact"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <span>💬</span>
                <span>دردشة مباشرة</span>
              </a>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/20 text-sm opacity-75">
              <p>نرد على جميع الاستفسارات القانونية خلال 24 ساعة عمل</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage