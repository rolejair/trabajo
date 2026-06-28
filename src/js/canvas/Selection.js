/**
 * Sistema de Selección
 */
export class Selection {
  constructor() {
    this.selectedObjects = [];
    this.multiSelect = false;
  }

  select(object, multiSelect = false) {
    if (!multiSelect) {
      this.deselectAll();
    }
    if (!this.selectedObjects.includes(object)) {
      this.selectedObjects.push(object);
      object.selected = true;
    }
  }

  deselect(object) {
    const index = this.selectedObjects.indexOf(object);
    if (index > -1) {
      this.selectedObjects.splice(index, 1);
      object.selected = false;
    }
  }

  deselectAll() {
    for (const obj of this.selectedObjects) {
      obj.selected = false;
    }
    this.selectedObjects = [];
  }

  toggle(object, multiSelect = false) {
    if (this.selectedObjects.includes(object)) {
      this.deselect(object);
    } else {
      this.select(object, multiSelect);
    }
  }

  getSelected() {
    return this.selectedObjects;
  }

  hasSelection() {
    return this.selectedObjects.length > 0;
  }

  deleteSelected() {
    return this.selectedObjects.splice(0);
  }
}
