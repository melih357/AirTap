import { clamp, mapPointToStage } from './utils.js';

const TAU = Math.PI * 2;
const easeOutCubic = (value) => 1 - ((1 - value) ** 3);
const easeInOutCubic = (value) => value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2;
const seeded = (seed) => {
  const value = Math.sin(seed * 91.731 + 17.113) * 43758.5453;
  return value - Math.floor(value);
};

export class EffectEngine {
  constructor(canvas, video, stage, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    this.video = video;
    this.stage = stage;
    this.settings = settings;
    this.projectiles = [];
    this.particles = [];
    this.impacts = [];
    this.screenFlash = 0;
    this.flashColor = '#ffffff';
    this.lastFrame = performance.now();
    this.running = true;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(stage);
    this.resize();
    this.frame = requestAnimationFrame((time) => this.animate(time));
  }

  setSettings(settings) {
    this.settings = settings;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, this.settings.effectQuality === 'high' ? 2 : 1.5);
    const width = Math.max(1, this.stage.clientWidth);
    const height = Math.max(1, this.stage.clientHeight);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = width;
    this.height = height;
    this.dpr = dpr;
  }

  fire(effect, palmPoint, landmarks = null) {
    const origin = mapPointToStage(palmPoint, this.video, this.stage);
    const direction = this.getDirection(landmarks);
    const travel = clamp(Math.min(this.width, this.height) * 0.64, 280, 610);
    let target = {
      x: origin.x + direction.x * travel,
      y: origin.y + direction.y * travel
    };
    target.x = clamp(target.x, this.width * 0.07, this.width * 0.93);
    target.y = clamp(target.y, this.height * 0.09, this.height * 0.72);
    if (Math.hypot(target.x - origin.x, target.y - origin.y) < 170) {
      target = { x: clamp(origin.x + direction.x * 260, 60, this.width - 60), y: clamp(origin.y - 260, 60, this.height * 0.64) };
    }

    const seed = Math.random() * 10000;
    const distance = Math.hypot(target.x - origin.x, target.y - origin.y);
    const baseLife = effect.id === 'laser' ? 360 : effect.id === 'web' ? 720 : 590;
    const projectile = {
      type: effect.id,
      effect,
      origin,
      target,
      x: origin.x,
      y: origin.y,
      previousX: origin.x,
      previousY: origin.y,
      direction,
      perpendicular: { x: -direction.y, y: direction.x },
      age: 0,
      life: this.settings.reduceMotion ? Math.min(430, baseLife) : baseLife + distance * 0.08,
      size: clamp(Math.min(this.width, this.height) * 0.052, 26, 58),
      seed,
      trail: [],
      trailClock: 0,
      rotation: seed % TAU,
      exploded: false
    };
    this.projectiles.push(projectile);
    this.spawnMuzzle(effect, origin, direction, seed);
    this.screenFlash = Math.max(this.screenFlash, 0.28);
    this.flashColor = effect.accent;
    return origin;
  }

  getDirection(landmarks) {
    if (!landmarks?.[9] || !landmarks?.[0]) return { x: 0, y: -1 };
    const wrist = mapPointToStage(landmarks[0], this.video, this.stage);
    const middleKnuckle = mapPointToStage(landmarks[9], this.video, this.stage);
    const dx = middleKnuckle.x - wrist.x;
    const dy = middleKnuckle.y - wrist.y;
    const length = Math.hypot(dx, dy) || 1;
    const normalized = { x: dx / length, y: dy / length };
    if (normalized.y > -0.18) normalized.y = -0.42;
    const correctedLength = Math.hypot(normalized.x, normalized.y) || 1;
    return { x: normalized.x / correctedLength, y: normalized.y / correctedLength };
  }

  qualityAmount(base) {
    const quality = this.settings.effectQuality === 'low' ? 0.44 : this.settings.effectQuality === 'medium' ? 0.7 : 1;
    return Math.max(4, Math.round(base * quality * (this.settings.particleDensity / 100)));
  }

  spawnMuzzle(effect, origin, direction, seed) {
    this.impacts.push({
      type: effect.id,
      effect,
      x: origin.x,
      y: origin.y,
      age: 0,
      life: this.settings.reduceMotion ? 180 : 300,
      seed,
      phase: 'muzzle',
      direction
    });
    const count = this.qualityAmount(effect.id === 'electric' ? 24 : 19);
    for (let index = 0; index < count; index += 1) {
      const spread = (Math.random() - 0.5) * 1.55;
      const angle = Math.atan2(direction.y, direction.x) + Math.PI + spread;
      const speed = 0.045 + Math.random() * 0.16;
      this.particles.push(this.createParticle(effect, origin.x, origin.y, Math.cos(angle) * speed, Math.sin(angle) * speed, {
        life: 260 + Math.random() * 360,
        size: 2.5 + Math.random() * 8,
        kind: effect.id === 'fire' && Math.random() > 0.66 ? 'ember' : 'spark',
        seed: seed + index
      }));
    }
  }

  createParticle(effect, x, y, vx, vy, options = {}) {
    return {
      type: effect.id,
      effect,
      x,
      y,
      previousX: x,
      previousY: y,
      vx,
      vy,
      age: 0,
      life: options.life || 600,
      size: options.size || 5,
      drag: options.drag ?? 0.994,
      gravity: options.gravity ?? (effect.id === 'fire' ? -0.000065 : 0.000035),
      rotation: Math.random() * TAU,
      spin: (Math.random() - 0.5) * 0.012,
      color: Math.random() > 0.45 ? effect.color : effect.accent,
      kind: options.kind || 'spark',
      seed: options.seed || Math.random() * 1000
    };
  }

  explode(projectile) {
    if (projectile.exploded) return;
    projectile.exploded = true;
    const effect = projectile.effect;
    const countByType = { fire: 74, ice: 55, electric: 66, laser: 44, web: 38, energy: 82 };
    const count = this.qualityAmount(countByType[projectile.type] || 58);
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * TAU;
      const speed = 0.075 + Math.random() * (projectile.type === 'energy' ? 0.46 : 0.36);
      let kind = 'spark';
      if (projectile.type === 'ice') kind = Math.random() > 0.38 ? 'shard' : 'mist';
      if (projectile.type === 'web') kind = 'thread';
      if (projectile.type === 'fire') kind = Math.random() > 0.7 ? 'smoke' : 'ember';
      if (projectile.type === 'electric') kind = 'bolt';
      this.particles.push(this.createParticle(effect, projectile.x, projectile.y, Math.cos(angle) * speed, Math.sin(angle) * speed, {
        life: 450 + Math.random() * 720,
        size: 2.5 + Math.random() * (projectile.type === 'ice' ? 13 : 9),
        kind,
        drag: projectile.type === 'web' ? 0.985 : 0.994,
        seed: projectile.seed + index * 7
      }));
    }
    this.impacts.push({
      type: projectile.type,
      effect,
      x: projectile.x,
      y: projectile.y,
      age: 0,
      life: this.settings.reduceMotion ? 430 : 960,
      seed: projectile.seed,
      phase: 'impact',
      direction: projectile.direction
    });
    this.screenFlash = projectile.type === 'laser' ? 0.74 : 0.55;
    this.flashColor = effect.accent;
  }

  animate(time) {
    if (!this.running) return;
    const dt = clamp(time - this.lastFrame, 0, 34);
    this.lastFrame = time;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateProjectiles(dt);
    this.updateParticles(dt);
    this.updateImpacts(dt);
    this.drawScreenFlash(dt);
    this.capCollections();
    this.frame = requestAnimationFrame((next) => this.animate(next));
  }

  capCollections() {
    const limit = this.settings.effectQuality === 'high' ? 650 : this.settings.effectQuality === 'medium' ? 420 : 260;
    if (this.particles.length > limit) this.particles.splice(0, this.particles.length - limit);
    if (this.impacts.length > 18) this.impacts.splice(0, this.impacts.length - 18);
  }

  updateProjectiles(dt) {
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.age += dt;
      const linear = clamp(projectile.age / projectile.life, 0, 1);
      const progress = projectile.type === 'laser' ? easeOutCubic(linear) : easeInOutCubic(linear);
      projectile.previousX = projectile.x;
      projectile.previousY = projectile.y;
      const arc = Math.sin(progress * Math.PI) * Math.min(48, Math.hypot(projectile.target.x - projectile.origin.x, projectile.target.y - projectile.origin.y) * 0.08);
      const wobble = projectile.type === 'electric' ? Math.sin(projectile.age * 0.055) * 7 : projectile.type === 'energy' ? Math.sin(projectile.age * 0.024) * 4 : 0;
      projectile.x = projectile.origin.x + (projectile.target.x - projectile.origin.x) * progress + projectile.perpendicular.x * (arc * 0.22 + wobble);
      projectile.y = projectile.origin.y + (projectile.target.y - projectile.origin.y) * progress + projectile.perpendicular.y * (arc * 0.22 + wobble);
      projectile.rotation += dt * (projectile.type === 'ice' ? 0.007 : 0.003);
      projectile.trailClock += dt;
      if (projectile.trailClock >= (this.settings.effectQuality === 'low' ? 30 : 16)) {
        projectile.trailClock = 0;
        projectile.trail.push({ x: projectile.x, y: projectile.y, age: 0 });
        if (projectile.trail.length > 28) projectile.trail.shift();
        this.emitTrailParticle(projectile);
      }
      projectile.trail.forEach((point) => { point.age += dt; });
      projectile.trail = projectile.trail.filter((point) => point.age < 430);
      this.drawProjectile(projectile, linear);
      if (linear >= 1) {
        this.explode(projectile);
        return false;
      }
      return true;
    });
  }

  emitTrailParticle(projectile) {
    const chance = this.settings.effectQuality === 'low' ? 0.48 : 0.9;
    if (Math.random() > chance) return;
    const spread = projectile.size * 0.38;
    const kind = projectile.type === 'ice' ? 'mist' : projectile.type === 'web' ? 'thread' : projectile.type === 'fire' ? 'ember' : 'spark';
    this.particles.push(this.createParticle(
      projectile.effect,
      projectile.x + (Math.random() - 0.5) * spread,
      projectile.y + (Math.random() - 0.5) * spread,
      (projectile.previousX - projectile.x) * 0.006 + (Math.random() - 0.5) * 0.035,
      (projectile.previousY - projectile.y) * 0.006 + (Math.random() - 0.5) * 0.035,
      { life: 260 + Math.random() * 340, size: 2 + Math.random() * 7, kind }
    ));
  }

  drawProjectile(projectile, progress) {
    const { ctx } = this;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    this.drawTrail(projectile);
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.rotation);
    const pulse = 1 + Math.sin(projectile.age * 0.035) * 0.085;
    const size = projectile.size * pulse * Math.min(1, progress * 4 + 0.35);
    if (projectile.type === 'fire') this.drawFireball(size, projectile);
    else if (projectile.type === 'ice') this.drawIceShard(size, projectile);
    else if (projectile.type === 'electric') this.drawElectricCore(size, projectile);
    else if (projectile.type === 'laser') this.drawLaserHead(size, projectile);
    else if (projectile.type === 'web') this.drawWebCapsule(size, projectile);
    else this.drawEnergyOrb(size, projectile);
    ctx.restore();
  }

  drawTrail(projectile) {
    const { ctx } = this;
    const points = [projectile.origin, ...projectile.trail, { x: projectile.x, y: projectile.y }];
    if (points.length < 3) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const trailGradient = ctx.createLinearGradient(projectile.origin.x, projectile.origin.y, projectile.x, projectile.y);
    trailGradient.addColorStop(0, 'transparent');
    trailGradient.addColorStop(0.58, projectile.effect.accent);
    trailGradient.addColorStop(1, '#ffffff');
    ctx.strokeStyle = trailGradient;
    ctx.shadowColor = projectile.effect.color;
    ctx.shadowBlur = this.settings.glow ? 22 : 0;
    ctx.globalAlpha = projectile.type === 'laser' ? 0.92 : 0.48;
    ctx.lineWidth = projectile.type === 'laser' ? projectile.size * 0.48 : projectile.type === 'web' ? 2.2 : projectile.size * 0.24;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length - 1; index += 1) {
      const midpoint = { x: (points[index].x + points[index + 1].x) / 2, y: (points[index].y + points[index + 1].y) / 2 };
      ctx.quadraticCurveTo(points[index].x, points[index].y, midpoint.x, midpoint.y);
    }
    ctx.lineTo(projectile.x, projectile.y);
    ctx.stroke();
    if (projectile.type === 'fire' || projectile.type === 'energy') {
      ctx.globalAlpha *= 0.34;
      ctx.lineWidth *= 2.8;
      ctx.stroke();
    }
    if (projectile.type === 'web') {
      ctx.globalAlpha = 0.58;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        points.forEach((point, index) => {
          const offset = Math.sin(index * 1.7 + projectile.age * 0.02) * 5 * side;
          const x = point.x + projectile.perpendicular.x * offset;
          const y = point.y + projectile.perpendicular.y * offset;
          if (!index) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  glowDisc(radius, stops, blur = 28) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    stops.forEach(([position, color]) => gradient.addColorStop(position, color));
    this.ctx.fillStyle = gradient;
    this.ctx.shadowColor = stops[Math.min(1, stops.length - 1)][1];
    this.ctx.shadowBlur = this.settings.glow ? blur : 0;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, TAU);
    this.ctx.fill();
  }

  drawFireball(size, projectile) {
    const { ctx } = this;
    ctx.rotate(-projectile.rotation);
    this.glowDisc(size * 1.55, [[0, '#ffffff'], [0.12, '#fff3a6'], [0.34, '#ffbb24'], [0.66, '#ff4b0b'], [1, 'rgba(255,30,0,0)']], 34);
    ctx.globalAlpha = 0.72;
    for (let flame = 0; flame < 7; flame += 1) {
      const angle = (flame / 7) * TAU + projectile.age * 0.008;
      const length = size * (0.62 + seeded(projectile.seed + flame) * 0.6);
      ctx.strokeStyle = flame % 2 ? '#ff7617' : '#ffd35a';
      ctx.lineWidth = 2.2 + seeded(projectile.seed + flame * 3) * 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * size * 0.4, Math.sin(angle) * size * 0.4);
      ctx.quadraticCurveTo(Math.cos(angle + 0.5) * length, Math.sin(angle + 0.5) * length, Math.cos(angle) * size, Math.sin(angle) * size);
      ctx.stroke();
    }
  }

  drawIceShard(size, projectile) {
    const { ctx } = this;
    ctx.shadowColor = projectile.effect.color;
    ctx.shadowBlur = this.settings.glow ? 30 : 0;
    const gradient = ctx.createLinearGradient(-size, -size, size, size);
    gradient.addColorStop(0, 'rgba(255,255,255,.98)');
    gradient.addColorStop(0.25, '#bdf7ff');
    gradient.addColorStop(0.68, '#42cfff');
    gradient.addColorStop(1, 'rgba(42,94,255,.18)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(size * 1.45, 0);
    ctx.lineTo(size * 0.12, size * 0.55);
    ctx.lineTo(-size * 0.92, size * 0.2);
    ctx.lineTo(-size * 0.58, -size * 0.45);
    ctx.lineTo(size * 0.18, -size * 0.56);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.lineWidth = 1.7;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 1.05, 0);
    ctx.lineTo(-size * 0.44, -size * 0.18);
    ctx.stroke();
  }

  drawElectricCore(size, projectile) {
    const { ctx } = this;
    this.glowDisc(size * 1.22, [[0, '#ffffff'], [0.18, '#c9fdff'], [0.46, '#7c66ff'], [1, 'rgba(75,35,255,0)']], 36);
    ctx.strokeStyle = '#dffcff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = projectile.effect.accent;
    ctx.shadowBlur = this.settings.glow ? 25 : 0;
    for (let ray = 0; ray < 8; ray += 1) {
      const angle = ray / 8 * TAU + projectile.age * 0.013;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * size * 0.25, Math.sin(angle) * size * 0.25);
      for (let step = 1; step <= 3; step += 1) {
        const radius = size * (0.35 + step * 0.33);
        const jitter = (seeded(projectile.seed + ray * 11 + step + Math.floor(projectile.age / 48)) - 0.5) * size * 0.35;
        ctx.lineTo(Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * jitter, Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * jitter);
      }
      ctx.stroke();
    }
  }

  drawLaserHead(size, projectile) {
    const { ctx } = this;
    ctx.rotate(-projectile.rotation + Math.atan2(projectile.direction.y, projectile.direction.x));
    const gradient = ctx.createLinearGradient(-size * 1.7, 0, size * 1.1, 0);
    gradient.addColorStop(0, 'rgba(255,26,107,0)');
    gradient.addColorStop(0.42, '#ff2f86');
    gradient.addColorStop(0.8, '#ffffff');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#ff2f86';
    ctx.shadowBlur = this.settings.glow ? 36 : 0;
    ctx.beginPath();
    ctx.moveTo(-size * 1.8, -size * 0.18);
    ctx.lineTo(size, -size * 0.32);
    ctx.lineTo(size * 1.45, 0);
    ctx.lineTo(size, size * 0.32);
    ctx.lineTo(-size * 1.8, size * 0.18);
    ctx.closePath();
    ctx.fill();
  }

  drawWebCapsule(size, projectile) {
    const { ctx } = this;
    ctx.strokeStyle = '#effaff';
    ctx.lineWidth = 2;
    ctx.shadowColor = projectile.effect.accent;
    ctx.shadowBlur = this.settings.glow ? 22 : 0;
    for (let ring = 1; ring <= 4; ring += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, size * ring / 4, 0, TAU);
      ctx.stroke();
    }
    for (let spoke = 0; spoke < 9; spoke += 1) {
      const angle = spoke / 9 * TAU + projectile.age * 0.005;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
      ctx.stroke();
    }
    this.glowDisc(size * 0.32, [[0, '#ffffff'], [0.45, '#8bdcff'], [1, 'rgba(80,180,255,0)']], 18);
  }

  drawEnergyOrb(size, projectile) {
    const { ctx } = this;
    ctx.rotate(-projectile.rotation);
    this.glowDisc(size * 1.46, [[0, '#ffffff'], [0.14, '#bffcff'], [0.36, '#29d8ff'], [0.68, '#7457ff'], [1, 'rgba(86,46,255,0)']], 38);
    ctx.strokeStyle = 'rgba(225,253,255,.92)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = this.settings.glow ? 18 : 0;
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.save();
      ctx.rotate(projectile.age * (0.003 + ring * 0.0015) * (ring % 2 ? -1 : 1));
      ctx.scale(1, 0.34 + ring * 0.17);
      ctx.beginPath();
      ctx.arc(0, 0, size * (0.72 + ring * 0.22), 0.15 + ring, Math.PI * 1.55 + ring);
      ctx.stroke();
      ctx.restore();
    }
  }

  updateParticles(dt) {
    this.particles = this.particles.filter((particle) => {
      particle.age += dt;
      if (particle.age >= particle.life) return false;
      particle.previousX = particle.x;
      particle.previousY = particle.y;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= particle.drag ** dt;
      particle.vy = particle.vy * (particle.drag ** dt) + particle.gravity * dt;
      particle.rotation += particle.spin * dt;
      this.drawParticle(particle);
      return true;
    });
  }

  drawParticle(particle) {
    const { ctx } = this;
    const progress = clamp(particle.age / particle.life, 0, 1);
    const alpha = (1 - progress) * Math.min(1, particle.age / 70);
    const size = particle.size * (particle.kind === 'smoke' ? 1 + progress * 3.4 : 1 - progress * 0.36);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    if (particle.kind === 'smoke' || particle.kind === 'mist') {
      ctx.globalCompositeOperation = 'source-over';
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.7);
      gradient.addColorStop(0, particle.kind === 'mist' ? 'rgba(215,251,255,.46)' : 'rgba(61,37,33,.32)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.7, 0, TAU);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = particle.color;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = this.settings.glow ? 13 : 0;
      if (particle.kind === 'shard') {
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.5);
        ctx.lineTo(size * 0.38, size * 0.6);
        ctx.lineTo(-size * 0.3, size);
        ctx.closePath();
        ctx.fill();
      } else if (particle.kind === 'thread') {
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(-size * 1.5, 0);
        ctx.quadraticCurveTo(0, size * 0.8, size * 1.5, 0);
        ctx.stroke();
      } else if (particle.kind === 'bolt') {
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-size, -size);
        ctx.lineTo(0, 0);
        ctx.lineTo(size * 0.35, -size * 0.1);
        ctx.lineTo(size, size);
        ctx.stroke();
      } else {
        ctx.lineWidth = Math.max(1.2, size * 0.24);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-particle.vx * 62 - size, -particle.vy * 62);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1, size * 0.32), 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  updateImpacts(dt) {
    this.impacts = this.impacts.filter((impact) => {
      impact.age += dt;
      const progress = clamp(impact.age / impact.life, 0, 1);
      if (progress >= 1) return false;
      this.drawImpact(impact, progress);
      return true;
    });
  }

  drawImpact(impact, progress) {
    const { ctx } = this;
    const eased = easeOutCubic(progress);
    ctx.save();
    ctx.translate(impact.x, impact.y);
    ctx.globalCompositeOperation = 'lighter';
    if (impact.phase === 'muzzle') {
      this.drawMuzzleImpact(impact, progress, eased);
    } else if (impact.type === 'fire') {
      this.drawFireImpact(impact, progress, eased);
    } else if (impact.type === 'ice') {
      this.drawIceImpact(impact, progress, eased);
    } else if (impact.type === 'electric') {
      this.drawElectricImpact(impact, progress, eased);
    } else if (impact.type === 'laser') {
      this.drawLaserImpact(impact, progress, eased);
    } else if (impact.type === 'web') {
      this.drawWebImpact(impact, progress, eased);
    } else {
      this.drawEnergyImpact(impact, progress, eased);
    }
    ctx.restore();
  }

  drawMuzzleImpact(impact, progress, eased) {
    const { ctx } = this;
    const radius = 16 + eased * 70;
    ctx.globalAlpha = (1 - progress) * 0.82;
    ctx.strokeStyle = impact.effect.accent;
    ctx.lineWidth = 5 * (1 - progress) + 1;
    ctx.shadowColor = impact.effect.color;
    ctx.shadowBlur = this.settings.glow ? 24 : 0;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.42, Math.atan2(impact.direction.y, impact.direction.x), 0, TAU);
    ctx.stroke();
    for (let ray = 0; ray < 10; ray += 1) {
      const angle = ray / 10 * TAU;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * radius * 0.25, Math.sin(angle) * radius * 0.25);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.stroke();
    }
  }

  drawShockwave(impact, progress, eased, maxRadius, width = 7) {
    const { ctx } = this;
    ctx.globalAlpha = (1 - progress) * 0.86;
    ctx.strokeStyle = impact.effect.color;
    ctx.lineWidth = width * (1 - progress) + 1;
    ctx.shadowColor = impact.effect.accent;
    ctx.shadowBlur = this.settings.glow ? 30 : 0;
    ctx.beginPath();
    ctx.arc(0, 0, 12 + eased * maxRadius, 0, TAU);
    ctx.stroke();
  }

  drawFireImpact(impact, progress, eased) {
    const { ctx } = this;
    this.drawShockwave(impact, progress, eased, 155, 10);
    ctx.globalAlpha = Math.max(0, 1 - progress * 1.4);
    const radius = 24 + eased * 118;
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, 'rgba(255,255,255,.96)');
    gradient.addColorStop(0.18, 'rgba(255,230,111,.9)');
    gradient.addColorStop(0.48, 'rgba(255,80,8,.72)');
    gradient.addColorStop(1, 'rgba(170,10,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#ffd36a';
    ctx.lineWidth = 2;
    for (let ray = 0; ray < 18; ray += 1) {
      const angle = ray / 18 * TAU + seeded(impact.seed + ray) * 0.18;
      const start = 28 + eased * 32;
      const end = start + 35 + seeded(impact.seed + ray * 2) * 110 * (1 - progress);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * start, Math.sin(angle) * start);
      ctx.lineTo(Math.cos(angle) * end, Math.sin(angle) * end);
      ctx.stroke();
    }
  }

  drawIceImpact(impact, progress, eased) {
    const { ctx } = this;
    this.drawShockwave(impact, progress, eased, 145, 6);
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = '#d8fbff';
    ctx.fillStyle = 'rgba(113,229,255,.38)';
    ctx.shadowColor = '#7ae8ff';
    ctx.shadowBlur = this.settings.glow ? 22 : 0;
    for (let shard = 0; shard < 16; shard += 1) {
      const angle = shard / 16 * TAU + seeded(impact.seed + shard) * 0.18;
      const length = (45 + seeded(impact.seed + shard * 3) * 105) * eased;
      const width = 4 + seeded(impact.seed + shard * 5) * 10;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(length, -width);
      ctx.lineTo(length * 0.78, width * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  drawElectricImpact(impact, progress, eased) {
    const { ctx } = this;
    this.drawShockwave(impact, progress, eased, 150, 5);
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = '#dffcff';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = impact.effect.accent;
    ctx.shadowBlur = this.settings.glow ? 28 : 0;
    const frameSeed = Math.floor(impact.age / 52);
    for (let ray = 0; ray < 13; ray += 1) {
      const angle = ray / 13 * TAU;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let step = 1; step <= 6; step += 1) {
        const radius = step / 6 * (45 + eased * 120);
        const side = (seeded(impact.seed + ray * 31 + step * 7 + frameSeed) - 0.5) * 30;
        ctx.lineTo(Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * side, Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * side);
      }
      ctx.stroke();
    }
  }

  drawLaserImpact(impact, progress, eased) {
    const { ctx } = this;
    this.drawShockwave(impact, progress, eased, 125, 4);
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#ff3f81';
    ctx.shadowBlur = this.settings.glow ? 34 : 0;
    for (let ray = 0; ray < 8; ray += 1) {
      ctx.save();
      ctx.rotate(ray / 8 * TAU + impact.seed);
      ctx.lineWidth = ray % 2 ? 2 : 5;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo((55 + ray % 2 * 70) * eased, 0);
      ctx.stroke();
      ctx.restore();
    }
    this.glowDisc((26 + eased * 54) * (1 - progress * 0.55), [[0, '#ffffff'], [0.25, '#ffb4d0'], [0.62, '#ff2f83'], [1, 'rgba(255,20,110,0)']], 35);
  }

  drawWebImpact(impact, progress, eased) {
    const { ctx } = this;
    const radius = 22 + eased * 132;
    ctx.globalAlpha = Math.min(1, progress * 5) * (1 - progress * 0.48);
    ctx.strokeStyle = '#effaff';
    ctx.lineWidth = 1.4 + (1 - progress) * 1.8;
    ctx.shadowColor = impact.effect.accent;
    ctx.shadowBlur = this.settings.glow ? 17 : 0;
    for (let ring = 1; ring <= 5; ring += 1) {
      const ringRadius = radius * ring / 5;
      ctx.beginPath();
      for (let segment = 0; segment <= 32; segment += 1) {
        const angle = segment / 32 * TAU;
        const irregular = 1 + (seeded(impact.seed + ring * 41 + segment) - 0.5) * 0.12;
        const x = Math.cos(angle) * ringRadius * irregular;
        const y = Math.sin(angle) * ringRadius * irregular;
        if (!segment) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    for (let spoke = 0; spoke < 14; spoke += 1) {
      const angle = spoke / 14 * TAU + seeded(impact.seed + spoke) * 0.13;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.stroke();
    }
  }

  drawEnergyImpact(impact, progress, eased) {
    const { ctx } = this;
    this.drawShockwave(impact, progress, eased, 180, 8);
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = '#c9fbff';
    ctx.shadowColor = impact.effect.accent;
    ctx.shadowBlur = this.settings.glow ? 32 : 0;
    for (let ring = 0; ring < 5; ring += 1) {
      ctx.save();
      ctx.rotate(impact.age * (ring % 2 ? -0.0025 : 0.0035) + ring);
      ctx.scale(1, 0.34 + ring * 0.1);
      ctx.lineWidth = 1.4 + ring * 0.45;
      ctx.beginPath();
      ctx.arc(0, 0, (30 + ring * 24) * eased, ring * 0.35, TAU - ring * 0.18);
      ctx.stroke();
      ctx.restore();
    }
    const coreAlpha = Math.max(0, 1 - progress * 1.5);
    ctx.globalAlpha = coreAlpha;
    this.glowDisc(72 * (0.3 + eased), [[0, '#ffffff'], [0.18, '#bdfaff'], [0.52, '#4dd8ff'], [0.78, '#7958ff'], [1, 'rgba(80,30,255,0)']], 38);
  }

  drawScreenFlash(dt) {
    if (this.screenFlash <= 0.005) {
      this.screenFlash = 0;
      return;
    }
    const { ctx } = this;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = this.screenFlash * 0.28;
    const gradient = ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.72);
    gradient.addColorStop(0, this.flashColor);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
    this.screenFlash *= Math.pow(0.92, dt / 16.67);
  }

  clear() {
    this.projectiles = [];
    this.particles = [];
    this.impacts = [];
    this.screenFlash = 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.clear();
  }
}
