import { Headphones, Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import { Slider } from './ui/slider';

interface NowPlayingCardProps {
  baseFreq: number;
  beatFreq: number;
  masterVolume: number;
  ambientType: string;
  isPlaying: boolean;
  seconds: number;
  onMasterVolumeChange: (value: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
}

export function NowPlayingCard({ 
  baseFreq, 
  beatFreq, 
  masterVolume, 
  ambientType, 
  isPlaying,
  seconds,
  onMasterVolumeChange,
  onPlayPause,
  onReset
}: NowPlayingCardProps) {
  // Convert ambient type to display name
  const getTrackName = () => {
    const ambientNames: Record<string, string> = {
      rain: 'Rain',
      ocean: 'Ocean Waves',
      forest: 'Forest',
      wind: 'Wind',
      white: 'White Noise',
      brown: 'Brown Noise',
      none: 'Theta Focus'
    };
    
    const ambientName = ambientNames[ambientType] || 'Theta Focus';
    return `${ambientName}`;
  };

  // Format time
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-8 md:py-12">
      {/* Album Art Card */}
      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden mb-6">
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-purple-500/20 backdrop-blur-xl" />

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 blur-2xl" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center md:p-8 p-[24px] m-[20px] m-[0px]">
          {/* Abstract frequency visualization */}
          <div className="w-full h-24 md:h-32 mb-6 flex items-end justify-center gap-0.5 md:gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-purple-400 to-cyan-400 rounded-full opacity-60 animate-pulse"
                style={{
                  height: `${Math.sin(i * 0.5) * 50 + 50}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>

          {/* Track info */}
          <div className="text-center">
            <h2 className="text-white text-xl md:text-2xl mb-2">
              {getTrackName()}
            </h2>
            <p className="text-purple-300 text-sm md:text-base">
              Base: {baseFreq}Hz • Beat: {beatFreq}Hz
            </p>
          </div>
        </div>

        {/* Border glow */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-purple-500/50" />
      </div>

      {/* Top bar controls */}
      <div className="w-full max-w-sm flex items-center gap-4 bg-white/5 backdrop-blur-lg rounded-2xl p-4 ring-1 ring-white/10">
        {/* Play/Pause button */}
        <button
          onClick={onPlayPause}
          className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 transition-all ring-1 ring-purple-500/50 hover:ring-purple-400 flex-shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        {/* Reset button */}
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all ring-1 ring-cyan-500/50 hover:ring-cyan-400 flex-shrink-0"
          aria-label="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        {/* Timer display */}
        <div className="text-purple-300 text-sm font-mono tabular-nums flex-shrink-0">
          {formatTime(seconds)}
        </div>
        
        {/* Volume icons and slider */}
        <Volume2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
        <div className="flex-1 min-w-[100px]">
          <Slider
            value={[masterVolume]}
            onValueChange={(values) => onMasterVolumeChange(values[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        {/* <span className="text-purple-300 text-sm w-12 text-left">
          {masterVolume}%
        </span> */}
      </div>
    </div>
  );
}