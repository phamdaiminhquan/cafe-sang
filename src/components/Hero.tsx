import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';


interface HeroProps {
  onExploreClick: () => void;
}

export function Hero({ onExploreClick }: HeroProps) {

  // Subtle parallax based on scroll
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Parallax Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        style={{ y }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div
          className="w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
          }}
        />
        {/* Base dark overlay */}
        <div className="absolute inset-0 bg-black/60 dark:bg-black/80" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-4 md:mb-6 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        >
          Chào mừng đến với
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-4 md:mb-6 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        >
          AB Coffee
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Thưởng thức hương vị cà phê đậm đà tại AB Coffee
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExploreClick}
          className="group relative inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 text-white text-base md:text-lg font-semibold rounded-full transition-all duration-300 shadow-soft hover:shadow-hover bg-amber-600 hover:bg-amber-700 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Khám phá thực đơn
          {/* Shine effect */}
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute -left-1/3 top-0 h-full w-1/3 bg-white/20 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </span>
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white cursor-pointer"
          onClick={onExploreClick}
        >
          <ChevronDown className="h-6 w-6 md:h-8 md:w-8" />
        </motion.div>
      </motion.div>
    </section>
  );
}