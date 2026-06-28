/**
 * Funciones auxiliares
 */

/**
 * Genera un UUID único
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Redondea un número a N decimales
 */
export function round(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Limita un número entre min y max
 */
export function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

/**
 * Obtiene timestamp formateado
 */
export function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Calcula stepover óptimo
 */
export function calculateOptimalStepover(diameter, width, height, maxDepth) {
  const minDim = Math.min(width, height);
  const maxStepover = diameter * 0.7;
  return clamp(maxStepover, diameter * 0.1, minDim * 0.5);
}

/**
 * Calcula ancho de corte para V-bit
 */
export function calculateCutWidth(bit, depth) {
  if (bit.type !== 'v-bit') return bit.diameter;
  const angle = bit.angle / 2;
  return 2 * depth * Math.tan((angle * Math.PI) / 180);
}

/**
 * Verifica si una broca cabe en un objeto
 */
export function canBitFitInObject(bit, width, height) {
  return bit.diameter <= width && bit.diameter <= height;
}

/**
 * Calcula distancia euclidiana
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convierte grados a radianes
 */
export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Convierte radianes a grados
 */
export function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}
