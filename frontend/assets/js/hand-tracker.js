export class HandTracker {
  constructor({ onResults, onError, quality = 'high', sensitivity = 62, selfieMode = true }) {
    this.onResults = onResults;
    this.onError = onError;
    this.quality = quality;
    this.sensitivity = sensitivity;
    this.selfieMode = selfieMode;
    this.hands = null;
    this.video = null;
    this.running = false;
    this.busy = false;
    this.animationFrame = 0;
    this.lastAnalysis = 0;
    this.fpsSamples = [];
  }

  initialize() {
    if (!window.Hands) throw new Error('MediaPipe Hands dosyaları yüklenemedi.');
    const vendorPath = new URL('../vendor/mediapipe/', import.meta.url).href;
    this.hands = new window.Hands({ locateFile: (file) => `${vendorPath}${file}` });
    this.applyOptions();
    this.hands.onResults((results) => {
      const now = performance.now();
      this.fpsSamples.push(now);
      while (this.fpsSamples[0] < now - 1000) this.fpsSamples.shift();
      this.onResults?.(results, this.fpsSamples.length, now);
    });
  }

  applyOptions() {
    if (!this.hands) return;
    const confidence = 0.72 - (this.sensitivity / 100) * 0.25;
    this.hands.setOptions({
      selfieMode: this.selfieMode,
      maxNumHands: 1,
      modelComplexity: this.quality === 'low' ? 0 : 1,
      minDetectionConfidence: Math.max(0.42, confidence),
      minTrackingConfidence: Math.max(0.42, confidence - 0.04)
    });
  }

  updateSettings({ quality, sensitivity, selfieMode = this.selfieMode }) {
    this.quality = quality;
    this.sensitivity = sensitivity;
    this.selfieMode = selfieMode;
    this.applyOptions();
  }

  async start(video) {
    if (!this.hands) this.initialize();
    this.video = video;
    this.running = true;
    this.lastAnalysis = 0;
    const tick = async (time) => {
      if (!this.running) return;
      const interval = this.quality === 'low' ? 55 : 32;
      if (!this.busy && video.readyState >= 2 && time - this.lastAnalysis >= interval) {
        this.busy = true;
        this.lastAnalysis = time;
        try {
          await this.hands.send({ image: video });
        } catch (error) {
          this.onError?.(error);
        } finally {
          this.busy = false;
        }
      }
      this.animationFrame = requestAnimationFrame(tick);
    };
    this.animationFrame = requestAnimationFrame(tick);
  }

  async stop() {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
    this.busy = false;
    if (this.hands?.close) {
      try { await this.hands.close(); } catch { /* Model may already be closed. */ }
    }
    this.hands = null;
  }
}
