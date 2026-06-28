import { generateUUID } from '../../utils/helpers.js';

/**
 * Clase base para todos los objetos en el canvas
 */
export class BaseObject {
  constructor(config = {}) {
    this.id = config.id || generateUUID();
    this.type = config.type || 'base';
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.rotation = config.rotation || 0;
    this.opacity = config.opacity !== undefined ? config.opacity : 1;
    this.selected = false;
    this.visible = true;
    this.locked = false;
    this.name = config.name || `${this.type}-${this.id.substring(0, 8)}`;
    this.metadata = config.metadata || {};
  }

  /**
   * Dibuja el objeto en el canvas
   */
  draw(ctx, scale) {
    // Implementar en subclases
  }

  /**
   * Obtiene los límites del objeto
   * @returns {Object} {minX, minY, maxX, maxY, width, height}
   */
  getBounds() {
    return {
      minX: this.x,
      minY: this.y,
      maxX: this.x,
      maxY: this.y,
      width: 0,
      height: 0,
    };
  }

  /**
   * Verifica si un punto está dentro del objeto
   */
  contains(x, y) {
    const bounds = this.getBounds();
    return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
  }

  /**
   * Mueve el objeto
   */
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  /**
   * Rota el objeto
   */
  rotate(angle) {
    this.rotation = (this.rotation + angle) % 360;
  }

  /**
   * Cambia la opacidad
   */
  setOpacity(opacity) {
    this.opacity = Math.max(0, Math.min(1, opacity));
  }

  /**
   * Serializa el objeto
   */
  serialize() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      opacity: this.opacity,
      visible: this.visible,
      locked: this.locked,
      name: this.name,
      metadata: this.metadata,
    };
  }

  /**
   * Carga datos serializados
   */
  deserialize(data) {
    if (data.x !== undefined) this.x = data.x;
    if (data.y !== undefined) this.y = data.y;
    if (data.rotation !== undefined) this.rotation = data.rotation;
    if (data.opacity !== undefined) this.opacity = data.opacity;
    if (data.visible !== undefined) this.visible = data.visible;
    if (data.locked !== undefined) this.locked = data.locked;
    if (data.name !== undefined) this.name = data.name;
    if (data.metadata !== undefined) this.metadata = data.metadata;
  }

  /**
   * Clona el objeto
   */
  clone() {
    const cloned = new this.constructor(this.serialize());
    return cloned;
  }
}
