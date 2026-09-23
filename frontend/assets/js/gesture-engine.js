import { clamp, distance, handScale, palmCenter, smoothLandmarks } from './utils.js';

const FINGERS = [
  { tip: 8, pip: 6, mcp: 5 },
  { tip: 12, pip: 10, mcp: 9 },
  { tip: 16, pip: 14, mcp: 13 },
  { tip: 20, pip: 18, mcp: 17 }
];

const TAP_WINDOW_MS = 1050;
const TAP_MIN_GAP_MS = 125;
const TAP_MAX_PRESS_MS = 460;
const HOVER_SWITCH_DELAY_MS = 90;

export class GestureEngine {
  constructor(settings, effectCount = 6) {
    this.settings = settings;
    this.effectCount = effectCount;
    this.events = [];
    this.reset();
  }

  reset() {
    this.smoothed = null;
    this.lastSeen = 0;
    this.singleStartedAt = 0;
    this.menuOpen = false;
    this.menuCenter = null;
    this.menuLastValidAt = 0;
    this.hoveredIndex = -1;
    this.hoverCandidateIndex = -1;
    this.hoverCandidateAt = 0;
    this.hoverStartedAt = 0;
    this.palmStartedAt = 0;
    this.pushBaseline = null;
    this.lastScale = null;
    this.lastScaleTime = 0;
    this.firedLock = false;
    this.lastFireAt = 0;
    this.resetTapDetector();
    this.snapshot = this.emptySnapshot();
  }

  emptySnapshot() {
    return {
      handPresent: false, landmarks: null, handedness: null, tip: null, palm: null,
      handScale: 0, singleFinger: false, openPalm: false, menuProgress: 0,
      menuOpen: false, menuCenter: null, hoveredIndex: -1, hoverProgress: 0,
      selectionReady: false, tapCount: 0, tapPhase: 'idle', tapStrength: 0,
      tapPulseAt: 0, tapDepth: 0, tapVelocity: 0, readyToFire: false
    };
  }

  setSettings(settings) {
    this.settings = settings;
  }

  consumeEvents() {
    const events = this.events;
    this.events = [];
    return events;
  }

  update(rawLandmarks, handedness = 'Unknown', now = performance.now()) {
    if (!rawLandmarks) return this.updateNoHand(now);
    const smoothing = 0.38 + (this.settings.trackingSensitivity / 100) * 0.34;
    const landmarks = smoothLandmarks(this.smoothed, rawLandmarks, smoothing);
    this.smoothed = landmarks;
    this.lastSeen = now;

    const scale = handScale(landmarks);
    const tip = landmarks[8];
    const palm = palmCenter(landmarks);
    const extended = FINGERS.map(({ tip: tipId, pip, mcp }) => {
      const vertical = landmarks[pip].y - landmarks[tipId].y;
      const reach = distance(landmarks[tipId], landmarks[0]) - distance(landmarks[mcp], landmarks[0]);
      return vertical > Math.max(-scale * 0.035, 0.004) && reach > scale * 0.145;
    });
    const singleFinger = extended[0] && !extended[1] && !extended[2] && !extended[3];
    const openPalm = extended.filter(Boolean).length >= 4;

    let menuProgress = 0;
    let hoverProgress = 0;
    let selectionReady = false;
    let readyToFire = false;

    if (!this.menuOpen) {
      if (singleFinger) {
        if (!this.singleStartedAt) this.singleStartedAt = now;
        menuProgress = clamp((now - this.singleStartedAt) / this.settings.menuHoldMs, 0, 1);
        if (menuProgress >= 1) this.openMenu({ ...tip }, now);
      } else {
        this.singleStartedAt = 0;
      }
    }

    if (this.menuOpen) {
      if (!singleFinger && now - this.menuLastValidAt > 520) this.closeMenu();
      if (singleFinger) {
        this.menuLastValidAt = now;
        const dx = (tip.x - this.menuCenter.x) * 1.25;
        const dy = tip.y - this.menuCenter.y;
        const radius = Math.hypot(dx, dy);
        if (radius > 0.052) {
          const angle = Math.atan2(dy, dx);
          const rawIndex = Math.round((angle + Math.PI / 2) / ((Math.PI * 2) / this.effectCount));
          const measuredIndex = ((rawIndex % this.effectCount) + this.effectCount) % this.effectCount;
          this.updateHoveredIndex(measuredIndex, now);
          hoverProgress = clamp((now - this.hoverStartedAt) / 260, 0, 1);
          selectionReady = hoverProgress >= 1;
          if (selectionReady) {
            if (this.settings.selectionMethod === 'dwell' && now - this.hoverStartedAt > 1150) {
              this.select(this.hoveredIndex, 'dwell');
            } else {
              this.detectAirTap(landmarks, scale, now, this.hoveredIndex);
            }
          }
        } else {
          this.hoveredIndex = -1;
          this.hoverCandidateIndex = -1;
          this.hoverStartedAt = 0;
          this.resetTapDetector();
        }
      }
      this.palmStartedAt = 0;
      this.pushBaseline = null;
    } else if (openPalm) {
      if (!this.palmStartedAt) {
        this.palmStartedAt = now;
        this.pushBaseline = scale;
      }
      readyToFire = now - this.palmStartedAt >= 190;
      if (!this.firedLock && !readyToFire) this.pushBaseline = this.pushBaseline * 0.9 + scale * 0.1;
      const dt = Math.max(1, now - (this.lastScaleTime || now));
      const velocity = this.lastScale == null ? 0 : (scale - this.lastScale) / dt;
      const ratio = scale / Math.max(0.01, this.pushBaseline || scale);
      const configured = this.settings.calibrationPushRatio;
      const threshold = configured || (1.22 - (this.settings.pushSensitivity / 100) * 0.13);
      const minVelocity = 0.00028 - (this.settings.pushSensitivity / 100) * 0.00013;
      if (readyToFire && !this.firedLock && ratio >= threshold && velocity > minVelocity && now - this.lastFireAt > 650) {
        this.firedLock = true;
        this.lastFireAt = now;
        this.events.push({ type: 'fire', palm: { ...palm }, landmarks, handScale: scale, source: 'hand-push' });
      }
      if (this.firedLock && ratio < Math.max(1.025, threshold * 0.86)) {
        this.firedLock = false;
        this.palmStartedAt = now;
        this.pushBaseline = scale;
      }
    } else {
      this.palmStartedAt = 0;
      this.pushBaseline = null;
      if (now - this.lastFireAt > 520) this.firedLock = false;
    }

    this.lastScale = scale;
    this.lastScaleTime = now;
    this.expireTapWindow(now);
    this.snapshot = {
      handPresent: true, landmarks, handedness, tip, palm, handScale: scale,
      singleFinger, openPalm, menuProgress, menuOpen: this.menuOpen,
      menuCenter: this.menuCenter, hoveredIndex: this.hoveredIndex,
      hoverProgress, selectionReady, tapCount: this.tapTimes.length,
      tapPhase: this.tapPhase, tapStrength: this.tapStrength,
      tapPulseAt: this.tapPulseAt, tapDepth: this.tapDepth || 0,
      tapVelocity: this.tapVelocity || 0, readyToFire
    };
    return this.snapshot;
  }

