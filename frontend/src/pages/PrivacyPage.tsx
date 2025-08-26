import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Server } from 'lucide-react'

const PrivacyPage: React.FC = () => {
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
            سياسة الخصوصية 🔒
          </h1>
          <p className="text-xl text-gray-600">
            حماية خصوصيتك هي أولويتنا القصوى
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-green-500 ml-3" />
              <h2 className="text-2xl font-bold text-gray-900">لا نحفظ بياناتك</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              لا نقوم بحفظ أو تخزين أي معلومات شخصية أو روابط الفيديوهات التي تقوم بتحميلها. جميع العمليات تتم في الوقت الفعلي وبشكل مؤقت.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-blue-500 ml-3" />
              <h2 className="text-2xl font-bold text-gray-900">تشفير SSL</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              جميع البيانات المتبادلة بين متصفحك وخوادمنا مشفرة باستخدام بروتوكول SSL/TLS المتقدم. هذا يضمن عدم إمكانية اعتراض أو قراءة بياناتك من قبل أطراف ثالثة.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-purple-500 ml-3" />
              <h2 className="text-2xl font-bold text-gray-900">لا إعلانات مزعجة</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              نحن نؤمن بأن تجربة المستخدم يجب أن تكون نظيفة وسلسة. لذلك لا نعرض أي إعلانات مزعجة أو منبثقة تخل بتركيزك على ما تريد تحميله.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center"
          >
            <Server className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">التزامنا بالشفافية</h2>
            <p className="text-xl opacity-90">
              عندما تستخدم VidGrab Pro، فأنت توافق على هذه الشروط وتثق في التزامنا بحماية خصوصيتك
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage