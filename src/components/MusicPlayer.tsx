/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Cybernetic Heartbeat',
    artist: 'NeuroLink Alpha',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    duration: 184,
  },
  {
    id: 2,
    title: 'Neon Horizon',
    artist: 'SynthWave Rider',
    cover: 'https://picsum.photos/seed/neon/400/400',
    duration: 215,
  },
  {
    id: 3,
    title: 'Midnight Grid',
    artist: 'RetroFuture 84',
    cover: 'https://picsum.photos/seed/grid/400/400',
    duration: 156,
  },
];

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentTrack = TRACKS[currentIndex];
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div id="music-player-container" className="w-full max-w-[360px] neon-border rounded-3xl p-6 flex flex-col gap-6 bg-cyber-black/60 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-neon-blue/70">
          <ListMusic className="w-4 h-4" />
          <span className="text-[10px] uppercase font-mono tracking-[0.2em]">Now Playing</span>
        </div>
        <div className="flex items-center gap-1 text-white/50">
          <Volume2 className="w-4 h-4" />
          <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-neon-blue" />
          </div>
        </div>
      </div>

      <div className="relative group cursor-pointer">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/80 via-transparent to-transparent opacity-60" />
            
            {isPlaying && (
              <div className="absolute bottom-4 left-4 flex gap-1 items-end">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 16, 8, 20, 6] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + i * 0.1,
                      ease: "easeInOut",
                    }}
                    className="w-1 bg-neon-blue rounded-full shadow-[0_0_8px_rgba(0,255,255,0.6)]"
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-1 text-center">
        <motion.h3 
          key={`title-${currentTrack.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-display font-bold text-white tracking-tight"
        >
          {currentTrack.title}
        </motion.h3>
        <motion.p 
          key={`artist-${currentTrack.id}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.5 }}
          className="text-sm font-sans tracking-wide"
        >
          {currentTrack.artist}
        </motion.p>
      </div>

      <div className="space-y-2">
        <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden cursor-pointer group">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-neon-blue shadow-[0_0_10px_rgba(0,255,255,0.4)]" 
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/30 tracking-widest">
          <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 mt-2">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-95"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white text-cyber-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>
        <button 
          onClick={handleNext}
          className="p-3 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-95"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
