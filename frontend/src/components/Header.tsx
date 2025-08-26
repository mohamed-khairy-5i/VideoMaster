import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download, Zap } from 'lucide-react'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Download },
    { name: 'حول الموقع', href: '/about', icon: Zap },
    { name: 'الخصوصية', href: '/privacy', icon: Menu },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient">VidGrab Pro</h1>
              <p className="text-xs text-gray-500 -mt-1">أفضل محمل فيديوهات</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Link 
              to="/#download"
              className="btn-primary btn-sm"
            >
              <Download className="w-4 h-4 ml-2" />
              تنزيل مجاني
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/#download"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تنزيل مجاني
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header