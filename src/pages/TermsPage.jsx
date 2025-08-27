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
      title: 'حقوق الطبع والنشر',
      description: 'يجب على المستخدمين احترام حقوق الطبع والنشر واستخدام المحتوى المحمل للاستخدام الشخصي فقط.',
      type: 'warning'
    },
    {
      title: 'القيود التقنية',
      description: 'قد تكون هناك قيود على حجم الملفات أو عدد التحميلات لضمان جودة الخدمة للجميع.',
      type: 'info'
    },
    {
      title: 'المحتوى المحظور',
      description: 'لا نسمح بتحميل محتوى غير قانوني أو مخالف للآداب أو يحتوي على عنف أو كراهية.',
      type: 'danger'
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
          <div className="mt-6 text-sm text-gray-500">
            آخر تحديث: 27 أغسطس 2025
          </div>
        </div>

        {/* Important Notices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {importantNotices.map((notice, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl border-2 ${
                notice.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                notice.type === 'danger' ? 'bg-red-50 border-red-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <h3 className={`font-bold mb-3 ${
                notice.type === 'warning' ? 'text-yellow-800' :
                notice.type === 'danger' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {notice.title}
              </h3>
              <p className={`text-sm leading-relaxed ${
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
        <div className="card bg-gray-50 mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2 space-x-reverse">
            <Scale className="w-6 h-6" />
            <span>سياسة DMCA</span>
          </h3>
          <div className="space-y-4 text-gray-600">
            <p>
              نلتزم بقانون الألفية للحقوق الرقمية (DMCA) ونستجيب بسرعة لإشعارات انتهاك حقوق الطبع والنشر المقدمة بشكل صحيح.
            </p>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">للإبلاغ عن انتهاك حقوق الطبع:</h4>
              <ul className="space-y-2 text-sm">
                <li>• أرسل إشعاراً مفصلاً إلى: dmca@vidcatch.pro</li>
                <li>• اذكر المحتوى المنتهك مع روابط محددة</li>
                <li>• قدم دليلاً على ملكيتك للمحتوى</li>
                <li>• سنرد خلال 24-48 ساعة</li>
              </ul>
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
        <div className="card bg-primary-50 border-primary-200 mt-8">
          <h3 className="text-xl font-bold text-primary-900 mb-4">اتصل بنا</h3>
          <p className="text-primary-800 mb-6">
            إذا كان لديك أي أسئلة حول شروط الاستخدام، يرجى عدم التردد في التواصل معنا.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:legal@vidcatch.pro"
              className="btn-primary"
            >
              راسل الفريق القانوني
            </a>
            <a 
              href="/contact"
              className="btn-secondary"
            >
              نموذج الاتصال
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage