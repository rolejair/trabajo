import { CNCCalculator } from './CNCCalculator.js';
import { GRBLOptimizer } from './GRBLOptimizer.js';
import { round, getTimestamp } from '../../utils/helpers.js';
import { DEFAULT_CNC_PARAMS } from '../../utils/defaults.js';

/**
 * Generador de G-code compatible con GRBL y Candle
 */
export class GCodeGenerator {
  constructor(config = {}) {
    this.config = {
      ...DEFAULT_CNC_PARAMS,
      ...config,
    };
    this.gcode = [];
    this.safetyHeight = config.safetyHeight || 5; // mm
  }

  /**
   * Genera G-code completo para un proyecto
   */
  generate(objects, bit, operations) {
    this.gcode = [];

    // Encabezado
    this._addHeader();
    this._addComments();
    this._addSetup(bit);

    // Procesar cada operación
    for (const op of operations) {
      const obj = objects.find((o) => o.id === op.objectId);
      if (!obj) continue;

      if (op.type === 'pocket') {
        this._generatePocket(obj, op, bit);
      } else if (op.type === 'contour') {
        this._generateContour(obj, op, bit);
      } else if (op.type === 'engrave') {
        this._generateEngrave(obj, op, bit);
      }
    }

    // Finalización
    this._addFooter();

    return this.gcode.join('\n');
  }

  _addHeader() {
    this.gcode.push('(CNC Design Pro - G-code generated)');
    this.gcode.push(`(Generated: ${getTimestamp()})`);
    this.gcode.push('(Compatible with GRBL 1.1+)');
    this.gcode.push('');
    this.gcode.push('G90 ; Absolute positioning');
    this.gcode.push('G21 ; Metric units (mm)');
    this.gcode.push('G54 ; Select coordinate system 1');
  }

  _addComments() {
    this.gcode.push('(---------- CONFIGURATION ----------)');
    this.gcode.push(`(Spindle Speed: ${this.config.rpm} RPM)`);
    this.gcode.push(`(Feed Rate: ${this.config.feedRate} mm/min)`);
    this.gcode.push(`(Plunge Rate: ${this.config.pluneRate} mm/min)`);
    this.gcode.push(`(Depth per Pass: ${this.config.depthPerPass} mm)`);
    this.gcode.push(`(Max Depth: ${this.config.maxDepth} mm)`);
    this.gcode.push(`(Safety Height: ${this.safetyHeight} mm)`);
    this.gcode.push('(-------------------------------------)');
    this.gcode.push('');
  }

  _addSetup(bit) {
    this.gcode.push('(Set spindle speed and start)');
    this.gcode.push(`S${this.config.rpm}`);
    this.gcode.push('M3 ; Spindle on (clockwise)');
    this.gcode.push('G4 P1 ; Wait 1 second');
    this.gcode.push('');
    this.gcode.push('(Move to safe height)');
    this.gcode.push(`G0 Z${this.safetyHeight}`);
    this.gcode.push('');
  }

  _generatePocket(obj, op, bit) {
    this.gcode.push(`(========== POCKET: ${obj.name} ==========)`);
    const bounds = obj.getBounds();

    // Validación
    const fits = CNCCalculator.validateBitFit(bit, bounds.width, bounds.height);
    if (!fits) {
      this.gcode.push('(WARNING: Bit may not fit in object)');
    }

    // Generar path de pocket
    const stepover = op.stepover || CNCCalculator.calculateStepover(
      bit,
      bounds.width,
      bounds.height,
      op.maxDepth
    );

    const path = GRBLOptimizer.generatePocketPath(bounds, stepover, bit.diameter);
    const depths = CNCCalculator.calculatePassDepths(op.maxDepth, op.depthPerPass);

    // Mover a posición inicial
    this.gcode.push(`(Move to start position)`);
    this.gcode.push(`G0 X${round(bounds.minX, 3)} Y${round(bounds.minY, 3)}`);
    this.gcode.push('');

    // Generar pasadas de profundidad
    let currentZ = 0;
    for (let passIndex = 0; passIndex < depths.length; passIndex++) {
      currentZ -= depths[passIndex];
      this.gcode.push(`(Pass ${passIndex + 1}/${depths.length} - Depth: ${round(Math.abs(currentZ), 3)}mm)`);

      // Primera pasada: plunge rate
      if (passIndex === 0) {
        this.gcode.push(`G1 Z0 F${this.config.pluneRate}`);
      }

      // Generar movimientos del path
      for (let i = 0; i < path.length; i++) {
        const point = path[i];
        if (i === 0) {
          this.gcode.push(`G1 Z${round(currentZ, 3)} F${this.config.pluneRate}`);
        }
        this.gcode.push(`G1 X${point.x} Y${point.y} F${this.config.feedRate}`);
      }
      this.gcode.push('');
    }

    // Retorno a altura segura
    this.gcode.push(`G0 Z${this.safetyHeight}`);
    this.gcode.push('');
  }

