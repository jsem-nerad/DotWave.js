/**
 * DotWave Custom Element
 * Wraps the DotWave.js library as a custom HTML element
 */
class DotWaveElement extends HTMLElement {
  constructor() {
    super();
    this.dotwave = null;
    this.isInitialized = false;
  }

  // Define which attributes to observe for changes
  static get observedAttributes() {
    return [
      'num-dots', 'dot-color', 'background-color', 'dot-min-size', 'dot-max-size',
      'dot-min-opacity', 'dot-max-opacity', 'influence-radius', 'influence-strength',
      'random-factor', 'friction', 'max-speed', 'reactive', 'z-index',
      'mouse-speed-decay', 'max-mouse-speed', 'dot-stretch', 'dot-stretch-mult',
      'dot-max-stretch', 'rot-smoothing', 'rot-smoothing-intensity'
    ];
  }

  // Called when the element is added to the DOM
  connectedCallback() {
    // Wait for next tick to ensure the element is properly attached
    setTimeout(() => {
      this.initializeDotWave();
    }, 0);
  }

  // Called when observed attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isInitialized && this.dotwave) {
      this.updateDotWaveOptions();
    }
  }

  // Called when element is removed from DOM
  disconnectedCallback() {
    if (this.dotwave) {
      this.dotwave.destroy();
      this.dotwave = null;
      this.isInitialized = false;
    }
  }

  // Convert HTML attributes to DotWave options
  getOptionsFromAttributes() {
    const options = {};
    
    // Map HTML attributes to DotWave options
    const attributeMap = {
      'num-dots': { prop: 'numDots', type: 'number', default: 400 },
      'dot-color': { prop: 'dotColor', type: 'string', default: 'white' },
      'background-color': { prop: 'backgroundColor', type: 'string', default: 'black' },
      'dot-min-size': { prop: 'dotMinSize', type: 'number', default: 1 },
      'dot-maxs-ize': { prop: 'dotMaxSize', type: 'number', default: 3 },
      'dot-min-opacity': { prop: 'dotMinOpacity', type: 'number', default: 0.5 },
      'dot-max-opacity': { prop: 'dotMaxOpacity', type: 'number', default: 1 },
      'influence-radius': { prop: 'influenceRadius', type: 'number', default: 100 },
      'influence-strength': { prop: 'influenceStrength', type: 'number', default: 0.5 },
      'random-factor': { prop: 'randomFactor', type: 'number', default: 0.05 },
      'friction': { prop: 'friction', type: 'number', default: 0.97 },
      'max-speed': { prop: 'maxSpeed', type: 'number', default: 3 },
      'reactive': { prop: 'reactive', type: 'boolean', default: true },
      'z-index': { prop: 'zIndex', type: 'number', default: -1 },
      'mouse-speed-decay': { prop: 'mouseSpeedDecay', type: 'number', default: 0.85 },
      'max-mouse-speed': { prop: 'maxMouseSpeed', type: 'number', default: 15 },
      'dot-stretch': { prop: 'dotStretch', type: 'boolean', default: true },
      'dot-stretch-mult': { prop: 'dotStretchMult', type: 'number', default: 10 },
      'dot-max-stretch': { prop: 'dotMaxStretch', type: 'number', default: 20 },
      'rot-smoothing': { prop: 'rotSmoothing', type: 'boolean', default: false },
      'rot-smoothing-intensity': { prop: 'rotSmoothingIntensity', type: 'number', default: 150 }
    };

    // Process each attribute
    for (const [htmlAttr, config] of Object.entries(attributeMap)) {
      if (this.hasAttribute(htmlAttr)) {
        const value = this.getAttribute(htmlAttr);
        
        // Convert string values to appropriate types
        if (config.type === 'boolean') {
          // Boolean attributes: presence means true, "false" means false
          options[config.prop] = value !== 'false' && value !== null;
        } else if (config.type === 'number') {
          const numValue = parseFloat(value);
          options[config.prop] = isNaN(numValue) ? config.default : numValue;
        } else {
          // String values
          options[config.prop] = value || config.default;
        }
      }
    }

    // Set the container to this element
    options.container = this;
    
    return options;
  }

  initializeDotWave() {
    if (this.isInitialized) return;

    // Ensure DotWave is available
    if (typeof DotWave === 'undefined') {
      console.error('DotWave library is not loaded. Please include dotwave.js before the custom element.');
      return;
    }

    const options = this.getOptionsFromAttributes();
    
    // Set up element styling
    this.setupElementStyles();

    // Create DotWave instance
    try {
      this.dotwave = new DotWave(options);
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing DotWave:', error);
    }
  }

  setupElementStyles() {
    // Ensure the element has proper dimensions and positioning
    const computedStyle = window.getComputedStyle(this);
    
    // Set display to block if not specified
    if (computedStyle.display === 'inline') {
      this.style.display = 'block';
    }

    // Set position to relative if static
    if (computedStyle.position === 'static') {
      this.style.position = 'relative';
    }

    // Set default dimensions if not specified
    if (!this.style.width && computedStyle.width === '0px') {
      this.style.width = '100%';
    }
    
    if (!this.style.height && computedStyle.height === '0px') {
      this.style.height = '400px';
    }

    // Ensure overflow is hidden for clean appearance
    if (!this.style.overflow) {
      this.style.overflow = 'hidden';
    }
  }

  updateDotWaveOptions() {
    if (!this.dotwave) return;
    
    const options = this.getOptionsFromAttributes();
    // Remove container from update options since it shouldn't change
    delete options.container;
    
    this.dotwave.updateOptions(options);
  }

  // Property getters and setters for JavaScript API compatibility
  get numDots() {
    return this.hasAttribute('num-dots') ? parseInt(this.getAttribute('num-dots')) : 400;
  }

  set numDots(value) {
    if (value !== null && value !== undefined) {
      this.setAttribute('num-dots', value.toString());
    } else {
      this.removeAttribute('num-dots');
    }
  }

  get dotColor() {
    return this.getAttribute('dot-color') || 'white';
  }

  set dotColor(value) {
    if (value) {
      this.setAttribute('dot-color', value);
    } else {
      this.removeAttribute('dot-color');
    }
  }

  get backgroundColor() {
    return this.getAttribute('background-color') || 'black';
  }

  set backgroundColor(value) {
    if (value) {
      this.setAttribute('background-color', value);
    } else {
      this.removeAttribute('background-color');
    }
  }

  get reactive() {
    return this.hasAttribute('reactive') ? this.getAttribute('reactive') !== 'false' : true;
  }

  set reactive(value) {
    if (value) {
      this.setAttribute('reactive', 'true');
    } else {
      this.setAttribute('reactive', 'false');
    }
  }

  // Methods to control the DotWave instance
  pause() {
    if (this.dotwave) {
      this.dotwave.pause();
    }
  }

  resume() {
    if (this.dotwave) {
      this.dotwave.resume();
    }
  }

  destroy() {
    if (this.dotwave) {
      this.dotwave.destroy();
      this.dotwave = null;
      this.isInitialized = false;
    }
  }

  // Get access to the underlying DotWave instance
  getDotWaveInstance() {
    return this.dotwave;
  }
}

// Register the custom element
customElements.define('dot-wave', DotWaveElement);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DotWaveElement;
}
