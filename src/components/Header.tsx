import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// import { useAuth } from '../contexts/AuthContext';
// import { UserRoleIndicator } from './UserRoleIndicator';

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  // onLoginClick: () => void;
}

export function Header({ currentSection, onSectionChange }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  // const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Scroll progress for top indicator
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'menu', label: 'Thực đơn' },
    { id: 'about', label: 'Về chúng tôi' },
    { id: 'videos', label: 'Video hài' },
    { id: 'tiktok', label: 'TikTok vui' },
    { id: 'reviews', label: 'Đánh giá' },
    { id: 'contact', label: 'Liên hệ' }
  ];

  return (
    <>
    {/* Scroll progress indicator */}
    <motion.div
      className="fixed left-0 top-0 h-1 origin-left z-[60] bg-primary-gradient"
      style={{ scaleX: progressX }}
    />
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-b border-gray-200/20 dark:border-white/10 ${scrolled ? 'shadow-md' : ''}`}
    >
  <div className="container max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onSectionChange('home')}
          >
            <span className="text-2xl font-bold font-display text-gray-900 dark:text-white">
              AB Coffee
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSectionChange(item.id)}
                aria-current={currentSection === item.id ? 'page' : undefined}
                className={`transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 rounded-md ${
                  currentSection === item.id
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* {user && (
              <div className="flex items-center gap-3 stable-layout user-info-stable">
                <UserRoleIndicator user={user} />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 stable-layout min-w-[8rem]">
                  <span className="text-xs lg:text-sm text-amber-800 dark:text-amber-200 stable-text">
                    Điểm của bạn: {user.points}
                  </span>
                  {user.isInStore && (
                    <span className="text-xs px-1.5 py-0.5 bg-green-500 text-white rounded-full">
                      Đang ở tiệm
                    </span>
                  )}
                </div>
              </div>
            )} */}



            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-gray-700" />
              )}
            </motion.button>

            {/* {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  logout();
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Đăng xuất</span>

              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoginClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm btn-premium min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
              >
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">Đăng nhập</span>
              </motion.button>
            )} */}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* {user && (
              <div className="flex items-center gap-1 user-info-stable">
                <UserRoleIndicator user={user} compact />
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 min-w-[4rem] stable-layout">
                  <span className="text-xs text-amber-800 dark:text-amber-200 font-medium stable-text">
                    {user.points}
                  </span>
                  {user.isInStore && (
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  )}
                </div>
              </div>
            )} */}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Mở menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer"
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>
      
      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85%] bg-white dark:bg-gray-900 shadow-xl p-4"
            id="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            aria-label="Menu di động"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
              <button
                aria-label="Đóng menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <nav className="flex flex-col gap-2" aria-label="Điều hướng di động">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  aria-current={currentSection === item.id ? 'page' : undefined}
                  className={`text-left py-3 px-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    currentSection === item.id
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-700" />
                )}
              </button>
              {/* {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm min-h-[44px]"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm min-h-[44px] btn-shine"
                >
                  <User className="h-4 w-4" />
                  Đăng nhập
                </button>
              )} */}
            </div>
          </motion.aside>
        </div>
      )}
      </div>
    </motion.header>
    </>
  );
}