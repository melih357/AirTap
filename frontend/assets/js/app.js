import { DEFAULT_SETTINGS, EFFECTS, STORAGE_KEYS, TEXT, getEffectName, loadSettings, saveSettings } from './config.js?v=3.1.0';
import { AudioManager } from './audio-manager.js?v=3.1.0';
import { EffectEngine } from './effect-engine.js?v=3.1.0';
import { GestureEngine } from './gesture-engine.js?v=3.1.0';
import { HandTracker } from './hand-tracker.js?v=3.1.0';
import { AirTapRecorder } from './recorder.js?v=3.1.0';
import { TrackingOverlay } from './tracking-overlay.js?v=3.1.0';
import { clamp, formatTime, mapPointToStage } from './utils.js?v=3.1.0';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const UI_TEXT = {
  tr: {
    startCamera: 'Kamerayı Başlat', howItWorks: 'Nasıl Çalışır?', show: 'Göster',
    showBody: 'Yalnızca işaret parmağını kaldır.', choose: 'Seç', chooseBody: 'Efektin üzerine gel; işaret parmağını kameraya doğru iki kez ileri–geri dokundur.',
    launch: 'Fırlat', launchBody: 'Avucunu aç ve elini kameraya doğru hızlıca it.',
    privacyTitle: 'Görüntün sana ait', privacyBody: 'El algılama cihazında çalışır. Kamera görüntün AirTap sunucusuna gönderilmez.',
    settings: 'Ayarlar', closeCamera: 'Kamerayı kapat', capture: 'Fotoğraf', record: 'Kayıt', switchCamera: 'Kamera değiştir',
    selectedEffect: 'Seçili güç', feedback: 'Geri bildirim',
    tutorialTitle: 'AirTap’i 3 harekette kullan', settingsTitle: 'AirTap Ayarları',
    calibration: 'Kalibrasyon', reset: 'Varsayılana dön', save: 'Kaydet', cancel: 'Vazgeç', send: 'Gönder',
    download: 'Videoyu indir', retake: 'Kapat', beginCalibration: 'Kalibrasyona Başla', next: 'Sonraki', finish: 'Tamamla'
  },
  en: {
    startCamera: 'Start Camera', howItWorks: 'How does it work?', show: 'Show',
    showBody: 'Raise only your index finger.', choose: 'Choose', chooseBody: 'Point at an effect and move your index finger forward and back twice.',
    launch: 'Launch', launchBody: 'Open your palm and push it quickly toward the camera.',
    privacyTitle: 'Your video stays yours', privacyBody: 'Hand tracking runs on your device. Camera video is not sent to the AirTap server.',
    settings: 'Settings', closeCamera: 'Close camera', capture: 'Photo', record: 'Record', switchCamera: 'Switch camera',
    selectedEffect: 'Selected power', feedback: 'Feedback',
    tutorialTitle: 'Use AirTap in 3 moves', settingsTitle: 'AirTap Settings',
    calibration: 'Calibration', reset: 'Restore defaults', save: 'Save', cancel: 'Cancel', send: 'Send',
    download: 'Download video', retake: 'Close', beginCalibration: 'Start calibration', next: 'Next', finish: 'Finish'
  }
};

class AirTapApp {
  constructor() {
    this.settings = loadSettings();
    this.language = this.settings.language;
    this.copy = TEXT[this.language];
    this.stream = null;
    this.microphoneStream = null;
    this.handTracker = null;
    this.gesture = new GestureEngine(this.settings, EFFECTS.length);
    this.audio = new AudioManager(this.settings);
    this.effectEngine = null;
    this.trackingOverlay = null;
    this.recorder = null;
    this.snapshot = this.gesture.emptySnapshot();
    this.selectedEffectIndex = this.restoreSelectedEffect();
    this.recordingTimer = 0;
    this.recordingBlob = null;
    this.lastDarkWarning = 0;
    this.lowFpsSince = 0;
    this.calibrationStep = 0;
    this.calibrationBase = null;
    this.elements = this.collectElements();
    this.init();
  }

