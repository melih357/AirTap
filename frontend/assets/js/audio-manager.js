export class AudioManager {
  constructor(settings) {
    this.settings = settings;
    this.context = null;
    this.noiseBuffer = null;
  }

  setSettings(settings) {
    this.settings = settings;
  }

  async unlock() {
    if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') await this.context.resume();
  }

  outputLevel(volume) {
    return volume * (this.settings.masterVolume / 100) * (this.settings.effectVolume / 100);
  }

  tone(frequency, duration = 0.12, type = 'sine', volume = 0.25, slideTo = null, delay = 0) {
    if (this.settings.muted || this.settings.masterVolume <= 0) return;
    this.unlock().then(() => {
      const now = this.context.currentTime + delay;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const level = this.outputLevel(volume);
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(Math.max(20, frequency), now);
      if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, level), now + Math.min(0.018, duration * 0.2));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    }).catch(() => {});
  }

  noise(duration = 0.2, volume = 0.12, filterFrequency = 900, filterType = 'lowpass', delay = 0) {
    if (this.settings.muted || this.settings.masterVolume <= 0) return;
    this.unlock().then(() => {
      if (!this.noiseBuffer) {
        const length = Math.round(this.context.sampleRate * 1.2);
        this.noiseBuffer = this.context.createBuffer(1, length, this.context.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1;
      }
      const now = this.context.currentTime + delay;
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      source.buffer = this.noiseBuffer;
      filter.type = filterType;
      filter.frequency.setValueAtTime(filterFrequency, now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(80, filterFrequency * 0.38), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.outputLevel(volume)), now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.connect(filter).connect(gain).connect(this.context.destination);
      source.start(now);
      source.stop(now + duration + 0.03);
    }).catch(() => {});
  }

  select(effectId) {
    const notes = { web: 520, fire: 238, ice: 790, electric: 365, laser: 710, energy: 430 };
    const note = notes[effectId] || 440;
    this.tone(note, 0.13, effectId === 'electric' ? 'square' : 'sine', 0.11, note * 1.32);
    this.tone(note * 2, 0.07, 'sine', 0.045, note * 2.35, 0.055);
  }

  fire(effectId) {
    const sounds = {
      web: [880, 230, 'triangle', 1450],
      fire: [190, 54, 'sawtooth', 520],
      ice: [1180, 390, 'sine', 2350],
      electric: [245, 910, 'square', 1750],
      laser: [1320, 180, 'sawtooth', 2900],
      energy: [175, 680, 'triangle', 980]
    };
    const [from, to, type, noiseFrequency] = sounds[effectId] || sounds.energy;
    this.tone(from, 0.32, type, 0.16, to);
    this.tone(from * 0.5, 0.4, 'sine', 0.11, Math.max(32, to * 0.45));
    this.noise(effectId === 'fire' ? 0.38 : 0.22, effectId === 'fire' ? 0.14 : 0.075, noiseFrequency, effectId === 'ice' || effectId === 'laser' ? 'highpass' : 'lowpass');
    this.tone(to * 1.25, 0.14, 'sine', 0.065, Math.max(40, to * 0.54), 0.23);
    if (effectId === 'electric') {
      this.noise(0.3, 0.07, 2800, 'bandpass', 0.08);
      this.tone(1480, 0.075, 'square', 0.05, 420, 0.12);
    }
  }

  success() {
    this.tone(523, 0.1, 'sine', 0.11, 659);
    this.tone(784, 0.14, 'sine', 0.1, null, 0.09);
  }
}
