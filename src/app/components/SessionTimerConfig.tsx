import { Clock } from 'lucide-react';
import { Slider } from './ui/slider';

interface SessionTimerConfigProps {
  seconds: number;
  onSecondsChange: (seconds: number) => void;
}

export function SessionTimerConfig({
  seconds,
  onSecondsChange,
}: SessionTimerConfigProps) {
  const minutes = Math.floor(seconds / 60);
  const presets = [5, 15, 25, 45, 60];

  const handleMinutesChange = (mins: number) => {
    onSecondsChange(mins * 60);
  };

  return (
    <div className="w-full px-4 py-3 lg:py-2 lg:pb-4">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-4 lg:p-5 ring-1 ring-purple-500/30 shadow-2xl shadow-purple-500/20">
        <div className="flex items-center gap-2 mb-3 lg:mb-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl lg:text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Session Timer Configuration
          </h2>
        </div>

        <div className="space-y-4 lg:space-y-3">
          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-purple-200 text-sm">Session Duration</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(120, Number(e.target.value)));
                    handleMinutesChange(value);
                  }}
                  className="w-16 px-3 py-1 bg-purple-950/50 text-purple-100 rounded-lg text-right ring-1 ring-purple-500/30 focus:ring-purple-500 focus:outline-none text-sm"
                  min={1}
                  max={120}
                />
                <span className="text-purple-300 text-sm">minutes</span>
              </div>
            </div>
            <Slider
              value={[minutes]}
              onValueChange={(values) => handleMinutesChange(values[0])}
              min={1}
              max={120}
              step={1}
              className="w-full"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleMinutesChange(preset)}
                  className={`
                    px-3 py-2 rounded-xl transition-all ring-1
                    ${
                      minutes === preset
                        ? 'bg-gradient-to-br from-purple-500/30 to-cyan-500/30 ring-purple-400 text-purple-100 shadow-lg shadow-purple-500/30'
                        : 'bg-purple-500/10 ring-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:ring-purple-400'
                    }
                  `}
                >
                  <div className="text-base font-mono">{preset}</div>
                  <div className="text-xs opacity-75">min</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}