import React from 'react'
import { motion } from 'framer-motion'
import { Users, Download, Globe, Zap } from 'lucide-react'

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '2.5M+',
      label: 'مستخدم سعيد',
      description: 'يثقون بنا يومياً',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Download,
      value: '50M+',
      label: 'فيديو تم تحميله',
      description: 'في آخر شهر',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      value: '1000+',
      label: 'منصة مدعومة',
      description: 'وفي تزايد مستمر',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      value: '< 3s',
      label: 'متوسط وقت المعالجة',
      description: 'سرعة البرق',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            أرقام تتحدث عن نفسها 📊
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            انضم إلى ملايين المستخدمين الذين يثقون في VidGrab Pro يومياً
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white rounded-2xl p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </motion.div>

                {/* Value */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="mb-2"
                >
                  <span className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                </motion.div>

                {/* Label */}
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  {stat.description}
                </p>

                {/* Animated line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '60%' }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                  className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mx-auto mt-4`}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-6 rtl:space-x-reverse bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
            
            {/* Trust Badge 1 */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">99.9% وقت تشغيل</span>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            {/* Trust Badge 2 */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">SSL محمي</span>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            {/* Trust Badge 3 */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">بلا إعلانات</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection