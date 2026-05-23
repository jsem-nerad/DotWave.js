// Basic browser mock
global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({ position: 'static' }),
    devicePixelRatio: 1,
    performance: { now: () => 0 },
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: clearTimeout
};

const mockElement = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0 }),
    appendChild: () => {},
    removeChild: () => {},
    style: {}
};

global.document = {
    querySelector: () => mockElement,
    createElement: () => ({
        ...mockElement,
        getContext: () => ({
            scale: () => {},
            clearRect: () => {},
            fillRect: () => {},
            beginPath: () => {},
            arc: () => {},
            fill: () => {},
            translate: () => {},
            rotate: () => {},
            ellipse: () => {},
            save: () => {},
            restore: () => {}
        }),
        parentNode: {
            removeChild: () => {}
        }
    }),
    body: {
        ...mockElement
    }
};

global.Element = class Element {};
global.performance = global.window.performance;
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;
