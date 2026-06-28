import { BaseObject } from './BaseObject.js';
import QRCode from 'qrcode';

/**
 * Código QR con corrección de error M
 */
export class QRCode extends BaseObject {
  constructor(config = {}) {
    config.type = 'qrcode';
    super(config);
    this.content = config.content || 'https://example.com';
    this.size = config.size || 20; // mm
    this.errorCorrection = config.errorCorrection || 'M';
    this.fillColor = config.fillColor || '#000000';
    this.backgroundColor = config.backgroundColor || '#ffffff';
    this.qrImage = null;
    this.scale = config.scale || 4; // Pixels por modulo QR
    this.generateQRCode();
  }

  async generateQRCode() {
    try {
      this.qrImage = await QRCode.toCanvas(this.content, {
        errorCorrectionLevel: this.errorCorrection,
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        color: {
          dark: this.fillColor,
          light: this.backgroundColor,
        },
      });
    } catch (err) {
      console.error('Error generando QR:', err);
    }
  }

  draw(ctx, scale) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate((this.rotation * Math.PI) / 180);

    if (this.qrImage) {
      const scaledSize = this.size * scale;
      ctx.drawImage(this.qrImage, -scaledSize / 2, -scaledSize / 2, scaledSize, scaledSize);
    }

    // Indicador de selección
    if (this.selected) {
      const s = (this.size * scale) / 2;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(-s, -s, s * 2, s * 2);
    }

    ctx.restore();
  }

  getBounds() {
    const half = this.size / 2;
    return {
      minX: this.x - half,
      minY: this.y - half,
      maxX: this.x + half,
      maxY: this.y + half,
      width: this.size,
      height: this.size,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      content: this.content,
      size: this.size,
      errorCorrection: this.errorCorrection,
      fillColor: this.fillColor,
      backgroundColor: this.backgroundColor,
    };
  }

  deserialize(data) {
    super.deserialize(data);
    if (data.content !== undefined) this.content = data.content;
    if (data.size !== undefined) this.size = data.size;
    if (data.errorCorrection !== undefined) this.errorCorrection = data.errorCorrection;
    if (data.fillColor !== undefined) this.fillColor = data.fillColor;
    if (data.backgroundColor !== undefined) this.backgroundColor = data.backgroundColor;
    this.generateQRCode();
  }
}
