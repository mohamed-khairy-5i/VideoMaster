import React from 'react'
import HeroSection from '../components/home/HeroSection'
import DownloadSection from '../components/home/DownloadSection'
import FeaturesSection from '../components/home/FeaturesSection'
import PlatformsSection from '../components/home/PlatformsSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import StatsSection from '../components/home/StatsSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import FAQSection from '../components/home/FAQSection'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Download Section */}
      <DownloadSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Supported Platforms */}
      <PlatformsSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* FAQ */}
      <FAQSection />
    </div>
  )
}

export default HomePage