import { motion } from 'framer-motion';
import { Coffee, Heart, Users, Award } from 'lucide-react';


export function AboutSection() {

  const features = [
    {
      icon: Coffee,
      title: 'Cà phê chất lượng',
      description: 'Hạt cà phê được chọn lọc kỹ càng từ những vùng trồng nổi tiếng',
    },
    {
      icon: Heart,
      title: 'Pha chế tâm huyết',
      description: 'Mỗi ly cà phê được pha chế với tình yêu và sự tỉ mỉ',
    },
    {
      icon: Users,
      title: 'Không gian thoáng đã',
      description: 'Môi trường thân thiện, lý tưởng cho việc thư giãn và làm việc',
    },
    {
      icon: Award,
      title: 'Dịch vụ tận tâm',
      description: 'Đội ngũ nhân viên nhiệt tình, luôn sẵn sàng phục vụ',
    }
  ];

  // Stagger variants for feature cards
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
    <section className="section-wrap bg-white dark:bg-black">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 md:mb-6">
            Về AB Coffee
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi là một quán cà phê nhỏ với tình yêu lớn dành cho cà phê. Mỗi tách cà phê được pha chế với tâm huyết và sự chăm sóc tỉ mỉ.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="text-center p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-xl md:rounded-2xl hover:shadow-lg transition-all duration-300">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3 md:mb-4"
                >
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-amber-600" />
                </motion.div>
                <h3 className="text-lg md:text-xl font-bold font-display text-gray-900 dark:text-white mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coffee Shop Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-8 md:mt-16 relative overflow-hidden rounded-2xl md:rounded-3xl"
        >
          <img
            src="https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Không gian quán cà phê"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="w-full h-48 md:h-64 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}