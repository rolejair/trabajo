import { BIT_TYPES } from '../../utils/constants.js';
import { calculateOptimalStepover, calculateCutWidth, canBitFitInObject, round, clamp } from '../../utils/helpers.js';

/**
 * Calculadora de parámetros CNC
 */
export class CNCCalculator {
  /**
   * Valida si una broca cabe en un objeto
   */
  static validateBitFit(bit, objectWidth, objectHeight) {
    return canBitFitInObject(bit, objectWidth, objectHeight);
  }

  /**
   * Calcula el stepover óptimo
   */
  static calculateStepover(bit, objectWidth, objectHeight, maxDepth) {
    return calculateOptimalStepover(bit.diameter, objectWidth, objectHeight, maxDepth);
  }

  /**
   * Calcula el ancho de corte
   */
  static calculateCutWidth(bit, depth) {
    return calculateCutWidth(bit, depth);
  }

  /**
   * Calcula el número de passes necesarios
   */
  static calculatePasses(maxDepth, depthPerPass) {
    if (maxDepth <= 0 || depthPerPass <= 0) return 0;
    return Math.ceil(maxDepth / depthPerPass);
  }

  /**
   * Calcula la profundidad de cada pass
   */
  static calculatePassDepths(maxDepth, depthPerPass) {
    const passes = this.calculatePasses(maxDepth, depthPerPass);
    const depths = [];
    let accumulated = 0;

    for (let i = 0; i < passes; i++) {
      const depth = Math.min(depthPerPass, maxDepth - accumulated);
      depths.push(round(depth, 3));
      accumulated += depth;
    }

    return depths;
  }

  /**
   * Valida parámetros CNC
   */
  static validateParameters(params) {
    const errors = [];

    if (params.rpm <= 0 || params.rpm > 12000) {
      errors.push('RPM debe estar entre 1 y 12000');
    }
    if (params.feedRate <= 0) {
      errors.push('Feed rate debe ser mayor a 0');
    }
    if (params.pluneRate <= 0) {
      errors.push('Plunge rate debe ser mayor a 0');
    }
    if (params.depthPerPass <= 0) {
      errors.push('Depth per pass debe ser mayor a 0');
    }
    if (params.maxDepth <= 0) {
      errors.push('Max depth debe ser mayor a 0');
    }
    if (params.stepover <= 0) {
      errors.push('Stepover debe ser mayor a 0');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calcula velocidad de corte (SFM -> RPM)
   * @param {number} sfm - Pies de superficie por minuto
   * @param {number} diameter - Diámetro de la broca en mm
   */
  static calculateRPMFromSFM(sfm, diameter) {
    // RPM = (SFM * 12) / (PI * D)
    const rpm = (sfm * 12) / (Math.PI * diameter);
    return Math.round(rpm);
  }

  /**
   * Calcula el tiempo estimado de corte
   */
  static estimateCuttingTime(totalDistance, feedRate) {
    // Tiempo = Distancia / VelocidadDeAvance
    return round(totalDistance / feedRate, 2);
  }

  /**
   * Valida colisión de herramienta
   */
  static checkCollision(bit, objectBounds, depth) {
    const cutWidth = this.calculateCutWidth(bit, depth);
    const minDimension = Math.min(objectBounds.width, objectBounds.height);
    return cutWidth <= minDimension * 0.9;
  }

  /**
   * Sugiere parámetros óptimos para un material
   */
  static suggestParameters(bit, material = 'wood') {
    const suggestions = {
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

    return suggestions[material] || suggestions.wood;
  }
}
