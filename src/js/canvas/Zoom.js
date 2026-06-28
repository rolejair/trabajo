/**
 * Sistema de Zoom
 */
export class Zoom {
  constructor(config = {}) {
    this.level = config.level || 1;
    this.minLevel = config.minLevel || 0.1;
    this.maxLevel = config.maxLevel || 10;
    this.step = config.step || 0.1;
  }

  zoomIn() {
    this.level = Math.min(this.maxLevel, this.level + this.step);
    return this.level;
  }

  zoomOut() {
    this.level = Math.max(this.minLevel, this.level - this.step);
    return this.level;
  }

  setLevel(level) {
    this.level = Math.max(this.minLevel, Math.min(this.maxLevel, level));
    return this.level;
  }

  fit(canvasWidth, canvasHeight, workspaceWidth, workspaceHeight) {
    const scaleX = canvasWidth / workspaceWidth;
    const scaleY = canvasHeight / workspaceHeight;
    this.level = Math.min(scaleX, scaleY) * 0.95;
    return this.level;
  }

  reset() {
    this.level = 1;
    return this.level;
  }
}
