// Constantes globales de la aplicación

export const DEFAULT_WORKSPACE = {
  width: 50, // mm
  height: 30, // mm
  gridSmall: 1, // mm
  gridLarge: 5, // mm
  colorGridSmall: 'rgba(200, 200, 200, 0.2)',
  colorGridLarge: 'rgba(100, 100, 100, 0.4)',
};

export const DEFAULT_CNC_PARAMS = {
  depthPerPass: 0.05, // mm
  pluneRate: 20, // mm/min
  feedRate: 100, // mm/min
  rpm: 10000,
  maxDepth: 0.15, // mm
  safetyHeight: 5, // mm
};

export const BIT_TYPES = {
  V_BIT: 'v-bit',
  FLAT_END_MILL: 'flat-end',
  BALL_END_MILL: 'ball-end',
  FLUTE_BIT: 'flute-bit',
};

export const OPERATION_TYPES = {
  POCKET: 'pocket',
  CONTOUR: 'contour',
  ENGRAVE: 'engrave',
};

export const SHAPE_TYPES = {
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  HEART: 'heart',
  STAR: 'star',
  POLYGON: 'polygon',
  TEXT: 'text',
  IMAGE: 'image',
  QRCODE: 'qrcode',
  PATH: 'path',
};

export const ZOOM_LEVELS = {
  MIN: 0.1,
  MAX: 10,
  STEP: 0.1,
};

export const CANDLE_COMPATIBLE = {
  format: 'gcode',
  units: 'mm',
  lineNumbers: false,
  comments: true,
};

export const ROBOTO_FONT_URL = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';

export const QR_ERROR_CORRECTION = {
  L: 'L', // 7%
  M: 'M', // 15%
  Q: 'Q', // 25%
  H: 'H', // 30%
};