  collectElements() {
    return {
      landing: $('#landingScreen'), studio: $('#studioScreen'), video: $('#cameraVideo'), stage: $('#cameraStage'),
      trackingCanvas: $('#trackingCanvas'), effectCanvas: $('#effectCanvas'), startButton: $('#startCameraButton'),
      startMiniButton: $('#startMiniButton'), cameraError: $('#cameraError'), cameraErrorText: $('#cameraErrorText'),
      status: $('#trackingStatus'), statusText: $('#trackingStatusText'), fps: $('#fpsBadge'), hint: $('#gestureHint'),
      wheel: $('#effectWheel'), selectedIcon: $('#selectedEffectIcon'), selectedName: $('#selectedEffectName'),
      settingsPanel: $('#settingsPanel'), settingsBackdrop: $('#settingsBackdrop'), settingsForm: $('#settingsForm'),
      tutorialDialog: $('#tutorialDialog'), previewDialog: $('#previewDialog'), previewVideo: $('#previewVideo'),
      feedbackDialog: $('#feedbackDialog'), feedbackForm: $('#feedbackForm'), calibrationDialog: $('#calibrationDialog'),
      calibrationTitle: $('#calibrationStepTitle'), calibrationText: $('#calibrationStepText'), calibrationProgress: $('#calibrationProgress'),
      calibrationNext: $('#calibrationNext'), recordButton: $('#recordButton'), recordTime: $('#recordTime'),
      countdown: $('#countdown'), toastRegion: $('#toastRegion'), micButton: $('#micButton'),
      brightnessCanvas: $('#brightnessCanvas'), airTapSensor: $('#airTapSensor'),
      airTapSensorFill: $('#airTapSensorFill'), airTapSensorText: $('#airTapSensorText'),
      sensorAim: $('#sensorAim'), sensorPush: $('#sensorPush'), sensorReturn: $('#sensorReturn')
    };
  }

  init() {
    this.renderEffectWheel();
    this.renderSelectedEffect();
    this.bindEvents();
    this.populateSettingsForm();
    this.applySettings(false);
    this.translateUi();
    this.checkBrowserSupport();
  }

