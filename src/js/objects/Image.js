import { BaseObject } from './BaseObject.js';

/**
 * Imagen importada con trazado
 */
export class Image extends BaseObject {
  constructor(config = {}) {
    config.type = 'image';
    super(config);
    this.width = config.width || 20; // mm
    this.height = config.height || 20; // mm
    this.imageSrc = config.imageSrc || null;
    this.image = null;
    this.traced = config.traced !== undefined ? config.traced : false;
    this.threshold = config.threshold || 128;
    this.turnPolicy = config.turnPolicy || 'minority';
    this.tracedPath = config.tracedPath || null;

    if (this.imageSrc) {
      this.loadImage();
    }
  }

  loadImage() {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.image = img;
    };
    img.onerror = () => {
      console.error('Error loading image:', this.imageSrc);
    };
    img.src = this.imageSrc;
  }

  draw(ctx, scale) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const w = this.width * scale;
    const h = this.height * scale;

    if (this.traced && this.tracedPath) {
      // Dibujar ruta trazada
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 0.5;
      ctx.stroke(this.tracedPath);
    } else if (this.image) {
      // Dibujar imagen original
      ctx.drawImage(this.image, -w / 2, -h / 2, w, h);
    }

    // Indicador de selección
    if (this.selected) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
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
      imageSrc: this.imageSrc,
      traced: this.traced,
      threshold: this.threshold,
      turnPolicy: this.turnPolicy,
    };
  }

  deserialize(data) {
    super.deserialize(data);
    if (data.width !== undefined) this.width = data.width;
    if (data.height !== undefined) this.height = data.height;
    if (data.imageSrc !== undefined) {
      this.imageSrc = data.imageSrc;
      this.loadImage();
    }
    if (data.traced !== undefined) this.traced = data.traced;
    if (data.threshold !== undefined) this.threshold = data.threshold;
    if (data.turnPolicy !== undefined) this.turnPolicy = data.turnPolicy;
  }
}
