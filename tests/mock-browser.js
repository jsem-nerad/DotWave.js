// Basic browser mock for testing
global.requestAnimationFrame = (cb) => { /* do not run loop */ return 1; };
global.cancelAnimationFrame = (id) => {};

global.window = {
    devicePixelRatio: 1,
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: global.requestAnimationFrame,
    cancelAnimationFrame: global.cancelAnimationFrame,
    performance: { now: () => Date.now() },
    getComputedStyle: () => ({ position: 'static' })
};

class MockElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.style = {};
        this.children = [];
        this.parentNode = null;
    }
    appendChild(child) {
        this.children.push(child);
        child.parentNode = this;
    }
    removeChild(child) {
        this.children = this.children.filter(c => c !== child);
        child.parentNode = null;
    }
    getBoundingClientRect() {
        return { width: 800, height: 600, top: 0, left: 0 };
    }
    getContext() {
        return {
            scale: () => {},
            clearRect: () => {},
            beginPath: () => {},
            arc: () => {},
            fill: () => {},
            save: () => {},
            translate: () => {},
            rotate: () => {},
            ellipse: () => {},
            restore: () => {},
            fillRect: () => {}
        };
    }
    addEventListener() {}
    removeEventListener() {}
}

global.document = {
    createElement: (tagName) => new MockElement(tagName),
    querySelector: (selector) => {
        if (selector === 'body') return new MockElement('body');
        return new MockElement('div');
    },
    body: new MockElement('body')
};

// Mock performance.now
global.performance = { now: () => Date.now() };

// Mock HTMLCanvasElement
global.HTMLCanvasElement = MockElement;

// Require the actual source file
require('../src/dotwave.js');

module.exports = { window: global.window, document: global.document };
