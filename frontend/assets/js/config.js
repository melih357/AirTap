export const EFFECTS = [
  { id: 'web', name: { tr: 'Örümcek Ağı', en: 'Spider Web' }, short: 'Ağ', icon: '🕸️', color: '#e8f3ff', accent: '#78c7ff' },
  { id: 'fire', name: { tr: 'Alev Topu', en: 'Fireball' }, short: 'Alev', icon: '🔥', color: '#ff7a18', accent: '#ffd166' },
  { id: 'ice', name: { tr: 'Buz Işını', en: 'Ice Beam' }, short: 'Buz', icon: '❄️', color: '#73e7ff', accent: '#d9fbff' },
  { id: 'electric', name: { tr: 'Elektrik', en: 'Electricity' }, short: 'Elektrik', icon: '⚡', color: '#a78bfa', accent: '#67e8f9' },
  { id: 'laser', name: { tr: 'Lazer', en: 'Laser' }, short: 'Lazer', icon: '◉', color: '#ff3f81', accent: '#ff9fbd' },
  { id: 'energy', name: { tr: 'Enerji Topu', en: 'Energy Orb' }, short: 'Enerji', icon: '✦', color: '#22d3ee', accent: '#8b5cf6' }
];

export const DEFAULT_SETTINGS = {
  language: 'tr',
  theme: 'dark',
  facingMode: 'user',
  mirror: true,
  cameraQuality: 'high',
  handPreference: 'auto',
  trackingSensitivity: 62,
  tapSensitivity: 66,
  pushSensitivity: 62,
  menuHoldMs: 480,
  selectionMethod: 'doubleTap',
  effectQuality: 'high',
  particleDensity: 75,
  masterVolume: 72,
  effectVolume: 78,
  muted: false,
  screenShake: true,
  glow: true,
  vibration: true,
  reduceMotion: false,
  rememberEffect: true,
  showTutorial: true,
  includeMicrophone: false,
  developerMode: false,
  calibrationPushRatio: null
};

export const TEXT = {
  tr: {
    waiting: 'El bekleniyor', detected: 'El algılandı', ready: 'Hazır', fired: 'Atış!',
    openWheel: 'İşaret parmağını kaldır', choose: 'Efektin üzerinde parmağını kameraya doğru iki kez ileri–geri dokundur',
    push: 'Avucunu aç ve elini kameraya doğru hızlıca it', cameraError: 'Kamera başlatılamadı.',
    selected: 'seçildi', dark: 'Ortam karanlık görünüyor. Işığı biraz artır.',
    far: 'Elinin tamamını göster ve kameraya biraz yaklaş.', lowPerformance: 'Daha akıcı kullanım için düşük kaliteyi deneyebilirsin.',
    permissionDenied: 'AirTap’in elini görebilmesi için kamera izni gerekiyor. Adres çubuğundaki kamera simgesinden izni açıp tekrar dene.',
    noCamera: 'Bu cihazda kullanılabilir bir kamera bulunamadı.', busyCamera: 'Kamera başka bir uygulama tarafından kullanılıyor olabilir.',
    unsupported: 'Tarayıcın kamera özelliğini desteklemiyor. Güncel Chrome, Edge veya Safari kullan.',
    photoSaved: 'Fotoğraf indirildi.', recording: 'Kayıt yapılıyor', feedbackSent: 'Geri bildirimin ulaştı. Teşekkürler!',
    databaseUnavailable: 'Geri bildirim şu an gönderilemedi. WAMP ve veritabanını kontrol et.',
    fallbackHint: 'Çift dokunma zor gelirse Ayarlar bölümünden parmakla üzerinde bekleme yöntemini seçebilirsin.'
  },
  en: {
    waiting: 'Waiting for a hand', detected: 'Hand detected', ready: 'Ready', fired: 'Fire!',
    openWheel: 'Raise only your index finger', choose: 'Point at an effect and double-tap in the air',
    push: 'Open your palm and push it quickly toward the camera', cameraError: 'Camera could not be started.',
    selected: 'selected', dark: 'The scene looks dark. Add a little more light.',
    far: 'Show your whole hand and move a little closer.', lowPerformance: 'Try low quality for a smoother experience.',
    permissionDenied: 'AirTap needs camera permission to see your hand. Enable it from the camera icon in the address bar and try again.',
    noCamera: 'No usable camera was found on this device.', busyCamera: 'Another application may be using the camera.',
    unsupported: 'Your browser does not support camera access. Use a current Chrome, Edge, or Safari.',
    photoSaved: 'Photo downloaded.', recording: 'Recording', feedbackSent: 'Your feedback was sent. Thank you!',
    databaseUnavailable: 'Feedback could not be sent. Check WAMP and the database.',
    fallbackHint: 'If double-tapping is difficult, choose the finger dwell method in Settings.'
  }
};

export const STORAGE_KEYS = {
  settings: 'airtap.settings.v2',
  selectedEffect: 'airtap.selectedEffect.v2',
  tutorialSeen: 'airtap.tutorialSeen.v2'
};

export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}');
    const settings = { ...DEFAULT_SETTINGS, ...saved };
    if (!['doubleTap', 'dwell'].includes(settings.selectionMethod)) settings.selectionMethod = 'doubleTap';
    return settings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function getEffectName(effect, language = 'tr') {
  return effect.name[language] || effect.name.tr;
}
