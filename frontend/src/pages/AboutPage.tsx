import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Globe, Zap } from 'lucide-react'

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            عن VidGrab Pro 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نحن فريق من المطورين المتحمسين لتقديم أفضل تجربة تحميل فيديو في العالم العربي
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <Heart className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">رسالتنا</h2>
            <p className="text-gray-600 leading-relaxed">
              توفير منصة بسيطة وآمنة وسريعة لتحميل الفيديوهات من جميع منصات الإنترنت بجودة عالية ومجاناً بالكامل.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">رؤيتنا</h2>
            <p className="text-gray-600 leading-relaxed">
              أن نكون المنصة الأولى عالمياً لتحميل الفيديوهات ورائدة في الابتكار التقني وتجربة المستخدم.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">شكراً لملايين المستخدمين</h2>
            <p className="text-xl opacity-90">
              بفضل ثقتكم تمكنا من خدمة أكثر من 2.5 مليون مستخدم حول العالم
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage