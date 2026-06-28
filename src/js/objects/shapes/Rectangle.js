import { BaseObject } from '../BaseObject.js';

/**
 * Rectángulo dibujable
 */
export class Rectangle extends BaseObject {
  constructor(config = {}) {
    config.type = 'rectangle';
    super(config);
    this.width = config.width || 10;
    this.height = config.height || 8;
    this.fillColor = config.fillColor || '#ffffff';
    this.strokeColor = config.strokeColor || '#000000';
    this.strokeWidth = config.strokeWidth || 0.2;
    this.cornerRadius = config.cornerRadius || 0;
  }

  draw(ctx, scale) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const w = this.width * scale;
    const h = this.height * scale;
    const r = this.cornerRadius * scale;

    // Dibujar rectángulo redondeado
    ctx.beginPath();
    ctx.moveTo(-w / 2 + r, -h / 2);
    ctx.lineTo(w / 2 - r, -h / 2);
    ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    ctx.lineTo(w / 2, h / 2 - r);
    ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    ctx.lineTo(-w / 2 + r, h / 2);
    ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    ctx.lineTo(-w / 2, -h / 2 + r);
    ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    ctx.closePath();

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
      minX: this.x - this.width / 2,
      minY: this.y - this.height / 2,
      maxX: this.x + this.width / 2,
      maxY: this.y + this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      width: this.width,
      height: this.height,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      cornerRadius: this.cornerRadius,
    };
  }

  deserialize(data) {
    super.deserialize(data);
    if (data.width !== undefined) this.width = data.width;
    if (data.height !== undefined) this.height = data.height;
    if (data.fillColor !== undefined) this.fillColor = data.fillColor;
    if (data.strokeColor !== undefined) this.strokeColor = data.strokeColor;
    if (data.strokeWidth !== undefined) this.strokeWidth = data.strokeWidth;
    if (data.cornerRadius !== undefined) this.cornerRadius = data.cornerRadius;
  }
}
