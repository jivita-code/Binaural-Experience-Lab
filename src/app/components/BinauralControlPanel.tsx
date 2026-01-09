import { Slider } from './ui/slider';
import { Switch } from './ui/switch';

interface BinauralControlPanelProps {
  baseFreq: number;
  beatFreq: number;
  binauralVolume: number;
  binauralEnabled: boolean;
  onBaseFreqChange: (value: number) => void;
  onBeatFreqChange: (value: number) => void;
  onBinauralVolumeChange: (value: number) => void;
  onBinauralEnabledChange: (enabled: boolean) => void;
}

export function BinauralControlPanel({
  baseFreq,
  beatFreq,
  binauralVolume,
  binauralEnabled,
  onBaseFreqChange,
  onBeatFreqChange,
  onBinauralVolumeChange,
  onBinauralEnabledChange,
}: BinauralControlPanelProps) {
  const leftEar = baseFreq;
  const rightEar = baseFreq + beatFreq;

  return (
    <div className="w-full px-4 py-3 lg:py-2">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-4 lg:p-5 ring-1 ring-purple-500/30 shadow-2xl shadow-purple-500/20">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left side - Controls */}
          <div className="flex-1 space-y-4 lg:space-y-3">
            {/* Title and Toggle */}
            <div className="flex items-center justify-between mb-3 lg:mb-2">
              <h2 className="text-xl lg:text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Binaural Beat Generator
              </h2>
              <div className="flex items-center gap-3">
                <span className={binauralEnabled ? 'text-cyan-400 text-sm' : 'text-gray-500 text-sm'}>
                  {binauralEnabled ? 'ON' : 'OFF'}
                </span>
                <Switch
                  checked={binauralEnabled}
                  onCheckedChange={onBinauralEnabledChange}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-cyan-500"
                />
              </div>
            </div>

            {/* Base Frequency */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-purple-200 text-sm">Base Frequency (Hz)</label>
                <input
                  type="number"
                  value={baseFreq}
                  onChange={(e) => onBaseFreqChange(Number(e.target.value))}
                  disabled={!binauralEnabled}
                  className="w-20 px-3 py-1 bg-purple-950/50 text-purple-100 rounded-lg text-right ring-1 ring-purple-500/30 focus:ring-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  min={20}
                  max={1000}
                />
              </div>
              <Slider
                value={[baseFreq]}
                onValueChange={(values) => onBaseFreqChange(values[0])}
                min={20}
                max={1000}
                step={1}
                disabled={!binauralEnabled}
                className="w-full"
              />
            </div>

            {/* Beat Frequency */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-purple-200 text-sm">Beat Frequency (Hz)</label>
                <input
                  type="number"
                  value={beatFreq}
                  onChange={(e) => onBeatFreqChange(Number(e.target.value))}
                  disabled={!binauralEnabled}
                  className="w-20 px-3 py-1 bg-purple-950/50 text-purple-100 rounded-lg text-right ring-1 ring-purple-500/30 focus:ring-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  min={1}
                  max={100}
                />
              </div>
              <Slider
                value={[beatFreq]}
                onValueChange={(values) => onBeatFreqChange(values[0])}
                min={1}
                max={100}
                step={1}
                disabled={!binauralEnabled}
                className="w-full"
              />
            </div>

            {/* Computed Frequencies */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-3 ring-1 ring-purple-500/30">
                <p className="text-purple-300 text-xs mb-1">Left Ear</p>
                <p className="text-xl text-purple-100 font-mono">{leftEar} Hz</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-xl p-3 ring-1 ring-cyan-500/30">
                <p className="text-cyan-300 text-xs mb-1">Right Ear</p>
                <p className="text-xl text-cyan-100 font-mono">{rightEar} Hz</p>
              </div>
            </div>

            {/* Binaural Volume */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-purple-200 text-sm">Binaural Beat Volume</label>
                <span className="text-purple-300 text-sm">{binauralVolume}%</span>
              </div>
              <Slider
                value={[binauralVolume]}
                onValueChange={(values) => onBinauralVolumeChange(values[0])}
                max={100}
                step={1}
                disabled={!binauralEnabled}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}