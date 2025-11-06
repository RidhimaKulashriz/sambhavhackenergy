import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SkipForward, Play, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface HeroVideoProps {
  videoUrl?: string;
  posterUrl?: string;
  onSkip?: () => void;
}

export const HeroVideo = ({ 
  videoUrl = '/placeholder-hero-video.mp4', 
  posterUrl = '/placeholder-poster.jpg',
  onSkip 
}: HeroVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { reduceMotion } = useTheme();

  useEffect(() => {
    // Auto-hide video after it ends or if reduce motion is enabled
    if (reduceMotion) {
      setShowVideo(false);
    }
  }, [reduceMotion]);

  const handleSkip = () => {
    setShowVideo(false);
    onSkip?.();
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  if (!showVideo) return null;

  return (
    <section 
      className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden"
      aria-label="Hero introduction video"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={posterUrl}
        muted
        playsInline
        onEnded={handleVideoEnd}
        aria-describedby="video-description"
      >
        <source src={videoUrl} type="video/mp4" />
        <track
          kind="captions"
          src="/captions.vtt"
          srcLang="en"
          label="English captions"
        />
        Your browser does not support the video tag.
      </video>

      <p id="video-description" className="sr-only">
        Introduction video showcasing CollabForge platform and its features
      </p>

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6">
          {!isPlaying && (
            <Button 
              variant="ghost" 
              size="lg" 
              className="h-16 w-16 rounded-full bg-background/30 backdrop-blur-sm hover:bg-background/50"
              onClick={handlePlay}
              aria-label="Play video"
            >
              <Play className="h-8 w-8" />
            </Button>
          )}
          <a 
            href="https://drive.google.com/file/d/18mM9ntrjNFqhZuSKQxBmOTdp4vqc8klX/view?usp=drive_link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 backdrop-blur-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Watch Full Demo Video
          </a>
        </div>
      </div>

      {/* Accessibility: Skip link always visible for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>
    </section>
  );
};
