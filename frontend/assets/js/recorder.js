import { downloadBlob } from './utils.js';

export class AirTapRecorder {
  constructor({ video, trackingCanvas, effectCanvas, stage, getSettings }) {
    this.video = video;
    this.trackingCanvas = trackingCanvas;
    this.effectCanvas = effectCanvas;
    this.stage = stage;
    this.getSettings = getSettings;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.recording = false;
    this.recorder = null;
    this.chunks = [];
    this.animationFrame = 0;
    this.startedAt = 0;
  }

  resize() {
    const width = this.video.videoWidth || 1280;
    const height = this.video.videoHeight || 720;
    const maxWidth = this.getSettings().cameraQuality === 'low' ? 640 : 1280;
    const ratio = Math.min(1, maxWidth / width);
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
  }

  drawComposite() {
    const { ctx, canvas, video } = this;
    const settings = this.getSettings();
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (settings.mirror) {
      ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.drawImage(this.effectCanvas, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.trackingCanvas, 0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = 'rgba(9,11,24,.58)'; ctx.beginPath(); ctx.roundRect(18, 18, 130, 42, 15); ctx.fill();
    ctx.font = '800 22px system-ui'; ctx.fillStyle = '#f8fafc'; ctx.fillText('AirTap', 34, 46);
    ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(126, 38, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  async capturePhoto() {
    this.resize();
    this.drawComposite();
    const blob = await new Promise((resolve) => this.canvas.toBlob(resolve, 'image/png', 0.95));
    downloadBlob(blob, `AirTap-${this.timestamp()}.png`);
    return blob;
  }

  async start(microphoneStream = null) {
    if (this.recording) return;
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) throw new Error('Kayıt bu tarayıcıda desteklenmiyor.');
    this.resize();
    const stream = this.canvas.captureStream(30);
    microphoneStream?.getAudioTracks().forEach((track) => stream.addTrack(track));
    const mimeCandidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    const mimeType = mimeCandidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
    this.chunks = [];
    this.recorder = new MediaRecorder(stream, mimeType ? { mimeType, videoBitsPerSecond: 4_500_000 } : undefined);
    this.recorder.ondataavailable = (event) => { if (event.data.size) this.chunks.push(event.data); };
    this.recording = true;
    this.startedAt = performance.now();
    const render = () => {
      if (!this.recording) return;
      this.drawComposite();
      this.animationFrame = requestAnimationFrame(render);
    };
    render();
    this.recorder.start(250);
  }

  stop() {
    if (!this.recording || !this.recorder) return Promise.resolve(null);
    this.recording = false;
    cancelAnimationFrame(this.animationFrame);
    return new Promise((resolve) => {
      this.recorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.recorder.mimeType || 'video/webm' });
        this.recorder.stream.getTracks().forEach((track) => track.stop());
        resolve(blob);
      };
      this.recorder.stop();
    });
  }

  download(blob) {
    downloadBlob(blob, `AirTap-${this.timestamp()}.webm`);
  }

  timestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }
}
