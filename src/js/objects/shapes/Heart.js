import { BaseObject } from '../BaseObject.js';

/**
 * Corazón dibujable
 */
export class Heart extends BaseObject {
  constructor(config = {}) {
    config.type = 'heart';
    super(config);
    this.size = config.size || 8;
    this.fillColor = config.fillColor || '#ff0000';
    this.strokeColor = config.strokeColor || '#000000';
    this.strokeWidth = config.strokeWidth || 0.2;
  }

  draw(ctx, scale) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    this._drawHeart(ctx, 0, 0, this.size);

    ctx.fillStyle = this.fillColor;
    ctx.fill();

    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();

    // Indicador de selección
    if (this.selected) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2 / scale;
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawHeart(ctx, x, y, size) {
    const h = size * 0.1;
    ctx.beginPath();
    ctx.moveTo(x + size * 0.5, y + h + size * 0.5);
    ctx.bezierCurveTo(
      x + size * 0.5, y + h,
      x, y + h,
      x, y + h - size * 0.2
    );
    ctx.bezierCurveTo(
      x, y - size * 0.3,
      x + size * 0.2, y - size * 0.5,
      x + size * 0.5, y - size * 0.3
    );
    ctx.bezierCurveTo(
      x + size * 0.8, y - size * 0.5,
      x + size, y - size * 0.3,
      x + size, y + h - size * 0.2
    );
    ctx.bezierCurveTo(
      x + size, y + h,
      x + size * 0.5, y + h,
      x + size * 0.5, y + h + size * 0.5
    );
    ctx.closePath();
  }

  getBounds() {
    return {
      minX: this.x - this.size * 0.5,
      minY: this.y - this.size * 0.5,
      maxX: this.x + this.size * 0.5,
      maxY: this.y + this.size * 0.5,
      width: this.size,
      height: this.size,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      size: this.size,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
    };
  }

  deserialize(data) {
    super.deserialize(data);
    if (data.size !== undefined) this.size = data.size;
    if (data.fillColor !== undefined) this.fillColor = data.fillColor;
    if (data.strokeColor !== undefined) this.strokeColor = data.strokeColor;
    if (data.strokeWidth !== undefined) this.strokeWidth = data.strokeWidth;
  }
}
