/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div id="snake-game-container" className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] mb-2 font-display">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-white/50">Current Score</span>
          <span className="text-3xl font-bold neon-text-blue">{score}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> High Score
          </span>
          <span className="text-3xl font-bold neon-text-pink">{highScore}</span>
        </div>
      </div>

      <div className="relative p-2 neon-border rounded-lg bg-cyber-black/80">
        <div 
          className="grid gap-[2px]" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 18px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 18px)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`w-[18px] h-[18px] rounded-sm transition-all duration-200 ${
                  isSnakeHead 
                    ? 'bg-neon-blue shadow-[0_0_10px_rgba(0,255,255,0.8)]' 
                    : isSnakeBody 
                    ? 'bg-neon-blue/40' 
                    : isFood 
                    ? 'bg-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.8)] animate-pulse' 
                    : 'bg-white/5'
                }`}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-cyber-black/60 backdrop-blur-sm rounded-lg"
            >
              {isGameOver ? (
                <div className="text-center p-6 bg-cyber-gray/90 border border-neon-pink/30 rounded-xl shadow-[0_0_30px_rgba(255,0,255,0.2)]">
                  <h2 className="text-4xl font-display font-bold neon-text-pink mb-2">GAME OVER</h2>
                  <p className="text-white/70 mb-6 font-mono">Your system crashed at {score} points.</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-pink text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-transform"
                  >
                    <RefreshCw className="w-5 h-5" /> REBOOT SYSTEM
                  </button>
                </div>
              ) : (
                <div className="text-center p-6">
                  <h2 className="text-4xl font-display font-bold text-white mb-6">PAUSED</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-8 py-4 bg-neon-blue text-cyber-black font-bold rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                  >
                    <Play className="w-6 h-6 fill-current" /> RESUME GAME
                  </button>
                  <p className="mt-6 text-white/50 text-xs font-mono uppercase tracking-[0.2em]">Press SPACE to Toggle</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-8 text-white/30 text-[10px] font-mono tracking-[0.3em] uppercase">
        <span>[WASD] MOVE</span>
        <span>[SPACE] PAUSE</span>
      </div>
    </div>
  );
}
