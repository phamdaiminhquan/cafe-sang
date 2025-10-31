import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, Phone, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: 'demo@cafe.com',
    password: 'demo',
    fullName: '',
    phone: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // Focus trap + Escape to close + focus restore
  useEffect(() => {
    if (!isOpen) return;

    lastActiveRef.current = document.activeElement as HTMLElement;

    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const container = dialogRef.current;
    const focusables = container?.querySelectorAll<HTMLElement>(focusableSelectors);
    focusables && focusables[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key === 'Tab' && container && focusables && focusables.length > 0) {
        const list = Array.from(focusables);
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey) {
          if (active === first || !container.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Restore focus to trigger element
      lastActiveRef.current?.focus();
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    if (isRegistering) {
      if (!formData.fullName) {
        newErrors.fullName = 'Họ tên là bắt buộc';
      }

      if (!formData.phone) {
        newErrors.phone = 'Số điện thoại là bắt buộc';
      } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let success = false;
      
      if (isRegistering) {
        success = await register(formData.email, formData.password, formData.fullName, formData.phone);
        if (success) {
          alert('Đăng ký thành công!');
        } else {
          alert('Đăng ký thất bại!');
        }
      } else {
        success = await login(formData.email, formData.password);
        if (!success) {
          alert('Đăng nhập thất bại!');
        }
      }
      
      if (success) {
        onClose();
        resetForm();
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: 'demo@cafe.com',
      password: 'demo',
      fullName: '',
      phone: '',
      confirmPassword: ''
    });
    setErrors({});
    setIsRegistering(false);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setErrors({});
    if (!isRegistering) {
      // Switching to register mode, clear demo data
      setFormData({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        confirmPassword: ''
      });
    } else {
      // Switching to login mode, restore demo data
      setFormData({
        email: 'demo@cafe.com',
        password: 'demo',
        fullName: '',
        phone: '',
        confirmPassword: ''
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            ref={dialogRef}
            className="w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 id="auth-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                {isRegistering ? 'Đăng ký' : 'Đăng nhập'}
              </h2>
              <button
                onClick={handleClose}
                aria-label="Đóng"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <X className="h-5 w-5 text-gray-500" aria-hidden={true} />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Họ tên
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden={true} />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={'Nhập họ tên của bạn'}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden={true} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={'Nhập email của bạn'}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden={true} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white ${
                          errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={'Nhập số điện thoại'}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden={true} />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white ${
                        errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={'Nhập mật khẩu'}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden={true} />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={'Nhập lại mật khẩu'}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {!isRegistering && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg space-y-2">
                    <div className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      Tài khoản Demo:
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData({ ...formData, email: 'demo@cafe.com', password: 'demo' });
                        }}
                        className="bg-white dark:bg-gray-700 p-2 rounded border-l-2 border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
                      >
                        <div className="font-medium text-blue-600 dark:text-blue-400">
                          Khách hàng:
                        </div>
                        <div>demo@cafe.com / demo</div>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData({ ...formData, email: 'staff@cafe.com', password: 'staff' });
                        }}
                        className="bg-white dark:bg-gray-700 p-2 rounded border-l-2 border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left"
                      >
                        <div className="font-medium text-green-600 dark:text-green-400">
                          Nhân viên:
                        </div>
                        <div>staff@cafe.com / staff</div>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData({ ...formData, email: 'admin@cafe.com', password: 'admin' });
                        }}
                        className="bg-white dark:bg-gray-700 p-2 rounded border-l-2 border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
                      >
                        <div className="font-medium text-purple-600 dark:text-purple-400">
                          Quản lý:
                        </div>
                        <div>admin@cafe.com / admin</div>
                      </motion.button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                      💡 Nhấn vào tài khoản để điền tự động
                    </div>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 btn-shine"
                >
                  {isRegistering ? (
                    <UserPlus className="h-4 w-4" aria-hidden={true} />
                  ) : (
                    <LogIn className="h-4 w-4" aria-hidden={true} />
                  )}
                  {isLoading ? 'Đang xử lý...' : (isRegistering ? 'Đăng ký' : 'Đăng nhập')}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={toggleMode}
                  className="text-amber-600 hover:text-amber-700 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                >
                  {isRegistering ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}