import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AmbientSoundControllerProps {
  ambientType: string;
  ambientVolume: number;
  ambientEnabled: boolean;
  tracks: string[];
  onAmbientTypeChange: (type: string) => void;
  onAmbientVolumeChange: (value: number) => void;
  onAmbientEnabledChange: (enabled: boolean) => void;
}

export function AmbientSoundController({
  ambientType,
  ambientVolume,
  ambientEnabled,
  tracks,
  onAmbientTypeChange,
  onAmbientVolumeChange,
  onAmbientEnabledChange,
}: AmbientSoundControllerProps) {
  const hasTracks = tracks.length > 0;

  return (
    <div className="w-full px-4 py-3 lg:py-2">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-4 lg:p-5 ring-1 ring-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        {/* Title and Toggle */}
        <div className="flex items-center justify-between mb-3 lg:mb-2">
          <h2 className="text-xl lg:text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Ambient Sound Layer
          </h2>
          <div className="flex items-center gap-3">
            <span className={ambientEnabled ? 'text-cyan-400 text-sm' : 'text-gray-500 text-sm'}>
              {ambientEnabled ? 'ON' : 'OFF'}
            </span>
            <Switch
              checked={ambientEnabled}
              onCheckedChange={onAmbientEnabledChange}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-purple-500"
            />
          </div>
        </div>

        <div className="space-y-4 lg:space-y-3">
          {/* Sound Selector */}
          <div className="space-y-2">
            <label className="text-purple-200 text-sm">Choose Ambient Sound</label>
            <Select
              value={ambientType}
              onValueChange={onAmbientTypeChange}
              disabled={!ambientEnabled || !hasTracks}
            >
              <SelectTrigger className="w-full bg-purple-950/50 text-purple-100 ring-1 ring-cyan-500/30 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed border-cyan-500/30">
                <SelectValue placeholder="Select a sound" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/30 text-purple-100">
                {tracks.map((track) => (
                  <SelectItem
                    key={track}
                    value={track}
                    className="focus:bg-purple-900/50 focus:text-purple-100"
                  >
                    {track}
                  </SelectItem>
                ))}
                {!hasTracks && (
                  <SelectItem value="" disabled>
                    No tracks found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Ambient Volume */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-purple-200 text-sm">Ambient Volume</label>
              <span className="text-cyan-300 text-sm">{ambientVolume}%</span>
            </div>
            <Slider
              value={[ambientVolume]}
              onValueChange={(values) => onAmbientVolumeChange(values[0])}
              max={100}
              step={1}
              disabled={!ambientEnabled}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}