import test from 'node:test';
import assert from 'node:assert/strict';
import { EffectEngine } from '../frontend/assets/js/effect-engine.js';
import { EFFECTS } from '../frontend/assets/js/config.js';

const gradient = { addColorStop() {} };
const context = new Proxy({}, {
  get(target, property) {
    if (property === 'createLinearGradient' || property === 'createRadialGradient') return () => gradient;
    if (!(property in target)) target[property] = () => {};
    return target[property];
  },
  set(target, property, value) {
    target[property] = value;
    return true;
  }
});

globalThis.window = { devicePixelRatio: 1 };
globalThis.ResizeObserver = class { observe() {} disconnect() {} };
globalThis.requestAnimationFrame = () => 1;
globalThis.cancelAnimationFrame = () => {};

const settings = {
  effectQuality: 'high',
  particleDensity: 75,
  reduceMotion: false,
  glow: true
};

test('altı sinematik efekt uçuş ve çarpışma aşamalarını üretir', () => {
  const canvas = { getContext: () => context, style: {}, width: 0, height: 0 };
  const video = { videoWidth: 1280, videoHeight: 720 };
  const stage = { clientWidth: 1280, clientHeight: 720 };
  const engine = new EffectEngine(canvas, video, stage, settings);
  const hand = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.65, z: 0 }));
  hand[0] = { x: 0.5, y: 0.72, z: 0 };
  hand[9] = { x: 0.55, y: 0.52, z: -0.02 };

  EFFECTS.forEach((effect) => engine.fire(effect, { x: 0.5, y: 0.62 }, hand));
  assert.equal(engine.projectiles.length, 6);
  assert.ok(engine.particles.length > 20);
  engine.updateProjectiles(2000);
  assert.equal(engine.projectiles.length, 0);
  assert.ok(engine.impacts.some((impact) => impact.phase === 'impact' && impact.type === 'fire'));
  assert.ok(engine.impacts.some((impact) => impact.phase === 'impact' && impact.type === 'energy'));
  engine.updateParticles(16);
  engine.updateImpacts(16);
  engine.destroy();
});