  _generateContour(obj, op, bit) {
    this.gcode.push(`(========== CONTOUR: ${obj.name} ==========)`);
    const bounds = obj.getBounds();

    // Generar contorno
    const contourPath = this._generateContourFromObject(obj);
    const depths = CNCCalculator.calculatePassDepths(op.maxDepth, op.depthPerPass);

    // Mover a posición inicial
    if (contourPath.length > 0) {
      const startPoint = contourPath[0];
      this.gcode.push(`G0 X${round(startPoint.x, 3)} Y${round(startPoint.y, 3)}`);
      this.gcode.push('');
    }

    // Generar pasadas
    let currentZ = 0;
    for (let passIndex = 0; passIndex < depths.length; passIndex++) {
      currentZ -= depths[passIndex];
      this.gcode.push(`(Pass ${passIndex + 1}/${depths.length} - Depth: ${round(Math.abs(currentZ), 3)}mm)`);

      for (let i = 0; i < contourPath.length; i++) {
        const point = contourPath[i];
        if (i === 0) {
          this.gcode.push(`G1 Z0 F${this.config.pluneRate}`);
          this.gcode.push(`G1 Z${round(currentZ, 3)} F${this.config.pluneRate}`);
        }
        this.gcode.push(`G1 X${round(point.x, 3)} Y${round(point.y, 3)} F${this.config.feedRate}`);
      }
      this.gcode.push('');
    }

    this.gcode.push(`G0 Z${this.safetyHeight}`);
    this.gcode.push('');
  }

  _generateEngrave(obj, op, bit) {
    this.gcode.push(`(========== ENGRAVE: ${obj.name} ==========)`);
    const path = this._generateContourFromObject(obj);

    if (path.length === 0) return;

    const engravingDepth = 0.05; // mm (gravado superficial)
    this.gcode.push(`G0 X${round(path[0].x, 3)} Y${round(path[0].y, 3)}`);
    this.gcode.push(`G1 Z0 F${this.config.pluneRate}`);
    this.gcode.push(`G1 Z${round(-engravingDepth, 3)} F${this.config.pluneRate}`);

    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      this.gcode.push(`G1 X${round(point.x, 3)} Y${round(point.y, 3)} F${this.config.feedRate}`);
    }

    this.gcode.push(`G0 Z${this.safetyHeight}`);
    this.gcode.push('');
  }

  _generateContourFromObject(obj) {
    // Aproximación: generar puntos de la forma
    // Este es un método simplificado; se puede mejorar según el tipo de objeto
    if (obj.type === 'circle') {
      return this._generateCircleContour(obj);
    } else if (obj.type === 'rectangle') {
      return this._generateRectangleContour(obj);
    } else if (obj.type === 'path') {
      return obj.points;
    }
    return [];
  }

  _generateCircleContour(obj) {
    const points = [];
    const steps = 64;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      points.push({
        x: round(obj.x + obj.radius * Math.cos(angle), 3),
        y: round(obj.y + obj.radius * Math.sin(angle), 3),
      });
    }
    return points;
  }

  _generateRectangleContour(obj) {
    const bounds = obj.getBounds();
    return [
      { x: round(bounds.minX, 3), y: round(bounds.minY, 3) },
      { x: round(bounds.maxX, 3), y: round(bounds.minY, 3) },
      { x: round(bounds.maxX, 3), y: round(bounds.maxY, 3) },
      { x: round(bounds.minX, 3), y: round(bounds.maxY, 3) },
    ];
  }

  _addFooter() {
    this.gcode.push('(========== END ==========)');
    this.gcode.push(`G0 Z${this.safetyHeight}`);
    this.gcode.push('G0 X0 Y0');
    this.gcode.push('M5 ; Spindle off');
    this.gcode.push('M2 ; Program end');
  }

  /**
   * Exporta G-code a archivo
   */
  exportToFile(gcode, filename = 'design.nc') {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(gcode));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