  updateNoHand(now) {
    if (this.menuOpen && now - this.lastSeen > 520) this.closeMenu();
    if (now - this.lastSeen > 220) {
      this.singleStartedAt = 0;
      this.palmStartedAt = 0;
      this.pushBaseline = null;
      this.smoothed = null;
      this.snapshot = { ...this.emptySnapshot(), menuOpen: this.menuOpen, menuCenter: this.menuCenter };
    }
    return this.snapshot;
  }

  openMenu(center, now) {
    this.menuOpen = true;
    this.menuCenter = center;
    this.menuLastValidAt = now;
    this.hoveredIndex = -1;
    this.hoverCandidateIndex = -1;
    this.hoverCandidateAt = 0;
    this.hoverStartedAt = 0;
    this.singleStartedAt = now;
    this.resetTapDetector();
    this.events.push({ type: 'menu-open' });
  }

  closeMenu() {
    if (this.menuOpen) this.events.push({ type: 'menu-close' });
    this.menuOpen = false;
    this.menuCenter = null;
    this.hoveredIndex = -1;
    this.hoverCandidateIndex = -1;
    this.hoverCandidateAt = 0;
    this.hoverStartedAt = 0;
    this.singleStartedAt = 0;
    this.resetTapDetector();
  }

  updateHoveredIndex(measuredIndex, now) {
    if (this.hoveredIndex < 0) {
      this.commitHoveredIndex(measuredIndex, now);
      return;
    }
    if (measuredIndex === this.hoveredIndex) {
      this.hoverCandidateIndex = -1;
      this.hoverCandidateAt = 0;
      return;
    }
    if (measuredIndex !== this.hoverCandidateIndex) {
      this.hoverCandidateIndex = measuredIndex;
      this.hoverCandidateAt = now;
      return;
    }
    if (now - this.hoverCandidateAt >= HOVER_SWITCH_DELAY_MS) this.commitHoveredIndex(measuredIndex, now);
  }

  commitHoveredIndex(index, now) {
    if (index === this.hoveredIndex) return;
    this.hoveredIndex = index;
    this.hoverCandidateIndex = -1;
    this.hoverCandidateAt = 0;
    this.hoverStartedAt = now;
    this.resetTapDetector();
    this.events.push({ type: 'hover', index });
  }

  resetTapDetector() {
    this.tapBaseline = null;
    this.tapLastDepth = null;
    this.tapLastTime = 0;
    this.tapPhase = 'idle';
    this.tapPressedAt = 0;
    this.tapPeakDepth = 0;
    this.tapTimes = [];
    this.tapTargetIndex = -1;
    this.tapStrength = 0;
    this.tapPulseAt = 0;
    this.tapDepth = 0;
    this.tapVelocity = 0;
    this.tapBaselineReach = null;
  }

