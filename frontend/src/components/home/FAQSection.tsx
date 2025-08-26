import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'هل VidGrab Pro مجاني حقاً?',
      answer: 'نعم! VidGrab Pro مجاني بالكامل بدون أي رسوم أو قيود. جميع الميزات متاحة مجاناً وبدون حدود.'
    },
    {
      question: 'ما هي المنصات المدعومة?',
      answer: 'ندعم أكثر من 1000+ منصة بما في ذلك YouTube، TikTok، Instagram، Facebook، Twitter، Vimeo، Dailymotion، والعديد من المنصات الأخرى.'
    },
    {
      question: 'ما هي أعلى جودة يمكن تحميلها?',
      answer: 'يمكنك تحميل الفيديوهات بجودة تصل إلى 4K (3840x2160) في حال توفرها في المصدر الأصلي. كما ندعم جميع الجودات المعتادة.'
    },
    {
      question: 'هل الموقع آمن للاستخدام?',
      answer: 'نعم، الموقع آمن بنسبة 100%. نحن نستخدم تشفير SSL ولا نحفظ أي معلومات شخصية أو تاريخ تحميل. خصوصيتك مضمونة.'
    },
    {
      question: 'هل يمكن تحميل الصوت فقط?',
      answer: 'نعم! يمكنك تحميل الصوت فقط بصيغ MP3 أو M4A بجودة عالية. مفيد لتحميل الموسيقى أو البودكاست.'
    },
    {
      question: 'هل يعمل على الهاتف الذكي?',
      answer: 'نعم! الموقع متجاوب بالكامل ويعمل بكفاءة على جميع الأجهزة: الهاتف الذكي، التابلت، وأجهزة الكمبيوتر.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            الأسئلة الشائعة 🤔
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            هنا تجد إجابات عن أشهر الاستفسارات حول خدمتنا
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 lg:px-8 py-6 text-left flex items-center justify-between hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:bg-blue-50"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 lg:px-8 pb-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              لم تجد إجابة لسؤالك? 💬
            </h3>
            <p className="text-lg mb-6 opacity-90">
              لا تتردد في التواصل معنا. فريق الدعم جاهز لمساعدتك 24/7
            </p>
            <motion.a
              href="mailto:support@vidgrab-pro.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <HelpCircle className="w-5 h-5" />
              <span>اتصل بنا</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQSection