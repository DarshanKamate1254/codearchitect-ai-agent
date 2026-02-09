// CanvasManager.js
// Provides a wrapper around an HTML5 canvas element with high-DPI (Retina) support.
// Methods:
//   init()   - Initialize the canvas and its 2D context.
//   resize() - Adjust canvas size according to its CSS size and device pixel ratio.
//   clear()  - Clear the drawing surface.
//   toDataURL() - Export the canvas content as a data URL.

class CanvasManager {
  /**
   * @param {string} canvasId - The id attribute of the <canvas> element.
   */
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = null; // HTMLCanvasElement
    this.ctx = null; // CanvasRenderingContext2D
    this.dpr = window.devicePixelRatio || 1;
  }

  /**
   * Initialise the canvas element and its 2D rendering context.
   * Must be called before any other method.
   */
  init() {
    const canvas = document.getElementById(this.canvasId);
    if (!canvas) {
      throw new Error(`Canvas element with id "${this.canvasId}" not found.`);
    }
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas.');
    }
    this.ctx = ctx;
    // Ensure the canvas is sized correctly for the current DPI.
    this.resize();
  }

  /**
   * Resize the canvas to match its displayed size while accounting for device pixel ratio.
   * Call this on window resize or when the canvas CSS size changes.
   */
  resize() {
    if (!this.canvas || !this.ctx) {
      // If init hasn't been called yet, silently ignore.
      return;
    }
    // Get the size the canvas is displayed at (CSS pixels).
    const rect = this.canvas.getBoundingClientRect();
    // Set the actual pixel dimensions.
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    // Keep the CSS size unchanged.
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    // Scale the context so drawing commands use CSS pixel coordinates.
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /**
   * Clear the entire drawing surface.
   */
  clear() {
    if (!this.ctx) return;
    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;
    this.ctx.clearRect(0, 0, width, height);
  }

  /**
   * Export the current canvas content as a data URL.
   * @param {string} [type='image/png'] - The image MIME type.
   * @param {number} [quality] - Quality argument for image/jpeg or image/webp (0‑1).
   * @returns {string}
   */
  toDataURL(type = 'image/png', quality) {
    if (!this.canvas) return '';
    return this.canvas.toDataURL(type, quality);
  }
}

// Expose the class globally for other modules/tools.
window.CanvasManager = CanvasManager;

// ---------------------------------------------------------------------------
// Tool enumeration and global state management for the drawing application.
// ---------------------------------------------------------------------------
/**
 * Enum-like object representing the available drawing tools.
 * @readonly
 */
const Tool = {
  FREEHAND: 'FREEHAND',
  LINE: 'LINE',
  RECTANGLE: 'RECTANGLE',
  ELLIPSE: 'ELLIPSE',
  ERASER: 'ERASER'
};

/**
 * Global state object that stores the currently selected tool and drawing options.
 */
const toolState = {
  /** @type {string} */
  currentTool: Tool.FREEHAND,
  /** @type {string} */
  strokeColor: '#000000',
  /** @type {string} */
  fillColor: '#000000',
  /** @type {number} */
  brushSize: 5
};

/**
 * Set the active drawing tool.
 * @param {string} tool - One of the values from {@link Tool}.
 */
function setTool(tool) {
  if (Object.values(Tool).includes(tool)) {
    toolState.currentTool = tool;
  } else {
    console.warn(`setTool: Unknown tool "${tool}". Keeping current tool ${toolState.currentTool}.`);
  }
}

/**
 * Set the stroke (outline) colour.
 * @param {string} color - CSS colour string (e.g., "#ff0000" or "rgb(255,0,0)").
 */
function setStrokeColor(color) {
  toolState.strokeColor = color;
}

/**
 * Set the fill colour for shapes.
 * @param {string} color - CSS colour string.
 */
function setFillColor(color) {
  toolState.fillColor = color;
}

/**
 * Set the brush size (stroke width) in CSS pixels.
 * @param {number} size - Positive number representing the brush thickness.
 */
function setBrushSize(size) {
  const parsed = Number(size);
  if (!isNaN(parsed) && parsed > 0) {
    toolState.brushSize = parsed;
  } else {
    console.warn(`setBrushSize: Invalid size "${size}". Brush size must be a positive number.`);
  }
}

// Expose the enumeration, state, and helper functions globally so UI code can access them.
window.Tool = Tool;
window.toolState = toolState;
window.setTool = setTool;
window.setStrokeColor = setStrokeColor;
window.setFillColor = setFillColor;
window.setBrushSize = setBrushSize;
