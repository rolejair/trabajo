import { JSONSerializer } from './JSONSerializer.js';

/**
 * Gestor de archivos
 */
export class FileManager {
  /**
   * Guarda un proyecto como archivo JSON
   */
  static saveProject(canvas, metadata = {}) {
    const projectData = JSONSerializer.serializeProject(canvas, metadata);
    const jsonString = JSONSerializer.stringify(projectData, true);

    // Guardar en localStorage también
    localStorage.setItem('currentProject', jsonString);

    return projectData;
  }

  /**
   * Carga un proyecto desde JSON
   */
  static loadProject(jsonData) {
    return JSONSerializer.deserializeProject(jsonData);
  }

  /**
   * Exporta proyecto a archivo .json (descarga)
   */
  static downloadProject(canvas, metadata = {}) {
    const projectData = this.saveProject(canvas, metadata);
    const jsonString = JSONSerializer.stringify(projectData, true);
    const filename = `${metadata.name || 'project'}_${Date.now()}.json`;

    this._downloadFile(jsonString, filename, 'application/json');
  }

  /**
   * Exporta G-code a archivo .nc (descarga)
   */
  static downloadGCode(gcode, filename = 'design.nc') {
    this._downloadFile(gcode, filename, 'text/plain');
  }

  /**
   * Carga un archivo JSON desde disco
   */
  static loadFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const jsonData = JSONSerializer.parse(e.target.result);
          const projectData = this.loadProject(jsonData);
          resolve(projectData);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Obtiene el proyecto guardado en localStorage
   */
  static getAutoSavedProject() {
    const saved = localStorage.getItem('currentProject');
    if (!saved) return null;

    try {
      const jsonData = JSONSerializer.parse(saved);
      return this.loadProject(jsonData);
    } catch (err) {
      console.error('Error loading autosaved project:', err);
      return null;
    }
  }

  /**
   * Limpia el proyecto guardado
   */
  static clearAutoSavedProject() {
    localStorage.removeItem('currentProject');
  }

  /**
   * Descarga un archivo genérico
   */
  static _downloadFile(content, filename, mimeType) {
    const element = document.createElement('a');
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    element.setAttribute('href', url);
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    URL.revokeObjectURL(url);
  }

  /**
   * Crea un input file para seleccionar archivo
   */
  static openFileDialog(accept = '.json') {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          resolve(file);
        }
      };
      input.click();
    });
  }
}
