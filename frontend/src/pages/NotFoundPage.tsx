import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-9xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            الصفحة غير موجودة 😢
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse">
            <Link 
              to="/"
              className="btn-primary flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Home className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة للخلف</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage