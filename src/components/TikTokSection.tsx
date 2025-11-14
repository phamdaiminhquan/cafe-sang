import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface TikTokSectionProps {
  videoUrls?: string[];
}

interface TikTokItem {
  id: string;
  originalUrl: string;
  username?: string;
  label: string;
}

const DEFAULT_TIKTOK_URLS: string[] = [
  'https://www.tiktok.com/@phamdaiminhquan/video/7183560487106252058?_r=1&_t=ZS-91OPcR3W1gH',
  'https://www.tiktok.com/@phamdaiminhquan/video/7170287020118396186?_r=1&_t=ZS-91OPi0PgNWb',
  'https://www.tiktok.com/@phamdaiminhquan/video/7225064022821965061?_r=1&_t=ZS-91OPmSGfhdh',
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

const parseTikTokUrl = (url: string): TikTokItem | null => {
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.replace('www.', '').replace('m.', '');
    const pathSegments = parsed.pathname.split('/').map((segment) => segment.trim()).filter(Boolean);

    if (!hostname.endsWith('tiktok.com')) {
      return null;
    }

    const videoIndex = pathSegments.findIndex((segment) => segment === 'video');
    if (videoIndex === -1 || videoIndex + 1 >= pathSegments.length) {
      return null;
    }

    const videoId = pathSegments[videoIndex + 1]?.split('?')[0]?.split('#')[0];
    if (!videoId) {
      return null;
    }

    const userSegment = pathSegments.slice(0, videoIndex).find((segment) => segment.startsWith('@'));
    const username = userSegment ? userSegment.replace('@', '') : undefined;

    const canonicalUrl = `https://www.tiktok.com/${userSegment ?? ''}/video/${videoId}`;
    const label = username ? `TikTok vui nhộn của @${username}` : `TikTok vui nhộn #${videoId.slice(0, 4)}`;

    return {
      id: videoId,
      originalUrl: canonicalUrl,
      username,
      label,
    };
  } catch (error) {
    console.warn('Không thể phân tích URL TikTok:', url, error);
    return null;
  }
};

interface TikTokCardProps {
  video: TikTokItem;
  index: number;
}

function TikTokCard({ video, index }: TikTokCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      className="relative"
    >
      <blockquote
        className="tiktok-embed rounded-2xl overflow-hidden"
        cite={video.originalUrl}
        data-video-id={video.id}
        style={{ maxWidth: 505, minWidth: 280, margin: '0 auto' }}
      >
        <section>
          <a href={video.originalUrl} target="_blank" rel="noreferrer">
            Xem video TikTok
          </a>
        </section>
      </blockquote>

      <div className="mt-3 text-right">
        <a
          href={video.originalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
        >
          <span>Xem trên TikTok</span>
          <ExternalLink className="h-4 w-4" aria-hidden={true} />
        </a>
      </div>
    </motion.div>
  );
}

export function TikTokSection({ videoUrls }: TikTokSectionProps) {
  const inputUrls = useMemo(() => {
    if (videoUrls && videoUrls.length > 0) {
      return videoUrls;
    }
    return DEFAULT_TIKTOK_URLS;
  }, [videoUrls]);

  const videos = useMemo(() => {
    return inputUrls.reduce<TikTokItem[]>((acc, url) => {
      const parsed = parseTikTokUrl(url);
      if (parsed) {
        acc.push(parsed);
      }
      return acc;
    }, []);
  }, [inputUrls]);

  useEffect(() => {
    if (videos.length === 0) {
      return;
    }

    const scriptSrc = 'https://www.tiktok.com/embed.js';
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`);

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
      return;
    }

    const globalWindow = window as Window & { tiktokEmbedLoad?: () => void };
    globalWindow.tiktokEmbedLoad?.();
  }, [videos]);

  return (
    <motion.section
      className="section-wrap bg-gray-50 dark:bg-gray-950"
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
            <span className="text-xs font-semibold uppercase tracking-[0.35em]">AB COFFEE</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
            TikTok Vui Nhộn
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ngó qua những clip ngắn tràn đầy năng lượng trên TikTok của chủ quán, nơi câu chuyện thú vị về AB Coffee được kể mỗi ngày.
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 p-8 text-center text-gray-600 dark:text-gray-400">
            Chưa có video TikTok nào được chia sẻ. Hãy quay lại sau nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {videos.map((video, index) => (
              <TikTokCard key={video.id} video={video} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
