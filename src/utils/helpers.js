// Funciones auxiliares y utilidades

import { BIT_TYPES, OPERATION_TYPES } from './constants.js';

/**
 * Calcula el stepover óptimo basado en el diámetro de la broca y tamaño del objeto
 * @param {number} bitDiameter - Diámetro de la broca en mm
 * @param {number} objectWidth - Ancho del objeto en mm
 * @param {number} objectHeight - Alto del objeto en mm
 * @param {number} maxDepth - Profundidad máxima en mm
 * @returns {number} Stepover en mm
 */
export function calculateOptimalStepover(bitDiameter, objectWidth, objectHeight, maxDepth) {
  // Para pocket: el stepover no puede ser mayor que el diámetro
  let stepover = bitDiameter * 0.5; // 50% del diámetro como base
  
  // Asegurar que la broca quepa en el objeto
  if (bitDiameter > Math.min(objectWidth, objectHeight)) {
    stepover = Math.min(objectWidth, objectHeight) * 0.3;
  }
  
  // Limitar stepover máximo al 80% del diámetro
  stepover = Math.min(stepover, bitDiameter * 0.8);
  
  // Mínimo 0.1mm para precisión
  stepover = Math.max(stepover, 0.1);
  
  return parseFloat(stepover.toFixed(2));
}

/**
 * Calcula el ancho de corte basado en el tipo de broca, ángulo y profundidad
 * @param {Object} bit - Objeto broca
 * @param {number} depth - Profundidad de corte en mm
 * @returns {number} Ancho de corte en mm
 */
export function calculateCutWidth(bit, depth) {
  if (bit.type === BIT_TYPES.V_BIT && bit.angle) {
    // Para V-bit: ancho = 2 * profundidad * tan(ángulo/2)
    const angleRad = (bit.angle / 2) * (Math.PI / 180);
    return 2 * depth * Math.tan(angleRad);
  }
  // Para flat end: el ancho es el diámetro
  return bit.diameter;
}

/**
 * Valida si una broca cabe en un objeto para pocket
 * @param {Object} bit - Objeto broca
 * @param {number} objectWidth - Ancho del objeto
 * @param {number} objectHeight - Alto del objeto
 * @returns {boolean} True si cabe
 */
export function canBitFitInObject(bit, objectWidth, objectHeight) {
  const minDimension = Math.min(objectWidth, objectHeight);
  return bit.diameter <= minDimension * 0.9; // 90% del tamaño mínimo
}

/**
 * Convierte coordenadas de canvas a coordenadas CNC
 * @param {number} canvasX - Posición X en canvas
 * @param {number} canvasY - Posición Y en canvas
 * @param {number} scale - Factor de escala (pixels/mm)
 * @param {number} workspaceWidth - Ancho del workspace en mm
 * @param {number} workspaceHeight - Alto del workspace en mm
 * @returns {Object} {x, y} en coordenadas CNC (mm)
 */
export function canvasToCNC(canvasX, canvasY, scale, workspaceWidth, workspaceHeight) {
  return {
    x: parseFloat((canvasX / scale).toFixed(3)),
    y: parseFloat((workspaceHeight - (canvasY / scale)).toFixed(3)),
  };
}

/**
 * Convierte coordenadas CNC a coordenadas de canvas
 * @param {number} cncX - Posición X en CNC
 * @param {number} cncY - Posición Y en CNC
 * @param {number} scale - Factor de escala (pixels/mm)
 * @param {number} workspaceHeight - Alto del workspace en mm
 * @returns {Object} {x, y} en coordenadas de canvas
 */
export function cncToCanvas(cncX, cncY, scale, workspaceHeight) {
  return {
    x: parseFloat((cncX * scale).toFixed(1)),
    y: parseFloat(((workspaceHeight - cncY) * scale).toFixed(1)),
  };
}

/**
 * Calcula la distancia entre dos puntos
 * @param {number} x1 - Primera X
 * @param {number} y1 - Primera Y
 * @param {number} x2 - Segunda X
 * @param {number} y2 - Segunda Y
 * @returns {number} Distancia en la misma unidad
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcula el área de un objeto
 * @param {Object} obj - Objeto con propiedades de forma
 * @returns {number} Área en mm²
 */
export function calculateArea(obj) {
  if (obj.type === 'circle') {
    return Math.PI * obj.radius * obj.radius;
  }
  if (obj.type === 'rectangle') {
    return obj.width * obj.height;
  }
  // Aproximación para otras formas
  return 0;
}

/**
 * Limpia una ruta G-code eliminando comandos redundantes
 * @param {string} gcode - Código G
 * @returns {string} Código G limpio
 */
export function optimizeGCode(gcode) {
  const lines = gcode.split('\n');
  const optimized = [];
  let lastCommand = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(';')) {
      optimized.push(trimmed);
      continue;
    }
    // Evitar comandos duplicados consecutivos
    if (trimmed !== lastCommand) {
      optimized.push(trimmed);
      lastCommand = trimmed;
    }
  }
  
  return optimized.join('\n');
}

/**
 * Genera un timestamp legible
 * @returns {string} Timestamp formateado
 */
export function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Redondea a un número específico de decimales
 * @param {number} value - Valor a redondear
 * @param {number} decimals - Número de decimales
 * @returns {number} Valor redondeado
 */
export function round(value, decimals = 3) {
  return parseFloat(value.toFixed(decimals));
}

/**
 * Valida un número dentro de rango
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Valor válido
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Crea un ID único
 * @returns {string} ID único
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
