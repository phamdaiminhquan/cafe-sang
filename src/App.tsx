import React, { Suspense, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
const MenuSection = React.lazy(() => import('./components/MenuSection').then(m => ({ default: m.MenuSection })));
const AboutSection = React.lazy(() => import('./components/AboutSection').then(m => ({ default: m.AboutSection })));
const VideoSection = React.lazy(() => import('./components/VideoSection').then(m => ({ default: m.VideoSection })));
const TikTokSection = React.lazy(() => import('./components/TikTokSection').then(m => ({ default: m.TikTokSection })));
// const RewardsSection = React.lazy(() => import('./components/RewardsSection').then(m => ({ default: m.RewardsSection })));
const ReviewsSection = React.lazy(() => import('./components/ReviewsSection').then(m => ({ default: m.ReviewsSection })));
const ContactSection = React.lazy(() => import('./components/ContactSection').then(m => ({ default: m.ContactSection })));
// const LoginModal = React.lazy(() => import('./components/LoginModal').then(m => ({ default: m.LoginModal })));
const OrderModal = React.lazy(() => import('./components/OrderModal').then(m => ({ default: m.OrderModal })));
// const DemoUserSwitcher = React.lazy(() => import('./components/DemoUserSwitcher').then(m => ({ default: m.DemoUserSwitcher })));
import { ThemeProvider } from './contexts/ThemeContext';

// import { AuthProvider } from './contexts/AuthContext';
import { MenuItem } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Listen for custom events to open login modal
  // React.useEffect(() => {
  //   const handleOpenLoginModal = () => {
  //     setIsLoginModalOpen(true);
  //   };

  //   window.addEventListener('openLoginModal', handleOpenLoginModal);
  //   return () => window.removeEventListener('openLoginModal', handleOpenLoginModal);
  // }, []);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderClick = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsOrderModalOpen(true);
  };

  return (

      <ThemeProvider>
        {/* <AuthProvider> */}
          <div className="min-h-screen bg-white dark:bg-black transition-colors overflow-x-hidden">
            {/* <a href="#main" className="skip-link">Bỏ qua để vào nội dung</a> */}
            <Header
              currentSection={currentSection}
              onSectionChange={handleSectionChange}
              // onLoginClick={() => setIsLoginModalOpen(true)}
            />

            <main id="main">
              <section id="home">
                <Hero onExploreClick={() => handleSectionChange('menu')} />
              </section>

              <section id="menu">
                <Suspense fallback={<div className="section-wrap"><div className="section-container"><div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /></div></div>}>
                  <MenuSection onOrderClick={handleOrderClick} />
                </Suspense>
              </section>

              <section id="about">
                <Suspense fallback={<div className="section-wrap"><div className="section-container"><div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /></div></div>}>
                  <AboutSection />
                </Suspense>
              </section>

              <section id="videos">
                <Suspense fallback={<div className="section-wrap"><div className="section-container"><div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /></div></div>}>
                  <VideoSection />
                </Suspense>
              </section>

              <section id="tiktok">
                <Suspense fallback={<div className="section-wrap"><div className="section-container"><div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /></div></div>}>
                  <TikTokSection />
                </Suspense>
              </section>

              {/* <section id="rewards">
                <Suspense fallback={<div className="section-wrap"><div className="section-container"><div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /></div></div>}>
                  <RewardsSection />
                </Suspense>
              </section> */}

              <section id="reviews">
                <Suspense fallback={<div className="section-wrap"><div className="section-container"><div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /></div></div>}>
                  <ReviewsSection />
                </Suspense>
              </section>

              <section id="contact">
                <Suspense fallback={<div className="section-wrap"><div className="section-container"><div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /></div></div>}>
                  <ContactSection />
                </Suspense>
              </section>
            </main>

            {/* <Suspense fallback={null}>
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
              />
            </Suspense> */}

            <Suspense fallback={
              <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
                <div className="px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg text-gray-700 dark:text-gray-200 text-sm">
                  Đang mở hộp thoại đặt món...
                </div>
              </div>
            }>
              <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                item={selectedMenuItem}
              />
            </Suspense>

            {/* <Suspense fallback={null}>
              <DemoUserSwitcher />
            </Suspense> */}
          </div>
        {/* </AuthProvider> */}
      </ThemeProvider>

  );
}

export default App;