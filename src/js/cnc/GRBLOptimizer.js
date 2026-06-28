import { round } from '../../utils/helpers.js';

/**
 * Optimizador de rutas para GRBL
 * Genera paths tipo pocket (no zigzag) similar a Carbide Create
 */
export class GRBLOptimizer {
  /**
   * Genera un path de pocket concéntrico (espiral)
   * @param {Object} bounds - Límites del objeto {minX, minY, maxX, maxY, width, height}
   * @param {number} stepover - Distancia entre pasadas
   * @param {number} bitDiameter - Diámetro de la broca
   * @returns {Array} Array de puntos {x, y}
   */
  static generatePocketPath(bounds, stepover, bitDiameter) {
    const path = [];
    const centerX = bounds.minX + bounds.width / 2;
    const centerY = bounds.minY + bounds.height / 2;
    const maxRadius = Math.max(bounds.width, bounds.height) / 2;

    // Generar espiral concéntrica
    let radius = bitDiameter / 2;
    const radiusStep = stepover;

    while (radius <= maxRadius) {
      // Rectángulo concéntrico
      const halfWidth = Math.min(radius, bounds.width / 2);
      const halfHeight = Math.min(radius, bounds.height / 2);

      // Puntos del rectángulo
      path.push({ x: round(centerX - halfWidth, 3), y: round(centerY - halfHeight, 3) });
      path.push({ x: round(centerX + halfWidth, 3), y: round(centerY - halfHeight, 3) });
      path.push({ x: round(centerX + halfWidth, 3), y: round(centerY + halfHeight, 3) });
      path.push({ x: round(centerX - halfWidth, 3), y: round(centerY + halfHeight, 3) });
      path.push({ x: round(centerX - halfWidth, 3), y: round(centerY - halfHeight, 3) }); // Cerrar

      radius += radiusStep;
    }

    return path;
  }

  /**
   * Genera un path de contorno
   * @param {Array} points - Puntos del contorno
   * @param {number} toolOffset - Offset de herramienta
   * @returns {Array} Array de puntos compensados
   */
  static generateContourPath(points, toolOffset = 0) {
    if (toolOffset === 0) return points;

    // Compensar cada punto radialmente
    const compensated = [];
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const prev = points[i - 1] || points[points.length - 1];
      const next = points[(i + 1) % points.length];

      const dx1 = current.x - prev.x;
      const dy1 = current.y - prev.y;
      const dx2 = next.x - current.x;
      const dy2 = next.y - current.y;

      const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      const nx1 = dist1 > 0 ? -dy1 / dist1 : 0;
      const ny1 = dist1 > 0 ? dx1 / dist1 : 0;
      const nx2 = dist2 > 0 ? -dy2 / dist2 : 0;
      const ny2 = dist2 > 0 ? dx2 / dist2 : 0;

      const nx = (nx1 + nx2) / 2;
      const ny = (ny1 + ny2) / 2;
      const dist = Math.sqrt(nx * nx + ny * ny);

      compensated.push({
        x: round(current.x + (dist > 0 ? nx / dist : 0) * toolOffset, 3),
        y: round(current.y + (dist > 0 ? ny / dist : 0) * toolOffset, 3),
      });
    }

    return compensated;
  }

  /**
   * Optimiza el orden de operaciones
   * @param {Array} operations - Array de operaciones
   * @returns {Array} Operaciones ordenadas
   */
  static optimizeOperationOrder(operations) {
    if (operations.length <= 1) return operations;

    const ordered = [operations[0]];
    const remaining = operations.slice(1);

    while (remaining.length > 0) {
      const lastOp = ordered[ordered.length - 1];
      let nearest = remaining[0];
      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const op = remaining[i];
        const distance = Math.sqrt(
          (op.x - lastOp.x) ** 2 + (op.y - lastOp.y) ** 2
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = op;
          nearestIndex = i;
        }
      }

      ordered.push(nearest);
      remaining.splice(nearestIndex, 1);
    }

    return ordered;
  }

  /**
   * Calcula la distancia total de corte
   * @param {Array} paths - Array de paths
   * @returns {number} Distancia total en mm
   */
  static calculateTotalDistance(paths) {
    let total = 0;
    for (const path of paths) {
      for (let i = 1; i < path.length; i++) {
        const p1 = path[i - 1];
        const p2 = path[i];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        total += Math.sqrt(dx * dx + dy * dy);
      }
    }
    return round(total, 2);
  }
}
