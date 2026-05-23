require('./mock-browser.js');
const assert = require('assert');

// Load DotWave
require('../src/dotwave.js');
const DotWave = global.window.DotWave;

try {
    // Test default configuration
    let dw = new DotWave();

    assert.strictEqual(dw.options.numDots, 400, 'Default numDots should be 400');
    assert.strictEqual(dw.options.dotColor, 'white', 'Default dotColor should be white');
    assert.strictEqual(dw.options.backgroundColor, 'black', 'Default backgroundColor should be black');
    assert.strictEqual(dw.options.dotMinSize, 1, 'Default dotMinSize should be 1');
    assert.strictEqual(dw.options.dotMaxSize, 3, 'Default dotMaxSize should be 3');

    // Add tests for other important defaults that we could miss if we update them later
    assert.strictEqual(dw.options.dotMinOpacity, 0.5, 'Default dotMinOpacity should be 0.5');
    assert.strictEqual(dw.options.dotMaxOpacity, 1, 'Default dotMaxOpacity should be 1');
    assert.strictEqual(dw.options.influenceRadius, 100, 'Default influenceRadius should be 100');
    assert.strictEqual(dw.options.influenceStrength, 0.5, 'Default influenceStrength should be 0.5');
    assert.strictEqual(dw.options.randomFactor, 0.05, 'Default randomFactor should be 0.05');
    assert.strictEqual(dw.options.friction, 0.97, 'Default friction should be 0.97');
    assert.strictEqual(dw.options.maxSpeed, 3, 'Default maxSpeed should be 3');
    assert.strictEqual(dw.options.reactive, true, 'Default reactive should be true');
    assert.strictEqual(dw.options.zIndex, -1, 'Default zIndex should be -1');

    dw.destroy();

    // Test option overriding
    const customOptions = {
        numDots: 100,
        dotColor: 'red',
        backgroundColor: 'blue',
        dotMinSize: 2,
        dotMaxSize: 5
    };

    dw = new DotWave(customOptions);

    assert.strictEqual(dw.options.numDots, 100, 'numDots should be overridden');
    assert.strictEqual(dw.options.dotColor, 'red', 'dotColor should be overridden');
    assert.strictEqual(dw.options.backgroundColor, 'blue', 'backgroundColor should be overridden');
    assert.strictEqual(dw.options.dotMinSize, 2, 'dotMinSize should be overridden');
    assert.strictEqual(dw.options.dotMaxSize, 5, 'dotMaxSize should be overridden');

    dw.destroy();

    console.log('All tests passed!');
} catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
}
