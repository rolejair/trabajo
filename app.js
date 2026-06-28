import { Canvas } from './src/js/canvas/Canvas.js';
import { Circle } from './src/js/objects/shapes/Circle.js';
import { Rectangle } from './src/js/objects/shapes/Rectangle.js';
import { Star } from './src/js/objects/shapes/Star.js';
import { Heart } from './src/js/objects/shapes/Heart.js';
import { Text } from './src/js/objects/Text.js';
import { QRCode } from './src/js/objects/QRCode.js';
import { Image } from './src/js/objects/Image.js';
import { Path } from './src/js/objects/Path.js';
import { BitDatabase } from './src/js/cnc/BitDatabase.js';
import { CNCCalculator } from './src/js/cnc/CNCCalculator.js';
import { GRBLOptimizer } from './src/js/cnc/GRBLOptimizer.js';
import { GCodeGenerator } from './src/js/cnc/GCodeGenerator.js';
import { ProjectManager } from './src/js/io/ProjectManager.js';
import { FileManager } from './src/js/io/FileManager.js';
import { JSONSerializer } from './src/js/io/JSONSerializer.js';

/**
 * Aplicación Principal - CNC Design Pro
 */
class CNCDesignApp {
  constructor() {
    this.canvas = null;
    this.projectManager = null;
    this.bitDatabase = new BitDatabase();
    this.operations = [];
    this.currentTool = null;
    this.currentBit = null;
    this.isDrawing = false;
    this.currentPath = [];

    this._init();
  }

  _init() {
    // Inicializar canvas
    const canvasElement = document.getElementById('canvas');
    this.canvas = new Canvas(canvasElement);
    this.projectManager = new ProjectManager(this.canvas);

    // Crear nuevo proyecto
    this.projectManager.newProject({
      name: 'My CNC Project',
      author: 'User',
    });

    // Setup eventos
    this._setupEventListeners();
    this._populateBitDatabase();
    this._drawInitial();
  }

