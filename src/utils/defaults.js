import { BIT_TYPES } from './constants.js';

/**
 * Base de datos predefinida de brocas
 */
export const BIT_DATABASE = [
  {
    id: 'vbit-30',
    name: 'V-Bit 30°',
    type: BIT_TYPES.VBIT,
    diameter: 3.175,
    angle: 30,
    flutes: 1,
    material: 'tungsten',
  },
  {
    id: 'vbit-60',
    name: 'V-Bit 60°',
    type: BIT_TYPES.VBIT,
    diameter: 3.175,
    angle: 60,
    flutes: 1,
    material: 'tungsten',
  },
  {
    id: 'vbit-90',
    name: 'V-Bit 90°',
    type: BIT_TYPES.VBIT,
    diameter: 3.175,
    angle: 90,
    flutes: 1,
    material: 'tungsten',
  },
  {
    id: 'flute-1mm',
    name: 'Flauta 1mm',
    type: BIT_TYPES.FLUTE,
    diameter: 1.0,
    angle: 0,
    flutes: 2,
    material: 'hss',
  },
  {
    id: 'flute-2mm',
    name: 'Flauta 2mm',
    type: BIT_TYPES.FLUTE,
    diameter: 2.0,
    angle: 0,
    flutes: 2,
    material: 'hss',
  },
  {
    id: 'flute-3mm',
    name: 'Flauta 3mm',
    type: BIT_TYPES.FLUTE,
    diameter: 3.0,
    angle: 0,
    flutes: 2,
    material: 'hss',
  },
  {
    id: 'ball-1mm',
    name: 'Ball End 1mm',
    type: BIT_TYPES.BALL_END,
    diameter: 1.0,
    angle: 0,
    flutes: 2,
    material: 'hss',
  },
  {
    id: 'ball-2mm',
    name: 'Ball End 2mm',
    type: BIT_TYPES.BALL_END,
    diameter: 2.0,
    angle: 0,
    flutes: 2,
    material: 'hss',
  },
];

/**
 * Parámetros CNC recomendados por material
 */
export const RECOMMENDED_PARAMS = {
  wood: {
    rpm: 8000,
    feedRate: 80,
    pluneRate: 30,
    depthPerPass: 0.1,
  },
  plastic: {
    rpm: 6000,
    feedRate: 50,
    pluneRate: 20,
    depthPerPass: 0.08,
  },
  aluminum: {
    rpm: 3000,
    feedRate: 40,
    pluneRate: 15,
    depthPerPass: 0.05,
  },
  pcb: {
    rpm: 12000,
    feedRate: 100,
    pluneRate: 20,
    depthPerPass: 0.05,
  },
};
