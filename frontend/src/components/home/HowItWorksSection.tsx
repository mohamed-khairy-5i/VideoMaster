import React from 'react'
import { motion } from 'framer-motion'
import { Link, Search, Download } from 'lucide-react'

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: Link,
      title: 'الصق الرابط',
      description: 'انسخ رابط الفيديو من أي منصة مدعومة'
    },
    {
      icon: Search,
      title: 'اختر الجودة',
      description: 'حدد الجودة ونوع الملف المطلوب'
    },
    {
      icon: Download,
      title: 'حمل الآن',
      description: 'اضغط على تحميل واحفظ الفيديو على جهازك'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            كيف يعمل VidGrab Pro? 🤔
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            فقط 3 خطوات بسيطة وستحصل على فيديوهاتك المفضلة
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${index === 0 ? 'from-blue-500 to-cyan-500' : index === 1 ? 'from-green-500 to-emerald-500' : 'from-purple-500 to-pink-500'} flex items-center justify-center shadow-xl`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'} text-white flex items-center justify-center font-bold text-sm`}>
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection