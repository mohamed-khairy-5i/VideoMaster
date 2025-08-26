import React from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Zap, 
  Shield, 
  Globe,
  Play,
  ArrowDown,
  Sparkles
} from 'lucide-react'

const HeroSection: React.FC = () => {
  const scrollToDownload = () => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
  }

  const features = [
    { icon: Download, text: '+1000 منصة مدعومة' },
    { icon: Zap, text: 'سرعة فائقة' },
    { icon: Shield, text: 'آمن 100%' },
    { icon: Globe, text: 'مجاني بالكامل' }
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 pb-20">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 left-1/2 w-64 h-64 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full blur-2xl opacity-20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-16 hidden lg:block"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 left-16 hidden lg:block"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-lg flex items-center justify-center">
            <Download className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-6 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">الأفضل في العالم العربي</span>
            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-gray-900">تنزيل </span>
            <span className="text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              الفيديوهات
            </span>
            <br />
            <span className="text-gray-900">بسرعة </span>
            <span className="text-gradient bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
              البرق ⚡
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            محمل الفيديوهات الأقوى والأسرع في الشرق الأوسط. 
            <br className="hidden md:block" />
            اتحميل من <strong className="text-primary-600">+1000 منصة</strong> بجودة عالية ومجاناً بالكامل
          </motion.p>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 md:p-6 text-center shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <p className="text-sm md:text-base font-medium text-gray-700">{feature.text}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToDownload}
              className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 rtl:space-x-reverse group"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              <span>ابدأ التنزيل الآن</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 rtl:space-x-reverse"
            >
              <Play className="w-5 h-5" />
              <span>شاهد كيف يعمل</span>
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col items-center space-y-2"
          >
            <p className="text-sm text-gray-500">جرب الآن مجاناً</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={scrollToDownload}
              className="w-8 h-8 border-2 border-primary-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-50 transition-colors"
            >
              <ArrowDown className="w-4 h-4 text-primary-600" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection