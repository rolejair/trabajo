import { BaseObject } from '../BaseObject.js';

/**
 * Círculo dibujable
 */
export class Circle extends BaseObject {
  constructor(config = {}) {
    config.type = 'circle';
    super(config);
    this.radius = config.radius || 5;
    this.fillColor = config.fillColor || '#ffffff';
    this.strokeColor = config.strokeColor || '#000000';
    this.strokeWidth = config.strokeWidth || 0.2;
  }

  draw(ctx, scale) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Dibujar círculo
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * scale, 0, Math.PI * 2);
    ctx.fillStyle = this.fillColor;
    ctx.fill();

    // Trazo
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth * scale;
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
    return {
      minX: this.x - this.radius,
      minY: this.y - this.radius,
      maxX: this.x + this.radius,
      maxY: this.y + this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      radius: this.radius,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
    };
  }

  deserialize(data) {
    super.deserialize(data);
    if (data.radius !== undefined) this.radius = data.radius;
    if (data.fillColor !== undefined) this.fillColor = data.fillColor;
    if (data.strokeColor !== undefined) this.strokeColor = data.strokeColor;
    if (data.strokeWidth !== undefined) this.strokeWidth = data.strokeWidth;
  }
}
