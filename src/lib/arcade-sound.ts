import type { WorldId } from "./game-rules";

// Continuous textures come from a short, seamless noise buffer. Everything is local
// and only allocated after the player explicitly switches on sound.
export function createArcadeSound(world: WorldId) {
  const audio = new AudioContext();
  const volume = audio.createGain();
  volume.gain.value = 0.22;
  volume.connect(audio.destination);
  const noise = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  const bed = audio.createBufferSource(),
    filter = audio.createBiquadFilter(),
    bedGain = audio.createGain();
  bed.buffer = noise;
  bed.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = world === "koi" ? 2200 : world === "boat" ? 680 : 210;
  bedGain.gain.value = 0.1;
  bed.connect(filter).connect(bedGain).connect(volume);
  bed.start();
  const hum = audio.createOscillator(),
    humGain = audio.createGain();
  const motor = world === "drone" || world === "ship";
  hum.type = world === "drone" ? "triangle" : "sine";
  hum.frequency.value = world === "drone" ? 84 : 46;
  humGain.gain.value = 0;
  hum.connect(humGain).connect(volume);
  hum.start();
  return {
    move(speed: number) {
      if (audio.state !== "running") return;
      const now = audio.currentTime;
      bedGain.gain.setTargetAtTime(0.1 + speed * 0.1, now, 0.15);
      if (motor) {
        hum.frequency.setTargetAtTime((world === "drone" ? 84 : 46) + speed * 43, now, 0.1);
        humGain.gain.setTargetAtTime(0.065 + speed * 0.075, now, 0.1);
      }
    },
    cue(success: boolean) {
      if (audio.state !== "running") return;
      const now = audio.currentTime,
        envelope = audio.createGain();
      envelope.connect(volume);
      envelope.gain.setValueAtTime(0.001, now);
      envelope.gain.exponentialRampToValueAtTime(success ? 0.26 : 0.44, now + 0.016);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
      let source: AudioScheduledSourceNode;
      if (!success && (world === "koi" || world === "boat")) {
        const splash = audio.createBufferSource(),
          band = audio.createBiquadFilter();
        splash.buffer = noise;
        band.type = "bandpass";
        band.frequency.setValueAtTime(1800, now);
        band.frequency.exponentialRampToValueAtTime(460, now + 0.33);
        splash.connect(band).connect(envelope);
        source = splash;
      } else {
        const tone = audio.createOscillator();
        tone.type = "sine";
        tone.frequency.setValueAtTime(success ? 494 : world === "ship" ? 175 : 380, now);
        tone.frequency.exponentialRampToValueAtTime(success ? 740 : 95, now + 0.33);
        tone.connect(envelope);
        source = tone;
      }
      source.onended = () => {
        source.disconnect();
        envelope.disconnect();
      };
      source.start(now);
      source.stop(now + 0.45);
    },
    resume: () => audio.resume(),
    pause: () => {
      if (audio.state === "running") void audio.suspend().catch(() => {});
    },
    dispose: () => {
      bed.stop();
      hum.stop();
      void audio.close().catch(() => {});
    },
  };
}