  tapDepthMetric(landmarks, scale) {
    const palmZ = ((landmarks[0].z || 0) + (landmarks[5].z || 0) + (landmarks[9].z || 0) + (landmarks[13].z || 0) + (landmarks[17].z || 0)) / 5;
    const fingertipZ = landmarks[8].z || 0;
    const knuckleZ = ((landmarks[5].z || 0) + (landmarks[9].z || 0)) / 2;
    const palmRelative = (palmZ - fingertipZ) / Math.max(scale, 0.08);
    const knuckleRelative = (knuckleZ - fingertipZ) / Math.max(scale, 0.08);
    const reach = distance(landmarks[8], landmarks[5]) / Math.max(scale, 0.08);
    if (this.tapBaselineReach == null) this.tapBaselineReach = reach;
    const foreshortening = clamp(this.tapBaselineReach - reach, -0.18, 0.32);
    return palmRelative * 0.54 + knuckleRelative * 0.31 + foreshortening * 0.42;
  }

  detectAirTap(landmarks, scale, now, index) {
    this.expireTapWindow(now);
    const depth = this.tapDepthMetric(landmarks, scale);
    if (this.tapBaseline == null) {
      this.tapBaseline = depth;
      this.tapLastDepth = depth;
      this.tapLastTime = now;
      return;
    }

    const dt = Math.max(1, now - this.tapLastTime);
    const velocity = (depth - this.tapLastDepth) / dt;
    this.tapDepth = depth;
    this.tapVelocity = velocity;
    const sensitivity = this.settings.tapSensitivity / 100;
    const threshold = 0.09 - sensitivity * 0.055;
    const minVelocity = 0.00042 - sensitivity * 0.00025;
    const delta = depth - this.tapBaseline;
    this.tapStrength = clamp(delta / Math.max(0.001, threshold), 0, 1.35);

    if (this.tapPhase === 'idle') {
      const adapt = this.tapTimes.length ? 0.018 : 0.055;
      this.tapBaseline = this.tapBaseline * (1 - adapt) + depth * adapt;
      if (delta >= threshold && velocity >= minVelocity) {
        this.tapPhase = 'pressed';
        this.tapPressedAt = now;
        this.tapPeakDepth = depth;
      }
    } else if (this.tapPhase === 'pressed') {
      this.tapPeakDepth = Math.max(this.tapPeakDepth, depth);
      const pressAge = now - this.tapPressedAt;
      const returned = depth <= this.tapBaseline + threshold * 0.42;
      const reversing = pressAge >= 70 && velocity <= -minVelocity * 0.42 && depth < this.tapPeakDepth - threshold * 0.24;
      if ((returned || reversing) && pressAge >= 65 && pressAge <= TAP_MAX_PRESS_MS) {
        this.registerTap(index, now, clamp((this.tapPeakDepth - this.tapBaseline) / threshold, 0.7, 1.6));
        this.tapPhase = 'cooldown';
        this.tapPressedAt = now;
        this.tapBaseline = depth;
        this.tapStrength = 0;
      } else if (pressAge > TAP_MAX_PRESS_MS) {
        this.tapPhase = 'idle';
        this.tapBaseline = depth;
        this.tapStrength = 0;
      }
    } else if (this.tapPhase === 'cooldown' && now - this.tapPressedAt >= TAP_MIN_GAP_MS) {
      this.tapPhase = 'idle';
      this.tapBaseline = this.tapBaseline * 0.7 + depth * 0.3;
    }

    this.tapLastDepth = depth;
    this.tapLastTime = now;
  }

  registerTap(index, now, strength) {
    const lastTap = this.tapTimes.at(-1) || 0;
    if (lastTap && now - lastTap < TAP_MIN_GAP_MS) return;
    if (!this.tapTimes.length) this.tapTargetIndex = index;
    if (index !== this.tapTargetIndex) {
      this.tapTimes = [];
      this.tapTargetIndex = index;
    }
    this.tapTimes.push(now);
    this.tapPulseAt = now;
    this.events.push({ type: 'air-tap', count: this.tapTimes.length, index, strength, source: 'index-finger' });
    if (this.tapTimes.length >= 2) this.select(index, 'doubleTap');
  }

  expireTapWindow(now) {
    if (!this.tapTimes?.length) return;
    this.tapTimes = this.tapTimes.filter((time) => now - time <= TAP_WINDOW_MS);
    if (!this.tapTimes.length) {
      this.tapTargetIndex = -1;
      this.tapPulseAt = 0;
    }
  }

  select(index, source = 'doubleTap') {
    if (index < 0 || index >= this.effectCount) return;
    this.events.push({ type: 'select', index, source });
    this.closeMenu();
  }
}
