import React from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Shield, 
  Globe, 
  Download, 
  FileVideo, 
  Clock,
  Smartphone,
  Lock,
  Cpu
} from 'lucide-react'

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'سرعة البرق ⚡',
      description: 'معالجة فائقة السرعة تتم خلال ثوانٍ قليلة باستخدام أحدث التقنيات',
      color: 'from-yellow-500 to-orange-500',
      gradient: 'from-yellow-50 to-orange-50'
    },
    {
      icon: Shield,
      title: 'أمان تام 🛡️',
      description: 'حماية كاملة لبياناتك مع تشفير SSL وعدم تخزين أي معلومات شخصية',
      color: 'from-green-500 to-emerald-500',
      gradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: Globe,
      title: '+1000 منصة 🌍',
      description: 'دعم أكثر من 1000 منصة بما في ذلك YouTube وTikTok وInstagram وأكثر',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: FileVideo,
      title: 'جودة عالية 4K 📺',
      description: 'تحميل بجودة تصل إلى 4K مع الحفاظ على الجودة الأصلية للفيديو',
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: Smartphone,
      title: 'متجاوب تماماً 📱',
      description: 'يعمل بكفاءة على جميع الأجهزة: الجوال، التابلت، واللابتوب',
      color: 'from-indigo-500 to-blue-500',
      gradient: 'from-indigo-50 to-blue-50'
    },
    {
      icon: Download,
      title: 'مجاني بالكامل 💯',
      description: 'جميع الميزات متاحة مجاناً بدون قيود أو رسوم خفية',
      color: 'from-red-500 to-pink-500',
      gradient: 'from-red-50 to-pink-50'
    },
    {
      icon: Clock,
      title: 'متاح 24/7 ⏰',
      description: 'خدمة متواصلة على مدار الساعة بدون انقطاع أو صيانة',
      color: 'from-teal-500 to-green-500',
      gradient: 'from-teal-50 to-green-50'
    },
    {
      icon: Lock,
      title: 'خصوصية مضمونة 🔒',
      description: 'لا نحفظ أو نشارك أي من بياناتك أو تاريخ التحميل مع أي جهة',
      color: 'from-gray-600 to-gray-800',
      gradient: 'from-gray-50 to-gray-100'
    },
    {
      icon: Cpu,
      title: 'ذكاء اصطناعي 🤖',
      description: 'تقنية ذكية تتعرف تلقائياً على أفضل جودة وتحسن تجربة التحميل',
      color: 'from-violet-500 to-purple-500',
      gradient: 'from-violet-50 to-purple-50'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            لماذا <span className="text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">VidGrab Pro</span>؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نحن لا نجرد نحمل الفيديوهات، بل نقدم تجربة متكاملة تجمع بين السرعة والأمان والسهولة
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.03 }}
                className={`relative overflow-hidden bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 lg:p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group`}
              >
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-current"></div>
                  <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-current"></div>
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl`}
                >
                  <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </motion.div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl`}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              جرب جميع هذه الميزات الآن مجاناً! 🎉
            </h3>
            <p className="text-lg lg:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              لا تحتاج لتسجيل أو دفع أي رسوم. ابدأ في تحميل الفيديوهات المفضلة لديك على الفور
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Download className="w-5 h-5" />
              <span>ابدأ التحميل الآن</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection