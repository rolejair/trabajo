import { Circle } from '../objects/shapes/Circle.js';
import { Rectangle } from '../objects/shapes/Rectangle.js';
import { Star } from '../objects/shapes/Star.js';
import { Heart } from '../objects/shapes/Heart.js';
import { Text } from '../objects/Text.js';
import { QRCode } from '../objects/QRCode.js';
import { Image } from '../objects/Image.js';
import { Path } from '../objects/Path.js';
import { getTimestamp } from '../../utils/helpers.js';

/**
 * Serializador/Deserializador JSON
 */
export class JSONSerializer {
  static PROJECT_VERSION = '1.0.0';

  /**
   * Serializa un proyecto completo
   */
  static serializeProject(canvas, metadata = {}) {
    return {
      version: this.PROJECT_VERSION,
      metadata: {
        name: metadata.name || 'Untitled Project',
        description: metadata.description || '',
        author: metadata.author || 'Unknown',
        created: metadata.created || getTimestamp(),
        modified: getTimestamp(),
        tags: metadata.tags || [],
      },
      workspace: {
        width: canvas.width,
        height: canvas.height,
      },
      objects: canvas.objects.map((obj) => this.serializeObject(obj)),
      settings: {
        gridVisible: canvas.grid.visible,
        zoomLevel: canvas.zoom.level,
      },
    };
  }

  /**
   * Serializa un objeto individual
   */
  static serializeObject(obj) {
    return {
      type: obj.type,
      data: obj.serialize(),
    };
  }

  /**
   * Deserializa un proyecto completo
   */
  static deserializeProject(jsonData) {
    if (!jsonData || !jsonData.version) {
      throw new Error('Invalid project file');
    }

    if (jsonData.version !== this.PROJECT_VERSION) {
      console.warn(`Project version mismatch: ${jsonData.version} vs ${this.PROJECT_VERSION}`);
    }

    const objects = [];
    if (jsonData.objects && Array.isArray(jsonData.objects)) {
      for (const objData of jsonData.objects) {
        try {
          const obj = this.deserializeObject(objData);
          if (obj) objects.push(obj);
        } catch (err) {
          console.error('Error deserializing object:', err);
        }
      }
    }

    return {
      metadata: jsonData.metadata || {},
      workspace: jsonData.workspace || { width: 50, height: 30 },
      objects,
      settings: jsonData.settings || {},
    };
  }

  /**
   * Deserializa un objeto individual
   */
  static deserializeObject(objData) {
    if (!objData.type || !objData.data) {
      return null;
    }

    let obj;
    switch (objData.type) {
      case 'circle':
        obj = new Circle(objData.data);
        break;
      case 'rectangle':
        obj = new Rectangle(objData.data);
        break;
      case 'star':
        obj = new Star(objData.data);
        break;
      case 'heart':
        obj = new Heart(objData.data);
        break;
      case 'text':
        obj = new Text(objData.data);
        break;
      case 'qrcode':
        obj = new QRCode(objData.data);
        break;
      case 'image':
        obj = new Image(objData.data);
        break;
      case 'path':
        obj = new Path(objData.data);
        break;
      default:
        console.warn(`Unknown object type: ${objData.type}`);
        return null;
    }

    if (obj && objData.data) {
      obj.deserialize(objData.data);
    }

    return obj;
  }

  /**
   * Convierte a JSON string
   */
  static stringify(data, pretty = true) {
    return JSON.stringify(data, null, pretty ? 2 : 0);
  }

  /**
   * Parsea JSON string
   */
  static parse(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      throw new Error(`Invalid JSON: ${err.message}`);
    }
  }
}
