import test from 'node:test';
import assert from 'node:assert/strict';
import { GestureEngine } from '../frontend/assets/js/gesture-engine.js';

const settings = {
  trackingSensitivity: 62,
  tapSensitivity: 66,
  pushSensitivity: 62,
  menuHoldMs: 480,
  selectionMethod: 'doubleTap',
  calibrationPushRatio: null
};

function landmarks(tipZ = -0.04) {
  const points = Array.from({ length: 21 }, (_, index) => ({
    x: 0.4 + (index % 4) * 0.035,
    y: 0.7 - Math.floor(index / 4) * 0.055,
    z: 0
  }));
  points[8].z = tipZ;
  return points;
}

function opticalTapLandmarks(forward = false) {
  const points = landmarks(-0.04);
  points[8].x = points[5].x;
  points[8].y = points[5].y - (forward ? 0.025 : 0.16);
  return points;
}

test('işaret parmağının iki ileri-geri dokunuşu efekti seçer', () => {
  const engine = new GestureEngine(settings, 6);
  engine.menuOpen = true;
  engine.hoveredIndex = 2;

  engine.detectAirTap(landmarks(-0.04), 0.4, 0, 2);
  engine.detectAirTap(landmarks(-0.12), 0.4, 70, 2);
  engine.detectAirTap(landmarks(-0.04), 0.4, 175, 2);
  engine.detectAirTap(landmarks(-0.04), 0.4, 320, 2);
  engine.detectAirTap(landmarks(-0.04), 0.4, 360, 2);
  engine.detectAirTap(landmarks(-0.12), 0.4, 455, 2);
  engine.detectAirTap(landmarks(-0.04), 0.4, 565, 2);

  const events = engine.consumeEvents();
  assert.deepEqual(events.filter((event) => event.type === 'air-tap').map((event) => event.count), [1, 2]);
  assert.ok(events.some((event) => event.type === 'select' && event.index === 2 && event.source === 'doubleTap'));
  assert.equal(events.some((event) => event.source === 'pointer'), false);
});

test('tek dokunuş seçim yapmaz ve süre aşımında sıfırlanır', () => {
  const engine = new GestureEngine(settings, 6);
  engine.menuOpen = true;
  engine.hoveredIndex = 4;

  engine.detectAirTap(landmarks(-0.04), 0.4, 0, 4);
  engine.detectAirTap(landmarks(-0.12), 0.4, 75, 4);
  engine.detectAirTap(landmarks(-0.04), 0.4, 180, 4);
  engine.expireTapWindow(1300);

  const events = engine.consumeEvents();
  assert.equal(events.filter((event) => event.type === 'air-tap').length, 1);
  assert.equal(events.some((event) => event.type === 'select'), false);
  assert.equal(engine.tapTimes.length, 0);
});

test('kamera derinliği zayıfsa parmağın optik kısalması da hava dokunuşunu algılar', () => {
  const engine = new GestureEngine(settings, 6);
  engine.menuOpen = true;
  engine.hoveredIndex = 1;

  engine.detectAirTap(opticalTapLandmarks(false), 0.4, 0, 1);
  engine.detectAirTap(opticalTapLandmarks(true), 0.4, 75, 1);
  engine.detectAirTap(opticalTapLandmarks(false), 0.4, 180, 1);

  const events = engine.consumeEvents();
  assert.equal(events.filter((event) => event.type === 'air-tap').length, 1);
  assert.equal(events[0].source, 'index-finger');
});