  bindEvents() {
    this.elements.startButton.addEventListener('click', () => this.startCamera());
    this.elements.startMiniButton?.addEventListener('click', () => this.startCamera());
    $$('[data-open-tutorial]').forEach((button) => button.addEventListener('click', () => this.openDialog(this.elements.tutorialDialog)));
    $$('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => this.closeDialog(button.closest('dialog'))));
    $('#closeCameraButton').addEventListener('click', () => this.closeCamera());
    $('#settingsButton').addEventListener('click', () => this.openSettings());
    $('#closeSettingsButton').addEventListener('click', () => this.closeSettings());
    this.elements.settingsBackdrop.addEventListener('click', () => this.closeSettings());
    this.elements.settingsForm.addEventListener('input', (event) => this.onSettingInput(event));
    this.elements.settingsForm.addEventListener('change', (event) => this.onSettingInput(event));
    $('#resetSettingsButton').addEventListener('click', () => this.resetSettings());
    $('#switchCameraButton').addEventListener('click', () => this.switchCamera());
    $('#photoButton').addEventListener('click', () => this.capturePhoto());
    this.elements.recordButton.addEventListener('click', () => this.toggleRecording());
    this.elements.micButton.addEventListener('click', () => this.toggleMicrophone());
    $('#downloadVideoButton').addEventListener('click', () => { if (this.recordingBlob) this.recorder.download(this.recordingBlob); });
    $('#openFeedbackButton').addEventListener('click', () => this.openDialog(this.elements.feedbackDialog));
    this.elements.feedbackForm.addEventListener('submit', (event) => this.sendFeedback(event));
    $$('[data-open-calibration]').forEach((button) => button.addEventListener('click', () => this.startCalibration()));
    this.elements.calibrationNext.addEventListener('click', () => this.advanceCalibration());
    window.addEventListener('beforeunload', () => this.stopMediaTracks());
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.stream) this.elements.hint.classList.add('is-awake');
    });
  }

  checkBrowserSupport() {
    if (!navigator.mediaDevices?.getUserMedia || !window.WebAssembly) {
      this.showCameraError(this.copy.unsupported);
      this.elements.startButton.disabled = true;
    }
  }

  restoreSelectedEffect() {
    if (!this.settings.rememberEffect) return 1;
    const stored = localStorage.getItem(STORAGE_KEYS.selectedEffect);
    if (stored === null) return 1;
    const saved = Number(stored);
    return Number.isInteger(saved) && saved >= 0 && saved < EFFECTS.length ? saved : 1;
  }

  renderEffectWheel() {
    this.elements.wheel.innerHTML = '';
    EFFECTS.forEach((effect, index) => {
      const item = document.createElement('div');
      item.className = 'wheel-item';
      item.style.setProperty('--angle', `${-90 + index * 60}deg`);
      item.style.setProperty('--effect-color', effect.color);
      item.dataset.effectIndex = String(index);
      item.setAttribute('role', 'menuitem');
      item.setAttribute('aria-label', getEffectName(effect, this.language));
      item.innerHTML = `<span class="wheel-progress"></span><span class="wheel-icon" aria-hidden="true">${effect.icon}</span><span class="wheel-label">${getEffectName(effect, this.language)}</span>`;
      this.elements.wheel.appendChild(item);
    });
    const center = document.createElement('div');
    center.className = 'wheel-center-label';
    center.dataset.tapLabel = this.language === 'tr' ? 'Çift dokun' : 'Double-tap';
    center.textContent = this.language === 'tr' ? 'Bir güç seç' : 'Choose a power';
    this.elements.wheel.appendChild(center);
  }

  async startCamera() {
    this.hideCameraError();
    this.audio.unlock();
    this.elements.startButton.disabled = true;
    this.elements.startButton.classList.add('is-loading');
    this.elements.startButton.querySelector('.button-text').textContent = this.language === 'tr' ? 'Kamera hazırlanıyor…' : 'Preparing camera…';
    try {
      await this.handTracker?.stop();
      this.handTracker = null;
      await this.stopMediaTracks();
      const lowQuality = this.settings.cameraQuality === 'low';
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: this.settings.facingMode },
          width: { ideal: lowQuality ? 640 : 1280 },
          height: { ideal: lowQuality ? 480 : 720 },
          frameRate: { ideal: lowQuality ? 24 : 30, max: 60 }
        },
        audio: false
      });
      this.elements.video.srcObject = this.stream;
      await new Promise((resolve) => {
        if (this.elements.video.readyState >= 2) resolve();
        else this.elements.video.addEventListener('loadedmetadata', resolve, { once: true });
      });
      await this.elements.video.play();
      this.showStudio();
      this.startEngines();
      this.monitorBrightness();
      if (this.settings.showTutorial && !localStorage.getItem(STORAGE_KEYS.tutorialSeen)) {
        window.setTimeout(() => {
          this.openDialog(this.elements.tutorialDialog);
          localStorage.setItem(STORAGE_KEYS.tutorialSeen, '1');
        }, 700);
      }
    } catch (error) {
      this.showCameraError(this.cameraErrorMessage(error));
    } finally {
      this.elements.startButton.disabled = false;
      this.elements.startButton.classList.remove('is-loading');
      this.elements.startButton.querySelector('.button-text').textContent = UI_TEXT[this.language].startCamera;
    }
  }

  startEngines() {
    this.gesture.reset();
    this.gesture.setSettings(this.settings);
    this.trackingOverlay?.destroy();
    this.effectEngine?.destroy();
    this.trackingOverlay = new TrackingOverlay(this.elements.trackingCanvas, this.elements.video, this.elements.stage);
    this.effectEngine = new EffectEngine(this.elements.effectCanvas, this.elements.video, this.elements.stage, this.settings);
    this.recorder = new AirTapRecorder({
      video: this.elements.video,
      trackingCanvas: this.elements.trackingCanvas,
      effectCanvas: this.elements.effectCanvas,
      stage: this.elements.stage,
      getSettings: () => this.settings
    });
    this.handTracker = new HandTracker({
      quality: this.settings.cameraQuality,
      sensitivity: this.settings.trackingSensitivity,
      selfieMode: this.settings.mirror,
      onResults: (results, fps, now) => this.onHandResults(results, fps, now),
      onError: (error) => this.onTrackingError(error)
    });
    this.handTracker.start(this.elements.video).catch((error) => this.onTrackingError(error));
  }

  onHandResults(results, fps, now) {
    const landmarks = results.multiHandLandmarks?.[0] || null;
    const handedness = results.multiHandedness?.[0]?.label || null;
    this.snapshot = this.gesture.update(landmarks, handedness, now);
    this.trackingOverlay.draw(this.snapshot, this.settings);
    this.updateTrackingUi(fps);
    this.processGestureEvents();
    this.watchPerformance(fps, now);
  }

  processGestureEvents() {
    this.gesture.consumeEvents().forEach((event) => {
      if (event.type === 'menu-open') {
        this.elements.wheel.classList.remove('is-hidden');
        this.audio.tone(410, 0.1, 'sine', 0.11, 540);
      } else if (event.type === 'menu-close') {
        this.elements.wheel.classList.add('is-hidden');
        $$('.wheel-item', this.elements.wheel).forEach((item) => item.classList.remove('is-hovered', 'is-ready'));
      } else if (event.type === 'hover') {
        this.audio.tone(330 + event.index * 34, 0.045, 'sine', 0.035);
      } else if (event.type === 'air-tap') {
        this.audio.tone(event.count === 1 ? 610 : 820, 0.09, 'triangle', 0.13, event.count === 1 ? 720 : 1040);
        this.elements.wheel.dataset.taps = String(event.count);
        if (event.count === 1) this.elements.hint.textContent = this.language === 'tr' ? 'İlk dokunuş algılandı — bir kez daha ileri dokun' : 'First tap detected — tap forward once more';
      } else if (event.type === 'select') {
        this.selectEffect(event.index);
      } else if (event.type === 'fire') {
        this.launchEffect(event);
      }
    });
  }

  updateTrackingUi(fps) {
    const snapshot = this.snapshot;
    this.elements.fps.textContent = `${fps} FPS`;
    let status = this.copy.waiting;
    let hint = this.copy.openWheel;
    let state = 'waiting';
    if (snapshot.handPresent) {
      status = this.copy.detected;
      state = 'detected';
      if (snapshot.menuOpen) {
        hint = snapshot.tapCount === 1
          ? (this.language === 'tr' ? '1 / 2 — aynı efekte bir kez daha ileri dokun' : '1 / 2 — tap forward on the same effect again')
          : this.copy.choose;
      }
      else if (snapshot.readyToFire) { status = this.copy.ready; state = 'ready'; hint = this.copy.push; }
      else if (snapshot.singleFinger) hint = this.language === 'tr' ? 'Harika, biraz sabit tut…' : 'Great, hold it steady…';
      else if (snapshot.openPalm) hint = this.copy.push;
    }
    this.elements.status.dataset.state = state;
    this.elements.statusText.textContent = status;
    this.elements.hint.textContent = hint;
    this.updateAirTapSensor(snapshot);
    this.positionWheel(snapshot);
  }

  updateAirTapSensor(snapshot) {
    const sensor = this.elements.airTapSensor;
    if (!sensor) return;
    const visible = snapshot.handPresent && snapshot.menuOpen && snapshot.hoveredIndex >= 0;
    sensor.classList.toggle('is-visible', visible);
    const phase = snapshot.tapPhase || 'waiting';
    const progress = Math.round(clamp(snapshot.tapStrength || 0, 0, 1) * 100);
    sensor.dataset.phase = phase;
    this.elements.airTapSensorFill.style.width = `${progress}%`;
    this.elements.sensorAim.classList.toggle('is-active', phase === 'idle' || phase === 'waiting');
    this.elements.sensorPush.classList.toggle('is-active', phase === 'pressed');
    this.elements.sensorReturn.classList.toggle('is-active', phase === 'returning' || phase === 'cooldown');
    if (!visible) this.elements.airTapSensorText.textContent = 'Kameradaki işaret parmağın bekleniyor';
    else if (snapshot.tapCount === 1) this.elements.airTapSensorText.textContent = '1 / 2 algılandı · aynı noktaya bir kez daha dokun';
    else if (phase === 'pressed') this.elements.airTapSensorText.textContent = 'İleri hareket algılandı · şimdi parmağını geri çek';
    else if (phase === 'returning') this.elements.airTapSensorText.textContent = 'Geri dönüş doğrulanıyor…';
    else this.elements.airTapSensorText.textContent = 'Parmağını kameraya doğru kısa ve net biçimde it';
  }

  positionWheel(snapshot) {
    if (!snapshot.menuOpen || !snapshot.menuCenter) return;
    const point = mapPointToStage(snapshot.menuCenter, this.elements.video, this.elements.stage);
    const radius = Math.min(126, Math.max(102, this.elements.stage.clientWidth * 0.13));
    const x = clamp(point.x, radius + 12, this.elements.stage.clientWidth - radius - 12);
    const y = clamp(point.y, radius + 66, this.elements.stage.clientHeight - radius - 90);
    this.elements.wheel.style.left = `${x}px`;
    this.elements.wheel.style.top = `${y}px`;
    const items = $$('.wheel-item', this.elements.wheel);
    items.forEach((item, index) => {
      const active = index === snapshot.hoveredIndex;
      item.classList.toggle('is-hovered', active);
      item.classList.toggle('is-ready', active && snapshot.selectionReady);
      item.style.setProperty('--progress', active ? `${snapshot.hoverProgress * 360}deg` : '0deg');
    });
    this.elements.wheel.dataset.taps = String(snapshot.tapCount || 0);
    const centerLabel = $('.wheel-center-label', this.elements.wheel);
    if (centerLabel) {
      centerLabel.textContent = snapshot.hoveredIndex >= 0 ? getEffectName(EFFECTS[snapshot.hoveredIndex], this.language) : (this.language === 'tr' ? 'Bir güç seç' : 'Choose a power');
    }
  }

  selectEffect(index) {
    this.selectedEffectIndex = index;
    const effect = EFFECTS[index];
    if (this.settings.rememberEffect) localStorage.setItem(STORAGE_KEYS.selectedEffect, String(index));
    this.renderSelectedEffect();
    this.audio.select(effect.id);
    this.showToast(`${getEffectName(effect, this.language)} ${this.copy.selected}`, 'success', effect.icon);
  }

  renderSelectedEffect() {
    const effect = EFFECTS[this.selectedEffectIndex];
    this.elements.selectedIcon.textContent = effect.icon;
    this.elements.selectedIcon.style.setProperty('--effect-color', effect.color);
    this.elements.selectedName.textContent = getEffectName(effect, this.language);
    document.documentElement.style.setProperty('--selected-effect', effect.color);
  }

  launchEffect(event) {
    if (!this.effectEngine) return;
    const effect = EFFECTS[this.selectedEffectIndex];
    this.effectEngine.fire(effect, event.palm, event.landmarks);
    this.elements.stage.dataset.activeEffect = effect.id;
    this.elements.stage.classList.remove('cinematic-burst');
    void this.elements.stage.offsetWidth;
    this.elements.stage.classList.add('cinematic-burst');
    this.audio.fire(effect.id);
    this.elements.status.dataset.state = 'fired';
    this.elements.statusText.textContent = this.copy.fired;
    if (this.settings.screenShake && !this.settings.reduceMotion) {
      this.elements.stage.classList.remove('camera-shake');
      void this.elements.stage.offsetWidth;
      this.elements.stage.classList.add('camera-shake');
    }
    if (this.settings.vibration && navigator.vibrate) navigator.vibrate(35);
  }

  async closeCamera() {
    if (this.recorder?.recording) await this.stopRecording();
    await this.handTracker?.stop();
    this.handTracker = null;
    this.trackingOverlay?.destroy();
    this.trackingOverlay = null;
    this.effectEngine?.destroy();
    this.effectEngine = null;
    await this.stopMediaTracks();
    this.elements.wheel.classList.add('is-hidden');
    this.elements.studio.classList.add('is-hidden');
    this.elements.landing.classList.remove('is-hidden');
    document.body.classList.remove('camera-active');
  }

  async stopMediaTracks() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.microphoneStream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.microphoneStream = null;
    if (this.elements.video) this.elements.video.srcObject = null;
  }

  showStudio() {
    this.elements.landing.classList.add('is-hidden');
    this.elements.studio.classList.remove('is-hidden');
    document.body.classList.add('camera-active');
    this.applyVideoMirror();
  }

  applyVideoMirror() {
    this.elements.video.classList.toggle('is-mirrored', this.settings.mirror);
  }

  async switchCamera() {
    this.settings.facingMode = this.settings.facingMode === 'user' ? 'environment' : 'user';
    this.settings.mirror = this.settings.facingMode === 'user';
    saveSettings(this.settings);
    this.populateSettingsForm();
    await this.startCamera();
  }

  async capturePhoto() {
    if (!this.recorder) return;
    try {
      await this.recorder.capturePhoto();
      this.audio.success();
      this.showToast(this.copy.photoSaved, 'success', '📸');
    } catch {
      this.showToast(this.language === 'tr' ? 'Fotoğraf oluşturulamadı.' : 'Photo could not be created.', 'error');
    }
  }

  async toggleRecording() {
    if (!this.recorder) return;
    if (this.recorder.recording) await this.stopRecording();
    else await this.startRecording();
  }

  async startRecording() {
    try {
      for (let count = 3; count >= 1; count -= 1) {
        this.elements.countdown.textContent = String(count);
        this.elements.countdown.classList.remove('is-hidden');
        await new Promise((resolve) => setTimeout(resolve, 650));
      }
      this.elements.countdown.classList.add('is-hidden');
      if (this.settings.includeMicrophone && !this.microphoneStream) {
        this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }
      await this.recorder.start(this.microphoneStream);
      this.elements.recordButton.classList.add('is-recording');
      this.elements.recordButton.setAttribute('aria-label', this.language === 'tr' ? 'Kaydı durdur' : 'Stop recording');
      this.recordingTimer = window.setInterval(() => {
        this.elements.recordTime.textContent = formatTime(performance.now() - this.recorder.startedAt);
      }, 250);
    } catch (error) {
      this.elements.countdown.classList.add('is-hidden');
      this.showToast(error.message || (this.language === 'tr' ? 'Kayıt başlatılamadı.' : 'Recording could not start.'), 'error');
    }
  }

  async stopRecording() {
    clearInterval(this.recordingTimer);
    this.elements.recordTime.textContent = '';
    this.elements.recordButton.classList.remove('is-recording');
    this.recordingBlob = await this.recorder.stop();
    this.microphoneStream?.getTracks().forEach((track) => track.stop());
    this.microphoneStream = null;
    if (!this.recordingBlob) return;
    this.elements.previewVideo.src = URL.createObjectURL(this.recordingBlob);
    this.openDialog(this.elements.previewDialog);
  }

  async toggleMicrophone() {
    this.settings.includeMicrophone = !this.settings.includeMicrophone;
    if (this.settings.includeMicrophone) {
      try {
        this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch {
        this.settings.includeMicrophone = false;
        this.showToast(this.language === 'tr' ? 'Mikrofon izni verilmedi.' : 'Microphone permission was not granted.', 'error');
      }
    } else {
      this.microphoneStream?.getTracks().forEach((track) => track.stop());
      this.microphoneStream = null;
    }
    this.elements.micButton.classList.toggle('is-active', this.settings.includeMicrophone);
    saveSettings(this.settings);
    this.populateSettingsForm();
  }

  openSettings() {
    this.elements.settingsPanel.classList.add('is-open');
    this.elements.settingsBackdrop.classList.remove('is-hidden');
    this.elements.settingsPanel.removeAttribute('inert');
  }

  closeSettings() {
    this.elements.settingsPanel.classList.remove('is-open');
    this.elements.settingsBackdrop.classList.add('is-hidden');
    this.elements.settingsPanel.setAttribute('inert', '');
  }

  populateSettingsForm() {
    $$('[data-setting]', this.elements.settingsForm).forEach((input) => {
      const key = input.dataset.setting;
      if (!(key in this.settings)) return;
      if (input.type === 'checkbox') input.checked = Boolean(this.settings[key]);
      else input.value = String(this.settings[key]);
      const output = input.closest('.setting-row')?.querySelector('.range-value');
      if (output) output.value = input.type === 'range' ? `${input.value}%` : input.value;
    });
  }

  onSettingInput(event) {
    const input = event.target.closest('[data-setting]');
    if (!input) return;
    const key = input.dataset.setting;
    let value = input.type === 'checkbox' ? input.checked : input.value;
    if (input.type === 'range' || input.type === 'number') value = Number(value);
    this.settings[key] = value;
    const output = input.closest('.setting-row')?.querySelector('.range-value');
    if (output) output.value = `${value}%`;
    saveSettings(this.settings);
    this.applySettings(key === 'language');
  }

  applySettings(rerenderLanguage = true) {
    this.language = this.settings.language;
    this.copy = TEXT[this.language] || TEXT.tr;
    document.documentElement.lang = this.language;
    document.documentElement.dataset.theme = this.settings.theme;
    document.body.classList.toggle('reduce-motion', this.settings.reduceMotion);
    this.audio.setSettings(this.settings);
    this.gesture.setSettings(this.settings);
    this.effectEngine?.setSettings(this.settings);
    this.handTracker?.updateSettings({ quality: this.settings.cameraQuality, sensitivity: this.settings.trackingSensitivity, selfieMode: this.settings.mirror });
    this.applyVideoMirror();
    this.elements.fps.classList.toggle('is-hidden', !this.settings.developerMode);
    this.elements.micButton.classList.toggle('is-active', this.settings.includeMicrophone);
    if (rerenderLanguage) {
      this.translateUi();
      this.renderEffectWheel();
      this.renderSelectedEffect();
    }
  }

  resetSettings() {
    this.settings = { ...DEFAULT_SETTINGS };
    saveSettings(this.settings);
    this.populateSettingsForm();
    this.applySettings();
    this.showToast(this.language === 'tr' ? 'Ayarlar varsayılana döndü.' : 'Default settings restored.', 'success');
  }

  translateUi() {
    const ui = UI_TEXT[this.language];
    $$('[data-i18n]').forEach((element) => {
      const value = ui[element.dataset.i18n];
      if (value) element.textContent = value;
    });
    $$('[data-i18n-aria]').forEach((element) => {
      const value = ui[element.dataset.i18nAria];
      if (value) element.setAttribute('aria-label', value);
    });
  }

  startCalibration() {
    this.calibrationStep = 0;
    this.calibrationBase = null;
    this.renderCalibration();
    this.openDialog(this.elements.calibrationDialog);
  }

  advanceCalibration() {
    if (!this.stream) {
      this.showToast(this.language === 'tr' ? 'Önce kamerayı başlat.' : 'Start the camera first.', 'error');
      return;
    }
    if (this.calibrationStep === 0) {
      if (!this.snapshot.handPresent) {
        this.showToast(this.language === 'tr' ? 'Elini kameraya göster.' : 'Show your hand to the camera.', 'error');
        return;
      }
      this.calibrationBase = this.snapshot.handScale;
    } else if (this.calibrationStep === 1) {
      if (!this.snapshot.handPresent || !this.calibrationBase) return;
      const measuredRatio = this.snapshot.handScale / this.calibrationBase;
      if (measuredRatio < 1.06) {
        this.showToast(this.language === 'tr' ? 'Elini biraz daha kameraya yaklaştır ve Sonraki’ye bas.' : 'Move closer to the camera and press Next.', 'error');
        return;
      }
      this.settings.calibrationPushRatio = clamp(1 + (measuredRatio - 1) * 0.55, 1.065, 1.17);
      saveSettings(this.settings);
      this.gesture.setSettings(this.settings);
    }
    this.calibrationStep += 1;
    if (this.calibrationStep > 2) {
      this.closeDialog(this.elements.calibrationDialog);
      this.audio.success();
      this.showToast(this.language === 'tr' ? 'Kalibrasyon tamamlandı.' : 'Calibration complete.', 'success');
      return;
    }
    this.renderCalibration();
  }

  renderCalibration() {
    const steps = this.language === 'tr' ? [
      ['1. Normal uzaklık', 'Açık avucunu normal kullanım uzaklığında tut. El algılandığında Sonraki’ye bas.'],
      ['2. İleri itiş', 'Elini kameraya doğru yaklaştır ve yakın konumdayken Sonraki’ye bas.'],
      ['3. Kontrol', 'İşaret parmağını kaldırıp çarkı açmayı dene. Hazırsan Tamamla’ya bas.']
    ] : [
      ['1. Normal distance', 'Hold an open palm at your usual distance. Press Next when detected.'],
      ['2. Forward push', 'Move your hand closer to the camera and press Next while it is close.'],
      ['3. Check', 'Raise your index finger and try opening the wheel. Press Finish when ready.']
    ];
    const [title, text] = steps[this.calibrationStep];
    this.elements.calibrationTitle.textContent = title;
    this.elements.calibrationText.textContent = text;
    this.elements.calibrationProgress.style.width = `${((this.calibrationStep + 1) / 3) * 100}%`;
    this.elements.calibrationNext.textContent = this.calibrationStep === 2 ? UI_TEXT[this.language].finish : UI_TEXT[this.language].next;
  }

  async sendFeedback(event) {
    event.preventDefault();
    const formData = new FormData(this.elements.feedbackForm);
    const payload = Object.fromEntries(formData.entries());
    payload.rating = Number(payload.rating || 0);
    try {
      const response = await fetch('../backend/api.php?action=feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || this.copy.databaseUnavailable);
      this.elements.feedbackForm.reset();
      this.closeDialog(this.elements.feedbackDialog);
      this.showToast(this.copy.feedbackSent, 'success');
    } catch (error) {
      this.showToast(error.message || this.copy.databaseUnavailable, 'error');
    }
  }

  monitorBrightness() {
    window.clearInterval(this.brightnessTimer);
    this.brightnessTimer = window.setInterval(() => {
      if (!this.stream || document.hidden || this.elements.video.readyState < 2) return;
      const canvas = this.elements.brightnessCanvas;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(this.elements.video, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      for (let index = 0; index < data.length; index += 16) sum += data[index] * 0.21 + data[index + 1] * 0.72 + data[index + 2] * 0.07;
      const brightness = sum / (data.length / 16);
      if (brightness < 42 && Date.now() - this.lastDarkWarning > 12000) {
        this.lastDarkWarning = Date.now();
        this.showToast(this.copy.dark, 'warning', '☀️');
      }
    }, 2400);
  }

  watchPerformance(fps, now) {
    if (fps < 17) {
      if (!this.lowFpsSince) this.lowFpsSince = now;
      if (now - this.lowFpsSince > 5500) {
        this.lowFpsSince = now + 30000;
        this.showToast(this.copy.lowPerformance, 'warning', '⚙️');
      }
    } else {
      this.lowFpsSince = 0;
    }
  }

  onTrackingError(error) {
    console.error('AirTap tracking error:', error);
    if (!this.trackingErrorShown) {
      this.trackingErrorShown = true;
      this.showToast(this.language === 'tr' ? 'El takip modeli başlatılamadı. Sayfayı yenileyip tekrar dene.' : 'The hand model could not start. Refresh and try again.', 'error');
    }
  }

  cameraErrorMessage(error) {
    if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') return this.copy.permissionDenied;
    if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') return this.copy.noCamera;
    if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') return this.copy.busyCamera;
    return `${this.copy.cameraError} ${error?.message || ''}`.trim();
  }

  showCameraError(message) {
    this.elements.cameraErrorText.textContent = message;
    this.elements.cameraError.classList.remove('is-hidden');
  }

  hideCameraError() {
    this.elements.cameraError.classList.add('is-hidden');
  }

  showToast(message, type = 'info', icon = '') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.innerHTML = `${icon ? `<span aria-hidden="true">${icon}</span>` : ''}<span>${this.escapeHtml(message)}</span>`;
    this.elements.toastRegion.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => toast.remove(), 250);
    }, type === 'error' ? 6200 : 3800);
  }

  openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  escapeHtml(value) {
    const span = document.createElement('span');
    span.textContent = String(value);
    return span.innerHTML;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.airTap = new AirTapApp();
});
