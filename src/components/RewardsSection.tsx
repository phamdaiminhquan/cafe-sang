import { motion } from 'framer-motion';
import { Gift, Star } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { rewards } from '../data/mockData';
import { useState } from 'react';

export function RewardsSection() {

  const { user, updateUserPoints } = useAuth();
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  const handleRedeem = (rewardId: string, pointsRequired: number) => {
    if (!user || user.points < pointsRequired || isRedeeming) return;
    
    setIsRedeeming(rewardId);
    
    // Simulate API call delay
    setTimeout(() => {
      // Deduct points from user
      const newPoints = user.points - pointsRequired;
      updateUserPoints(newPoints);
      
      // Show success message
      alert(`Đổi thưởng thành công!\nĐiểm còn lại: ${newPoints}`);
      
      setIsRedeeming(null);
    }, 1000);
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  } as const;

  return (
    <section className="section-wrap bg-gray-50 dark:bg-gray-900">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            Doi thuong
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Tich diem moi don hang
          </p>
        </motion.div>

        {user && (
          <div className="text-center mb-8 md:mb-12 stable-layout">
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full shadow-lg user-info-stable">
              <Star className="h-5 w-5 md:h-6 md:w-6 fill-current" aria-hidden={true} />
              <span className="text-lg md:text-xl font-bold stable-text points-display">
                Diem cua ban: {user.points}
              </span>
            </div>
          </div>
        )}

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={reward.image}
                    alt={reward.name}
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="w-full h-40 md:h-48 object-cover"
                  />
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/20 backdrop-blur-sm rounded-full px-2 md:px-3 py-1">
                    <span className="text-white text-sm font-semibold">
                      {reward.pointsRequired} diem
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold font-display text-gray-900 dark:text-white mb-2">
                    {reward.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 text-sm">
                    {reward.description}
                  </p>

                  {user ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRedeem(reward.id, reward.pointsRequired)}
                      disabled={user.points < reward.pointsRequired || isRedeeming === reward.id}
                      aria-disabled={user.points < reward.pointsRequired || isRedeeming === reward.id}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 btn-shine ${
                        user.points >= reward.pointsRequired && isRedeeming !== reward.id
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      } text-sm md:text-base`}
                    >
                      <Gift className="h-4 w-4" aria-hidden={true} />
                      {isRedeeming === reward.id
                        ? 'Dang doi...'
                        : 'Doi thuong'
                      }
                    </motion.button>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-3">
                      Dang nhap de doi thuong
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}