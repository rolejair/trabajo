// Valores por defecto para objetos y parámetros

import { DEFAULT_CNC_PARAMS, BIT_TYPES, SHAPE_TYPES, OPERATION_TYPES, QR_ERROR_CORRECTION } from './constants.js';

export const DEFAULT_BIT = {
  id: 'vbit-30-03',
  name: 'V-Bit 30° 0.3mm',
  type: BIT_TYPES.V_BIT,
  diameter: 0.3, // mm
  angle: 30, // degrees
  flutes: 2,
  maxRPM: 12000,
};

export const DEFAULT_OPERATION = {
  type: OPERATION_TYPES.CONTOUR,
  depthPerPass: DEFAULT_CNC_PARAMS.depthPerPass,
  pluneRate: DEFAULT_CNC_PARAMS.pluneRate,
  feedRate: DEFAULT_CNC_PARAMS.feedRate,
  rpm: DEFAULT_CNC_PARAMS.rpm,
  maxDepth: DEFAULT_CNC_PARAMS.maxDepth,
  stepover: 0.1, // mm
  safetyHeight: DEFAULT_CNC_PARAMS.safetyHeight,
  checkForCollisions: true,
};

export const DEFAULT_SHAPE = {
  [SHAPE_TYPES.CIRCLE]: {
    radius: 5,
    x: 25,
    y: 15,
  },
  [SHAPE_TYPES.RECTANGLE]: {
    width: 10,
    height: 8,
    x: 20,
    y: 11,
  },
  [SHAPE_TYPES.HEART]: {
    size: 8,
    x: 25,
    y: 15,
  },
  [SHAPE_TYPES.STAR]: {
    size: 8,
    points: 5,
    x: 25,
    y: 15,
  },
};

export const DEFAULT_TEXT = {
  content: 'Texto',
  font: 'Roboto',
  fontSize: 12,
  weight: 400,
  x: 10,
  y: 15,
  color: '#000000',
  strokeWidth: 0.2,
};

export const DEFAULT_QRCODE = {
  content: 'https://example.com',
  size: 20, // mm
  errorCorrection: QR_ERROR_CORRECTION.M,
  x: 15,
  y: 5,
};

export const DEFAULT_IMAGE = {
  width: 20,
  height: 20,
  x: 15,
  y: 5,
  threshold: 128,
  turnPolicy: 'minority',
};

export const BIT_DATABASE = [
  {
    id: 'vbit-30-03',
    name: 'V-Bit 30° 0.3mm',
    type: BIT_TYPES.V_BIT,
    diameter: 0.3,
    angle: 30,
    flutes: 2,
    maxRPM: 12000,
  },
  {
    id: 'vbit-60-05',
    name: 'V-Bit 60° 0.5mm',
    type: BIT_TYPES.V_BIT,
    diameter: 0.5,
    angle: 60,
    flutes: 2,
    maxRPM: 12000,
  },
  {
    id: 'vbit-90-1',
    name: 'V-Bit 90° 1mm',
    type: BIT_TYPES.V_BIT,
    diameter: 1,
    angle: 90,
    flutes: 2,
    maxRPM: 12000,
  },
  {
    id: 'flat-1',
    name: 'Flauta 1mm',
    type: BIT_TYPES.FLAT_END_MILL,
    diameter: 1,
    flutes: 2,
    maxRPM: 12000,
  },
  {
    id: 'flat-2',
    name: 'Flauta 2mm',
    type: BIT_TYPES.FLAT_END_MILL,
    diameter: 2,
    flutes: 2,
    maxRPM: 10000,
  },
  {
    id: 'flat-3',
    name: 'Flauta 3mm',
    type: BIT_TYPES.FLAT_END_MILL,
    diameter: 3,
    flutes: 2,
    maxRPM: 8000,
  },
  {
    id: 'ball-1',
    name: 'Ball End 1mm',
    type: BIT_TYPES.BALL_END_MILL,
    diameter: 1,
    flutes: 2,
    maxRPM: 12000,
  },
  {
    id: 'ball-2',
    name: 'Ball End 2mm',
    type: BIT_TYPES.BALL_END_MILL,
    diameter: 2,
    flutes: 2,
    maxRPM: 10000,
  },
];
