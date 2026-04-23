/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { Terminal, Gamepad2, Radio } from 'lucide-react';

export default function App() {
  return (
    <div id="neon-app-container" className="relative min-h-screen w-full bg-cyber-black text-white flex flex-col font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-neon-blue/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-pink/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neon-blue/10 border border-neon-blue/30 rounded-lg flex items-center justify-center">
            <Terminal className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight">
              NEON<span className="text-neon-pink">RHYTHM</span>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">v2.0.84 - System Stable</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-widest text-white/50">
          <a href="#" className="hover:text-neon-blue transition-colors flex items-center gap-2">
            <Gamepad2 className="w-3 h-3" /> Console
          </a>
          <a href="#" className="hover:text-neon-pink transition-colors flex items-center gap-2 active text-white">
            <Radio className="w-3 h-3" /> Broadcaster
          </a>
          <div className="w-[1px] h-4 bg-white/10" />
          <span className="text-neon-blue">Auth: Guest_User</span>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center p-8 gap-12 lg:gap-24 overflow-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-2 lg:order-1"
        >
          <MusicPlayer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2"
        >
          <div className="relative">
            {/* Decorative frame for game */}
            <div className="absolute -inset-4 border border-white/5 rounded-2xl pointer-events-none" />
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-neon-blue/40 rounded-tl-lg pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-neon-pink/40 rounded-br-lg pointer-events-none" />
            
            <SnakeGame />
          </div>
        </motion.div>

        {/* Right Sidebar Stats (Visual only) */}
        <motion.aside 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden xl:flex flex-col gap-6 w-48 order-3"
        >
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 border-b border-white/5 pb-2">Environmental Data</h4>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-white/50 uppercase">Sync Status</span>
              <span className="text-xs text-neon-blue font-mono">100% Locked</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-white/50 uppercase">Grid Load</span>
              <span className="text-xs text-neon-pink font-mono">3.4ms API</span>
            </div>
            <div className="w-full h-12 bg-white/5 rounded flex items-end gap-1 p-1">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-neon-blue/20 rounded-t-sm" 
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-2">System Notice</h4>
            <p className="text-[10px] leading-relaxed text-white/60 font-medium">
              High score frequency detected in local sector. Please report all anomalies to Central Admin.
            </p>
          </div>
        </motion.aside>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 border-t border-white/5 backdrop-blur-sm">
        <div className="flex gap-6">
          <span>Network: Connected</span>
          <span>Latency: 12ms</span>
        </div>
        <div className="flex gap-6">
          <span>&copy; 2084 NEON_OS</span>
          <span className="text-white/40">Terminal_Session_382</span>
        </div>
      </footer>
    </div>
  );
}
