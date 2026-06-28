import { BaseObject } from './BaseObject.js';

/**
 * Texto con fuente Roboto
 */
export class Text extends BaseObject {
  constructor(config = {}) {
    config.type = 'text';
    super(config);
    this.content = config.content || 'Texto';
    this.font = 'Roboto';
    this.fontSize = config.fontSize || 12; // mm
    this.weight = config.weight || 400;
    this.fillColor = config.fillColor || '#000000';
    this.strokeColor = config.strokeColor || '#000000';
    this.strokeWidth = config.strokeWidth || 0.2;
    this.textAlign = config.textAlign || 'center';
    this.enableOutline = config.enableOutline !== undefined ? config.enableOutline : false;
    this.outlineWidth = config.outlineWidth || 0.1;
  }

  draw(ctx, scale) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const fontSizePx = this.fontSize * scale;
    ctx.font = `${this.weight} ${fontSizePx}px "${this.font}", sans-serif`;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = 'middle';

    // Dibujar trazo (outline)
    if (this.enableOutline) {
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = this.outlineWidth * scale;
      ctx.strokeText(this.content, 0, 0);
    }

    // Dibujar relleno
    ctx.fillStyle = this.fillColor;
    ctx.fillText(this.content, 0, 0);

    // Indicador de selección
    if (this.selected) {
      const metrics = ctx.measureText(this.content);
      const width = metrics.width;
      const height = fontSizePx;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(-width / 2, -height / 2, width, height);
    }

    ctx.restore();
  }

  getBounds() {
    // Aproximación simplificada
    const charWidth = (this.fontSize * 0.6) / 2; // Ancho aproximado por carácter
    const width = this.content.length * charWidth;
    const height = this.fontSize;

    return {
      minX: this.x - width / 2,
      minY: this.y - height / 2,
      maxX: this.x + width / 2,
      maxY: this.y + height / 2,
      width,
      height,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      content: this.content,
      fontSize: this.fontSize,
      weight: this.weight,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      textAlign: this.textAlign,
      enableOutline: this.enableOutline,
      outlineWidth: this.outlineWidth,
    };
  }

  deserialize(data) {
    super.deserialize(data);
    if (data.content !== undefined) this.content = data.content;
    if (data.fontSize !== undefined) this.fontSize = data.fontSize;
    if (data.weight !== undefined) this.weight = data.weight;
    if (data.fillColor !== undefined) this.fillColor = data.fillColor;
    if (data.strokeColor !== undefined) this.strokeColor = data.strokeColor;
    if (data.strokeWidth !== undefined) this.strokeWidth = data.strokeWidth;
    if (data.textAlign !== undefined) this.textAlign = data.textAlign;
    if (data.enableOutline !== undefined) this.enableOutline = data.enableOutline;
    if (data.outlineWidth !== undefined) this.outlineWidth = data.outlineWidth;
  }
}
