import { FileManager } from './FileManager.js';

/**
 * Gestor de proyectos con historial Undo/Redo
 */
export class ProjectManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.currentProject = null;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistoryStates = 50;
    this.autoSaveInterval = 30000; // 30 segundos
    this.isDirty = false;

    this._startAutoSave();
  }

  /**
   * Crea un nuevo proyecto
   */
  newProject(metadata = {}) {
    this.canvas.clear();
    this.currentProject = {
      metadata: {
        name: metadata.name || 'Untitled Project',
        description: metadata.description || '',
        author: metadata.author || 'Unknown',
        created: new Date().toISOString(),
      },
      workspace: {
        width: this.canvas.width,
        height: this.canvas.height,
      },
    };
    this.history = [];
    this.historyIndex = -1;
    this.isDirty = false;
    this._captureState();
    return this.currentProject;
  }

  /**
   * Abre un proyecto desde archivo
   */
  async openProject(file) {
    try {
      const projectData = await FileManager.loadFromFile(file);
      return this._loadProjectData(projectData);
    } catch (err) {
      console.error('Error opening project:', err);
      throw err;
    }
  }

  /**
   * Guarda el proyecto actual
   */
  saveProject() {
    if (!this.currentProject) {
      throw new Error('No project loaded');
    }

    FileManager.saveProject(this.canvas, this.currentProject.metadata);
    this.isDirty = false;
    return this.currentProject;
  }

  /**
   * Descarga el proyecto como archivo
   */
  downloadProject() {
    if (!this.currentProject) {
      throw new Error('No project loaded');
    }
    FileManager.downloadProject(this.canvas, this.currentProject.metadata);
  }

  /**
   * Obtiene el proyecto actual
   */
  getCurrentProject() {
    return this.currentProject;
  }

  /**
   * Captura el estado actual para historial
   */
  _captureState() {
    // Limpiar states futuros si no estamos al final del historial
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    // Guardar estado actual
    const state = {
      objects: this.canvas.objects.map((obj) => obj.serialize()),
      timestamp: Date.now(),
    };

    this.history.push(state);
    this.historyIndex = this.history.length - 1;

    // Limitar historial
    if (this.history.length > this.maxHistoryStates) {
      this.history.shift();
      this.historyIndex--;
    }

    this.isDirty = true;
  }

  /**
   * Deshace la última acción
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this._restoreState(this.history[this.historyIndex]);
      return true;
    }
    return false;
  }

  /**
   * Rehace la última acción deshecha
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this._restoreState(this.history[this.historyIndex]);
      return true;
    }
    return false;
  }

  /**
   * Verifica si se puede deshacer
   */
  canUndo() {
    return this.historyIndex > 0;
  }

  /**
   * Verifica si se puede rehacer
   */
  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  /**
   * Restaura un estado desde el historial
   */
  _restoreState(state) {
    this.canvas.clear();
    // Los objetos se reconstruyen desde los datos serializados
    // Esto requiere usar JSONSerializer.deserializeObject
    // Por ahora, es una aproximación simplificada
  }

  /**
   * Inicia autoguardado automático
   */
  _startAutoSave() {
    setInterval(() => {
      if (this.isDirty && this.currentProject) {
        this.saveProject();
      }
    }, this.autoSaveInterval);
  }

  /**
   * Carga datos de proyecto
   */
  _loadProjectData(projectData) {
    this.canvas.clear();
    this.canvas.width = projectData.workspace.width;
    this.canvas.height = projectData.workspace.height;

    // Reconstituir objetos
    for (const objData of projectData.objects) {
      const obj = this._reconstructObject(objData);
      if (obj) {
        this.canvas.addObject(obj);
      }
    }

    this.currentProject = {
      metadata: projectData.metadata,
      workspace: projectData.workspace,
    };

    this.history = [];
    this.historyIndex = -1;
    this._captureState();
    this.isDirty = false;

    return this.currentProject;
  }

  /**
   * Reconstituye un objeto desde datos serializados
   */
  _reconstructObject(objData) {
    // Este método debería usar JSONSerializer
    // Implementación simplificada aquí
    return null;
  }

  /**
   * Obtiene estadísticas del proyecto
   */
  getProjectStats() {
    return {
      objectCount: this.canvas.objects.length,
      workspace: {
        width: this.canvas.width,
        height: this.canvas.height,
      },
      historyStates: this.history.length,
      isDirty: this.isDirty,
      metadata: this.currentProject?.metadata || {},
    };
  }
}
