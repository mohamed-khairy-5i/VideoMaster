import { Shield, Lock, Eye, Database, Globe, UserCheck } from 'lucide-react'

const PrivacyPage = () => {
  const sections = [
    {
      id: 'collection',
      title: 'المعلومات التي نجمعها',
      icon: Database,
      content: [
        'عناوين URL للفيديوهات التي تطلب تحميلها (مؤقتاً لمعالجة الطلب فقط)',
        'معلومات تقنية أساسية مثل نوع المتصفح ونظام التشغيل (للتحسين)',
        'عنوان IP (للحماية من إساءة الاستخدام وتحليلات إحصائية مجهولة)',
        'تفضيلات اللغة والموقع الجغرافي العام'
      ]
    },
    {
      id: 'usage',
      title: 'كيف نستخدم معلوماتك',
      icon: UserCheck,
      content: [
        'معالجة طلبات تحميل الفيديوهات وتقديم الخدمة',
        'تحسين أداء الموقع وإصلاح الأخطاء التقنية',
        'حماية الموقع من الهجمات والاستخدام المسيء',
        'إنتاج إحصائيات مجهولة لتطوير الخدمة'
      ]
    },
    {
      id: 'storage',
      title: 'تخزين المعلومات',
      icon: Lock,
      content: [
        'لا نخزن أي ملفات فيديو على خوادمنا نهائياً',
        'روابط الفيديوهات تُمحى خلال 24 ساعة من المعالجة',
        'المعلومات التقنية تُحفظ بشكل مجهول لمدة أقصاها 30 يوماً',
        'جميع البيانات محمية بأحدث تقنيات التشفير'
      ]
    },
    {
      id: 'sharing',
      title: 'مشاركة المعلومات',
      icon: Globe,
      content: [
        'نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة',
        'قد نشارك بيانات إحصائية مجهولة للأغراض البحثية',
        'نلتزم بالكشف عن المعلومات فقط إذا طُلب ذلك قانونياً',
        'نستخدم خدمات سحابية موثوقة مع ضمانات خصوصية قوية'
      ]
    },
    {
      id: 'rights',
      title: 'حقوقك',
      icon: Shield,
      content: [
        'يمكنك طلب حذف أي معلومات شخصية مرتبطة بك',
        'يمكنك الوصول إلى المعلومات التي نحتفظ بها عنك',
        'يمكنك إيقاف استخدام الخدمة في أي وقت',
        'يمكنك تقديم شكوى إلى السلطات المختصة إذا لزم الأمر'
      ]
    },
    {
      id: 'security',
      title: 'الأمان والحماية',
      icon: Eye,
      content: [
        'نستخدم بروتوكول HTTPS لجميع الاتصالات',
        'خوادمنا محمية بجدران حماية متقدمة',
        'نجري مراجعات أمنية دورية لأنظمتنا',
        'نحدث أنظمة الحماية باستمرار ضد التهديدات الجديدة'
      ]
    }
  ]

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            سياسة الخصوصية
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نحن نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية. هذه السياسة توضح كيف نجمع ونستخدم ونحمي بياناتك.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            آخر تحديث: 27 أغسطس 2025
          </div>
        </div>

        {/* Privacy Sections */}
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

        {/* GDPR Compliance */}
        <div className="card bg-blue-50 border-blue-200 mt-12">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center space-x-2 space-x-reverse">
            <Globe className="w-6 h-6" />
            <span>الامتثال للقوانين الدولية</span>
          </h3>
          <p className="text-blue-800 leading-relaxed">
            نلتزم بقوانين حماية البيانات المحلية والدولية بما في ذلك اللائحة العامة لحماية البيانات (GDPR) 
            وقانون خصوصية المستهلك في كاليفورنيا (CCPA) وقوانين حماية البيانات في المملكة العربية السعودية ودول الخليج.
          </p>
        </div>

        {/* Cookies Policy */}
        <div className="card bg-gray-50 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">سياسة ملفات تعريف الارتباط (Cookies)</h3>
          <div className="space-y-4 text-gray-600">
            <p>
              نستخدم ملفات تعريف الارتباط الضرورية فقط لتشغيل الموقع بشكل صحيح. هذه الملفات لا تحتوي على معلومات شخصية 
              ولا تُستخدم لتتبع سلوكك عبر مواقع أخرى.
            </p>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">أنواع الملفات المستخدمة:</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>ملفات الجلسة:</strong> لحفظ تفضيلات اللغة والإعدادات</li>
                <li>• <strong>ملفات الأمان:</strong> لحماية الموقع من الهجمات</li>
                <li>• <strong>ملفات الأداء:</strong> لقياس سرعة الموقع وتحسينه</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact for Privacy */}
        <div className="card bg-primary-50 border-primary-200 mt-8">
          <h3 className="text-xl font-bold text-primary-900 mb-4">أسئلة حول الخصوصية؟</h3>
          <p className="text-primary-800 mb-6">
            إذا كان لديك أي أسئلة أو مخاوف حول سياسة الخصوصية أو معالجة بياناتك، لا تتردد في التواصل معنا.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:privacy@vidcatch.pro"
              className="btn-primary"
            >
              راسل فريق الخصوصية
            </a>
            <a 
              href="/contact"
              className="btn-secondary"
            >
              نموذج الاتصال
            </a>
          </div>
        </div>

        {/* Data Deletion Request */}
        <div className="card bg-red-50 border-red-200 mt-8">
          <h3 className="text-xl font-bold text-red-900 mb-4">طلب حذف البيانات</h3>
          <p className="text-red-800 mb-4">
            يمكنك طلب حذف جميع المعلومات المرتبطة بك من أنظمتنا في أي وقت. سنقوم بمعالجة الطلب خلال 30 يوماً.
          </p>
          <a 
            href="mailto:delete@vidcatch.pro?subject=طلب حذف البيانات"
            className="inline-flex items-center space-x-2 space-x-reverse text-red-700 hover:text-red-900 font-medium"
          >
            <span>إرسال طلب حذف البيانات</span>
            <span>←</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage