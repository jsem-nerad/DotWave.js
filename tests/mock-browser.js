global.window = {
    addEventListener: () => {},
    removeEventListener: () => {}
};
global.document = {
    createElement: () => ({
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
        style: {}
    }),
    querySelector: () => ({
        appendChild: () => {},
        getBoundingClientRect: () => ({ width: 800, height: 600 }),
        addEventListener: () => {},
        removeEventListener: () => {},
        style: {}
    }),
    body: {
        appendChild: () => {},
        getBoundingClientRect: () => ({ width: 800, height: 600 }),
        addEventListener: () => {},
        removeEventListener: () => {},
        style: {}
    }
};
global.Element = class {};
global.window.devicePixelRatio = 1;
global.performance = { now: () => Date.now() };
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};
global.window.getComputedStyle = () => ({ position: 'static' });