  _setupEventListeners() {
    // Toolbar - Proyecto
    document.getElementById('btn-new').addEventListener('click', () => this._newProject());
    document.getElementById('btn-open').addEventListener('click', () => this._openProject());
    document.getElementById('btn-save').addEventListener('click', () => this._saveProject());
    document.getElementById('btn-download').addEventListener('click', () => this._downloadProject());

    // Toolbar - Edición
    document.getElementById('btn-undo').addEventListener('click', () => this._undo());
    document.getElementById('btn-redo').addEventListener('click', () => this._redo());

    // Toolbar - Herramientas
    document.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this._selectTool(e.target.dataset.tool));
    });

    // Toolbar - Zoom
    document.getElementById('btn-zoom-in').addEventListener('click', () => this._zoomIn());
    document.getElementById('btn-zoom-out').addEventListener('click', () => this._zoomOut());
    document.getElementById('btn-zoom-fit').addEventListener('click', () => this._zoomFit());
    document.getElementById('btn-zoom-reset').addEventListener('click', () => this._zoomReset());

    // Toolbar - CNC
    document.getElementById('btn-generate-gcode').addEventListener('click', () => this._generateGCode());
    document.getElementById('btn-export-gcode').addEventListener('click', () => this._exportGCode());

    // Panel - Objetos
    document.getElementById('btn-delete-selected').addEventListener('click', () => this._deleteSelected());

    // Panel - Operaciones CNC
    document.getElementById('btn-add-operation').addEventListener('click', (e) => {
      e.preventDefault();
      this._addOperation();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => this._handleKeyDown(e));

    // Canvas events
    this.canvas.onObjectDoubleClick = (obj) => this._editObject(obj);
  }

  _selectTool(tool) {
    this.currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach((btn) => btn.classList.remove('active'));
    document.getElementById(`tool-${tool}`).classList.add('active');
    this._showNotification(`Herramienta: ${tool}`, 'info');
  }

  _drawInitial() {
    this.canvas.draw();
  }

  _newProject() {
    if (confirm('¿Crear nuevo proyecto? Se perderán los cambios no guardados.')) {
      this.projectManager.newProject();
      this.operations = [];
      this._updateUI();
      this._showNotification('Nuevo proyecto creado', 'success');
    }
  }

  _openProject() {
    FileManager.openFileDialog('.json').then((file) => {
      this.projectManager.openProject(file).then(() => {
        this._updateUI();
        this._showNotification('Proyecto abierto correctamente', 'success');
      });
    });
  }

  _saveProject() {
    this.projectManager.saveProject();
    this._showNotification('Proyecto guardado', 'success');
  }

  _downloadProject() {
    this.projectManager.downloadProject();
    this._showNotification('Proyecto descargado', 'success');
  }

  _undo() {
    if (this.projectManager.undo()) {
      this._updateUI();
      this._showNotification('Deshacer', 'info');
    }
  }

  _redo() {
    if (this.projectManager.redo()) {
      this._updateUI();
      this._showNotification('Rehacer', 'info');
    }
  }

  _zoomIn() {
    this.canvas.zoom.zoomIn();
    this.canvas.draw();
  }

  _zoomOut() {
    this.canvas.zoom.zoomOut();
    this.canvas.draw();
  }

  _zoomFit() {
    this.canvas.zoom.fit(this.canvas.canvas.width, this.canvas.canvas.height, this.canvas.width, this.canvas.height);
    this.canvas.draw();
  }

  _zoomReset() {
    this.canvas.zoom.reset();
    this.canvas.draw();
  }

  _deleteSelected() {
    const selected = this.canvas.selection.getSelected();
    if (selected.length > 0) {
      this.canvas.removeObjects(...selected);
      this.projectManager._captureState();
      this._updateUI();
      this._showNotification(`${selected.length} objeto(s) eliminado(s)`, 'info');
    }
  }

  _populateBitDatabase() {
    const bitSelect = document.getElementById('bit-select');
    const bits = this.bitDatabase.getAllBits();
    bitSelect.innerHTML = '';
    for (const bit of bits) {
      const option = document.createElement('option');
      option.value = bit.id;
      option.textContent = `${bit.name} (Ø${bit.diameter}mm)`;
      bitSelect.appendChild(option);
    }
    this.currentBit = bits[0];
  }

  _addOperation() {
    const type = document.getElementById('operation-type').value;
    const bitId = document.getElementById('bit-select').value;
    const maxDepth = parseFloat(document.getElementById('max-depth').value);
    const depthPerPass = parseFloat(document.getElementById('depth-per-pass').value);
    const rpm = parseInt(document.getElementById('rpm').value);
    const feedRate = parseInt(document.getElementById('feed-rate').value);
    const pluneRate = parseInt(document.getElementById('plunge-rate').value);

    const operation = {
      id: `op-${Date.now()}`,
      type,
      bitId,
      maxDepth,
      depthPerPass,
      rpm,
      feedRate,
      pluneRate,
      objectIds: this.canvas.selection.getSelected().map((obj) => obj.id),
    };

    if (operation.objectIds.length === 0) {
      this._showNotification('Selecciona al menos un objeto', 'warning');
      return;
    }

    this.operations.push(operation);
    this._updateOperationsList();
    this._showNotification('Operación añadida', 'success');
  }

  _generateGCode() {
    if (this.canvas.objects.length === 0) {
      this._showNotification('No hay objetos en el canvas', 'warning');
      return;
    }

    if (this.operations.length === 0) {
      this._showNotification('Define al menos una operación CNC', 'warning');
      return;
    }

    const generator = new GCodeGenerator({
      rpm: this.operations[0].rpm,
      feedRate: this.operations[0].feedRate,
      pluneRate: this.operations[0].pluneRate,
      depthPerPass: this.operations[0].depthPerPass,
      maxDepth: this.operations[0].maxDepth,
    });

    const gcode = generator.generate(this.canvas.objects, this.currentBit, this.operations);

    // Mostrar G-code en modal
    this._showModal('G-code Generado', `<pre style="background: #0d0d0d; padding: 12px; border-radius: 4px; max-height: 400px; overflow-y: auto; font-size: 11px;">${gcode}</pre>`);
    this._showNotification('G-code generado correctamente', 'success');
  }

  _exportGCode() {
    if (this.operations.length === 0) {
      this._showNotification('Genera G-code primero', 'warning');
      return;
    }

    const generator = new GCodeGenerator({
      rpm: this.operations[0].rpm,
      feedRate: this.operations[0].feedRate,
      pluneRate: this.operations[0].pluneRate,
      depthPerPass: this.operations[0].depthPerPass,
      maxDepth: this.operations[0].maxDepth,
    });

    const gcode = generator.generate(this.canvas.objects, this.currentBit, this.operations);
    const filename = `${this.projectManager.currentProject?.metadata.name || 'design'}.nc`;
    FileManager.downloadGCode(gcode, filename);
    this._showNotification('G-code exportado', 'success');
  }

  _updateUI() {
    this._updateObjectsList();
    this._updateOperationsList();
    this.canvas.draw();
  }

  _updateObjectsList() {
    const list = document.getElementById('objects-list');
    list.innerHTML = '';
    for (const obj of this.canvas.objects) {
      const item = document.createElement('div');
      item.className = `object-item ${obj.selected ? 'selected' : ''}`;
      item.textContent = obj.name;
      item.addEventListener('click', () => {
        this.canvas.selection.select(obj);
        this._updateUI();
      });
      list.appendChild(item);
    }
  }

  _updateOperationsList() {
    const list = document.getElementById('operations-list');
    list.innerHTML = '';
    for (const op of this.operations) {
      const item = document.createElement('div');
      item.className = 'operation-item';
      item.textContent = `${op.type} - ${op.objectIds.length} objeto(s) - Profundidad: ${op.maxDepth}mm`;
      list.appendChild(item);
    }
  }

  _editObject(obj) {
    // Editar propiedades del objeto
    if (obj.type === 'text') {
      const content = prompt('Contenido del texto:', obj.content);
      if (content !== null) {
        obj.content = content;
        this.projectManager._captureState();
        this._updateUI();
      }
    }
  }

  _handleKeyDown(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this._deleteSelected();
    }
  }

  _showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notifications-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, duration);
  }

  _showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      document.getElementById('modal').classList.add('hidden');
    });
  }
}

// Inicializar aplicación
window.addEventListener('DOMContentLoaded', () => {
  window.app = new CNCDesignApp();
});
