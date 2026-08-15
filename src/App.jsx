import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import PlatformPage from './pages/PlatformPage';
import NotFoundPage from './pages/NotFoundPage';

/*
 * On a client-routed site the browser keeps the old scroll position when the URL
 * changes, so navigating from the bottom of the FAQ to /privacy lands the user
 * halfway down the legal text. The browser does this correctly for real page
 * loads; with a router it has to be done by hand.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface">
      {/* Keyboard users would otherwise have to tab through the whole header on
          every page before reaching content. */}
      <a href="#main" className="skip-link">
        تجاوز إلى المحتوى
      </a>

      <ScrollToTop />
      <Header />

      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/platform/:platform" element={<PlatformPage />} />
          {/* Without this, an unknown URL rendered the header and footer around
              an empty main, which looks like a crash. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
