import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2; // Milliseconds to decrease from interval per food
const MIN_SPEED = 50;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

function getRandomFoodPosition(snake: Point[]): Point {
  let newFood: Point;
  let isOccupied: boolean;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  } while (isOccupied);
  return newFood;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 }); // Initial mock food, replaced on start
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  // Use refs to avoid dependence on state arrays in event listeners/intervals
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction); // For preventing rapid multi-press suicides
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(true);
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
  };

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
    setIsGameStarted(false);
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };
      const currentDir = nextDirectionRef.current;
      
      setDirection(currentDir); // Sync actual direction with processed intent

      switch (currentDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check walls mapping
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      // Check self-collision
      // Allow snake to move into its own tail if it's leaving that spot this turn
      const isSelfCollision = prevSnake.some((segment, index) => {
        if (index === prevSnake.length - 1) return false;
        return segment.x === newHead.x && segment.y === newHead.y;
      });

      if (isSelfCollision) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(getRandomFoodPosition(newSnake));
        // Don't pop(), let it grow
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [food, handleGameOver]);

  // Game Loop
  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    // Calculate speed based on score (gets faster, up to min limit)
    const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
    
    const intervalId = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(intervalId);
  }, [isGameStarted, isGameOver, moveSnake, score]);

  // Keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameStarted || isGameOver) return;
      
      // Prevent standard scrolling behavior for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') nextDirectionRef.current = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') nextDirectionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameStarted, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-full">
      <div className="relative p-1 bg-[#00FF00]/20 border border-[#00FF00]/40 shadow-[0_0_50px_rgba(0,255,0,0.1)]">
        
        {/* Game Score Overlay */}
        <div className="absolute -top-8 left-0 right-0 flex justify-between px-2 font-mono">
          <span className="text-sm italic opacity-80">SCORE: <span className="text-[#FF00FF]">{score.toString().padStart(5, '0')}</span><span className="hidden sm:inline"> | HI: {highScore.toString().padStart(5, '0')}</span></span>
          <span className="text-sm italic text-white hidden sm:block">FPS: 60.2</span>
        </div>
        
        {/* Play Area */}
        <div 
          className="bg-black relative overflow-hidden w-[320px] h-[320px] sm:w-[480px] sm:h-[480px]"
        >
          {/* CRT Scanlines Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,0,0.06))] z-30" style={{ backgroundSize: '100% 4px, 3px 100%' }}></div>
          
          <div 
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBodyIndex = snake.findIndex((seg) => seg.x === x && seg.y === y);
              const isBody = isBodyIndex > 0;
              const isFood = food.x === x && food.y === y;

              let content = null;
              
              if (isHead) {
                content = <div className="w-full h-full bg-[#00FF00] shadow-[0_0_15px_#00FF00] z-20" />;
              } else if (isBody) {
                const opacity = Math.max(0.2, 0.8 - (isBodyIndex * 0.05));
                content = <div className="w-full h-full bg-[#00FF00] z-20" style={{ opacity }} />;
              } else if (isFood) {
                content = <div className="w-full h-full bg-[#FF00FF] shadow-[0_0_20px_#FF00FF] rounded-full z-20 scale-[0.8]" />;
              }

              return (
                <div key={index} className="border border-[#00FF00]/5 w-full h-full relative">
                  {content}
                </div>
              );
            })}
          </div>

          {/* Overlays */}
          {(!isGameStarted || isGameOver) && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded z-40">
              <div className="text-center flex flex-col items-center gap-6 p-8 bg-[#050505]/90 border border-[#00FF00]/40 rounded-sm shadow-[0_0_40px_rgba(0,255,0,0.2)]">
                {isGameOver ? (
                  <>
                    <h2 className="text-3xl font-black text-[#FF00FF] font-mono tracking-tighter italic">GAME_OVER</h2>
                    <p className="text-white text-[10px] uppercase opacity-70 font-mono">FINAL_SCORE_00{score}</p>
                    <button 
                      onClick={startGame}
                      className="group flex items-center gap-2 mt-2 px-6 py-2 border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/20 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                    >
                      <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                      REBOOT_SYS
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white drop-shadow-[0_0_10px_#00FF00]">SYNTH-SNAKE</h2>
                    <button 
                      onClick={startGame}
                      className="group flex items-center gap-2 mt-4 px-8 py-3 bg-[#00FF00]/20 hover:bg-[#00FF00]/40 text-[#00FF00] border border-[#00FF00] text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,255,0,0.6)]"
                    >
                      <Play size={16} className="fill-current" />
                      INITIALIZE_01
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Keyboard Hint */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-8 text-[10px] uppercase tracking-widest font-bold">
        <div className="flex items-center gap-2"><span className="px-2 py-1 border border-[#00FF00]">W A S D</span> MOVE</div>
        <div className="flex items-center gap-2 text-[#00FFFF] border-[#00FFFF] hidden sm:flex"><span className="px-2 py-1 border border-[#00FFFF]">ARROWS</span> MOVE</div>
        <div className="flex items-center gap-2"><span className="px-2 py-1 border border-[#00FF00]">SPACE</span> PAUSE/START</div>
      </div>
    </div>
  );
}
