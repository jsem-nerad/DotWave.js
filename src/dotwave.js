/**
 * DotWave.js - Interactive Dots Canvas Library
 * Creates animated dots that react to cursor movement
 * @version 1.1.0
 */
(function(global) {
    'use strict';
    
    /**
     * DotWave constructor
     * @param {Object} options - Configuration options
     */
    function DotWave(options) {
        // Default configuration
        this.defaults = {
            container: 'body',           // Container selector or DOM element
            numDots: 400,                // Number of dots
            dotColor: 'white',           // Dot color (CSS color)
            backgroundColor: 'black',    // Background color
            dotMinSize: 1,               // Minimum dot size
            dotMaxSize: 3,               // Maximum dot size
            dotMinOpacity: 0.5,          // Minimum dot opacity
            dotMaxOpacity: 1,            // Maximum dot opacity
            influenceRadius: 100,        // Mouse influence radius
            influenceStrength: 0.5,      // Mouse influence strength
            randomFactor: 0.05,          // Random movement factor
            friction: 0.97,              // Movement friction
            maxSpeed: 3,                 // Maximum dot speed
            reactive: true,              // Toggle for cursor reactivity
            zIndex: -1,                  // Canvas z-index
            mouseSpeedDecay: 0.85,       // How quickly mouse speed decays
            maxMouseSpeed: 15,           // Maximum mouse speed to prevent jumps
            dotStretch: true,            // Enable dot stretching based on velocity
            dotStretchMult: 10,          // How much to stretch the dots
            dotMaxStretch: 20,           // Maximum stretch amount
            rotSmoothing: false,         // Toggle for rotation smoothing of dots
            rotSmoothingIntensity: 150   // Rotation smoothing duration in milliseconds
        };
        
        // Merge options with defaults
        this.options = this._mergeOptions(this.defaults, options || {});
        
        // Initialize properties
        this.canvas = null;
        this.ctx = null;
        this.container = null;
        this.dots = [];
        this.width = 0;
        this.height = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.mouseSpeedX = 0;
        this.mouseSpeedY = 0;
        this.animationFrame = null;
        this.resizeTimeout = null;
        this.lastFrameTime = 0;
        this.isMouseOver = false;
        
        // Initialize the canvas
        this.init();
    }
    
    /**
     * Initialize the DotWave instance
     */
    DotWave.prototype.init = function() {
        // Get container element
        this.container = this._getContainer(this.options.container);
        if (!this.container) {
            console.error('DotWave: Container element not found');
            return;
        }
        
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas styles
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = this.options.zIndex;
        this.canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
        
        // Add canvas to container
        this._setupContainer();
        this.container.appendChild(this.canvas);
        
        // Set initial canvas size
        this._updateCanvasSize();
        
        // Create dots
        this._createDots();
        
        // Add event listeners
        this._addEventListeners();
        
        // Start animation
        this.lastFrameTime = performance.now();
        this._animate();
    };
    
    /**
     * Set up the container element for the canvas
     */
    DotWave.prototype._setupContainer = function() {
        // Only modify position if it's static
        const containerStyle = window.getComputedStyle(this.container);
        if (containerStyle.position === 'static') {
            this.container.style.position = 'relative';
        }
        
        // Set background color if specified and container is body
        if (this.options.backgroundColor && this.container === document.body) {
            document.body.style.backgroundColor = this.options.backgroundColor;
        }
    };
    
    /**
     * Get container DOM element from selector or element
     * @param {String|Element} container - Container selector or DOM element
     * @return {Element} The container element
     */
    DotWave.prototype._getContainer = function(container) {
        if (typeof container === 'string') {
            return document.querySelector(container);
        } else if (container instanceof Element) {
            return container;
        } else if (container === document.body) {
            return document.body;
        }
        return null;
    };
    
    /**
     * Merge default options with user options
     * @param {Object} defaults - Default options
     * @param {Object} options - User options
     * @return {Object} Merged options
     */
    DotWave.prototype._mergeOptions = function(defaults, options) {
        const merged = {};
        for (const key in defaults) {
            merged[key] = options[key] !== undefined ? options[key] : defaults[key];
        }
        return merged;
    };
    
    /**
     * Update canvas size to match container
     */
    DotWave.prototype._updateCanvasSize = function() {
        const rect = this.container.getBoundingClientRect();
        const newWidth = rect.width;
        const newHeight = rect.height;
        
        // Store old dimensions for dot repositioning
        const oldWidth = this.width || newWidth;
        const oldHeight = this.height || newHeight;
        
        this.width = newWidth;
        this.height = newHeight;
        
        // Set canvas size (with device pixel ratio for retina displays)
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Redistribute existing dots proportionally to new canvas size
        if (this.dots && this.dots.length > 0 && (oldWidth !== newWidth || oldHeight !== newHeight)) {
            const scaleX = newWidth / oldWidth;
            const scaleY = newHeight / oldHeight;
            
            for (let i = 0; i < this.dots.length; i++) {
                const dot = this.dots[i];
                
                // Scale dot position proportionally
                dot.x *= scaleX;
                dot.y *= scaleY;
                
                // Handle dots that were in the offscreen buffer area
                // Clamp them to the new canvas bounds with buffer
                if (dot.x < -50) dot.x = -50;
                if (dot.x > newWidth + 50) dot.x = newWidth + 50;
                if (dot.y < -50) dot.y = -50;
                if (dot.y > newHeight + 50) dot.y = newHeight + 50;
            }
        }
        
        // Center mouse position initially
        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
    };
    
    /**
     * Create dots with random properties
     */
    DotWave.prototype._createDots = function() {
        this.dots = [];
        
        for (let i = 0; i < this.options.numDots; i++) {
            // z represents depth (0 = far, 1 = close)
            const z = Math.random();
            
            const dot = {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: z, // Depth value
                radius: this.options.dotMinSize + z * (this.options.dotMaxSize - this.options.dotMinSize),
                alpha: this.options.dotMinOpacity + z * (this.options.dotMaxOpacity - this.options.dotMinOpacity),
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                // Deeper dots move slower to create parallax effect
                speedMultiplier: 0.3 + z * 0.7
            };
            
            // Only add rotation properties if stretching is enabled
            if (this.options.dotStretch) {
                if (this.options.rotSmoothing) {
                    // Smooth rotation: track current and target angles
                    dot.currentAngle = 0;
                    dot.targetAngle = 0;
                } else {
                    // Instant rotation: only need current angle
                    dot.currentAngle = 0;
                }
            }
            
            this.dots.push(dot);
        }
    };
    
    /**
     * Add event listeners for mouse movement and window resize
     */
    DotWave.prototype._addEventListeners = function() {
        // Mouse movement listeners
        this.container.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this.container.addEventListener('mouseenter', this._handleMouseEnter.bind(this));
        this.container.addEventListener('mouseleave', this._handleMouseLeave.bind(this));
        
        // Window resize
        window.addEventListener('resize', this._handleResize.bind(this));
    };
    
    /**
     * Handle mouse movement
     * @param {Event} e - Mouse event
     */
    DotWave.prototype._handleMouseMove = function(e) {
        if (!this.isMouseOver) return;
        
        const rect = this.container.getBoundingClientRect();
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        
        // Calculate raw mouse speed
        const rawSpeedX = this.mouseX - this.prevMouseX;
        const rawSpeedY = this.mouseY - this.prevMouseY;
        
        // Limit maximum mouse speed to prevent jumps
        const rawSpeed = Math.sqrt(rawSpeedX * rawSpeedX + rawSpeedY * rawSpeedY);
        if (rawSpeed > this.options.maxMouseSpeed) {
            const scale = this.options.maxMouseSpeed / rawSpeed;
            this.mouseSpeedX = rawSpeedX * scale;
            this.mouseSpeedY = rawSpeedY * scale;
        } else {
            this.mouseSpeedX = rawSpeedX;
            this.mouseSpeedY = rawSpeedY;
        }
    };
    
    /**
     * Handle mouse enter
     */
    DotWave.prototype._handleMouseEnter = function() {
        this.isMouseOver = true;
    };
    
    /**
     * Handle mouse leave
     */
    DotWave.prototype._handleMouseLeave = function() {
        this.isMouseOver = false;
        // Gradually reduce mouse speed when leaving
        this.mouseSpeedX *= 0.5;
        this.mouseSpeedY *= 0.5;
    };
    
    /**
     * Handle window resize with debounce
     */
    DotWave.prototype._handleResize = function() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this._updateCanvasSize();
        }, 250);
    };
    
    /**
     * Smooth angle interpolation with proper wrapping
     * @param {Number} current - Current angle
     * @param {Number} target - Target angle
     * @param {Number} factor - Interpolation factor (0-1)
     * @return {Number} New interpolated angle
     */
    DotWave.prototype._lerpAngle = function(current, target, factor) {
        // Calculate the shortest angular distance
        let diff = target - current;
        
        // Wrap the difference to [-π, π]
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        
        // Interpolate and wrap result
        let result = current + diff * factor;
        
        // Keep angle in [0, 2π] range
        while (result < 0) result += 2 * Math.PI;
        while (result >= 2 * Math.PI) result -= 2 * Math.PI;
        
        return result;
    };
    
    /**
     * Draw a dot (stretched or regular based on options and velocity)
     * @param {Object} dot - The dot object
     * @param {Number} deltaTime - Time elapsed since last frame
     */
    DotWave.prototype._drawDot = function(dot, deltaTime) {
        const fillStyle = this._getRGBA(this.options.dotColor, dot.alpha);
        
        // Early exit for regular dots when stretching is disabled
        if (!this.options.dotStretch) {
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = fillStyle;
            this.ctx.fill();
            return;
        }
        
        // Only calculate stretching-related values when stretching is enabled
        const vxSq = dot.vx * dot.vx;
        const vySq = dot.vy * dot.vy;
        const speed = Math.sqrt(vxSq + vySq);
        
        // Calculate stretch amount proportional to speed
        const normalizedSpeed = Math.min(speed / this.options.maxSpeed, 1);
        let stretchAmount = normalizedSpeed * this.options.dotStretchMult;
        
        // Apply maximum stretch limit if defined
        if (this.options.dotMaxStretch) {
            stretchAmount = Math.min(stretchAmount, this.options.dotMaxStretch);
        }
        
        // If there's no significant stretch, draw regular circle
        if (stretchAmount < 0.01) {
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = fillStyle;
            this.ctx.fill();
            return;
        }
        
        // Calculate target angle based on velocity
        const targetAngle = Math.atan2(dot.vy, dot.vx);
        
        // Handle rotation based on rotSmoothing setting
        if (this.options.rotSmoothing) {
            // Smooth rotation: interpolate towards target
            dot.targetAngle = targetAngle;
            
            // Calculate rotation lerp factor based on deltaTime and rotSmoothingIntensity
            const rotationFactor = this.options.rotSmoothingIntensity <= 0 ? 
                1 : Math.min(deltaTime / this.options.rotSmoothingIntensity, 1);
            
            // Smoothly interpolate current angle towards target
            dot.currentAngle = this._lerpAngle(dot.currentAngle, dot.targetAngle, rotationFactor);
        } else {
            // Instant rotation: directly set angle
            dot.currentAngle = targetAngle;
        }
        
        // Calculate ellipse dimensions
        const radiusX = dot.radius + stretchAmount;
        const radiusY = dot.radius;
        
        // Save context state
        this.ctx.save();
        
        // Translate to dot position and rotate
        this.ctx.translate(dot.x, dot.y);
        this.ctx.rotate(dot.currentAngle);
        
        // Draw stretched ellipse
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = fillStyle;
        this.ctx.fill();
        
        // Restore context state
        this.ctx.restore();
    };
    
    /**
     * Animation loop
     */
    DotWave.prototype._animate = function() {
        this.animationFrame = requestAnimationFrame(this._animate.bind(this));
        
        const currentTime = performance.now();
        const deltaTimeMs = Math.min(currentTime - this.lastFrameTime, 32); // Cap at ~30fps minimum
        const deltaTime = deltaTimeMs / 10; // Normalize to 100fps for frame-rate independence
        this.lastFrameTime = currentTime;
        
        // Only process mouse speed decay if reactive mode is enabled
        if (this.options.reactive) {
            // Decay mouse speed over time for smoother interaction
            this.mouseSpeedX *= Math.pow(this.options.mouseSpeedDecay, deltaTime);
            this.mouseSpeedY *= Math.pow(this.options.mouseSpeedDecay, deltaTime);
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Fill canvas with background color
        if (this.options.backgroundColor !== 'transparent') {
            this.ctx.fillStyle = this.options.backgroundColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
        
        // Pre-calculate common values for performance
        const randomFactor = this.options.randomFactor;
        const friction = Math.pow(this.options.friction, deltaTime); // Frame-rate independent friction
        const maxSpeed = this.options.maxSpeed;
        const maxSpeedSq = maxSpeed * maxSpeed;
        
        // Pre-calculate mouse influence values only if reactive mode is enabled
        let influenceRadius, influenceRadiusSq, normalizedInfluenceStrength;
        if (this.options.reactive) {
            influenceRadius = this.options.influenceRadius;
            influenceRadiusSq = influenceRadius * influenceRadius; // Avoid sqrt in distance check
            normalizedInfluenceStrength = this.options.influenceStrength;
        }
        
        // Update and draw dots
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];
            
            // Apply mouse influence only if reactive mode is enabled and mouse is over the container
            if (this.options.reactive && this.isMouseOver) {
                // Calculate distance to mouse (using squared distance to avoid sqrt)
                const dx = this.mouseX - dot.x;
                const dy = this.mouseY - dot.y;
                const distanceSq = dx * dx + dy * dy;
                
                // Apply mouse influence if dot is within range
                if (distanceSq < influenceRadiusSq) {
                    // Stronger effect when closer (calculate actual distance only when needed)
                    const distance = Math.sqrt(distanceSq);
                    const influence = (1 - distance / influenceRadius) * dot.z;
                    
                    // Apply mouse speed influence
                    dot.vx += this.mouseSpeedX * influence * normalizedInfluenceStrength * deltaTime;
                    dot.vy += this.mouseSpeedY * influence * normalizedInfluenceStrength * deltaTime;
                }
            }
            
            // Add some randomness to movement (frame-rate independent)
            dot.vx += (Math.random() - 0.5) * randomFactor * deltaTime;
            dot.vy += (Math.random() - 0.5) * randomFactor * deltaTime;
            
            // Apply friction to prevent excessive speed (frame-rate independent)
            dot.vx *= friction;
            dot.vy *= friction;
            
            // Limit maximum speed (using squared values for performance)
            const speedSq = dot.vx * dot.vx + dot.vy * dot.vy;
            if (speedSq > maxSpeedSq) {
                const scale = maxSpeed / Math.sqrt(speedSq);
                dot.vx *= scale;
                dot.vy *= scale;
            }
            
            // Update position based on velocity and depth (frame-rate independent)
            dot.x += dot.vx * dot.speedMultiplier * deltaTime;
            dot.y += dot.vy * dot.speedMultiplier * deltaTime;
            
            // Wrap around edges (with a buffer to prevent popping)
            if (dot.x < -50) dot.x = this.width + 50;
            if (dot.x > this.width + 50) dot.x = -50;
            if (dot.y < -50) dot.y = this.height + 50;
            if (dot.y > this.height + 50) dot.y = -50;
            
            // Draw dot
            this._drawDot(dot, deltaTimeMs);
        }
    };
    
    /**
     * Convert color to RGBA format
     * @param {String} color - CSS color
     * @param {Number} alpha - Alpha value
     * @return {String} RGBA color string
     */
    DotWave.prototype._getRGBA = function(color, alpha) {
        // If already RGBA format
        if (color.startsWith('rgba')) {
            return color;
        }
        
        // If RGB format
        if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        
        // For hex colors
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            const r = parseInt(hex.length === 3 ? hex.charAt(0) + hex.charAt(0) : hex.substring(0, 2), 16);
            const g = parseInt(hex.length === 3 ? hex.charAt(1) + hex.charAt(1) : hex.substring(2, 4), 16);
            const b = parseInt(hex.length === 3 ? hex.charAt(2) + hex.charAt(2) : hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        
        // For named colors, use a predefined map
        const namedColors = {
            'white': 'rgba(255, 255, 255, ' + alpha + ')',
            'black': 'rgba(0, 0, 0, ' + alpha + ')',
            'red': 'rgba(255, 0, 0, ' + alpha + ')',
            'green': 'rgba(0, 128, 0, ' + alpha + ')',
            'blue': 'rgba(0, 0, 255, ' + alpha + ')',
            // Add more named colors as needed
        };
        
        return namedColors[color.toLowerCase()] || `rgba(255, 255, 255, ${alpha})`;
    };
    
    /**
     * Destroy the DotWave instance
     */
    DotWave.prototype.destroy = function() {
        // Stop animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Remove event listeners
        this.container.removeEventListener('mousemove', this._handleMouseMove);
        this.container.removeEventListener('mouseenter', this._handleMouseEnter);
        this.container.removeEventListener('mouseleave', this._handleMouseLeave);
        window.removeEventListener('resize', this._handleResize);
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Clear properties
        this.canvas = null;
        this.ctx = null;
        this.dots = [];
    };
    
    /**
     * Update options
     * @param {Object} options - New options
     */
    DotWave.prototype.updateOptions = function(options) {
        this.options = this._mergeOptions(this.options, options || {});
        
        // Recreate dots if number changed, stretching was toggled, or rotation settings changed
        if (options.numDots !== undefined || 
            options.dotStretch !== undefined || 
            options.rotSmoothing !== undefined) {
            this._createDots();
        }
    };
    
    /**
     * Pause animation
     */
    DotWave.prototype.pause = function() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    };
    
    /**
     * Resume animation
     */
    DotWave.prototype.resume = function() {
        if (!this.animationFrame) {
            this.lastFrameTime = performance.now();
            this._animate();
        }
    };
    
    // Expose DotWave to global scope
    global.DotWave = DotWave;
    
})(typeof window !== 'undefined' ? window : this);