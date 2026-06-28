import { Grid } from './Grid.js';
import { Zoom } from './Zoom.js';
import { Selection } from './Selection.js';
import { DEFAULT_WORKSPACE } from '../../utils/constants.js';

/**
 * Canvas principal - Gestor de la mesa de trabajo
 */
export class Canvas {
  constructor(canvasElement, config = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = config.width || DEFAULT_WORKSPACE.width;
    this.height = config.height || DEFAULT_WORKSPACE.height;
    this.scale = config.scale || 20; // pixels per mm
    this.objects = [];
    this.grid = new Grid({
      smallGrid: DEFAULT_WORKSPACE.gridSmall,
      largeGrid: DEFAULT_WORKSPACE.gridLarge,
      smallColor: DEFAULT_WORKSPACE.colorGridSmall,
      largeColor: DEFAULT_WORKSPACE.colorGridLarge,
    });
    this.zoom = new Zoom();
    this.selection = new Selection();
    this.isDragging = false;
    this.draggedObject = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this._setupCanvasSize();
    this._setupEventListeners();
  }

  _setupCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  _setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this._onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this._onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this._onMouseUp(e));
    this.canvas.addEventListener('wheel', (e) => this._onWheel(e));
    this.canvas.addEventListener('dblclick', (e) => this._onDoubleClick(e));

    // Keyboard events
    document.addEventListener('keydown', (e) => this._onKeyDown(e));
  }

  _getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.scale / this.zoom.level;
    const y = (e.clientY - rect.top) / this.scale / this.zoom.level;
    return { x, y };
  }

  _onMouseDown(e) {
    const pos = this._getMousePos(e);
    const clickedObject = this._getObjectAt(pos.x, pos.y);

    if (clickedObject) {
      this.isDragging = true;
      this.draggedObject = clickedObject;
      this.dragOffsetX = pos.x - clickedObject.x;
      this.dragOffsetY = pos.y - clickedObject.y;
      this.selection.select(clickedObject, e.ctrlKey || e.metaKey);
    } else {
      if (!e.ctrlKey && !e.metaKey) {
        this.selection.deselectAll();
      }
    }
    this.draw();
  }

  _onMouseMove(e) {
    if (this.isDragging && this.draggedObject) {
      const pos = this._getMousePos(e);
      const dx = pos.x - this.draggedObject.x - this.dragOffsetX;
      const dy = pos.y - this.draggedObject.y - this.dragOffsetY;
      this.draggedObject.move(dx, dy);
      this.draw();
    }
  }

  _onMouseUp() {
    this.isDragging = false;
    this.draggedObject = null;
  }

  _onWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) {
      this.zoom.zoomIn();
    } else {
      this.zoom.zoomOut();
    }
    this.draw();
  }

  _onDoubleClick(e) {
    const pos = this._getMousePos(e);
    const clickedObject = this._getObjectAt(pos.x, pos.y);
    if (clickedObject && this.onObjectDoubleClick) {
      this.onObjectDoubleClick(clickedObject);
    }
  }

  _onKeyDown(e) {
    if (!this.selection.hasSelection()) return;

    const step = 0.5; // mm
    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
        this.selection.getSelected().forEach((obj) => obj.move(0, -step));
        moved = true;
        break;
      case 'ArrowDown':
        this.selection.getSelected().forEach((obj) => obj.move(0, step));
        moved = true;
        break;
      case 'ArrowLeft':
        this.selection.getSelected().forEach((obj) => obj.move(-step, 0));
        moved = true;
        break;
      case 'ArrowRight':
        this.selection.getSelected().forEach((obj) => obj.move(step, 0));
        moved = true;
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        this.removeObjects(...this.selection.deleteSelected());
        moved = true;
        break;
      case '+':
      case '=':
        e.preventDefault();
        this.zoom.zoomIn();
        moved = true;
        break;
      case '-':
        e.preventDefault();
        this.zoom.zoomOut();
        moved = true;
        break;
      case '0':
        e.preventDefault();
        this.zoom.reset();
        moved = true;
        break;
    }

    if (moved) {
      this.draw();
    }
  }

  _getObjectAt(x, y) {
    // Buscar desde el último al primero (z-order)
    for (let i = this.objects.length - 1; i >= 0; i--) {
      if (this.objects[i].contains(x, y)) {
        return this.objects[i];
      }
    }
    return null;
  }

  addObject(object) {
    this.objects.push(object);
    return object;
  }

  removeObject(object) {
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index, 1);
      this.selection.deselect(object);
    }
  }

  removeObjects(...objects) {
    for (const obj of objects) {
      this.removeObject(obj);
    }
  }

  clear() {
    this.objects = [];
    this.selection.deselectAll();
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    // Limpiar canvas
    this.ctx.fillStyle = '#fafafa';
    this.ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Guardar contexto
    this.ctx.save();
    this.ctx.scale(this.zoom.level, this.zoom.level);

    // Dibujar grid
    this.grid.draw(this.ctx, this.scale, this.width, this.height);

    // Dibujar borde del workspace
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(0, 0, this.width * this.scale, this.height * this.scale);

    // Dibujar objetos
    for (const obj of this.objects) {
      obj.draw(this.ctx, this.scale);
    }

    this.ctx.restore();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.draw();
  }

  exportJSON() {
    return {
      workspace: {
        width: this.width,
        height: this.height,
      },
      objects: this.objects.map((obj) => obj.serialize()),
    };
  }

  importJSON(data) {
    this.clear();
    if (data.workspace) {
      this.width = data.workspace.width;
      this.height = data.workspace.height;
    }
    // Los objetos se añaden desde afuera usando addObject
    return data;
  }
}
