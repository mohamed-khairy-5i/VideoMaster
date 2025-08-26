import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Download, 
  Heart, 
  Github, 
  Twitter, 
  Facebook, 
  Instagram,
  Mail,
  Shield,
  Zap,
  Globe
} from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'الميزات', href: '/#features' },
      { name: 'المنصات المدعومة', href: '/#platforms' },
      { name: 'طريقة الاستخدام', href: '/#how-to-use' },
      { name: 'الأسئلة الشائعة', href: '/#faq' },
    ],
    company: [
      { name: 'حول VidGrab Pro', href: '/about' },
      { name: 'اتصل بنا', href: '/contact' },
      { name: 'المدونة', href: '/blog' },
      { name: 'الأخبار', href: '/news' },
    ],
    legal: [
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'شروط الاستخدام', href: '/terms' },
      { name: 'إخلاء المسؤولية', href: '/disclaimer' },
      { name: 'DMCA', href: '/dmca' },
    ],
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/vidgrab-pro' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/vidgrabpro' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/vidgrabpro' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/vidgrabpro' },
  ]

  const features = [
    { name: 'آمن 100%', icon: Shield },
    { name: 'سريع البرق', icon: Zap },
    { name: '+1000 منصة', icon: Globe },
    { name: 'مجاني تماماً', icon: Heart },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  VidGrab Pro
                </h3>
                <p className="text-sm text-gray-400 -mt-1">أفضل محمل فيديوهات</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              الحل الأمثل لتنزيل الفيديوهات من جميع منصات الإنترنت بجودة عالية وسرعة فائقة. 
              آمن، مجاني، وسهل الاستخدام.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Icon className="w-4 h-4 text-primary-400" />
                    <span className="text-xs text-gray-300">{feature.name}</span>
                  </div>
                )
              })}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                  >
                    <Icon className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">المنتج</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">الشركة</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">قانوني</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-6">
              <h5 className="font-medium text-white mb-2">تواصل معنا</h5>
              <a
                href="mailto:support@vidgrab-pro.com"
                className="flex items-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>support@vidgrab-pro.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-400">
              <span>© {currentYear} VidGrab Pro. جميع الحقوق محفوظة.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline flex items-center space-x-1 rtl:space-x-reverse">
                صُنع بـ <Heart className="w-3 h-3 text-red-500 mx-1" /> من فريق GenSpark AI
              </span>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-gray-500 text-center md:text-left">
              <p>VidGrab Pro لا يخزن أو يستضيف أي ملفات فيديو. جميع الروابط يتم توليدها من المصادر الأصلية.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer