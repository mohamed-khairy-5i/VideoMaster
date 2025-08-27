import { Link } from 'react-router-dom'
import { Download, Heart, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'كيفية الاستخدام', href: '/how-to-use' },
      { name: 'المنصات المدعومة', href: '/platforms' },
      { name: 'API للمطورين', href: '/api' },
      { name: 'الأسئلة الشائعة', href: '/faq' }
    ],
    company: [
      { name: 'من نحن', href: '/about' },
      { name: 'اتصل بنا', href: '/contact' },
      { name: 'المدونة', href: '/blog' },
      { name: 'الوظائف', href: '/careers' }
    ],
    legal: [
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'شروط الاستخدام', href: '/terms' },
      { name: 'إخلاء مسؤولية', href: '/disclaimer' },
      { name: 'DMCA', href: '/dmca' }
    ]
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-900' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-500' },
    { name: 'Email', icon: Mail, href: 'mailto:support@vidcatch.pro', color: 'hover:text-primary-600' }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">VidCatch Pro</h3>
                <p className="text-sm text-gray-500">احصل على أي فيديو، في أي وقت</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              أسرع وأأمن موقع لتحميل الفيديوهات من أكثر من 50 منصة بجودة عالية. 
              مجاني 100% ولا يتطلب تسجيل أو تحميل برامج.
            </p>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`p-2 rounded-lg text-gray-400 ${social.color} transition-colors hover:bg-gray-100`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">المنتج</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">الشركة</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">قانوني</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <span>© {currentYear} VidCatch Pro.</span>
              <span>جميع الحقوق محفوظة.</span>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <span>صُنع بـ</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>من أجل الإنترنت المفتوح</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            <strong>إخلاء مسؤولية:</strong> VidCatch Pro هو موقع مجاني لتحميل الفيديوهات للاستخدام الشخصي فقط. 
            يرجى احترام حقوق الطبع والنشر والامتثال لشروط استخدام المنصات الأصلية. 
            نحن لا نستضيف أو نخزن أي محتوى فيديو على خوادمنا.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer