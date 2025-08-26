import React from 'react'
import { motion } from 'framer-motion'

const PlatformsSection: React.FC = () => {
  const platforms = [
    { name: 'YouTube', logo: '🔴', users: '2B+' },
    { name: 'TikTok', logo: '⚫', users: '1B+' },
    { name: 'Instagram', logo: '📷', users: '2B+' },
    { name: 'Facebook', logo: '📘', users: '3B+' },
    { name: 'Twitter', logo: '🐦', users: '400M+' },
    { name: 'Vimeo', logo: '📹', users: '200M+' }
  ]

  return (
    <section id="platforms" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            المنصات المدعومة 🌍
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نحن ندعم أكثر من 1000+ منصة حول العالم
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl mb-3">{platform.logo}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{platform.name}</h3>
              <p className="text-sm text-gray-500">{platform.users} مستخدم</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlatformsSection