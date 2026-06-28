/**
 * Constantes de la aplicación
 */

// Dimensiones del workspace
export const DEFAULT_WORKSPACE = {
  width: 50, // mm
  height: 30, // mm
  gridSmall: 1, // mm
  gridLarge: 5, // mm
  colorGridSmall: 'rgba(200, 200, 200, 0.2)',
  colorGridLarge: 'rgba(100, 100, 100, 0.4)',
};

// Tipos de objetos
export const OBJECT_TYPES = {
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  STAR: 'star',
  HEART: 'heart',
  TEXT: 'text',
  QRCODE: 'qrcode',
  IMAGE: 'image',
  PATH: 'path',
};

// Tipos de brocas
export const BIT_TYPES = {
  VBIT: 'v-bit',
  FLUTE: 'flute',
  BALL_END: 'ball-end',
};

// Tipos de operaciones CNC
export const OPERATION_TYPES = {
  POCKET: 'pocket',
  CONTOUR: 'contour',
  ENGRAVE: 'engrave',
};

// Parámetros CNC predeterminados
export const DEFAULT_CNC_PARAMS = {
  rpm: 8000,
  feedRate: 80,
  pluneRate: 30,
  depthPerPass: 0.2,
  maxDepth: 1,
  stepover: 0.5,
};

// Colores predefinidos
export const COLORS = {
  PRIMARY: '#3498db',
  SUCCESS: '#2ecc71',
  WARNING: '#f39c12',
  ERROR: '#e74c3c',
  DARK: '#1e1e1e',
  LIGHT: '#ecf0f1',
};
