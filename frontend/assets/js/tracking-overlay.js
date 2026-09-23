import { clamp, mapPointToStage } from './utils.js';

const TAU = Math.PI * 2;
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]
];

export class TrackingOverlay {
  constructor(canvas, video, stage) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    this.video = video;
    this.stage = stage;
    this.pointerTrail = [];
    this.lastTapPulseAt = 0;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(stage);
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, this.stage.clientWidth);
    this.height = Math.max(1, this.stage.clientHeight);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw(snapshot, settings) {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);
    if (!snapshot.handPresent || !snapshot.landmarks) {
      this.pointerTrail = [];
      return;
    }
    const now = performance.now();
    const points = snapshot.landmarks.map((point) => mapPointToStage(point, this.video, this.stage));
    const palm = mapPointToStage(snapshot.palm, this.video, this.stage);
    const tip = points[8];
    const baseRadius = Math.max(24, snapshot.handScale * Math.min(this.width, this.height) * 0.24);

    this.drawHandMesh(points, snapshot, settings);
    if (snapshot.menuOpen) {
      this.updatePointerTrail(tip, now);
      this.drawPointerTrail(settings);
      this.drawFingerReticle(tip, snapshot, settings, now);
    } else {
      this.pointerTrail = [];
      if (snapshot.singleFinger) this.drawMenuHoldRing(tip, snapshot.menuProgress, settings);
    }
    this.drawPalmTarget(palm, baseRadius, snapshot, settings, now);
  }

  drawHandMesh(points, snapshot, settings) {
    const { ctx } = this;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = snapshot.menuOpen || snapshot.readyToFire ? 0.34 : 0.18;
    ctx.strokeStyle = snapshot.readyToFire ? '#62ffc3' : '#5eeaff';
    ctx.lineWidth = 1.25;
    ctx.shadowColor = snapshot.readyToFire ? '#34d399' : '#22d3ee';
    ctx.shadowBlur = settings.glow ? 9 : 0;
    HAND_CONNECTIONS.forEach(([from, to]) => {
      ctx.beginPath();
      ctx.moveTo(points[from].x, points[from].y);
      ctx.lineTo(points[to].x, points[to].y);
      ctx.stroke();
    });
    [0, 5, 9, 13, 17].forEach((index) => {
      ctx.fillStyle = snapshot.readyToFire ? '#89ffd1' : '#9bf2ff';
      ctx.beginPath();
      ctx.arc(points[index].x, points[index].y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  updatePointerTrail(tip, now) {
    const previous = this.pointerTrail.at(-1);
    if (!previous || Math.hypot(previous.x - tip.x, previous.y - tip.y) > 1.5 || now - previous.time > 45) {
      this.pointerTrail.push({ x: tip.x, y: tip.y, time: now });
    }
    this.pointerTrail = this.pointerTrail.filter((point) => now - point.time < 260).slice(-15);
  }

  drawPointerTrail(settings) {
    if (this.pointerTrail.length < 2) return;
    const { ctx } = this;
    const now = performance.now();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let index = 1; index < this.pointerTrail.length; index += 1) {
      const from = this.pointerTrail[index - 1];
      const to = this.pointerTrail[index];
      const alpha = clamp(1 - (now - to.time) / 260, 0, 1) * 0.48;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#72efff';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = settings.glow ? 12 : 0;
      ctx.lineWidth = 1 + alpha * 4;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawFingerReticle(tip, snapshot, settings, now) {
    const { ctx } = this;
    const strength = clamp(snapshot.tapStrength || 0, 0, 1);
    const compressedRadius = 22 - strength * 7;
    const active = snapshot.selectionReady && snapshot.hoveredIndex >= 0;
    ctx.save();
    ctx.translate(tip.x, tip.y);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = active ? '#ffffff' : '#76efff';
    ctx.fillStyle = active ? '#dffcff' : '#5eeaff';
    ctx.shadowColor = active ? '#22d3ee' : '#7c66ff';
    ctx.shadowBlur = settings.glow ? 22 : 0;
    ctx.globalAlpha = 0.94;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, compressedRadius, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = 0.42;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, compressedRadius + 7 + Math.sin(now * 0.012) * 2, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 3.2 + strength * 2.6, 0, TAU);
    ctx.fill();

    if (snapshot.tapCount > 0) {
      ctx.strokeStyle = '#6dffbd';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, 31, -Math.PI / 2, -Math.PI / 2 + Math.PI * snapshot.tapCount);
      ctx.stroke();
    }
    ctx.restore();

    if (snapshot.tapPulseAt && snapshot.tapPulseAt !== this.lastTapPulseAt) this.lastTapPulseAt = snapshot.tapPulseAt;
    const pulseAge = now - this.lastTapPulseAt;
    if (this.lastTapPulseAt && pulseAge >= 0 && pulseAge < 420) {
      const progress = pulseAge / 420;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (1 - progress) * 0.9;
      ctx.strokeStyle = '#7dffd1';
      ctx.lineWidth = 4 * (1 - progress) + 1;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = settings.glow ? 24 : 0;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 25 + progress * 54, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawMenuHoldRing(tip, progress, settings) {
    const { ctx } = this;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,255,255,.28)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 23, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = '#8b5cf6';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = settings.glow ? 15 : 0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 23, -Math.PI / 2, -Math.PI / 2 + TAU * progress);
    ctx.stroke();
    ctx.restore();
  }

  drawPalmTarget(palm, baseRadius, snapshot, settings, now) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(palm.x, palm.y);
    ctx.globalCompositeOperation = 'lighter';
    if (snapshot.readyToFire) {
      const pulse = 1 + Math.sin(now * 0.009) * 0.08;
      ctx.strokeStyle = '#75ffd0';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = settings.glow ? 24 : 0;
      for (let ring = 0; ring < 3; ring += 1) {
        ctx.globalAlpha = 0.82 - ring * 0.2;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * pulse * (0.72 + ring * 0.27), now * (0.0015 + ring * 0.0005), now * (0.0015 + ring * 0.0005) + Math.PI * (1.15 + ring * 0.18));
        ctx.stroke();
      }
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius);
      gradient.addColorStop(0, 'rgba(219,255,240,.35)');
      gradient.addColorStop(0.45, 'rgba(52,211,153,.16)');
      gradient.addColorStop(1, 'rgba(52,211,153,0)');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, TAU);
      ctx.fill();
    } else if (!snapshot.menuOpen) {
      ctx.fillStyle = '#5eeaff';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = settings.glow ? 12 : 0;
      ctx.globalAlpha = 0.72;
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  clear() {
    this.pointerTrail = [];
    this.lastTapPulseAt = 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.clear();
  }
}
