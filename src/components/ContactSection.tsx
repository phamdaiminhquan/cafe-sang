import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';


export function ContactSection() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã liên hệ!');
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    { icon: Phone, title: 'Điện thoại', value: '(028) 1234 5678' },
    { icon: Mail, title: 'Email', value: 'hello@cafesang.com' },
    { icon: MapPin, title: 'Địa chỉ', value: '123 Đường Nguyễn Văn A, Quận 1, TP.HCM' },
    { icon: Clock, title: 'Giờ mở cửa', value: 'T2-CN: 6:00 - 22:00' }
  ];

  return (
    <section className="section-wrap bg-white dark:bg-black">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 md:mb-6">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl md:text-2xl font-bold font-display text-gray-900 dark:text-white mb-6 md:mb-8">
              Thông tin liên hệ
            </h3>
            
            <div className="space-y-4 md:space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <info.icon className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">
                      {info.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                      {info.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-6 md:mt-8 h-48 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
            >
              <img
                src="https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Café location"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl md:text-2xl font-bold font-display text-gray-900 dark:text-white mb-6 md:mb-8">
              Gửi tin nhắn
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="transition-transform"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                  required
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="transition-transform"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                  required
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="transition-transform"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  Tin nhắn
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-4 md:px-6 py-3 text-white font-semibold rounded-lg text-sm md:text-base btn-premium min-h-[44px]"
              >
                <Send className="h-4 w-4" />
                Gửi tin nhắn
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}