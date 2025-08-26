import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'

// Components
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'

// Layout animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <HomePage />
              </motion.div>
            } 
          />
          <Route 
            path="/about" 
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <AboutPage />
              </motion.div>
            } 
          />
          <Route 
            path="/privacy" 
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <PrivacyPage />
              </motion.div>
            } 
          />
          <Route 
            path="*" 
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <NotFoundPage />
              </motion.div>
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App