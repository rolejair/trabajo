import { BaseObject } from './BaseObject.js';

/**
 * Ruta de trazo personalizado (Path)
 */
export class Path extends BaseObject {
  constructor(config = {}) {
    config.type = 'path';
    super(config);
    this.points = config.points || []; // Array de {x, y}
    this.strokeColor = config.strokeColor || '#000000';
    this.strokeWidth = config.strokeWidth || 0.2;
    this.closed = config.closed !== undefined ? config.closed : false;
  }

  /**
   * Agrega un punto a la ruta
   */
  addPoint(x, y) {
    this.points.push({ x, y });
  }

  /**
   * Establece los puntos
   */
  setPoints(points) {
    this.points = points;
  }

  draw(ctx, scale) {
    if (!this.visible || this.points.length < 2) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate((this.rotation * Math.PI) / 180);

    ctx.beginPath();
    ctx.moveTo(this.points[0].x * scale, this.points[0].y * scale);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x * scale, this.points[i].y * scale);
    }

    if (this.closed) {
      ctx.closePath();
    }

    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth * scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Indicador de selección
    if (this.selected) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  getBounds() {
    if (this.points.length === 0) {
      return {
        minX: this.x,
        minY: this.y,
        maxX: this.x,
        maxY: this.y,
        width: 0,
        height: 0,
      };
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const point of this.points) {
      minX = Math.min(minX, this.x + point.x);
      minY = Math.min(minY, this.y + point.y);
      maxX = Math.max(maxX, this.x + point.x);
      maxY = Math.max(maxY, this.y + point.y);
    }

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      points: this.points,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      closed: this.closed,
    };
  }

  deserialize(data) {
    super.deserialize(data);
    if (data.points !== undefined) this.points = data.points;
    if (data.strokeColor !== undefined) this.strokeColor = data.strokeColor;
    if (data.strokeWidth !== undefined) this.strokeWidth = data.strokeWidth;
    if (data.closed !== undefined) this.closed = data.closed;
  }
}
