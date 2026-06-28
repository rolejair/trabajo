import { BIT_DATABASE } from '../../utils/defaults.js';

/**
 * Base de datos de brocas CNC
 */
export class BitDatabase {
  constructor() {
    this.bits = BIT_DATABASE;
    this.customBits = [];
  }

  /**
   * Obtiene una broca por ID
   */
  getBitById(id) {
    const bit = this.bits.find((b) => b.id === id);
    if (bit) return { ...bit };
    return this.customBits.find((b) => b.id === id);
  }

  /**
   * Obtiene todas las brocas
   */
  getAllBits() {
    return [...this.bits, ...this.customBits];
  }

  /**
   * Obtiene brocas por tipo
   */
  getBitsByType(type) {
    return this.getAllBits().filter((b) => b.type === type);
  }

  /**
   * Añade una broca personalizada
   */
  addCustomBit(bit) {
    if (!bit.id) bit.id = `custom-${Date.now()}`;
    this.customBits.push(bit);
    return bit;
  }

  /**
   * Elimina una broca personalizada
   */
  removeCustomBit(id) {
    const index = this.customBits.findIndex((b) => b.id === id);
    if (index > -1) {
      this.customBits.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Exporta las brocas personalizadas
   */
  exportCustomBits() {
    return this.customBits;
  }

  /**
   * Importa brocas personalizadas
   */
  importCustomBits(bits) {
    this.customBits = bits;
  }
}
