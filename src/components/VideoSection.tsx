import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, PlayCircle } from 'lucide-react';

interface VideoSectionProps {
  videoUrls?: string[];
}

interface VideoItem {
  id: string;
  embedUrl: string;
  thumbnailUrl: string;
  originalUrl: string;
  label: string;
}

const DEFAULT_VIDEO_URLS: string[] = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=9bZkp7q19f0',
  'https://www.youtube.com/watch?v=jNQXAC9IVRw',
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
} as const;

const getYoutubeId = (url: string): string | null => {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      return parsed.pathname.slice(1) || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch' || parsed.pathname === '/watch/') {
        return parsed.searchParams.get('v');
      }

      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1]?.split(/[?&]/)[0] ?? null;
      }

      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1]?.split(/[?&]/)[0] ?? null;
      }
    }

    return null;
  } catch (error) {
    console.warn('Không thể trích xuất video ID từ URL:', url, error);
    return null;
  }
};

interface VideoCardProps {
  video: VideoItem;
  index: number;
}

function VideoCard({ video, index }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsLoaded(false);
  }, []);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-900/70 shadow-soft hover:shadow-hover transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-gray-200 dark:bg-gray-800">
        {!isLoaded && (
          <div
            className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700"
            aria-hidden={true}
          />
        )}

        {isPlaying ? (
          <iframe
            src={`${video.embedUrl}&autoplay=1`}
            title={`Video ${video.label}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
            loading="lazy"
            className="absolute inset-0 h-full w-full"
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <>
            <img
              src={video.thumbnailUrl}
              alt={`Ảnh xem trước cho ${video.label}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              onLoad={() => setIsLoaded(true)}
            />
            <button
              type="button"
              onClick={handlePlay}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label={`Phát ${video.label}`}
            >
              <PlayCircle className="h-16 w-16 drop-shadow-lg" aria-hidden={true} />
              <span className="text-sm font-semibold uppercase tracking-wide">Xem video</span>
            </button>
          </>
        )}
      </div>

      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-display">
            {video.label}
          </h3>
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            YOUTUBE
          </span>
        </div>
        <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          Những khoảnh khắc vui nhộn trong quán, được chủ quán ghi lại và chia sẻ để mang tiếng cười đến mọi người.
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <a
            href={video.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
          >
            <span>Xem trên YouTube</span>
            <ExternalLink className="h-4 w-4" aria-hidden={true} />
          </a>
          {!isPlaying && (
            <button
              type="button"
              onClick={handlePlay}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 transition-colors"
            >
              <PlayCircle className="h-4 w-4" aria-hidden={true} />
              <span>Phát ngay</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function VideoSection({ videoUrls }: VideoSectionProps) {
  const inputUrls = useMemo(() => {
    if (videoUrls && videoUrls.length > 0) {
      return videoUrls;
    }
    return DEFAULT_VIDEO_URLS;
  }, [videoUrls]);

  const videos = useMemo<VideoItem[]>(() => {
    return inputUrls.reduce<VideoItem[]>((acc, url) => {
      const id = getYoutubeId(url);
      if (!id) {
        return acc;
      }

      const label = `Video hài #${acc.length + 1}`;
      const embedBase = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=1`;

      acc.push({
        id,
        embedUrl: embedBase,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        originalUrl: url,
        label,
      });

      return acc;
    }, []);
  }, [inputUrls]);

  return (
    <motion.section
      className="section-wrap bg-white dark:bg-black"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="section-container">
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-4 shadow-soft"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.35em]">YOUTUBE</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
            Video Giải Trí
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ủng hộ những video giải trí của chúng tôi qua YouTube, hy vọng rằng bạn sẽ thích chúng.
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 p-8 text-center text-gray-600 dark:text-gray-400">
            Chưa có video nào được chia sẻ. Hãy quay lại sau nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
