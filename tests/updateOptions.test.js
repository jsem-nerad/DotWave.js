require('./mock-browser.js');

const assert = require('assert');
// In node environment, the IIFE attaches DotWave to 'global' if window is not defined.
// Wait, our mock defines global.window, so it attaches to window.
const DotWave = global.window.DotWave;

function runTests() {
    console.log('Running tests for DotWave.prototype.updateOptions...');
    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        try {
            fn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (error) {
            console.error(`❌ ${name}`);
            console.error(error);
            failed++;
        }
    }

    // Basic instance creation
    const dotwave = new DotWave();

    test('updateOptions should merge simple options', () => {
        dotwave.updateOptions({ dotColor: 'red', numDots: 100 });
        assert.strictEqual(dotwave.options.dotColor, 'red');
        assert.strictEqual(dotwave.options.numDots, 100);
        // Original default shouldn't change if not specified
        assert.strictEqual(dotwave.options.backgroundColor, 'black');
    });

    test('updateOptions should recreate dots when numDots changes', () => {
        let called = false;
        dotwave._createDots = () => { called = true; };
        dotwave.updateOptions({ numDots: 200 });
        assert.strictEqual(called, true);
    });

    test('updateOptions should recreate dots when dotStretch changes', () => {
        let called = false;
        dotwave._createDots = () => { called = true; };
        dotwave.updateOptions({ dotStretch: false });
        assert.strictEqual(called, true);
    });

    test('updateOptions should recreate dots when rotSmoothing changes', () => {
        let called = false;
        dotwave._createDots = () => { called = true; };
        dotwave.updateOptions({ rotSmoothing: true });
        assert.strictEqual(called, true);
    });

    test('updateOptions should not recreate dots for other property changes', () => {
        let called = false;
        dotwave._createDots = () => { called = true; };
        dotwave.updateOptions({ dotColor: 'blue', friction: 0.8 });
        assert.strictEqual(called, false);
    });

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests();
