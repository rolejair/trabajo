/**
 * Sistema de Grid para la mesa de trabajo
 */
export class Grid {
  constructor(config = {}) {
    this.smallGrid = config.smallGrid || 1; // mm
    this.largeGrid = config.largeGrid || 5; // mm
    this.smallColor = config.smallColor || 'rgba(200, 200, 200, 0.2)';
    this.largeColor = config.largeColor || 'rgba(100, 100, 100, 0.4)';
    this.visible = config.visible !== undefined ? config.visible : true;
  }

  draw(ctx, scale, width, height) {
    if (!this.visible) return;

    const pixelWidth = width * scale;
    const pixelHeight = height * scale;

    // Grid pequeño
    ctx.strokeStyle = this.smallColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += this.smallGrid) {
      const x = i * scale;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, pixelHeight);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += this.smallGrid) {
      const y = i * scale;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(pixelWidth, y);
      ctx.stroke();
    }

    // Grid grande
    ctx.strokeStyle = this.largeColor;
    ctx.lineWidth = 2;
    for (let i = 0; i <= width; i += this.largeGrid) {
      const x = i * scale;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, pixelHeight);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += this.largeGrid) {
      const y = i * scale;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(pixelWidth, y);
      ctx.stroke();
    }
  }
}
