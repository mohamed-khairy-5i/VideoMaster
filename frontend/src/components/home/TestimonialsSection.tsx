import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'أحمد محمد',
      role: 'محرر فيديو',
      content: 'أفضل موقع لتحميل الفيديوهات! سريع وآمن وبجودة عالية. أستخدمه يومياً في عملي.',
      rating: 5
    },
    {
      name: 'فاطمة الزهراء',
      role: 'طالبة جامعية',
      content: 'موقع رائع! يحمل من جميع المنصات بسهولة. مفيد جداً لتحميل فيديوهات الدروس.',
      rating: 5
    },
    {
      name: 'خالد السعودي',
      role: 'مؤثر تقني',
      content: 'بصراحة لم أتوقع هذه الجودة! يحمل بجودة 4K وبسرعة مذهلة. منصة ممتازة!',
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            آراء مستخدمينا ✨
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            أكثر من 2.5 مليون مستخدم يثقون في VidGrab Pro
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-primary-400 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.content}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
                
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection