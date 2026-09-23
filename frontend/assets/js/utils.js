export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function mapPointToStage(point, video, stage) {
  const stageWidth = stage.clientWidth || 1;
  const stageHeight = stage.clientHeight || 1;
  const videoWidth = video.videoWidth || 1280;
  const videoHeight = video.videoHeight || 720;
  const scale = Math.max(stageWidth / videoWidth, stageHeight / videoHeight);
  const shownWidth = videoWidth * scale;
  const shownHeight = videoHeight * scale;
  const offsetX = (stageWidth - shownWidth) / 2;
  const offsetY = (stageHeight - shownHeight) / 2;
  return {
    x: point.x * shownWidth + offsetX,
    y: point.y * shownHeight + offsetY
  };
}

export function palmCenter(landmarks) {
  const ids = [0, 5, 9, 13, 17];
  const total = ids.reduce((sum, id) => ({
    x: sum.x + landmarks[id].x,
    y: sum.y + landmarks[id].y,
    z: sum.z + (landmarks[id].z || 0)
  }), { x: 0, y: 0, z: 0 });
  return { x: total.x / ids.length, y: total.y / ids.length, z: total.z / ids.length };
}

export function handScale(landmarks) {
  const xs = landmarks.map((point) => point.x);
  const ys = landmarks.map((point) => point.y);
  return Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
}

export function smoothLandmarks(previous, current, factor = 0.58) {
  if (!previous || previous.length !== current.length) return current.map((point) => ({ ...point }));
  return current.map((point, index) => ({
    x: lerp(previous[index].x, point.x, factor),
    y: lerp(previous[index].y, point.y, factor),
    z: lerp(previous[index].z || 0, point.z || 0, factor)
  }));
}

export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function debounce(callback, delay = 180) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}
