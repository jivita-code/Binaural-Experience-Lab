import { useState, useEffect, useRef } from "react";
import { NowPlayingCard } from "./components/NowPlayingCard";
import { BinauralControlPanel } from "./components/BinauralControlPanel";
import { AmbientSoundController } from "./components/AmbientSoundController";
import { SessionTimerConfig } from "./components/SessionTimerConfig";

export default function App() {
  // Binaural settings
  const [baseFreq, setBaseFreq] = useState(200);
  const [beatFreq, setBeatFreq] = useState(40);
  const [binauralVolume, setBinauralVolume] = useState(10);
  const [binauralEnabled, setBinauralEnabled] = useState(true);

  // Ambient settings
  const [ambientType, setAmbientType] = useState("rain");
  const [ambientVolume, setAmbientVolume] = useState(30);
  const [ambientEnabled, setAmbientEnabled] = useState(true);

  // Master volume
  const [masterVolume, setMasterVolume] = useState(70);

  // Session timer and playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(1500); // 25:00 default
  const [configuredDuration, setConfiguredDuration] =
    useState(1500); // Store the configured duration
  const timerIntervalRef = useRef<number | null>(null);

  // Headphone notice visibility
  const [showHeadphoneNotice, setShowHeadphoneNotice] = useState(true);

  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const leftOscillatorRef = useRef<OscillatorNode | null>(null);
  const rightOscillatorRef = useRef<OscillatorNode | null>(
    null,
  );
  const leftGainRef = useRef<GainNode | null>(null);
  const rightGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const pannerLeftRef = useRef<StereoPannerNode | null>(null);
  const pannerRightRef = useRef<StereoPannerNode | null>(null);

  // Ambient audio refs
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientSourceRef =
    useRef<MediaElementAudioSourceNode | null>(null);

  // Initialize Web Audio Context
  useEffect(() => {
    audioContextRef.current = new AudioContext();
    masterGainRef.current =
      audioContextRef.current.createGain();
    masterGainRef.current.connect(
      audioContextRef.current.destination,
    );

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update master volume
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = masterVolume / 100;
    }
  }, [masterVolume]);

  // Binaural beat generation
  useEffect(() => {
    if (!audioContextRef.current || !masterGainRef.current)
      return;

    // Clean up existing oscillators
    if (leftOscillatorRef.current) {
      leftOscillatorRef.current.stop();
      leftOscillatorRef.current.disconnect();
    }
    if (rightOscillatorRef.current) {
      rightOscillatorRef.current.stop();
      rightOscillatorRef.current.disconnect();
    }
    if (leftGainRef.current) {
      leftGainRef.current.disconnect();
    }
    if (rightGainRef.current) {
      rightGainRef.current.disconnect();
    }
    if (pannerLeftRef.current) {
      pannerLeftRef.current.disconnect();
    }
    if (pannerRightRef.current) {
      pannerRightRef.current.disconnect();
    }

    if (binauralEnabled && isPlaying) {
      const ctx = audioContextRef.current;

      // Create oscillators
      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();

      // Create gain nodes
      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();

      // Create stereo panners
      const pannerLeft = ctx.createStereoPanner();
      const pannerRight = ctx.createStereoPanner();

      // Set frequencies
      leftOsc.frequency.value = baseFreq;
      rightOsc.frequency.value = baseFreq + beatFreq;

      // Set volumes
      const volume = binauralVolume / 100;
      leftGain.gain.value = volume;
      rightGain.gain.value = volume;

      // Pan left and right
      pannerLeft.pan.value = -1; // Full left
      pannerRight.pan.value = 1; // Full right

      // Connect nodes
      leftOsc.connect(leftGain);
      leftGain.connect(pannerLeft);
      pannerLeft.connect(masterGainRef.current);

      rightOsc.connect(rightGain);
      rightGain.connect(pannerRight);
      pannerRight.connect(masterGainRef.current);

      // Start oscillators
      leftOsc.start();
      rightOsc.start();

      // Store refs
      leftOscillatorRef.current = leftOsc;
      rightOscillatorRef.current = rightOsc;
      leftGainRef.current = leftGain;
      rightGainRef.current = rightGain;
      pannerLeftRef.current = pannerLeft;
      pannerRightRef.current = pannerRight;
    }

    return () => {
      if (leftOscillatorRef.current) {
        leftOscillatorRef.current.stop();
        leftOscillatorRef.current.disconnect();
      }
      if (rightOscillatorRef.current) {
        rightOscillatorRef.current.stop();
        rightOscillatorRef.current.disconnect();
      }
    };
  }, [binauralEnabled, baseFreq, beatFreq, binauralVolume, isPlaying]);

  // Ambient sound handling
  useEffect(() => {
    if (!audioContextRef.current || !masterGainRef.current)
      return;

    // Clean up existing ambient
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current = null;
    }
    if (ambientSourceRef.current) {
      ambientSourceRef.current.disconnect();
    }
    if (ambientGainRef.current) {
      ambientGainRef.current.disconnect();
    }

    if (ambientEnabled && isPlaying && ambientType !== "none") {
      // Create audio element for ambient sound
      // Note: Using data URLs for demo purposes - in production, use actual audio files
      const audio = new Audio();

      // Mock ambient sounds - in production, replace with actual audio files
      // For now, we'll create a simple noise generator using Web Audio API
      const ctx = audioContextRef.current;

      if (ambientType === "white" || ambientType === "brown") {
        // Create noise using buffer
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(
          1,
          bufferSize,
          ctx.sampleRate,
        );
        const output = noiseBuffer.getChannelData(0);

        if (ambientType === "white") {
          // White noise
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
        } else {
          // Brown noise (simplified)
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          }
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const ambientGain = ctx.createGain();
        ambientGain.gain.value = ambientVolume / 100;

        noiseSource.connect(ambientGain);
        ambientGain.connect(masterGainRef.current);

        noiseSource.start();

        // Store refs
        ambientSourceRef.current = noiseSource as any;
        ambientGainRef.current = ambientGain;
      } else {
        // For other sounds (rain, ocean, forest, wind), we would load actual audio files
        // For demo purposes, we'll show placeholders
        console.log(
          `Ambient sound "${ambientType}" would play here with actual audio files`,
        );
      }
    }

    return () => {
      if (ambientSourceRef.current) {
        try {
          (ambientSourceRef.current as any).stop?.();
        } catch (e) {
          // Ignore if already stopped
        }
      }
    };
  }, [ambientEnabled, ambientType, isPlaying]);

  // Update ambient volume
  useEffect(() => {
    if (ambientGainRef.current) {
      ambientGainRef.current.gain.value = ambientVolume / 100;
    }
  }, [ambientVolume]);

  // Timer logic
  useEffect(() => {
    if (isPlaying) {
      timerIntervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 0) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isPlaying]);

  // Format time helper
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Reset timer
  const resetTimer = () => {
    setSeconds(configuredDuration); // Reset to configured duration
    setIsPlaying(false);
  };

  // Handle timer duration change from config panel
  const handleTimerDurationChange = (newSeconds: number) => {
    setConfiguredDuration(newSeconds); // Update configured duration
    setSeconds(newSeconds);
    setIsPlaying(false); // Stop playback when changing duration
  };

  // Hide headphone notice after 10 seconds
  useEffect(() => {
    const noticeTimer = setTimeout(() => {
      setShowHeadphoneNotice(false);
    }, 60000); // 60 seconds

    return () => clearTimeout(noticeTimer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-blue-950 to-black overflow-x-hidden">
      {/* Headphone Notice */}
      {showHeadphoneNotice && (
        <div className="w-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm py-2 px-4 text-center border-b border-yellow-400/40">
          <p className="text-yellow-200 text-sm flex items-center justify-center gap-2">
            <span className="inline-block">🎧</span>
            <span>
              For best results, use headphones for binaural beats
            </span>
          </p>
        </div>
      )}

      {/* Main Content - Mobile: Vertical Stack, Desktop: Split Layout */}
      <div
        className={`w-full lg:flex lg:overflow-hidden ${
          showHeadphoneNotice ? "lg:h-[calc(100vh-52px)]" : "lg:h-screen"
        }`}
      >
        {/* Left Column - Now Playing (Desktop only visible on left) */}
        <section className="w-full lg:w-1/2 lg:flex lg:items-center lg:justify-center lg:p-8 relative">
          <div className="w-full flex flex-col items-center">
            {/* Logo and Slogan */}
            <div className="text-center mb-6 lg:mb-8">
              <h1 className="mt-8 lg:mt-0 text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 mb-2 tracking-wider">
                SPANDA
              </h1>
              <p className="text-purple-300/80 text-sm lg:text-base tracking-wide">
                Binaural Experience Lab
              </p>
            </div>

            <NowPlayingCard
              baseFreq={baseFreq}
              beatFreq={beatFreq}
              masterVolume={masterVolume}
              ambientType={ambientType}
              isPlaying={isPlaying}
              seconds={seconds}
              onMasterVolumeChange={setMasterVolume}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onReset={resetTimer}
            />
          </div>

          {/* Watermark */}
          <div className="hidden lg:block absolute bottom-4 left-8">
            <p className="text-purple-300/40 text-xs tracking-wide">
              Powered by{" "}
              <span className="font-semibold text-purple-300/60">
                JIVITA
              </span>
            </p>
          </div>
        </section>

        {/* Right Column - Control Panels (stacked vertically) */}
        <section className="w-full lg:w-1/2 lg:h-full lg:flex lg:flex-col lg:justify-center">
          {/* Binaural Control Panel */}
          <div className="w-full">
            <BinauralControlPanel
              baseFreq={baseFreq}
              beatFreq={beatFreq}
              binauralVolume={binauralVolume}
              binauralEnabled={binauralEnabled}
              onBaseFreqChange={setBaseFreq}
              onBeatFreqChange={setBeatFreq}
              onBinauralVolumeChange={setBinauralVolume}
              onBinauralEnabledChange={setBinauralEnabled}
            />
          </div>

          {/* Ambient Sound Controller */}
          <div className="w-full">
            <AmbientSoundController
              ambientType={ambientType}
              ambientVolume={ambientVolume}
              ambientEnabled={ambientEnabled}
              onAmbientTypeChange={setAmbientType}
              onAmbientVolumeChange={setAmbientVolume}
              onAmbientEnabledChange={setAmbientEnabled}
            />
          </div>

          {/* Session Timer Config */}
          <div className="w-full">
            <SessionTimerConfig
              seconds={seconds}
              onSecondsChange={handleTimerDurationChange}
            />
          </div>

          {/* Watermark - Mobile only */}
          <div className="lg:hidden w-full px-4 py-6">
            <p className="text-purple-300/40 text-xs tracking-wide text-center">
              Powered by{" "}
              <span className="font-semibold text-purple-300/60">
                JIVITA
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}