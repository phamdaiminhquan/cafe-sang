import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

import { mockReviews } from '../data/mockReviews';
import { Review } from '../types';

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const formatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const STAR_RANGE = [1, 2, 3, 4, 5];

const formatDate = (date?: string | Date) => {
  if (!date) return null;
  try {
    return formatter.format(new Date(date));
  } catch (error) {
    return null;
  }
};

const getImageTileClass = (images: string[], index: number) => {
  if (images.length === 1) {
    return 'col-span-2 aspect-[3/2]';
  }

  if (images.length === 3 && index === 0) {
    return 'col-span-2 aspect-[3/2]';
  }

  return 'aspect-square';
};

export function ReviewsSection() {
  const prefersReducedMotion = useReducedMotion();
  const [lightboxState, setLightboxState] = useState<{ review: Review; index: number } | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  const openLightbox = useCallback((review: Review, imageIndex: number) => {
    if (!review.images?.length) return;
    setLightboxState({ review, index: imageIndex });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxState(null);
  }, []);

  const showNext = useCallback(() => {
    setLightboxState((state) => {
      if (!state) return state;
      const totalImages = state.review.images.length;
      const nextIndex = (state.index + 1) % totalImages;
      return { ...state, index: nextIndex };
    });
  }, []);

  const showPrev = useCallback(() => {
    setLightboxState((state) => {
      if (!state) return state;
      const totalImages = state.review.images.length;
      const prevIndex = (state.index - 1 + totalImages) % totalImages;
      return { ...state, index: prevIndex };
    });
  }, []);

  useEffect(() => {
    if (!lightboxState) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPrev();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxState, closeLightbox, showNext, showPrev]);

  useEffect(() => {
    if (!lightboxState) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimeout = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimeout);
    };
  }, [lightboxState]);

  const handleLightboxKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const focusableElements = lightboxRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const activeReview = lightboxState?.review ?? null;
  const activeIndex = lightboxState?.index ?? 0;
  const activeImage = activeReview ? activeReview.images[activeIndex] : undefined;
  const totalImages = activeReview?.images.length ?? 0;

  return (
    <>
      <section id="reviews" className="section-wrap bg-gray-50 dark:bg-gray-950">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-4 shadow-soft">
              <Quote className="h-4 w-4" aria-hidden={true} />
              <span className="text-sm font-semibold uppercase tracking-widest">
                Khách hàng nói gì về chúng tôi
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              Những trải nghiệm đáng nhớ
            </h2>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-600 dark:text-gray-400">
              Chúng tôi luôn lắng nghe và cải thiện dịch vụ mỗi ngày để mang đến không gian cà phê ấm áp, thân thiện nhất.
            </p>
          </motion.div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
          >
            {mockReviews.map((review) => {
              const reviewDate = formatDate(review.date);
              const overflowCount = Math.max(0, review.images.length - 4);
              const imagesToDisplay = overflowCount > 0 ? review.images.slice(0, 4) : review.images;

              return (
                <motion.article
                  key={review.id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-hover transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4 mb-4 md:mb-6">
                    <img
                      src={review.userAvatar}
                      alt={`Ảnh đại diện của ${review.userName}`}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover border border-amber-200 dark:border-amber-900/50 shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {review.userName}
                        </h3>
                        {reviewDate && (
                          <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {reviewDate}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {STAR_RANGE.map((value) => (
                          <Star
                            key={value}
                            className={`h-4 w-4 ${
                              value <= Math.round(review.rating)
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                            aria-hidden={true}
                          />
                        ))}
                        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 ml-2">
                          {review.rating.toFixed(1)} / 5.0
                        </span>
                      </div>
                    </div>
                  </div>

                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.comment}
                </p>

                {imagesToDisplay.length > 0 && (
                  <div className="mt-5">
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {imagesToDisplay.map((image, index) => {
                        const isOverflowTile = overflowCount > 0 && index === imagesToDisplay.length - 1;
                        const tileClass = getImageTileClass(imagesToDisplay, index);

                        return (
                          <motion.button
                            key={image}
                            type="button"
                            onClick={() => openLightbox(review, index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 transition-transform cursor-zoom-in ${tileClass}`}
                            aria-label={`Xem hình ảnh ${index + 1} trong đánh giá của ${review.userName}`}
                          >
                            <img
                              src={image}
                              alt={`Hình ảnh ${index + 1} trong đánh giá của ${review.userName}`}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {isOverflowTile && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-lg font-semibold">
                                  +{overflowCount}
                                </span>
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      Nhấn vào hình để xem chi tiết
                    </p>
                  </div>
                )}
              </motion.article>
            );
          })}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxState && activeReview && activeImage && (
          <motion.div
            key="review-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-4xl"
              role="dialog"
              aria-modal="true"
              aria-label={`Ảnh trong đánh giá của ${activeReview.userName}`}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={handleLightboxKeyDown}
              ref={lightboxRef}
            >
              <div className="relative rounded-3xl border border-white/10 bg-black/30 shadow-2xl overflow-hidden">
                <img
                  src={activeImage}
                  alt={`Hình ảnh ${activeIndex + 1} trong đánh giá của ${activeReview.userName}`}
                  className="w-full max-h-[70vh] object-contain bg-black"
                />

                <button
                  type="button"
                  ref={closeButtonRef}
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <span className="sr-only">Đóng hình</span>
                  ×
                </button>

                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <span className="sr-only">Xem ảnh trước</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden={true} />
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <span className="sr-only">Xem ảnh kế tiếp</span>
                      <ChevronRight className="h-5 w-5" aria-hidden={true} />
                    </button>
                  </>
                )}

                <div className="bg-black/40 px-6 py-4 text-white">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold text-white">{activeReview.userName}</span>
                    {totalImages > 1 && (
                      <span>
                        {activeIndex + 1} / {totalImages}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{activeReview.comment}</p>
                </div>

                {totalImages > 1 && (
                  <div className="bg-black/30 px-6 py-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {activeReview.images.map((image, thumbIndex) => {
                        const isActive = thumbIndex === activeIndex;
                        return (
                          <button
                            key={image}
                            type="button"
                            onClick={() => setLightboxState({ review: activeReview, index: thumbIndex })}
                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border ${
                              isActive
                                ? 'border-amber-400 ring-2 ring-amber-500'
                                : 'border-white/10 hover:border-amber-300/60'
                            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
                          >
                            <span className="sr-only">Chọn hình {thumbIndex + 1}</span>
                            <img
                              src={image}
                              alt={`Hình ${thumbIndex + 1} trong đánh giá của ${activeReview.userName}`}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
