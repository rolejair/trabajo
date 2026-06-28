import { BaseObject } from '../BaseObject.js';

/**
 * Estrella dibujable
 */
export class Star extends BaseObject {
  constructor(config = {}) {
    config.type = 'star';
    super(config);
    this.size = config.size || 8;
    this.points = config.points || 5;
    this.innerRadius = config.innerRadius || this.size * 0.4;
    this.fillColor = config.fillColor || '#ffff00';
    this.strokeColor = config.strokeColor || '#000000';
    this.strokeWidth = config.strokeWidth || 0.2;
  }

  draw(ctx, scale) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate((this.rotation * Math.PI) / 180);

    this._drawStar(ctx, 0, 0, this.points, this.size * scale, this.innerRadius * scale);

    ctx.fillStyle = this.fillColor;
    ctx.fill();

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

  _drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  getBounds() {
    return {
      minX: this.x - this.size,
      minY: this.y - this.size,
      maxX: this.x + this.size,
      maxY: this.y + this.size,
      width: this.size * 2,
      height: this.size * 2,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      size: this.size,
      points: this.points,
      innerRadius: this.innerRadius,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
    };
  }

  deserialize(data) {
    super.deserialize(data);
    if (data.size !== undefined) this.size = data.size;
    if (data.points !== undefined) this.points = data.points;
    if (data.innerRadius !== undefined) this.innerRadius = data.innerRadius;
    if (data.fillColor !== undefined) this.fillColor = data.fillColor;
    if (data.strokeColor !== undefined) this.strokeColor = data.strokeColor;
    if (data.strokeWidth !== undefined) this.strokeWidth = data.strokeWidth;
  }
}
