import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function SessionTimer() {
  const [seconds, setSeconds] = useState(1500); // 25:00 default
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (prev <= 0) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(1500);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-purple-950/40 to-cyan-950/40 rounded-2xl p-6 ring-1 ring-purple-500/30 w-full max-w-xs">
      <p className="text-purple-300 text-xs uppercase tracking-widest">Listening Session</p>
      
      {/* Timer display */}
      <div className="text-6xl md:text-7xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tabular-nums">
        {formatTime(seconds)}
      </div>
      
      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 transition-all ring-1 ring-purple-500/50 hover:ring-purple-400 hover:shadow-lg hover:shadow-purple-500/30"
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        
        <button
          onClick={handleReset}
          className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all ring-1 ring-cyan-500/50 hover:ring-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}