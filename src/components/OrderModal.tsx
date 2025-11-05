import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, User, Lock } from 'lucide-react';
import { MenuItem } from '../types';

// import { useAuth } from '../contexts/AuthContext';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
}

export function OrderModal({ isOpen, onClose, item }: OrderModalProps) {

  // const { user, login } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // Do NOT early-return before hooks to avoid changing hooks order across renders
  const total = item ? item.price * quantity : 0;
  // const pointsToEarn = item ? Math.floor(total / 1000) : 0; // 1 point per 1000 VND

  // const validateGuestForm = () => {
  //   const newErrors: Record<string, string> = {};
    
  //   if (!guestInfo.name.trim()) {
  //     newErrors.name = 'Vui lòng nhập họ tên';
  //   }
    
  //   if (!guestInfo.phone.trim()) {
  //     newErrors.phone = 'Vui lòng nhập số điện thoại';
  //   } else if (!/^[0-9]{10,11}$/.test(guestInfo.phone.replace(/\s/g, ''))) {
  //     newErrors.phone = 'Số điện thoại không hợp lệ';
  //   }
    
  //   if (!guestInfo.email.trim()) {
  //     newErrors.email = 'Vui lòng nhập email';
  //   } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
  //     newErrors.email = 'Email không hợp lệ';
  //   }
    
  //   if (!guestInfo.password.trim()) {
  //     newErrors.password = 'Vui lòng nhập mật khẩu';
  //   }
    
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // If user is not logged in, show guest form
      // if (!user && !showGuestForm) {
      //   setShowGuestForm(true);
      //   setIsSubmitting(false);
      //   return;
      // }
      
      // If guest form is shown, validate and try to register/login
      // if (!user && showGuestForm) {
      //   if (!validateGuestForm()) {
      //     setIsSubmitting(false);
      //     return;
      //   }
        
      //   // Try to login first
      //   const loginSuccess = await login(guestInfo.email, guestInfo.password);
        
      //   if (!loginSuccess) {
      //     // If login fails, this would be registration in a real app
      //     alert('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      //     setIsSubmitting(false);
      //     return;
      //   }
      // }
      
      // Mock order submission
      if (!item) {
        return;
      }
      item.orders += quantity;
      
      alert('Đặt hàng thành công!');
      onClose();
      resetModal();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleGuestLogin = () => {
  //   setShowGuestForm(false);
  //   setErrors({});
    
  //   // Close modal and open login modal
  //   onClose();
  //   // This would trigger the main login modal
  //   setTimeout(() => {
  //     // Trigger login modal from parent component
  //     window.dispatchEvent(new CustomEvent('openLoginModal'));
  //   }, 100);
  // };

  const resetModal = () => {
    setShowGuestForm(false);
    setGuestInfo({ name: '', phone: '', email: '', password: '' });
    setQuantity(1);
    setNotes('');
    setErrors({});
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const isFormValid = showGuestForm 
    ? guestInfo.name && guestInfo.phone && guestInfo.email && guestInfo.password && Object.keys(errors).length === 0
    : true;

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
      lastActiveRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && item && (
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
            aria-labelledby="order-modal-title"
            ref={dialogRef}
            className="w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 md:h-48 object-cover"
              />
              <button
                onClick={handleClose}
                aria-label="Đóng"
                className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <X className="h-5 w-5 text-white" aria-hidden={true} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 max-h-[calc(90vh-10rem)] overflow-y-auto">
              <h2 id="order-modal-title" className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Đặt món
              </h2>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {item.description}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số lượng
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Giảm số lượng"
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      <Minus className="h-4 w-4" aria-hidden={true} />
                    </button>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Tăng số lượng"
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      <Plus className="h-4 w-4" aria-hidden={true} />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={'Ghi chú thêm...'}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                    rows={3}
                  />
                </div>

                {/* Guest Information Form */}
                {/* <AnimatePresence>
                  {!user && showGuestForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Thông tin khách hàng
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Họ tên
                          </label>
                          <input
                            type="text"
                            value={guestInfo.name}
                            onChange={(e) => {
                              setGuestInfo({ ...guestInfo, name: e.target.value });
                              if (errors.name) {
                                setErrors({ ...errors, name: '' });
                              }
                            }}
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm ${
                              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            value={guestInfo.phone}
                            onChange={(e) => {
                              setGuestInfo({ ...guestInfo, phone: e.target.value });
                              if (errors.phone) {
                                setErrors({ ...errors, phone: '' });
                              }
                            }}
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm ${
                              errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden={true} />
                          <input
                            type="email"
                            value={guestInfo.email}
                            onChange={(e) => {
                              setGuestInfo({ ...guestInfo, email: e.target.value });
                              if (errors.email) {
                                setErrors({ ...errors, email: '' });
                              }
                            }}
                            className={`w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm ${
                              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mật khẩu
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden={true} />
                          <input
                            type="password"
                            value={guestInfo.password}
                            onChange={(e) => {
                              setGuestInfo({ ...guestInfo, password: e.target.value });
                              if (errors.password) {
                                setErrors({ ...errors, password: '' });
                              }
                            }}
                            className={`w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm ${
                              errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleGuestLogin}
                          className="flex-1 py-2 px-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                          Đã có tài khoản?
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence> */}

                {/* Total */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.price.toLocaleString('vi-VN')}₫ × {quantity}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {total.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  {/* {(user || showGuestForm) && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-600">
                        Điểm tích lũy:
                      </span>
                      <span className="text-amber-600 font-semibold">
                        +{pointsToEarn}
                      </span>
                    </div>
                  )} */}
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span className="text-gray-900 dark:text-white">Tổng cộng:</span>
                      <span className="text-amber-600">{total.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  aria-disabled={isSubmitting || !isFormValid}
                  className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-lg transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 btn-shine ${
                    isFormValid && !isSubmitting
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden={true} />
                  {/* {isSubmitting ? 'Đang xử lý...' : (!user && !showGuestForm) ? 'Tiếp tục đặt món' : 'Đặt hàng'} */}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}